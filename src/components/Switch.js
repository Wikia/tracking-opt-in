import { h, Component } from 'preact';

import styles from './Switch.scss';

class Switch extends Component {
    onChange = (e) => {
        e.preventDefault();

        this.props.onChange(e.target.checked);
    }

    render({ isOn }) {
        const id =  `switch_${Math.floor(Math.random() * 10000)}`;

        return (
            <div className={styles.switch} onChange={this.onChange}>
                <input id={id} checked={isOn} type="checkbox" />
                <label htmlFor={id} >
                    <span />
                </label>
            </div>
        );
    }
}

export default Switch;
