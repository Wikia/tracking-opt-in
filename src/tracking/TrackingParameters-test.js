import { assert } from 'chai';
import TrackingParameters from './TrackingParameters';
import { TRACKING_PARAMETER_NAMES } from './tracking-params-config';

describe('TrackingParameters', () => {
    it('should generate values', () => {
        // when
        const params = new TrackingParameters().fromPlainValues({}).values;

        // then
        assert.isObject(params);
        assert.equal(params.pv_number_global, 1);
        assert.equal(params.pv_number, 1);
        assert.isString(params.beacon);
        assert.isString(params.session_id);
        assert.isString(params.b2);
        assert.isString(params.pv_unique_id);
    });

    it('should read values from plain values', ()=> {
        // given
        const plainValues = {
            [TRACKING_PARAMETER_NAMES.BEACON_V2]: 'b2',
            [TRACKING_PARAMETER_NAMES.BEACON]: 'beacon',
            [TRACKING_PARAMETER_NAMES.PAGE_VIEW_NUMBER]: '10',
            [TRACKING_PARAMETER_NAMES.GLOBAL_PAGE_VIEW_NUMBER]: '20',
            [TRACKING_PARAMETER_NAMES.SESSION]: 'sessionId'
        };

        // when
        const params = new TrackingParameters().fromPlainValues(plainValues).values;

        // then
        assert.isObject(params);
        assert.isString(params[TRACKING_PARAMETER_NAMES.PAGE_VIEW_UID]);
        assert.equal(params[TRACKING_PARAMETER_NAMES.BEACON], 'beacon');
        assert.equal(params[TRACKING_PARAMETER_NAMES.PAGE_VIEW_NUMBER], 11);
        assert.equal(params[TRACKING_PARAMETER_NAMES.GLOBAL_PAGE_VIEW_NUMBER], 21);
        assert.equal(params[TRACKING_PARAMETER_NAMES.SESSION], 'sessionId');
        assert.equal(params[TRACKING_PARAMETER_NAMES.BEACON_V2], 'b2');
    });

    it('should copy all values for page view', () => {
        // given
        const params = new TrackingParameters().fromPlainValues({});
        const result = { name: 'view' };

        // when
        new TrackingParameters().fromPlainValues({}).copyTo(result);

        // then
        assert.isString(result[TRACKING_PARAMETER_NAMES.PAGE_VIEW_UID]);
        assert.isString(result[TRACKING_PARAMETER_NAMES.BEACON]);
        assert.equal(result[TRACKING_PARAMETER_NAMES.PAGE_VIEW_NUMBER], 1);
        assert.equal(result[TRACKING_PARAMETER_NAMES.GLOBAL_PAGE_VIEW_NUMBER], 1);
        assert.isString(result[TRACKING_PARAMETER_NAMES.SESSION]);
        assert.isString(result[TRACKING_PARAMETER_NAMES.BEACON_V2]);

    });

    it('should copy values for non page view', () => {
        // given
        const result = { name: 'action' };

        // when
        new TrackingParameters().fromPlainValues({}).copyTo(result);

        // then
        assert.isString(result[TRACKING_PARAMETER_NAMES.PAGE_VIEW_UID]);
        assert.isString(result[TRACKING_PARAMETER_NAMES.BEACON]);
        assert.isString(result[TRACKING_PARAMETER_NAMES.SESSION]);
        assert.isString(result[TRACKING_PARAMETER_NAMES.BEACON_V2]);
        assert.isNotOk(result[TRACKING_PARAMETER_NAMES.PAGE_VIEW_NUMBER]);
        assert.isNotOk(result[TRACKING_PARAMETER_NAMES.GLOBAL_PAGE_VIEW_NUMBER]);
    });
});
