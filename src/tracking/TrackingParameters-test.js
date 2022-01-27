import { assert } from 'chai';
import TrackingParameters from './TrackingParameters';

describe('TrackingParameters', () => {
    it('should generate values', () => {
        // given
        const jar = { };

        // when
        const params = TrackingParameters.fromCookiesJar(jar);

        // then
        assert.isObject(params);
        assert.equal(params.pv_number_global, 1);
        assert.equal(params.pv_number, 1);
        assert.isString(params.beacon);
        assert.isString(params.session_id);
        assert.isString(params.b2);
        assert.isString(params.pv_unique_id);
    });

    it('should read values from cookies jar', ()=> {
        // given
        const cookiesJar = {
            '_b2': 'b2',
            'wikia_beacon_id': 'beacon',
            'pv_number': '10',
            'pv_number_global': '20',
            'tracking_session_id': 'sessionId'
        };

        // when
        const params = TrackingParameters.fromCookiesJar(cookiesJar);

        // then
        assert.isObject(params);
        assert.isString(params.pv_unique_id); // this one is not set as cookie
        assert.equal(params.beacon, 'beacon');
        assert.equal(params.pv_number, 11);
        assert.equal(params.pv_number_global, 21);
        assert.equal(params.session_id, 'sessionId');
        assert.equal(params.b2, 'b2');
    });
});
