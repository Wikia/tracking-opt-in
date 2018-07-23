import { assert } from 'chai';
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

            utils.getJSON('http://foo.bar')
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

            utils.getJSON('http://foo.bar')
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

            utils.getJSON('http://foo.bar')
                .then((json) => {
                    assert.equal(json, null);
                    done();
                });
        });
    });
});
