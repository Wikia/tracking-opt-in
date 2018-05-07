import main from './index';

// handles the hot reloading so it doesn't get included in the babel build
let appInstance = null;

if (module.hot) {
    module.hot.accept(['./index'], () => {
        appInstance.removeApp();
        const newMain = require('./index').default;
        appInstance = newMain(appInstance.options);
    });
}

export default function devMain(options) {
    appInstance = main(options);
    return appInstance;
}
