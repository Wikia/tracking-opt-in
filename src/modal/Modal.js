import { h, Component } from 'preact';

import Preferences from './Preferences';
import ScreenOne from './ScreenOne';

import styles from './styles.scss';

class Modal extends Component {
    state = {
        consentedVendors: this.props.options.enabledVendors,
        consentedProviders: this.props.options.enabledProviders,
        consentedPurposes: this.props.options.enabledPurposes,
        consentedSpecialFeatures: this.props.options.enabledSpecialFeatures,
        isScreenOne: true,
    };

    componentDidMount() {
        this.props.tracker.trackViewImpression();
        this.preventScroll();
        this.checkForCookie();
    }

    componentWillUnmount() {
        this.enableScroll();
    }

    preventScroll() {
        const scrollContainer = this.getScrollContainer();
        if (scrollContainer) {
            scrollContainer.classList.add(styles.withTrackingOptInDialogShown);
        }
    }

    enableScroll() {
        const scrollContainer = this.getScrollContainer();
        if (scrollContainer) {
            scrollContainer.classList.remove(styles.withTrackingOptInDialogShown);
        }
    }

    getScrollContainer() {
        if (!this.props.options.preventScrollOn) {
            return null;
        }

        return typeof this.props.options.preventScrollOn === 'string' ?
            document.querySelector(this.props.options.preventScrollOn) :
            this.props.options.preventScrollOn;
    }

    checkForCookie() {
        if(!this.props.geoManager.hasGeoCookie()) {
            this.props.tracker.trackNoCookieImpression();
        }
    }

    accept = () => {
        // This method accepts all tracking, regardless of preferences set by the user
        this.props.tracker.trackAcceptClick();
        this.props.optInManager.setTrackingAccepted();
        this.props.onRequestAppRemove();
        // Pass in all originally enabled vendors and purposes
        this.props.onAcceptTracking(
            this.props.options.enabledVendors,
            this.props.options.enabledPurposes,
            this.props.options.enabledSpecialFeatures,
            this.props.options.enabledProviders
        );
    };

    learnMore = () => {
        this.props.tracker.trackLearnMoreClick();
        this.setState({ isScreenOne: false });
        this.forceUpdate();
    };

    back = () => {
        this.props.tracker.trackBackClick();
        this.setState({ isScreenOne: true });
        this.forceUpdate();
    };

    save = () => {
        // Unlike the "Accept" button, this method saves the preferences set for each vendor
        this.props.tracker.trackSaveClick();
        this.props.onRequestAppRemove();

        // Pass in only those vendors and purposes the user left enabled in the preferences
        // ToDo: make GVL change resistant
        debugger
        if (this.state.consentedPurposes.length >= 10) {
            this.props.optInManager.setTrackingAccepted();
            this.props.onAcceptTracking(
                this.state.consentedVendors,
                this.state.consentedPurposes,
                this.state.consentedSpecialFeatures,
                this.state.consentedProviders
            );
        } else {
            this.props.optInManager.setTrackingRejected();
            this.props.onRejectTracking(
                this.state.consentedVendors,
                this.state.consentedPurposes,
                this.state.consentedSpecialFeatures,
                this.state.consentedProviders
            );
        }
    };

    // This is called in sub components to update the state
    updatePurposes = (vendors, purposes) => {
        this.setState({consentedVendors: vendors, consentedPurposes: purposes});
    };

    updateSpecialFeatures = (vendors, specialFeatures) => {
        this.setState({consentedVendors: vendors, consentedSpecialFeatures: specialFeatures});
    };

    updateProviders = (providers) => {
        this.setState({consentedProviders: providers});
    };

    render(props, state) {
        const { options, content, language, tracker } = props;
        const { isScreenOne, consentedPurposes, consentedVendors, consentedProviders, consentedSpecialFeatures } = state;

        if (isScreenOne) {
            return (
                <ScreenOne
                    appOptions={options}
                    content={content}
                    clickLearnMore={this.learnMore}
                    clickAccept={this.accept}
                />
            );
        } else {
            return (
                <Preferences
                    allPurposes={options.enabledPurposes}
                    allVendors={options.enabledVendors}
                    allProviders={options.enabledProviders}
                    appOptions={options}
                    clickBack={this.back}
                    clickSave={this.save}
                    consentedVendors={consentedVendors}
                    consentedProviders={consentedProviders}
                    consentedPurposes={consentedPurposes}
                    consentedSpecialFeatures={consentedSpecialFeatures}
                    content={content}
                    language={language}
                    tracker={tracker}
                    updateProviders={this.updateProviders}
                    updatePurposes={this.updatePurposes}
                    updateSpecialFeatures={this.updateSpecialFeatures}
                />
            );
        }
    }
}

export default Modal;
