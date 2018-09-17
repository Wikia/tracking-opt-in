import {h, Component} from "preact";
import styles from './styles.scss';

class CookieSyncFrame extends Component {
    render() {
        return(
            <frame
                className={styles.hidden}
                src={this.props.src} />
        );
    }
}

export default CookieSyncFrame;
