const browserstack = require('browserstack-local');

const user = process.env.BROWSERSTACK_USERNAME;
const key = process.env.BROWSERSTACK_KEY;
const useTunnel = !!process.env.USE_TUNNEL;

if (!user || !key) {
    console.error('Please provide BROWSERSTACK_USERNAME and BROWSERSTACK_KEY environment params');
    process.exit(1);
}

const windows10Device = {
    os: 'Windows',
    os_version: '10',
};
const macOsDevice = {
    os: 'OS X',
    os_version: 'High Sierra',
};
const android4_4Device = {
    os: 'Android',
    device: 'Google Nexus 5',
    os_version: '4.4',
    realMobile: true,
};
const android5Device = {
    os: 'Android',
    device: 'Samsung Galaxy S6',
    os_version: '5.0',
    realMobile: true,
};
const android6Device = {
    os: 'Android',
    device: 'Samsung Galaxy S7',
    os_version: '6.0',
    realMobile: true,
};
const android7Device = {
    os: 'Android',
    device: 'Samsung Galaxy S8',
    os_version: '7.0',
    realMobile: true,
};
const android8Device = {
    os: 'Android',
    device: 'Google Pixel',
    os_version: '8.0',
    realMobile: true,
};
const ios10_3Device = {
    os: 'iOS',
    device: 'iPhone 7',
    os_version: '10.3',
    realMobile: true,
};
const ios11Device = {
    os: 'iOS',
    device: 'iPhone 8',
    os_version: '11.0',
    realMobile: true,
};
const ios11_2Device = {
    os: 'iOS',
    device: 'iPhone SE',
    os_version: '11.2',
    realMobile: true,
};


const commonCapabilities = {
    project: 'tracking-opt-in',
    'browserstack.local': useTunnel,
};

// see http://webdriver.io/guide/testrunner/configurationfile.html for options
exports.config = {
    user,
    key,
    logLevel: 'error',
    coloredLogs: true,
    maxInstances: 10,
    reporters: ['junit', 'concise'],
    reporterOptions: {
        junit: {
            outputDir: 'selenium/reports/junit',
        }
    },
    specs: [
        `./selenium/*.js`
    ],
    capabilities: [
        {
            ...ios10_3Device,
            ...commonCapabilities,
            browser: 'safari',
        },
        {
            ...ios11Device,
            ...commonCapabilities,
            browser: 'safari',
        },
        {
            ...ios11_2Device,
            ...commonCapabilities,
            browser: 'safari',
        },
        {
            ...android4_4Device,
            ...commonCapabilities,
            browser: 'chrome',
        },
        {
            ...android5Device,
            ...commonCapabilities,
            browser: 'chrome',
        },
        {
            ...android6Device,
            ...commonCapabilities,
            browser: 'chrome',
        },
        {
            ...android7Device,
            ...commonCapabilities,
            browser: 'chrome',
        },
        {
            ...android8Device,
            ...commonCapabilities,
            browser: 'chrome',
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

// so that the generated reports have the proper browserName
exports.config.capabilities.forEach((cap) => {
    if (cap.browser && !cap.browserName) {
        cap.browserName = cap.browser;
    }
});

if (useTunnel) {
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