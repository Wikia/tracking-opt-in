import {h, render} from 'preact';
import ContentManager from './ContentManager';
import LanguageManager from './LangManager';
import App from './components/App';
import OptInManager from "./OptInManager";
import GeoManager from "./GeoManager";

let root = null;
let hotOptions = null;
const defaultOptions = {
    cookieName: null, // use default cookie name
    cookieExpiration: null, // use default
    country: null, // country code
    countriesRequiringPrompt: null, // array of lower case country codes
    language: null,
    zIndex: 1000,
    onAcceptTracking() {
        console.log('user opted in to tracking');
    },
    onRejectTracking() {
        console.log('user opted out of tracking');
    },
};

function getAppRoot() {
    if (root !== null) {
        return root;
    }

    root = document.createElement('div');
    document.body.appendChild(root);

    return root;
}

function removePrompt() {
    const root = getAppRoot();
    render(null, root, root.lastChild);
}

function runApp(AppComponent, appOptions) {
    const root = getAppRoot();
    const options = Object.assign({}, defaultOptions, appOptions);
    const optInManager = new OptInManager(options.cookieName, options.cookieExpiration);
    const geoManager = new GeoManager(options.country, options.countriesRequiringPrompt);
    const langManager = new LanguageManager(options.language);
    const contentManager = new ContentManager(langManager.lang);

    if (!geoManager.needsTrackingPrompt()) {
        options.onAcceptTracking();
    } else if (optInManager.hasAcceptedTracking()) {
        options.onAcceptTracking();
    } else if (optInManager.hasRejectedTracking()) {
        options.onRejectTracking();
    } else {
        render(
            <AppComponent
                onRequestAppRemove={removePrompt}
                optInManager={optInManager}
                options={options}
                content={contentManager.content}
            />,
            root,
            root.lastChild
        );
    }
}

function trackingOptIn(options) {
    hotOptions = options;
    runApp(App, options);
}

if (module.hot) {
    module.hot.accept(['./components/App'], () => {
        const newApp = require('./components/App').default;
        runApp(newApp, hotOptions);
    });
}

export default trackingOptIn;
