const HtmlWebpackPlugin = require('html-webpack-plugin');
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
const isDevelopment = process.env.NODE_ENV === 'development';

let topLevelOptions = {};

if (process.env.NODE_ENV === 'development') {
    topLevelOptions = {
        serve: {
            port: 3000,
            hot: {
                port: 3001,
            }
        }
    };
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
        new HtmlWebpackPlugin({
            title: 'Tracking Opt In Demo',
            filename: 'index.html',
            inject: 'head',
            template: 'handlebars-loader!demo.hbs',
            isDevelopment,
      }),
    ],
    ...topLevelOptions,
};
