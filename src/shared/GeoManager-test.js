import { assert } from 'chai';
import Cookies from 'js-cookie';
import GeoManager, { COUNTRY_COOKIE_NAME } from "./GeoManager";

const countryRequiringPrompt = 'PL';
const countryNotRequiringPrompt = 'US';

function setGeoCookie(country) {
    Cookies.set(COUNTRY_COOKIE_NAME, {
        region: 'CA',
        country,
        continent: 'NA'
    });
}

describe('GeoManager', () => {
    describe('with provided options', () => {
        it('indicates consent is required', () => {
            const geoManager = new GeoManager(countryRequiringPrompt, null, [countryRequiringPrompt]);
            assert.isOk(geoManager.isCountryInScope());
        });

        it('indicates consent is not required', () => {
            const geoManager = new GeoManager(countryNotRequiringPrompt, null, [countryRequiringPrompt]);
            assert.isNotOk(geoManager.isCountryInScope());
        });
    });

    describe('with default options', () => {
        after(() => {
            Cookies.remove(COUNTRY_COOKIE_NAME);
        });

        describe('and geo cookie present', () => {
            it('indicates consent is required', () => {
                setGeoCookie(countryRequiringPrompt);
                assert.isOk(new GeoManager().isCountryInScope());
            });

            it('indicates consent is not required', () => {
                setGeoCookie(countryNotRequiringPrompt);
                assert.isNotOk(new GeoManager().isCountryInScope());
            });
        });

        describe('and unparseable geo cookie', () => {
            it('indicates consent is required', () => {
                Cookies.set(COUNTRY_COOKIE_NAME, '{}');
                assert.isNotOk(new GeoManager().isCountryInScope());
            });
        });

        describe('and no geo cookie', () => {
            it('indicates consent is required', () => {
                Cookies.remove(COUNTRY_COOKIE_NAME);
                assert.isNotOk(new GeoManager().isCountryInScope());
            });
        });
    });
});
