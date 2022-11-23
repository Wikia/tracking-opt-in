import { communicationService } from "../shared/communication";

class OneTrustWrapper {
    optInInstances;
    loadSingleScript(url, options) {
        const element = document.createElement('script');
        element.src = url;
        Object.keys(options).map((key) => {
            element.setAttribute(key, options[key])
        });
        document.body.appendChild(element);
    }

    loadOneTrustScripts(){
        this.loadSingleScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', {
            type: 'text/javascript',
            'data-domain-script': 'dea70a1b-c82d-4fe0-86ff-5e164b0a6022-test'
        });

        this.loadSingleScript('https://cdn.cookielaw.org/opt-out/otCCPAiab.js', {
            charSet: 'UTF-8',
            type: 'text/javascript',
            'ccpa-opt-out-ids': 'C0004',
            'ccpa-opt-out-geo': 'ca',
            'ccpa-opt-out-lspa': true
        });

        this.loadSingleScript('https://cdn.cookielaw.org/consent/tcf.stub.js', {
            charSet: 'UTF-8',
            type: 'text/javascript',
        });
    }

    initializeOneTrust(optInInstances) {
        this.loadOneTrustScripts();
        this.optInInstances = optInInstances;
        window.OptanonWrapper = this.OptanonWrapper.bind(this);

    }

    dispatchAction() {
        const consentsAction = '[AdEngine OptIn] set opt in';
        communicationService.dispatch({
            type: consentsAction,
            ...this.optInInstances.gdpr.getConsent(),
            ...this.optInInstances.ccpa.getSignal(),
        });
    }

    OptanonWrapper() {
        const consentBoxClosed = document.cookie.indexOf('OptanonAlertBoxClosed');
        if (consentBoxClosed !== -1) {
            this.dispatchAction();
        }
    }
}

export const oneTrust = new OneTrustWrapper();
