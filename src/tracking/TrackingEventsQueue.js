const TRACKABLE_EVENTS_QUEUE_CAPACITY = 1000;

export default class TrackingEventsQueue {
    constructor(events) {
        this.events = [];
        this.listeners = [];
        this.autoFlushMode = false;
        if (events) {
            this.events.push(events);
        }
    }

    static get(container) {
        let queue = container.fandomTrackingEventsQueue;

        if (!queue) {
            queue = new TrackingEventsQueue();
            container.fandomTrackingEventsQueue = queue;
        } else if (Array.isArray(queue)) {
            queue = new TrackingEventsQueue(queue);
            container.fandomTrackableEventsQueue = queue;
        }
        return queue;
    }

    registerListener(listener) {
        if (listener) {
            this.listeners.push(listener);
        }
    }

    push(event) {
        if (this.events.length >= TRACKABLE_EVENTS_QUEUE_CAPACITY) {
            return false;
        }
        if (this.autoFlushMode) {
            this.onFlush(event);
        } else {
            this.events.push(event);
        }
        return true;
    }

    flush() {
        let e;
        while (e = this.events.shift()) {
            this.onFlush(e);
        }
        this.autoFlushMode = true;
    }

    onFlush(event) {
        for (const listener of this.listeners) {
            listener.onFlush(event);
        }
    }
}
