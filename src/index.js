import './script-public-path';
import { ensureGeoAvailable } from './shared/GeoManager';
import trackingOptIn from "./tracking-opt-in";

export default trackingOptIn;

const autostartModal = (geo) => {
    if (!window.trackingOptInManualStart) {
        const options = {
            ...(geo ?? {}),
            ...(window.trackingOptInOptions ?? {}),
        };
        trackingOptIn(options).then((optInInstances) => {
            window.trackingOptInInstances = optInInstances;
        });
    }
};

ensureGeoAvailable().then((geo) => {
    if (document.readyState !== 'loading') {
        autostartModal(geo);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            autostartModal(geo);
        });
    }
});
