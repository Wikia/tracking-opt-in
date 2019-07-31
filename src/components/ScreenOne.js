import { h, Component } from 'preact';
import styles from './styles.scss';

class ScreenOne extends Component {
    render({ content, text }) {
        return (
            <div className={styles.screenOne}>
                <div className={styles.content}>
                <div className={styles.usesCookiesText}> {content.headline} </div>
                    <div className={styles.bodyParagraphsContainer}>
                        {text.map((paragraph) =>
                            <p>{paragraph}</p>
                        )}
                    </div>
                </div>
                <div className={`${styles.links} ${styles.mobile}`}>
                    <a href={content.privacyLink} onClick={() => { this.track(ACTION_CLICK, 'privacy_policy'); }}>{content.privacyLinkText}</a>
                    <a href={content.partnerLink} onClick={() => { this.track(ACTION_CLICK, 'partner_list'); }}>{content.partnerLinkText}</a>
                </div>
            </div>
        );
    }
}

export default ScreenOne;
