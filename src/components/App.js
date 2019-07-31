import { h, Component } from 'preact';
import styles from './styles.scss';

import Switch from './Switch';
import ScreenOne from './ScreenOne';

const TRACKING_CATEGORY = 'gdpr-modal';
const ACTION_IMPRESSION = 'Impression';
const ACTION_CLICK = 'Click';

class App extends Component {
    state = {
        enabledVendors: [],
        enabledPurposes: [],
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
        this.props.onAcceptTracking(this.state.enabledVendors, this.state.enabledPurposes);
    };

    learnMore = () => {
        this.track(ACTION_CLICK, 'learn-more');
        this.setState({ isScreenOne: false });
        this.forceUpdate();
    };

    back = () => {
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
        this.setState({enabledVendors: vendorIds, enabledPurposes: purposeIds});
    };

    render({ options, content }, { dialog }) {
        return (
            <div
                data-tracking-opt-in-overlay="true"
                className={styles.overlay}
                style={{
                    zIndex: options.zIndex,
                }}
            >
                <div className={styles.container}>
                    {this.state.isScreenOne && <ScreenOne content={content} text={content.bodyParagraphs} />}
                    <div className={styles.footer}>
                        <div className={styles.buttons}>
                            {this.state.isScreenOne ?
                              <div
                                  data-tracking-opt-in-learn-more="true"
                                  className={styles.learnMoreButton}
                                  onClick={this.learnMore}
                                  key="learn"
                              >
                                  {content.buttonLearnMore}
                              </div> :
                              <div
                                  data-tracking-opt-in-back="true"
                                  className={styles.backButton}
                                  onClick={this.back}
                                  key="back"
                              >
                                  {content.buttonBack}
                              </div>
                            }
                            {this.state.isScreenOne ?
                                <div
                                    data-tracking-opt-in-accept="true"
                                    className={styles.acceptButton}
                                    onClick={this.accept}
                                    key="accept"
                                >
                                    {content.buttonAccept}
                                </div> :
                                <div
                                    data-tracking-opt-in-save="true"
                                    className={styles.saveButton}
                                    onClick={this.save}
                                    key="save"
                                >
                                    {content.buttonSave}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
