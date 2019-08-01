import { h, Component } from 'preact';
import { fetchVendorList } from '../ConsentManagementProvider';
import PreferencesSection from './PreferencesSection';

import globalStyles from './styles.scss';
import styles from './Preferences.scss';

class Preferences extends Component {
    state = {
        purposes: null,
    };

    componentWillMount() {
        if (!this.state.purposes) {
            fetchVendorList().then((json) => {
                // Filter purposes to those used by Fandom
                const purposes = json.purposes.filter(purpose => (this.props.allPurposes.indexOf(purpose.id) >= 0));
                // Filter vendors to those used by Fandom
                const vendors = json.vendors.filter(vendor => (this.props.allVendors.indexOf(vendor.id) >= 0));
                const purposesWithVendors = purposes.map((purpose) => {
                    purpose.vendors = vendors.filter(vendor => (vendor.purposeIds.indexOf(purpose.id) >= 0));
                    return purpose;
                });
                this.setState({ purposes: purposesWithVendors });
                this.forceUpdate();
            });
        }
    }

    togglePurpose(isEnabled) {
        const { consentedPurposes, consentedVendors } = this.props;
        // TODO this.props.updatePurposes()
    }

    toggleVendor(purpose, isEnabled) {
        const { consentedPurposes, consentedVendors } = this.props;
        // TODO this.props.updatePurposes()
    }

    renderPreferenceSections(purposes) {
        if (!purposes) {
            return null;
        }
        const toRender = purposes.map((purpose) => (
            <PreferencesSection
                heading={purpose.name}
                description={purpose.description}
                vendors={purpose.vendors}
                onTogglePurpose={this.togglePurpose}
                onToggleVendor={this.toggleVendor}
                isEnabled={this.props.consentedPurposes.indexOf(purpose.id) >= 0}
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
