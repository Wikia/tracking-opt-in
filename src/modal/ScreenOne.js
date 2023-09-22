import { h, Component } from 'preact';

import globalStyles from './styles.scss';
import styles from './ScreenOne.scss';

import getParagraphs from './utils/getParagraphs';

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
                    <div className={styles.content}>
                        <div className={styles.usesCookiesText}> {content.mainHeadline} </div>
                        <div className={styles.bodyParagraphsContainer} onClick={(e) => this.clickDescription(e)}>
                            {getParagraphs(content.mainBody, content, appOptions.isCurse)}
                        </div>
                    </div>
                    <div className={globalStyles.footer}>
                        {/* These buttons are divs so that their styles aren't overridden */}
                        <div
                            data-tracking-opt-in-learn-more="true"
                            className={`${globalStyles.learnMoreButton} ${globalStyles.footerButton}`}
                            onClick={clickLearnMore}
                            key="learn"
                        >
                            {content.learnMoreButton}
                        </div>
                        <div
                            data-tracking-opt-in-accept="true"
                            className={`${globalStyles.acceptButton} ${globalStyles.footerButton}`}
                            onClick={clickAccept}
                            key="accept"
                        >
                            {content.acceptButton}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScreenOne;
