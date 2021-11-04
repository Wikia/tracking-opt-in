import { h, Component } from 'preact';
import { INTERNAL_USE } from '../shared/consts';
import Switch from './Switch';
import VendorDetails from './VendorDetails';
import Consented from './utils/isConsented';

import globalStyles from './styles.scss';
// This is another (although unique) preferences section, so it uses the same styles
import styles from './PreferencesVendorList.scss';
import sectionStyles from './PreferencesSection.scss';
import vendorListStyles from './PreferencesVendorList.scss';

class InternalUse extends Component {
    state = {
        isExpanded: false,
    };

    toggleIsInternalUseExpanded() {
        const { tracker } = this.props;
        const { isExpanded } = this.state;
        this.setState({ isExpanded: !isExpanded });
        this.forceUpdate();
        tracker.trackInternalUseExpandClick();
    }

    toggleIsVendorExpanded(vendorId) {
        const { tracker, vendors } = this.props;
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
        const internalVendors = vendors.filter(vendor => INTERNAL_USE[vendor.id]);

        if (!internalVendors) {
            return null;
        }

        return internalVendors.map((vendor) => {
            const vendorIsEnabled = Consented.isConsentedVendor(vendor.id, this.props);

            return (
                <div className={styles.vendor} key={vendor.name}>
                    <div className={styles.flex}>
                        <div>
                            <div className={styles.vendorName}>{content.internalUseProject1 || INTERNAL_USE[vendor.id].name || vendor.name}</div>
                            <div className={styles.vendorExpand} onClick={() => this.toggleIsVendorExpanded(vendor.id)}>
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

    render(props, state) {
		const {
            content,
        } = props;
        const { isExpanded } = state;

        return (
            <div className={sectionStyles.section}>
                <div className={sectionStyles.flex}>
                    <div>
                        <div className={`${sectionStyles.sectionExpand} ${sectionStyles.sectionExpandNoHeading}`} onClick={() => this.toggleIsInternalUseExpanded()}>
                            {isExpanded ? content.hidePurposeDetailsButton : content.showPurposeDetailsButton}
                            <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" className={`${globalStyles.chevron} ${isExpanded ? globalStyles.chevronExpanded : ''}`}>
                                <path d="M11.707 3.293a.999.999 0 0 0-1.414 0L6 7.586 1.707 3.293A.999.999 0 1 0 .293 4.707l5 5a.997.997 0 0 0 1.414 0l5-5a.999.999 0 0 0 0-1.414" fill-rule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                </div>
                {isExpanded && (
                    <div>
                        <div className={vendorListStyles.vendorList}>
                            <div className={vendorListStyles.header}>{content.projectsHeader}</div>
                            {this.renderVendors()}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default InternalUse;
