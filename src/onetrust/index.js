import { communicationService } from "../shared/communication";

function loadScript(url, options) {
    const element = document.createElement('script');
    element.src = url;
    Object.keys(options).map((key) => {
        element.setAttribute(key, options[key])
    });
    document.body.appendChild(element);
}

export function initializeOneTrust(optInInstances) {
    loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', {
        type: 'text/javascript',
        'data-domain-script': 'dea70a1b-c82d-4fe0-86ff-5e164b0a6022'
    });

    loadScript('https://cdn.cookielaw.org/opt-out/otCCPAiab.js', {
        charSet: 'UTF-8',
        type: 'text/javascript',
        'ccpa-opt-out-ids': 'C0004',
        'ccpa-opt-out-geo': 'ca',
        'ccpa-opt-out-lspa': true
    });

    loadScript('https://cdn.cookielaw.org/consent/tcf.stub.js', {
        charSet: 'UTF-8',
        type: 'text/javascript',
    });

    window.OptanonWrapper = (() => {
        return OptanonWrapper
    })().apply({optInInstances});
}

function dispatchAction(optInInstances) {
    const consentsAction = '[AdEngine OptIn] set opt in';
    communicationService.dispatch({
        type: consentsAction,
        ...optInInstances.gdpr.getConsent(),
        ...optInInstances.ccpa.getSignal(),
    });
}

function OptanonWrapper() {
    const consentBoxClosed = document.cookie.indexOf('OptanonAlertBoxClosed');
    if (consentBoxClosed !== -1) {
        dispatchAction(this.optInInstances);
    }
}
