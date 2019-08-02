import { h, Component } from 'preact';
import { getVendorList } from '../utils';
import PreferencesSection from './PreferencesSection';

import globalStyles from './styles.scss';
import styles from './Preferences.scss';

function getParagraphs(blockOfText, content) {
    const replaceKeysInText = text => text.replace(/%([a-zA-Z]+)%/g, (match, key) => {
        if (content[key]) {
            return content[key];
        }
        if (key === 'privacyPolicy') {
            return `<a href=${content.privacyPolicyUrl} class=${globalStyles.link}>${content.privacyPolicyButton}</a>`;
        }
        if (key === 'partnerList') {
            return `<a href=${content.partnerListUrl} class=${globalStyles.link}>${content.partnerListButton}</a>`;
        }
        return match;
    });

    return blockOfText.map(line => <p dangerouslySetInnerHTML={{ __html: replaceKeysInText(line) }} />);
}

class Preferences extends Component {
    state = {
        purposes: null,
    };

    componentWillMount() {
        if (!this.state.purposes) {
            getVendorList().then((json) => {
                // Filter purposes to those used by Fandom
                const purposes = json.purposes.filter(purpose => (this.props.allPurposes.indexOf(purpose.id) >= 0));
                // Filter vendors to those used by Fandom
                const vendors = json.vendors.filter(vendor => (this.props.allVendors.indexOf(vendor.id) >= 0));
                const purposesWithVendors = purposes.map((purpose) => {
                    purpose.vendors = vendors.filter(vendor => (vendor.purposeIds.indexOf(purpose.id) >= 0));
                    return purpose;
                });
                this.setState({ purposes: purposesWithVendors });
                this.forceUpdate();
            });
        }
    }

    togglePurpose(isEnabled) {
        const { consentedPurposes, consentedVendors } = this.props;
        // TODO this.props.updatePurposes()
    }

    toggleVendor(purpose, isEnabled) {
        const { consentedPurposes, consentedVendors } = this.props;
        // TODO this.props.updatePurposes()
    }

    renderPreferenceSections(purposes) {
        if (!purposes) {
            return null;
        }
        const toRender = purposes.map((purpose) => (
            <PreferencesSection
                heading={purpose.name}
                description={purpose.description}
                vendors={purpose.vendors}
                content={this.props.content}
                onTogglePurpose={this.togglePurpose}
                onToggleVendor={this.toggleVendor}
                isEnabled={this.props.consentedPurposes.indexOf(purpose.id) >= 0}
            />
        ));
        return toRender;
    }

    render(props, state) {
        const { appOptions, content, clickBack, clickSave } = props;
        const { purposes } = state;

        return (
            <div
                className={globalStyles.overlay}
                style={{
                    zIndex: appOptions.zIndex,
                }}
            >
                <div className={`${globalStyles.dialog} ${styles.dialog}`}>
                    <div className={styles.content}>
                        <h2 className={`${styles.heading} ${styles.preferencesHeading}`}>{content.preferencesHeadline}</h2>
                        <div className={styles.preferencesDescription}>
                            {getParagraphs(content.preferencesBody, content)}
                        </div>
                        <h2 className={`${styles.heading} ${styles.preferencesSubheading}`}>{content.purposesHeader}</h2>
                        {this.renderPreferenceSections(purposes)}
                    </div>
                    <div className={globalStyles.footer}>
                        <div className={globalStyles.buttons}>
                            <div
                                data-tracking-opt-in-back="true"
                                className={globalStyles.backButton}
                                onClick={clickBack}
                                key="back"
                            >
                                {content.backButton}
                            </div>
                            <div
                                data-tracking-opt-in-save="true"
                                className={globalStyles.saveButton}
                                onClick={clickSave}
                                key="save"
                            >
                                {content.saveButton}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Preferences;
