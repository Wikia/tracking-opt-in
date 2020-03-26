import { h, Component } from 'preact';
import { PURPOSES } from '../shared/utils';
import OtherPartners from './OtherPartners';
import PreferencesSection from './PreferencesSection';

import globalStyles from './styles.scss';
import styles from './Preferences.scss';

import getParagraphs from './utils/getParagraphs';
import ConsentManagementProvider from '../gdpr/ConsentManagementProvider';

class Preferences extends Component {
    state = {
        purposes: null,
        specialPurposes: null,
        features: null,
        specialFeatures: null,
    };

    // ToDo: Rewrite the logic and get rid of this method
    objectToArray(object) {
        const array = [];

        for (let [key, value] of Object.entries(object)) {
            array[key] = value;
        }

        return array;
    }

    componentWillMount() {
        if (!this.state.purposes && !this.state.features) {
            ConsentManagementProvider.fetchVendorList().then((json) => {
                // Filter vendors to those used by Fandom
                const vendors = this.objectToArray(json.vendors).filter(vendor => (this.props.allVendors.indexOf(vendor.id) >= 0));
                const purposesWithVendors = this.objectToArray(json.purposes).map((purpose) => {
                    purpose.vendors = vendors.filter(vendor => (vendor.purposes.indexOf(purpose.id) >= 0));
                    return purpose;
                });
                this.setState({
                    purposes: purposesWithVendors,
                    specialPurposes: this.objectToArray(json.specialPurposes),
                    features: this.objectToArray(json.features),
                    specialFeatures: this.objectToArray(json.specialFeatures),
                });
                this.forceUpdate();
            });
        }
    }

    togglePurpose(purposeId, isEnabled) {
        const { consentedPurposes, consentedVendors, updatePurposes, tracker } = this.props;
        if (isEnabled) {
            if (consentedPurposes.indexOf(purposeId) < 0) {
                const newConsentedPurposes = consentedPurposes.slice(0);
                newConsentedPurposes.push(purposeId);
                updatePurposes(consentedVendors, newConsentedPurposes);
            }
        } else {
            const newConsentedPurposes = consentedPurposes.filter(id => (purposeId !== id));
            updatePurposes(consentedVendors, newConsentedPurposes);
        }

        switch (purposeId) {
            case PURPOSES.INFORMATION:
                tracker.trackPurposeInformationToggleClick();
                break;
            case PURPOSES.PERSONALIZATION:
                tracker.trackPurposePersonalizationToggleClick();
                break;
            case PURPOSES.AD:
                tracker.trackPurposeAdToggleClick();
                break;
            case PURPOSES.CONTENT:
                tracker.trackPurposeContentToggleClick();
                break;
            case PURPOSES.MEASUREMENT:
                tracker.trackPurposeMeasurementToggleClick();
        }
    }

    toggleVendor(vendorId, isEnabled) {
        const { consentedPurposes, consentedVendors, updatePurposes } = this.props;
        if (isEnabled) {
            if (consentedVendors.indexOf(vendorId) < 0) {
                const newConsentedVendors = consentedVendors.slice(0);
                newConsentedVendors.push(vendorId);
                updatePurposes(newConsentedVendors, consentedPurposes);
            }
        } else {
            const newConsentedVendors = consentedVendors.filter(id => (vendorId !== id));
            updatePurposes(newConsentedVendors, consentedPurposes);
        }
    }

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

    renderPreferenceSections(purposes) {
        if (!purposes) {
            return null;
        }
        const { consentedPurposes, consentedVendors, content, tracker } = this.props;
        const toRender = purposes.map((purpose) => (
            <PreferencesSection
                allFeatures={this.state.features}
                allFeaturesSpecial={this.state.specialFeatures}
                allPurposes={purposes}
                allPurposesSpecial={this.state.specialPurposes}
                consentedPurposes={consentedPurposes}
                consentedVendors={consentedVendors}
                content={content}
                onTogglePurpose={(purposeId, isEnabled) => this.togglePurpose(purposeId, isEnabled)}
                onToggleVendor={(vendorId, isEnabled) => this.toggleVendor(vendorId, isEnabled)}
                purpose={purpose}
                tracker={tracker}
            />
        ));
        return toRender;
    }

    render(props, state) {
        const { appOptions, content, clickBack, clickSave, nonIabConsented, setNonIabConsented, tracker } = props;
        const { purposes } = state;

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
                        <h2 className={`${styles.heading} ${styles.preferencesHeading}`}>{content.preferencesHeadline}</h2>
                        <div className={styles.preferencesDescription} onClick={(e) => this.clickDescription(e)}>
                            {getParagraphs(content.preferencesBody, content, appOptions.isCurse)}
                        </div>
                        <h2 className={`${styles.heading} ${styles.preferencesSubheading}`}>{content.purposesHeader}</h2>
                        {this.renderPreferenceSections(purposes)}
                        <OtherPartners
                            content={content}
                            nonIabConsented={nonIabConsented}
                            onToggle={setNonIabConsented}
                            tracker={tracker}
                        />
                    </div>
                    <div className={globalStyles.footer}>
                        {/* These buttons are divs so that their styles aren't overridden */}
                        <div
                            data-tracking-opt-in-back="true"
                            className={`${globalStyles.backButton} ${globalStyles.footerButton}`}
                            onClick={clickBack}
                            key="back"
                        >
                            {content.backButton}
                        </div>
                        <div
                            data-tracking-opt-in-save="true"
                            className={`${globalStyles.saveButton} ${globalStyles.footerButton}`}
                            onClick={clickSave}
                            key="save"
                        >
                            {content.saveButton}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Preferences;
