import {h, Component} from 'preact';
import styles from './styles.scss';

const DIALOGS = {
    INITIAL: 'initial',
    CONFIRM_REJECT: 'confirm-reject',
};

const TRACKING_CATEGORY = 'gdpr-modal';
const ACTION_IMPRESSION = 'Impression';
const ACTION_CLICK = 'Click';

class App extends Component {
    state = {
        dialog: DIALOGS.INITIAL,
    };

    componentDidMount() {
        this.track(ACTION_IMPRESSION, 'modal-view');
    }

    track(action, label) {
        this.props.tracker.track(TRACKING_CATEGORY, action, label);
    }

    accept() {
        this.props.optInManager.setTrackingAccepted();
        this.props.onRequestAppRemove();
        this.props.options.onAcceptTracking();
    }

    reject() {
        this.props.optInManager.setTrackingRejected();
        this.props.onRequestAppRemove();
        this.props.options.onRejectTracking();
    }

    onInitialAccept = () => {
        this.track(ACTION_CLICK, 'accept-screen-1');
        this.accept();
    };

    onFallbackAccept = () => {
        this.track(ACTION_CLICK, 'accept-screen-2');
        this.accept();
    };

    onInitialReject = () => {
        this.track(ACTION_CLICK, 'reject-screen-1');
        this.setState({ dialog: DIALOGS.CONFIRM_REJECT });
    };

    onFallbackReject = () => {
        this.track(ACTION_CLICK, 'reject-screen-2');
        this.reject();
    };

    render({ options }, { dialog }) {
        let onAccept;
        let onReject;
        let bodyText;

        switch (dialog) {
            case DIALOGS.INITIAL:
                onAccept = this.onInitialAccept;
                onReject = this.onInitialReject;
                bodyText = 'cookies?';
                break;
            default:
                onAccept = this.onFallbackAccept;
                onReject = this.onFallbackReject;
                bodyText = 'Are you sure???';
                break;
        }

        return (
            <div
                className={styles.overlay}
                style={{
                    zIndex: options.zIndex,
                }}
            >
                <div className={styles.container}>
                    <div className={styles.content}>
                        {bodyText}
                    </div>
                    <div className={styles.footer}>
                        <button onClick={onAccept}>
                            accept all cookies
                        </button>
                        <button onClick={onReject}>
                            reject all cookies
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
