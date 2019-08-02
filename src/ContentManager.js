// base i18n file
import en from './i18n/tracking-opt-in.json';

// translations
import de from './i18n/de/tracking-opt-in.json';
import esES from './i18n/es-ES/tracking-opt-in.json';
import fr from './i18n/fr/tracking-opt-in.json';
import it from './i18n/it/tracking-opt-in.json';
import ja from './i18n/ja/tracking-opt-in.json';
import pl from './i18n/pl/tracking-opt-in.json';
import ptPR from './i18n/pt-BR/tracking-opt-in.json';
import ru from './i18n/ru/tracking-opt-in.json';
import zhCN from './i18n/zh-CN/tracking-opt-in.json';
import zhTW from './i18n/zh-TW/tracking-opt-in.json';

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
    constructor(lang) {
        // all the strings default to `en`
        let content = langToContent.en;

        if (lang in langToContent) {
            // merge both together
            content = {
                ...content,
                ...langToContent[lang],
            };
        }

        this.content = content;
    }

    t(key) {
        
    }
}
