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

export const langToContent = {
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
};

export default class ContentManager {
    constructor(lang) {
        this.content = langToContent[lang] || langToContent.en;
    }
}
