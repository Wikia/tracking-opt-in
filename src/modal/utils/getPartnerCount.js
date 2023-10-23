import { h } from 'preact';

function getPartnerCount(blockOfText, partnerCount) {
    const replaceKeysInText = text => text.replace(/%([a-zA-Z]+)%/g, (match, key) => {
        if (content[key]) {
            return content[key];
        }
        if(key === 'partnerCount') {
            return partnerCount;
        }
        return match;
    });

    return blockOfText?.map(line => <p dangerouslySetInnerHTML={{ __html: replaceKeysInText(line) }} />);
}

export default getPartnerCount;
