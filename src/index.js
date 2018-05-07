import LanguageManager from "./LangManager";
import OptInManager from "./OptInManager";
import Tracker from "./Tracker";
import ContentManager from "./ContentManager";
import GeoManager from "./GeoManager";
import {h, render} from "preact/dist/preact";
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
    constructor(options) {
        this.options = Object.assign({}, DEFAULT_OPTIONS, options);
        this.langManager = new LanguageManager(this.options.language);
        this.tracker = new Tracker(this.langManager.lang, this.options.track);
        this.optInManager = new OptInManager(this.options.cookieName, this.options.cookieExpiration);
        this.geoManager = new GeoManager(this.options.country, this.options.countriesRequiringPrompt);
        this.contentManager = new ContentManager(this.langManager.lang);
    }

    removeApp = () => {
        render(null, this.root, this.root.lastChild);
        this.root.parentNode.removeChild(this.root);
        this.root = null;
    };

    render() {
        if (!this.root) {
            this.root = document.createElement('div');
            document.body.appendChild(this.root);
        }

        if (!this.geoManager.needsTrackingPrompt()) {
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
    const instance = new TrackingOptIn(options);
    instance.render();
    return instance;
}
