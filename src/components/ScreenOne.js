import { h, Component } from 'preact';

import globalStyles from './styles.scss';
import styles from './ScreenOne.scss';

function getParagraphs(blockOfText, content) {
    const replaceKeysInText = text => text.replace(/%([a-zA-Z]+)%/g, (match, key) => {
        if (content[key]) {
            return content[key];
        }
        return match;
    });

    return blockOfText.map(line => <p dangerouslySetInnerHTML={{ __html: replaceKeysInText(line) }} />);
}

class ScreenOne extends Component {
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
                            <div className={styles.bodyParagraphsContainer}>
                                {getParagraphs(content.mainBody, content)}
                            </div>
                        </div>
                    </div>
                    <div className={globalStyles.footer}>
                        <div className={globalStyles.buttons}>
                            <div
                                data-tracking-opt-in-learn-more="true"
                                className={globalStyles.learnMoreButton}
                                onClick={clickLearnMore}
                                key="learn"
                            >
                                {content.learnMoreButton}
                            </div>
                            <div
                                data-tracking-opt-in-accept="true"
                                className={globalStyles.acceptButton}
                                onClick={clickAccept}
                                key="accept"
                            >
                                {content.acceptButton}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScreenOne;
