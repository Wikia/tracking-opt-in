import Cookies from 'js-cookie';
import { getCookieDomain } from './utils';

class CookieManager {
    constructor(cookies, beaconServiceUrl) {
        this.domain = getCookieDomain(window.location.hostname);
        this.beaconServiceUrl = beaconServiceUrl;
        this.sessionCookies = cookies.map((cookie) => ({
            ...cookie,
            value: this.getSessionCookiesValue(cookie.name),
        }));
    }

    getSessionCookiesValue(name) {
        let resultValue = Cookies.get(name);

        if (!resultValue) {
        // for users from GDPR countries if they did not give consent for tracking
        // we assign random values to session cookies; should match results of:
        // https://developer.fastly.com/reference/vcl/functions/randomness/randomstr/
            resultValue = (Math.random().toString(36) + '_________________').slice(2, 12)
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
