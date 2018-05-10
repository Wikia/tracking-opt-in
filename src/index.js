import LanguageManager from "./LangManager";
import OptInManager from "./OptInManager";
import Tracker from "./Tracker";
import ContentManager from "./ContentManager";
import GeoManager from "./GeoManager";
import {h, render} from "preact";
import App from "./components/App";

const DEFAULT_OPTIONS = {
    cookieName: null, // use default cookie name
    cookieExpiration: null, // use default
    country: null, // country code
    countriesRequiringPrompt: null, // array of lower case country codes
    language: null,
    track: true,
    zIndex: 1000,
    onAcceptTracking() {
        console.log('user opted in to tracking');
    },
    onRejectTracking() {
        console.log('user opted out of tracking');
    },
};

class TrackingOptIn {
    constructor(tracker, optInManager, geoManager, contentManager, options) {
        this.tracker = tracker;
        this.optInManager = optInManager;
        this.geoManager = geoManager;
        this.contentManager = contentManager;
        this.options = options;
    }

    removeApp = () => {
        render(null, this.root, this.root.lastChild);
        this.root.parentNode.removeChild(this.root);
        this.root = null;
    };

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

        if (!this.geoRequiresTrackingConsent()) {
            this.options.onAcceptTracking();
        } else if (this.optInManager.hasAcceptedTracking()) {
            this.options.onAcceptTracking();
        } else if (this.optInManager.hasRejectedTracking()) {
            this.options.onRejectTracking();
        } else {
            render(
                <App
                    onRequestAppRemove={this.removeApp}
                    tracker={this.tracker}
                    optInManager={this.optInManager}
                    options={this.options}
                    content={this.contentManager.content}
                />,
                this.root,
                this.root.lastChild
            );
        }
    }
}

export default function main(options) {
    const { zIndex, onAcceptTracking, onRejectTracking, ...depOptions } = Object.assign({}, DEFAULT_OPTIONS, options);
    const langManager = new LanguageManager(depOptions.language);
    const tracker = new Tracker(langManager.lang, depOptions.track);
    const optInManager = new OptInManager(depOptions.cookieName, depOptions.cookieExpiration);
    const geoManager = new GeoManager(depOptions.country, depOptions.countriesRequiringPrompt);
    const contentManager = new ContentManager(langManager.lang);

    const instance = new TrackingOptIn(
        tracker,
        optInManager,
        geoManager,
        contentManager,
        {
            zIndex,
            onAcceptTracking,
            onRejectTracking,
        }
    );
    instance.render();
    return instance;
}
