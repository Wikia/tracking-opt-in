import {h, Component} from 'preact';
import styles from './styles.scss';

const DEFAULT_OPTIONS = { zIndex: 99 };

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

    render(props) {
        const options = props || DEFAULT_OPTIONS;
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
