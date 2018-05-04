import { h, Component } from 'preact';
import styles from './styles.scss';

class App extends Component {
    render(props) {
        return (
            <div
                className={styles.overlay}
                style={{
                    zIndex: props.options.zIndex,
                }}
            >
                <div className={styles.container}>
                    <div className={styles.content}>
                        cookies?
                    </div>
                    <div className={styles.footer}>
                        actions
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
