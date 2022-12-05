import { Promise } from 'es6-promise';

export const DEBUG_QUERY_PARAM = 'tracking-opt-in-debug';

export function isParameterSet(param) {
    return window.location.href.indexOf(`${param}=true`) !== -1;
}

export function debug(label, ...args) {
    if (isParameterSet(DEBUG_QUERY_PARAM)) {
        console.log(`[DEBUG] ${label}: `, ...args);
    }
}

export function getUrlParameter(paramName) {
    const paramList = window.location.search.slice(1).split('&');
    let paramValue = null;
    paramList.forEach((param) => {
        if (param.length > 0) {
            const keyValue = param.split('=');
            if (keyValue[0] === paramName) {
                // May return undefined
                paramValue = keyValue[1];
            }
        }
    });
    return paramValue;
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

    let cookieDomain = `.${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
    // These exceptions require a third part for a valid cookie domain. This isn't
    // a definitive list but rather the most likely domains on which Fandom would
    // host a site.
    const exceptions = [
        '.co.jp',
        '.co.nz',
        '.co.uk',
    ];
    if (exceptions.indexOf(cookieDomain) >= 0) {
        cookieDomain = `.${parts[parts.length - 3]}${cookieDomain}`;
    }

    return cookieDomain;
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

export function loadScript(url, options) {
    const element = document.createElement('script');
    element.src = url;
    Object.keys(options).map((key) => {
        element.setAttribute(key, options[key])
    });
    document.body.appendChild(element);
}

export function getCookieValue(name) {
    function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}
