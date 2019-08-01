import { Promise } from 'es6-promise';

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
