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

let topLevelOptions = {};
let plugins = [];
let cssLoader = {
    test: /\.s?css$/,
    use: [
        {
            loader: 'css-loader',
            options: {
                sourceMap: false,
                modules: true,
            },
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: false,
                plugins: () => [
                    autoprefixerPlugin,
                ],
            },
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: false
            },
        }
    ],
};

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
        ...plugins,
        new CopyWebpackPlugin([{
            from: `${__dirname}/demo.html`,
            to: `${buildPath}/index.html`,
        }])
    ];

    cssLoader.use[0].options.sourceMap = true;
    cssLoader.use[1].options.sourceMap = true;
    cssLoader.use[2].options.sourceMap = true;
    cssLoader.use.unshift({
        loader: 'style-loader',
        options: {
            sourceMap: true,
        }
    });
} else {
    cssLoader.use.unshift(MiniCssExtractPlugin.loader);
    plugins = [
        ...plugins,
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        })
    ]
}

module.exports = {
    mode: process.env.NODE_ENV,
    entry: './src/index.js',
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
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'preact'],
                        plugins: [
                            'transform-class-properties',
                            'transform-object-rest-spread',
                        ]
                    }
                }]
            },
            cssLoader,
        ],
    },
    plugins: [
        ...plugins,
    ],
    ...topLevelOptions,
};
