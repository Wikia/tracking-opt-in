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
     * @param optInManager
     */
    constructor(hostname, optInManager) {
        this.domain = getCookieDomain(hostname || window.location.hostname);
        this.separator = '|';
        // 1 year. Long enough for transition, short enough not to delete it in code after transition.
        this.expires = 365;
        this.optInManager = optInManager;
        this.version = 1;
    }

    /**
     * Check
     */
    init() {
        if (!this.getCookie()) {
            this.clearStatus();
            if (this.optInManager.hasAcceptedTracking()) {
                this.setStatus(true);
            } else if (this.optInManager.hasRejectedTracking()) {
                this.setStatus(false);
            }
        }
    }

    /**
     * @returns TransitionStatus
     */
    getStatus() {
         return this.decodeCookie(this.getCookie());
    }

    /**
     * @param {boolean|null} optIn
     */
    setStatus(optIn) {
        const status = this.getStatus();

        if (optIn === null) {
            delete status[this.version];
        } else {
            status[this.version] = optIn ? STATUS.ACCEPTED : STATUS.REJECTED;
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
        Cookies.set(TRANSITION_STATUS_COOKIE_NAME, cookie, { expires: this.expires });
    }
}

export default TransitionOptInStatusTracker;
