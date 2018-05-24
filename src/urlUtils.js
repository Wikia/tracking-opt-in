export function parseUrl(url) {
    const parser = document.createElement('a');
    parser.href = url;
    return parser;
}
