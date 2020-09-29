import { h, render } from 'preact';
import { expect, assert } from 'chai';
import { stub } from 'sinon';

import Tracker from '../gdpr/Tracker';
import * as i18nContent from '../i18n/tracking-opt-in.json';
import Preferences from './Preferences';
import globalStyles from './styles.scss';

const document = global.document;
const mockData = {
    allPurposes: [1, 2, 3],
    allVendors: [66, 77, 88, 99],
    allSpecialFeatures: [1, 2],
    consentedPurposes: [1, 2],
    consentedVendors: [77, 99],
    consentedSpecialFeatures: [1],
};

function findByQuery(wrapper, query) {
    return wrapper.querySelector(query) || document.createElement('div');
}

function updatePurposes(consentedVendors, consentedPurposes) {
    mockData.consentedPurposes = consentedPurposes;
    mockData.consentedVendors = consentedVendors;
}

function updateSpecialFeatures(consentedVendors, consentedSpecialFeatures) {
    mockData.consentedSpecialFeatures = consentedSpecialFeatures;
    mockData.consentedVendors = consentedVendors;
}

function noop() { }

describe('Preferences', () => {
    const tracker = new Tracker('en', 'geo', 'beacon', true);
    stub(Tracker.prototype, 'track').callsFake((...a) => console.debug('Track', a));

    function renderComponent(callbacks = {}) {
        return render(h(Preferences, {
            allPurposes: mockData.allPurposes,
            allVendors: mockData.allVendors,
            allSpecialFeatures: mockData.allSpecialFeatures,
            appOptions: {
                zIndex: 2,
            },
            clickBack: callbacks.clickBack || noop,
            clickSave: callbacks.clickSave || noop,
            consentedPurposes: mockData.consentedPurposes,
            consentedVendors: mockData.consentedVendors,
            consentedSpecialFeatures: mockData.consentedSpecialFeatures,
            content: i18nContent,
            updatePurposes,
            updateSpecialFeatures,
        }), document.body);
    }

    function removeComponent() {
        render(null, document.body, document.body.lastChild);
    }

    afterEach(() => {
        removeComponent();
    });

    it('renders as a stand-alone overlay', () => {
        const wrapper = renderComponent();
        expect(wrapper.className).to.equal(globalStyles.overlay);
    });

    it('calls callback props when Back and Save buttons are clicked', () => {
        const clickBack = stub();
        const clickSave = stub();
        const wrapper = renderComponent({ clickBack, clickSave });

        const backButton = findByQuery(wrapper, '[data-tracking-opt-in-back="true"]');
        expect(backButton).to.not.equal(null);
        backButton.click();
        assert.isOk(clickBack.called);

        const saveButton = findByQuery(wrapper, '[data-tracking-opt-in-save="true"]');
        expect(saveButton).to.not.equal(null);
        saveButton.click();
        assert.isOk(clickSave.called);
    });
});
