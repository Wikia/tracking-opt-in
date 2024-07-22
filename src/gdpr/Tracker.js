import Cookies from 'js-cookie';
import { debug } from '../shared/utils';
import { communicationService } from "../shared/communication";

const DEFAULT_BEACON_COOKIE_NAME = 'wikia_beacon_id';
const TRACKING_BASE = 'https://beacon.wikia-services.com/__track/special/gdpr_events';
const TRACK_PARAMS = {
    LANGUAGE_CODE: 'lang_code',
    DETECTED_GEO: 'detected_geo',
    DETECTED_REGION: 'detected_region',
    CATEGORY: 'ga_category',
    ACTION: 'ga_action',
    LABEL: 'ga_label',
    BEACON: 'beacon',
    PV_UNIQUE_ID: 'pv_unique_id',
};
const TRACK_TIMEOUT = 3000;

const TRACKING_CATEGORY = 'gdpr-modal';
const ACTION_IMPRESSION = 'impression';
const ACTION_CLICK = 'click';

function getBeaconFromCookie(cookieName) {
    return Cookies.get(cookieName || DEFAULT_BEACON_COOKIE_NAME);
}

function getPvUniqueId() {
    return window.fandomContext?.tracking?.pvUID
}

class Tracker {
    constructor(language, detectedGeo, detectedRegion, beaconCookieName, enable) {
        this.enable = enable;
        this.defaultParams = {
            [TRACK_PARAMS.LANGUAGE_CODE]: language,
            [TRACK_PARAMS.DETECTED_GEO]: detectedGeo,
            [TRACK_PARAMS.DETECTED_REGION]: detectedRegion.toUpperCase(),
        };

        const beacon = getBeaconFromCookie(beaconCookieName);
        if (beacon) {
            this.defaultParams[TRACK_PARAMS.BEACON] = beacon;
        }
        this.onIdentityReady = new Promise((resolve) => {
            communicationService.on('[IdentityEngine] Identity ready', () => resolve());
        })
    }

    track(category, action, label, onComplete = () => {}) {
        if (!this.enable) {
            debug('TRACKING', 'Fake Tracking Event', params);
            return;
        }

        this.onIdentityReady.then(() => {
            const url = this.prepareTrackUrl(category, action, label);

            const controller = new AbortController();
            fetch(url, { signal: controller.signal });
            setTimeout(() => controller.abort(), TRACK_TIMEOUT);
        });
    }

    prepareTrackUrl(category, action, label) {
        const params = {
            ...this.defaultParams,
            [TRACK_PARAMS.CATEGORY]: category,
            [TRACK_PARAMS.ACTION]: action,
            [TRACK_PARAMS.LABEL]: label,
        };

        const pvUniqueId = getPvUniqueId();

        if (pvUniqueId) {
            params[TRACK_PARAMS.PV_UNIQUE_ID] = pvUniqueId;
        }

        const requestParams = [];
        for (const p in params) {
            requestParams.push(`${encodeURIComponent(p)}=${encodeURIComponent(params[p])}`);
        }
        return `${TRACKING_BASE}?${requestParams.join('&')}`;
    }

    /**
     * Shortcuts
     */
    trackImpression(label) {
        this.track(TRACKING_CATEGORY, ACTION_IMPRESSION, label);
    }

    trackClick(label) {
        this.track(TRACKING_CATEGORY, ACTION_CLICK, label);
    }

    /**
     * All tracking events
     * @see https://docs.google.com/spreadsheets/d/1SdKVYFpAcW4xnLDOhLmpZ1h-Kr8Dq2a0tk-fb_GEEms/edit#gid=0
     */
    trackViewImpression() {
        this.trackImpression('modal-view');
    }

    trackNoCookieImpression() {
        this.trackImpression('no-cookie');
    }

    trackGpcImpression() {
        this.trackImpression('gpc');
    }

    trackPrivacyPolicyClick() {
        this.trackClick('privacy-policy');
    }

    trackPartnerListClick() {
        this.trackClick('partner-list');
    }

    trackLearnMoreClick() {
        this.trackClick('learn-more');
    }

    trackVendorExpandClick() {
        this.trackClick('vendor-expand');
    }

    trackAcceptClick() {
        this.trackClick('accept');
    }

    trackBackClick() {
        this.trackClick('back');
    }

    trackSaveClick() {
        this.trackClick('save');
    }

    trackRejectClick() {
        this.trackClick('reject');
    }

    trackPurposeToggleClick(id) {
        this.trackClick(`purpose-toggle-${id}`);
    }

    trackPurposeExpandClick(id) {
        this.trackClick(`purpose-expand-${id}`);
    }

    trackSpecialFeatureToggleClick(id) {
        this.trackClick(`special-feature-toggle-${id}`);
    }

    trackSpecialFeatureExpandClick(id) {
        this.trackClick(`special-feature-expand-${id}`);
    }

    trackInternalUseExpandClick() {
        this.trackClick('internal-use-expand');
    }

    trackAdditionalConsentExpandClick() {
        this.trackClick('additional-consent-expand');
    }

    trackAdditionalConsentProviderToggleClick(id) {
        this.trackClick(`additional-consent-provider-toggle-${id}`);
    }
}

export default Tracker;
