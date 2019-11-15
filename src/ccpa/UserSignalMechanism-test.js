import { assert } from 'chai';
import { spy } from 'sinon';
import Cookies from 'js-cookie';
import UserSignalMechanism, { USP_VERSION } from './UserSignalMechanism';

describe('UserSignalMechanism', () => {
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

        before(() => {
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
                assert.equal(uspData.uspString, `${USP_VERSION}NN`);
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
});
