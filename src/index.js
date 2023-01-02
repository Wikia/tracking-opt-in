import { AC_PROVIDERS, IAB_VENDORS, SESSION_COOKIES } from './shared/consts';
import ContentManager from './shared/ContentManager';
import GeoManager, { ensureGeoCookie } from './shared/GeoManager';
import LanguageManager from './shared/LangManager';
import ConsentManagementProvider from './gdpr/ConsentManagementProvider';
import OptInManager from './gdpr/OptInManager';
import Tracker from './gdpr/Tracker';
import ConsentManagementPlatform from './gdpr/ConsentManagementPlatform';
import UserSignalMechanism from './ccpa/UserSignalMechanism';
import CookieManager from './shared/CookieManager';
import { communicationService } from './shared/communication';
import { debug } from './shared/utils';
import { oneTrust } from './onetrust';

export const DEFAULT_OPTIONS = {
    sessionCookies: SESSION_COOKIES, // array of sessionCookies with extension times
    beaconCookieName: null,
    cookieName: null, // use default cookie name
    cookieExpiration: null, // use default
    cookieRejectExpiration: null,
    country: null, // country code
    countriesRequiringPrompt: null, // array of lower case country codes
    enabledVendors: IAB_VENDORS, // array of IAB CMP vendor IDs
    enabledProviders: AC_PROVIDERS.map((provider) => provider.id), // array of AC providers IDs
    language: null,
    queryParamName: null,
    preventScrollOn: 'body',
    track: true,
    zIndex: 9999999,
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
    countriesRequiringPrompt: ['us'], // array of lower case country codes
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
        enabledProviders,
        isCurse,
        ...depOptions
    } = Object.assign({}, DEFAULT_OPTIONS, options);
    const cookieManager = new CookieManager(depOptions.sessionCookies);
    const langManager = new LanguageManager(depOptions.language);
    const geoManager = new GeoManager(depOptions.country, depOptions.region, depOptions.countriesRequiringPrompt);
    const tracker = new Tracker(langManager.lang, geoManager.getDetectedGeo(), depOptions.beaconCookieName, depOptions.track);
    const consentManagementProvider = new ConsentManagementProvider({
        language: langManager.lang,
        oneTrustEnabled: options.oneTrustEnabled
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
        consentManagementProvider.setProviderConsentCookie(null);
    }

    const instance = new ConsentManagementPlatform(
        tracker,
        cookieManager,
        optInManager,
        geoManager,
        contentManager,
        consentManagementProvider,
        {
            preventScrollOn,
            zIndex,
            enabledVendors,
            enabledProviders,
            onAcceptTracking,
            onRejectTracking,
            onConsentsReady,
            isCurse,
        },
        window.location,
    );
    if (!depOptions.oneTrustEnabled) {
        instance.render();
    }
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
        isSubjectToCcpa: depOptions.isSubjectToCoppa === undefined ? depOptions.isSubjectToCcpa : depOptions.isSubjectToCoppa,
    });

    if (!depOptions.oneTrustEnabled) {
        userSignalMechanism.install();
    }

    return userSignalMechanism;
}


function isOneTrustEnabled() {
    const params = new URLSearchParams(window.location.search);
    const ads = (window.ads = window.ads || {});
    const context = (ads.context = ads.context || {});

    return JSON.parse(params.get('onetrust_enabled')) || context.oneTrustEnabled || false;
}

export default function main(options) {
    const consentsAction = '[AdEngine OptIn] set opt in';
    const instancesAction = '[AdEngine OptIn] set opt in instances';
    const oneTrustEnabled = isOneTrustEnabled();

    debug('MODAL', 'Library loaded and started');

    if (!window.navigator.cookieEnabled) {
        debug('MODAL', 'Cookies are disabled - ignoring CMP and USAPI consent checks');
        communicationService.dispatch({
            type: consentsAction,
            gdprConsent: true,
            geoRequiresConsent: true,
            ccpaSignal: false,
            geoRequiresSignal: true,
        });

        return;
    }

    const optInInstances = { gdpr: null, ccpa: null };
    const onConsentsReady = () => {
        communicationService.dispatch({
            type: consentsAction,
            ...optInInstances.gdpr.getConsent(),
            ...optInInstances.ccpa.getSignal(),
        });
        communicationService.dispatch({
            type: instancesAction,
            ...optInInstances,
        });
    };

    Object.assign(options, { onConsentsReady, oneTrustEnabled });

    optInInstances.gdpr = initializeGDPR(options);
    optInInstances.ccpa = initializeCCPA(options);
    if (oneTrustEnabled) {
        oneTrust.initialize(optInInstances, options);
    }
    return optInInstances;
}

const autostartModal = () => {
    if (!window.trackingOptInManualStart) {
        window.trackingOptInInstances = main(window.trackingOptInOptions || {});
    }
};

ensureGeoCookie().then(() => {
    if (document.readyState !== 'loading') {
        autostartModal();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            autostartModal();
        });
    }
});
