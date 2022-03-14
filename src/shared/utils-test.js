import { assert, expect } from 'chai';
import * as utils from './utils';

const noop = () => {};

describe('Utils', () => {
    context('parseUrl', () => {
        it('parses a URL from string', () => {
            const parsed = utils.parseUrl('http://fandom.com/foo/bar');

            assert.equal(parsed.protocol, 'http:');
            assert.equal(parsed.hostname, 'fandom.com');
            assert.equal(parsed.pathname, '/foo/bar');
        });
    });

    context('getCookieDomain', () => {
        it('returns undefined for TLD or empty string', () => {
            let domain = utils.getCookieDomain('com');

            assert.equal(domain, undefined);

            domain = utils.getCookieDomain('');

            assert.equal(domain, undefined);
        });

        it('returns base domain', () => {
            let domain = utils.getCookieDomain('fandom.com');

            assert.equal(domain, '.fandom.com');

            domain = utils.getCookieDomain('muppets.fandom.com');

            assert.equal(domain, '.fandom.com');

            domain = utils.getCookieDomain('www.muppets.fandom.com');

            assert.equal(domain, '.fandom.com');
        });

        it('handles .co country-code domains', () => {
            let domain = utils.getCookieDomain('somethingbritish.co.uk');

            assert.equal(domain, '.somethingbritish.co.uk');

            domain = utils.getCookieDomain('somethingkiwi.co.nz');

            assert.equal(domain, '.somethingkiwi.co.nz');
        });

        it('should return undefined for domain without extension', () => {
            expect(utils.getCookieDomain('fandom')).to.equal(undefined);
        });

        it('should return truncated domain part for subdomains', () => {
            expect(utils.getCookieDomain('fandom.com')).to.equal('.fandom.com');
            expect(utils.getCookieDomain('a.fandom.com')).to.equal('.fandom.com');
            expect(utils.getCookieDomain('b.a.fandom.com')).to.equal('.fandom.com');
            expect(utils.getCookieDomain('c.b.a.fandom.com')).to.equal('.fandom.com');
            expect(utils.getCookieDomain('d.c.b.a.fandom.com')).to.equal('.fandom.com');
        });
    });

    context('getJSON', () => {
        let originalXHR;

        beforeEach(() => {
            originalXHR = window.XMLHttpRequest;
        });

        afterEach(() => {
            window.XMLHttpRequest = originalXHR;
        });

        it('returns an object if the response is correct', (done) => {
            const response = {
                a: 0,
                b: 1,
                c: 2
            };

            window.XMLHttpRequest = function () {
                this.open = noop;
                this.send = () => {
                    this.onload.call({
                        responseText: JSON.stringify(response)
                    });
                };
            };

            utils.getJSON('http://foo.bar', false)
                .then((json) => {
                    assert.deepEqual(json, response);
                    done();
                });
        });

        it('throws an error if not able to fetch the data', (done) => {
            window.XMLHttpRequest = function () {
                this.open = noop;
                this.send = () => {
                    this.onerror();
                };
            };

            utils.getJSON('http://foo.bar', false)
                .catch((error) => {
                    assert.instanceOf(error, Error);
                    done();
                });
        });

        it('returns null if not able to parse the response', (done) => {
            window.XMLHttpRequest = function () {
                this.open = noop;
                this.send = () => {
                    this.onload.call({
                        responseText: 'foo'
                    });
                };
            };

            utils.getJSON('http://foo.bar', false)
                .then((json) => {
                    assert.equal(json, null);
                    done();
                });
        });
    });
});
