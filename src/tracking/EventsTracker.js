import TrackingEventsQueue from './TrackingEventsQueue';
import TrackingParameters from './TrackingParameters';
import TrackingParametersCookiesStore from './TrackingParametersCookiesStore';
import { communicationService } from '../shared/communication';

const CONSENTS_ACTION = '[AdEngine OptIn] set opt in';

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

function isAllowedToTrack(action) {
    // this will also cover non GDPR regions including CCPA as well,
    // as they all will have this set to true
    // Look in the ./gdpr/ConsentManagementPlatform.js for "non GDPR including CCPA" comment.
    return action.trackingNotPossible !== true && action.gdprConsent === true;
}

export default class EventsTracker {
    static build(container, options) {
        return new EventsTracker(TrackingEventsQueue.get(container, options.eventQueueSingletonName), options);
    }

    constructor(eventsQueue, options) {
        this.eventsQueue = eventsQueue;
        this.senders = options.trackingEventsSenders;
        this.eventsQueue.registerListener(this);
        this.defaultParametersAssigner = buildDefaultAssigners(options);
        this.pageTrackingParameters = new TrackingParameters(options.trackingParameters);
        this.pageTrackingParametersStore = options.trackingParametersStore ?
            options.trackingParametersStore : new TrackingParametersCookiesStore(options.cookies);
        this.listenOnConsentAction();
    }

    listenOnConsentAction() {
        const tracker = this;
        communicationService.listen(action => {
            if (action.type === CONSENTS_ACTION) {
                tracker.startTracking(isAllowedToTrack(action));
            }
        });
    }

    startTracking(allowedToTrack) {
        this.notAllowedToTrackWithoutConsent = !allowedToTrack;
        this.pageTrackingParameters.fromPlainValues(this.pageTrackingParametersStore.getPlainValues());
        this.eventsQueue.flush();
        if (allowedToTrack) {
            this.pageTrackingParametersStore.save(this.pageTrackingParameters);
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

