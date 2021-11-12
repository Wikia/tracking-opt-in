import Cookies from 'js-cookie';
import { getCookieDomain } from './utils';

class BeaconManager {
        constructor(beacons) {
        this.domain = getCookieDomain(window.location.hostname);
        this.beacons = beacons.map((beacon) => ({
            ...beacon,
            value:  this.getBeaconsValue(beacon.name),
        }));
    }

    getBeaconsValue(name) {
        return Cookies.get(name);
    }

    extendBeaconsTTLOnVisit() {
        this.beacons.forEach(({ name, value }) => {
            Cookies.set(name, value, {
                expires: 1/48, // 30 mins
                domain: this.domain
            });
        });
    }

    extendBeaconsTTLOnAccept() {
        this.beacons.forEach(({ name, value, extendTime }) => {
            console.log('gowno', name, value, extendTime);
            Cookies.set(name, value, {
                expires: extendTime,
                domain: this.domain
            });
        });
    };
}

export default BeaconManager;
