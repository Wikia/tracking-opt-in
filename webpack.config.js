const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

// ie11 does not let you set cookies on localhost. to test on ie11 set this to an actual domain
// that resolves to localhost
const host = 'localhost';
const browsers = [
    'last 2 chrome versions',
    'last 2 firefox versions',
    'last 2 safari versions',
    'last 2 edge versions',
    'last 2 ios versions',
    'last 2 chromeandroid versions',
];
const buildPath = `${__dirname}/dist`;
const autoprefixerPlugin = autoprefixer({
    cascade: false,
    browsers: browsers.join(', '),
});
const isDevelopment = process.env.NODE_ENV === 'development';

let topLevelOptions = {};
let plugins = [];

if (process.env.NODE_ENV === 'development') {
    topLevelOptions = {
        serve: {
            host,
            port: 3000,
            hot: {
                host,
                port: 3001,
            }
        }
    };
    plugins = [
        ...plugins,
        new CopyWebpackPlugin([{
            from: `${__dirname}/demo.html`,
            to: `${buildPath}/index.html`,
        }])
    ];
}

module.exports = {
    mode: process.env.NODE_ENV,
    entry: isDevelopment ? './src/index.js' : './src/index-dev.js',
    output: {
        path: buildPath,
        filename: 'tracking-opt-in.min.js',
        library: 'trackingOptIn',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: `${__dirname}/src`,
                use: 'babel-loader',
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: isDevelopment,
                            hmr: isDevelopment,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDevelopment,
                            modules: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: isDevelopment,
                            plugins: () => [
                                autoprefixerPlugin,
                            ],
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment
                        },
                    }
                ],
            },
        ],
    },
    plugins: [
        ...plugins,
    ],
    ...topLevelOptions,
};
