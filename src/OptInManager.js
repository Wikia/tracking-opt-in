import Cookies from 'js-cookie';
import {getCookieDomain} from './utils';

const DEFAULT_ACCEPT_COOKIE_EXPIRATION = 18250; // 50 years in days
const DEFAULT_REJECT_COOKIE_EXPIRATION = 31;
export const DEFAULT_QUERY_PARAM_NAME = 'tracking-opt-in-status';
export const DEFAULT_COOKIE_NAME = 'tracking-opt-in-status';
export const STATUS = {
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
};
export const VERSION_COOKIE_NAME = 'tracking-opt-in-version';
export const VERSION_CURRENT_ID = 2; // Increment to force modal again

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

        if (!versionCookieValue || parseInt(versionCookieValue) < VERSION_CURRENT_ID) {
            this.clear();
        }
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

    setCookie(name, value, attributes = {}) {
        if (this.domain) {
            attributes.domain = this.domain;
        }

        Cookies.set(name, value, attributes);
        Cookies.set(VERSION_COOKIE_NAME, VERSION_CURRENT_ID, attributes);
    }

    setTrackingAccepted() {
        this.setCookie(this.cookieName, STATUS.ACCEPTED, {
            expires: this.acceptExpiration,
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
        this.setCookie(this.cookieName, STATUS.REJECTED, {
            expires: this.rejectExpiration,
        });
    }

    clear() {
        const attributes = this.domain ? { domain: this.domain } : {};
        Cookies.remove(this.cookieName, attributes);
    }
}

export default OptInManager;
