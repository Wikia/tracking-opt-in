import { CmpApi } from '@iabtcf/cmpapi';
import { GVL, TCModel, TCString } from '@iabtcf/core';
import { default as installCMPStub } from '@iabtcf/stub';

import { getCookieDomain, getJSON } from '../shared/utils';
import Cookies from "js-cookie";
import { Promise } from "es6-promise";

export const CMP_VERSION = 2; // Increment to force modal again
const CMP_ID = 141;
const VENDOR_LIST_FORMAT = 'v2';
const CMP_DEFAULT_LANGUAGE = 'en';
const VENDOR_CONSENT_COOKIE_NAME = 'euconsent-v2';
const MAX_STANDARD_PURPOSE_ID = 24;
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

class ConsentManagementProvider {
    loaded = null;
    mounted = false;

    static installStub() {
        installCMPStub();
    }

    constructor(options) {
        this.options = Object.assign(getDefaultOptions(), options);

        // Install temporary stub until full CMP will be ready
        if (window.__tcfapi === undefined) {
            this.installStub();
        }
    }

    configure(options) {
        Object.assign(this.options, options);
    }

    fetchVendorList() {
        const vendorListUrlBase = `https://vendorlist.consensu.org/${VENDOR_LIST_FORMAT}/`;
        const vendorListFileName = 'vendor-list.json';

        // ToDo: resolve proxy problem
        //GVL.baseUrl = vendorListUrlBase;
        //GVL.latestFilename = vendorListFileName;

        // ToDo: Fix CORS error:
        // ToDo: "No 'Access-Control-Allow-Origin' header is present on the requested resource."
        // return getJSON(`${vendorListUrlBase}${vendorListFileName}`);
        return Promise.resolve(require('../assets/vendor-list'));
    }

    installStub(...args) {
        return ConsentManagementProvider.installStub(...args);
    }

    install() {
        this.cmpApi = new CmpApi(CMP_ID, CMP_VERSION);

        const { gdprApplies } = this.options;

        if (gdprApplies && !this.vendorList) {
            this.loaded = this.fetchVendorList()
                .then((vendorListContent) => {
                    this.vendorList = vendorListContent;
                });
        }
    }

    uninstall() {
        this.options = getDefaultOptions();
        this.setVendorConsentCookie(null);
        delete window.__tcfapi;
    }

    unmount() {
        this.setVendorConsentCookie(null);
        delete window.__tcfapi;

        this.install();

        this.mounted = false;
    }

    communicateWithApi(event) {
        switch (event) {
            case 'ui-visible':
                this.cmpApi.uiVisible = true;
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
console.log(gdprApplies);
        if (!gdprApplies) {
            this.cmpApi.tcModel = null;

            return Promise.resolve();
        }

        return this.loaded.then(() => {
            this.tcModel = this.createConsent(this.getVendorConsentCookie(), this.vendorList);
console.log('here');
            if (!this.hasUserConsent()) {
                this.setVendorConsentCookie(TCString.encode(this.tcModel));
            }

            // Set the TCModel - must be a valid TCModel
            this.cmpApi.tcModel = this.tcModel;
            this.mounted = true;
        });
    }

    createConsent(consentString, vendorList) {
        if (consentString) {
            return TCString.decode(consentString);
        }

        const { allowedPurposes, allowedVendors, consentScreen, language } = this.options;

        // Create a TCModel
        const gvList = new GVL(vendorList);
        const tcModel = new TCModel(gvList);

        // Modify TCModel - set values on tcModel
        tcModel.cmpId = CMP_ID;
        tcModel.cmpVersion = CMP_VERSION;
        tcModel.consentScreen = Number(consentScreen) || 0;
        tcModel.consentLanguage = String(language).toLowerCase() || CMP_DEFAULT_LANGUAGE;
        tcModel.purposeConsents.set(Array.isArray(allowedPurposes) ? allowedPurposes : []);
        tcModel.vendorConsents.set(Array.isArray(allowedVendors) ? allowedVendors : []);

        return tcModel;
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
