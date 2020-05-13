import { VendorList } from '@iabtcf/core';
import { getJSON } from './utils';

// base i18n file
import en from '../i18n/tracking-opt-in.json';

// translations
import de from '../i18n/de/tracking-opt-in.json';
import esES from '../i18n/es-ES/tracking-opt-in.json';
import fr from '../i18n/fr/tracking-opt-in.json';
import it from '../i18n/it/tracking-opt-in.json';
import ja from '../i18n/ja/tracking-opt-in.json';
import pl from '../i18n/pl/tracking-opt-in.json';
import ptPR from '../i18n/pt-BR/tracking-opt-in.json';
import ru from '../i18n/ru/tracking-opt-in.json';
import zhCN from '../i18n/zh-CN/tracking-opt-in.json';
import zhTW from '../i18n/zh-TW/tracking-opt-in.json';

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
    // TODO: Add translated / customized URLs
};

/**
 * Available IAB purposes and features translations
 * https://register.consensu.org/Translation
 */
const availableTranslations = [
    'bg', // Bulgarian
    'ca', // Catalan
    'cs', // Czech
    'da', // Danish
    'de', // German
    'el', // Greek
    'es', // Spanish
    'et', // Estonian
    'fi', // Finnish
    'fr', // French
    'hr', // Croatian
    'hu', // Hungarian
    'it', // Italian
    'lt', // Lithuanian
    'lv', // Latvian
    'mt', // Maltese
    'nl', // Dutch
    'no', // Norwegian
    'pl', // Polish
    'pt', // Portuguese
    'ro', // Romanian
    'ru', // Russian
    'sk', // Slovak
    'sl', // Slovenian
    'sv', // Swedish
    'tr', // Turkish
    'zh', // Chinese
];
const TRANSLATIONS_URL_BASE = 'https://www.fandom.com/cmp/';
const TRANSLATIONS_FILE_NAME = 'purposes-CODE.json';

function processLanguages(langs) {
    const getAdditionalStrings = lang => additionalStrings[lang] || additionalStrings.en;
    const langsWithStrings = {};

    // add `additionalStrings` to `langs`
    Object.keys(langs).forEach(key => {
        langsWithStrings[key] = {
            ...langs[key],
            ...getAdditionalStrings(key),
        };
    });

    return langsWithStrings;
}

export const langToContent = processLanguages({
    de: de,
    en: en,
    es: esES,
    fr: fr,
    it: it,
    ja: ja,
    pl: pl,
    pt: ptPR,
    ru: ru,
    zh: zhCN, // simplified
    'zh-hk': zhTW, // traditional
    'zh-tw': zhTW, // traditional
});

export default class ContentManager {
    content = null;
    language = 'en';

    /**
     * @returns Promise<VendorList|null>
     */
    static fetchTranslation(language) {
        if (!availableTranslations.includes(language)) {
            return Promise.resolve(null);
        }

        return getJSON(`${TRANSLATIONS_URL_BASE}${TRANSLATIONS_FILE_NAME.replace('CODE', language)}`);
    }

    constructor(lang) {
        this.language = lang;

        // all the strings default to `en`
        let content = langToContent.en;

        // ToDo: translate "special" headers
        if (lang in langToContent) {
            // merge both together
            content = {
                ...content,
                ...langToContent[lang],
            };
        }

        this.content = content;
    }
}
