import { h, Component } from 'preact';
import PreferencesVendorList from './PreferencesVendorList';
import Switch from './Switch';

import styles from './PreferencesSection.scss';

class PreferencesSection extends Component {
    state = {
        isExpanded: false,
    };

    isConsentedPurpose(purposeId) {
        return this.props.consentedPurposes.indexOf(purposeId) >= 0;
    }

    toggleIsExpanded() {
        const { isExpanded } = this.state;
        this.setState({ isExpanded: !isExpanded });
        this.forceUpdate();
    }

    render(props, state) {
		const {
            purpose,
            onTogglePurpose,
            onToggleVendor,
            allPurposes,
            allFeatures,
            consentedVendors,
        } = props;
        const { isExpanded } = state;
        const purposeIsEnabled = this.isConsentedPurpose(purpose.id);

		return (
            <div className={styles.section}>
                <div className={styles.flex}>
                    <div>
                        <div className={styles.heading}>{purpose.name}</div>
                        <div className={styles.sectionExpand} onClick={() => this.toggleIsExpanded()}>
                            {isExpanded ? 'Hide Preferences' : 'Show Preferences'} [ICON_TODO]
                        </div>
                    </div>
                    <Switch isOn={purposeIsEnabled} onChange={() => onTogglePurpose(purpose.id, !purposeIsEnabled)} />
                </div>
                {isExpanded && (
                    <div>
                        <div className={styles.description}>{purpose.description}</div>
                        <PreferencesVendorList
                            vendors={purpose.vendors}
                            onToggleVendor={onToggleVendor}
                            allPurposes={allPurposes}
                            allFeatures={allFeatures}
                            consentedVendors={consentedVendors}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default PreferencesSection;
