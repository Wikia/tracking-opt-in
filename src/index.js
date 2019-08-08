import LanguageManager from "./LangManager";
import OptInManager from "./OptInManager";
import Tracker from "./Tracker";
import ContentManager from "./ContentManager";
import GeoManager from "./GeoManager";
import TrackingOptIn from './TrackingOptIn';
import ConsentManagementProvider from "./ConsentManagementProvider";

export const DEFAULT_OPTIONS = {
    beaconCookieName: null,
    cookieName: null, // use default cookie name
    cookieExpiration: null, // use default
    cookieRejectExpiration: null,
    country: null, // country code
    countriesRequiringPrompt: null, // array of lower case country codes
    enabledVendorPurposes: [1, 2, 3, 4, 5], // array of IAB CMP purpose IDs
    enabledVendors: [ // array of IAB CMP vendor IDs
        56,  // 33Across
        50,  // Adform A/S
        264, // Adobe Advertising Cloud
        66,  // adsquare GmbH
        32,  // AppNexus Inc.
        335, // Beachfront Media LLC
        128, // BIDSWITCH GmbH
        315, // Celtra, Inc.
        77,  // comScore, Inc.
        85,  // Crimtan Holdings Limited
        298, // Cuebiq Inc.
        71,  // Dataxu, Inc.
        144, // district m inc.
        126, // DoubleVerify Inc.
        120, // Eyeota Ptd Ltd
        78,  // Flashtalking, Inc.
        98,  // GroupM
        10,  // Index Exchange, Inc.
        278, // Integral Ad Science, Inc. (IAS)
        62,  // Justpremium BV
        97,  // LiveRamp, Inc.
        95,  // Lotame Solutions, Inc.
        578, // MAIRDUMONT NETLETIX GmbH&Co. KG
        228, // McCann Discipline LTD
        79,  // MediaMath, Inc.
        101, // MiQ
        468, // Neustar, Inc.
        373, // Nielsen Marketing Cloud (Exelate)
        25,  // Oath (EMEA) Limited
        69,  // OpenX Software Ltd. and its affiliates
        385, // Oracle (BlueKai)
        177, // plista GmbH
        76,  // PubMatic, Inc.
        81,  // PulsePoint, Inc.
        11,  // Quantcast International Limited
        36,  // RhythmOne, LLC
        506, // salesforce.com, inc.
        261, // Signal Digital Inc.
        13,  // Sovrn Holdings Inc
        165, // SpotX
        522, // Tealium Inc
        345, // The Kantar Group Limited
        52,  // The Rubicon Project, Limited
        21,  // The Trade Desk, Inc and affiliated companies
        28,  // TripleLift, Inc.
        162, // Unruly Group Ltd
        601, // WebAds B.V
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
    instance.render();

    return instance;
}
