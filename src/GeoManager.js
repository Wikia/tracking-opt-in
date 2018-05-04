import Cookies from 'js-cookie';

const COUNTRY_COOKIE_NAME = 'Geo';
const COUNTRIES_REQUIRING_PROMPT = [
    'us',
];

function getCountryFromCookie() {
    const cookie = Cookies.get(COUNTRY_COOKIE_NAME);
    if (cookie) {
        try {
            const obj = JSON.parse(cookie);
            return obj.country;
        } catch (e) {
            console.error('error parsing geo cookie', e);
        }
    } else {
        console.error('no geo cookie found');
    }

    return false;
}

class GeoManager {
    constructor(country, countriesRequiringPrompt) {
        this.countriesRequiringPrompt = countriesRequiringPrompt || COUNTRIES_REQUIRING_PROMPT;
        this.country = (country || getCountryFromCookie() || this.countriesRequiringPrompt[0]).toLowerCase();
    }

    needsTrackingPrompt() {
        return this.countriesRequiringPrompt.indexOf(this.country) !== -1;
    }
}

export default GeoManager;
