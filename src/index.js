import LanguageManager from "./LangManager";
import OptInManager from "./OptInManager";
import Tracker from "./Tracker";
import ContentManager from "./ContentManager";
import GeoManager from "./GeoManager";
import TrackingOptIn from './TrackingOptIn';
import ConsentManagementProvider from "./ConsentManagementProvider";
import CookieSyncManager from "./CookieSyncManager";

const DEFAULT_OPTIONS = {
    beaconCookieName: null,
    cookieName: null, // use default cookie name
    cookieExpiration: null, // use default
    cookieRejectExpiration: null,
    country: null, // country code
    countriesRequiringPrompt: null, // array of lower case country codes
    enabledVendorPurposes: [1, 2, 3, 4, 5], // array of IAB CMP purpose IDs
    enabledVendors: [ // array of IAB CMP vendor IDs
        10, // Index Exchange, Inc.
        11, // Quantcast International Limited
        32, // AppNexus Inc.
        52, // The Rubicon Project, Limited
        69, // OpenX Software Ltd. and its affiliates
        76, // PubMatic, Inc.
    ],
    language: null,
    queryParamName: null,
    preventScrollOn: 'body',
    syncCookies: true, // use cookie-syncer service to set cookies on the other domain
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
    const cookieSyncManager = depOptions.syncCookies ?  new CookieSyncManager(window.location.host) : null;

    optInManager.setForcedStatusFromQueryParams(window.location.search);

    const instance = new TrackingOptIn(
        tracker,
        optInManager,
        geoManager,
        contentManager,
        consentManagementProvider,
        cookieSyncManager,
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
