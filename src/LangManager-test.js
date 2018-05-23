import { assert } from 'chai';
import LangManager, { DEFAULT_BROWSER_LANG, DEFAULT_LANG } from './LangManager';

const validLang = 'es';
const validLangValidLocale = 'zh-TW';
const validLangInvalidLocale = 'pt-br';

function setBrowserLang(lang) {
    Object.defineProperty(window.navigator, 'language', {
        value: lang,
        configurable: true,
    });
}

let initialLang;

describe('LangManager', () => {
    before(() => {
        initialLang = window.navigator.language;
    });

    after(() => {
        setBrowserLang(initialLang);
    });

    describe('with specified lang', () => {
        it('sets the lang if valid option', () => {
            const langManager = new LangManager(validLang);
            assert.equal(langManager.browserLang, validLang);
            assert.equal(langManager.lang, validLang);
        });
    });

    describe('without specified lang', () => {
        afterEach(() => {
            setBrowserLang(initialLang);
        });

        it('reads from the browser lang if available', () => {
            setBrowserLang(validLang);
            const langManager = new LangManager();
            assert.equal(langManager.browserLang, validLang);
            assert.equal(langManager.lang, validLang);
        });

        it('falls back to english when unspecified', () => {
            setBrowserLang(false);
            const langManager = new LangManager();
            assert.equal(langManager.browserLang, DEFAULT_BROWSER_LANG);
            assert.equal(langManager.lang, DEFAULT_LANG);
        });

        it('includes the locale if valid', () => {
            setBrowserLang(validLangValidLocale);
            const langManager = new LangManager();
            assert.equal(langManager.browserLang, validLangValidLocale);
            assert.equal(langManager.lang, validLangValidLocale);
        });

        it('does not include the locale if invalid', () => {
            setBrowserLang(validLangInvalidLocale);
            const langManager = new LangManager();
            assert.equal(langManager.browserLang, validLangInvalidLocale);
            assert.equal(langManager.lang, 'pt');
        });
    })
});
