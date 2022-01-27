import { debug } from '../shared/utils';
import TrackingEventsQueue from '../tracking/TrackingEventsQueue';

const EVENT_NAME = 'gdpr_events';

const TRACK_PARAMS = {
    LANGUAGE_CODE: 'lang_code',
    DETECTED_GEO: 'detected_geo',
    CATEGORY: 'ga_category',
    ACTION: 'ga_action',
    LABEL: 'ga_label',
};

const TRACKING_CATEGORY = 'gdpr-modal';
const ACTION_IMPRESSION = 'impression';
const ACTION_CLICK = 'click';

class Tracker {
    constructor(language, detectedGeo, enable, platform, env) {
        this.enable = enable;
        this.defaultParams = {
            name: EVENT_NAME,
            couldBeTrackedWithoutConsent: true,
            platform: platform,
            env: env,
            [TRACK_PARAMS.LANGUAGE_CODE]: language,
            [TRACK_PARAMS.DETECTED_GEO]: detectedGeo,
        };
    }

    track(category, action, label) {
        const event = {
            ...this.defaultParams,
            [TRACK_PARAMS.CATEGORY]: category,
            [TRACK_PARAMS.ACTION]: action,
            [TRACK_PARAMS.LABEL]: label,
        };

        if (!this.enable) {
            debug('TRACKING', 'Fake Tracking Event', params);
            return;
        }
        TrackingEventsQueue.get(window).push(event);
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
}

export default Tracker;
