import { h, Component } from 'preact';

import Preferences from './Preferences';
import Switch from './Switch';
import ScreenOne from './ScreenOne';

import styles from './styles.scss';

const TRACKING_CATEGORY = 'gdpr-modal';
const ACTION_IMPRESSION = 'Impression';
const ACTION_CLICK = 'Click';

class App extends Component {
    state = {
        consentedVendors: this.props.options.enabledVendors,
        consentedPurposes: this.props.options.enabledPurposes,
        isScreenOne: true,
    };

    componentDidMount() {
        this.track(ACTION_IMPRESSION, 'modal-view');
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
            this.track(ACTION_IMPRESSION, 'no-cookie');
        }
    }

    track(action, label) {
        this.props.tracker.track(TRACKING_CATEGORY, action, label);
    }

    accept = () => {
        this.track(ACTION_CLICK, 'accept-screen-1');
        this.props.optInManager.setTrackingAccepted();
        this.props.onRequestAppRemove();
        this.props.onAcceptTracking(this.state.consentedVendors, this.state.consentedPurposes);
    };

    learnMore = () => {
        this.track(ACTION_CLICK, 'learn-more');
        this.setState({ isScreenOne: false });
        this.forceUpdate();
    };

    goBack = () => {
        this.track(ACTION_CLICK, 'back');
        this.setState({ isScreenOne: true });
        this.forceUpdate;
    }

    save = () => {
        this.track(ACTION_CLICK, 'save');
        // save and continue logic goes here
        console.log('Save and Continue')
    };

    // this will need to be be called in a sub component to update the state
    updatePurposes = (vendorIds, purposeIds) => {
        this.setState({consentedVendors: vendorIds, consentedPurposes: purposeIds});
    };

    render({ options, content }) {
        if (this.state.isScreenOne) {
            return (
                <ScreenOne
                    appOptions={options}
                    content={content}
                    text={content.bodyParagraphs}
                    clickLearnMore={this.learnMore}
                    clickAccept={this.accept}
                />
            );
        } else {
            return (
                <Preferences
                    appOptions={options}
                    content={content}
                    allPurposes={options.enabledPurposes}
                    allVendors={options.enabledVendors}
                    consentedPurposes={this.state.consentedPurposes}
                    consentedVendors={this.state.consentedVendors}
                    updatePurposes={this.updatePurposes}
                    clickBack={this.goBack}
                    clickSave={this.save}
                />
            );
        }
    }
}

export default App;
