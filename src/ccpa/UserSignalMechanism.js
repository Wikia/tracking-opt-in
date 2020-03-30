import Cookies from 'js-cookie';
import { Promise } from 'es6-promise';
import { getCookieDomain } from '../shared/utils';

const PRIVACY_STRING_COOKIE_NAME = 'usprivacy';
const LOG_GROUP = 'CCPA:';
const USP_VALUES = {
    yes: 'Y',
    no: 'N',
    na: '-',
};

export const USP_VERSION = 1;

const getDefaultCookieAttributes = () => ({
    domain: getCookieDomain(window.location.hostname),
    expires: 365 // 1 year
});
const getDefaultOptions = () => ({
    cookieAttributes: getDefaultCookieAttributes(),
    ccpaApplies: false,
});
const getUSPValue = (value) => {
    if (value === undefined) {
        return USP_VALUES.na;
    }

    return value ? USP_VALUES.yes : USP_VALUES.no;
};

function isValidCharacter(char) {
    return char === USP_VALUES.yes || char === USP_VALUES.no || char === USP_VALUES.na;
}

class UserSignalMechanism {
    static installStub() {
        const queue = [];

        console.log(LOG_GROUP, 'Installing API stub');

        window.__uspapi = (commandName, version, callback = console.log) => {
            if (commandName === 'ping') {
                callback({
                    uspapiLoaded: false
                }, true);
            } else if (commandName === 'getQueue') {
                callback(queue, true);
            } else {
                queue.push([commandName, version, callback]);
            }
        };

        UserSignalMechanism.addLocatorFrame();
    }

    static addLocatorFrame() {
        const name = '__uspapi';

        if (window.frames[name]) {
            return;
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => UserSignalMechanism.addLocatorFrame());
            return;
        }

        const iframe = document.createElement('iframe');

        iframe.name = name;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        window.addEventListener('message', (event) => {
            let call = null;

            try {
                const data = (typeof event.data === 'string') ? JSON.parse(event.data) : event.data;
                call = data.__uspapiCall;
            } catch (error) {
                void(error);
            }

            if (call) {
                window.__uspapi(call.command, call.version, function (returnValue, success) {
                    const returnMsg = {
                        __uspapiReturn: {
                            returnValue,
                            success,
                            callId: call.callId
                        }
                    };
                    event.source.postMessage(returnMsg, '*');
                });
            }
        }, false);
    }

    constructor(options) {
        this.options = Object.assign(getDefaultOptions(), options);
        this.uspapiCommands = [
            this.ping,
            this.getUSPData,
            this.showConsentTool,
        ];
        this.explicit_notice = USP_VALUES.yes;
        this.lspa_support = USP_VALUES.no;
        this.opt_out_sale = USP_VALUES.no;

        if (window.__uspapi === undefined) {
            this.installStub();
        }

        console.log(LOG_GROUP, 'User Signal Mechanism initialized');
    }

    configure(options) {
        Object.assign(this.options, options);
    }

    install() {
        this.createUserSignal();
        this.mount();

        console.log(LOG_GROUP, 'User Signal Mechanism installed');
    }

    installStub(...args) {
        return UserSignalMechanism.installStub(...args);
    }

    uninstall() {
        this.options = getDefaultOptions();
        this.setPrivacyStringCookie(null);
        delete window.__uspapi;
    }

    mount() {
        const uspapi = this.uspapi.bind(this);

        try {
            window.__uspapi('getQueue', null, (queue) => {
                window.__uspapi = uspapi;
                queue.forEach((args) => uspapi(...args));
            });
        } catch (error) {
            void(error);
            window.__uspapi = uspapi;
            console.error(new Error(`${LOG_GROUP} Incompatible stub - cannot run queue`));
        }
    }

    isUspapiCommand(commandName) {
        return this.uspapiCommands.indexOf(this[commandName]) !== -1;
    }

    uspapi(commandName, parameter, callback = console.log) {
        if (this.isUspapiCommand(commandName)) {
            this[commandName](parameter)
                .then((result) => callback(result, true))
                .catch((reason) => {
                    callback(null, false);
                    console.error((reason instanceof Error) ? reason : new Error(reason));
                });
        } else {
            callback(null, false);
            throw new Error(`${LOG_GROUP} Command does not exist`);
        }
    }

    createUserSignal() {
        let privacyString = null;

        if (!this.options.ccpaApplies) {
            console.log(LOG_GROUP, 'Geo does not require API');

            privacyString = this.createPrivacyString(getUSPValue());
        } else {
            console.log(LOG_GROUP, 'Geo requires API');

            const queryStringOverride =
                window &&
                window.location &&
                window.location.search &&
                window.location.search.includes('optOutSale=true');

            if (queryStringOverride) {
                privacyString = this.createPrivacyString(getUSPValue(true));

                console.log(LOG_GROUP, `Privacy String updated via URL parameter: ${privacyString}`);
            } else if (this.options.isSubjectToCoppa) {
                privacyString = this.createPrivacyString(USP_VALUES.yes);
                console.log(LOG_GROUP, 'Force opt-out because user is subject to COPPA.');
            } else if (this.hasUserSignal()) {
                const cookieOptOut = this.getPrivacyStringCookie().split('')[2];

                if (!isValidCharacter(cookieOptOut)) {
                    privacyString = this.createPrivacyString(getUSPValue(false));
                } else {
                    privacyString = this.createPrivacyString(cookieOptOut);
                }
            } else {
                privacyString = this.createPrivacyString(USP_VALUES.no);
            }

            console.log(LOG_GROUP, `Privacy String cookie: ${privacyString}`);

            this.setPrivacyStringCookie(privacyString);
        }

        this.userSignal = privacyString;
    }

    createPrivacyString(optOutSale) {
        if (optOutSale !== undefined) {
            if (optOutSale === USP_VALUES.na) {
                this.explicit_notice = USP_VALUES.na;
                this.lspa_support = USP_VALUES.na;
            }

            this.opt_out_sale = optOutSale;
        }

        return `${USP_VERSION}${this.explicit_notice}${this.opt_out_sale}${this.lspa_support}`;
    }


    hasUserSignal() {
        return !!this.getPrivacyStringCookie();
    }

    hasUserProvidedSignal() {
        if (!this.userSignal) {
            return undefined;
        }

        return this.opt_out_sale === getUSPValue(true);
    }

    geoRequiresUserSignal() {
        return this.options.ccpaApplies;
    }

    getPrivacyStringCookie() {
        return Cookies.get(PRIVACY_STRING_COOKIE_NAME) || '';
    }

    setPrivacyStringCookie(privacyString) {
        const cookieAttributes = this.options.cookieAttributes;

        if (privacyString) {
            Cookies.set(PRIVACY_STRING_COOKIE_NAME, privacyString, cookieAttributes);
        } else {
            Cookies.remove(PRIVACY_STRING_COOKIE_NAME, cookieAttributes);
        }
    }

    ping(version) {
        const ccpaApplies = this.options.ccpaApplies;

        return new Promise((resolve) => resolve({
            ccpaApplies,
            uspapiVersion: version || USP_VERSION,
            uspapiLoaded: true,
        }));
    }

    getUSPData(version) {
        const uspString = this.userSignal;
        const isCorrectVersion =
            !this.options.ccpaApplies
            || !version
            || Number(version) === USP_VERSION;

        return new Promise((resolve, reject) => {
            if (isCorrectVersion) {
                resolve({
                    version: version || USP_VERSION,
                    uspString,
                });
            } else {
                reject(new Error(`${LOG_GROUP} Privacy String version mismatch`));
            }
        });
    }

    saveUserSignal(optOutSale) {
        const privacyString = createPrivacyString(optOutSale);

        console.log(LOG_GROUP, `Privacy String saved via console: ${privacyString}`);

        this.setPrivacyStringCookie(privacyString);
        this.userSignal = privacyString;
    }

    showConsentTool(value) {
        return new Promise((resolve) => {
            if (value !== undefined) {
                this.saveUserSignal(getUSPValue(value));
            } else {
                const optOut = confirm(
                    'CCPA prompt - please provide user signal:\n' +
                    '- [OK] = Opt Out Sale is YES\n' +
                    '- [Cancel] = Opt Out Sale is NO'
                );

                this.saveUserSignal(getUSPValue(optOut));
            }

            resolve();
        });
    }
}

export default UserSignalMechanism;
