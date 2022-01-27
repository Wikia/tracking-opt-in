import { assert } from 'chai';
import EventsTracker from './EventsTracker';
import TrackingEventsQueue from './TrackingEventsQueue';
import sinon from 'sinon';
import { COOKIES } from './cookie-config';
import Cookies from 'js-cookie';

const sandbox = sinon.createSandbox();
const sender = { send: sandbox.spy() };
let tracker;
let queue;

function and(matchers) {
    let result = matchers.shift();
    let matcher;

    while (matcher = matchers.shift()) {
        result = result.and(matcher);
    }
    return result;
}

describe('EventsTracker', () => {
    beforeEach(() => {
        const container = {};
        tracker = EventsTracker.build(container, { trackingEventsSenders: sender });
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
        queue.push({ name: 'test' });
        queue.push({ name: 'test', env: 'dev' });
        queue.push({ name: 'test', platform: 'ios' });

        // when
        tracker.startTracking(true);

        // then
        assert.isOk(sender.send.notCalled)
    });

    it('should send events with tracking parameters', () => {
        // given
        queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'track!' });
        Cookies.set('wikia_beacon_id', 'beacon');

        // when
        tracker.startTracking(true)

        // then
        assert.isOk(sender.send.called);
        assert.isOk(sender.send.calledWithMatch(and([
            sinon.match.has('env', 'dev'),
            sinon.match.has('beacon', 'beacon'),
            sinon.match.has('pv_unique_id')
        ])));
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
