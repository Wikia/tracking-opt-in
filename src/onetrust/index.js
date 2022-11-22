import GeoManager, {COUNTRIES_REQUIRING_PROMPT} from "../shared/GeoManager";

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
        'data-domain-script': 'dea70a1b-c82d-4fe0-86ff-5e164b0a6022-test'
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

function dispatchAction(action, channelId) {
    const geoManager = new GeoManager(depOptions.country, depOptions.region, depOptions.countriesRequiringPrompt);
    if (!this.geoRequiresTrackingConsent()) {
        action = {
            ...action,
            gdprConsent: true,
            geoRequiresConsent: geoManager.needsTrackingPrompt(),
            ccpaSignal: true,
            geoRequiresSignal: geoManager.needsUserSignal(),
        };
    }

    channelId = channelId || 'default';
    var data = {
        action: action,
        channelId: channelId,
        private: true,
        libId: '@wikia/post-quecast'
    };

    top.postMessage(data, '*');
}

function OptanonWrapper() {
    const consentBoxCloseDate = document.cookie.indexOf('OptanonAlertBoxClosed');
    if (consentBoxCloseDate !== -1) {
        dispatchAction({
            "type": "[AdEngine OptIn] set opt in",
            "timestamp": Date.now()
        });
    }
}
