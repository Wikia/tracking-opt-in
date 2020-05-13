import Cookies from 'js-cookie';
import { getCookieDomain } from '../shared/utils';
import { STATUS } from './OptInStatus';

/**
 * Stores opt-in status of TCF v1 and v2.
 * @typedef {Object.<number, string>} TransitionStatus
 */

export const TRANSITION_STATUS_COOKIE_NAME = 'tracking-opt-in-transition-status';

// ToDo: Remove TransitionOptInStatusTracker and it's uses once TCF v2 replaces v1
export class TransitionOptInStatusTracker {
    /**
     *
     * @param {string} [hostname]
     */
    constructor(hostname) {
        this.domain = getCookieDomain(hostname || window.location.hostname);
        this.separator = '|';

        if (!this.getCookie()) {
            this.clearStatus();
        }
    }

    /**
     * @returns TransitionStatus
     */
    getStatus() {
         return this.decodeCookie(this.getCookie());
    }

    /**
     * @param {number} version
     * @param {boolean|null} optIn
     */
    setStatus(version, optIn) {
        const status = this.getStatus();

        if (optIn === null) {
            delete status[version];
        } else {
            status[version] = optIn ? STATUS.ACCEPTED : STATUS.REJECTED;
        }

        this.setCookie(this.encodeCookie(status));
    }

    /**
     * @param {number} [version]
     */
    clearStatus(version) {
        if (!version) {
            this.setCookie(this.separator);
        } else {
            this.setStatus(version, null);
        }
    }

    /**
     * @private
     * @param {string} cookie
     * @returns TransitionStatus
     */
    decodeCookie(cookie) {
        const [v1, v2] = cookie.split(this.separator);

        return { 1: v1, 2: v2 };
    }

    /**
     * @private
     * @param {TransitionStatus} status
     * @returns string
     */
    encodeCookie(status) {
        return `${status[1] || ''}${this.separator}${status[2] || ''}`;
    }

    /**
     * @private
     * @returns string
     */
    getCookie() {
        return Cookies.get(TRANSITION_STATUS_COOKIE_NAME) || '';
    }

    /**
     * @private
     * param {string} cookie
     */
    setCookie(cookie) {
        Cookies.set(TRANSITION_STATUS_COOKIE_NAME, cookie);
    }
}

export default TransitionOptInStatusTracker;
