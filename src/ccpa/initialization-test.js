import main from '../index';

import { assert } from 'chai';
import Cookies from 'js-cookie';
import UserSignalMechanism from './UserSignalMechanism';
import ConsentManagementProvider from '../gdpr/ConsentManagementProvider';

// Workaround for Secure random number generation since is not supported by the testing browser
Object.defineProperty(global.self, 'crypto', {
    value: {
        getRandomValues: arr => arr
    }
});

function cleanup() {
    delete window.__uspapi;
    Cookies.remove('usprivacy');
}

describe('main', () => {
    let options;

    before(() => {
        cleanup();
    });

    beforeEach(() => {
        options = {
            enableCCPAinit: true,
        };
        ConsentManagementProvider.installStub();
        UserSignalMechanism.installStub();
    });

    afterEach(() => {
        cleanup();
    });

    describe('main - initialization', () => {
        // [isSubjectToCoppa, isSubjectToCcpa, expected]
        const testMatrix = [
            [undefined, undefined, undefined],
            [true, undefined, true],
            [false, undefined, false],
            [true, true, true],
            [false, true, false],
            [undefined, true, true],
            [true, false, true],
            [false, false, false],
            [undefined, false, false],
        ];

        testMatrix.forEach(([isSubjectToCoppa, isSubjectToCcpa, expected]) => {
            it(`should pass isSubjectToCppa=${expected} if isSubjectToCoppa=${isSubjectToCoppa} and isSubjectToCcpa=${isSubjectToCcpa}`, () => {
                options.isSubjectToCcpa = isSubjectToCcpa;
                options.isSubjectToCoppa = isSubjectToCoppa;

                const { ccpa } = main(options);

                assert.equal(ccpa.options.isSubjectToCcpa, expected)
            });
        });
    });
});
