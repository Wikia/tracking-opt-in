import {assert} from 'chai';
import CookieSyncManager from './CookieSyncManager';

describe('CookieSyncManager', () => {
    it('returns correct cookie-syncer frame url', () => {
        [
            ['muppet.wikia.com', 'https://services.wikia.com/cookie-syncer/frame'],
            ['muppet.fandom.com', 'https://services.fandom.com/cookie-syncer/frame'],
            ['muppet.xxx.wikia-dev.pl', 'https://services.wikia-dev.pl/cookie-syncer/frame'],
            ['muppet.xxx.fandom-dev.pl', 'https://services.fandom-dev.pl/cookie-syncer/frame'],
            ['muppet.xxx.wikia-dev.us', 'https://services.wikia-dev.us/cookie-syncer/frame'],
            ['muppet.xxx.fandom-dev.us', 'https://services.fandom-dev.us/cookie-syncer/frame'],
            ['tricky.fandom.com.wikia.com', 'https://services.wikia.com/cookie-syncer/frame'],
        ].forEach(testData => testFrameUrl(testData[0], testData[1]));

        function testFrameUrl(host, expectedUrl) {
            const cookieSyncManager = new CookieSyncManager(host);
            assert.equal(expectedUrl, cookieSyncManager.getFrameUrl());
        }
    });

    it('returns empty frame url for unknown address', () => {
        const cookieSyncManager = new CookieSyncManager('foo.wikia.org');
        assert.equal(undefined, cookieSyncManager.getFrameUrl());
    })
});
