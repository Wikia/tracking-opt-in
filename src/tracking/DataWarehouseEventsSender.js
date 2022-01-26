const TRACKING_BASE_URL = 'https://beacon.wikia-services.com/__track/';
const TIMEOUT_MS = 3000;

function getEventPath(name) {
    name = !name ? 'view' : name.toLowerCase();
    return name === 'view' || name === 'pageview' ? 'view' : 'special/' + name;
}

export default class DataWarehouseEventsSender {
    send(event) {
        if (!event) return;

        const path = getEventPath(event.name);
        delete event.name;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const urlParams = Object.keys(event)
            .filter((k) => event[k] || event[k] === 0)
            .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(event[k]))
            .join('&');
        const onComplete = event['onDWHTrackingComplete'] || this.onComplete;

        fetch(`${TRACKING_BASE_URL}${path}?${urlParams}`, {
            mode: 'no-cors',
            keepalive: true,
            signal: controller.signal
        }).then(onComplete).finally(() => clearTimeout(timeout));
    }

    onComplete (result) {
    }
}
