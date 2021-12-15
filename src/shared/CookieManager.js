import Cookies from 'js-cookie';
import { getCookieDomain } from './utils';

class CookieManager {
    constructor(cookies) {
        this.domain = getCookieDomain(window.location.hostname);
        this.httpHeaders = {};
        this.sessionCookies = cookies.map((cookie) => ({
            ...cookie,
            value: this.getSessionCookiesValue(cookie.name),
        }));

        if (this.sessionCookies[0] && !this.sessionCookies[0].value) {
            this.generateSessionCookiesFromHeaders()
        }
    }

    setHttpHeader(name, value) {
        this.httpHeaders[name] = value;
    }

    getSessionCookiesValue(name) {
        let resultValue = Cookies.get(name);

        if (!resultValue && !this.httpHeaders[name]) {
            console.warn(`No ${name} found in headers`);
        }

        if (this.httpHeaders[name]) {
            resultValue = this.httpHeaders[name];
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

    generateSessionCookiesFromHeaders() {
        if(window.fetch) {
            const setHttpHeader = this.setHttpHeader;

            fetch(window.location.href, {
                method:'HEAD'
            }).then(function(response) {
                response.headers.forEach((value, header) => {
                    setHttpHeader(header, value)
                });
            })
        } else {
            console.warn('The browser does not support Fetch API');
        }
    }
}

export default CookieManager;
