const CopyWebpackPlugin = require('copy-webpack-plugin');

const buildPath = `${__dirname}/dist`;

let topLevelOptions = {};
let plugins = {};

if (process.env.NODE_ENV === 'development') {
    topLevelOptions = {
        serve: {
            host: '0.0.0.0',
            port: 3000,
            hot: {
                host: '0.0.0.0',
                port: 3001,
            }
        }
    };
    plugins = [
        new CopyWebpackPlugin([{
            from: `${__dirname}/demo.html`,
            to: `${buildPath}/index.html`,
        }])
    ];
}

module.exports = {
    mode: process.env.NODE_ENV,
    entry: './src/index.js',
    output: {
        path: buildPath,
        filename: 'index.js',
        library: 'cookieOptIn'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: `${__dirname}/src`,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'preact'],
                    }
                }]
            }
        ],
    },
    plugins: [
        ...plugins,
    ],
    ...topLevelOptions,
};
