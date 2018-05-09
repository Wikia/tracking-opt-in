const assert = require('assert');

const url = 'http://localhost:3000';
const acceptButton = '.tracking-opt-in-overlay';
const rejectButton = '.tracking-opt-in-reject';

describe("without any geo cookies", () => {
    it("prompts the user", () => {
        browser
            .url(url)
            .pause(1000);

        assert(browser.isExisting(acceptButton));
        assert(browser.isExisting(rejectButton));
    });

    it("adds the correct cookie when accepted on initial screen", () => {
        browser
            .url(url)
            .click(acceptButton);

        console.log(browser.getCookie('tracking-opt-in-status'));
        assert(false);
    });
});
