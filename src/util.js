import Cookies from 'js-cookie';

export const COOKIE_NAME = 'cookie-opt-in-status';
const ACCEPT_COOKIE_EXPIRATION = 7; // days
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
    return getCookieValue() === STATUS.HIDE;
}

export function setTrackingAccepted() {
    Cookies.set(COOKIE_NAME, STATUS.ACCEPTED, {
        expires: ACCEPT_COOKIE_EXPIRATION,
        domain: getCookieDomain(),
    });
}

export function setHideTrackingPrompt() {
    Cookies.set(COOKIE_NAME, STATUS.HIDE, {
        domain: getCookieDomain(),
    });
}

export function removeCookie() {
    Cookes.remove(COOKIE_NAME, { domain: getCookieDomain() });
}
