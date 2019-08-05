import { Promise } from 'es6-promise';

export const PURPOSES = {
    INFORMATION: 1,
    PERSONALIZATION: 2,
    AD: 3,
    CONTENT: 3,
    MEASUREMENT: 3,
};

export const FEATURES = {
    MATCHING_DATA: 1,
    LINKING_DEVICES: 2,
    GEOLOCATION: 3,
};

export function getPurposeTitle(content, index) {
    return content[`purpose${index}Title`];
}

export function getPurposeBody(content, index) {
    return content[`purpose${index}Body`];
}

export function getFeatureTitle(content, index) {
    return content[`feature${index}Title`];
}

export function getFeatureBody(content, index) {
    return content[`feature${index}Body`];
}

export function isParameterSet(param) {
    return window.location.href.indexOf(`${param}=true`) !== -1;
}

export function parseUrl(url) {
    const parser = document.createElement('a');
    parser.href = url;
    return parser;
}

export function getCookieDomain(hostname) {
    const parts = hostname.split('.');
    if (parts.length < 2) {
        return undefined;
    }

    return `.${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}

const cachedJson = {};

export function getJSON(url, useCache = true) {
    return new Promise((resolve, reject) => {
        if (useCache && cachedJson[url]) {
            resolve(cachedJson[url]);
            return;
        }

        const req = new XMLHttpRequest();

        req.open('GET', url, true);
        req.onload = function () {
            let response;

            try {
                response = JSON.parse(this.responseText);
                cachedJson[url] = response;
            } catch (e) {
                response = null;
            }

            resolve(response);
        };
        req.onerror = function () {
            reject(new Error(`Cannot fetch: ${url}`));
        };
        req.send(null);
    });
}

export function getVendorList() {
    return getJSON('https://vendorlist.consensu.org/vendorlist.json');
}
