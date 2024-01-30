import './script-public-path';
import { AC_PROVIDERS, IAB_VENDORS, SESSION_COOKIES } from './shared/consts';
import GeoManager, { ensureGeoCookie } from './shared/GeoManager';
import UserSignalMechanism from './ccpa/UserSignalMechanism';
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

export const DEFAULT_US_OPTIONS = {
    country: null, // country code
    region: null, // region code
    countriesRequiringPrompt: ['us'], // array of lower case country codes
    statesRequiringPrompt: ['ca', 'co', 'ct', 'ut', 'va'], // array of lower case state codes
    isSubjectToCcpa: window && window.ads && window.ads.context && window.ads.context.opts
                     && window.ads.context.opts.isSubjectToCcpa,
};

function initializeGDPR(options) {
    const depOptions = Object.assign({}, DEFAULT_OPTIONS, options);
    const geoManager = new GeoManager(depOptions.country, depOptions.region);

    if (!geoManager.hasSpecialPrivacyLaw()) {
        setTimeout(() => {
            depOptions.onAcceptTracking();
            depOptions.onConsentsReady();
        });
        return Promise.resolve({
            getConsent: () => ({
                gdprConsent: true,
                geoRequiresConsent: false,
            })
        });
    }

    return import(/* webpackChunkName: "gdpr" */ './gdpr/index.js').then(({createInstance}) => {
        const instance = createInstance(geoManager, depOptions);
        if (!depOptions.oneTrustEnabled) {
            instance.render();
        }
        return instance;
    });
}

function initializeCCPA(options) {
    const {
        test,
        ...depOptions
    } = Object.assign({}, DEFAULT_US_OPTIONS, options);

    const geoManager = new GeoManager(depOptions.country, depOptions.region, depOptions.countriesRequiringPrompt);
    const userSignalMechanism = new UserSignalMechanism({
        ccpaApplies: geoManager.hasSpecialPrivacyLaw(),
        isSubjectToCcpa: depOptions.isSubjectToCoppa === undefined
                         ? depOptions.isSubjectToCcpa
                         : depOptions.isSubjectToCoppa,
    });

    if (!depOptions.oneTrustEnabled) {
        userSignalMechanism.install();
    }

    return userSignalMechanism;
}

function initializeGPP(options) {
    const depOptions = Object.assign({}, DEFAULT_US_OPTIONS, options);
    const geoManager = new GeoManager(depOptions.country, depOptions.region);

    if (!geoManager.hasGppApplied()) {
        return Promise.resolve({});
    }

    return import(/* webpackChunkName: "gpp" */ './gpp/GppManager.js').then(({default: GppManager}) => {
        const gppManager = new GppManager({
            region: geoManager.region,
            gppApplies: geoManager.hasGppApplied(),
            isSubjectToGPP: depOptions.isSubjectToCoppa === undefined
                            ? depOptions.isSubjectToCcpa
                            : depOptions.isSubjectToCoppa,
        });

        if (!depOptions.oneTrustEnabled) {
            gppManager.setup();
        }

        return gppManager;
    });
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

    const optInInstances = {gdpr: null, ccpa: null, gpp: null};
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

    Object.assign(options, {onConsentsReady, oneTrustEnabled});

    return initializeGDPR(options).then((gdpr) => {
        optInInstances.gdpr = gdpr;
        optInInstances.ccpa = initializeCCPA(options);
        optInInstances.gpp = initializeGPP(options);
        if (oneTrustEnabled) {
            import(/* webpackChunkName: "onetrust" */ './onetrust/index.js').then(({oneTrust}) => {
                oneTrust.initialize(optInInstances, options);
            });
        }
        return optInInstances;
    });
}

const autostartModal = () => {
    if (!window.trackingOptInManualStart) {
        main(window.trackingOptInOptions || {}).then((optInInstances) => {
            window.trackingOptInInstances = optInInstances;
        });
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
