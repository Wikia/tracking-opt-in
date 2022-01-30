import { assert } from 'chai';
import Cookies from 'js-cookie';
import TrackingParametersCookiesStore from './TrackingParametersCookiesStore';
import { COOKIES } from './cookie-config';

const mockedCookieWikiaSessionId = '12345';
const mockedCookieWikiaBeaconId = '67890';
const mockedCookieB2 = '02468';

describe('TrackingParametersCookiesStore', () => {
    afterEach(() => {
        COOKIES.forEach(cookie => Cookies.remove(cookie.name));
    });

    it('should not existing cookies', () => {
        // given
        Cookies.set('wikia_beacon_id', mockedCookieWikiaBeaconId);
        Cookies.set('_b2', mockedCookieB2);
        Cookies.set('wikia_session_id', mockedCookieWikiaSessionId);

        // when
        new TrackingParametersCookiesStore().save({});

        // then
        assert.equal(Cookies.get('wikia_session_id'), mockedCookieWikiaSessionId);
        assert.equal(Cookies.get('wikia_beacon_id'), mockedCookieWikiaBeaconId);
        assert.equal(Cookies.get('_b2', true), mockedCookieB2);
    });

    it('it should generate new cookie values', () => {
        // given
        Cookies.set('wikia_beacon_id', mockedCookieWikiaBeaconId);
        Cookies.set('_b2', mockedCookieB2);

        // when
        new TrackingParametersCookiesStore().save({});
        const newCookie = Cookies.get('wikia_session_id');

        // then
        assert.isString(newCookie);
        assert.equal(newCookie.length, 10);
    });
});
