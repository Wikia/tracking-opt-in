import { h, render } from 'preact';
import { expect, assert } from 'chai';
import { createStubInstance, stub }  from 'sinon';
import App from './App';
import styles from './styles.scss';
import stylesScreenOne from './ScreenOne.scss';
import ContentManager from "../ContentManager";
import Tracker from '../Tracker';
import OptInManager from "../OptInManager";
import GeoManager from "../GeoManager";

const document = global.document;

function findByClass(wrapper, className) {
    return wrapper.getElementsByClassName(className).item(0) || new HTMLElement();
}

function noop() {}

describe('App', () => {
    let tracker;
    let optInManager;
    let geoManager;
    let wrapper;

    function renderApp(callbacks = {}, preventScrollOn = null) {
        tracker = createStubInstance(Tracker);
        optInManager = createStubInstance(OptInManager);
        geoManager = createStubInstance(GeoManager);

        return render(h(App, {
            tracker,
            optInManager,
            geoManager,
            onRequestAppRemove: callbacks.onRequestAppRemove || noop,
            onAcceptTracking: callbacks.onAcceptTracking || noop,
            onRejectTracking: callbacks.onRejectTracking || noop,
            content: (new ContentManager('en')).content,
            options: {
                preventScrollOn
            },
        }), document.body);
    }

    function removeApp() {
        render(null, document.body, document.body.lastChild);
    }

    afterEach(() => {
        tracker = null;
        optInManager = null;
        wrapper = null;
        removeApp();
    });

    it('renders the modal', () => {
        const wrapper = renderApp();
        expect(wrapper.className).to.equal(styles.overlay);

        const container = findByClass(wrapper, styles.container);
        expect(container).to.not.equal(null);
        expect(container.className).to.equal(styles.container);

        const content = findByClass(wrapper, stylesScreenOne.content);
        expect(content).to.not.equal(null);
        expect(content.className).to.equal(stylesScreenOne.content);
    });

    it('calls the appropriate funcs on accept button click', () => {
        const onAcceptTracking = stub();
        const onRequestAppRemove = stub();

        const wrapper = renderApp({ onAcceptTracking, onRequestAppRemove });
        const acceptButton = findByClass(wrapper, styles.acceptButton);
        expect(acceptButton).to.not.equal(null);
        acceptButton.click();

        assert.isOk(onAcceptTracking.called);
        assert.isOk(onRequestAppRemove.called);
        assert.isOk(tracker.track.called);
        assert.isOk(optInManager.setTrackingAccepted.called);
    });

    describe('with preventScrollOn', () => {
        it('adds a class to the body element and removes it when unmounted', () => {
            renderApp({}, 'body');
            assert.isOk(document.querySelector('body').classList.contains(styles.withTrackingOptInDialogShown));

            removeApp();
            assert.isNotOk(document.querySelector('body').classList.contains(styles.withTrackingOptInDialogShown));
        });

        it('accepts a dom element', () => {
            const body = document.querySelector('body');
            renderApp({}, body);
            assert.isOk(body.classList.contains(styles.withTrackingOptInDialogShown));
        });
    });
});
