import { h, render } from 'preact/dist/preact';
import Modal from '../modal/Modal';
import { debug, isParameterSet, parseUrl } from '../shared/utils';
import { API_STATUS } from './ConsentManagementProvider';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

class ConsentManagementPlatform {
    constructor(
        tracker,
        cookieManager,
        optInManager,
        geoManager,
        contentManager,
        consentManagementProvider,
        options,
        location
    ) {
        this.tracker = tracker;
        this.cookieManager = cookieManager;
        this.optInManager = optInManager;
        this.geoManager = geoManager;
        this.contentManager = contentManager;
        this.consentManagementProvider = consentManagementProvider;
        this.options = options;
        this.location = location;
        this.isReset = false;
    }

    removeApp = () => {
        if (this.root) {
            render(null, this.root, this.root.lastChild);
            this.root.parentNode.removeChild(this.root);
            this.root = null;
        }
    };

    // Non-IAB tracking is accepted. Some or all IAB vendors or purposes _may_ be accepted
    onAcceptTracking = (allowedVendors, allowedPurposes, allowedSpecialFeatures, allowedProviders) => {
        this.setTrackingCookies();
        this.consentManagementProvider.configure({
            allowedVendors: allowedVendors,
            allowedProviders: allowedProviders,
            allowedVendorPurposes: allowedPurposes,
            allowedSpecialFeatures: allowedSpecialFeatures
        });
        this.consentManagementProvider.install().then(() => {
            this.options.onAcceptTracking(allowedVendors, allowedPurposes);
            this.options.onConsentsReady();
        });
        this.cookieManager.setSessionCookiesOnAccept();
    };

    // Non-IAB tracking is rejected. Some or all IAB vendors or purposes _may_ be accepted
    onRejectTracking = (allowedVendors, allowedPurposes, allowedSpecialFeatures, allowedProviders) => {
        this.consentManagementProvider.configure({
            allowedVendors: allowedVendors,
            allowedProviders: allowedProviders,
            allowedVendorPurposes: allowedPurposes,
            allowedSpecialFeatures: allowedSpecialFeatures
        });
        this.consentManagementProvider.install().then(() => {
            this.options.onRejectTracking(allowedVendors, allowedPurposes);
            this.options.onConsentsReady();
        });
    };

    getConsent() {
        // Nothing is needed if the geo does not require any consent
        if (!this.geoRequiresTrackingConsent()) {
            return {
                gdprConsent: true,
                geoRequiresConsent: false,
            };
        }

        if (this.hasUserConsented() === undefined) {
            return {
                gdprConsent: false,
                geoRequiresConsent: true,
            };
        }

        const gdprConsent = this.hasUserConsented();

        debug('GDPR', 'User consent', gdprConsent);

        return {
            gdprConsent,
            geoRequiresConsent: true,
        };
    }

    hasUserConsented() {
        const hasConsentCookie = this.consentManagementProvider.hasUserConsent() || isParameterSet('mobile-app');

        if (this.isOnWhiteListedPage()) {
            return false;
        } else if (!this.geoRequiresTrackingConsent()) {
            return true;
        } else if (this.isGpcEnabled()) {
            return false;
        } else if (hasConsentCookie && this.optInManager.hasAcceptedTracking()) {
            return true;
        } else if (hasConsentCookie && this.optInManager.hasRejectedTracking()) {
            return false;
        } else if (!this.geoManager.hasGeoCookie()) {
            return false;
        }

        return undefined;
    }

    isOnWhiteListedPage() {
        const { host, pathname, search } = this.location;

        if (this.isReset || search.includes('withdrawConsent=true')) {
            return false;
        }

        const { content } = this.contentManager;
        const privacyParsedUrl = parseUrl(content.privacyPolicyUrl);
        const partnerParsedUrl = parseUrl(content.partnerListUrl);

        if (privacyParsedUrl.hostname === host && pathname === privacyParsedUrl.pathname) {
            return true;
        } else if (partnerParsedUrl.hostname === host && pathname === partnerParsedUrl.pathname) {
            return true;
        }

        return false;
    }

    geoRequiresTrackingConsent() {
        return this.geoManager.needsTrackingPrompt();
    }

    reset() {
        this.isReset = true;
        this.clear();
        this.consentManagementProvider.installStub();
        this.render();
    }

    clear() {
        this.optInManager.clear();
        this.consentManagementProvider.uninstall();
    }

    render() {
        if (!this.root) {
            this.root = document.createElement('div');
            document.body.appendChild(this.root);
        }

        this.consentManagementProvider.configure({
            gdprApplies: this.geoRequiresTrackingConsent(),
        });
        this.consentManagementProvider.initialize();
        this.consentManagementProvider.loadVendorList()
            .then(() => {
                if (this.consentManagementProvider.isVendorTCFPolicyVersionOutdated()) {
                    this.consentManagementProvider.setVendorConsentCookie(null);
                }

                this.checkUserConsent();
            });

        if (this.isGpcEnabled()) {
            this.tracker.trackGpcImpression();
        }
    }

    checkUserConsent() {
        switch (this.hasUserConsented()) {
            case true:
                this.onAcceptTracking();
                break;
            case false:
                if (this.isGpcEnabled()) {
                    this.onRejectTracking([], [], [], []);
                } else {
                    this.onRejectTracking();
                }
                break;
            default:
                if (!isParameterSet('mobile-app')) {
                    this.renderModal();
                }
        }
    }

    renderModal() {
        const options = {
            // ToDo: get rid of hardcoded list of purposes during cleanup
            enabledPurposes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            enabledVendors: this.options.enabledVendors,
            enabledProviders: this.options.enabledProviders,
            enabledSpecialFeatures: [1, 2],
            zIndex: this.options.zIndex,
            preventScrollOn: this.options.preventScrollOn,
            isCurse: this.options.isCurse,
        };

        this.consentManagementProvider.updateApi(API_STATUS.UI_VISIBLE_NEW);

        render(
            <Modal
                onRequestAppRemove={this.removeApp}
                onAcceptTracking={this.onAcceptTracking}
                onRejectTracking={this.onRejectTracking}
                tracker={this.tracker}
                optInManager={this.optInManager}
                geoManager={this.geoManager}
                options={options}
                content={this.contentManager.content}
                language={this.contentManager.language}
            />,
            this.root,
            this.root.lastChild
        );
    }

    setTrackingCookies() {
        const { pvNumber, pvNumberGlobal, sessionId } = this.getTrackingInfo();
        const expires = 1 / 48; // 30 minutes
        const domain = getDomain(window.location.host);
        const path = '/';

        Cookies.set('tracking_session_id', sessionId, {domain, expires, path});
        Cookies.set('pv_number', pvNumber + 1, {expires, path});
        Cookies.set('pv_number_global', pvNumberGlobal + 1, {domain, expires, path});
    }

    getTrackingInfo() {
        const cookies = {
            sessionId: Cookies.get('tracking_session_id'),
            pvNumber: Cookies.get('pv_number'),
            pvNumberGlobal: Cookies.get('pv_number_global'),
        };

        return getNewTrackingValues(cookies);
    }

    isGpcEnabled() {
        return window.navigator && window.navigator.globalPrivacyControl;
    }
}

export function getNewTrackingValues(cookies) {
    const { sessionId, pvNumber, pvNumberGlobal } = cookies;

    return {
        pvNumber: pvNumber ? parseInt(pvNumber, 10) : 0,
        pvNumberGlobal: pvNumberGlobal ? parseInt(pvNumberGlobal, 10) : 0,
        sessionId: sessionId || uuidv4(),
    };
}

export function getDomain(host) {
    const domain = host.split(':').shift();
    const domainParts = domain.split('.');
    const domainPartsCount = domainParts.length;

    if (domainPartsCount < 2) {
        return null;
    }

    return ['', domainParts[domainPartsCount - 2], domainParts[domainPartsCount - 1]].join('.');
}

export default ConsentManagementPlatform;
