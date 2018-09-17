import {h, render} from "preact/dist/preact";
import CookieSyncFrame from "./components/CookieSyncFrame";

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
