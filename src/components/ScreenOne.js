import { h, Component } from 'preact';

import globalStyles from './styles.scss';
import styles from './ScreenOne.scss';

function getParagraphs(blockOfText, content) {
    const replaceKeysInText = text => text.replace(/%([a-zA-Z]+)%/g, (match, key) => {
        if (content[key]) {
            return content[key];
        }
        if (key === 'privacyPolicy') {
            return `<a href="${content.privacyPolicyUrl}" class="${globalStyles.link}" target="_blank" data-privacy-policy="true">${content.privacyPolicyButton}</a>`;
        }
        if (key === 'partnerList') {
            return `<a href="${content.partnerListUrl}" class="${globalStyles.link}" target="_blank" data-partner-list="true">${content.partnerListButton}</a>`;
        }
        return match;
    });

    return blockOfText.map(line => <p dangerouslySetInnerHTML={{ __html: replaceKeysInText(line) }} />);
}

class ScreenOne extends Component {
    clickDescription(event) {
        if (event.target.dataset) {
            const { tracker } = this.props;
            if (event.target.dataset['privacyPolicy']) {
                tracker.trackPrivacyPolicyClick();
            } else if (event.target.dataset['partnerList']) {
                tracker.trackPartnerListClick();
            }
        }
    }

    render({ appOptions, content, clickLearnMore, clickAccept }) {
        return (
            <div
                data-tracking-opt-in-overlay="true"
                className={globalStyles.overlay}
                style={{
                    zIndex: appOptions.zIndex,
                }}
            >
                <div className={`${globalStyles.dialog} ${styles.dialog}`}>
                    <div className={styles.screenOne}>
                        <div className={styles.content}>
                            <div className={styles.usesCookiesText}> {content.mainHeadline} </div>
                            <div className={styles.bodyParagraphsContainer} onClick={(e) => this.clickDescription(e)}>
                                {getParagraphs(content.mainBody, content)}
                            </div>
                        </div>
                    </div>
                    <div className={globalStyles.footer}>
                        <button
                            data-tracking-opt-in-learn-more="true"
                            className={globalStyles.learnMoreButton}
                            onClick={clickLearnMore}
                            key="learn"
                        >
                            {content.learnMoreButton}
                        </button>
                        <button
                            data-tracking-opt-in-accept="true"
                            className={globalStyles.acceptButton}
                            onClick={clickAccept}
                            key="accept"
                        >
                            {content.acceptButton}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScreenOne;
