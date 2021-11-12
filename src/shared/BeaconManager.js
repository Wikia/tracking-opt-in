const beacons = [
    {
        name: '_b2',
        extendTime: 730 // 2 years in days
    },
    {
        name: 'wikia_beacon_id',
        extendTime: 183 // 6 months in days
    }
]


class BeaconManager {
    temporary = true;

    constructor(isTemporary) {
        this.temporary = isTemporary
    }

    extendBeaconsTTL() {
        if (this.temporary) {
            beacons.forEach(({ name }) => {
                Cookies.set(name);
            });
        } else {
            beacons.forEach(({ name, extendTime }) => {
                Cookies.set(name, { expires: extendTime });
            });
        }
    };
}

export default BeaconManager;
