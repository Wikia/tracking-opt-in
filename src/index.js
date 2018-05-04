import { h, render } from 'preact';
import App from './App';
import {userAcceptsTracking, userRejectsTracking} from './util';

let root = null;
let hotOptions = null;
const defaultOptions = {
    zIndex: 1000,
    onAcceptTracking() {
        console.log('user opted into tracking');
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

    if (userAcceptsTracking()) {
        options.onAcceptTracking();
    } else if (userRejectsTracking()) {
        options.onRejectTracking();
    } else {
        render(
            <AppComponent
                onRequestAppRemove={removePrompt}
                options={options}
            />,
            root,
            root.lastChild
        );
    }
}

function cookieOptIn(options) {
    hotOptions = options;
    runApp(App, options);
}

if (module.hot) {
    module.hot.accept(['./App'], () => {
        const newApp = require('./App').default;
        runApp(newApp, hotOptions);
    });
}

export default cookieOptIn;
