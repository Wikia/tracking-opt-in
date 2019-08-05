import { ConsentString } from 'consent-string';
import { Promise } from 'es6-promise';
import Cookies from 'js-cookie';
import { getCookieDomain, getJSON } from './utils';

export const CMP_VERSION = 3; // Increment to force modal again
const CMP_ID = 141;
const CMP_DEFAULT_LANGUAGE = 'en';
const VENDOR_CONSENT_COOKIE_NAME = 'euconsent';
const PUBLISHER_CONSENT_COOKIE_NAME = 'eupubconsent';
const MAX_STANDARD_PURPOSE_ID = 24;
const getDefaultCookieAttributes = () => ({
    domain: getCookieDomain(window.location.hostname),
    expires: 365 // 1 year
});
const getDefaultOptions = () => ({
    allowedPublisherPurposes: null,
    allowedVendorPurposes: null,
    allowedVendors: null,
    cookieAttributes: getDefaultCookieAttributes(),
    gdprApplies: false,
    gdprAppliesGlobally: false,
    hasGlobalScope: false,
    language: CMP_DEFAULT_LANGUAGE,
    vendorList: null
});

function createConsent(consentString, vendorList, options = {}) {
    if (consentString && !vendorList) {
        return new ConsentString(consentString);
    }

    const {allowedPurposes, allowedVendors, consentScreen, language} = options;
    const consent = new ConsentString();

    consent.setCmpId(CMP_ID);
    consent.setCmpVersion(CMP_VERSION);
    consent.setConsentScreen(Number(consentScreen) || 0);
    consent.setConsentLanguage(String(language).toLowerCase() || CMP_DEFAULT_LANGUAGE);
    consent.setGlobalVendorList(vendorList);
    consent.setPurposesAllowed(Array.isArray(allowedPurposes) ? allowedPurposes : []);
    consent.setVendorsAllowed(Array.isArray(allowedVendors) ? allowedVendors : []);

    return consent;
}

function createIdArray(start, end) {
    const length = end - start + 1;

    return Array.from({length}).map((value, i) => i + start);
}

function toAllowedMap(array, predicate = () => false) {
    const map = {};

    if (Array.isArray(array)) {
        array.forEach((id) => {
            map[Number(id)] = !!predicate(id);
        });
    }

    return map;
}

class ConsentManagementProvider {
    static installStub(gdprAppliesGlobally = false) {
        const queue = [];

        window.__cmp = (commandName, parameter, callback = console.log) => {
            if (commandName === 'ping') {
                callback({
                    gdprAppliesGlobally: !!gdprAppliesGlobally,
                    cmpLoaded: false
                }, true);
            } else if (commandName === 'getQueue') {
                callback(queue, true);
            } else {
                queue.push([commandName, parameter, callback]);
            }
        };

        ConsentManagementProvider.addLocatorFrame();
    }

    static addLocatorFrame() {
        const name = '__cmpLocator';

        if (window.frames[name]) {
            return;
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => ConsentManagementProvider.addLocatorFrame());
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
                call = data.__cmpCall;
            } catch (error) {
                void(error);
            }

            if (call) {
                window.__cmp(call.command, call.parameter, function (retValue, success) {
                    const returnMsg = {
                        __cmpReturn: {
                            returnValue: retValue,
                            success: success,
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
        this.vendorList = null;
        this.vendorConsent = null;
        this.cmpCommands = [
            this.getConsentData,
            this.getVendorConsents,
            this.getVendorList,
            this.ping
        ];

        if (window.__cmp === undefined) {
            this.installStub(!!this.options.gdprAppliesGlobally);
        }
    }

    configure(options) {
        Object.assign(this.options, options);
    }

    fetchVendorList(version) {
        return getJSON(`https://vendorlist.consensu.org/${version ? `v-${version}/` : ''}vendorlist.json`);
    }

    fetchPurposesList(language, version) {
        return getJSON(`https://vendorlist.consensu.org/${version ? `v-${version}/` : ''}purposes-${language}.json`);
    }

    getCommonCmpProperties() {
        const {gdprApplies, gdprAppliesGlobally, hasGlobalScope} = this.options;

        return {
            gdprApplies: !!gdprApplies || !!gdprAppliesGlobally,
            gdprAppliesGlobally: !!gdprAppliesGlobally,
            hasGlobalScope: !!hasGlobalScope
        };
    }

    getVendorConsentCookie() {
        return Cookies.get(VENDOR_CONSENT_COOKIE_NAME) || '';
    }

    setVendorConsentCookie(consentString) {
        const cookieAttributes = this.options.cookieAttributes;

        if (consentString) {
            Cookies.set(VENDOR_CONSENT_COOKIE_NAME, consentString, cookieAttributes);
        } else {
            Cookies.remove(VENDOR_CONSENT_COOKIE_NAME, cookieAttributes);
        }
    }

    getPublisherConsentCookie() {
        return Cookies.get(PUBLISHER_CONSENT_COOKIE_NAME) || '';
    }

    setPublisherConsentCookie(consentString) {
        const cookieAttributes = this.options.cookieAttributes;

        if (consentString) {
            Cookies.set(PUBLISHER_CONSENT_COOKIE_NAME, consentString, cookieAttributes);
        } else {
            Cookies.remove(PUBLISHER_CONSENT_COOKIE_NAME, cookieAttributes);
        }
    }

    hasUserConsent() {
        return !!this.getVendorConsentCookie();
    }

    createConsents() {
        const {gdprApplies} = this.getCommonCmpProperties();

        if (!gdprApplies) {
            return;
        }

        const {
            allowedVendorPurposes,
            allowedVendors,
            language,
            consentScreen
        } = this.options;

        this.vendorConsent = createConsent(
            this.getVendorConsentCookie(),
            this.vendorList,
            {
                allowedPurposes: allowedVendorPurposes,
                allowedVendors,
                language,
                consentScreen
            }
        );

        this.setVendorConsentCookie(this.getVendorConsentCookie() || this.vendorConsent.getConsentString());
    }

    isCmpCommand(commandName) {
        return this.cmpCommands.indexOf(this[commandName]) !== -1;
    }

    cmp(commandName, parameter, callback = console.log) {
        if (this.isCmpCommand(commandName)) {
            this[commandName](parameter)
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

    mount() {
        const cmp = this.cmp.bind(this);

        try {
            window.__cmp('getQueue', null, (queue) => {
                window.__cmp = cmp;
                queue.forEach((args) => cmp(...args));
            });
        } catch (error) {
            void(error);
            window.__cmp = cmp;
            console.error(new Error('incompatible stub, cannot run queue'));
        }
    }

    install() {
        const {vendorList} = this.options;
        const {gdprApplies} = this.getCommonCmpProperties();
        const vendorListVersion = isNaN(Number(vendorList)) ? null : Number(vendorList);
        const hasData = (this.hasUserConsent() || vendorList && !vendorListVersion);

        if (hasData || !gdprApplies) {
            this.vendorList = vendorList;
            this.createConsents();
            this.mount();
            return Promise.resolve();
        }

        return this.fetchVendorList(vendorListVersion)
            .then((vendorList) => {
                this.vendorList = vendorList;
                this.createConsents();
                this.mount();
            });
    }

    installStub(...args) {
        return ConsentManagementProvider.installStub(...args);
    }

    uninstall() {
        this.options = getDefaultOptions();
        this.setVendorConsentCookie(null);
        delete window.__cmp;
    }

    ping() {
        const {gdprAppliesGlobally} = this.getCommonCmpProperties();

        return new Promise((resolve) => resolve({
            gdprAppliesGlobally,
            cmpLoaded: true
        }));
    }

    getConsentData(version) {
        const {gdprApplies, hasGlobalScope} = this.getCommonCmpProperties();
        const isCorrectVersion = !gdprApplies || !version || Number(version) === this.vendorConsent.getVersion();

        return new Promise((resolve, reject) => {
            if (isCorrectVersion) {
                resolve({
                    consentData: gdprApplies ? this.getVendorConsentCookie() : null,
                    gdprApplies,
                    hasGlobalScope
                });
            } else {
                reject(new Error('consent string version mismatch'));
            }
        });
    }

    getVendorConsents(ids) {
        const {gdprApplies, hasGlobalScope} = this.getCommonCmpProperties();

        let vendorIds = [];
        let consents = {
            metadata: null,
            purposeConsents: {},
            vendorConsents: {}
        };

        if (this.vendorConsent) {
            const maxVendorId = this.vendorConsent.maxVendorId;
            const vendorList = this.vendorList;

            if (Array.isArray(ids)) {
                vendorIds = ids;
            } else {
                vendorIds = maxVendorId ? createIdArray(1, maxVendorId) : vendorList.vendors.map(({id}) => id);
            }

            consents = {
                metadata: this.vendorConsent.getMetadataString(),
                purposeConsents: toAllowedMap(
                    createIdArray(1, MAX_STANDARD_PURPOSE_ID), // get from user
                    (id) => this.vendorConsent.isPurposeAllowed(id)
                ),
                vendorConsents: toAllowedMap(
                    vendorIds, // get from user
                    (id) => this.vendorConsent.isVendorAllowed(id)
                )
            };
        }

        return new Promise((resolve) => resolve({
            gdprApplies,
            hasGlobalScope,
            ...consents
        }));
    }

    getVendorList(version) {
        return this.fetchVendorList(Number(version));
    }
}

export default ConsentManagementProvider;
