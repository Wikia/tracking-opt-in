import { v4 as uuid } from 'uuid';
import { randomString, randomStringWithTimestamp } from '../shared/utils';

export const TRACKING_PARAMETER_NAMES = {
    SESSION: 'session_id',
    BEACON: 'beacon',
    BEACON_V2: 'b2',
    PAGE_VIEW_UID: 'pv_unique_id',
    PAGE_VIEW_NUMBER: 'pv_number',
    GLOBAL_PAGE_VIEW_NUMBER: 'pv_number_global'
};

export const TRACKING_PARAMETERS = [
    {
        name: TRACKING_PARAMETER_NAMES.SESSION,
        value: uuid
    },
    {
        name: TRACKING_PARAMETER_NAMES.BEACON,
        value: randomString
    },
    {
        name: TRACKING_PARAMETER_NAMES.BEACON_V2,
        value: randomStringWithTimestamp
    },
    {
        name: TRACKING_PARAMETER_NAMES.PAGE_VIEW_NUMBER,
        value: () => 1,
        transformer: increment,
        matcher: isPageView
    },
    {
        name: TRACKING_PARAMETER_NAMES.GLOBAL_PAGE_VIEW_NUMBER,
        value: () => 1,
        transformer: increment,
        matcher: isPageView
    },
    {
        name: TRACKING_PARAMETER_NAMES.PAGE_VIEW_UID,
        value: uuid,
    }
]

function isPageView(event) {
    const name = event.name.toLowerCase();
    return name === 'view' || name === 'pageview';
}

function increment(value) {
    return (parseInt(value, 10) || 0) + 1;
}
