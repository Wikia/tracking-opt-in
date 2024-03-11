import { assert } from 'chai';
import { spy, stub } from 'sinon';
import Cookies from 'js-cookie';
import GppManager from './GppManager';

describe('GppManager', () => {
	let cookieJar = {};
	let cookiesStub = {};

	before(() => {
		cookiesStub.set = stub(Cookies, 'set').callsFake((name, value) => {
			cookieJar[name] = value;
		});
		cookiesStub.get = stub(Cookies, 'get').callsFake((name) => cookieJar[name]);
		cookiesStub.remove = stub(Cookies, 'remove').callsFake((name) => cookieJar[name] && delete cookieJar[name]);
	});

	after(() => {
		cookiesStub.set.restore();
		cookiesStub.get.restore();
		cookiesStub.remove.restore();
	});

	afterEach(() => {
		cookieJar = {};
	});

	function cleanup() {
		delete window.__gpp;
		Cookies.remove('gpp');
		assert.isUndefined(window.__gpp);
		assert.isNotOk(Cookies.get('gpp'));
	}

	context('__gpp stub', () => {
		before(() => {
			cleanup();
			GppManager.installStub();
		});

		after(cleanup);

		it('provides __gpp global', () => {
			assert.isFunction(window.__gpp);
		});

		it('implements ping command', (done) => {
			const callbackSpy = spy();

			window.__gpp('ping', (callback) => {
				callbackSpy(callback);
				assert(callbackSpy.called, true);
				done();
			});
		});
	});

	context('GPP API', () => {
		let gppApi;

		beforeEach(async () => {
			cleanup();
			const options = {
				region: 'ca',
				gppApplies: true,
			}

			gppApi = new GppManager(options);
			await gppApi.setup();
		});

		after(cleanup);

		it('provides __gpp global', () => {
			assert.isFunction(window.__gpp);
		});

		it('implements ping command', (done) => {
			const callbackSpy = spy();

			window.__gpp('ping', (callback) => {
				callbackSpy(callback);
				assert(callbackSpy.called, true);
				done();
			});
		});

		it('sets cookie', () => {
			assert.isString(Cookies.get('gpp'));
		});
	});

	context('GPP string', () => {
		let gppApi;
		const consentString = 'DBABBg~BVqqqqhU.QA';
		const optedOutString = 'DBABBg~BVVVVVRU.QA';
		let options = {
			region: 'ca',
			gppApplies: true,
			isSubjectToGPP: false,
		}

		beforeEach(() => {
			cleanup();
			options = {
				region: 'ca',
				gppApplies: true,
				isSubjectToGPP: false,
			}
			navigator.globalPrivacyControl = false;
		});

		after(cleanup);

		it('It sets all consents as default', async () => {
			gppApi = new GppManager(options);
			await gppApi.setup();
			assert.equal(Cookies.get('gpp'), consentString);
		});

		it('It sets no consent for COPPA', async () => {
			options.isSubjectToGPP = true;

			gppApi = new GppManager(options);
			await gppApi.setup();
			assert.equal(Cookies.get('gpp'), optedOutString);
		});

		it('It sets no consent when GPC set', async () => {
			navigator.globalPrivacyControl = true;

			gppApi = new GppManager(options);
			await gppApi.setup();
			assert.equal(Cookies.get('gpp'), optedOutString);
		});

		it('It sets consent when cookie is invalid', async () => {
			cookiesStub.set('gpp', 'invalidGppString');

			gppApi = new GppManager(options);
			await gppApi.setup();
			assert.equal(Cookies.get('gpp'), consentString);
		});

		it('It sets no consent when opted out cookie is already provided', async () => {
			cookiesStub.set('gpp', optedOutString);

			gppApi = new GppManager(options);
			await gppApi.setup();
			assert.equal(Cookies.get('gpp'), optedOutString);
		});

		it('It sets consent when consent cookie is already provided', async () => {
			cookiesStub.set('gpp', consentString);

			gppApi = new GppManager(options);
			await gppApi.setup();
			assert.equal(Cookies.get('gpp'), consentString);
		});

	});
});
