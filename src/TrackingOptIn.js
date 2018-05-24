import {h, render} from "preact/dist/preact";
import App from "./components/App";
import {parseUrl} from "./urlUtils";

class TrackingOptIn {
    constructor(tracker, optInManager, geoManager, contentManager, options, location) {
        this.tracker = tracker;
        this.optInManager = optInManager;
        this.geoManager = geoManager;
        this.contentManager = contentManager;
        this.options = options;
        this.location = location || window.location;
    }

    removeApp = () => {
        if (this.root) {
            render(null, this.root, this.root.lastChild);
            this.root.parentNode.removeChild(this.root);
            this.root = null;
        }
    };

    hasUserConsented() {
        if (!this.geoRequiresTrackingConsent()) {
            return true;
        } else if (this.optInManager.hasAcceptedTracking()) {
            return true;
        } else if (this.optInManager.hasRejectedTracking()) {
            return false;
        } else if(!this.geoManager.hasGeoCookie()) {
            return false;
        } else if(this.isOnWhiteListedPage()) {
            return false;
        }

        return undefined;
    }

    isOnWhiteListedPage() {
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
        this.clear();
        this.render();
    }

    clear() {
        this.optInManager.clear();
    }

    render() {
        if (!this.root) {
            this.root = document.createElement('div');
            document.body.appendChild(this.root);
        }

        switch (this.hasUserConsented()) {
            case true:
                this.options.onAcceptTracking();
                break;
            case false:
                this.options.onRejectTracking();
                break;
            default:
                render(
                    <App
                        onRequestAppRemove={this.removeApp}
                        tracker={this.tracker}
                        optInManager={this.optInManager}
                        geoManager={this.geoManager}
                        options={this.options}
                        content={this.contentManager.content}
                    />,
                    this.root,
                    this.root.lastChild
                );
        }
    }
}

export default TrackingOptIn;
