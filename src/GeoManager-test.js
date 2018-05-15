import { assert } from 'chai';
import GeoManager from "./GeoManager";

const countryRequiringPrompt = 'PL';
const countryNotRequiringPrompt = 'US';

describe('with provided options', () => {
    it('correctly indicates required consent', () => {
        const geoManager = new GeoManager(countryRequiringPrompt, [countryRequiringPrompt]);
        assert.isOk(geoManager.needsTrackingPrompt());
    });

    it('correctly indicates consent is not required', () => {
        const geoManager = new GeoManager(countryNotRequiringPrompt, [countryRequiringPrompt]);
        assert.isNotOk(geoManager.needsTrackingPrompt());
    });
});
