import ConsentManagementPlatform from "./ConsentManagementPlatform";
import LanguageManager from "../shared/LangManager";
import Tracker from "./Tracker";
import ConsentManagementProvider from "./ConsentManagementProvider";
import OptInManager from "./OptInManager";
import ContentManager from "../shared/ContentManager";

export function createInstance(geoManager, options) {
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
    } = options;

    const langManager = new LanguageManager(depOptions.language);
    const tracker = new Tracker(langManager.lang, geoManager.country, depOptions.beaconCookieName, depOptions.track);
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

    return new ConsentManagementPlatform(
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
    )
}
