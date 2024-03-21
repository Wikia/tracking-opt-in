const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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

if (process.env.NODE_ENV === 'development' || process.env.SERVE === 'true') {
    topLevelOptions = {
        devServer: {
            port: 3000,
            hot: true,
            client: {
                overlay: {
                    errors: true,
                    warnings: false,
                    runtimeErrors: false,
                },
            }
        }
    };
}

module.exports = {
    mode: process.env.NODE_ENV,
    entry: './src/index.js',
    output: {
        path: buildPath,
        filename: 'tracking-opt-in.min.js',
        chunkFilename: '[name].js',
        library: 'trackingOptIn',
        libraryTarget: 'umd',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: false,
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /-test.js$/,
                loader: 'esbuild-loader',
                options: {
                    target: 'es2015',
                    loader: 'jsx',
                    jsxFactory: 'h',
                    jsxFragment: 'Fragment',
                }
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
                                require('cssnano')({
                                    preset: 'default',
                                }),
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
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: `${__dirname}/reports/bundle-analysis.html`,
            openAnalyzer: false,
        }),
    ],
    ...topLevelOptions,
};
