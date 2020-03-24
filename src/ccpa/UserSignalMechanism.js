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
let EXPLICIT_NOTICE = USP_VALUES.yes;
let OPT_OUT_SALE = USP_VALUES.no;
let LSPA_SUPPORT = USP_VALUES.no;

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
const debug = (...args) => {
    const debugQueryParam = 'tracking-opt-in-debug';
    const isDebug = window.location.search.indexOf(`${debugQueryParam}=true`) !== -1;

    if (isDebug) {
        console.log('[DEBUG] CCPA: ', ...args);
    }
};

function createPrivacyString(optOutSale) {
    if (optOutSale !== undefined) {
        if (optOutSale === USP_VALUES.na) {
            EXPLICIT_NOTICE = USP_VALUES.na;
            LSPA_SUPPORT = USP_VALUES.na;
        }

        OPT_OUT_SALE = optOutSale;
    }

    return `${USP_VERSION}${EXPLICIT_NOTICE}${OPT_OUT_SALE}${LSPA_SUPPORT}`;
}

function isValidCharacter(char) {
    return char === USP_VALUES.yes || char === USP_VALUES.no || char === USP_VALUES.na;
}

class UserSignalMechanism {
    static installStub() {
        const queue = [];

        debug('Installing API stub');

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

        if (window.__uspapi === undefined) {
            this.installStub();
        }

        debug('User Signal Mechanism initialized');
    }

    configure(options) {
        Object.assign(this.options, options);
    }

    install() {
        this.createUserSignal();
        this.mount();

        debug('User Signal Mechanism installed');
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
            debug('Geo does not require API');

            privacyString = createPrivacyString(getUSPValue());
        } else {
            debug('Geo requires API');

            const queryStringOverride =
                window &&
                window.location &&
                window.location.search &&
                window.location.search.includes('optOutSale=true');

            if (queryStringOverride) {
                privacyString = createPrivacyString(getUSPValue(true));

                debug(`Privacy String updated via URL parameter: ${privacyString}`);
            } else if (this.hasUserSignal()) {
                const cookieOptOut = this.getPrivacyStringCookie().split('')[2];

                if (!isValidCharacter(cookieOptOut)) {
                    privacyString = createPrivacyString(getUSPValue(false));
                } else {
                    privacyString = createPrivacyString(cookieOptOut);
                }
            } else {
                privacyString = createPrivacyString(USP_VALUES.no);
            }

            debug(`Privacy String cookie: ${privacyString}`);

            this.setPrivacyStringCookie(privacyString);
        }

        this.userSignal = privacyString;
    }

    hasUserSignal() {
        return !!this.getPrivacyStringCookie();
    }

    hasUserProvidedSignal() {
        if (!this.userSignal) {
            return undefined;
        }

        return OPT_OUT_SALE === getUSPValue(true);
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

        debug(`Privacy String saved via console: ${privacyString}`);

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
