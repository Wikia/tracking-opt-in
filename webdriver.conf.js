const browserstack = require('browserstack-local');

const user = process.env.BROWSERSTACK_USERNAME;
const key = process.env.BROWSERSTACK_KEY;
const local = !!process.env.BROWSERSTACK_LOCAL;

if (!user || !key) {
    console.error('Please provide BROWSERSTACK_USERNAME and BROWSERSTACK_KEY environment params');
    process.exit(1);
}

exports.config = {
    user,
    key,
    logLevel: 'info',
    coloredLogs: true,
    specs: [
        './selenium/sample.js'
    ],
    capabilities: [{
        browser: 'chrome',
        'browserstack.local': local,
    }],

    // Code to start browserstack local before start of test
    onPrepare: function (config, capabilities) {
        console.log("Connecting local");
        return new Promise(function(resolve, reject){
            exports.bs_local = new browserstack.Local();
            exports.bs_local.start({'key': exports.config.key }, function(error) {
                if (error) return reject(error);
                console.log('Connected. Now testing...');

                resolve();
            });
        });
    },

    // Code to stop browserstack local after end of test
    onComplete: function (capabilties, specs) {
        exports.bs_local.stop(function() {});
    }
};
