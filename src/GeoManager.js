import Cookies from 'js-cookie';

const COUNTRY_COOKIE_NAME = 'Geo';

// client.geo.country_code https://docs.fastly.com/guides/vcl/geolocation-related-vcl-features
const COUNTRIES_REQUIRING_PROMPT = [
    'ai', // Anguilla
    'aw', // Aruba
    'ax', // Åland Islands
    'at', // Austria
    'be', // Belgium
    'bg', // Bulgaria
    'bm', // Bermuda
    'vg', // British Virgin Islands
    'bq', // Bonaire
    'ky', // Cayman Islands
    'hr', // Croatia
    'cw', // Curaçao
    'cy', // Cyprus
    'cz', // Czech Republic
    'dk', // Denmark
    'ee', // Estonia
    'fk', // Falkland Islands
    'fo', // Faroe Islands
    'fi', // Finland
    'fr', // France
    'gf', // French Guiana
    'pf', // French Polynesia
    'tf', // French Southern and Antarctic Lands
    'de', // Germany
    'gi', // Gibraltar
    'gr', // Greece
    'gl', // Greenland
    'gp', // Guadeloupe
    'hu', // Hungary
    'is', // Iceland
    'ie', // Ireland
    'im', // Isle of Man
    'it', // Italy
    're', // La Réunion
    'lv', // Latvia
    'li', // Liechtenstein
    'lt', // Lithuania
    'lu', // Luxembourg
    'mq', // Martinique
    'mt', // Malta
    'yt', // Mayotte
    'ms', // Montserrat
    'nl', // Netherlands
    'nc', // New Caledonia
    'no', // Norway
    'pn', // Pitcairn Islands
    'pl', // Poland
    'pt', // Portugal
    'ro', // Romania
    'bl', // Saint Barthélemy
    'sh', // Saint Helena
    'mf', // Saint Martin
    'pm', // Saint-Pierre-et-Miquelon
    'bq', // Sint Eustatius
    'sx', // Sint Maarten
    'sk', // Slovakia
    'si', // Slovenia
    'es', // Spain
    'se', // Sweden
    'ch', // Switzerland
    'tc', // Turks and Caicos Islands
    'gb', // United Kingdom of Great Britain and Northern Ireland
    'uk', // United Kingdom of Great Britain and Northern Ireland
    'wf', // Wallis-et-Futuna
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
