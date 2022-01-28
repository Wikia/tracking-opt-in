import { render } from 'preact/dist/preact';
import Modal from '../modal/Modal';
import { debug, isParameterSet, parseUrl } from '../shared/utils';
import { API_STATUS } from './ConsentManagementProvider';

class ConsentManagementPlatform {
    constructor(
        tracker,
        optInManager,
        geoManager,
        contentManager,
        consentManagementProvider,
        options,
        location
    ) {
        this.tracker = tracker;
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
    onAcceptTracking = (allowedVendors, allowedPurposes, allowedSpecialFeatures) => {
        this.consentManagementProvider.configure({
            allowedVendors: allowedVendors,
            allowedVendorPurposes: allowedPurposes,
            allowedSpecialFeatures: allowedSpecialFeatures
        });
        this.consentManagementProvider.install().then(() => {
            this.options.onAcceptTracking(allowedVendors, allowedPurposes);
            this.options.onConsentsReady();
        });
    };

    // Non-IAB tracking is rejected. Some or all IAB vendors or purposes _may_ be accepted
    onRejectTracking = (allowedVendors, allowedPurposes, allowedSpecialFeatures) => {
        this.consentManagementProvider.configure({
            allowedVendors: allowedVendors,
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
            // this also handles non GDPR including CCPA regions and forces library to act as it consent was given
            return true;
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
        const {host, pathname, search} = this.location;

        if (this.isReset || search.includes('withdrawConsent=true')) {
            return false;
        }

        const {content} = this.contentManager;
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
        return this.geoManager.isCountryInScope();
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
    }

    checkUserConsent() {
        switch (this.hasUserConsented()) {
            case true:
                this.onAcceptTracking();
                break;
            case false:
                this.onRejectTracking();
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

}

export default ConsentManagementPlatform;
