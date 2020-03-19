import { IAB_VENDORS } from './shared/consts';
import ContentManager from './shared/ContentManager';
import GeoManager from './shared/GeoManager';
import LanguageManager from './shared/LangManager';
import ConsentManagementProvider from './gdpr/ConsentManagementProvider';
import ConsentManagementProviderLegacy from './gdpr/ConsentManagementProviderLegacy';
import OptInManager from './gdpr/OptInManager';
import Tracker from './gdpr/Tracker';
import TrackingOptIn from './gdpr/TrackingOptIn';

import UserSignalMechanism from './ccpa/UserSignalMechanism';

export const DEFAULT_OPTIONS = {
    beaconCookieName: null,
    cookieName: null, // use default cookie name
    cookieExpiration: null, // use default
    cookieRejectExpiration: null,
    country: null, // country code
    countriesRequiringPrompt: null, // array of lower case country codes
    disableConsentQueue: false,
    enableCCPAinit: false,
    enabledVendorPurposes: [1, 2, 3, 4, 5], // array of IAB CMP purpose IDs
    enabledVendors: IAB_VENDORS, // array of IAB CMP vendor IDs
    language: null,
    queryParamName: null,
    preventScrollOn: 'body',
    track: true,
    zIndex: 1000,
    onAcceptTracking() {
        console.log('user opted in to tracking');
    },
    onRejectTracking() {
        console.log('user opted out of tracking');
    },
};

export const DEFAULT_CCPA_OPTIONS = {
    country: null, // country code
    region: null, // region code
    countriesRequiringPrompt: ['us-ca'], // array of lower case country codes
};

function initializeGDPR(options) {
    const {
        zIndex,
        onAcceptTracking,
        onRejectTracking,
        preventScrollOn,
        enabledVendorPurposes,
        enabledVendors,
        isCurse,
        ...depOptions
    } = Object.assign({}, DEFAULT_OPTIONS, options);
    const langManager = new LanguageManager(depOptions.language);
    const geoManager = new GeoManager(depOptions.country, depOptions.region, depOptions.countriesRequiringPrompt);
    const tracker = new Tracker(langManager.lang, geoManager.getDetectedGeo(), depOptions.beaconCookieName, depOptions.track);
    const disableConsentQueue = !!depOptions.disableConsentQueue;
    // ToDo: cleanup TCF v1.1
    const consentManagementProviderLegacy = new ConsentManagementProviderLegacy({
        disableConsentQueue,
        language: langManager.lang
    });
    const consentManagementProvider = new ConsentManagementProvider({
        disableConsentQueue,
        language: langManager.lang
    });

    const optInManager = new OptInManager(
        window.location.hostname,
        depOptions.cookieName,
        depOptions.cookieExpiration,
        depOptions.cookieRejectExpiration,
        depOptions.queryParamName
    );
    const contentManager = new ContentManager(langManager.lang);

    optInManager.setForcedStatusFromQueryParams(window.location.search);

    if (optInManager.checkCookieVersion()) {
        consentManagementProviderLegacy.setVendorConsentCookie(null);
    }

    const instance = new TrackingOptIn(
        tracker,
        optInManager,
        geoManager,
        contentManager,
        consentManagementProvider,
        consentManagementProviderLegacy,
        {
            preventScrollOn,
            zIndex,
            enabledVendorPurposes,
            enabledVendors,
            onAcceptTracking,
            onRejectTracking,
            disableConsentQueue,
            isCurse,
        },
        window.location,
    );
    instance.render();

    return instance;
}

function initializeCCPA(options) {
    const {
        test,
        ...depOptions
    } = Object.assign({}, DEFAULT_CCPA_OPTIONS, options);

    if (!depOptions.enableCCPAinit) {
        return null;
    }

    const geoManager = new GeoManager(depOptions.country, depOptions.region, depOptions.countriesRequiringPrompt);
    const userSignalMechanism = new UserSignalMechanism({
        ccpaApplies: geoManager.needsUserSignal(),
    });

    userSignalMechanism.install();

    return userSignalMechanism;
}

export default function main(options) {
    return {
        gdpr: initializeGDPR(options),
        ccpa: initializeCCPA(options),
    };
}
