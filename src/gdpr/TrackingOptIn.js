import { h, render } from 'preact/dist/preact';
import Modal from '../modal/Modal';
import { isParameterSet, parseUrl } from '../shared/utils';
import { API_STATUS } from './ConsentManagementProvider';

class TrackingOptIn {
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
        });
    };

    hasUserConsented() {
        const hasConsentCookie = this.consentManagementProvider.hasUserConsent() || isParameterSet('mobile-app');

        if (this.isOnWhiteListedPage()) {
            return false;
        } else if (!this.geoRequiresTrackingConsent()) {
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
        if (this.isReset) {
            return false;
        }

        const { host, pathname } = this.location;
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

export default TrackingOptIn;
