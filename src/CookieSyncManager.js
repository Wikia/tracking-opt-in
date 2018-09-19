import {render} from 'preact/dist/preact';
import Cookies from 'js-cookie';
import CookieSyncFrame from './components/CookieSyncFrame';

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

    // Remove the cookie so if the cookie-syncer service fails
    // we'll have another chance to sync on the next page view
    static removeCookieSyncDoneCookie() {
        Cookies.remove(COOKIE_SYNC_DONE_COOKIE_NAME);
    }

    crossDomainSync() {
        const frameSrc = this.getFrameUrl();
        if (frameSrc) {
            CookieSyncManager.removeCookieSyncDoneCookie();
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
