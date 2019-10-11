import { h } from 'preact';
import globalStyles from '../components/styles.scss';

function getParagraphs(blockOfText, content, isCurse = false) {
    const replaceKeysInText = text => text.replace(/%([a-zA-Z]+)%/g, (match, key) => {
        if (content[key]) {
            return content[key];
        }
        if (key === 'privacyPolicy') {
            const privacyPolicyUrl = isCurse ? 'https://www.fandom.com/curse-privacy-policy' : content.privacyPolicyUrl;
            return `<a href="${privacyPolicyUrl}" class="${globalStyles.link}" target="_blank" data-privacy-policy="true">${content.privacyPolicyButton}</a>`;
        }
        if (key === 'partnerList') {
            return `<a href="${content.partnerListUrl}" class="${globalStyles.link}" target="_blank" data-partner-list="true">${content.partnerListButton}</a>`;
        }
        return match;
    });

    // Used to prevent cross-site scripting (XSS) attacks
    return blockOfText.map(line => <p dangerouslySetInnerHTML={{ __html: replaceKeysInText(line) }} />);
};

export default getParagraphs;
