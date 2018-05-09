import Cookies from 'js-cookie';

const DEFAULT_COOKIE_NAME = 'tracking-opt-in-status';
const DEFAULT_ACCEPT_COOKIE_EXPIRATION = 18250; // 50 years in days
const STATUS = {
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
    constructor(cookieName, expirationInDays, domain) {
        this.cookieName = cookieName || DEFAULT_COOKIE_NAME;
        this.expirationInDays = expirationInDays || DEFAULT_ACCEPT_COOKIE_EXPIRATION;
        this.domain = domain || getCookieDomain();
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

    setTrackingRejected() {
        Cookies.set(this.cookieName, STATUS.REJECTED);
    }

    clear() {
        const attributes = this.domain ? { domain: this.domain } : {};
        Cookies.remove(this.cookieName, attributes);
    }
}

export default OptInManager;
