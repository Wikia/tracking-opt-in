import Cookies from 'js-cookie';

export const COOKIE_NAME = 'cookie-opt-in-status';
const ACCEPT_COOKIE_EXPIRATION = 18250; // 50 years in days
const STATUS = {
    ACCEPTED: 'accepted',
    HIDE: 'hide',
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

export function userHidesTrackingPrompt() {
    const value = window.sessionStorage ? window.sessionStorage.getItem(COOKIE_NAME) : getCookieValue();
    return value === STATUS.HIDE;
}

export function setTrackingAccepted() {
    Cookies.set(COOKIE_NAME, STATUS.ACCEPTED, {
        expires: ACCEPT_COOKIE_EXPIRATION,
        domain: getCookieDomain(),
    });
}

export function setHideTrackingPrompt() {
    if (window.sessionStorage) {
        window.sessionStorage.setItem(COOKIE_NAME, STATUS.HIDE);
    } else {
        Cookies.set(COOKIE_NAME, STATUS.HIDE, {
            domain: getCookieDomain(),
        });
    }
}

export function removeCookie() {
    Cookes.remove(COOKIE_NAME, { domain: getCookieDomain() });
}
