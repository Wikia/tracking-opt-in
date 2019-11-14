import { langToContent } from './ContentManager';
import { getUrlParameter } from './utils';

export const DEFAULT_LANG = 'en';
export const DEFAULT_BROWSER_LANG = 'en-us';

// https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language
const getBrowserLang = () => (window.navigator && window.navigator.language)
    ? window.navigator.language : DEFAULT_BROWSER_LANG;

// parse the browser lang to map to just a two letter lang code or 'zh-hans'/'zh-hant'
const browserLangToLang = (browserLang) => {
    if (langToContent[browserLang] !== undefined) {
        return browserLang;
    }

    return browserLang.substring(0,2);
};


export default class LangManager {
    constructor(browserLang) {
        this.browserLang = (getUrlParameter('uselang') || browserLang || getBrowserLang()).toLowerCase();
        this.lang = browserLangToLang(this.browserLang);
    }
}
