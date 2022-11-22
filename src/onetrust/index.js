import { communicationService } from "../shared/communication";

function loadScript(url, options) {
    const element = document.createElement('script');
    element.src = url;
    Object.keys(options).map((key) => {
        element.setAttribute(key, options[key])
    });
    document.body.appendChild(element);
}

export function initializeOneTrust() {
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

    window.OptanonWrapper = OptanonWrapper
}

function dispatchAction() {
    communicationService.dispatch({
        type: consentsAction,
        ...optIn.gdpr.getConsent(),
        ...optIn.ccpa.getSignal(),
    });
}

function hideOneTrustIcon() {
    const otConsentIcon = document.getElementById("onetrust-consent-sdk");
    if (otConsentIcon) {
        otConsentIcon.hidden = true;
    }
}

function OptanonWrapper() {
    const consentBoxClosed = document.cookie.indexOf('OptanonConsent');
    if (consentBoxClosed !== -1) {
        hideOneTrustIcon();
        dispatchAction();
    }
}
