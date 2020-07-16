import { assert } from 'chai';
import Cookies from 'js-cookie';
import OptInManager, {
    DEFAULT_COOKIE_NAME,
    DEFAULT_QUERY_PARAM_NAME,
    VERSION_COOKIE_NAME
} from './OptInManager';
import { CMP_VERSION } from './ConsentManagementProviderLegacy';

describe('OptInManager', () => {
    afterEach(() => {
        Cookies.remove(DEFAULT_COOKIE_NAME);
    });

    it('allows overrides for basic params', () => {
        const customCookieName = 'my-cookie';
        const customExpiration = 2;
        const customQueryParam = 'my-param';

        const optInManager = new OptInManager('www.test.com', customCookieName, customExpiration, customExpiration, customQueryParam);
        assert.equal(optInManager.cookieName, customCookieName);
        assert.equal(optInManager.acceptExpiration, customExpiration);
        assert.equal(optInManager.rejectExpiration, customExpiration);
        assert.equal(optInManager.domain, '.test.com');
        assert.equal(optInManager.queryParam, customQueryParam);
    });

    it('returns accepted after being marked as accepted', () => {
        const optInManager = new OptInManager();
        optInManager.setTrackingAccepted();

        assert.isOk(optInManager.hasAcceptedTracking());
        assert.isNotOk(optInManager.hasRejectedTracking());
    });

    it('returns rejected after being marked as rejected', () => {
        const optInManager = new OptInManager();
        optInManager.setTrackingRejected();

        assert.isOk(optInManager.hasRejectedTracking());
        assert.isNotOk(optInManager.hasAcceptedTracking());
    });

    it('clears cookie on demand', () => {
        const optInManager = new OptInManager();
        optInManager.setTrackingAccepted();
        optInManager.clear();

        assert.isNotOk(optInManager.hasAcceptedTracking());
        assert.isNotOk(optInManager.hasRejectedTracking());
        assert.equal(optInManager.getValue(), undefined);
    });

    it('clears cookie on version change', () => {
        let optInManager = new OptInManager();
        optInManager.setTrackingAccepted();

        Cookies.set(VERSION_COOKIE_NAME, CMP_VERSION - 1);
        optInManager = new OptInManager();
        const cookiesRemoved = optInManager.checkCookieVersion();

        assert.isNotOk(optInManager.hasAcceptedTracking());
        assert.isNotOk(optInManager.hasRejectedTracking());
        assert.equal(optInManager.getValue(), undefined);
        assert.equal(cookiesRemoved, true);
    });

    it('clears cookie if version cookie not exists', () => {
        let optInManager = new OptInManager();
        optInManager.setTrackingAccepted();

        Cookies.remove(VERSION_COOKIE_NAME);
        optInManager = new OptInManager();
        const cookiesRemoved = optInManager.checkCookieVersion();

        assert.isNotOk(optInManager.hasAcceptedTracking());
        assert.isNotOk(optInManager.hasRejectedTracking());
        assert.equal(optInManager.getValue(), undefined);
        assert.equal(cookiesRemoved, true);
    });

    it('consents based on expected query params', () => {
        const optInManager = new OptInManager();

        optInManager.setForcedStatusFromQueryParams(`${DEFAULT_QUERY_PARAM_NAME}=true`);
        assert.isOk(optInManager.hasAcceptedTracking());
        assert.isNotOk(optInManager.hasRejectedTracking());

        optInManager.clear();

        optInManager.setForcedStatusFromQueryParams(`${DEFAULT_QUERY_PARAM_NAME}=false`);
        assert.isOk(optInManager.hasRejectedTracking());
        assert.isNotOk(optInManager.hasAcceptedTracking());
    });
});
