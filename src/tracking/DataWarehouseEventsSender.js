const TRACKING_BASE_URL = 'https://beacon.wikia-services.com/__track/';
const TIMEOUT_MS = 3000;

function getEventPath(name) {
    if (!name) return 'view';
    name = name.toLowerCase();
    return name === 'view' || name === 'pageview' ? 'view' : 'special/' + name;
}

export default class DataWarehouseEventsSender {
    constructor (baseUrl = TRACKING_BASE_URL, timeout = TIMEOUT_MS, onComplete = () => {}) {
        this.baseUrl = baseUrl;
        this.timeout = timeout;
        this.onComplete = onComplete;
    }

    send(event) {
        if (!event) return;

        const path = getEventPath(event.name);
        delete event.name;

        const controller = new AbortController();
        const urlParams = Object.keys(event)
            .filter((k) => event[k] || event[k] === 0)
            .reduce((params, k) => (params.append(k, event[k]), params), new URLSearchParams());
        const onComplete = event['onDWHTrackingComplete'] || this.onComplete;
        const timeout = setTimeout(() => controller.abort(), this.timeout);

        fetch(`${this.baseUrl}${path}?${urlParams.toString()}`, {
            mode: 'no-cors',
            keepalive: true,
            signal: controller.signal
        }).then(onComplete).finally(() => clearTimeout(timeout));
    }
}
