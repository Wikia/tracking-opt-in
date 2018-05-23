const TRACKING_BASE = 'https://beacon.wikia-services.com/__track/special/gdpr_events';
const TRACK_PARAMS = {
    LANGUAGE_CODE: 'lang_code',
    DETECTED_GEO: 'detected_geo',
    CATEGORY: 'ga_category',
    ACTION: 'ga_action',
    LABEL: 'ga_label',
};
const TRACK_TIMEOUT = 3000;

class Tracker {
    constructor(language, detectedGeo, enable) {
        this.enable = enable;
        this.defaultParams = {
            [TRACK_PARAMS.LANGUAGE_CODE]: language,
            [TRACK_PARAMS.DETECTED_GEO]: detectedGeo,
        };
    }

    // largely taken from https://github.com/Wikia/app/blob/a34191d/resources/wikia/modules/tracker.js
    track(category, action, label, onComplete = () => {}) {
        if (!this.enable) {
            return;
        }

        const container = document.head || document.getElementsByTagName( 'head' )[ 0 ] || document.documentElement;
        const params = {
            ...this.defaultParams,
            [TRACK_PARAMS.CATEGORY]: category,
            [TRACK_PARAMS.ACTION]: action,
            [TRACK_PARAMS.LABEL]: label,
        };
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
}

export default Tracker;
