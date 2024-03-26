import { assert } from 'chai';
import GeoManager from "./GeoManager";

const countryRequiringPrompt = 'PL';
const countryNotRequiringPrompt = 'US';

describe('GeoManager', () => {
    describe('with provided options', () => {
        it('indicates consent is required', () => {
            const geoManager = new GeoManager(countryRequiringPrompt, null, [countryRequiringPrompt]);
            assert.isOk(geoManager.hasSpecialPrivacyLaw());
        });

        it('indicates consent is not required', () => {
            const geoManager = new GeoManager(countryNotRequiringPrompt, null, [countryRequiringPrompt]);
            assert.isNotOk(geoManager.hasSpecialPrivacyLaw());
        });
    });
});
