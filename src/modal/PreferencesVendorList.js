import { h, Component } from 'preact';
import Switch from './Switch';
import Consented from './utils/isConsented';
import VendorDetails from './VendorDetails';

import globalStyles from './styles.scss';
import styles from './PreferencesVendorList.scss';

class PreferencesVendorList extends Component {
    state = {
        vendors: this.props.vendors
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((vendor) => {
                vendor.isExpanded = false;
                return vendor;
            }),
    };

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

    renderVendors() {
        const { content, vendors, onToggleVendor } = this.props;

        if (!vendors) {
            return null;
        }

        return vendors.map((vendor) => {
            const vendorIsEnabled = Consented.isConsentedVendor(vendor.id, this.props);

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
                    {vendor.isExpanded && VendorDetails.renderVendor(vendor, this.props)}
                </div>
            );
        });
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
