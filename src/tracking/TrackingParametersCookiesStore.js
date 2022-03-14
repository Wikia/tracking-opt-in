import Cookies from 'js-cookie';
import { getCookieDomain } from '../shared/utils';
import { COOKIES } from './cookie-config';

export default class TrackingParametersCookiesStore {
    constructor(cookies = COOKIES) {
        const domain = getCookieDomain(window.location.hostname);
        cookies.forEach(cookie => {
            if (!cookie.options.hasOwnProperty('domain')) {
                cookie.options.domain = domain;
            }
        })
        this.cookies = cookies;
        this.cookieValues = Cookies.get();
    }

    getPlainValues() {
        const cookieValues = this.cookieValues;
        return this.cookies
            .filter(cookie => cookie.name && cookie.param)
            .reduce((params, cookie) => (params[cookie.param] = cookieValues[cookie.name], params), {});
    }

    save(params) {
        const paramValues = (params ? params.values : {}) || {};
        let value;

        for (const cookie of this.cookies) {
            value = (cookie.param ? paramValues[cookie.param] : undefined) || this.cookieValues[cookie.name];

            if (value === undefined && cookie.value !== undefined) {
                value = typeof(cookie.value) === 'function' ? cookie.value() : cookie.value;
            }
            if (value) {
                Cookies.set(cookie.name, value, cookie.options);
            }
        }
    }
}
