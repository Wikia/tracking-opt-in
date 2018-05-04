import {h, Component} from 'preact';
import styles from './styles.scss';

class App extends Component {
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

    render({ options }) {
        return (
            <div
                className={styles.overlay}
                style={{
                    zIndex: options.zIndex,
                }}
            >
                <div className={styles.container}>
                    <div className={styles.content}>
                        cookies?
                    </div>
                    <div className={styles.footer}>
                        <button onClick={this.onAccept}>
                            Yes
                        </button>
                        <button onClick={this.onReject}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
