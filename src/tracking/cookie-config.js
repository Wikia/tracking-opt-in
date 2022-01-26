import { randomString } from "../shared/utils";

export const COOKIE_NAMES = {
    WIKIA_SESSION: 'wikia_session_id',
    BEACON: 'wikia_beacon_id',
    BEACON_V2: '_b2',
    TRACKING_SESSION: 'tracking_session_id',
    PAGE_VIEW_NUMBER: 'pv_number',
    GLOBAL_PAGE_VIEW_NUMBER: 'pv_number_global'
};

export const COOKIES = [
    {
        name: COOKIE_NAMES.BEACON_V2,
        options: {
            expires: 730, /* 2 years in days */
        }
    },
    {
        name: COOKIE_NAMES.BEACON,
        options: {
            expires: 183, /* 6 months in days */
        },
    },
    {
        name: COOKIE_NAMES.WIKIA_SESSION,
        value: randomString,
        options: {
            expires: 183, /* 6 months in days */
        },
    },
    {
        name: COOKIE_NAMES.TRACKING_SESSION,
        options: {
            expires: 1 / 48, /* half an hour in days */
            secure: true,
            sameSite: 'None',
        },
    },
    {
        name: COOKIE_NAMES.PAGE_VIEW_NUMBER,
        options: {
            expires: 1 / 48, /* half an hour in days */
            domain: '',
            secure: true,
            sameSite: 'None',
        },
    },
    {
        name: COOKIE_NAMES.GLOBAL_PAGE_VIEW_NUMBER,
        options: {
            expires: 1 / 48, /* half an hour in days */
            secure: true,
            sameSite: 'None',
        },
    }
];
