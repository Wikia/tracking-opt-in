import LanguageManager from "./LangManager";
import OptInManager from "./OptInManager";
import Tracker from "./Tracker";
import ContentManager from "./ContentManager";
import GeoManager from "./GeoManager";
import TrackingOptIn from './TrackingOptIn';
import ConsentManagementProvider from "./ConsentManagementProvider";
import { isParameterSet } from "./utils";

const DEFAULT_OPTIONS = {
    beaconCookieName: null,
    cookieName: null, // use default cookie name
    cookieExpiration: null, // use default
    cookieRejectExpiration: null,
    country: null, // country code
    countriesRequiringPrompt: null, // array of lower case country codes
    enabledVendorPurposes: [1, 2, 3, 4, 5], // array of IAB CMP purpose IDs
    enabledVendors: [ // array of IAB CMP vendor IDs
        50,  // Adform A/S
        264, // Adobe Advertising Cloud
        66,  // adsquare GmbH
        32,  // AppNexus Inc.
        315, // Celtra, Inc.
        77,  // comScore, Inc.
        85,  // Crimtan Holdings Limited
        298, // Cuebiq Inc.
        71,  // Dataxu, Inc.
        126, // DoubleVerify Inc.
        120, // Eyeota Ptd Ltd
        78,  // Flashtalking, Inc.
        98,  // GroupM
        10,  // Index Exchange, Inc.
        278, // Integral Ad Science, Inc.
        97,  // LiveRamp, Inc.
        95,  // Lotame Solutions, Inc.
        228, // McCann Discipline LTD
        79,  // MediaMath, Inc.
        101, // MiQ
        468, // Neustar, Inc.
        373, // Nielsen Marketing Cloud
        69,  // OpenX Software Ltd. and its affiliates
        385, // Oracle
        177, // plista GmbH
        76,  // PubMatic, Inc.
        11,  // Quantcast International Limited
        36,  // RhythmOne, LLC
        261, // Signal Digital Inc.
        68,  // Sizmek Technologies, Inc.
        165, // SpotX
        197, // Switch Concepts Limited
        522, // Tealium Inc
        345, // The Kantar Group Limited
        52,  // The Rubicon Project, Limited
        21,  // The Trade Desk, Inc and affiliated companies
        28,  // TripleLift, Inc.
    ],
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

export default function main(options) {
    const {
        zIndex,
        onAcceptTracking,
        onRejectTracking,
        preventScrollOn,
        enabledVendorPurposes,
        enabledVendors,
        ...depOptions
    } = Object.assign({}, DEFAULT_OPTIONS, options);
    const langManager = new LanguageManager(depOptions.language);
    const geoManager = new GeoManager(depOptions.country, depOptions.countriesRequiringPrompt);
    const tracker = new Tracker(langManager.lang, geoManager.getDetectedGeo(), depOptions.beaconCookieName, depOptions.track);
    const consentManagementProvider = new ConsentManagementProvider({
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
        consentManagementProvider.setVendorConsentCookie(null);
        consentManagementProvider.setPublisherConsentCookie(null);
    }

    const instance = new TrackingOptIn(
        tracker,
        optInManager,
        geoManager,
        contentManager,
        consentManagementProvider,
        {
            preventScrollOn,
            zIndex,
            enabledVendorPurposes,
            enabledVendors,
            onAcceptTracking,
            onRejectTracking,
        },
        window.location,
    );

    if (!isParameterSet('mobile-app')) {
	    instance.render();
    }
    return instance;
}
