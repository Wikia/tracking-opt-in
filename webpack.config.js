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
                include: `${__dirname}/src`,
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
                        loader: 'esbuild-loader',
                        options: {
                            /**
                             * Since esbuild isn't aware of the `.sass` extension
                             * it cannot auto-detect how to handle it.
                             *
                             * We need to tell it to treat the output of
                             * `sass-loader` as CSS.
                             */
                            loader: 'css',
                            minify: true,
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
