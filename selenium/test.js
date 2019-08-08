const assert = require('assert');

function getCookieDomain(hostname) {
    const parts = hostname.split('.');
    if (parts.length < 2) {
        return undefined;
    }

    return `.${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}

const url = (process.env.TEST_URL || 'http://localhost:3000').replace(/\/$/, '');
const countryRequiringConsent = process.env.COUNTRY_REQUIRING_CONSENT || 'PL';
const countryNotRequiringConsent = process.env.COUNTRY_NOT_REQUIRING_CONSENT || 'CA';
const domain = getCookieDomain(url);
const overlay = '[data-tracking-opt-in-overlay="true"]';
const acceptButton = '[data-tracking-opt-in-accept="true"]';
const learnMoreButton = '[data-tracking-opt-in-learn-more="true"]';
const trackingCookie = 'tracking-opt-in-status';
const cookieState = {
    accepted: 'accepted',
    rejected: 'rejected',
};

// windows needs the geo cookie set to something
function removeTrackingCookie() {
    // driver for MS Edge browser crashes on browser.deleteCookie()
    browser.setCookies({ name: trackingCookie, value: 'unknown', domain: domain });
}

function setGeoCookie(country) {
    browser.setCookies({ name: 'Geo', value: `{%22region%22:%22CA%22%2C%22country%22:%22${country}%22%2C%22continent%22:%22NA%22}` });
}

// windows needs the geo cookie set to something
function removeGeoCookie(country) {
    browser.setCookies({ name: 'Geo', value: '{' });
}

function ensureUserPrompt() {
    $(overlay).waitForExist();
    assert($(overlay).isExisting());
    assert($(acceptButton).isExisting());
    assert($(learnMoreButton).isExisting());
}

function ensureNoPrompt() {
    $('html').waitForExist();
    assert.equal($(overlay).isExisting(), false);
}

describe("BrowserStack: ", () => {
    before(() =>{
        browser.url(url);
        setGeoCookie(countryRequiringConsent);
    });

    describe("without any relevant cookies", () => {
        afterEach(() => {
            console.log('removing tracking cookie');
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
            browser.url(url);
            $(acceptButton).click();

            const cookie = browser.getCookies([trackingCookie]);
            console.log('tites', cookie);
            assert.equal(cookie[0].value, cookieState.accepted);
            ensureNoPrompt();
        });
    });

    describe("after accepting tracking", () => {
        afterEach(() => {
            removeTrackingCookie();
        });

        it("does not prompt on subsequent pageloads", () => {
            browser.url(url);
            $(acceptButton).click();

            browser.url(url);
            ensureNoPrompt();
        })
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
            $(acceptButton).click();

            browser.url(url);
            ensureNoPrompt();
        });
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

    describe("without geo cookie", () => {
        before(() => {
            browser.url(url);
            removeGeoCookie();
        });

        afterEach(() => {
            removeTrackingCookie();
        });

        it("does not prompt the user", () => {
            removeGeoCookie();
            browser.url(url);
            ensureNoPrompt();
        });
    });
});
