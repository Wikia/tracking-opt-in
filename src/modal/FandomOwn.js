import { h, Component } from 'preact';
import { NON_IAB_VENDORS } from '../shared/consts';
import PreferencesVendorList from './PreferencesVendorList';
import Switch from './Switch';

import globalStyles from './styles.scss';
// This is another (although unique) preferences section, so it uses the same styles
import sectionStyles from './PreferencesSection.scss';
import vendorListStyles from './PreferencesVendorList.scss';
import styles from "./PreferencesVendorList.scss";
import getCookieAge from "./utils/getCookieAge";

class FandomOwn extends Component {
    state = {
        isExpanded: false,
    };

    isConsentedPurpose(purposeId) {
        return this.props.consentedPurposes.includes(purposeId);
    }

    isConsentedVendor(vendorId) {
        return this.props.consentedVendors.includes(vendorId);
    }

    isConsentedSpecialFeature(specialFeatureId) {
        return this.props.consentedSpecialFeatures.includes(specialFeatureId);
    }

    toggleIsExpanded() {
        const { tracker } = this.props;
        const { isExpanded } = this.state;
        this.setState({ isExpanded: !isExpanded });
        this.forceUpdate();
        tracker.trackFandomOwnExpandClick();
    }

    toggleSwitch(isOn) {
        // Enables/disables all other vendors
        const { onToggle, tracker } = this.props;
        onToggle(isOn);
        tracker.trackFandomOwnToggleClick();
    }

    renderVendors() {
        const { content } = this.props;

        return NON_IAB_VENDORS.map((vendor) => {
            return (
            <div className={vendorListStyles.vendor} key={vendor.name}>
                <div className={vendorListStyles.flex}>
                    <div className={vendorListStyles.vendorName}>{vendor.name}</div>
                    <div>
                        <a href={vendor.policyUrl} className={vendorListStyles.link} target="_blank">
                            {content.privacyPolicyLinkButton}
                        </a>
                    </div>
                </div>
            </div>
        )});
    }

    // ToDo refactor
    renderVendors2() {
        const { content, onToggleVendor } = this.props;
console.log(this.props, this.props.purposes[1]);
        const vendors = [this.props.purposes[1].vendors[134]];
console.log(vendors);
        const toRender = vendors.map((vendor) => {
            const vendorIsEnabled = true;

            return (
                <div className={styles.vendor} key={vendor.name}>
                    <div className={styles.flex}>
                        <div>
                            <div className={styles.vendorName}>Content personalization</div>
                            <div className={styles.vendorExpand} onClick={() => this.toggleIsExpanded(vendor.id)}>
                                {vendor.isExpanded ? content.hideVendorDetailsButton : content.showVendorDetailsButton}
                                <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" className={`${globalStyles.chevron} ${vendor.isExpanded ? globalStyles.chevronExpanded : ''}`}>
                                    <path d="M11.707 3.293a.999.999 0 0 0-1.414 0L6 7.586 1.707 3.293A.999.999 0 1 0 .293 4.707l5 5a.997.997 0 0 0 1.414 0l5-5a.999.999 0 0 0 0-1.414" fill-rule="evenodd"/>
                                </svg>
                            </div>
                        </div>
                        <Switch isOn={vendorIsEnabled} onChange={() => onToggleVendor(vendor.id, !vendorIsEnabled)} />
                    </div>
                    {this.renderVendorDetails(vendor)}
                </div>
            );
        });
        return toRender;
    }

    renderVendorDetails(vendor) {
        const { content, allPurposes, allPurposesSpecial, allFeatures, allFeaturesSpecial } = this.props;

        return (
            <div className={styles.vendorDetails}>
                {vendor.purposes.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.purposesHeading}
                        </div>
                        {vendor.purposes.map((purposeId) => (
                            <div className={`${styles.vendorDetail} ${styles.flex}`} key={`${vendor.id}_${purposeId}`}>
                                <span>{allPurposes[purposeId].name}</span>
                                <span classname={styles.allowed}>
                                    {this.isConsentedVendor(vendor.id) && this.isConsentedPurpose(purposeId) ? content.allowedButton : content.disallowedButton}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.specialPurposes.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.purposesSpecialHeading}
                        </div>
                        {vendor.specialPurposes.map((purposeId) => (
                            <div className={`${styles.vendorDetail} ${styles.flex}`} key={`${vendor.id}_${purposeId}`}>
                                <span>{allPurposesSpecial[purposeId].name}</span>
                                <a href={vendor.policyUrl} className={styles.link} target="_blank">
                                    {content.findOutMoreButton}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.legIntPurposes.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.purposesLegitimateInterestHeading}
                        </div>
                        {vendor.legIntPurposes.map((purposeId) => (
                            <div className={`${styles.vendorDetail} ${styles.flex}`} key={`${vendor.id}_${purposeId}`}>
                                <span>{allPurposes[purposeId].name}</span>
                                <a href={vendor.policyUrl} className={styles.link} target="_blank">
                                    {content.findOutMoreButton}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.flexiblePurposes.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.purposesFlexibleHeading}
                        </div>
                        {vendor.flexiblePurposes.map((purposeId) => (
                            <div className={`${styles.vendorDetail} ${styles.flex}`} key={`${vendor.id}_${purposeId}`}>
                                <span>{allPurposes[purposeId].name}</span>
                                <a href={vendor.policyUrl} className={styles.link} target="_blank">
                                    {content.findOutMoreButton}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.features.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.featuresHeading}
                        </div>
                        {vendor.features.map((featureId) => (
                            <div className={styles.vendorDetail} key={`${vendor.id}_${featureId}`}>
                                <div className={styles.flex}>
                                    <span>{allFeatures[featureId].name}</span>
                                    <a href={vendor.policyUrl} className={styles.link} target="_blank">
                                        {content.findOutMoreButton}
                                    </a>
                                </div>
                                <div className={styles.featureDescription}>
                                    {allFeatures[featureId].descriptionLegal}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.specialFeatures.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.featuresSpecialHeading}
                        </div>
                        {vendor.specialFeatures.map((featureId) => (
                            <div className={styles.vendorDetail} key={`${vendor.id}_${featureId}`}>
                                <div className={styles.flex}>
                                    <span>{allFeaturesSpecial[featureId].name}</span>
                                    <span className={styles.allowed}>
                                    {this.isConsentedSpecialFeature(featureId) ? content.allowedButton : content.disallowedButton}
                                </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.policyUrl && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.privacyPolicyHeading}
                        </div>
                        <div className={styles.vendorDetail}>
                            <a href={vendor.policyUrl} className={styles.link} target="_blank">
                                {content.privacyPolicyLinkButton}
                            </a>
                        </div>
                    </div>
                )}
                <div>{/* fragment */}
                    <div className={styles.subheader}>
                        {content.storageDetailsHeading}
                    </div>
                    {vendor.usesNonCookieAccess !== undefined && (
                        <div className={styles.vendorDetail}>
                            {vendor.usesNonCookieAccess ? content.storageDetailsNonCookieAccessTrue : content.storageDetailsNonCookieAccessFalse}
                        </div>
                    )}
                    {vendor.cookieMaxAgeSeconds !== undefined && (
                        <div className={styles.vendorDetail}>
                            {content.storageDetailsCookieMaxAge} {getCookieAge(vendor.cookieMaxAgeSeconds, content)}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    render(props, state) {
		const {
            content,
            nonIabConsented,
            tracker,
        } = props;
        const { isExpanded } = state;

        return (
            <div className={sectionStyles.section}>
                <div className={sectionStyles.flex}>
                    <div>
                        {/*<div className={sectionStyles.heading}>{content.otherPartnersHeading}</div>*/}
                        <div className={sectionStyles.heading}>Fandom, Inc.</div>
                        <div className={sectionStyles.sectionExpand} onClick={() => this.toggleIsExpanded()}>
                            {isExpanded ? content.hidePurposeDetailsButton : content.showPurposeDetailsButton}
                            <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" className={`${globalStyles.chevron} ${isExpanded ? globalStyles.chevronExpanded : ''}`}>
                                <path d="M11.707 3.293a.999.999 0 0 0-1.414 0L6 7.586 1.707 3.293A.999.999 0 1 0 .293 4.707l5 5a.997.997 0 0 0 1.414 0l5-5a.999.999 0 0 0 0-1.414" fill-rule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                    <Switch isOn={nonIabConsented} onChange={(isOn) => this.toggleSwitch(isOn)} />
                </div>
                {isExpanded && (
                    <div>
                        <div className={vendorListStyles.vendorList}>
                            <div className={vendorListStyles.header}>Our projects</div>
                            {this.renderVendors2()}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default FandomOwn;
