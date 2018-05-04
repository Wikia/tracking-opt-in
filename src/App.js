import { h, Component } from 'preact';
import styles from './styles.scss';
import { setHideTrackingPrompt, setTrackingAccepted } from "./util";

class App extends Component {
    onAccept = () => {
        setTrackingAccepted();
        this.props.onRequestAppRemove();
        this.props.options.onOptInToTracking();
    };

    onReject = () => {
        setHideTrackingPrompt();
        this.props.onRequestAppRemove();
        this.props.options.onHideTrackingPrompt();
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
