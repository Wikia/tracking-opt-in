import { assert } from 'chai';
import Cookies from 'js-cookie';

import { BEACONS } from './consts';
import BeaconManager from "./BeaconManager";

const mockedWikiaBeaconId = '67890';
const mockedB2 = '02468';

function setMockedCookies() {
    Cookies.set('wikia_beacon_id', mockedWikiaBeaconId);
    Cookies.set('_b2', mockedB2);
}

describe('BeaconManager', () => {
    after(() => {
        Cookies.remove('wikia_beacon_id');
        Cookies.remove('_b2');
    });

    describe('in country not requiring the prompt', () => {
        it('gets value from the cookies', () => {
            setMockedCookies();
            assert.equal(new BeaconManager(BEACONS).getBeaconsValue('wikia_beacon_id'), mockedWikiaBeaconId);
            assert.equal(new BeaconManager(BEACONS).getBeaconsValue('_b2'), mockedB2);
        });
    });
});
