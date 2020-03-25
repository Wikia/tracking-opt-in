import { h, render } from 'preact';
import { expect, assert } from 'chai';
import { stub } from 'sinon';
import Switch from './Switch';
import styles from './Switch.scss';

const document = global.document;

function findByTag(wrapper, tagName) {
    return wrapper.getElementsByTagName(tagName).item(0) || document.createElement('div');
}

function noop() { }

describe('Switch', () => {
    function renderSwitch(callbacks = {}) {
        return render(h(Switch, {
            isOn: false,
            onChange: callbacks.onChange || noop,
        }), document.body);
    }

    function removeSwitch() {
        render(null, document.body, document.body.lastChild);
    }

    afterEach(() => {
        removeSwitch();
    });

    it('renders the component', () => {
        const wrapper = renderSwitch();
        expect(wrapper.className).to.equal(styles.switch);
    });

    it('calls onChange when checkbox is clicked', () => {
        const onChange = stub();

        const wrapper = renderSwitch({ onChange });
        const checkbox = findByTag(wrapper, 'input');
        expect(checkbox).to.not.equal(null);
        checkbox.click();

        assert.isOk(onChange.called);
    });
});
