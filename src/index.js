import { h, render } from 'preact';
import App from './App';

let root = null;
let hotOptions = null;
const defaultOptions = {
    zIndex: 1000,
    onOptInToTracking() {
        console.log('user opted into tracking');
    },
    onOptOutOfTracking() {
        console.log('user opted out of tracking');
    },
};

const getAppRoot = () => {
    if (root !== null) {
        return root;
    }

    root = document.createElement('div');
    document.body.appendChild(root);

    return root;
};

const renderApp = (AppComponent, appOptions) => {
    const root = getAppRoot();
    const options = Object.assign({}, defaultOptions, appOptions);

    render(
        <AppComponent
            options={options}
        />,
        root,
        root.lastChild
    );
};

if (module.hot) {
    module.hot.accept(['./App'], () => {
        const newApp = require('./App').default;
        renderApp(newApp, hotOptions);
    });
}

export default (options) => {
    hotOptions = options;
    renderApp(App, options);
}
