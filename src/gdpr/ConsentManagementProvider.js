import Cookies from 'js-cookie';
import { Promise } from 'es6-promise';

import { CmpApi } from '@iabtcf/cmpapi';
import { GVL, TCModel, TCString } from '@iabtcf/core';
import { default as installCMPStub } from '@iabtcf/stub';

import { getCookieDomain, getJSON } from '../shared/utils';

export const CMP_VERSION = 2; // Increment to force modal again
const CMP_ID = 141;
// ToDo: 756 now???
const CMP_DEFAULT_LANGUAGE = 'en';
const VENDOR_CONSENT_COOKIE_NAME = 'euconsent-v2';
const VENDOR_LIST_URL_BASE = 'https://www.fandom.com/cmp/';
const VENDOR_LIST_FILE_NAME = 'vendor-list.json';
const VENDOR_LIST_VERSION_NAME = 'archives/vendor-list-v[VERSION].json';
const getDefaultCookieAttributes = () => ({
    domain: getCookieDomain(window.location.hostname),
    expires: 390 // thirteen 30-day months
});
const getDefaultOptions = () => ({
    allowedVendors: null,
    allowedVendorPurposes: null,
    cookieAttributes: getDefaultCookieAttributes(),
    disableConsentQueue: false,
    gdprApplies: false,
    language: CMP_DEFAULT_LANGUAGE,
});
const debug = (...args) => {
    const debugQueryParam = 'tracking-opt-in-debug';
    const isDebug = window.location.search.indexOf(`${debugQueryParam}=true`) !== -1;

    if (isDebug) {
        console.log('[DEBUG] GDPR: ', ...args);
    }
};

class ConsentManagementProvider {
    loaded = null;
    mounted = false;

    static installStub() {
        installCMPStub();

        debug('Stub installed');
    }

    static fetchVendorList() {
        return getJSON(`${VENDOR_LIST_URL_BASE}${VENDOR_LIST_FILE_NAME}`);
    }

    constructor(options) {
        this.options = Object.assign(getDefaultOptions(), options);

        GVL.baseUrl = VENDOR_LIST_URL_BASE;
        GVL.latestFilename = VENDOR_LIST_FILE_NAME;
        GVL.versionedFilename = VENDOR_LIST_VERSION_NAME;

        // ToDo: uncomment
        // Install temporary stub until full CMP will be ready
        // if (window.__tcfapi === undefined) {
        //     this.installStub();
        // }
    }

    configure(options) {
        Object.assign(this.options, options);

        debug('Configured with params', options);
    }

    installStub(...args) {
        return ConsentManagementProvider.installStub(...args);
    }

    install() {
        this.cmpApi = new CmpApi(CMP_ID, CMP_VERSION);

        debug('Installed with version', CMP_VERSION);

        const { gdprApplies } = this.options;

        if (gdprApplies && !this.vendorList) {
            debug('Applies - fetching vendor list');

            this.loaded = ConsentManagementProvider.fetchVendorList()
                .then((vendorListContent) => {
                    this.vendorList = vendorListContent;

                    debug('Vendor list fetched and saved', vendorListContent);
                });
        }
    }

    uninstall() {
        debug('Uninstalled');

        this.options = getDefaultOptions();
        this.setVendorConsentCookie(null);
        delete window.__tcfapi;
    }

    unmount() {
        debug('Unmounted');

        this.setVendorConsentCookie(null);
        delete window.__tcfapi;

        this.install();

        this.mounted = false;
    }

    updateApi(event) {
        switch (event) {
            case 'ui-visible-new':
                this.cmpApi.update('', true);
                debug('UI displayed for the first time');
                break;

            case 'ui-visible-reset':
                this.cmpApi.update(this.getVendorConsentCookie() || '', true);
                debug('UI displayed after policy change');
                break;

            case 'disable':
                this.cmpApi.disable();
                debug('Unable to perform the operations in compliance with the TCF');
                break;

            default:
                break;
        }
    }

    run() {
        if (this.mounted) {
            this.unmount();
        }

        const { gdprApplies } = this.options;

        if (!gdprApplies) {
            this.cmpApi.update(null);

            debug('Not applies');

            return Promise.resolve();
        }

        return this.loaded.then(() => {
            this.tcString = this.createConsent();

            if (!this.hasUserConsent()) {
                debug('Cookie not found - saving');

                this.setVendorConsentCookie(this.tcString);
            }

            this.cmpApi.update(this.tcString, false);
            this.mounted = true;
        });
    }

    createConsent() {
        let tcString = this.getVendorConsentCookie();

        if (tcString) {
            debug('TCString read from cookie', tcString, TCString.decode(tcString));

            return tcString;
        }

        const gvList = new GVL(this.vendorList);
        const tcModel = new TCModel(gvList);
        const { allowedVendorPurposes, allowedVendors, consentScreen, language } = this.options;

        tcModel.cmpId = CMP_ID;
        tcModel.cmpVersion = CMP_VERSION;
        tcModel.consentScreen = Number(consentScreen) || 0;
        tcModel.consentLanguage = String(language).toLowerCase() || CMP_DEFAULT_LANGUAGE;
        tcModel.isServiceSpecific = true;
        tcModel.purposeConsents.set(Array.isArray(allowedVendorPurposes) ? allowedVendorPurposes : []);
        tcModel.vendorConsents.set(Array.isArray(allowedVendors) ? allowedVendors : []);

        debug('Consent saved with vendors: ', allowedVendors, ' and purposes', allowedVendorPurposes);

        tcString = TCString.encode(tcModel);

        debug('Consent string created', tcString);

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
}

export default ConsentManagementProvider;
