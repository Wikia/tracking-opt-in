import { h, Component } from 'preact';
import { PURPOSES } from '../shared/utils';
import OtherPartners from './OtherPartners';
import PreferencesSection from './PreferencesSection';

import globalStyles from './styles.scss';
import styles from './Preferences.scss';

import getParagraphs from './utils/getParagraphs';
import ConsentManagementProvider from '../gdpr/ConsentManagementProvider';
import ContentManager from '../shared/ContentManager';

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
            const { consentedVendors, language, updatePurposes, updateSpecialFeatures } = this.props;

            updatePurposes(consentedVendors, []);
            updateSpecialFeatures(consentedVendors, []);

            Promise.all([
                ConsentManagementProvider.fetchVendorList(),
                ContentManager.fetchTranslation(language)
            ]).then(([json, translation]) => {
                if (translation) {
                    json.features = translation.features;
                    json.purposes = translation.purposes;
                    json.specialFeatures = translation.specialFeatures;
                    json.specialPurposes = translation.specialPurposes;
                }

                // Filter vendors to those used by Fandom
                const vendors = this.objectToArray(json.vendors).filter(vendor => (this.props.allVendors.includes(vendor.id)));
                const purposesWithVendors = this.objectToArray(json.purposes).map((purpose) => {
                    purpose.vendors = vendors.filter(vendor => (vendor.purposes.includes(purpose.id)));
                    return purpose;
                });
                const specialFeaturesWithVendors = this.objectToArray(json.specialFeatures).map((specialFeature) => {
                    specialFeature.vendors = vendors.filter(vendor => (vendor.specialFeatures.includes(specialFeature.id)));
                    return specialFeature;
                });
                this.setState({
                    purposes: purposesWithVendors,
                    specialPurposes: this.objectToArray(json.specialPurposes),
                    features: this.objectToArray(json.features),
                    specialFeatures: specialFeaturesWithVendors,
                });
                this.forceUpdate();
            });
        }
    }

    togglePurpose(purposeId, isEnabled) {
        const { consentedPurposes, consentedVendors, updatePurposes, tracker } = this.props;
        if (isEnabled) {
            if (!consentedPurposes.includes(purposeId)) {
                const newConsentedPurposes = [...consentedPurposes, purposeId];
                updatePurposes(consentedVendors, newConsentedPurposes);
            }
        } else {
            const newConsentedPurposes = consentedPurposes.filter(id => (purposeId !== id));
            updatePurposes(consentedVendors, newConsentedPurposes);
        }

        // ToDo: fix purposes tracking: ADEN-10261
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

    toggleSpecialFeature(specialFeatureId, isEnabled) {
        const { consentedSpecialFeatures, consentedVendors, updateSpecialFeatures } = this.props;
        if (isEnabled) {
            if (!consentedSpecialFeatures.includes(specialFeatureId)) {
                const newConsentedSpecialFeatures = [...consentedSpecialFeatures, specialFeatureId];
                updateSpecialFeatures(consentedVendors, newConsentedSpecialFeatures);
            }
        } else {
            const newConsentedSpecialFeatures = consentedSpecialFeatures.filter(id => (specialFeatureId !== id));
            updateSpecialFeatures(consentedVendors, newConsentedSpecialFeatures);
        }
    }

    toggleVendor(vendorId, isEnabled) {
        const { consentedPurposes, consentedVendors, consentedSpecialFeatures, updatePurposes, updateSpecialFeatures } = this.props;
        if (isEnabled) {
            if (!consentedVendors.includes(vendorId)) {
                const newConsentedVendors = [...consentedVendors, vendorId];
                updatePurposes(newConsentedVendors, consentedPurposes);
                updateSpecialFeatures(newConsentedVendors, consentedSpecialFeatures);
            }
        } else {
            const newConsentedVendors = consentedVendors.filter(id => (vendorId !== id));
            updatePurposes(newConsentedVendors, consentedPurposes);
            updateSpecialFeatures(newConsentedVendors, consentedSpecialFeatures);
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

    renderPurposesPreferenceSections(purposes) {
        if (!purposes) {
            return null;
        }
        const { consentedPurposes, consentedSpecialFeatures, consentedVendors, content, tracker } = this.props;

        return purposes.map((purpose) => (
            <PreferencesSection
                allFeatures={this.state.features}
                allFeaturesSpecial={this.state.specialFeatures}
                allPurposes={purposes}
                allPurposesSpecial={this.state.specialPurposes}
                allItems={purposes}
                consentedVendors={consentedVendors}
                consentedPurposes={consentedPurposes}
                consentedSpecialFeatures={consentedSpecialFeatures}
                content={content}
                onToggleItem={(purposeId, isEnabled) => this.togglePurpose(purposeId, isEnabled)}
                onToggleVendor={(vendorId, isEnabled) => this.toggleVendor(vendorId, isEnabled)}
                item={{...purpose, type: 'purpose'}}
                tracker={tracker}
            />
        ));
    }

    renderSpecialFeaturesPreferenceSections(specialFeatures) {
        if (!specialFeatures) {
            return null;
        }
        const { consentedPurposes, consentedSpecialFeatures, consentedVendors, content, tracker } = this.props;
        return specialFeatures.map((specialFeature) => (
            <PreferencesSection
                allFeatures={this.state.features}
                allFeaturesSpecial={specialFeatures}
                allPurposes={this.state.purposes}
                allPurposesSpecial={this.state.specialPurposes}
                allItems={specialFeatures}
                consentedVendors={consentedVendors}
                consentedPurposes={consentedPurposes}
                consentedSpecialFeatures={consentedSpecialFeatures}
                content={content}
                onToggleItem={(specialFeatureId, isEnabled) => {this.toggleSpecialFeature(specialFeatureId, isEnabled)}}
                onToggleVendor={(vendorId, isEnabled) => this.toggleVendor(vendorId, isEnabled)}
                item={{...specialFeature, type: 'specialFeature'}}
                tracker={tracker}
            />
        ));
    }

    render(props, state) {
        const { appOptions, content, clickBack, clickSave, nonIabConsented, setNonIabConsented, tracker } = props;
        const { purposes, specialFeatures } = state;

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
                        {this.renderPurposesPreferenceSections(purposes)}
                        {/*ToDo: cleanup*/}
                        {/*<OtherPartners*/}
                        {/*    content={content}*/}
                        {/*    nonIabConsented={nonIabConsented}*/}
                        {/*    onToggle={setNonIabConsented}*/}
                        {/*    tracker={tracker}*/}
                        {/*/>*/}
                        <h2 className={`${styles.heading} ${styles.preferencesSubheading}`}>{content.specialFeaturesHeader}</h2>
                        {this.renderSpecialFeaturesPreferenceSections(specialFeatures)}
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
