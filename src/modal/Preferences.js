import { h, Component } from 'preact';
import { INTERNAL_USE } from '../shared/consts';
import AdditionalConsent from './AdditionalConsent';
import InternalUse from './InternalUse';
import PreferencesSection from './PreferencesSection';

import globalStyles from './styles.scss';
import styles from './Preferences.scss';

import getParagraphs from './utils/getParagraphs';
import objectToArray from './utils/objectToArray';
import ConsentManagementProvider from '../gdpr/ConsentManagementProvider';
import ContentManager from '../shared/ContentManager';

class Preferences extends Component {
    state = {
        purposes: null,
        specialPurposes: null,
        features: null,
        specialFeatures: null,
    };

    componentWillMount() {
        if (!this.state.purposes && !this.state.features) {
            const { consentedVendors, language, updatePurposes, updateProviders, updateSpecialFeatures } = this.props;

            updateProviders([]);
            updatePurposes(consentedVendors, []);
            updateSpecialFeatures(consentedVendors, []);

            Promise.all([
                ConsentManagementProvider.fetchVendorList(),
                ContentManager.fetchPurposes(language)
            ]).then(([json, purposes]) => {
                if (purposes) {
                    json.features = purposes.features;
                    json.purposes = purposes.purposes;
                    json.specialFeatures = purposes.specialFeatures;
                    json.specialPurposes = purposes.specialPurposes;
                    json.dataCategories = purposes.dataCategories;
                }

                // Filter vendors to those used by Fandom
                const vendors = objectToArray(json.vendors).filter(vendor => (this.props.allVendors.includes(vendor.id)));
                const purposesWithVendors = objectToArray(json.purposes).map((purpose) => {
                    purpose.vendors = vendors.filter(vendor => (vendor.purposes.includes(purpose.id)));
                    return purpose;
                });
                const specialFeaturesWithVendors = objectToArray(json.specialFeatures).map((specialFeature) => {
                    specialFeature.vendors = vendors.filter(vendor => (vendor.specialFeatures.includes(specialFeature.id)));
                    return specialFeature;
                });
                this.setState({
                    vendors,
                    purposes: purposesWithVendors,
                    specialPurposes: objectToArray(json.specialPurposes),
                    features: objectToArray(json.features),
                    specialFeatures: specialFeaturesWithVendors,
                    dataCategories: objectToArray(json.dataCategories)
                });

                // Opt-out Internal Use vendors on second screen
                Object.keys(INTERNAL_USE).forEach(internalId => this.toggleVendor(parseInt(internalId), false));

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

        tracker.trackPurposeToggleClick(purposeId);
    }

    toggleSpecialFeature(specialFeatureId, isEnabled) {
        const { consentedSpecialFeatures, consentedVendors, updateSpecialFeatures, tracker } = this.props;
        if (isEnabled) {
            if (!consentedSpecialFeatures.includes(specialFeatureId)) {
                const newConsentedSpecialFeatures = [...consentedSpecialFeatures, specialFeatureId];
                updateSpecialFeatures(consentedVendors, newConsentedSpecialFeatures);
            }
        } else {
            const newConsentedSpecialFeatures = consentedSpecialFeatures.filter(id => (specialFeatureId !== id));
            updateSpecialFeatures(consentedVendors, newConsentedSpecialFeatures);
        }

        tracker.trackSpecialFeatureToggleClick(specialFeatureId);
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
                allDataCategories={this.state.dataCategories}
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
                allDataCategories={this.state.dataCategories}
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
        const {
            appOptions,
            consentedPurposes,
            consentedSpecialFeatures,
            consentedVendors,
            consentedProviders,
            content,
            clickBack,
            clickSave,
            tracker,
            updateProviders
        } = props;
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
                        <h2 className={`${styles.heading} ${styles.preferencesSubheading}`}>{content.internalUseHeader}</h2>
                        <InternalUse
                            allFeatures={this.state.features}
                            allFeaturesSpecial={specialFeatures}
                            allPurposes={this.state.purposes}
                            allPurposesSpecial={this.state.specialPurposes}
                            allDataCategories={this.state.dataCategories}
                            consentedVendors={consentedVendors}
                            consentedPurposes={consentedPurposes}
                            consentedSpecialFeatures={consentedSpecialFeatures}
                            content={content}
                            onToggleVendor={(vendorId, isEnabled) => this.toggleVendor(vendorId, isEnabled)}
                            tracker={tracker}
                            vendors={this.state.vendors}
                        />
                        <h2 className={`${styles.heading} ${styles.preferencesSubheading}`}>{content.purposesHeader}</h2>
                        {this.renderPurposesPreferenceSections(purposes)}
                        <h2 className={`${styles.heading} ${styles.preferencesSubheading}`}>{content.specialFeaturesHeader}</h2>
                        {this.renderSpecialFeaturesPreferenceSections(specialFeatures)}
                        <h2 className={`${styles.heading} ${styles.preferencesSubheading}`}>{content.additionalConsentHeader}</h2>
                        <AdditionalConsent
                            content={content}
                            consentedProviders={consentedProviders}
                            tracker={tracker}
                            updateProviders={updateProviders}
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
