import { IAB_VENDORS } from './shared/consts';
import ContentManager from './shared/ContentManager';
import GeoManager from './shared/GeoManager';
import LanguageManager from './shared/LangManager';
import ConsentManagementProvider from './gdpr/ConsentManagementProvider';
import OptInManager from './gdpr/OptInManager';
import Tracker from './gdpr/Tracker';
import ConsentManagementPlatform from './gdpr/ConsentManagementPlatform';
import UserSignalMechanism from './ccpa/UserSignalMechanism';
import CookiesBaker from './tracking/CookiesBaker';
import { communicationService } from './shared/communication';
import { debug } from './shared/utils';
import EventsTracker from "./tracking/EventsTracker";
import { COOKIES } from "./tracking/cookie-config";

export const DEFAULT_OPTIONS = {
    cookies: COOKIES, // array of cookies that needs to be set after consent is processed
    beaconCookieName: null,
    cookieName: null, // use default cookie name
    cookieExpiration: null, // use default
    cookieRejectExpiration: null,
    country: null, // country code
    countriesRequiringPrompt: null, // array of lower case country codes
    enabledVendors: IAB_VENDORS, // array of IAB CMP vendor IDs
    language: null,
    queryParamName: null,
    preventScrollOn: 'body',
    track: true,
    zIndex: 9999999,
    env: 'prod',
    platform: 'trackingOptIn',
    onAcceptTracking() {
        debug('MODAL', 'User opted in to tracking');
    },
    onRejectTracking() {
        debug('MODAL', 'User opted out of tracking');
    },
    onConsentsReady() {
        debug('MODAL', 'Consents ready');
    },
};

export const DEFAULT_CCPA_OPTIONS = {
    country: null, // country code
    region: null, // region code
    countriesRequiringPrompt: ['us-ca'], // array of lower case country codes
    isSubjectToCcpa: window && window.ads && window.ads.context && window.ads.context.opts && window.ads.context.opts.isSubjectToCcpa,
};

function initializeGDPR(options) {
    const {
        zIndex,
        onAcceptTracking,
        onRejectTracking,
        onConsentsReady,
        preventScrollOn,
        enabledVendorPurposes,
        enabledVendors,
        isCurse,
        ...depOptions
    } = options;
    const langManager = new LanguageManager(depOptions.language);
    const geoManager = new GeoManager(depOptions.country, depOptions.region, depOptions.countriesRequiringPrompt);
    const tracker = new Tracker(langManager.lang, geoManager.getDetectedGeo(), depOptions.track, depOptions.platform, depOptions.env);
    const consentManagementProvider = new ConsentManagementProvider({
        language: langManager.lang
    });

    const optInManager = new OptInManager(
        window.location.hostname,
        depOptions.cookieName,
        depOptions.cookieExpiration,
        depOptions.cookieRejectExpiration,
        depOptions.queryParamName,
    );
    const contentManager = new ContentManager(langManager.lang);

    optInManager.setForcedStatusFromQueryParams(window.location.search);

    if (optInManager.checkCookieVersion() || consentManagementProvider.isWithdrawingConsent()) {
        consentManagementProvider.setVendorConsentCookie(null);
    }

    const instance = new ConsentManagementPlatform(
        tracker,
        optInManager,
        geoManager,
        contentManager,
        consentManagementProvider,
        {
            preventScrollOn,
            zIndex,
            enabledVendors,
            onAcceptTracking,
            onRejectTracking,
            onConsentsReady,
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
    } = options;

    const geoManager = new GeoManager(depOptions.country, depOptions.region, depOptions.countriesRequiringPrompt);
    const userSignalMechanism = new UserSignalMechanism({
        ccpaApplies: geoManager.needsUserSignal(),
        isSubjectToCcpa: options.isSubjectToCoppa === undefined ? options.isSubjectToCcpa : options.isSubjectToCoppa,
    });

    userSignalMechanism.install();

    return userSignalMechanism;
}

export default function main(options) {
    const consentsAction = '[AdEngine OptIn] set opt in';
    const instancesAction = '[AdEngine OptIn] set opt in instances';

    debug('MODAL', 'Library loaded and started');

    const mergedOptions = Object.assign({}, DEFAULT_OPTIONS, options);
    const cookieManager = new CookiesBaker(mergedOptions.cookies);
    const tracker = EventsTracker.build(window);

    if (!window.navigator.cookieEnabled) {
        debug('MODAL', 'Cookies are disabled - ignoring CMP and USAPI consent checks');
        communicationService.dispatch({
            type: consentsAction,
            gdprConsent: true,
            geoRequiresConsent: true,
            ccpaSignal: false,
            geoRequiresSignal: true,
        });
        tracker.startTracking(false, {});
        return;
    }

    const optInInstances = { gdpr: null, ccpa: null };
    const onConsentsReady = () => {
        const gdprConsent = optInInstances.gdpr.getConsent();

        communicationService.dispatch({
            type: consentsAction,
            ...gdprConsent,
            ...optInInstances.ccpa.getSignal(),
        });
        communicationService.dispatch({
            type: instancesAction,
            ...optInInstances,
        });
        // this will also handle CCPA region as it is not GDPR one
        const allowedToTrack = gdprConsent.geoRequiresConsent === false || gdprConsent.gdprConsent === true;

        tracker.startTracking(allowedToTrack, Cookies.get());
        cookieManager.setOrExtendCookies(tracker.getTrackingParameters().toCookies());
    };

    Object.assign(mergedOptions, { onConsentsReady });

    optInInstances.gdpr = initializeGDPR(mergedOptions);
    optInInstances.ccpa = initializeCCPA(Object.assign({}, DEFAULT_CCPA_OPTIONS, options,{ onConsentsReady }));

    return optInInstances;
}

const autostartModal = () => {
    if (!window.trackingOptInManualStart) {
        window.trackingOptInInstances = main(window.trackingOptInOptions || {});
    }
};

if (document.readyState !== 'loading') {
    autostartModal();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        autostartModal();
    });
}
