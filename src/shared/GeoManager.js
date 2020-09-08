import Cookies from 'js-cookie';
import { debug, getJSON, getUrlParameter } from './utils';

export const COUNTRY_COOKIE_NAME = 'Geo';
const MISSING_COOKIE_NAME = 'no-cookie';
let icbmLoaded = false;
let icbmContent = null;

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

function isVariableEnabled(name, country) {
    if (getUrlParameter(`icbm.${name}`)) {
        return getUrlParameter(`icbm.${name}`) === 'true';
    }

    if (getUrlParameter(`icbm__${name}`)) {
        return getUrlParameter(`icbm__${name}`) === 'true';
    }

    return !!(
        icbmContent &&
        icbmContent[name] &&
        icbmContent[name][0] &&
        icbmContent[name][0].value &&
        icbmContent[name][0].regions &&
        (
            icbmContent[name][0].regions.includes(country.toUpperCase()) ||
            icbmContent[name][0].regions.includes('XX')
        ));
}

class GeoManager {
    constructor(country, region, countriesRequiringPrompt) {
        this.geosRequiringPrompt = (countriesRequiringPrompt || COUNTRIES_REQUIRING_PROMPT).map(country => country.toLowerCase());
        this.country = (country || getGeoDataFromCookie('country') || MISSING_COOKIE_NAME).toLowerCase();
        this.region = (region || getGeoDataFromCookie('region') || MISSING_COOKIE_NAME).toLowerCase();

        GeoManager.fetchInstantConfig().then(() => {
            this.tcf2Enabled = isVariableEnabled('icTcf2Enabled', this.country);
            this.googleMoved = isVariableEnabled('icTrackingOptInGoogleMove', this.country);

            debug('GEO', `Variables set: icTcf2Enabled is ${this.tcf2Enabled}`);
            debug('GEO', `Variables set: icTrackingOptInGoogleMove is ${this.googleMoved}`);
        });
    }

    static fetchInstantConfig() {
        if (!icbmLoaded) {
            if (icbmContent) {
                return icbmContent;
            }

            // Let's use Oasis as a source of truth and change icVar for all platforms with new library version
            icbmContent = getJSON('https://services.wikia.com/icbm/api/config?app=oasis')
                .then((content) => {
                    debug('GEO', 'ICBM called', content);

                    icbmLoaded = true;
                    icbmContent = content;
                }, () => {
                    debug('GEO', 'Failed to call ICBM service');

                    icbmLoaded = true;
                    icbmContent = {};
                });

            return icbmContent;
        }

        return Promise.resolve();
    }

    needsTrackingPrompt() {
        return this.geosRequiringPrompt.indexOf(this.country) !== -1;
    }

    needsUserSignal() {
        return this.geosRequiringPrompt.indexOf(this.getDetectedRegion()) !== -1;
    }

    getDetectedGeo() {
        return this.country;
    }

    getDetectedRegion() {
        return `${this.country}-${this.region}`;
    }

    hasGeoCookie() {
        return this.country !== MISSING_COOKIE_NAME;
    }

    isGoogleMoved() {
        return this.googleMoved;
    }
}

export default GeoManager;
