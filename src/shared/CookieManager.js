import Cookies from 'js-cookie';
import { getCookieDomain } from './utils';

class CookieManager {
    constructor(cookies) {
        this.domain = getCookieDomain(window.location.hostname);
        this.sessionCookies = cookies.map((cookie) => ({
            ...cookie,
            value: this.getSessionCookiesValue(cookie.name, cookie.addTimestamp)
        }));
    }

    getSessionCookiesValue(name, addTimestamp) {
        const resultValue = Cookies.get(name);

        if (!resultValue) {
            return this.generateValue(addTimestamp);
        }

        return resultValue;
    }

    generateValue(withTimestamp) {
        // for users from GDPR countries if they did not give consent for tracking
        // we assign random values to session cookies; should match results of:
        // https://developer.fastly.com/reference/vcl/functions/randomness/randomstr/
        const charsToPickFrom = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz_';

        let resultValue = '';
        for(resultValue; resultValue.length < 10;) {
            resultValue += charsToPickFrom[(Math.random() * charsToPickFrom.length) | 0];
        }

        if (withTimestamp) {
            resultValue += '.' + Date.now();
        }

        return resultValue;
    }

    setSessionCookiesOnAccept() {
        this.sessionCookies.forEach(({ name, value, extendTime }) => {
            Cookies.set(name, value, {
                expires: extendTime,
                domain: this.domain
            });
        });
    };
}

export default CookieManager;
