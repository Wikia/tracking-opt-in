import { h, Component } from 'preact';
import { AC_PROVIDERS } from '../shared/consts';
import Switch from './Switch';

import globalStyles from './styles.scss';
// This is another (although unique) preferences section, so it uses the same styles
import sectionStyles from './PreferencesSection.scss';
import vendorListStyles from './PreferencesVendorList.scss';
import styles from './PreferencesVendorList.scss';
import Consented from './utils/isConsented';

class AdditionalConsent extends Component {
    state = {
        isExpanded: false,
    };

    toggleIsAdditionalConsentExpanded() {
        const { tracker } = this.props;
        const { isExpanded } = this.state;
        this.setState({ isExpanded: !isExpanded });
        this.forceUpdate();
        tracker.trackAdditionalConsentExpandClick();
    }

    toggleProvider(providerId, isEnabled) {
        const { tracker, consentedProviders, updateProviders } = this.props;
        let newConsentedProviders;

        if (isEnabled) {
            newConsentedProviders = [...consentedProviders, providerId];
        } else {
            newConsentedProviders = consentedProviders.filter(id => (providerId !== id));
        }

        updateProviders(newConsentedProviders);

        tracker.trackAdditionalConsentProviderToggleClick(providerId);
    }

    renderProviders() {
        const { content } = this.props;

        return AC_PROVIDERS.map((provider) => {
            const providerIsEnabled = Consented.isConsentedProvider(provider.id, this.props);

            return (
                <div className={styles.vendor} key={provider.name}>
                    <div className={styles.flex}>
                        <div>
                            <div className={styles.vendorName}>{provider.name}</div>
                            <div className={vendorListStyles.topSpacer}>
                                <a href={provider.policyUrl} className={vendorListStyles.link} target="_blank">
                                    {content.privacyPolicyLinkButton}
                                </a>
                            </div>
                        </div>
                        <Switch isOn={providerIsEnabled} onChange={() => this.toggleProvider(provider.id, !providerIsEnabled)} />
                    </div>
                </div>
            );
        });
    }

    render(props, state) {
        const { content } = props;
        const { isExpanded } = state;

        return (
            <div className={sectionStyles.section}>
                <div className={sectionStyles.flex}>
                    <div>
                        <div className={`${sectionStyles.sectionExpand} ${sectionStyles.sectionExpandNoHeading}`} onClick={() => this.toggleIsAdditionalConsentExpanded()}>
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
                            <div className={vendorListStyles.header}>{content.vendorsHeader}</div>
                            {this.renderProviders()}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default AdditionalConsent;
