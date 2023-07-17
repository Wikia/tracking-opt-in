import { assert } from 'chai';
import ContentManager, { langToContent } from './ContentManager';
import de from '../i18n/de/tracking-opt-in.json';

langToContent.de = () => Promise.resolve({ default: de });

describe('ContentManager', () => {
    it('gives content in the specified language', (done) => {
        const contentManager = new ContentManager('de');
        contentManager.fetchTranslations().then(() => {
            assert.equal(contentManager.content.mainHeadline, 'Diese Website verwendet Cookies');
            done();
        });
    });

    it('falls back to en when the language does not exist', (done) => {
        const contentManager = new ContentManager('xx');
        contentManager.fetchTranslations().then(() => {
            assert.equal(contentManager.content.mainHeadline, 'This Site Uses Cookies');
            done();
        });
    });

    it('falls back to en when the language is not specified', (done) => {
        const contentManager = new ContentManager();
        contentManager.fetchTranslations().then(() => {
            assert.equal(contentManager.content.mainHeadline, 'This Site Uses Cookies');
            done();
        });
    });
});
