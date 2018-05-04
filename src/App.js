import { h, Component } from 'preact';
import styles from './styles.scss';

class App extends Component {
    render() {
        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>HI</div>
            </div>
        );
    }
}

export default App;
