import { h, Component } from 'preact';
import Switch from './Switch';

import globalStyles from './styles.scss';
import styles from './PreferencesVendorList.scss';

class PreferencesVendorList extends Component {
    state = {
        vendors: this.props.vendors.map((vendor) => {
            vendor.isExpanded = false;
            return vendor;
        }),
    };

    isConsentedPurpose(purposeId) {
        return this.props.consentedPurposes.indexOf(purposeId) >= 0;
    }

    isConsentedVendor(vendorId) {
        return this.props.consentedVendors.indexOf(vendorId) >= 0;
    }

    toggleIsExpanded(vendorId) {
        const { tracker } = this.props;
        const { vendors } = this.state;
        vendors.forEach((vendor) => {
            if (vendor.id === vendorId) {
                vendor.isExpanded = !vendor.isExpanded;
            }
        });
        this.setState({ vendors });
        this.forceUpdate();

        tracker.trackVendorExpandClick();
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
                                    {allFeatures[featureId].description}
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
                                    <a href={vendor.policyUrl} className={styles.link} target="_blank">
                                        {content.findOutMoreButton}
                                    </a>
                                </div>
                                <div className={styles.featureDescription}>
                                    {allFeaturesSpecial[featureId].description}
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
            </div>
        );
    }

    renderVendors() {
        const { content, vendors, onToggleVendor } = this.props;

        if (!vendors) {
            return null;
        }
        const toRender = vendors.map((vendor) => {
            const vendorIsEnabled = this.isConsentedVendor(vendor.id);

            return (
                <div className={styles.vendor} key={vendor.name}>
                    <div className={styles.flex}>
                        <div>
                            <div className={styles.vendorName}>{vendor.name}</div>
                            <div className={styles.vendorExpand} onClick={() => this.toggleIsExpanded(vendor.id)}>
                                {vendor.isExpanded ? content.hideVendorDetailsButton : content.showVendorDetailsButton}
                                <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" className={`${globalStyles.chevron} ${vendor.isExpanded ? globalStyles.chevronExpanded : ''}`}>
                                    <path d="M11.707 3.293a.999.999 0 0 0-1.414 0L6 7.586 1.707 3.293A.999.999 0 1 0 .293 4.707l5 5a.997.997 0 0 0 1.414 0l5-5a.999.999 0 0 0 0-1.414" fill-rule="evenodd"/>
                                </svg>
                            </div>
                        </div>
                        <Switch isOn={vendorIsEnabled} onChange={() => onToggleVendor(vendor.id, !vendorIsEnabled)} />
                    </div>
                    {vendor.isExpanded && this.renderVendorDetails(vendor)}
                </div>
            );
        });
        return toRender;
    }

    render(props) {
        const { content } = props;

        return (
            <div className={styles.vendorList}>
                <div className={styles.header}>{content.vendorsHeader}</div>
                {this.renderVendors()}
            </div>
        );
    }
}

export default PreferencesVendorList;
