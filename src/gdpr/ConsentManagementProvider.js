import Cookies from 'js-cookie';
import { Promise } from 'es6-promise';

import { CmpApi } from '@iabtcf/cmpapi';
import { GVL, TCModel, TCString, VendorList } from '@iabtcf/core';
import { default as installCMPStub } from '@iabtcf/stub';

import { debug, getCookieDomain, getJSON } from '../shared/utils';

export const CMP_VERSION = 4; // Increment to force modal again
export const API_STATUS = {
    UI_VISIBLE_NEW: 'ui-visible-new',
    UI_VISIBLE_RESET: 'ui-visible-reset',
    DISABLED: 'disable',
};
const CMP_ID = 141;
const CMP_DEFAULT_LANGUAGE = 'en';
const VENDOR_CONSENT_COOKIE_NAME = 'euconsent-v2';
// const VENDOR_LIST_URL_BASE = 'https://www.fandom.com/cmp/';
// Temporary
const VENDOR_LIST_URL_BASE = 'https://static.wikia.nocookie.net/fandom-ae-assets/tracking-opt-in/v6.0.3/';
const VENDOR_LIST_FILE_NAME = 'vendor-list.json';
const VENDOR_LIST_VERSION_NAME = 'archives/vendor-list-v[VERSION].json';
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
        if (window.__tcfapi === undefined) {
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
        this.cmpApi = new CmpApi(CMP_ID, CMP_VERSION, true);

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
        this.setVendorConsentCookie(null);
        delete window.__tcfapi;
    }

    unmount() {
        debug('GDPR', 'Unmounted');

        this.setVendorConsentCookie(null);
        delete window.__tcfapi;

        this.initialize();

        this.mounted = false;
    }

    updateApi(event) {
        switch (event) {
            case API_STATUS.UI_VISIBLE_NEW:
                this.cmpApi.update('', true);
                debug('GDPR', 'UI displayed for the first time');
                break;

            case API_STATUS.UI_VISIBLE_RESET:
                this.cmpApi.update(this.getVendorConsentCookie() || '', true);
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
            this.tcString = this.createConsent();

            if (!this.hasUserConsent()) {
                debug('GDPR', 'Cookie not found - saving');

                this.setVendorConsentCookie(this.tcString);
            }

            this.cmpApi.update(this.tcString, false);
            this.mounted = true;
        });
    }

    createConsent() {
        let tcString = this.getVendorConsentCookie();

        if (tcString) {
            debug('GDPR', 'TCString read from cookie', tcString, TCString.decode(tcString));

            return tcString;
        }

        const gvList = new GVL(this.vendorList);
        const tcModel = new TCModel(gvList);
        const { allowedVendorPurposes, allowedSpecialFeatures, allowedVendors, consentScreen, language } = this.options;

        tcModel.cmpId = CMP_ID;
        tcModel.cmpVersion = CMP_VERSION;
        tcModel.consentScreen = Number(consentScreen) || 0;
        tcModel.consentLanguage = String(language).toLowerCase() || CMP_DEFAULT_LANGUAGE;
        tcModel.isServiceSpecific = true;
        tcModel.purposeConsents.set(Array.isArray(allowedVendorPurposes) ? allowedVendorPurposes : []);
        tcModel.specialFeatureOptins.set(Array.isArray(allowedSpecialFeatures) ? allowedSpecialFeatures : []);
        tcModel.vendorConsents.set(Array.isArray(allowedVendors) ? allowedVendors : []);
        // ToDo: proper implementation of Right to Object
        tcModel.purposeLegitimateInterests.set(Array.isArray(allowedVendorPurposes) ? allowedVendorPurposes : []);
        tcModel.vendorLegitimateInterests.set(Array.isArray(allowedVendors) ? allowedVendors : []);
        // ToDo: figure out the proper value
        // tcModel.publisherCountryCode();

        debug('GDPR', 'Consent saved with vendors: ', allowedVendors, ' and purposes', allowedVendorPurposes, ' and special feature options', allowedSpecialFeatures);

        tcString = TCString.encode(tcModel);

        debug('GDPR', 'Consent string created', tcString);

        return tcString;
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

    hasUserConsent() {
        return !!this.getVendorConsentCookie();
    }

    /**
     * @returns boolean
     */
    isVendorTCFPolicyVersionOutdated() {
        const cookie = this.getVendorConsentCookie();

        if (!cookie) {
            return false;
        }

        const consent = TCString.decode(cookie);

        return consent.policyVersion !== this.vendorList.tcfPolicyVersion;
    }
}

export default ConsentManagementProvider;
