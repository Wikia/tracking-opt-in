import { VendorList } from '@iabtcf/core';
import { getJSON } from './utils';

// base i18n file
import en from '../i18n/tracking-opt-in.json';

/**
 * Additional strings (URLs, mostly)
 * - Keys for this object are the same as keys for `langToContent`
 * - default values are specified in `en` key
 */
const additionalStrings = {
    en: {
        privacyPolicyUrl: "https://www.fandom.com/privacy-policy",
        partnerListUrl: "https://www.fandom.com/partner-list",
    },
};

/**
 * Available IAB purposes and features translations
 * https://register.consensu.org/Translation
 */
const availableTranslations = [
    'bg',      // Bulgarian
    'ca',      // Catalan
    'cs',      // Czech
    'da',      // Danish
    'de',      // German
    'el',      // Greek
    'es',      // Spanish
    'et',      // Estonian
    'eus',     // Basque
    'fi',      // Finnish
    'fr',      // French
    'gl',      // Galician
    'hr',      // Croatian
    'hu',      // Hungarian
    'it',      // Italian
    'ja',      // Japanese
    'lt',      // Lithuanian
    'lv',      // Latvian
    'mt',      // Maltese
    'nl',      // Dutch
    'no',      // Norwegian
    'pl',      // Polish
    'pt',      // Portuguese
    'ro',      // Romanian
    'sr-Cyrl', // Serbian (cyrillic)
    'sr-Latn', // Serbian (latin)
    'ru',      // Russian
    'sk',      // Slovak
    'sl',      // Slovenian
    'sv',      // Swedish
    'tr',      // Turkish
    'zh',      // Chinese
];
const TRANSLATIONS_URL_BASE = 'https://script.wikia.nocookie.net/fandom-ae-assets/tcf/v2.2/';
const TRANSLATIONS_FILE_NAME = 'purposes-CODE.json';

export const langToContent = {
    de: () => import(/* webpackChunkName: "de.translation" */ '../i18n/de/tracking-opt-in.json'),
    en: () => en,
    es: () => import(/* webpackChunkName: "es-ES.translation" */ '../i18n/es-ES/tracking-opt-in.json'),
    fr: () => import(/* webpackChunkName: "fr.translation" */ '../i18n/fr/tracking-opt-in.json'),
    it: () => import(/* webpackChunkName: "it.translation" */ '../i18n/it/tracking-opt-in.json'),
    ja: () => import(/* webpackChunkName: "ja.translation" */ '../i18n/ja/tracking-opt-in.json'),
    pl: () => import(/* webpackChunkName: "pl.translation" */ '../i18n/pl/tracking-opt-in.json'),
    pt: () => import(/* webpackChunkName: "pt.translation" */ '../i18n/pt-BR/tracking-opt-in.json'),
    ru: () => import(/* webpackChunkName: "ru.translation" */ '../i18n/ru/tracking-opt-in.json'),
    zh: () => import(/* webpackChunkName: "zh-CN.translation" */ '../i18n/zh-CN/tracking-opt-in.json'), // simplified
    'zh-hk': () => import(/* webpackChunkName: "zh-TW.translation" */ '../i18n/zh-TW/tracking-opt-in.json'), // traditional
    'zh-tw': () => import(/* webpackChunkName: "zh-TW.translation" */ '../i18n/zh-TW/tracking-opt-in.json'), // traditional
};

export default class ContentManager {
    content = null;
    language = 'en';

    /**
     * @returns Promise<VendorList|null>
     */
    static fetchPurposes(language) {
        if (!availableTranslations.includes(language)) {
            return Promise.resolve(null);
        }

        return getJSON(`${TRANSLATIONS_URL_BASE}${TRANSLATIONS_FILE_NAME.replace('CODE', language)}`);
    }

    constructor(lang) {
        this.language = lang;
    }

    fetchTranslations() {
        // all the strings default to `en`
        this.content = {
            ...langToContent.en(),
            ...(additionalStrings[this.language] || additionalStrings.en)
        };

        if (this.language === 'en' || langToContent[this.language] === undefined) {
            return Promise.resolve();
        }

        return langToContent[this.language]()
            .then(resource => resource.default)
            .then((langContent) => {
                // merge both together
                this.content = {
                    ...this.content,
                    ...langContent,
                };
            });
    }
}
