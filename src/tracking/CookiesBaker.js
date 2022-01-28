import Cookies from 'js-cookie';
import { getCookieDomain } from '../shared/utils';
import { COOKIES } from './cookie-config';

export default class CookiesBaker {
    constructor(cookies = COOKIES) {
        let domain = getCookieDomain(window.location.hostname);
        cookies.forEach(cookie => {
            if (!cookie.options.hasOwnProperty('domain')) {
                cookie.options.domain = domain;
            }
        })
        this.cookies = cookies;
    }

    setOrExtendCookies(cookieValues, orgCookiesJar = {}) {
        this.cookies.forEach(cookie => {
            let value = cookieValues[cookie.name] || orgCookiesJar[cookie.name];

            if (value === undefined && cookie.value !== undefined) {
                value = typeof(cookie.value) === 'function' ? cookie.value() : cookie.value;
            }
            if (value) {
                Cookies.set(cookie.name, value, cookie.options);
            }
        });
    }
}
