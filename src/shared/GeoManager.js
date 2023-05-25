import Cookies from 'js-cookie';
import { getCookieDomain } from './utils';

export const COUNTRY_COOKIE_NAME = 'Geo';
const MISSING_COOKIE_NAME = 'no-cookie';

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
    'br', // Brazil
    'ky', // Cayman Islands
    'cn', // China
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
const COUNTRIES_WITH_REJECT_ALL_FUNCTIONALITY = ['fr'];

function getGeoDataFromCookie(type = 'country') {
    const cookie = Cookies.get(COUNTRY_COOKIE_NAME);
    if (cookie) {
        try {
            const obj = JSON.parse(cookie);
            return obj[type];
        } catch (e) {
            console.error('error parsing geo cookie', cookie);
        }
    } else {
        console.warn('no geo cookie found');
    }

    return false;
}

export function ensureGeoCookie() {
    if (Cookies.get(COUNTRY_COOKIE_NAME)) {
        return Promise.resolve();
    }

    const GEO_SERVICE_URL = 'https://services.fandom.com/geoip/location';

    return new Promise((resolve, reject) => {
        try {
            const request = new XMLHttpRequest();

            request.open('GET', GEO_SERVICE_URL, true);
            request.setRequestHeader('Content-type', 'application/json');
            request.timeout = 2000;
            request.withCredentials = true;

            request.onload = () => {
                if (request.status < 200 || request.status >= 300) {
                    console.warn('no geo cookie found');
                    reject();
                } else {
                    const geoResponse = JSON.parse(request.responseText);

                    resolve({
                        continent: geoResponse.continent_code,
                        country: geoResponse.country_code,
                        region: geoResponse.region,
                        city: geoResponse.city,
                        country_name: geoResponse.country_name
                    });
                }
            };

            request.onerror = () => {
                console.warn('no geo cookie found');
                reject();
            };

            request.send();
        } catch (err) {
            console.warn('no geo cookie found');
            reject();
        }
    }).then((geoData) => {
        Cookies.set('Geo', JSON.stringify(geoData), {
            domain: getCookieDomain(window.location.hostname),
            expires: 365,
            path: '/',
        });
    });
}

class GeoManager {
    constructor(country, region, countriesRequiringPrompt) {
        this.geosRequiringPrompt = (countriesRequiringPrompt || COUNTRIES_REQUIRING_PROMPT).map(country => country.toLowerCase());
        this.country = (country || getGeoDataFromCookie('country') || MISSING_COOKIE_NAME).toLowerCase();
        this.region = (region || getGeoDataFromCookie('region') || MISSING_COOKIE_NAME).toLowerCase();
    }

    hasSpecialPrivacyLaw() {
        return this.geosRequiringPrompt.indexOf(this.country) !== -1;
    }

    hasGeoCookie() {
        return this.country !== MISSING_COOKIE_NAME;
    }

    hasRejectAllFunctionality() {
        return COUNTRIES_WITH_REJECT_ALL_FUNCTIONALITY.indexOf(this.country) !== -1;
    }
}

export default GeoManager;
