import { h, Component } from 'preact';

import globalStyles from './styles.scss';
import styles from './ScreenOne.scss';

import getParagraphs from './utils/getParagraphs';
import {IAB_VENDORS} from "../shared/consts";
import getPartnerCount from "./utils/getPartnerCount";

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

    render({ appOptions, content, clickLearnMore, clickAccept, clickReject }) {
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
                            <div>
                                {getParagraphs(content.ourPartnersCount, content, appOptions.isCurse)}
                            </div>
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
                        <div className={globalStyles.consentButtons}>
                            <div
                                data-tracking-opt-in-accept="true"
                                className={`${globalStyles.acceptButton} ${globalStyles.footerButton}`}
                                onClick={clickAccept}
                                key="accept"
                            >
                                {content.acceptAllButton}
                            </div>
                                <div
                                    data-tracking-opt-in-reject="true"
                                    className={`${globalStyles.rejectButton} ${globalStyles.footerButton}`}
                                    onClick={clickReject}
                                    key="reject"
                                >
                                    {content.rejectAllButton}
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScreenOne;
