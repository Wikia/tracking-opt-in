import { h, Component } from 'preact';
import styles from './styles.scss';

class ScreenOne extends Component {
    render({ content, text }) {
        return (
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
        );
    }
}

export default ScreenOne;
