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
const commonCapabilities = {
    os: 'OS X',
    os_version: 'High Sierra',
    project: 'tracking-opt-in',
    'browserstack.local': local,
};

exports.config = {
    user,
    key,
    coloredLogs: true,
    specs: [
        `./selenium/${SUITES[suite]}.js`
    ],
    capabilities: [
        {
            ...commonCapabilities,
            browser: 'chrome',
        },
        // {
        //     ...commonCapabilities,
        //     browser: 'firefox',
        // },
        // {
        //     ...commonCapabilities,
        //     browser: 'safari',
        // },
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
