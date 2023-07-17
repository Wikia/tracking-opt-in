const url = new URL(document.currentScript ? document.currentScript.src : 'http://localhost:3000/tracking-opt-in.min.js');

__webpack_public_path__ = url.href.replace('tracking-opt-in.min.js', '');
