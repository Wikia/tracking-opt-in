import { assert } from 'chai';
import { spy, stub } from 'sinon';
import Cookies from 'js-cookie';
import ConsentManagementProvider from './ConsentManagementProvider';
import { vendorList as vendorListMock } from './ConsentManagementProvider-test-fixtures';

describe('ConsentManagementProvider', () => {
    function cleanup() {
        delete window.__tcfapi;
        Cookies.remove('euconsent-v2');
        assert.isUndefined(window.__tcfapi);
        assert.isNotOk(Cookies.get('euconsent-v2'));
    }

    context('__tcfapi stub', () => {
        before(() => {
            cleanup();
            ConsentManagementProvider.installStub();
        });
        after(cleanup);

        it('provides __tcfapi global', () => {
            assert.isFunction(window.__tcfapi);
        });

        // it('implements ping command', (done) => {
        //     const callbackSpy = spy();
        //
        //     window.__cmp('ping', null, (...args) => {
        //         callbackSpy(...args);
        //         assert(callbackSpy.calledWith({
        //             gdprAppliesGlobally: false,
        //             cmpLoaded: false
        //         }, true));
        //         done();
        //     });
        // });
        //
        // it('builds and returns a call queue', (done) => {
        //     const queueLength = 5;
        //
        //     for (let i = 0; i < queueLength; i++) {
        //         window.__cmp(`cmd${i}`, `param${i}`, `cb${i}`);
        //     }
        //
        //     window.__cmp('getQueue', null, (queue) => {
        //         assert.isArray(queue);
        //         assert.equal(queue.length, queueLength);
        //         queue.forEach((args, i) => {
        //             assert.deepEqual(args, [`cmd${i}`, `param${i}`, `cb${i}`]);
        //         });
        //         done();
        //     });
        // });
    });

    // context('Interactive Advertising Bureau API', () => {
    //     const allowedStandardPublisherPurposes = [1, 2, 4, 5];
    //     const allowedCustomPublisherPurposes = [25, 28, 80];
    //     const allowedPublisherPurposes = [
    //         ...allowedStandardPublisherPurposes,
    //         ...allowedCustomPublisherPurposes
    //     ];
    //     const allowedVendorPurposes = [1, 4, 5];
    //     const allowedVendors = [8, 9, 12];
    //     const config = {
    //         gdprApplies: true,
    //         allowedPublisherPurposes,
    //         allowedVendors,
    //         allowedVendorPurposes
    //     };
    //     let cmp;
    //
    //     before(() => {
    //         cleanup();
    //
    //         cmp = new ConsentManagementProvider();
    //
    //         stub(cmp, 'fetchVendorList').resolves(vendorListMock);
    //         cmp.configure(config);
    //
    //         return cmp.install();
    //     });
    //     after(cleanup);
    //
    //     it('provides __cmp global', () => {
    //         assert.isFunction(window.__cmp);
    //     });
    //
    //     it('implements ping command', (done) => {
    //         const callbackSpy = spy();
    //
    //         window.__cmp('ping', null, (...args) => {
    //             callbackSpy(...args);
    //             callbackSpy.calledWith({
    //                 gdprAppliesGlobally: false,
    //                 cmpLoaded: true
    //             }, true);
    //             done();
    //         });
    //     });
    //
    //     it('implements getConsentData command', (done) => {
    //         window.__cmp('getConsentData', null, (params, success) => {
    //             assert.isString(params.consentData);
    //             assert.notEqual(params.consentData.length, 0);
    //             assert.isBoolean(params.gdprApplies);
    //             assert.isBoolean(params.hasGlobalScope);
    //             assert.isTrue(success);
    //             done();
    //         });
    //     });
    //
    //     it('getConsentData throws an error for wrong consent string version', (done) => {
    //         try {
    //             window.__cmp('getConsentData', 999, (params, success) => {
    //                 assert.isFalse(success);
    //                 done();
    //             });
    //         } catch (error) {
    //             void(error);
    //         }
    //     });
    //
    //     it('implements getVendorConsents command', (done) => {
    //         window.__cmp('getVendorConsents', null, (params, success) => {
    //             const {
    //                 metadata,
    //                 gdprApplies,
    //                 hasGlobalScope,
    //                 purposeConsents,
    //                 vendorConsents
    //             } = params;
    //
    //             assert.isString(metadata);
    //             assert.notEqual(metadata.length, 0);
    //             assert.isBoolean(gdprApplies);
    //             assert.isBoolean(hasGlobalScope);
    //             assert.isObject(purposeConsents);
    //             assert.isObject(vendorConsents);
    //
    //             config.allowedVendorPurposes.forEach((id) => {
    //                 assert.isTrue(purposeConsents[id]);
    //             });
    //             [0, -1, -2, -3].forEach((id) => {
    //                 assert.isNotOk(purposeConsents[id]);
    //             });
    //             config.allowedVendors.forEach((id) => {
    //                 assert.isTrue(vendorConsents[id]);
    //             });
    //             [0, -1, -2, -3].forEach((id) => {
    //                 assert.isNotOk(vendorConsents[id]);
    //             });
    //
    //             assert.isTrue(success);
    //             done();
    //         });
    //     });
    //
    //     it('implements getVendorConsents with parameters', (done) => {
    //         window.__cmp('getVendorConsents', [8, 11], (params, success) => {
    //             const {
    //                 metadata,
    //                 gdprApplies,
    //                 hasGlobalScope,
    //                 purposeConsents,
    //                 vendorConsents
    //             } = params;
    //
    //             assert.isString(metadata);
    //             assert.notEqual(metadata.length, 0);
    //             assert.isBoolean(gdprApplies);
    //             assert.isBoolean(hasGlobalScope);
    //             assert.isObject(purposeConsents);
    //             assert.isObject(vendorConsents);
    //
    //             config.allowedVendorPurposes.forEach((id) => {
    //                 assert.isTrue(purposeConsents[id]);
    //             });
    //             [0, -1, -2, -3].forEach((id) => {
    //                 assert.isNotOk(purposeConsents[id]);
    //             });
    //             assert.deepEqual(vendorConsents, {'8': true, '11': false});
    //             [0, -1, -2, -3].forEach((id) => {
    //                 assert.isNotOk(vendorConsents[id]);
    //             });
    //
    //             assert.isTrue(success);
    //             done();
    //         });
    //     });
    //
    //     it('implements getVendorList command', (done) => {
    //         window.__cmp('getVendorList', null, (vendorList, success) => {
    //             assert.isObject(vendorList);
    //             assert.isNumber(vendorList.vendorListVersion);
    //             assert.isArray(vendorList.purposes);
    //             assert.isArray(vendorList.vendors);
    //             assert.isTrue(success);
    //             done();
    //         });
    //     });
    //
    //     it('communicates through postMessage', () => {
    //         const cmpSpy = spy(window, '__cmp');
    //         const msg = new MessageEvent('message', {
    //             data: JSON.stringify({
    //                 __cmpCall: {
    //                     command: 'ping',
    //                     parameter: null,
    //                     callId: 0
    //                 }
    //             })
    //         });
    //
    //         window.dispatchEvent(msg);
    //         assert.isTrue(cmpSpy.calledWith('ping', null));
    //     });
    //
    //     it('sets cookies', () => {
    //         assert.isString(Cookies.get('euconsent'));
    //     });
    //
    //     it('cleans up after uninstall', () => {
    //         cmp.uninstall();
    //
    //         assert.isUndefined(window.__cmp);
    //         assert.isNotOk(Cookies.get('euconsent'));
    //     });
    // });
});
