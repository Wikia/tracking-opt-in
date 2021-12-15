import Cookies from 'js-cookie';
import { getCookieDomain } from './utils';

class CookieManager {
    constructor(cookies, beaconServiceUrl) {
        this.domain = getCookieDomain(window.location.hostname);
        this.beaconServiceUrl = beaconServiceUrl;
        this.cookieValues = {};
        this.sessionCookies = cookies.map((cookie) => ({
            ...cookie,
            value: this.getSessionCookiesValue(cookie.name),
        }));

        if (this.sessionCookies[0] && !this.sessionCookies[0].value) {
            this.generateCookieValuesFromServiceResponse((cookies) => {
               Object.keys(cookies).forEach( (name) => {
                  this.setCookieValues(name, cookies[name]);
               });
            });
        }
    }

    setCookieValues(name, value) {
        this.cookieValues[name] = value;
    }

    getSessionCookiesValue(name) {
        let resultValue = Cookies.get(name);

        if (!resultValue && !this.cookieValues[name]) {
            console.warn(`No ${name} found in headers`);
        }

        if (this.cookieValues[name]) {
            resultValue = this.cookieValues[name];
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

    generateCookieValuesFromServiceResponse(callback) {
        if (typeof(window.fetch) !== 'function') {
            console.warn('The browser does not support Fetch API');
            return;
        }

        if (this.beaconServiceUrl === '') {
            console.warn('Incorrect beacon service URL');
            return;
        }

        let cookies = {};
        fetch().then(function(response) {
            cookies = parseBeaconServiceResponse(response);
        }).then(() => callback(cookies));
    }

    parseBeaconServiceResponse(response) {
        const responseArr = response.split(';')
            .filter((value) => value !== '' )
            .map((value) => value.split('='))
            .map((pairs) => {
                if (pairs.length > 0) {
                    return [pairs[0].replace('var ', '').trim(), pairs[1]]
                }
            } )
            .map( (pairs) => [pairs[0], pairs[1].replace('"', '').replace('\"', '').trim()] );

        let result = {};
        responseArr.forEach((pair) => {
            result[pair[0]] = pair[1];
        });

        return result;
    }
}

export default CookieManager;
