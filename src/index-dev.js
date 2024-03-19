import './script-public-path';
import trackingOptIn from "./tracking-opt-in";

// this module handles the hot reloading so it doesn't get included in the babel build
let appInstance = null;
let appOptions = null;

if (module.hot) {
    module.hot.accept(['./index', './tracking-opt-in'], () => {
        appInstance.removeApp();
        const newTrackingOptIn = require('./tracking-opt-in').default;
        appInstance = newTrackingOptIn(appOptions);
    });
}

export default function devMain(options) {
    appOptions = options;
    appInstance = trackingOptIn(options);
    return appInstance;
}
