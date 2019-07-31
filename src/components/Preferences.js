import { h, Component } from 'preact';
import PreferencesSection from './PreferencesSection';

import globalStyles from './styles.scss';
import styles from './Preferences.scss';

class Preferences extends Component {
    render(props, state) {
        const { appOptions } = props;
        return (
            <div
                className={globalStyles.overlay}
                style={{
                    zIndex: appOptions.zIndex,
                }}
            >
                <div className={globalStyles.container}>
                    <h2 className={`${styles.heading} ${styles.preferencesHeading}`}>Preference Settings</h2>
                    <div className={styles.preferencesDescription}>
                        Fandom engages in certain interest-based advertising activities in order to support this site and to provide personalized ad experiences. By clicking / tapping "ACCEPT", you consent to this activity. If you are under the age of consent in your jurisdiction for data processing purposes, or if you wish to deny consent, please click / tap “REJECT”. For more information about the cookies we use, please see our Privacy Policy. For information about our partners using advertising cookies on our site, please see the Partner List below.
                    </div>
                    <h2 className={`${styles.heading} ${styles.preferencesSubheading}`}>Our Partners' Purposes</h2>
                    <PreferencesSection heading="Information storage and usage" isEnabled={true} />
                    <PreferencesSection heading="Personalization" isEnabled={true} />
                </div>
            </div>
        );
    }
}

export default Preferences;
