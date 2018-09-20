import {h, render} from "preact/dist/preact";
import App from "./components/App";
import {parseUrl} from "./utils";

class TrackingOptIn {
    constructor(
        tracker,
        optInManager,
        geoManager,
        contentManager,
        consentManagementProvider,
        cookieSyncManager,
        options,
        location
    ) {
        this.tracker = tracker;
        this.optInManager = optInManager;
        this.geoManager = geoManager;
        this.contentManager = contentManager;
        this.consentManagementProvider = consentManagementProvider;
        this.cookieSyncManager = cookieSyncManager;
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

    onAcceptTracking = () => {
        this.consentManagementProvider.configure({
            gdprApplies: this.geoRequiresTrackingConsent(),
            allowedVendors: this.options.enabledVendors,
            allowedVendorPurposes: this.options.enabledVendorPurposes
        });
        this.options.onAcceptTracking();

        return this.consentManagementProvider.install();
    };

    onAcceptTrackingClicked = () => {
        this.onAcceptTracking()
            .then(() => {
                if (this.cookieSyncManager) {
                    this.cookieSyncManager.crossDomainSync();
                }
            });
    };

    onRejectTracking = () => {
        this.consentManagementProvider.configure({
            gdprApplies: this.geoRequiresTrackingConsent(),
            allowedVendors: [],
            allowedVendorPurposes: []
        });
        this.options.onRejectTracking();

        return this.consentManagementProvider.install();
    };

    onRejectTrackingClicked = () => {
        this.onRejectTracking()
            .then(() => {
                if (this.cookieSyncManager) {
                    this.cookieSyncManager.crossDomainSync();
                }
            });
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

        if (this.cookieSyncManager) {
            this.cookieSyncManager.clear();
        }
    }

    render() {
        if (!this.root) {
            this.root = document.createElement('div');
            document.body.appendChild(this.root);
        }

        const options = {
            zIndex: this.options.zIndex,
            preventScrollOn: this.options.preventScrollOn
        };

        switch (this.hasUserConsented()) {
            case true:
                this.onAcceptTracking();
                break;
            case false:
                this.onRejectTracking();
                break;
            default:
                render(
                    <App
                        onRequestAppRemove={this.removeApp}
                        onAcceptTracking={this.onAcceptTrackingClicked}
                        onRejectTracking={this.onRejectTrackingClicked}
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

export default TrackingOptIn;
