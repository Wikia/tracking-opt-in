import Cookies from 'js-cookie';

import { CmpApi } from '@iabtcf/cmpapi';
import { GVL, TCModel, TCString, VendorList } from '@iabtcf/core';
import { default as installCMPStub } from '@iabtcf/stub';

import { debug, getCookieDomain, getJSON } from '../shared/utils';
import { CMP_ID } from "../shared/consts";

// In TACO-290, we have bumped CMP_VERSION to 8.
// Next time when reconsent is necessary set CMP_VERSION to 9 to cover all geos.
export const CMP_VERSION = 7; // Increment to force modal again
export const API_STATUS = {
    UI_VISIBLE_NEW: 'ui-visible-new',
    UI_VISIBLE_RESET: 'ui-visible-reset',
    DISABLED: 'disable',
};
const CMP_DEFAULT_LANGUAGE = 'en';
const DEPRECATED_VENDOR_CONSENT_COOKIE_NAME = 'euconsent-v2';
const VENDOR_CONSENT_COOKIE_NAME = 'eupubconsent-v2';
const PROVIDER_CONSENT_COOKIE_NAME = 'addtl_consent';
const VENDOR_LIST_URL_BASE = 'https://script.wikia.nocookie.net/fandom-ae-assets/tcf/v2.2/';
const VENDOR_LIST_FILE_NAME = 'vendor-list.json';
const VENDOR_LIST_VERSION_NAME = 'archives/vendor-list-v[VERSION].json';
const BLOCKED_INTERESTS = [1,3,4,5,6];
const ALLOWED_PUBLISHER_LEGITIMATE_INTERESTS = [2, 7, 8, 9, 10, 11];

const getDefaultCookieAttributes = () => ({
    domain: getCookieDomain(window.location.hostname),
    expires: 390 // thirteen 30-day months
});
const getDefaultOptions = () => ({
    allowedVendors: null,
    allowedVendorPurposes: null,
    allowedSpecialFeatures: null,
    cookieAttributes: getDefaultCookieAttributes(),
    gdprApplies: false,
    language: CMP_DEFAULT_LANGUAGE,
});

class ConsentManagementProvider {
    /** @type Promise<VendorList> */
    loaded = null;
    mounted = false;
    /** @type VendorList */
    vendorList = undefined;

    static installStub() {
        installCMPStub();

        debug('GDPR', 'Stub installed');
    }

    /**
     * @returns Promise<VendorList>
     */
    static fetchVendorList() {
        return getJSON(`${VENDOR_LIST_URL_BASE}${VENDOR_LIST_FILE_NAME}`);
    }

    constructor(options) {
        this.options = Object.assign(getDefaultOptions(), options);

        debug('GDPR', 'Constructed with params', options);

        GVL.baseUrl = VENDOR_LIST_URL_BASE;
        GVL.latestFilename = VENDOR_LIST_FILE_NAME;
        GVL.versionedFilename = VENDOR_LIST_VERSION_NAME;

        // Install temporary stub until full CMP will be ready
        if (typeof window.__tcfapi === 'undefined') {
            this.installStub();
        }
    }

    configure(options) {
        Object.assign(this.options, options);

        debug('GDPR', 'Configured with params', options);
    }

    installStub() {
        return ConsentManagementProvider.installStub();
    }

    initialize() {
        const addtlConsentMiddleware = (next, tcData, status) => {
            if (tcData && typeof tcData !== 'boolean') {
                tcData.addtlConsent = this.acString;
            }

            next(tcData, status);
        };

        this.cmpApi = new CmpApi(CMP_ID, CMP_VERSION, true, {
            'getTCData': addtlConsentMiddleware,
            'getInAppTCData': addtlConsentMiddleware,
            'isGalactusAllowed': (callback) => {
                window.__tcfapi('addEventListener', 2, (tcData, success) => {
                    if (!['tcloaded', 'useractioncomplete'].includes(tcData.eventStatus)) {
                        return;
                    }

                    if (success) {
                        callback(!!(tcData && tcData.vendor && tcData.vendor.consents && tcData.vendor.consents[756]));
                    } else {
                        callback(false);
                    }

                    window.__tcfapi('removeEventListener', 2, () => {}, tcData.listenerId);
                });
            }
        });

        debug('GDPR', 'Initialized with version', CMP_VERSION);

        const { gdprApplies } = this.options;

        if (gdprApplies && !this.vendorList) {
            debug('GDPR', 'Applies - fetching vendor list');
            this.loadVendorList();
        }
    }

    /**
     * @returns Promise<VendorList>
     */
    loadVendorList() {
        if (this.loaded) {
            return this.loaded;
        }

        this.loaded = ConsentManagementProvider.fetchVendorList()
            .then((vendorList) => {
                this.vendorList = vendorList;

                debug('GDPR', 'Vendor list fetched and saved', vendorList);

                return this.vendorList
            });

        return this.loaded;
    }


    uninstall() {
        debug('GDPR', 'Uninstalled');

        this.options = getDefaultOptions();
        this.setProviderConsentCookie(null);
        this.setVendorConsentCookie(null);
        delete window.__tcfapi;
    }

    unmount() {
        debug('GDPR', 'Unmounted');

        this.setProviderConsentCookie(null);
        this.setVendorConsentCookie(null);
        delete window.__tcfapi;

        this.initialize();

        this.mounted = false;
    }

    updateApi(event) {
        switch (event) {
            case API_STATUS.UI_VISIBLE_NEW:
                const [, tcfString] = this.createConsent();
                this.cmpApi.update(tcfString, true);
                debug('GDPR', 'UI displayed for the first time');
                break;

            case API_STATUS.UI_VISIBLE_RESET:
                this.cmpApi.update(this.getDeprecatedVendorConsentCookie() || '', true);
                debug('GDPR', 'UI displayed after policy change');
                break;

            case API_STATUS.DISABLED:
                this.cmpApi.disable();
                debug('GDPR', 'Unable to perform the operations in compliance with the TCF');
                break;

            default:
                break;
        }
    }

    install() {
        if (this.mounted) {
            this.unmount();
        }

        const { gdprApplies } = this.options;

        if (!gdprApplies) {
            this.cmpApi.update(null);

            debug('GDPR', 'Does not apply');

            return Promise.resolve();
        }

        return this.loaded.then(() => {
            const consentStrings = this.createConsent();

            this.acString = consentStrings[0];
            this.tcString = consentStrings[1];

            if (!this.hasUserConsent()) {
                debug('GDPR', 'Cookie not found - saving');

                this.setProviderConsentCookie(this.acString);
                this.setVendorConsentCookie(this.tcString);
            }

            this.cmpApi.update(this.tcString, false);
            this.mounted = true;
        });
    }

    getLegitimateInterests(allowedVendorPurposes) {
        return Array.isArray(allowedVendorPurposes) ? allowedVendorPurposes.filter(purpose => !BLOCKED_INTERESTS.includes(purpose)) : [];
    }

    createConsent() {
        let acString = this.getProviderConsentCookie();
        let tcString = this.getDeprecatedVendorConsentCookie();

        if (acString && tcString) {
            debug('GDPR', 'ACString and TCString read from cookie', acString, tcString, TCString.decode(tcString));

            return [acString, tcString];
        }

        const gvList = new GVL(this.vendorList);
        const tcModel = new TCModel(gvList);
        const { allowedVendorPurposes, allowedSpecialFeatures, allowedVendors, allowedProviders = [], consentScreen, language } = this.options;

        tcModel.cmpId = CMP_ID;
        tcModel.cmpVersion = CMP_VERSION;
        tcModel.consentScreen = Number(consentScreen) || 0;
        tcModel.consentLanguage = String(language).toLowerCase() || CMP_DEFAULT_LANGUAGE;
        tcModel.isServiceSpecific = true;
        tcModel.publisherCountryCode = 'US';
        tcModel.purposeConsents.set(Array.isArray(allowedVendorPurposes) ? allowedVendorPurposes : []);
        tcModel.specialFeatureOptins.set(Array.isArray(allowedSpecialFeatures) ? allowedSpecialFeatures : []);
        tcModel.vendorConsents.set(Array.isArray(allowedVendors) ? allowedVendors : []);
        tcModel.publisherLegitimateInterests.set(ALLOWED_PUBLISHER_LEGITIMATE_INTERESTS);
        // ToDo: proper implementation of Right to Object
        tcModel.purposeLegitimateInterests.set(this.getLegitimateInterests(allowedVendorPurposes));
        tcModel.vendorLegitimateInterests.set(Array.isArray(allowedVendors) ? allowedVendors : []);

        debug('GDPR', 'Consent saved with vendors: ', allowedVendors, ' and purposes', allowedVendorPurposes, ' and special feature options', allowedSpecialFeatures, ' and providers', allowedProviders);

        acString = `1~${allowedProviders.join('.')}`;
        tcString = TCString.encode(tcModel);

        debug('GDPR', 'Consent strings created', acString, tcString);

        return [acString, tcString];
    }

    getDeprecatedVendorConsentCookie() {
        return Cookies.get(DEPRECATED_VENDOR_CONSENT_COOKIE_NAME) || '';
    }

    getVendorConsentCookie() {
        return Cookies.get(VENDOR_CONSENT_COOKIE_NAME) || '';
    }

    getProviderConsentCookie() {
        return Cookies.get(PROVIDER_CONSENT_COOKIE_NAME) || '';
    }

    setVendorConsentCookie(consentString) {
        const cookieAttributes = this.options.cookieAttributes;

        if (consentString) {
            Cookies.set(DEPRECATED_VENDOR_CONSENT_COOKIE_NAME, consentString, cookieAttributes);
        } else {
            Cookies.remove(DEPRECATED_VENDOR_CONSENT_COOKIE_NAME, cookieAttributes);
        }
    }

    setProviderConsentCookie(consentString) {
        const cookieAttributes = this.options.cookieAttributes;

        if (consentString) {
            Cookies.set(PROVIDER_CONSENT_COOKIE_NAME, consentString, cookieAttributes);
        } else {
            Cookies.remove(PROVIDER_CONSENT_COOKIE_NAME, cookieAttributes);
        }
    }

    hasUserConsent() {
        return this.options.oneTrustEnabled ?
            !!this.getVendorConsentCookie() :
            !!this.getDeprecatedVendorConsentCookie() && !!this.getProviderConsentCookie();
    }

    /**
     * Checks if the user is withdrawing their consent by query parameter
     * @returns boolean
     */
    isWithdrawingConsent() {
        // ToDo: upgrade Node version and replace with .? + unify window.location access
        return window &&
            window.location &&
            window.location.pathname.includes('privacy-policy') &&
            window.location.search &&
            window.location.search.includes('withdrawConsent=true');
    }

    /**
     * @returns boolean
     */
    isVendorTCFPolicyVersionOutdated() {
        const cookie = this.getDeprecatedVendorConsentCookie();

        if (!cookie) {
            return false;
        }

        const consent = TCString.decode(cookie);

        return consent.policyVersion !== this.vendorList.tcfPolicyVersion;
    }
}

export default ConsentManagementProvider;
