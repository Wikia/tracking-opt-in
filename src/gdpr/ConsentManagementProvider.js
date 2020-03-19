import { CmpApi } from '@iabtcf/cmpapi';
import { GVL, TCModel, TCString } from '@iabtcf/core';
import { default as installCMPStub } from '@iabtcf/stub';

import { getCookieDomain, getJSON } from '../shared/utils';

export const CMP_VERSION = 2; // Increment to force modal again
const CMP_ID = 141;
const VENDOR_LIST_FORMAT = 'v2';
const CMP_DEFAULT_LANGUAGE = 'en';
const VENDOR_CONSENT_COOKIE_NAME = 'euconsent-v2';
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
    disableConsentQueue: false,
    gdprApplies: false,
    gdprAppliesGlobally: false,
    hasGlobalScope: false,
    language: CMP_DEFAULT_LANGUAGE,
    vendorList: null
});

class ConsentManagementProvider {
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

        // ToDo: visible or not
        this.cmpApi.uiVisible = true;
    }

    run() {
        this.fetchVendorList()
            .then((vendorList) => {
                this.vendorList = vendorList;
                this.gvl = new GVL(vendorList);

                // Create a TCModel
                this.tcModel = new TCModel(this.gvl);

                // Modify TCModel - set values on tcModel
                // ToDo: fill all fields
                const { allowedPurposes, allowedVendors, consentScreen, language } = this.options;

                this.tcModel.cmpId = CMP_ID;
                this.tcModel.cmpVersion = CMP_VERSION;
                this.tcModel.consentScreen = Number(consentScreen) || 0;
                this.tcModel.consentLanguage = String(language).toLowerCase() || CMP_DEFAULT_LANGUAGE;
                this.tcModel.purposeConsents.set(Array.isArray(allowedPurposes) ? allowedPurposes : []);
                this.tcModel.vendorConsents.set(Array.isArray(allowedVendors) ? allowedVendors : []);

                const encodedString = TCString.encode(this.tcModel);
                console.log(encodedString); // TC string encoded begins with 'C'

                // Set the TCModel - must be a valid TCModel
                this.cmpApi.tcModel = this.tcModel;

                // Done
            });
    }
}

export default ConsentManagementProvider;
