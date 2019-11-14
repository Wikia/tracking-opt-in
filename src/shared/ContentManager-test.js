import { assert } from 'chai';
import ContentManager, { langToContent } from './ContentManager';

describe('ContentManager', () => {
    it('gives content in the specified language', () => {
        assert.equal(new ContentManager('de').content.mainHeadline, langToContent.de.mainHeadline);
    });

    it('falls back to en when the language does not exist', () => {
        assert.equal(new ContentManager('xx').content.mainHeadline, langToContent.en.mainHeadline);
    });

    it('falls back to en when the language is not specified', () => {
        assert.equal(new ContentManager().content.mainHeadline, langToContent.en.mainHeadline);
    });
});
