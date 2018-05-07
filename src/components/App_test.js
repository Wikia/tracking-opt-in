import { h } from 'preact';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { Adapter } from 'enzyme-adapter-preact';
import { mount } from 'enzyme';
import App from './App';
import styles from './styles.scss';

Enzyme.configure({ adapter: new Adapter() });

describe('App Rendering Tests', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(<App />);
    });

    it('renders an overlay', () => {
        const overlay = wrapper.find(`.${styles.overlay}`);
        expect(overlay).to.have.length(1);
    });
});