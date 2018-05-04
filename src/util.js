import Cookies from 'js-cookie';

export const COOKIE_NAME = 'cookie-opt-in-status';
const ACCEPT_COOKIE_EXPIRATION = 7; // days
const STATUS = {
    ACCEPTED: 'accepted',
    HIDE: 'hide',
};

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
    Cookies.set(COOKIE_NAME, STATUS.ACCEPTED, { expires: ACCEPT_COOKIE_EXPIRATION });
}

export function setHideTrackingPrompt() {
    Cookies.set(COOKIE_NAME, STATUS.HIDE);
}
