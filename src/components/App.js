import {h, Component} from 'preact';
import styles from './styles.scss';

const TRACKING_CATEGORY = 'gdpr-modal';
const ACTION_IMPRESSION = 'Impression';
const ACTION_CLICK = 'Click';

class App extends Component {
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

    reject = () => {
        this.track(ACTION_CLICK, 'reject-screen-1');
        this.props.optInManager.setTrackingRejected();
        this.props.onRequestAppRemove();
        this.props.onRejectTracking();
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
                    <div className={styles.logo}>
                        <svg id="wds-company-logo-fandom" viewBox="0 0 164 35" width="100%" height="100%">
                            <g fill="none" fill-rule="evenodd">
                                <path d="M32.003 16.524c0 .288-.115.564-.32.768L18.3 30.712c-.226.224-.454.324-.738.324-.292 0-.55-.11-.77-.325l-.943-.886a.41.41 0 0 1-.01-.59l15.45-15.46c.262-.263.716-.078.716.29v2.46zm-17.167 10.12l-.766.685a.642.642 0 0 1-.872-.02L3.01 17.362c-.257-.25-.4-.593-.4-.95v-1.858c0-.67.816-1.007 1.298-.536l10.814 10.56c.188.187.505.57.505 1.033 0 .296-.068.715-.39 1.035zM5.73 7.395L9.236 3.93a.421.421 0 0 1 .592 0l11.736 11.603a3.158 3.158 0 0 1 0 4.5l-3.503 3.462a.423.423 0 0 1-.59 0L5.732 11.89a3.132 3.132 0 0 1-.937-2.25c0-.85.332-1.65.935-2.246zm13.89 1.982l3.662-3.62a3.232 3.232 0 0 1 2.737-.897c.722.098 1.378.47 1.893.978l3.708 3.667a.41.41 0 0 1 0 .585l-5.64 5.576a.419.419 0 0 1-.59 0l-5.77-5.704a.411.411 0 0 1 0-.585zm14.56-.687L26.014.475a.869.869 0 0 0-1.228-.002L18.307 6.94c-.5.5-1.316.5-1.82.004l-6.48-6.4A.87.87 0 0 0 8.793.542L.447 8.67C.16 8.95 0 9.33 0 9.727v7.7c0 .392.158.77.44 1.048l16.263 16.072a.87.87 0 0 0 1.22 0l16.25-16.073c.28-.278.438-.655.438-1.048V9.73c0-.39-.153-.763-.43-1.04z" fill="#00D6D6"></path>
                                <path d="M62.852 20.51l2.58-6.716a.468.468 0 0 1 .87 0l2.58 6.717h-6.03zm5.856-12.428c-.184-.48-.65-.8-1.17-.8h-3.342c-.52 0-.986.32-1.17.8l-7.083 18.5c-.21.552.2 1.14.796 1.14h2.753c.353 0 .67-.215.796-.542l.738-1.922a.849.849 0 0 1 .795-.542h8.088a.85.85 0 0 1 .796.542l.74 1.922c.125.327.44.543.795.543h2.754a.843.843 0 0 0 .796-1.14l-7.082-18.5zm93.504-.8h-2.715a1.86 1.86 0 0 0-1.677 1.047l-5.393 11.162-5.393-11.163a1.858 1.858 0 0 0-1.677-1.047h-2.715a.889.889 0 0 0-.893.883V26.84c0 .487.4.883.892.883h2.608a.889.889 0 0 0 .893-.883v-9.686l4.945 10.072c.15.304.46.497.803.497h1.073a.893.893 0 0 0 .803-.497l4.945-10.072v9.686c0 .487.4.883.894.883h2.608a.889.889 0 0 0 .893-.883V8.166c0-.487-.4-.883-.893-.883zm-106.972 8.8h-8.63V11.49h10.918a.88.88 0 0 0 .83-.578l.888-2.464a.872.872 0 0 0-.83-1.163h-15.18c-.486 0-.88.39-.88.87v18.7c0 .48.394.87.88.87h2.492c.486 0 .88-.39.88-.87V20.29h7.743a.88.88 0 0 0 .83-.578l.89-2.464a.872.872 0 0 0-.83-1.163zm51.76 7.61h-3.615V11.315H107c3.828 0 6.41 2.517 6.41 6.188 0 3.672-2.582 6.19-6.41 6.19zm-.124-16.41h-7.128c-.486 0-.88.39-.88.872v18.698c0 .48.394.87.88.87h7.128c6.453 0 10.912-4.44 10.912-10.16v-.117c0-5.72-4.46-10.162-10.912-10.162zm-11.947.03h-2.642a.87.87 0 0 0-.876.866v12.36l-8.755-12.72a1.242 1.242 0 0 0-1.023-.535H78.32a.873.873 0 0 0-.876.867v18.706c0 .48.393.867.877.867h2.64a.872.872 0 0 0 .878-.867V14.71l8.608 12.478c.23.334.613.535 1.022.535h3.46a.872.872 0 0 0 .877-.867V8.178a.87.87 0 0 0-.876-.867zm40.71 10.3c0 3.323-2.712 6.016-6.056 6.016-3.345 0-6.056-2.693-6.056-6.015v-.22c0-3.322 2.71-6.015 6.056-6.015 3.344 0 6.055 2.693 6.055 6.015v.22zm-6.056-10.44c-5.694 0-10.31 4.576-10.31 10.22v.22c0 5.646 4.616 10.22 10.31 10.22 5.693 0 10.308-4.574 10.308-10.22v-.22c0-5.644-4.615-10.22-10.308-10.22z" fill="#002A32"></path>
                            </g>
                        </svg>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.usesCookiesText}> {content.headline} </div>
                        <div className={styles.bodyParagraphsContainer}>
                            {content.bodyParagraphs.map((paragraph) =>
                                <p>{paragraph}</p>
                            )}
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
                        <div
                            data-tracking-opt-in-reject="true"
                            className={styles.buttonSecondary}
                            onClick={this.reject}
                        >
                            {content.buttonReject}
                        </div>
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
