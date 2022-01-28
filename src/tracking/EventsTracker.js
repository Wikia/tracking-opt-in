import TrackingEventsQueue from './TrackingEventsQueue';
import TrackingParameters from './TrackingParameters';
import CookiesBaker from './CookiesBaker';
import Cookies from 'js-cookie';

class TrackableEvent {
    name;
    platform;
    env;

    //onDWHTrackingComplete
    //couldBeTrackedWithoutConsent
}

function invalidEvent(event) {
    return !event || !event['name'];
}

function buildDefaultAssigners(options) {
    const assigners = [];
    if (options.env !== undefined) {
        assigners.push(
            event => setDefaultValue(event, options.env, 'env'));
    }
    if (options.platform !== undefined) {
        assigners.push(
            event => setDefaultValue(event, options.platform, 'platform'));
    }
    return assigners;
}

function setDefaultValue(event, defaultValue, property) {
    if (event[property] === undefined) {
        event[property] = defaultValue;
    }
}

export default class EventsTracker {
    static build(container, options) {
        return new EventsTracker(TrackingEventsQueue.get(container), options);
    }

    constructor(eventsQueue, options) {
        this.eventsQueue = eventsQueue;
        this.options = options;
        this.senders = options.trackingEventsSenders;
        this.eventsQueue.registerListener(this);
        this.defaultParametersAssigner = buildDefaultAssigners(options);
        this.cookiesBaker = new CookiesBaker(options.cookies);
    }

    startTracking(allowedToTrack) {
        const cookiesJar = allowedToTrack ? Cookies.get() : {};
        this.notAllowedToTrackWithoutConsent = !allowedToTrack;
        this.pageTrackingParameters = TrackingParameters.fromCookiesJar(cookiesJar, this.options.trackingParameters);
        this.eventsQueue.flush();
        if (allowedToTrack) {
            this.cookiesBaker.setOrExtendCookies(this.pageTrackingParameters.toCookiesJar(), cookiesJar);
        }
        return this;
    }

    onFlush(event) {
        if (invalidEvent(event)) {
            return false;
        }
        if (this.notAllowedToTrackWithoutConsent && event['couldBeTrackedWithoutConsent'] !== true) {
            return false;
        }
        event = this.pageTrackingParameters.copyTo(event);
        this.defaultParametersAssigner.forEach(assigner => assigner(event));
        this.senders.forEach(sender => sender.send(event));
        return true;
    }
}

