import { Component } from 'preact';

import styles from './PreferencesSection.scss';
import Switch from './Switch';

class PreferencesSection extends Component {
    state = {
        isExpanded: false,
    };

    toggleIsExpanded() {
        const { isExpanded } = this.state;
        this.setState({ isExpanded: !isExpanded });
        this.forceUpdate();
    }

    renderVendors() {
        const { vendors } = this.props;
        if (!vendors) {
            return null;
        }
        return vendors.map((vendor) => (
            <div>{vendor.name}</div>
        ));
    }

    render(props, state) {
        const {
            heading,
            description,
            vendors,
            onTogglePurpose,
            onToggleVendor,
            isEnabled,
            content,
        } = props;
        const { isExpanded } = state;

        return (
            <div className={styles.section}>
                <div className={styles.flex}>
                    <div>
                        <div className={styles.heading}>{heading}</div>
                        <div className={styles.preferencesSectionExpand} onClick={() => this.toggleIsExpanded()}>
                            {isExpanded ? content.hidePurposeDetailsButton : content.showPurposeDetailsButton} [ICON_HERE]
                        </div>
                    </div>
                    <Switch isOn={isEnabled} onChange={onTogglePurpose} />
                </div>
                {isExpanded && <div className={styles.description}>{description}</div>}
                {isExpanded && <div className={styles.vendorList}>{this.renderVendors()}</div>}
            </div>
        );
    }
}

PreferencesSection.defaultProps = {
    isEnabled: true,
};

export default PreferencesSection;
