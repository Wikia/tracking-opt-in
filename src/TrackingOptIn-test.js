import { assert } from 'chai';
import { stub, createStubInstance } from 'sinon';
import TrackingOptIn from './TrackingOptIn';
import OptInManager from './OptInManager';
import GeoManager from './GeoManager';
import ContentManager from './ContentManager';
import ConsentManagementProvider from './ConsentManagementProvider';
import Tracker from './Tracker';
import styles from './components/styles.scss';

const document = global.document;

describe('TrackingOptIn', () => {
    let trackingOptIn;
    let tracker;
    let optInManager;
    let geoManager;
    let contentManager;
    let consentManagementProvider;
    let onAcceptTracking;
    let onRejectTracking;
    let options;

    function modalIsShown() {
        return document.querySelector(`.${styles.overlay}`);
    }

    beforeEach(() => {
        tracker = createStubInstance(Tracker);
        optInManager = createStubInstance(OptInManager);
        geoManager = createStubInstance(GeoManager);
        consentManagementProvider = createStubInstance(ConsentManagementProvider);
        contentManager = new ContentManager('en');
        onAcceptTracking = stub();
        onRejectTracking = stub();

        options = {
            onAcceptTracking,
            onRejectTracking,
        };

        trackingOptIn = new TrackingOptIn(tracker, optInManager, geoManager, contentManager, consentManagementProvider, options, window.location);
    });

    afterEach(() => {
        trackingOptIn.removeApp();
    });

    it('renders when the user has not consented in a geo that requires consent', () => {
        geoManager.needsTrackingPrompt.withArgs().returns(true);
        geoManager.hasGeoCookie.withArgs().returns(true);
        optInManager.hasAcceptedTracking.withArgs().returns(false);
        optInManager.hasRejectedTracking.withArgs().returns(false);

        trackingOptIn.render();

        assert.isOk(modalIsShown());
    });

    it('not renders when user is visiting through mobile app', () => {
        geoManager.needsTrackingPrompt.withArgs().returns(true);
        geoManager.hasGeoCookie.withArgs().returns(true);
        optInManager.hasAcceptedTracking.withArgs().returns(false);
        optInManager.hasRejectedTracking.withArgs().returns(false);

        let windowLocation = JSON.parse(JSON.stringify(window.location));
        const previousHref = windowLocation.href;
        delete window.location;

        windowLocation.href = 'http://fandom.com/foo/bar?mobile-app=true';

        Object.defineProperty(window, 'location', {
            value: windowLocation
        });

        trackingOptIn.render();

        assert.isNotOk(modalIsShown());

        delete window.location;

        windowLocation.href = previousHref;

        Object.defineProperty(window, 'location', {
            value: windowLocation
        });
    });

    it('calls accept callback when the user geo does not require consent', () => {
        geoManager.needsTrackingPrompt.withArgs().returns(false);
        geoManager.hasGeoCookie.withArgs().returns(true);

        trackingOptIn.render();

        assert.isNotOk(modalIsShown());
    });

    it('calls accept callback when the user has already consented', () => {
        geoManager.needsTrackingPrompt.withArgs().returns(true);
        optInManager.hasAcceptedTracking.withArgs().returns(true);
        geoManager.hasGeoCookie.withArgs().returns(true);

        trackingOptIn.render();

        assert.isNotOk(modalIsShown());
        assert.isOk(onAcceptTracking.called);
    });

    it('calls reject callback when the user has already rejected', () => {
        geoManager.needsTrackingPrompt.withArgs().returns(true);
        optInManager.hasAcceptedTracking.withArgs().returns(false);
        optInManager.hasRejectedTracking.withArgs().returns(true);
        geoManager.hasGeoCookie.withArgs().returns(true);

        trackingOptIn.render();

        assert.isNotOk(modalIsShown());
        assert.isOk(onRejectTracking.called);
    });

    it('re-renders on reset()', () => {
        geoManager.needsTrackingPrompt.withArgs().returns(true);
        geoManager.hasGeoCookie.withArgs().returns(true);
        optInManager.hasAcceptedTracking.withArgs().returns(false);
        optInManager.hasRejectedTracking.withArgs().returns(false);

        trackingOptIn.render();
        assert.isOk(modalIsShown());

        trackingOptIn.removeApp();
        assert.isNotOk(modalIsShown());

        trackingOptIn.reset();
        assert.isOk(modalIsShown());
    });

<<<<<<< HEAD
    it('does not display on https://fandom.com/partner-list', () => {
        trackingOptIn = new TrackingOptIn(tracker, optInManager, geoManager, contentManager, consentManagementProvider, options, {host: 'www.fandom.com', pathname: '/partner-list'});
=======
    it('does not display on fandom.com/partner-list', () => {
        trackingOptIn = new TrackingOptIn(tracker, optInManager, geoManager, contentManager, consentManagementProvider, options, {host: 'fandom.wikia.com', pathname: '/partner-list'});
>>>>>>> e778674f5dd56bbdb52dd7f41cd229267783e1d9
        geoManager.needsTrackingPrompt.withArgs().returns(true);
        geoManager.hasGeoCookie.withArgs().returns(true);
        optInManager.hasAcceptedTracking.withArgs().returns(false);
        optInManager.hasRejectedTracking.withArgs().returns(false);

        trackingOptIn.render();
        assert.isNotOk(modalIsShown());

        trackingOptIn.reset();
        assert.isOk(modalIsShown());
    });

<<<<<<< HEAD
    it('does not display on https://www.fandom.com/privacy-policy', () => {
        trackingOptIn = new TrackingOptIn(tracker, optInManager, geoManager, contentManager, consentManagementProvider, options, {host: 'www.fandom.com', pathname: '/privacy-policy'});
=======
    it('does not display on http://www.fandom.com/privacy-policy', () => {
        trackingOptIn = new TrackingOptIn(tracker, optInManager, geoManager, contentManager, consentManagementProvider, options, {host: 'www.wikia.com', pathname: '/Privacy_Policy'});
>>>>>>> e778674f5dd56bbdb52dd7f41cd229267783e1d9
        geoManager.needsTrackingPrompt.withArgs().returns(true);
        geoManager.hasGeoCookie.withArgs().returns(true);
        optInManager.hasAcceptedTracking.withArgs().returns(false);
        optInManager.hasRejectedTracking.withArgs().returns(false);

        trackingOptIn.render();
        assert.isNotOk(modalIsShown());

        trackingOptIn.reset();
        assert.isOk(modalIsShown());
    })
});
