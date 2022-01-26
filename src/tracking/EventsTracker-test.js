import { assert } from 'chai';
import EventsTracker from "./EventsTracker";
import TrackingEventsQueue, {TrackableEvent} from "./TrackingEventsQueue";
import sinon from "sinon";
import { COOKIE_NAMES } from "./cookie-config";

const sandbox = sinon.createSandbox();
const sender = { send: sandbox.spy() };
let tracker;
let queue;

describe('EventsTracker', () => {
    beforeEach(() => {
        const container = {};
        tracker = EventsTracker.build(container, sender);
        queue = TrackingEventsQueue.get(container);
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('should not send invalid events', () => {
        // given
        queue.push({});
        queue.push({ name: 'test' });
        queue.push({ name: 'test', env: 'dev' });
        queue.push({ name: 'test', platform: 'ios' });

        // when
        tracker.startTracking(true, {});

        // then
        assert.isOk(sender.send.notCalled)
    });

    it('should send events with tracking parameters', () => {
        // given
        const cookieJar = {
            [COOKIE_NAMES.BEACON]: 'beacon',
        };
        queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'track!' });

        // when
        tracker.startTracking(true, cookieJar)

        // then
        assert.isOk(sender.send.called);
        assert.isOk(sender.send.calledWithMatch(
            sinon.match.has('env', 'dev').and(
                sinon.match.has('beacon', 'beacon')).and(
                    sinon.match.has('pv_unique_id')))
        );
    });

    it('should send all stacked events after flush', () => {
        // given
        for (let i = 1; i <= 1000; i++) {
            queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'track!' });
        }

        // when
        tracker.startTracking(true, {})

        // then
        assert.equal(sender.send.callCount, 1000);
    })

    it('should not stack more than 1000 events before flush', () => {
        // given
        for (let i = 1; i < 2134; i++) {
            queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'track!' });
        }

        // when
        tracker.startTracking(true, {})

        // then
        assert.equal(sender.send.callCount, 1000);
    });

    it('should send events that could be send without consent if one is not given', () => {
        // given
        queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'track!' });
        queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'track!' });
        queue.push({ name: 'test', env: 'dev', platform: 'ios', action: 'track!', couldBeTrackedWithoutConsent: true });

        // when
        tracker.startTracking(false, {})

        // then
        assert.isOk(sender.send.calledOnce);
    });
});
