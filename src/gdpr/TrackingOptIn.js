import { h, render } from 'preact/dist/preact';
import AppLegacy from '../components/AppLegacy';
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
        consentManagementProviderLegacy,
        options,
        location
    ) {
        this.tracker = tracker;
        this.optInManager = optInManager;
        this.geoManager = geoManager;
        this.contentManager = contentManager;
        this.consentManagementProvider = consentManagementProvider;
        // ToDo: cleanup TCF v1.1
        this.consentManagementProviderLegacy = consentManagementProviderLegacy;
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
    onAcceptTracking = (allowedVendors, allowedPurposes) => {
        // ToDo: cleanup TCF v1.1
        if (!this.geoManager.tcf1Disabled) {
            this.consentManagementProviderLegacy.configure({
                gdprApplies: this.geoRequiresTrackingConsent(),
                allowedVendors: allowedVendors,
                allowedVendorPurposes: allowedPurposes
            });
            this.consentManagementProviderLegacy.install().then(() => {
                this.options.onAcceptTracking(allowedVendors, allowedPurposes);
            });
        }

        // TCF v2.0 rollout: show second modal if consented pageview before
        this.gatherTCF2Consent(allowedVendors, allowedPurposes);
    };

    // Non-IAB tracking is rejected. Some or all IAB vendors or purposes _may_ be accepted
    onRejectTracking = (allowedVendors, allowedPurposes) => {
        // ToDo: cleanup TCF v1.1
        if (!this.geoManager.tcf1Disabled) {
            this.consentManagementProviderLegacy.configure({
                gdprApplies: this.geoRequiresTrackingConsent(),
                allowedVendors: allowedVendors,
                allowedVendorPurposes: allowedPurposes
            });
            this.consentManagementProviderLegacy.install().then(() => {
                this.options.onRejectTracking(allowedVendors, allowedPurposes);
            });
        }

        // TCF v2.0 rollout: show second modal if consented pageview before
        this.gatherTCF2Consent(allowedVendors, allowedPurposes);
    };

    // Opt-out everything before use clicks anything in modal
    rejectBeforeConsent = () => {
        // ToDo: cleanup TCF v1.1
        if (!this.geoManager.tcf1Disabled) {
            this.consentManagementProviderLegacy.configure({
                gdprApplies: this.geoRequiresTrackingConsent(),
                allowedVendors: [],
                allowedVendorPurposes: []
            });
            this.consentManagementProviderLegacy.install();
        }

        if (this.geoManager.tcf2Enabled) {
            this.consentManagementProvider.configure({
                allowedVendors: [],
                allowedVendorPurposes: []
            });
            this.consentManagementProvider.run();
        }
    };

    hasUserConsented() {
        if (this.isOnWhiteListedPage()) {
            return false;
        } else if (!this.geoRequiresTrackingConsent()) {
            return true;
        } else if (this.optInManager.hasAcceptedTracking()) {
            return true;
        } else if (this.optInManager.hasRejectedTracking()) {
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

        if (this.geoManager.tcf2Enabled) {
            this.consentManagementProvider.installStub();
        }

        // ToDo: cleanup TCF v1.1
        if (!this.geoManager.tcf1Disabled) {
            this.consentManagementProviderLegacy.installStub();
        }

        this.render();
    }

    clear() {
        this.optInManager.clear();

        if (this.geoManager.tcf2Enabled) {
            this.consentManagementProvider.uninstall();
        }

        // ToDo: cleanup TCF v1.1
        if (!this.geoManager.tcf1Disabled) {
            this.consentManagementProviderLegacy.uninstall();
        }
    }

    render() {
        if (!this.root) {
            this.root = document.createElement('div');
            document.body.appendChild(this.root);
        }

        if (this.geoManager.tcf2Enabled) {
            this.consentManagementProvider.installStub();
            this.consentManagementProvider.configure({
                gdprApplies: this.geoRequiresTrackingConsent(),
            });
            this.consentManagementProvider.install();
        }

        if (this.geoManager.tcf1Disabled) {
            // TCF v2.0 rollout: show second modal if consented pageview before
            this.gatherTCF2Consent();
            return;
        } else {
            this.consentManagementProviderLegacy.installStub();
        }

        const options = {
            enabledPurposes: this.options.enabledVendorPurposes,
            enabledVendors: this.options.enabledVendors,
            zIndex: this.options.zIndex,
            preventScrollOn: this.options.preventScrollOn,
            isCurse: this.options.isCurse,
        };

        this.optInManager.transitionOptInStatusTracker.init();

        switch (this.hasUserConsented()) {
            case true:
                this.onAcceptTracking();
                break;
            case false:
                this.onRejectTracking();
                break;
            default:
                if (!isParameterSet('mobile-app')) {
                    if (this.options.disableConsentQueue) {
                        this.rejectBeforeConsent();
                    }

                    render(
                        <AppLegacy
                            onRequestAppRemove={this.removeApp}
                            onAcceptTracking={this.onAcceptTracking}
                            onRejectTracking={this.onRejectTracking}
                            tracker={this.tracker}
                            optInManager={this.optInManager}
                            geoManager={this.geoManager}
                            options={options}
                            content={this.contentManager.content}
                        />,
                        this.root,
                        this.root.lastChild
                    );
                }
        }
    }

    needsTCF2Consent() {
        if (this.isOnWhiteListedPage()) {
            return false;
        } else if (!this.geoRequiresTrackingConsent()) {
            return false;
        } else if (!this.geoManager.hasGeoCookie()) {
            return false;
        } else if (!this.consentManagementProvider.hasUserConsent()) {
            return true;
        }

        return false;
    }

    gatherTCF2Consent(allowedVendors, allowedPurposes) {
        if (!this.geoManager.tcf2Enabled) {
            return;
        }

        this.consentManagementProvider.loadVendorList()
            .then(() => {
                this.tracker.tcfVersion = 2;
                this.optInManager.transitionOptInStatusTracker.version = 2;
                this.optInManager.transitionOptInStatusTracker.init();

                if (this.consentManagementProvider.isVendorTCFPolicyVersionOutdated()) {
                    this.consentManagementProvider.setVendorConsentCookie(null);
                }

                if (!this.needsTCF2Consent() || isParameterSet('mobile-app')) {
                    this.consentManagementProvider.run();
                    return;
                }

                if (allowedVendors !== undefined || allowedPurposes !== undefined) {
                    this.consentManagementProvider.updateApi(API_STATUS.DISABLED);
                    return;
                }

                if (!this.root) {
                    this.root = document.createElement('div');
                    document.body.appendChild(this.root);
                }

                const options = {
                    // ToDo: get rid of hardcoded list of purposes during cleanup
                    enabledPurposes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    enabledVendors: this.options.enabledVendors,
                    zIndex: this.options.zIndex,
                    preventScrollOn: this.options.preventScrollOn,
                    isCurse: this.options.isCurse,
                };

                this.consentManagementProvider.updateApi(API_STATUS.UI_VISIBLE_NEW);

                render(
                    <Modal
                        onRequestAppRemove={this.removeApp}
                        onAcceptTracking={(allowedVendors, allowedPurposes) => {
                            this.consentManagementProvider.configure({
                                allowedVendors: allowedVendors,
                                allowedVendorPurposes: allowedPurposes
                            });
                            this.consentManagementProvider.run().then(() => {
                                this.options.onAcceptTracking(allowedVendors, allowedPurposes);
                            });
                        }}
                        onRejectTracking={(allowedVendors, allowedPurposes) => {
                            this.consentManagementProvider.configure({
                                allowedVendors: allowedVendors,
                                allowedVendorPurposes: allowedPurposes
                            });
                            this.consentManagementProvider.run().then(() => {
                                this.options.onRejectTracking(allowedVendors, allowedPurposes);
                            });
                        }}
                        tracker={this.tracker}
                        optInManager={this.optInManager}
                        geoManager={this.geoManager}
                        options={options}
                        content={this.contentManager.content}
                    />,
                    this.root,
                    this.root.lastChild
                );
            });
    }
}

export default TrackingOptIn;
