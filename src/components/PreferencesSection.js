import { h, Component } from 'preact';
import Switch from './Switch';

import styles from './PreferencesSection.scss';

class PreferencesSection extends Component {
    state = {
        isExpanded: false,
    };

    toggleIsExpanded() {
        const { isExpanded } = this.state;
        this.setState({ isExpanded: !isExpanded });
        this.forceUpdate();
    }

    render(props, state) {
		const { heading, isEnabled } = props;
        const { isExpanded } = this.state;

		return (
            <div className={styles.section}>
                <div>
                    <div className={styles.heading}>{heading}</div>
                    <div className={styles.preferencesSectionExpand} onClick={() => this.toggleIsExpanded()}>
                        {isExpanded ? 'Hide Preferences' : 'Show Preferences'} [ICON_HERE]
                    </div>
                </div>
                <Switch isOn={isEnabled} />
            </div>
        );
    }
}

PreferencesSection.defaultProps = {
    isEnabled: true,
};

export default PreferencesSection;
