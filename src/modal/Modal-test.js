import { h, render } from 'preact';
import { expect, assert } from 'chai';
import { createStubInstance, stub }  from 'sinon';
import Modal from './Modal';
import styles from './styles.scss';
import stylesScreenOne from './ScreenOne.scss';
import ContentManager from '../shared/ContentManager';
import Tracker from '../gdpr/Tracker';
import OptInManager from '../gdpr/OptInManager';
import GeoManager from '../shared/GeoManager';

const document = global.document;

function findByClass(wrapper, className) {
    return wrapper.getElementsByClassName(className).item(0) || document.createElement('div');
}

function noop() {}

describe('Modal', () => {
    const tracker = new Tracker('en', 'geo', 'beacon', true);
    tracker.track = stub().callsFake((...a) => console.debug('Track', a));

    let optInManager;
    let geoManager;

    function renderApp(callbacks = {}, preventScrollOn = null) {
        optInManager = createStubInstance(OptInManager);
        geoManager = createStubInstance(GeoManager);

        const contentManager = new ContentManager('en');

        return contentManager.fetchTranslations().then(() => render(h(Modal, {
            tracker,
            optInManager,
            geoManager,
            onRequestAppRemove: callbacks.onRequestAppRemove || noop,
            onAcceptTracking: callbacks.onAcceptTracking || noop,
            onRejectTracking: callbacks.onRejectTracking || noop,
            onConsentsReady: callbacks.onConsentsReady || noop,
            content: contentManager.content,
            language: contentManager.language,
            options: {
                enabledPurposes: [],
                enabledVendors: [],
                preventScrollOn,
                zIndex: 1,
            },
        }), document.body));
    }

    function removeApp() {
        render(null, document.body, document.body.lastChild);
    }

    afterEach(() => {
        optInManager = null;
        removeApp();
    });

    it('renders ScreenOne by default', (done) => {
        renderApp().then((wrapper) => {
            expect(wrapper.className).to.equal(styles.overlay);

            const container = findByClass(wrapper, styles.dialog);
            expect(container).to.not.equal(null);
            expect(container.className.split(' ')).to.include(styles.dialog);

            const content = findByClass(wrapper, stylesScreenOne.content);
            expect(content).to.not.equal(null);
            expect(content.className).to.equal(stylesScreenOne.content);
            done();
        });
    });

    it('calls the appropriate funcs on accept button click', (done) => {
        const onAcceptTracking = stub();
        const onRequestAppRemove = stub();

        renderApp({ onAcceptTracking, onRequestAppRemove }).then((wrapper) => {
            const acceptButton = findByClass(wrapper, styles.acceptButton);
            expect(acceptButton).to.not.equal(null);
            acceptButton.click();

            assert.isOk(onAcceptTracking.called);
            assert.isOk(onRequestAppRemove.called);
            assert.isOk(tracker.track.called);
            assert.isOk(optInManager.setTrackingAccepted.called);
            done();
        });
    });

    describe('with preventScrollOn', () => {
        it('adds a class to the body element and removes it when unmounted', (done) => {
            renderApp({}, 'body').then(() => {
                assert.isOk(document.querySelector('body').classList.contains(styles.withTrackingOptInDialogShown));

                removeApp();
                assert.isNotOk(document.querySelector('body').classList.contains(styles.withTrackingOptInDialogShown));
                done();
            });
        });

        it('accepts a dom element', (done) => {
            const body = document.querySelector('body');
            renderApp({}, body).then(() => {
                assert.isOk(body.classList.contains(styles.withTrackingOptInDialogShown));
                done();
            });
        });
    });
});
