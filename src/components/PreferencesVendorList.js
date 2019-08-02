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

    isConsentedVendor(vendorId) {
        return this.props.consentedVendors.indexOf(vendorId) >= 0;
    }

    getPurposeById(purposeId) {
        return this.props.allPurposes.find(purpose => purpose.id === purposeId);
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
        return (
            <div className={styles.vendorDetails}>
                {vendor.purposeIds.length > 0 && (
                    <div>
                        <div className={styles.subheader}>
                            Purposes
                        </div>
                        {vendor.purposeIds.map((purposeId) => (
                            <div className={styles.vendorDetail}>
                                <span>{this.getPurposeById(purposeId).name}</span>
                                <span classname={styles.TODO}>Allowed</span>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.legIntPurposeIds.length > 0 && (
                    <div>
                        <div className={styles.subheader}>
                            Purposes of legitimate interest
                        </div>
                        {vendor.legIntPurposeIds.map((purposeId) => (
                            <div className={styles.vendorDetail}>
                                <span>{this.getPurposeById(purposeId).name}</span>
                                <a href="#TODO">Find out more</a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    renderVendors() {
        const { vendors, allPurposes, consentedVendors, onToggleVendor } = this.props;

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
                            {vendor.isExpanded ? 'Hide Details' : 'Show Details'} [ICON_HERE]
                        </div>
                    </div>
                    <Switch isOn={vendorIsEnabled} onChange={() => onToggleVendor(vendor.id, !vendorIsEnabled)} />
                </div>
                {vendor.isExpanded && this.renderVendorDetails(vendor)}
            </div>
        )});
        return toRender;
    }

    render(props, state) {
		return (
            <div className={styles.vendorList}>
                <div className={styles.header}>Our Partners</div>
                {this.renderVendors()}
            </div>
        );
    }
}

export default PreferencesVendorList;
