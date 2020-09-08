import { IAB_VENDORS, addNonIABVendors } from './shared/consts';
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
    // ToDo: unused in new modal
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

    GeoManager.fetchInstantConfig().then(() => {
        // ToDo: get rid of it, move Google's id to consts.js
        if (geoManager.isGoogleMoved()) {
            enabledVendors.push(
                755, // Google Advertising Products
            );

            instance.configure({
                preventScrollOn,
                zIndex,
                enabledVendorPurposes,
                enabledVendors,
                onAcceptTracking,
                onRejectTracking,
                disableConsentQueue,
                isCurse,
            });
        } else {
            addNonIABVendors([
                {
                    name: 'DBM',
                    policyUrl: 'https://policies.google.com/privacy',
                },
                {
                    name: 'DCM',
                    policyUrl: 'https://policies.google.com/privacy',
                },
                {
                    name: 'DFP (Google)',
                    policyUrl: 'https://policies.google.com/privacy?hl=en',
                },
                {
                    name: 'DV360',
                    policyUrl: 'https://policies.google.com/privacy',
                },
                {
                    name: 'Firebase',
                    policyUrl: 'https://policies.google.com/privacy?hl=en',
                },
                {
                    name: 'Google Ads IMA SDK',
                    policyUrl: 'https://policies.google.com/privacy',
                },
                {
                    name: 'Google Mobile Ads SDK for iOS',
                    policyUrl: 'https://policies.google.com/privacy',
                },
                {
                    name: 'Google Play Services',
                    policyUrl: 'https://policies.google.com/privacy',
                },
            ]);
        }

        instance.render();
    });

    return instance;
}

function initializeCCPA(options) {
    const {
        test,
        ...depOptions
    } = Object.assign({}, DEFAULT_CCPA_OPTIONS, options);

    const geoManager = new GeoManager(depOptions.country, depOptions.region, depOptions.countriesRequiringPrompt);
    const userSignalMechanism = new UserSignalMechanism({
        ccpaApplies: geoManager.needsUserSignal(),
        isSubjectToCcpa: options.isSubjectToCoppa === undefined ? options.isSubjectToCcpa : options.isSubjectToCoppa,
    });

    userSignalMechanism.install();

    return userSignalMechanism;
}

export default function main(options) {
    return {
        icbm: GeoManager.fetchInstantConfig(),
        gdpr: initializeGDPR(options),
        ccpa: initializeCCPA(options),
    };
}
