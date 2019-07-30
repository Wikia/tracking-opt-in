import de from './i18n/de.json';
import en from './i18n/en.json';
import es from './i18n/es.json';
import fr from './i18n/fr.json';
import it from './i18n/it.json';
import ja from './i18n/ja.json';
import pl from './i18n/pl.json';
import pt from './i18n/pt.json';
import ru from './i18n/ru.json';
import zh from './i18n/zh.json';
import zhTw from './i18n/zh-tw.json';

export const langToContent = {
    de: de,
    en: en,
    es: es,
    fr: fr,
    it: it,
    ja: ja,
    pl: pl,
    pt: pt,
    ru: ru,
    zh: zh, // simplified
    'zh-hk': zhTw, // traditional
    'zh-tw': zhTw, // traditional
};

export default class ContentManager {
    constructor(lang) {
        this.content = langToContent[lang] || langToContent.en;
    }
}
