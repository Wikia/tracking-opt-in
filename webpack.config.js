const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

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
const isDevevelopment = process.env.NODE_ENV === 'development';

let topLevelOptions = {};
let plugins = [];

if (process.env.NODE_ENV === 'development') {
    topLevelOptions = {
        serve: {
            host: 'localhost',
            port: 3000,
            hot: {
                host: 'localhost',
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
    entry: isDevevelopment ? './src/index.js' : './src/index-dev.js',
    output: {
        path: buildPath,
        filename: 'tracking-opt-in.js',
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
                            sourceMap: isDevevelopment,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDevevelopment,
                            modules: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: isDevevelopment,
                            plugins: () => [
                                autoprefixerPlugin,
                            ],
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevevelopment
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
