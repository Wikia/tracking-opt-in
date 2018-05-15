import Cookies from 'js-cookie';

const DEFAULT_ACCEPT_COOKIE_EXPIRATION = 18250; // 50 years in days
export const DEFAULT_QUERY_PARAM_NAME = 'tracking-opt-in-status';
export const DEFAULT_COOKIE_NAME = 'tracking-opt-in-status';
export const STATUS = {
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
};

function getCookieDomain() {
    const parts = window.location.hostname.split('.');
    if (parts.length < 2) {
        return undefined;
    }

    return `.${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}

class OptInManager {
    constructor(cookieName, expirationInDays, queryParam) {
        this.cookieName = cookieName || DEFAULT_COOKIE_NAME;
        this.expirationInDays = expirationInDays || DEFAULT_ACCEPT_COOKIE_EXPIRATION;
        this.domain = getCookieDomain();
        this.queryParam = queryParam || DEFAULT_QUERY_PARAM_NAME;
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

    setTrackingAccepted() {
        const attributes = {
            expires: this.expirationInDays,
        };

        if (this.domain) {
            attributes.domain = this.domain;
        }

        Cookies.set(this.cookieName, STATUS.ACCEPTED, attributes);
    }

    setForcedStatusFromQueryParams(queryString) {
        if (queryString.indexOf(`${this.queryParam}=true`) !== -1) {
            this.setTrackingAccepted();
        } else if (queryString.indexOf(`${this.queryParam}=false`) !== -1) {
            this.setTrackingRejected();
        }
    }

    setTrackingRejected() {
        Cookies.set(this.cookieName, STATUS.REJECTED);
    }

    clear() {
        const attributes = this.domain ? { domain: this.domain } : {};
        Cookies.remove(this.cookieName, attributes);
    }
}

export default OptInManager;
