import { h, Component } from 'preact';
import { PURPOSES } from '../shared/utils';
import PreferencesVendorList from './PreferencesVendorList';
import Switch from './Switch';

import globalStyles from './styles.scss';
import styles from './PreferencesSection.scss';

class PreferencesSection extends Component {
    state = {
        isExpanded: false,
    };

    isConsentedItem(itemId) {
        return this.props.consentedItems.indexOf(itemId) >= 0;
    }

    toggleIsExpanded() {
        const { item, tracker } = this.props;
        const { isExpanded } = this.state;
        this.setState({ isExpanded: !isExpanded });
        this.forceUpdate();

        switch (item.id) {
            case PURPOSES.INFORMATION:
                tracker.trackPurposeInformationExpandClick();
                break;
            case PURPOSES.PERSONALIZATION:
                tracker.trackPurposePersonalizationExpandClick();
                break;
            case PURPOSES.AD:
                tracker.trackPurposeAdExpandClick();
                break;
            case PURPOSES.CONTENT:
                tracker.trackPurposeContentExpandClick();
                break;
            case PURPOSES.MEASUREMENT:
                tracker.trackPurposeMeasurementExpandClick();
        }
    }

    render(props, state) {
		const {
            content,
            onToggleItem,
            onToggleVendor,
            allPurposes,
            allPurposesSpecial,
            allFeatures,
            allFeaturesSpecial,
            allItems,
            consentedItems,
            consentedVendors,
            item,
            tracker,
        } = props;
        const { isExpanded } = state;
        const itemIsEnabled = this.isConsentedItem(item.id);

        return (
            <div className={styles.section} key={item.id}>
                <div className={styles.flex}>
                    <div>
                        <div className={styles.heading}>{allItems[item.id].name}</div>
                        <div className={styles.sectionExpand} onClick={() => this.toggleIsExpanded()}>
                            {isExpanded ? content.hidePurposeDetailsButton : content.showPurposeDetailsButton}
                            <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" className={`${globalStyles.chevron} ${isExpanded ? globalStyles.chevronExpanded : ''}`}>
                                <path d="M11.707 3.293a.999.999 0 0 0-1.414 0L6 7.586 1.707 3.293A.999.999 0 1 0 .293 4.707l5 5a.997.997 0 0 0 1.414 0l5-5a.999.999 0 0 0 0-1.414" fill-rule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                    <Switch isOn={itemIsEnabled} onChange={() => onToggleItem(item.id, !itemIsEnabled)} />
                </div>
                {isExpanded && (
                    <div>
                        <div className={styles.description}>{allItems[item.id].descriptionLegal}</div>
                        <PreferencesVendorList
                            content={content}
                            vendors={item.vendors}
                            onToggleVendor={onToggleVendor}
                            allPurposes={allPurposes}
                            allPurposesSpecial={allPurposesSpecial}
                            allFeatures={allFeatures}
                            allFeaturesSpecial={allFeaturesSpecial}
                            allItems={allItems}
                            consentedItems={consentedItems}
                            consentedVendors={consentedVendors}
                            item={item}
                            tracker={tracker}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default PreferencesSection;
