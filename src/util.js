import Cookies from 'js-cookie';

export const COOKIE_NAME = 'tracking-opt-in-status';
const ACCEPT_COOKIE_EXPIRATION = 18250; // 50 years in days
const STATUS = {
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
};

function getCookieDomain() {
    const parts = window.location.hostname.split('.');
    if (parts.length < 2) {
        return window.location.hostname;
    }

    return `.${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}

function getCookieValue() {
    return Cookies.get(COOKIE_NAME);
}

export function userAcceptsTracking() {
    return getCookieValue() === STATUS.ACCEPTED;
}

export function userRejectsTracking() {
    const value = window.sessionStorage ? window.sessionStorage.getItem(COOKIE_NAME) : getCookieValue();
    return value === STATUS.REJECTED;
}

export function setAcceptTracking() {
    Cookies.set(COOKIE_NAME, STATUS.ACCEPTED, {
        expires: ACCEPT_COOKIE_EXPIRATION,
        domain: getCookieDomain(),
    });
}

export function setRejectTracking() {
    if (window.sessionStorage) {
        window.sessionStorage.setItem(COOKIE_NAME, STATUS.REJECTED);
    } else {
        Cookies.set(COOKIE_NAME, STATUS.REJECTED, {
            domain: getCookieDomain(),
        });
    }
}

export function clear() {
    if (window.sessionStorage) {
        window.sessionStorage.removeItem(COOKIE_NAME);
    }

    Cookies.remove(COOKIE_NAME, { domain: getCookieDomain() });
}
