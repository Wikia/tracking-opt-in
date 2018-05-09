const browserstack = require('browserstack-local');

const user = process.env.BROWSERSTACK_USERNAME;
const key = process.env.BROWSERSTACK_KEY;

if (!user || !key) {
    console.error('Please provide BROWSERSTACK_USERNAME and BROWSERSTACK_KEY environment params');
    process.exit(1);
}

const SUITES = {
    local: 'local',
};

const suite = process.env.SUITE || 'local';
if (!SUITES[suite]) {
    console.error('unknown suite', suite);
    process.exit(1);
}

const local = SUITES[suite] === SUITES.local;
const windows10Device = {
    os: 'Windows',
    os_version: '10',
};
const macOsDevice = {
    os: 'OS X',
    os_version: 'High Sierra',
};
const android4_4Device = {
    device: 'Google Nexus 5',
    os_version: '4.4',
    realMobile: true,
};
const android5Device = {
    device: 'Samsung Galaxy S6',
    os_version: '5.0',
    realMobile: true,
};
const android6Device = {
    device: 'Samsung Galaxy S7',
    os_version: '6.0',
    realMobile: true,
};
const android7Device = {
    device: 'Samsung Galaxy S8',
    os_version: '7.0',
    realMobile: true,
};
const android8Device = {
    device: 'Google Pixel',
    os_version: '8.0',
    realMobile: true,
};
const commonCapabilities = {
    project: 'tracking-opt-in',
    'browserstack.local': local,
};

exports.config = {
    user,
    key,
    coloredLogs: true,
    maxInstances: 10,
    specs: [
        `./selenium/${SUITES[suite]}.js`
    ],
    capabilities: [
        {
            ...android4_4Device,
            ...commonCapabilities,
        },
        {
            ...android5Device,
            ...commonCapabilities,
        },
        {
            ...android6Device,
            ...commonCapabilities,
        },
        {
            ...android7Device,
            ...commonCapabilities,
        },
        {
            ...android8Device,
            ...commonCapabilities,
        },
        {
            ...windows10Device,
            ...commonCapabilities,
            browser: 'chrome',
        },
        {
            ...windows10Device,
            ...commonCapabilities,
            browser: 'firefox',
        },
        {
            ...windows10Device,
            ...commonCapabilities,
            browser: 'ie',
            browser_version: '11.0',
        },
        {
            ...windows10Device,
            ...commonCapabilities,
            browser: 'edge',
        },
        {
            ...macOsDevice,
            ...commonCapabilities,
            browser: 'chrome',
        },
        {
            ...macOsDevice,
            ...commonCapabilities,
            browser: 'firefox',
        },
        {
            ...macOsDevice,
            ...commonCapabilities,
            browser: 'safari',
        },
    ],
};

if (local) {
    // Code to start browserstack local before start of test
    exports.config.onPrepare = function(config, capabilities) {
        console.log("Connecting local");
        return new Promise(function(resolve, reject){
            exports.bs_local = new browserstack.Local();
            exports.bs_local.start({'key': exports.config.key }, function(error) {
                if (error) return reject(error);
                console.log('Connected. Now testing...');

                resolve();
            });
        });
    };

    // Code to stop browserstack local after end of test
    exports.config.onComplete = function (capabilties, specs) {
        exports.bs_local.stop(function() {});
    };
}
