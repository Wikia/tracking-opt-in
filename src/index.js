import LanguageManager from "./LangManager";
import OptInManager from "./OptInManager";
import Tracker from "./Tracker";
import ContentManager from "./ContentManager";
import GeoManager from "./GeoManager";
import TrackingOptIn from './TrackingOptIn';

const DEFAULT_OPTIONS = {
    beaconCookieName: null,
    cookieName: null, // use default cookie name
    cookieExpiration: null, // use default
    country: null, // country code
    countriesRequiringPrompt: null, // array of lower case country codes
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
        ...depOptions
    } = Object.assign({}, DEFAULT_OPTIONS, options);
    const langManager = new LanguageManager(depOptions.language);
    const geoManager = new GeoManager(depOptions.country, depOptions.countriesRequiringPrompt);
    const tracker = new Tracker(langManager.lang, geoManager.getDetectedGeo(), depOptions.beaconCookieName, depOptions.track);
    const optInManager = new OptInManager(
        window.location.hostname,
        depOptions.cookieName,
        depOptions.cookieExpiration,
        depOptions.queryParamName
    );
    const contentManager = new ContentManager(langManager.lang);

    optInManager.setForcedStatusFromQueryParams(window.location.search);

    const instance = new TrackingOptIn(
        tracker,
        optInManager,
        geoManager,
        contentManager,
        {
            preventScrollOn,
            zIndex,
            onAcceptTracking,
            onRejectTracking,
        },
        window.location,
    );
    instance.render();
    return instance;
}
