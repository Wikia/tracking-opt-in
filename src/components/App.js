import {h, Component} from 'preact';
import styles from './styles.scss';

const DIALOGS = {
    INITIAL: 'initial',
    CONFIRM_REJECT: 'confirm-reject',
};

class App extends Component {
    state = {
        dialog: DIALOGS.INITIAL,
    };

    onAccept = () => {
        this.props.optInManager.setTrackingAccepted();
        this.props.onRequestAppRemove();
        this.props.options.onAcceptTracking();
    };

    onReject = () => {
        this.props.optInManager.setTrackingRejected();
        this.props.onRequestAppRemove();
        this.props.options.onRejectTracking();
    };

    onInitialReject = () => {
        this.setState({ dialog: DIALOGS.CONFIRM_REJECT });
    };

    render({ options }, { dialog }) {
        let onReject;
        let bodyText;

        switch (dialog) {
            case DIALOGS.INITIAL:
                onReject = this.onInitialReject;
                bodyText = 'cookies?';
                break;
            default:
                onReject = this.onReject;
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
                        <button onClick={this.onAccept}>
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
