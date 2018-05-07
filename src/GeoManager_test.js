import { assert } from 'chai';
import { getCountryFromCookie } from "./GeoManager";

describe('getCountryFromCookie tests', () => {
    it('no cookies returns false', () => {
        const countryCode = getCountryFromCookie();
        assert.equal(countryCode, false);
    });
});
