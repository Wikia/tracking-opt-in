import { h, Component } from 'preact';
import Switch from './Switch';

import styles from './styles.scss';

class PreferencesSection extends Component {
    render(props, state) {
		const { heading, isEnabled } = props;
		const { isExpanded } = state;

		return (
            <div className={styles.preferencesSection}>
                <div>
                    <div className={styles.preferencesSectionHeading}>{heading}</div>
                    <div className={styles.preferencesSectionExpand}>
                        {isExpanded ? 'Hide Preferences' : 'Show Preferences'} [ICON_HERE]
                    </div>
                    <Switch isOn={isEnabled} />
                </div>

            </div>
        );
    }
}

export default PreferencesSection;
