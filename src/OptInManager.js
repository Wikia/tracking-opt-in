import Cookies from 'js-cookie';
import { getCookieDomain } from './utils';
import { CMP_VERSION } from './ConsentManagementProvider';

const DEFAULT_ACCEPT_COOKIE_EXPIRATION = 18250; // 50 years in days
const DEFAULT_REJECT_COOKIE_EXPIRATION = 31;
export const DEFAULT_QUERY_PARAM_NAME = 'tracking-opt-in-status';
export const DEFAULT_COOKIE_NAME = 'tracking-opt-in-status';
export const VERSION_COOKIE_NAME = 'tracking-opt-in-version';
export const STATUS = {
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
};

class OptInManager {
    constructor(hostname, cookieName, acceptExpiration, rejectExpiration, queryParam) {
        this.cookieName = cookieName || DEFAULT_COOKIE_NAME;
        this.acceptExpiration = acceptExpiration || DEFAULT_ACCEPT_COOKIE_EXPIRATION;
        this.rejectExpiration = rejectExpiration || DEFAULT_REJECT_COOKIE_EXPIRATION;
        this.domain = getCookieDomain(hostname || window.location.hostname);
        this.queryParam = queryParam || DEFAULT_QUERY_PARAM_NAME;
    }

    checkCookieVersion() {
        const versionCookieValue = Cookies.get(VERSION_COOKIE_NAME);

        if (!versionCookieValue || parseInt(versionCookieValue, 10) < CMP_VERSION) {
            this.clear();

            return true;
        }

        return false;
    }

    getValue() {
        return Cookies.get(this.cookieName);
    }

    hasAcceptedTracking() {
        return this.getValue() === STATUS.ACCEPTED;
    }

    hasRejectedTracking() {
        return this.getValue() === STATUS.REJECTED;
    }

    setCookies(name, value, attributes = {}) {
        if (this.domain) {
            attributes.domain = this.domain;
        }

        Cookies.set(name, value, attributes);
        Cookies.set(VERSION_COOKIE_NAME, CMP_VERSION, attributes);
    }

    setTrackingAccepted() {
        this.setCookies(this.cookieName, STATUS.ACCEPTED, {
            expires: this.acceptExpiration,
            vendorList: {} // add the vendor list the user has agreed to accept
        });
    }

    setForcedStatusFromQueryParams(queryString) {
        if (queryString.indexOf(`${this.queryParam}=true`) !== -1) {
            this.setTrackingAccepted();
        } else if (queryString.indexOf(`${this.queryParam}=false`) !== -1) {
            this.setTrackingRejected();
        }
    }

    setTrackingRejected() {
        this.setCookies(this.cookieName, STATUS.REJECTED, {
            expires: this.rejectExpiration,
        });
    }

    clear() {
        const attributes = this.domain ? { domain: this.domain } : {};
        Cookies.remove(this.cookieName, attributes);
        Cookies.remove(VERSION_COOKIE_NAME, attributes);
    }
}

export default OptInManager;
