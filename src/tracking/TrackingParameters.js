import { TRACKING_PARAMETERS } from "./tracking-params-config";

export default class TrackingParameters {
    constructor(trackingParameters) {
        this.trackingParameters = trackingParameters;
        this.values = {};
    }

    readOrGenerate(cookiesJar) {
        cookiesJar = cookiesJar || {};
        for (const param of this.trackingParameters) {
            const value = param.cookieName ? cookiesJar[param.cookieName] : undefined;

            if (value !== undefined) {
                this.values[param.name] = param.transformer ? param.transformer(value) : value;
            } else if (this[param.name] === undefined) {
                this.values[param.name] = param.valueGenerator();
            }
        }
        return this;
    }

    toCookiesJar() {
        const cookies = {};
        for (const param of this.trackingParameters) {
            if (param.cookieName) {
                cookies[param.cookieName] = this.values[param.name];
            }
        }
        return cookies;
    }

    copyTo(target) {
        return Object.assign(target, this.values);
    }

    static fromCookiesJar(cookiesJar, trackingParameters = TRACKING_PARAMETERS) {
        return new TrackingParameters(trackingParameters).readOrGenerate(cookiesJar);
    }
}
