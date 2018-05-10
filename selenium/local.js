const assert = require('assert');

const url = 'http://localhost:3000';
const overlay = 'div[data-tracking-opt-in-overlay="true"]';
const acceptButton = 'div[data-tracking-opt-in-accept="true"]';
const rejectButton = 'div[data-tracking-opt-in-reject="true"]';
const trackingCookie = 'tracking-opt-in-status';
const cookieState = {
    accepted: 'accepted',
    rejected: 'rejected',
};

describe("without any relevant cookies", () => {
    afterEach(() => {
        // driver for MS Edge browser crashes on browser.deleteCookie()
        browser.setCookie({ name: trackingCookie, value: 'unknown' });
    });

    it("prompts the user", () => {
        browser.url(url);

        assert(browser.isExisting(overlay));
        assert(browser.isExisting(acceptButton));
        assert(browser.isExisting(rejectButton));
    });

    it("adds the correct cookie when accepted on initial modal", () => {
        browser
            .url(url)
            .click(acceptButton);

        const cookie = browser.getCookie(trackingCookie);
        assert.equal(cookie.value, cookieState.accepted);
        assert.equal(browser.isExisting(overlay), false);
    });

    it("adds the correct cookie when accepted on the secondary modal", () => {
        browser
            .url(url)
            .click(rejectButton)
            .pause(500);

        assert(browser.isExisting(acceptButton));

        browser.click(acceptButton);

        const cookie = browser.getCookie(trackingCookie);
        assert.equal(cookie.value, cookieState.accepted);
        assert.equal(browser.isExisting(overlay), false);
    });

    it("adds the correct cookie when rejected", () => {
        browser
            .url(url)
            .click(rejectButton)
            .pause(500);

        browser.click(rejectButton);

        const cookie = browser.getCookie(trackingCookie);
        assert.equal(cookie.value, cookieState.rejected);
        assert.equal(browser.isExisting(overlay), false);
    });
});
