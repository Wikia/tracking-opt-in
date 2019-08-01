import { h, Component } from 'preact';

import globalStyles from './styles.scss';
import styles from './ScreenOne.scss';

class ScreenOne extends Component {
    render({ content, text, appOptions }) {
        return (
            <div
                data-tracking-opt-in-overlay="true"
                className={globalStyles.overlay}
                style={{
                    zIndex: appOptions.zIndex,
                }}
            >
                <div className={globalStyles.container}>
                    <div className={styles.screenOne}>
                        <div className={styles.content}>
                            <div className={styles.usesCookiesText}> {content.headline} </div>
                            <div className={styles.bodyParagraphsContainer}>
                                <p>{text[0]}</p>
                                <p>{text[1]}</p>
                                <p>
                                    {text[2]}
                                    <a href={content.privacyLink} className={styles.links} onClick={() => { this.track(ACTION_CLICK, 'privacy_policy'); }}>{content.privacyLinkText}</a>
                                    {text[3]}
                                    <a href={content.partnerLink} className={styles.links} onClick={() => { this.track(ACTION_CLICK, 'partner_list'); }}>{content.partnerLinkText}</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={globalStyles.footer}>
                        <div className={globalStyles.buttons}>
                            <div
                                data-tracking-opt-in-learn-more="true"
                                className={globalStyles.learnMoreButton}
                                onClick={this.learnMore}
                                key="learn"
                            >
                                {content.buttonLearnMore}
                            </div>
                            <div
                                data-tracking-opt-in-accept="true"
                                className={globalStyles.acceptButton}
                                onClick={this.accept}
                                key="accept"
                            >
                                {content.buttonAccept}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScreenOne;
