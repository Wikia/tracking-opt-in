import { TRACKING_PARAMETERS } from './tracking-params-config';

export default class TrackingParameters {
    constructor(trackingParameters = TRACKING_PARAMETERS) {
        this.trackingParameters = trackingParameters;
        this.values = {};
    }

    fromPlainValues(plainValues) {
        plainValues = plainValues || {};
        for (const param of this.trackingParameters) {
            const value = plainValues[param.name];

            if (value !== undefined) {
                this.values[param.name] = param.transformer ? param.transformer(value) : value;
            } else if (param.value) {
                this.values[param.name] = typeof(param.value) === 'function' ? param.value() : param.value;
            }
        }
        return this;
    }

    copyTo(target) {
        for (const param of this.trackingParameters) {
            if (target[param.name] !== undefined) continue;
            if (param.matcher && !param.matcher(target)) continue;

            target[param.name] = this.values[param.name];
        }
        return target;
    }
}
