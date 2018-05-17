const assert = require('assert');

function getCookieDomain(hostname) {
    const parts = hostname.split('.');
    if (parts.length < 2) {
        return undefined;
    }

    return `.${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}

const url = process.env.TEST_URL || 'http://localhost:3000';
const countryRequiringConsent = process.env.COUNTRY_REQUIRING_CONSENT || 'PL';
const countryNotRequiringConsent = process.env.COUNTRY_NOT_REQUIRING_CONSENT || 'CA';
const domain = getCookieDomain(url);
const overlay = 'div[data-tracking-opt-in-overlay="true"]';
const acceptButton = 'div[data-tracking-opt-in-accept="true"]';
const rejectButton = 'div[data-tracking-opt-in-reject="true"]';
const trackingCookie = 'tracking-opt-in-status';
const cookieState = {
    accepted: 'accepted',
    rejected: 'rejected',
};

function removeTrackingCookie() {
    // driver for MS Edge browser crashes on browser.deleteCookie()
    browser.setCookie({ name: trackingCookie, value: 'unknown', domain: domain });
}

function setGeoCookie(country) {
    browser.setCookie({ name: 'Geo', value: `{%22region%22:%22CA%22%2C%22country%22:%22${country}%22%2C%22continent%22:%22NA%22}` });
}

function ensureUserPrompt() {
    assert(browser.isExisting(overlay));
    assert(browser.isExisting(acceptButton));
    assert(browser.isExisting(rejectButton));
}

function ensureNoPrompt() {
    assert.equal(browser.isExisting(overlay), false);
}

describe("BrowserStack: ", () => {
    before(() =>{
        browser.url(url);
        setGeoCookie(countryRequiringConsent);
    });

    describe("without any relevant cookies", () => {
        afterEach(() => {
            removeTrackingCookie();
        });

        it("prompts the user", () => {
            browser.url(url);
            ensureUserPrompt();
        });

        it("prompts the user on subsequent pages if they do not interact with the modal", () => {
            browser.url(url);
            ensureUserPrompt();

            browser.url(url);
            ensureUserPrompt();
        });

        it("adds the correct cookie when accepted on initial modal", () => {
            browser
                .url(url)
                .click(acceptButton);

            const cookie = browser.getCookie(trackingCookie);
            assert.equal(cookie.value, cookieState.accepted);
            ensureNoPrompt();
        });

        it("adds the correct cookie when rejected", () => {
            browser
                .url(url)
                .click(rejectButton);

            const cookie = browser.getCookie(trackingCookie);
            assert.equal(cookie.value, cookieState.rejected);
            ensureNoPrompt();
        });
    });

    describe("after accepting tracking", () => {
        afterEach(() => {
            removeTrackingCookie();
        });

        it("does not prompt on subsequent pageloads", () => {
            browser
                .url(url)
                .click(acceptButton);

            browser.url(url);
            ensureNoPrompt();
        })
    });

    describe("after rejecting tracking", () => {
        afterEach(() => {
            removeTrackingCookie();
        });

        it("does not prompt on subsequent pageloads", () => {
            browser
                .url(url)
                .click(rejectButton);

            browser.url(url);
            ensureNoPrompt();
        });
    });

    describe("with geo cookie from country requiring consent", () => {
        before(() => {
            browser.url(url);
            removeTrackingCookie();
            setGeoCookie(countryRequiringConsent)
        });

        afterEach(() => {
            removeTrackingCookie();
        });

        it("prompts the user", () => {
            browser.url(url);
            ensureUserPrompt();
        });

        it("does not reprompt when the user accepts", () => {
            browser.url(url);
            ensureUserPrompt();
            browser.click(acceptButton);

            browser.url(url);
            ensureNoPrompt();
        });

        it("does not reprompt when the user rejects", () => {
            browser.url(url);
            ensureUserPrompt();
            browser.click(rejectButton);

            browser.url(url);
            ensureNoPrompt();
        })
    });

    describe("with geo cookie from country not requiring consent", () => {
        before(() => {
            browser.url(url);
            removeTrackingCookie();
            setGeoCookie(countryNotRequiringConsent);
        });

        afterEach(() => {
            removeTrackingCookie();
        });

        it("does not prompt the user", () => {
            browser.url(url);
            ensureNoPrompt();
        });
    });
});