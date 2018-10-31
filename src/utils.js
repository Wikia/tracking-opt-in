import { Promise } from 'es6-promise';

export function isParameterSet(param) {
    return new URL(window.location.href).searchParams.get(param) === 'true';
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

export function getJSON(url) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();

        req.open('GET', url, true);
        req.onload = function () {
            let response;

            try {
                response = JSON.parse(this.responseText);
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
