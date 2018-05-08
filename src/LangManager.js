import { langToContent } from './ContentManager';

const DEFAULT_LANG = 'en';
const DEFAULT_BROWSER_LANG = 'en-US';

// https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language
export const getBrowserLang = () =>  window.navigator && window.navigator.language
    ? window.navigator.language : DEFAULT_BROWSER_LANG;

// parse the browser lang to map to just a two letter lang code or 'zh-hans'/'zh-hant'
const browserLangToLang = (browserLang = DEFAULT_BROWSER_LANG) => {
    if (browserLang.length === 0) {
        return DEFAULT_LANG;
    }

    if (langToContent[browserLang] !== undefined) {
        return browserLang;
    }

    return browserLang.substring(0,2);
};


export default class LangManager {
    constructor(browserLang) {
        this.browserLang = browserLang || getBrowserLang();
        this.lang = browserLangToLang(this.browserLang);
    }
}
