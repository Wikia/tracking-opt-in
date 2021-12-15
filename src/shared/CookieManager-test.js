import { assert } from 'chai';
import Cookies from 'js-cookie';

import { SESSION_COOKIES } from './consts';
import CookieManager from "./CookieManager";

const mockedCookieWikiaSessionId = '12345';
const mockedCookieWikiaBeaconId = '67890';
const mockedCookieB2 = '02468';

const mockedHeaderWikiaSessionId = '02468';
const mockedHeaderWikiaBeaconId = '12345';
const mockedHeaderB2 = '67890';

describe('CookieManager', () => {
    describe('in country not requiring the prompt', () => {
        it('gets value from the cookies', () => {
            const cookieManager = new CookieManager(SESSION_COOKIES, '');

            Cookies.set('wikia_session_id', mockedCookieWikiaSessionId);
            Cookies.set('wikia_beacon_id', mockedCookieWikiaBeaconId);
            Cookies.set('_b2', mockedCookieB2);

            assert.equal(cookieManager.getSessionCookiesValue('wikia_session_id'), mockedCookieWikiaSessionId);
            assert.equal(cookieManager.getSessionCookiesValue('wikia_beacon_id'), mockedCookieWikiaBeaconId);
            assert.equal(cookieManager.getSessionCookiesValue('_b2'), mockedCookieB2);

            Cookies.remove('wikia_session_id');
            Cookies.remove('wikia_beacon_id');
            Cookies.remove('_b2');
        });
    });

    describe('in country requiring the prompt', () => {
        it('gets value from the headers', () => {
            const cookieManager = new CookieManager(SESSION_COOKIES, '');

            cookieManager.setCookieValues('wikia_session_id', mockedHeaderWikiaSessionId);
            cookieManager.setCookieValues('wikia_beacon_id', mockedHeaderWikiaBeaconId);
            cookieManager.setCookieValues('_b2', mockedHeaderB2);

            assert.equal(cookieManager.getSessionCookiesValue('wikia_session_id'), mockedHeaderWikiaSessionId);
            assert.equal(cookieManager.getSessionCookiesValue('wikia_beacon_id'), mockedHeaderWikiaBeaconId);
            assert.equal(cookieManager.getSessionCookiesValue('_b2'), mockedHeaderB2);
        });
    });
});
