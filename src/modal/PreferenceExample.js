import { h, Component } from 'preact';
import styles from './PreferenceExample.scss';

class PreferenceExample extends Component {
    render(props, state) {
        const {
            description,
            content
        } = props;

        return (<div className={styles.container}>
            <div className={styles.header}>{content.example}</div>
            <div className={styles.example}>{description}</div>
        </div>)
    }
}

export default PreferenceExample;
