import { communicationService } from '../shared/communication';
import { ONE_TRUST_DOMAIN_ID, ONE_TRUST_LIBRARIES } from '../shared/consts';
import { loadScript } from '../shared/utils';

class OneTrustWrapper {
    ALLOW_TRACKING_GROUP = 'C0004';
    FANDOM_DOMAIN = 'fandom.com';
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
    }

    getDomainId() {
        const domainParts = location.hostname.split('.');
        const domainPartsCount = domainParts.length;

        let completeDomain = [domainParts[domainPartsCount - 2], domainParts[domainPartsCount - 1]].join('.');
        if (completeDomain === this.FANDOM_DOMAIN && location.hostname.includes('sandbox')) {
            completeDomain = 'sandbox.' + completeDomain;
        }

        return ONE_TRUST_DOMAIN_ID[completeDomain] || ONE_TRUST_DOMAIN_ID["fandom.com"];
    }

    loadOneTrustScripts(){
        ONE_TRUST_LIBRARIES.forEach((library) => {
            loadScript(library.url, {...library.options,
                'data-domain-script': this.getDomainId()
            });
        })
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
