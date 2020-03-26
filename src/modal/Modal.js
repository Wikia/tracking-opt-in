import { h, Component } from 'preact';

import Preferences from './Preferences';
import ScreenOne from './ScreenOne';

import styles from './styles.scss';

class Modal extends Component {
    state = {
        consentedVendors: this.props.options.enabledVendors,
        consentedPurposes: this.props.options.enabledPurposes,
        isScreenOne: true,
        nonIabConsented: true,
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
        this.props.onAcceptTracking(this.props.options.enabledVendors, this.props.options.enabledPurposes);
    };

    setNonIabConsented = (isConsented) => {
        this.setState({nonIabConsented: isConsented});
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
        if (this.state.nonIabConsented === true) {
            this.props.optInManager.setTrackingAccepted();
            this.props.onAcceptTracking(this.state.consentedVendors, this.state.consentedPurposes);
        } else {
            this.props.optInManager.setTrackingRejected();
            this.props.onRejectTracking(this.state.consentedVendors, this.state.consentedPurposes);
        }
    };

    // This is called in sub components to update the state
    updatePurposes = (vendors, purposes) => {
        this.setState({consentedVendors: vendors, consentedPurposes: purposes});
    };

    render(props, state) {
        const { options, content, tracker } = props;
        const { isScreenOne, consentedPurposes, consentedVendors, nonIabConsented } = state;

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
                    appOptions={options}
                    clickBack={this.back}
                    clickSave={this.save}
                    consentedPurposes={consentedPurposes}
                    consentedVendors={consentedVendors}
                    content={content}
                    nonIabConsented={nonIabConsented}
                    setNonIabConsented={this.setNonIabConsented}
                    tracker={tracker}
                    updatePurposes={this.updatePurposes}
                />
            );
        }
    }
}

export default Modal;
