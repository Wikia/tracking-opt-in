import Cookies from 'js-cookie';

const DEFAULT_BEACON_COOKIE_NAME = 'wikia_beacon_id';
const TRACKING_BASE = 'https://beacon.wikia-services.com/__track/special/gdpr_events';
const TRACK_PARAMS = {
    LANGUAGE_CODE: 'lang_code',
    DETECTED_GEO: 'detected_geo',
    CATEGORY: 'ga_category',
    ACTION: 'ga_action',
    LABEL: 'ga_label',
    BEACON: 'beacon',
};
const TRACK_TIMEOUT = 3000;

const TRACKING_CATEGORY = 'gdpr-modal';
const ACTION_IMPRESSION = 'impression';
const ACTION_CLICK = 'click';

function getBeaconFromCookie(cookieName) {
    return Cookies.get(cookieName || DEFAULT_BEACON_COOKIE_NAME);
}

class Tracker {
    constructor(language, detectedGeo, beaconCookieName, enable) {
        this.enable = enable;
        this.defaultParams = {
            [TRACK_PARAMS.LANGUAGE_CODE]: language,
            [TRACK_PARAMS.DETECTED_GEO]: detectedGeo,
        };
        this.tcfVersion = 1;

        const beacon = getBeaconFromCookie(beaconCookieName);
        if (beacon) {
            this.defaultParams[TRACK_PARAMS.BEACON] = beacon;
        }
    }

    // largely taken from https://github.com/Wikia/app/blob/a34191d/resources/wikia/modules/tracker.js
    track(category, action, label, onComplete = () => {}) {
        const params = {
            ...this.defaultParams,
            [TRACK_PARAMS.CATEGORY]: category,
            [TRACK_PARAMS.ACTION]: action,
            [TRACK_PARAMS.LABEL]: label,
        };

        if (!this.enable) {
            console.log('Fake Tracking Event', params);
            return;
        }

        const container = document.head || document.getElementsByTagName( 'head' )[ 0 ] || document.documentElement;
        const requestParams = [];

        for (const p in params) {
            requestParams.push(`${encodeURIComponent(p)}=${encodeURIComponent(params[p])}`);
        }

        let script = document.createElement('script');
        script.src = `${TRACKING_BASE}?${requestParams.join('&')}`;
        if ('async' in script) {
            script.async = true;
        }

        script.onload = script.onreadystatechange = function( abort ) {
            if ( abort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;

                // Remove the script
                if ( container && script.parentNode ) {
                    container.removeChild( script );
                }

                script = undefined;
                onComplete();
            }
        };

        container.insertBefore(script, container.firstChild);
        setTimeout(() => {
            if (script) {
                script.onload(true);
            }
        }, TRACK_TIMEOUT);
    }
    /**
     * Shortcuts
     */
    trackImpression(label) {
        this.track(this.getTrackingCategory(), ACTION_IMPRESSION, label);
    }

    trackClick(label) {
        this.track(this.getTrackingCategory(), ACTION_CLICK, label);
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

    trackPurposeInformationToggleClick() {
        this.trackClick('purpose-information-toggle');
    }

    trackPurposeInformationExpandClick() {
        this.trackClick('purpose-information-expand');
    }

    trackPurposePersonalizationToggleClick() {
        this.trackClick('purpose-personalization-toggle');
    }

    trackPurposePersonalizationExpandClick() {
        this.trackClick('purpose-personalization-expand');
    }

    trackPurposeContentToggleClick() {
        this.trackClick('purpose-content-toggle');
    }

    trackPurposeContentExpandClick() {
        this.trackClick('purpose-content-expand');
    }

    trackPurposeMeasurementToggleClick() {
        this.trackClick('purpose-measurement-toggle');
    }

    trackPurposeMeasurementExpandClick() {
        this.trackClick('purpose-measurement-expand');
    }

    trackPurposeAdToggleClick() {
        this.trackClick('purpose-ad-toggle');
    }

    trackPurposeAdExpandClick() {
        this.trackClick('purpose-ad-expand');
    }

    trackOtherPartnersToggleClick() {
        this.trackClick('other-partners-toggle');
    }

    trackOtherPartnersExpandClick() {
        this.trackClick('other-partners-expand');
    }

    getTrackingCategory() {
        return `${TRACKING_CATEGORY}_tcf-${this.tcfVersion}`;
    }
}

export default Tracker;
