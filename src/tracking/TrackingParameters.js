import { TRACKING_PARAMETERS, TRACKING_PARAMETER_NAMES } from "./tracking-params-config";

export default class TrackingParameters {
    [TRACKING_PARAMETER_NAMES.SESSION];
    [TRACKING_PARAMETER_NAMES.BEACON];
    [TRACKING_PARAMETER_NAMES.BEACON_V2];
    [TRACKING_PARAMETER_NAMES.PAGE_VIEW_UID];
    [TRACKING_PARAMETER_NAMES.PAGE_VIEW_NUMBER];
    [TRACKING_PARAMETER_NAMES.GLOBAL_PAGE_VIEW_NUMBER];

    readOrGenerate(cookiesJar) {
        cookiesJar = cookiesJar || {};
        for (const param of TRACKING_PARAMETERS) {
            const value = param.cookieName ? cookiesJar[param.cookieName] : undefined;

            if (value) {
                this[param.name] = param.transformer ? param.transformer(value) : value;
            } else if (!this[param.name]) {
                this[param.name] = param.valueGenerator();
            }
        }
        return this;
    }

    toCookies() {
        const cookies = {};
        for (const param of TRACKING_PARAMETERS) {
            if (param.cookieName) {
                cookies[param.cookieName] = this[param.name];
            }
        }
        return cookies;
    }

    static fromCookiesJar(cookiesJar) {
        return new TrackingParameters().readOrGenerate(cookiesJar);
    }
}
