import main from './index';

// this module handles the hot reloading so it doesn't get included in the babel build
let appInstance = null;
let appOptions = null;

if (module.hot) {
    module.hot.accept(['./index'], () => {
        appInstance.removeApp();
        const newMain = require('./index').default;
        appInstance = newMain(appOptions);
    });
}

export default function devMain(options) {
    appOptions = options;
    appInstance = main(options);
    return appInstance;
}
