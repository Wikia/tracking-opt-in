import { h, Component } from 'preact';

import Preferences from './Preferences';
import ScreenOne from './ScreenOne';

import styles from './styles.scss';

class App extends Component {
    state = {
        consentedVendors: this.props.options.enabledVendors,
        consentedPurposes: this.props.options.enabledPurposes,
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
        this.props.tracker.trackAcceptClick();
        this.props.optInManager.setTrackingAccepted();
        this.props.onRequestAppRemove();
        this.props.onAcceptTracking(this.state.consentedVendors, this.state.consentedPurposes);
    };

    rejectNonIab = () => {
        this.props.optInManager.setTrackingRejected();
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
    }

    save = () => {
        this.props.tracker.trackSaveClick();
        this.props.optInManager.setTrackingAccepted();
        this.props.onRequestAppRemove();
        this.props.onAcceptTracking(this.state.consentedVendors, this.state.consentedPurposes);
    };

    // this will need to be be called in a sub component to update the state
    updatePurposes = (vendorIds, purposeIds) => {
        this.setState({consentedVendors: vendorIds, consentedPurposes: purposeIds});
    };

    render({ options, content, tracker }) {
        if (this.state.isScreenOne) {
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
                    consentedPurposes={this.state.consentedPurposes}
                    consentedVendors={this.state.consentedVendors}
                    content={content}
                    onRejectNonIab={this.rejectNonIab}
                    tracker={tracker}
                    updatePurposes={this.updatePurposes}
                />
            );
        }
    }
}

export default App;
