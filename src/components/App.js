import { h, Component } from 'preact';
import styles from './styles.scss';

const TRACKING_CATEGORY = 'gdpr-modal';
const ACTION_IMPRESSION = 'Impression';
const ACTION_CLICK = 'Click';

class App extends Component {
    constructor() {
      super();

      this.state = { isScreenOne: true };
      this.learnMore = this.learnMore.bind(this);
    }

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
        this.props.onAcceptTracking();
    };

    learnMore = () => {
        this.track(ACTION_CLICK, 'learn-more-screen-1');
        // add show screen 2 logic here
        this.setState({ isScreenOne: false });
        // TODO: Figure out how to re-render component on this.setState w/out forceUpdate
        this.forceUpdate();
    }

    reject = () => {
        this.track(ACTION_CLICK, 'reject-screen-1');
        this.props.optInManager.setTrackingRejected();
        this.props.onRequestAppRemove();
        this.props.onRejectTracking();
    };


    render({ options, content }, { dialog }) {
        let bodyParagraphText = this.state.isScreenOne ? content.bodyParagraphScreenOne : content.bodyPargraphScreenTwo;

        return (
            <div
                data-tracking-opt-in-overlay="true"
                className={styles.overlay}
                style={{
                    zIndex: options.zIndex,
                }}
            >
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.usesCookiesText}> {content.headline} </div>
                        <div className={styles.bodyParagraphsContainer}>
                          {bodyParagraphText}
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <div
                            data-tracking-opt-in-accept="true"
                            className={styles.buttonPrimary}
                            onClick={this.accept}
                        >
                            {content.buttonAccept}
                        </div>
                        {this.state.isScreenOne ?
                          <div
                              data-tracking-opt-in-learn-more="true"
                              className={styles.buttonSecondary}
                              onClick={this.learnMore}
                          >
                              {content.buttonLearnMore}
                          </div> :
                          <div
                              data-tracking-opt-in-reject="true"
                              className={styles.buttonPrimary}
                              onClick={this.reject}
                          >
                              {content.buttonReject}
                          </div>
                        }
                    </div>
                    <div className={styles.links}>
                        <a href={content.privacyLink}>{content.privacyLinkText}</a>
                        <a href={content.partnerLink}>{content.partnerLinkText}</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
