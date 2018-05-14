import Cookies from 'js-cookie';

const COUNTRY_COOKIE_NAME = 'Geo';

// client.geo.country_code https://docs.fastly.com/guides/vcl/geolocation-related-vcl-features
const COUNTRIES_REQUIRING_PROMPT = [
    'at', // Austria
    'be', // Belgium
    'bg', // Bulgaria
    'hr', // Croatia
    'cy', // Cyprus
    'cz', // Czech Republic
    'dk', // Denmark
    'ee', // Estonia
    'fi', // Finland
    'fr', // France
    'de', // Germany
    'gr', // Greece
    'hu', // Hungary
    'is', // Iceland
    'ie', // Ireland
    'it', // Italy
    'lv', // Latvia
    'li', // Liechtenstein
    'lt', // Lithuania
    'lu', // Luxembourg
    'mt', // Malta
    'nl', // Netherlands
    'no', // Norway
    'pl', // Poland
    'pt', // Portugal
    'ro', // Romania
    'sk', // Slovakia
    'si', // Slovenia
    'es', // Spain
    'se', // Sweden
    'ch', // Switzerland
    'gb', // United Kingdom of Great Britain and Northern Ireland
];

export function getCountryFromCookie() {
    const cookie = Cookies.get(COUNTRY_COOKIE_NAME);
    if (cookie) {
        try {
            const obj = JSON.parse(cookie);
            return obj.country;
        } catch (e) {
            console.error('error parsing geo cookie', e);
        }
    } else {
        console.warn('no geo cookie found');
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
