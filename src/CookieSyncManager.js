import {h, render} from 'preact/dist/preact';
import Cookies from 'js-cookie';
import CookieSyncFrame from './components/CookieSyncFrame';
import {getCookieDomain} from './utils';

const COOKIE_SYNC_DONE_COOKIE_NAME = 'cookiesync_done';

class CookieSyncManager {
    constructor(host) {
        this.host = host;
        this.knownDomains = [
            '.wikia.com',
            '.fandom.com',
            '.wikia-dev.pl',
            '.fandom-dev.pl',
            '.wikia-dev.us',
            '.fandom-dev.us',
        ];
    }

    // Remove the cookie guard so if we fail to sync cookies,
    // we'll have another chance on the next page view
    clear() {
        Cookies.remove(COOKIE_SYNC_DONE_COOKIE_NAME, {
            domain: getCookieDomain(window.location.hostname)
        });
    }

    hostEndsWith(suffix) {
        return suffix === this.host.slice(-suffix.length);
    }

    getTopLevelDomain() {
        return this.knownDomains.find(domain => this.hostEndsWith(domain), this);
    }

    getFrameUrl() {
        const domain = this.getTopLevelDomain();
        if (domain !== undefined) {
            return `https://services${this.getTopLevelDomain()}/cookie-syncer/frame`;
        }
    }

    crossDomainSync() {
        const frameSrc = this.getFrameUrl();
        if (frameSrc) {
            render(
                <CookieSyncFrame
                    src={frameSrc}
                />,
                document.body
            );
        }
    }
}

export default CookieSyncManager;
