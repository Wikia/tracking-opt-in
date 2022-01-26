import Cookies from 'js-cookie';
import { getCookieDomain } from '../shared/utils';

class CookiesBaker {
    constructor(cookies) {
        let domain = getCookieDomain(window.location.hostname);
        cookies.forEach(cookie => {
            if (!cookie.options.hasOwnProperty('domain')) {
                cookie.options.domain = domain;
            }
        })
        this.cookies = cookies;
    }

    setOrExtendCookies(cookieValues) {
        this.cookies.forEach(cookie => {
            let value = cookieValues[cookie.name] || Cookies.get(cookie.name);

            if (!value && cookie.value) {
                value = typeof(cookie.value) === 'function' ? cookie.value() : cookie.value;
            }
            if (value) {
                Cookies.set(cookie.name, value, cookie.options);
            }
        });
    }
}

export default CookiesBaker;
