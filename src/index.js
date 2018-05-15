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
    queryParamName: null,
    preventScrollOn: 'body',
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

    hasUserConsented() {
        if (!this.geoRequiresTrackingConsent()) {
            return true;
        } else if (this.optInManager.hasAcceptedTracking()) {
            return true;
        } else if (this.optInManager.hasRejectedTracking()) {
            return false;
        }

        return undefined;
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
    const {
        zIndex,
        onAcceptTracking,
        onRejectTracking,
        preventScrollOn,
        ...depOptions
    } = Object.assign({}, DEFAULT_OPTIONS, options);
    const langManager = new LanguageManager(depOptions.language);
    const tracker = new Tracker(langManager.lang, depOptions.track);
    const optInManager = new OptInManager(depOptions.cookieName, depOptions.cookieExpiration, depOptions.queryParamName);
    const geoManager = new GeoManager(depOptions.country, depOptions.countriesRequiringPrompt);
    const contentManager = new ContentManager(langManager.lang);

    optInManager.setForcedStatusFromQueryParams();

    const instance = new TrackingOptIn(
        tracker,
        optInManager,
        geoManager,
        contentManager,
        {
            preventScrollOn,
            zIndex,
            onAcceptTracking,
            onRejectTracking,
        }
    );
    instance.render();
    return instance;
}
