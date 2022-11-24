import { communicationService } from '../shared/communication';
import { ONE_TRUST_LIBRARIES } from '../shared/consts';
import { loadScript } from '../shared/utils';

class OneTrustWrapper {
    optInInstances;

    initialize(optInInstances) {
        this.loadOneTrustScripts();
        this.optInInstances = optInInstances;
        window.OptanonWrapper = this.OptanonWrapper.bind(this);
    }

    loadOneTrustScripts(){
        ONE_TRUST_LIBRARIES.forEach((library) => {
            loadScript(library.url, library.options);
        })
    }

    OptanonWrapper() {
        const consentBoxClosed = document.cookie.indexOf('OptanonAlertBoxClosed');
        if (consentBoxClosed !== -1) {
            this.dispatchConsentsSetAction();
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
