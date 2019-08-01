import { h, render } from "preact/dist/preact";
import App from "./components/App";
import { isParameterSet, parseUrl } from "./utils";

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

    onAcceptTracking = (enabledVendors, enabledPurposes) => {
        this.consentManagementProvider.configure({
            gdprApplies: this.geoRequiresTrackingConsent(),
            allowedVendors: enabledVendors,
            allowedVendorPurposes: enabledPurposes
        });
        this.consentManagementProvider.install();
        this.options.onAcceptTracking();
    };

    onRejectTracking = () => {
        this.consentManagementProvider.configure({
            gdprApplies: this.geoRequiresTrackingConsent(),
            allowedVendors: [],
            allowedVendorPurposes: []
        });
        this.consentManagementProvider.install();
        this.options.onRejectTracking();
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
        } else if(!this.geoManager.hasGeoCookie()) {
            return false;
        }

        return undefined;
    }

    isOnWhiteListedPage() {
        if (this.isReset) {
            return false;
        }

        const {host, pathname} = this.location;
        const {privacyLink, partnerLink} = this.contentManager.content;
        const privacyParsedUrl = parseUrl(privacyLink);
        const partnerParsedUrl = parseUrl(partnerLink);

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

        const options = {
            enabledPurposes: this.options.enabledVendorPurposes,
            enabledVendors: this.options.enabledVendors,
            zIndex: this.options.zIndex,
            preventScrollOn: this.options.preventScrollOn,
        };


        switch (this.hasUserConsented()) {
            case true:
                this.onAcceptTracking();
                break;
            case false:
                this.onRejectTracking();
                break;
            default:
                if (!isParameterSet('mobile-app')) {
                    render(
                        <App
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
}

export default TrackingOptIn;
