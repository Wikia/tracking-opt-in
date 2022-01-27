import TrackingEventsQueue from './TrackingEventsQueue';
import DataWarehouseEventsSender from './DataWarehouseEventsSender';
import TrackingParameters from './TrackingParameters';

class TrackableEvent {
    name;
    platform;
    env;

    //onDWHTrackingComplete
    //couldBeTrackedWithoutConsent
}

function invalidEvent(event) {
    return !event || !event['name'] || !event['env'] || !event['platform'];
}

function buildSenders(options) {
    const senders = [];

    if (options.trackingEventsSenders) {
        senders.push(options.trackingEventsSenders);
    } else {
        senders.push(new DataWarehouseEventsSender());
    }
    return senders;
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
        this.senders = buildSenders(options);
        this.eventsQueue.registerListener(this);
        this.defaultParametersAssigner = buildDefaultAssigners(options);
    }

    startTracking(allowedToTrack, cookiesJar) {
        this.notAllowedToTrackWithoutConsent = !allowedToTrack;
        this.pageTrackingParameters = TrackingParameters.fromCookiesJar(cookiesJar, this.options.trackingParameters);
        this.eventsQueue.flush();
    }

    getTrackingParametersAsCookies() {
        return this.pageTrackingParameters ? this.pageTrackingParameters.toCookiesJar() : {};
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

