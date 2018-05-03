import { h, Component } from 'preact';
import styles from './styles.scss';

class App extends Component {
    render() {
        return <div className={styles.main}><span className={styles.message}>HI</span></div>;
    }
}

export default App;
