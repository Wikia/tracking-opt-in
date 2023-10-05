import { communicationService } from '../shared/communication';
import { loadScript } from '../shared/utils';

const ONE_TRUST_DOMAIN_ID = {
    'fanatical.com': '0ab0e172-dc9c-44b9-8a58-c80d9ba4fae0-test',
    'futhead.com': '82c642a4-d3a9-4a78-a310-21a7b49ab17b-test',
    'gamespot.com' : '73588546-b116-4dbc-ab64-9db97e11fc0d-test',
    'metacritic.com': '50e16f1d-a929-4cc0-80a7-3c5c303eea6a-test',
    'muthead.com': 'fb34a16e-696d-4748-af9f-96f3b9e2b4da-test',
    'tvguide.com' : 'ffc22311-f4da-4e03-a1ad-32aecd522c5b-test',
    'fandom.com': 'dea70a1b-c82d-4fe0-86ff-5e164b0a6022',
    'sandbox.fandom.com': 'dea70a1b-c82d-4fe0-86ff-5e164b0a6022-test',
}

const ONE_TRUST_LIBRARIES = [
    {
        url: 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
        options: {
            type: 'text/javascript',
        }
    }, {
        url: 'https://cdn.cookielaw.org/opt-out/otCCPAiab.js',
        options: {
            charSet: 'UTF-8',
            type: 'text/javascript',
            'ccpa-opt-out-ids': 'C0004',
            'ccpa-opt-out-geo': 'ca',
            'ccpa-opt-out-lspa': true
        }
    }, {
        url: 'https://cdn.cookielaw.org/consent/tcf.stub.js',
        options: {
            charSet: 'UTF-8',
            type: 'text/javascript',
        }
    }
]

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
        if (window.OptanonActiveGroups && window.OptanonActiveGroups.includes(this.ALLOW_TRACKING_GROUP)) {
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
