import { h, Component } from 'preact';
import { NON_IAB_VENDORS } from '../consts';
import PreferencesVendorList from './PreferencesVendorList';
import Switch from './Switch';

import globalStyles from './styles.scss';
// This is another (although unique) preferences section, so it uses the same styles
import sectionStyles from './PreferencesSection.scss';
import vendorListStyles from './PreferencesVendorList.scss';

class OtherPartners extends Component {
    state = {
        isExpanded: false,
    };

    toggleIsExpanded() {
        const { tracker } = this.props;
        const { isExpanded } = this.state;
        this.setState({ isExpanded: !isExpanded });
        this.forceUpdate();
        tracker.trackOtherPartnersExpandClick();
    }

    toggleSwitch(isOn) {
        // Enables/disables all other vendors
        const { onToggle, tracker } = this.props;
        onToggle(isOn);
        tracker.trackOtherPartnersToggleClick();
    }

    renderVendors() {
        const { content } = this.props;

        const toRender = NON_IAB_VENDORS.map((vendor) => {
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

        return toRender;
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
                        <div className={sectionStyles.heading}>{content.otherPartnersHeading}</div>
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
                            <div className={vendorListStyles.header}>{content.vendorsHeader}</div>
                            {this.renderVendors()}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default OtherPartners;
