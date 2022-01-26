import { v4 as uuid } from 'uuid';
import { randomString, randomStringWithTimestamp } from "../shared/utils";
import { COOKIE_NAMES } from "./cookie-config";

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
        cookieName: COOKIE_NAMES.TRACKING_SESSION,
        valueGenerator: uuid
    },
    {
        name: TRACKING_PARAMETER_NAMES.BEACON,
        cookieName: COOKIE_NAMES.BEACON,
        valueGenerator: randomString
    },
    {
        name: TRACKING_PARAMETER_NAMES.BEACON_V2,
        cookieName: COOKIE_NAMES.BEACON_V2,
        valueGenerator: randomStringWithTimestamp
    },
    {
        name: TRACKING_PARAMETER_NAMES.PAGE_VIEW_NUMBER,
        cookieName: COOKIE_NAMES.PAGE_VIEW_NUMBER,
        valueGenerator: () => 1,
        transformer: increment,
    },
    {
        name: TRACKING_PARAMETER_NAMES.GLOBAL_PAGE_VIEW_NUMBER,
        cookieName: COOKIE_NAMES.GLOBAL_PAGE_VIEW_NUMBER,
        valueGenerator: () => 1,
        transformer: increment,
    },
    {
        name: TRACKING_PARAMETER_NAMES.PAGE_VIEW_UID,
        valueGenerator: uuid,
    }
]

function increment(value) {
    return (parseInt(value) || 0) + 1;
}
