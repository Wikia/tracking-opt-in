import Cookies from 'js-cookie';
import { Promise } from 'es6-promise';
import { getCookieDomain } from '../shared/utils';

export const USP_VERSION = 1;
const PRIVACY_STRING_COOKIE_NAME = 'usprivacy';
const USP_VALUES = {
    yes: 'Y',
    no: 'N',
    na: '-',
};

const getDefaultCookieAttributes = () => ({
    domain: getCookieDomain(window.location.hostname),
    expires: 365 // 1 year
});
const getDefaultOptions = () => ({
    cookieAttributes: getDefaultCookieAttributes(),
    ccpaApplies: false,
});

function createPrivacyString(explicitNotice = USP_VALUES.na, optOutSale = USP_VALUES.na) {
    return `${USP_VERSION}${explicitNotice}${optOutSale}`;
}

class UserSignalMechanism {
    mounted = false;

    static installStub() {
        const queue = [];

        console.log('CCPA: installing API stub');

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
    }

    constructor(options) {
        this.options = Object.assign(getDefaultOptions(), options);
        this.uspapiCommands = [
            this.ping,
            this.getUSPData,
        ];

        if (window.__uspapi === undefined) {
            this.installStub();
        }

        console.log('CCPA: User Signal Mechanism initialized');
    }

    install() {
        if (this.mounted) {
            this.unmount();
        }

        this.createUserSignal();
        this.mount();

        console.log('CCPA: User Signal Mechanism installed');
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
            console.error(new Error('incompatible stub, cannot run queue'));
        }

        this.mounted = true;
    }

    unmount() {
        this.setPrivacyStringCookie(null);
        delete window.__uspapi;
        this.mounted = false;
    }

    isUspapiCommand(commandName) {
        return this.uspapiCommands.indexOf(this[commandName]) !== -1;
    }

    uspapi(commandName, version, callback = console.log) {
        if (this.isUspapiCommand(commandName)) {
            this[commandName](version)
                .then((result) => callback(result, true))
                .catch((reason) => {
                    callback(null, false);
                    console.error((reason instanceof Error) ? reason : new Error(reason));
                });
        } else {
            callback(null, false);
            throw new Error('command does not exist');
        }
    }

    createUserSignal() {
        let privacyString = null;

        if (!this.options.ccpaApplies) {
            console.log('CCPA: geo does not require API');

            privacyString = createPrivacyString();
        } else {
            console.log('CCPA: geo requires API');

            if (this.hasUserSignal()) {
                privacyString = this.getPrivacyStringCookie();
            } else {
                privacyString = createPrivacyString(USP_VALUES.no, USP_VALUES.no);
            }

            console.log('CCPA: Privacy String cookie created');

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

        const signalSplit = this.userSignal.split('');

        return signalSplit[1] === USP_VALUES.yes || signalSplit[2] === USP_VALUES.yes;
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
                reject(new Error('consent string version mismatch'));
            }
        });
    }
}

export default UserSignalMechanism;
