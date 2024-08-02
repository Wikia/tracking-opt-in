import { assert } from 'chai';
import { spy, stub } from 'sinon';
import Cookies from 'js-cookie';
import UserSignalMechanism, { USP_VALUES, USP_VERSION } from './UserSignalMechanism';

describe('UserSignalMechanism', () => {
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
        delete window.__uspapi;
        Cookies.remove('usprivacy');
        assert.isUndefined(window.__uspapi);
        assert.isNotOk(Cookies.get('usprivacy'));
    }

    context('__uspapi stub', () => {
        before(() => {
            cleanup();
            UserSignalMechanism.installStub();
        });

        after(cleanup);

        it('provides __uspapi global', () => {
            assert.isFunction(window.__uspapi);
        });

        it('implements ping command', (done) => {
            const callbackSpy = spy();

            window.__uspapi('ping', USP_VERSION, (callback) => {
                callbackSpy(callback);
                assert(callbackSpy.called, true);
                done();
            });
        });

        it('builds and returns a call queue', (done) => {
            const queueLength = 5;

            for (let i = 0; i < queueLength; i++) {
                window.__uspapi(`command${i}`, `version${i}`, `callback${i}`);
            }

            window.__uspapi('getQueue', null, (queue) => {
                assert.isArray(queue);
                assert.equal(queue.length, queueLength);
                queue.forEach((args, i) => {
                    assert.deepEqual(args, [`command${i}`, `version${i}`, `callback${i}`]);
                });
                done();
            });
        });
    });

    context('User Signal Mechanism API', () => {
        const config = {
            ccpaApplies: true,
        };
        let uspapi;

        beforeEach(() => {
            cleanup();

            uspapi = new UserSignalMechanism(config);

            return uspapi.install();
        });

        after(cleanup);

        it('provides __uspapi global', () => {
            assert.isFunction(window.__uspapi);
        });

        it('implements ping command', (done) => {
            const callbackSpy = spy();

            window.__uspapi('ping', USP_VERSION, (callback) => {
                callbackSpy(callback);
                assert(callbackSpy.called, true);
                done();
            });
        });

        it('implements getUSPData command', (done) => {
            window.__uspapi('getUSPData', USP_VERSION, (uspData, success) => {
                assert.equal(uspData.version, USP_VERSION);
                assert.isString(uspData.uspString);
                assert.notEqual(uspData.uspString, 0);
                assert.equal(uspData.uspString, `${USP_VERSION}YNN`);
                assert.isTrue(success);
                done();
            });
        });

        it('sets cookies', () => {
            assert.isString(Cookies.get('usprivacy'));
        });

        it('cleans up after uninstall', () => {
            uspapi.uninstall();

            assert.isUndefined(window.__uspapi);
            assert.isNotOk(Cookies.get('usprivacy'));
        });
    });

    context('createSignal', () => {
        let config;
        let uspapi;

        beforeEach(() => {
            cleanup();
            config = {};
        });

        afterEach(cleanup);

        it('sets user signal to 1--- and not set privacy cookie if options.ccpaApplies is false', () => {
            const privacyString = '';
            config.ccpaApplies = false;

            uspapi = new UserSignalMechanism(config);

            uspapi.createUserSignal();

            assert.equal(uspapi.getPrivacyStringCookie(), privacyString);
            assert.isUndefined(Cookies.get('usprivacy'));
        });

        it('sets user signal to 1--- and not set privacy cookie if options.ccpaApplies is undefined', () => {
            const privacyString = '';

            uspapi = new UserSignalMechanism(config);

            uspapi.createUserSignal();

            assert.equal(uspapi.getPrivacyStringCookie(), privacyString);
            assert.isUndefined(Cookies.get('usprivacy'));
        });

        it('sets user signal and privacy cookie to 1YYN if options.isSubjectToCcpa is true', () => {
            const privacyString = '1YYN';

            config.ccpaApplies = true;
            config.isSubjectToCcpa = true;

            uspapi = new UserSignalMechanism(config);

            uspapi.createUserSignal();

            assert.equal(uspapi.getPrivacyStringCookie(), privacyString);
            assert.equal(Cookies.get('usprivacy'), privacyString);
        });
    });

    context('saveUserSignal', () => {
        const config = {
            ccpaApplies: false,
        };
        let uspapi;

        beforeEach(() => {
            cleanup();
            uspapi = new UserSignalMechanism(config);
        });

        afterEach(cleanup);

        it('should set userSignal to 1YYN if called with "yes"', () => {
            uspapi.saveUserSignal(USP_VALUES.yes);

            assert.equal(uspapi.getPrivacyStringCookie(), '1YYN');
        });

        it('should set userSignal to 1YNN if called with "no"', () => {
            uspapi.saveUserSignal(USP_VALUES.no);

            assert.equal(uspapi.getPrivacyStringCookie(), '1YNN');
        });
    });
});
