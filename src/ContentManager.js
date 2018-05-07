export const langToContent = {
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

export default class ContentManager {
    constructor(lang) {
        this.content = langToContent[lang] || langToContent.en;
    }
}
