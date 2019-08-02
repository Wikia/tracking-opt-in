import { h, Component } from 'preact';
import { getVendorList } from '../utils';
import PreferencesSection from './PreferencesSection';

import globalStyles from './styles.scss';
import styles from './Preferences.scss';

class Preferences extends Component {
    state = {
        purposes: null,
        features: null,
    };

    componentWillMount() {
        if (!this.state.purposes && !this.state.features) {
            getVendorList().then((json) => {
                // Filter purposes to those used by Fandom
                const purposes = json.purposes.filter(purpose => (this.props.allPurposes.indexOf(purpose.id) >= 0));
                // Filter vendors to those used by Fandom
                const vendors = json.vendors.filter(vendor => (this.props.allVendors.indexOf(vendor.id) >= 0));
                const purposesWithVendors = purposes.map((purpose) => {
                    purpose.vendors = vendors.filter(vendor => (vendor.purposeIds.indexOf(purpose.id) >= 0));
                    return purpose;
                });
                this.setState({
                    purposes: purposesWithVendors,
                    features: json.features,
                });
                this.forceUpdate();
            });
        }
    }

    togglePurpose(purposeId, isEnabled) {
console.log('TOGGLE PURPOSE', this.props);
        const { consentedPurposes, consentedVendors, updatePurposes } = this.props;
        if (isEnabled) {
            if (consentedVendors.indexOf(purposeId) < 0) {
                consentedVendors.push(puposeId);
                updatePurposes(consentedVendors, consentedPurposes);
            }
        } else {
            consentedVendors.filter(id => (purposeId !== id));
            updatePurposes(consentedVendors, consentedPurposes);
        }
    }

    toggleVendor(vendorId, isEnabled) {
        const { consentedPurposes, consentedVendors, updatePurposes } = this.props;
        if (isEnabled) {
            if (consentedVendors.indexOf(vendorId) < 0) {
                consentedVendors.push(vendorId);
                updatePurposes(consentedVendors, consentedPurposes);
            }
        } else {
            consentedVendors.filter(id => (vendorId !== id));
            updatePurposes(consentedVendors, consentedPurposes);
        }
    }

    renderPreferenceSections(purposes) {
        if (!purposes) {
            return null;
        }
        const { consentedPurposes, consentedVendors, content } = this.props;
        const { allFeatures } = this.state.features;
        const toRender = purposes.map((purpose) => (
            <PreferencesSection
                content={content}
                purpose={purpose}
                onTogglePurpose={this.togglePurpose}
                onToggleVendor={this.toggleVendor}
                allPurposes={purposes}
                allFeatures={allFeatures}
                consentedPurposes={consentedPurposes}
                consentedVendors={consentedVendors}
            />
        ));
        return toRender;
    }

    render(props, state) {
        const { appOptions, content, clickBack, clickSave } = props;
        const { purposes } = state;

        return (
            <div
                className={globalStyles.overlay}
                style={{
                    zIndex: appOptions.zIndex,
                }}
            >
                <div className={`${globalStyles.dialog} ${styles.dialog}`}>
                    <div className={styles.content}>
                        <h2 className={`${styles.heading} ${styles.preferencesHeading}`}>Preference Settings</h2>
                        <div className={styles.preferencesDescription}>
                            Fandom and its partners use cookies to store and collect information from your browser to personalize content and ads, provide social media features, and analyze our traffic. You can define your preferences and give or modify your consent for the purposes and vendors listed below.  In addition, as indicated below, some companies collect information without your consent based on their or our legitimate interest (such as to aid us in website traffic analysis and to inform improvements to our site). You can access their privacy policies for more information.
                            <br/><br/>
                            For more information about the cookies we use, please see our [Privacy Policy]. For information about our partners using cookies on our site, please see the [Partner List].
                        </div>
                        <h2 className={`${styles.heading} ${styles.preferencesSubheading}`}>Our Partners' Purposes</h2>
                        {this.renderPreferenceSections(purposes)}
                    </div>
                    <div className={globalStyles.footer}>
                        <div className={globalStyles.buttons}>
                            <div
                                data-tracking-opt-in-back="true"
                                className={globalStyles.backButton}
                                onClick={clickBack}
                                key="back"
                            >
                                {content.buttonBack}
                            </div>
                            <div
                                data-tracking-opt-in-save="true"
                                className={globalStyles.saveButton}
                                onClick={clickSave}
                                key="save"
                            >
                                {content.buttonSave}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Preferences;
