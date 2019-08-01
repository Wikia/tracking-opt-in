import { h, Component } from 'preact';
import Switch from './Switch';

import styles from './PreferencesSection.scss';

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
        const toRender = vendors.map((vendor) => (
            <div>{vendor.name}</div>
        ));
        return toRender;
    }

    render(props, state) {
		const {
            heading,
            description,
            vendors,
            onTogglePurpose,
            onToggleVendor,
            isEnabled,
        } = props;
        const { isExpanded } = state;

		return (
            <div className={styles.section}>
                <div className={styles.flex}>
                    <div>
                        <div className={styles.heading}>{heading}</div>
                        <div className={styles.preferencesSectionExpand} onClick={() => this.toggleIsExpanded()}>
                            {isExpanded ? 'Hide Preferences' : 'Show Preferences'} [ICON_HERE]
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
