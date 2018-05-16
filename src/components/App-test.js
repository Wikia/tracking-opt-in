import { h, render } from 'preact';
import { expect, assert } from 'chai';
import { stub } from 'sinon';
import App from './App';
import styles from './styles.scss';
import ContentManager from "../ContentManager";
import Tracker from '../Tracker';
import OptInManager from "../OptInManager";

const document = global.document;

function findByClass(wrapper, className) {
    return wrapper.getElementsByClassName(className).item(0) || new HTMLElement();
}

function noop() {}

describe('App', () => {
    let tracker;
    let optInManager;
    let wrapper;

    function renderApp(callbacks = {}, preventScrollOn = null) {
        tracker = stub(new Tracker('en', true));
        optInManager = stub(new OptInManager());

        return render(h(App, {
            tracker,
            optInManager,
            onRequestAppRemove: callbacks.onRequestAppRemove || noop,
            content: (new ContentManager('en')).content,
            options: {
                preventScrollOn,
                onAcceptTracking: callbacks.onAcceptTracking || noop,
                onRejectTracking: callbacks.onRejectTracking || noop,
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

        const content = findByClass(wrapper, styles.content);
        expect(content).to.not.equal(null);
        expect(content.className).to.equal(styles.content);
    });

    it('calls the appropriate funcs on accept button click', () => {
        const onAcceptTracking = stub();
        const onRequestAppRemove = stub();

        const wrapper = renderApp({ onAcceptTracking, onRequestAppRemove });
        const acceptButton = findByClass(wrapper, styles.buttonPrimary);
        expect(acceptButton).to.not.equal(null);
        acceptButton.click();

        assert.isOk(onAcceptTracking.called);
        assert.isOk(onRequestAppRemove.called);
        assert.isOk(tracker.track.called);
        assert.isOk(optInManager.setTrackingAccepted.called);
    });

    it('calls the appropriate funcs on reject button click', () => {
        const onRejectTracking = stub();
        const onRequestAppRemove = stub();

        const wrapper = renderApp({ onRejectTracking, onRequestAppRemove });
        const rejectButton = findByClass(wrapper, styles.buttonSecondary);
        expect(rejectButton).to.not.equal(null);
        rejectButton.click();

        assert.isOk(onRejectTracking.called);
        assert.isOk(onRequestAppRemove.called);
        assert.isOk(tracker.track.called);
        assert.isOk(optInManager.setTrackingRejected.called);
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
