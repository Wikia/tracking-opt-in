import TrackingEventsQueue from "./TrackingEventsQueue";
import DataWarehouseEventsSender from "./DataWarehouseEventsSender";
import TrackingParameters from "./TrackingParameters";

class TrackableEvent {
    name;
    platform;
    env;

    //onDWHTrackingComplete
    //couldBeTrackedWithoutConsent
}

export default class EventsTracker {
    static build(container, sender = null) {
        return new EventsTracker(TrackingEventsQueue.get(container), sender);
    }

    constructor(eventsQueue, sender) {
        this.eventsQueue = eventsQueue;
        this.senders = [sender ? sender : new DataWarehouseEventsSender()];
        this.pageTrackingParameters = {};
        this.eventsQueue.registerListener(this);
    }

    startTracking(allowedToTrack, cookiesJar) {
        this.notAllowedToTrackWithoutConsent = !allowedToTrack;
        this.pageTrackingParameters = TrackingParameters.fromCookiesJar(cookiesJar);
        this.eventsQueue.flush();
    }

    getTrackingParameters() {
        return this.pageTrackingParameters;
    }

    onFlush(event) {
        if (this.invalidEvent(event)) {
            return false;
        }
        if (this.notAllowedToTrackWithoutConsent && event['couldBeTrackedWithoutConsent'] !== true) {
            return false;
        }
        event = Object.assign(event, this.pageTrackingParameters);
        this.senders.forEach(sender =>
            sender.send(event)
        );
        return true;
    }

    invalidEvent(event) {
        return !event || !event['name'] || !event['env'] || !event['platform'];
    }
}

