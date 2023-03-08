import { getDomain } from './ConsentManagementPlatform';
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
});
