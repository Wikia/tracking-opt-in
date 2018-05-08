import { h, render } from 'preact';
import { expect } from 'chai';
import App from './App';
import styles from './styles.scss';
import ContentManager from "../ContentManager";
import Tracker from "../Tracker";

const document = global.document;

const findByClass = (wrapper, className) =>
    wrapper.getElementsByClassName(className).item(0) || new HTMLElement();

describe('App Rendering Tests', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = render(h(App, {
            options: {},
            content: new ContentManager('en'),
            tracker: new Tracker(),
        }), document.body);
    });

    it('renders the container', () => {
        expect(wrapper.className).to.equal(styles.overlay);
        expect(wrapper.childElementCount).to.equal(1);
    });

    it('renders the container', () => {
        const container = findByClass(wrapper, styles.container);
        expect(container).to.not.equal(null);
        expect(container.childElementCount).to.equal(2);
        expect(container.className).to.equal(styles.container);
    });

    it('renders the content', () => {
        const content = findByClass(wrapper, styles.content);
        expect(content).to.not.equal(null);
        expect(content.className).to.equal(styles.content);
        expect(content.innerHTML).to.equal('');
    });
});