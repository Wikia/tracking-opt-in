import {Promise} from 'es6-promise';

export function parseUrl(url) {
    const parser = document.createElement('a');
    parser.href = url;
    return parser;
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
