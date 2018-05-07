const DEFAULT_LANG = 'en';
const DEFAULT_BROWSER_LANG = 'en-US';

const langToContent = {
    de: {
        initialHeadline: '',
        secondHeadline: '',
        buttonAccept: '',
        buttonReject: '',
        privacyLinkText: '',
        partnerLinkText: '',
    },
    en: {
        initialHeadline: 'This site uses cookies',
        secondHeadline: 'Are you sure?',
        buttonAccept: 'Accept all cookies',
        buttonReject: 'Reject all cookies',
        privacyLinkText: 'Privacy Policy',
        partnerLinkText: 'Partner List',
    },
    es: {
        initialHeadline: '',
        secondHeadline: '',
        buttonAccept: '',
        buttonReject: '',
        privacyLinkText: '',
        partnerLinkText: '',
    },
    fr: {
        initialHeadline: '',
        secondHeadline: '',
        buttonAccept: '',
        buttonReject: '',
        privacyLinkText: '',
        partnerLinkText: '',
    },
    it: {
        initialHeadline: '',
        secondHeadline: '',
        buttonAccept: '',
        buttonReject: '',
        privacyLinkText: '',
        partnerLinkText: '',
    },
    ja: {
        initialHeadline: '',
        secondHeadline: '',
        buttonAccept: '',
        buttonReject: '',
        privacyLinkText: '',
        partnerLinkText: '',
    },
    pl: {
        initialHeadline: '',
        secondHeadline: '',
        buttonAccept: '',
        buttonReject: '',
        privacyLinkText: '',
        partnerLinkText: '',
    },
    pt: {
        initialHeadline: '',
        secondHeadline: '',
        buttonAccept: '',
        buttonReject: '',
        privacyLinkText: '',
        partnerLinkText: '',
    },
    ru: {
        initialHeadline: '',
        secondHeadline: '',
        buttonAccept: '',
        buttonReject: '',
        privacyLinkText: '',
        partnerLinkText: '',
    },
    'zh-hans': {
        initialHeadline: '',
        secondHeadline: '',
        buttonAccept: '',
        buttonReject: '',
        privacyLinkText: '',
        partnerLinkText: '',
    },
    'zh-hant': {
        initialHeadline: '',
        secondHeadline: '',
        buttonAccept: '',
        buttonReject: '',
        privacyLinkText: '',
        partnerLinkText: '',
    },
};

// https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language
export const getBrowserLanguage = () =>  window.navigator && window.navigator.language
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

export const browserLangToContent = (browserLang = DEFAULT_LANG) => {
  return langToContent[browserLangToLang(browserLang)] || langToContent[DEFAULT_LANG];
};
