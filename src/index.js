import LanguageManager from "./LangManager";
import OptInManager from "./OptInManager";
import Tracker from "./Tracker";
import ContentManager from "./ContentManager";
import GeoManager from "./GeoManager";
import TrackingOptIn from './TrackingOptIn';
import ConsentManagementProvider from "./ConsentManagementProvider";
import { IAB_VENDORS } from './consts';

export const DEFAULT_OPTIONS = {
    beaconCookieName: null,
    cookieName: null, // use default cookie name
    cookieExpiration: null, // use default
    cookieRejectExpiration: null,
    country: null, // country code
    countriesRequiringPrompt: null, // array of lower case country codes
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
