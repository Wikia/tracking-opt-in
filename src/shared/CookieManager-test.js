import { assert } from 'chai';
import Cookies from 'js-cookie';

import { SESSION_COOKIES } from './consts';
import CookieManager from "./CookieManager";

const mockedCookieWikiaSessionId = '12345';
const mockedCookieWikiaBeaconId = '67890';
const mockedCookieB2 = '02468';

describe('CookieManager', () => {
    afterEach(() => {
        Cookies.remove('wikia_session_id');
        Cookies.remove('wikia_beacon_id');
        Cookies.remove('_b2');
    });

    it('in country not requiring the prompt gets value from the cookies', () => {
        const cookieManager = new CookieManager(SESSION_COOKIES);

        Cookies.set('wikia_session_id', mockedCookieWikiaSessionId);
        Cookies.set('wikia_beacon_id', mockedCookieWikiaBeaconId);
        Cookies.set('_b2', mockedCookieB2);

        assert.equal(cookieManager.getSessionCookiesValue('wikia_session_id'), mockedCookieWikiaSessionId);
        assert.equal(cookieManager.getSessionCookiesValue('wikia_beacon_id'), mockedCookieWikiaBeaconId);
        assert.equal(cookieManager.getSessionCookiesValue('_b2', true), mockedCookieB2);
    });

    it('in country requiring the prompt gets random values of the right length', () => {
        const cookieManager = new CookieManager(SESSION_COOKIES);

        assert.equal(cookieManager.getSessionCookiesValue('wikia_session_id').length, 10);
        assert.equal(cookieManager.getSessionCookiesValue('wikia_beacon_id').length, 10);
        assert.equal(cookieManager.getSessionCookiesValue('_b2', true).length, 24);
    });

    it('in country requiring the prompt gets random values only once', () => {
        const cookieManager = new CookieManager(SESSION_COOKIES);

        const firstRandomWikiaSessionId = cookieManager.getSessionCookiesValue('wikia_session_id');
        const firstRandomWikiaBeaconId = cookieManager.getSessionCookiesValue('wikia_beacon_id');
        const firstRandomB2 = cookieManager.getSessionCookiesValue('_b2', true);

        assert.equal(cookieManager.getSessionCookiesValue('wikia_session_id'), firstRandomWikiaSessionId);
        assert.equal(cookieManager.getSessionCookiesValue('wikia_beacon_id'), firstRandomWikiaBeaconId);
        assert.equal(cookieManager.getSessionCookiesValue('_b2', true), firstRandomB2);
    });
});
