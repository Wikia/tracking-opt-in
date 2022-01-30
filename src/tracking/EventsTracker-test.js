import { assert } from 'chai';
import EventsTracker from './EventsTracker';
import TrackingEventsQueue from './TrackingEventsQueue';
import sinon from 'sinon';
import { COOKIES } from './cookie-config';
import Cookies from 'js-cookie';

const BEACON_VALUE = "beacon";
const sandbox = sinon.createSandbox();
const sender = { send: sandbox.spy() };
let tracker;
let queue;

describe('EventsTracker', () => {
    beforeEach(() => {
        Cookies.set('wikia_beacon_id', BEACON_VALUE);
        const container = {};
        tracker = EventsTracker.build(container, {
            trackingEventsSenders: [sender]
        });
        queue = TrackingEventsQueue.get(container);
    });

    afterEach(() => {
        COOKIES.forEach(cookie => Cookies.remove(cookie.name));
        sandbox.reset();
    });

    if('should process events queued before tracker is build', () => {
        const queue = [];
        const container = { fandomTrackingEventsQueue: queue };
        queue.push({});
        queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'track!' });
        queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'and track more!' });

        // when
        EventsTracker
            .build(container, { trackingEventsSenders: sender })
            .startTracking(true);

        // then
        assert.equal(sender.send.callCount, 2);
    })

    it('should not send invalid events', () => {
        // given
        queue.push({});
        queue.push({ action: 'test' });
        queue.push({ name: 'test' });
        queue.push({ name: 'test', env: 'dev' });
        queue.push({ name: 'test', platform: 'ios' });

        // when
        tracker.startTracking(true);

        // then
        assert.equal(sender.send.callCount, 3);
    });

    it('should send events with tracking parameters', () => {
        // given
        queue.push({ name: 'view', env: 'dev', platform: 'ios', action: 'track!' });

        // when
        tracker.startTracking(true)

        // then
        assert.isOk(sender.send.called);
        assert.isOk(sender.send.calledWithMatch(sinon.match.has('env', 'dev')));
        assert.isOk(sender.send.calledWithMatch(sinon.match.has('beacon', BEACON_VALUE)));
        assert.isOk(sender.send.calledWithMatch(sinon.match.has('b2')));
        assert.isOk(sender.send.calledWithMatch(sinon.match.has('pv_unique_id')));
        assert.isOk(sender.send.calledWithMatch(sinon.match.has('pv_number')));
        assert.isOk(sender.send.calledWithMatch(sinon.match.has('pv_number_global')));
    });

    it('should send all stacked events after flush', () => {
        // given
        for (let i = 1; i <= 1000; i++) {
            queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'track!' });
        }

        // when
        tracker.startTracking(true)

        // then
        assert.equal(sender.send.callCount, 1000);
    })

    it('should not stack more than 1000 events before flush', () => {
        // given
        for (let i = 1; i < 2134; i++) {
            queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'track!' });
        }

        // when
        tracker.startTracking(true)

        // then
        assert.equal(sender.send.callCount, 1000);
    });

    it('should send events that could be send without consent if one is not given', () => {
        // given
        queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'track!' });
        queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'track!' });
        queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'track!', couldBeTrackedWithoutConsent: true });

        // when
        tracker.startTracking(false)

        // then
        assert.isOk(sender.send.calledOnce);
    });
});
