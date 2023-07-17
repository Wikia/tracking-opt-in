import { assert } from 'chai';
import { stub } from 'sinon';
import Cookies from 'js-cookie';

import { SESSION_COOKIES } from './consts';
import CookieManager from "./CookieManager";

const mockedCookieWikiaSessionId = '12345';
const mockedCookieWikiaBeaconId = '67890';
const mockedCookieB2 = '02468';

describe('CookieManager', () => {
    it('in country not requiring the prompt gets value from the cookies', () => {
        const cookieManager = new CookieManager(SESSION_COOKIES);

        const cookiesStub = stub(Cookies, 'get').callsFake((name) => {
            switch (name) {
                case 'tracking_session_id':
                    return mockedCookieWikiaSessionId;
                case 'wikia_beacon_id':
                    return mockedCookieWikiaBeaconId;
                case '_b2':
                    return mockedCookieB2;
                default:
                    return '';
            }
        });

        assert.equal(cookieManager.getSessionCookiesValue('tracking_session_id'), mockedCookieWikiaSessionId);
        assert.equal(cookieManager.getSessionCookiesValue('wikia_beacon_id'), mockedCookieWikiaBeaconId);
        assert.equal(cookieManager.getSessionCookiesValue('_b2', true), mockedCookieB2);

        cookiesStub.restore();
    });

    it('in country requiring the prompt gets random values of the right length', () => {
        const cookieManager = new CookieManager(SESSION_COOKIES);

        assert.equal(cookieManager.getSessionCookiesValue('tracking_session_id').length, 10);
        assert.equal(cookieManager.getSessionCookiesValue('wikia_beacon_id').length, 10);
        assert.equal(cookieManager.getSessionCookiesValue('_b2', true).length, 24);
    });

    it('generates strings that are always 10 chars long', () => {
        it( 'returns always 10 chars long string', () => {
            const cookieManager = new CookieManager(SESSION_COOKIES);

            assert.equal(cookieManager.generateValue().length, 10, 'generated value is not 10 chars long');
        });
    });
});
