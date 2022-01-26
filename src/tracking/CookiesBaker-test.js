import { assert } from 'chai';
import Cookies from 'js-cookie';
import CookiesBaker from "./CookiesBaker";
import { COOKIES } from "./cookie-config";

const mockedCookieWikiaSessionId = '12345';
const mockedCookieWikiaBeaconId = '67890';
const mockedCookieB2 = '02468';

describe('CookiesBaker', () => {
    afterEach(() => {
        COOKIES.forEach(cookie => Cookies.remove(cookie.name));
    });

    it('should not override baked cookies', () => {
        // given
        const cookies = {
            'wikia_session_id': mockedCookieWikiaSessionId,
            'wikia_beacon_id': mockedCookieWikiaBeaconId,
            '_b2': mockedCookieB2,
        }

        // when
        new CookiesBaker(COOKIES).setOrExtendCookies(cookies);

        // then
        assert.equal(Cookies.get('wikia_session_id'), mockedCookieWikiaSessionId);
        assert.equal(Cookies.get('wikia_beacon_id'), mockedCookieWikiaBeaconId);
        assert.equal(Cookies.get('_b2', true), mockedCookieB2);
    });

    it('it should bake cookies with own baker recipe', () => {
        // given
        const cookies = {
            'wikia_beacon_id': mockedCookieWikiaBeaconId,
            '_b2': mockedCookieB2
        }
        // when
        new CookiesBaker(COOKIES).setOrExtendCookies(cookies);
        const newCookie = Cookies.get('wikia_session_id');

        // then
        assert.isString(newCookie);
        assert.equal(newCookie.length, 10);
    });
});
