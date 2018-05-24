import { assert } from 'chai';
import { stub, createStubInstance } from 'sinon';
import TrackingOptIn from './TrackingOptIn';
import OptInManager from './OptInManager';
import GeoManager from './GeoManager';
import ContentManager from './ContentManager';
import Tracker from './Tracker';
import styles from './components/styles.scss';

const document = global.document;

describe('TrackingOptIn', () => {
    let trackingOptIn;
    let tracker;
    let optInManager;
    let geoManager;
    let contentManager;
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
        contentManager = new ContentManager('en');
        onAcceptTracking = stub();
        onRejectTracking = stub();

        options = {
            onAcceptTracking,
            onRejectTracking,
        };

        trackingOptIn = new TrackingOptIn(tracker, optInManager, geoManager, contentManager, options);
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

    it('does not display on fandom.wikia.com/partner-list', () => {
        trackingOptIn = new TrackingOptIn(tracker, optInManager, geoManager, contentManager, options, {host: 'fandom.wikia.com', pathname: '/partner-list'});
        geoManager.needsTrackingPrompt.withArgs().returns(true);
        geoManager.hasGeoCookie.withArgs().returns(true);
        optInManager.hasAcceptedTracking.withArgs().returns(false);
        optInManager.hasRejectedTracking.withArgs().returns(false);

        trackingOptIn.render();
        assert.isNotOk(modalIsShown());
    });

    it('does not display on http://www.wikia.com/Privacy_Policy', () => {
        trackingOptIn = new TrackingOptIn(tracker, optInManager, geoManager, contentManager, options, {host: 'www.wikia.com', pathname: '/Privacy_Policy'});
        geoManager.needsTrackingPrompt.withArgs().returns(true);
        geoManager.hasGeoCookie.withArgs().returns(true);
        optInManager.hasAcceptedTracking.withArgs().returns(false);
        optInManager.hasRejectedTracking.withArgs().returns(false);

        trackingOptIn.render();
        assert.isNotOk(modalIsShown());
    })
});
