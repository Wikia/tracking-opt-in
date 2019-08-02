import { h, Component } from 'preact';
import Switch from './Switch';

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

    getPurposeById(purposeId) {
        return this.props.allPurposes.find(purpose => purpose.id === purposeId);
    }

    getFeatureById(featureId) {
        return this.props.allFeatures.find(feature => feature.id === featureId);
    }

    toggleIsExpanded(vendorId) {
        const { vendors } = this.state;
        vendors.forEach((vendor) => {
            if (vendor.id === vendorId) {
                vendor.isExpanded = !vendor.isExpanded;
            }
        });
        this.setState({ vendors });
        this.forceUpdate();
    }

    renderVendorDetails(vendor) {
        const { content } = this.props;

        return (
            <div className={styles.vendorDetails}>
                {vendor.purposeIds.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.purposesHeading}
                        </div>
                        {vendor.purposeIds.map((purposeId) => (
                            <div className={`${styles.vendorDetail} ${styles.flex}`}>
                                <span>{this.getPurposeById(purposeId).name}</span>
                                <span classname={styles.allowed}>
                                    {this.isConsentedPurpose(purposeId) ? content.allowedButton : content.disallowedButton}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.legIntPurposeIds.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.purposesLegitimateInterestHeading}
                        </div>
                        {vendor.legIntPurposeIds.map((purposeId) => (
                            <div className={`${styles.vendorDetail} ${styles.flex}`}>
                                <span>{this.getPurposeById(purposeId).name}</span>
                                <a href={vendor.policyUrl} className={styles.link} target="_blank">
                                    {content.findOutMoreButton}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.featureIds.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.featuresHeading}
                        </div>
                        {vendor.featureIds.map((featureId) => (
                            <div className={styles.vendorDetail}>
                                <div className={styles.flex}>
                                    <span>{this.getFeatureById(featureId).name}</span>
                                    <a href={vendor.policyUrl} className={styles.link} target="_blank">
                                        {content.findOutMoreButton}
                                    </a>
                                </div>
                                <div className={styles.featureDescription}>
                                    {this.getFeatureById(featureId).description}
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
            <div className={styles.vendor}>
                <div className={styles.flex}>
                    <div>
                        <div className={styles.vendorName}>{vendor.name}</div>
                        <div className={styles.vendorExpand} onClick={() => this.toggleIsExpanded(vendor.id)}>
                            {vendor.isExpanded ? content.hideVendorDetailsButton : content.showVendorDetailsButton} [ICON_TODO]
                        </div>
                    </div>
                    <Switch isOn={vendorIsEnabled} onChange={() => onToggleVendor(vendor.id, !vendorIsEnabled)} />
                </div>
                {vendor.isExpanded && this.renderVendorDetails(vendor)}
            </div>
        )});
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
