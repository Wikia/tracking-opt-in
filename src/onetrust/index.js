import { communicationService } from '../shared/communication';
import { ONE_TRUST_LIBRARIES } from '../shared/consts';
import { getCookieValue, loadScript, addStyles } from '../shared/utils';
import OptInManager from "../gdpr/OptInManager";

class OneTrustWrapper {
    ALLOW_TRACKING_GROUP = 'C0004'

    optInInstances;
    optInManager;

    initialize(optInInstances, options) {
        this.optInManager = new OptInManager(
            window.location.hostname,
            options.cookieName,
            options.cookieExpiration,
            options.cookieRejectExpiration,
            options.queryParamName,
        );
        this.loadOneTrustScripts();
        this.optInInstances = optInInstances;
        window.OptanonWrapper = this.OptanonWrapper.bind(this);
        this.hideOneTrustButton();
    }

    loadOneTrustScripts(){
        ONE_TRUST_LIBRARIES.forEach((library) => {
            loadScript(library.url, library.options);
        })
    }

    hideOneTrustButton() {
        addStyles("ot-sdk-btn {display: none !important; }\n"
                  + "ot-sdk-show-settings {display: none !important; }\n"
                  + "#ot-sdk-btn.ot-sdk-show-settings {display: none !important; }\n"
                  + "#ot-sdk-btn.optanon-show-settings {display: none !important; }");
    }

    OptanonWrapper() {
        const consentBoxClosed = document.cookie.indexOf('OptanonAlertBoxClosed');
        if (consentBoxClosed !== -1) {
            this.setTrackingOptInCookies();
            this.dispatchConsentsSetAction();
        }
    }

    setTrackingOptInCookies() {
        if (getCookieValue('OptanonConsent').indexOf(this.ALLOW_TRACKING_GROUP) !== -1) {
            this.optInManager.setTrackingAccepted();
        } else {
            this.optInManager.setTrackingRejected();
        }
    }

    dispatchConsentsSetAction() {
        const consentsSetAction = '[AdEngine OptIn] set opt in';
        communicationService.dispatch({
            type: consentsSetAction,
            ...this.optInInstances.gdpr.getConsent(),
            ...this.optInInstances.ccpa.getSignal(),
        });
    }
}

export const oneTrust = new OneTrustWrapper();
