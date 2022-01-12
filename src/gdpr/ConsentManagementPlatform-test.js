import { getDomain, getNewTrackingValues } from './ConsentManagementPlatform';
import { expect } from 'chai';

describe('ConsentManagementPlatform', () => {
    describe('getDomain', () => {
        it('should return null for domain without extension', () => {
            expect(getDomain('fandom')).to.equal(null);
        });

        it('should return truncated domain part for subdomains', () => {
            expect(getDomain('fandom.com')).to.equal('.fandom.com');
            expect(getDomain('a.fandom.com')).to.equal('.fandom.com');
            expect(getDomain('b.a.fandom.com')).to.equal('.fandom.com');
            expect(getDomain('c.b.a.fandom.com')).to.equal('.fandom.com');
            expect(getDomain('d.c.b.a.fandom.com')).to.equal('.fandom.com');
        });
    });

    describe('getNewTrackingValues', () => {
        // in test env, uuid4 is always generated with this value
        const fakeUUID = '00000000-0000-4000-8000-000000000000';

        it('should generate new values when there is none', () => {
            const actual = getNewTrackingValues({});
            const expected = {
                pvNumber: 0,
                pvNumberGlobal: 0,
                sessionId: fakeUUID,
            };

            expect(actual).to.deep.include(expected);
        });

        it('should return the same if there are exising values', () => {
            const existingValues = {
                pvNumber: 2,
                pvNumberGlobal: 3,
                sessionId: "hello-this-is-existing-uuid",
            };
            const actual = getNewTrackingValues(existingValues);

            expect(actual).to.deep.include(existingValues);
        });
    });
});
