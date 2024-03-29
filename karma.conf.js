const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

const browsers = [
    'last 2 chrome versions',
    'last 2 firefox versions',
    'last 2 safari versions',
    'last 2 edge versions',
    'last 2 ios versions',
    'last 2 chromeandroid versions',
];
const autoprefixerPlugin = autoprefixer({
    cascade: false,
    browsers: browsers.join(', '),
});

// Karma configuration
// Generated on Mon May 07 2018 11:09:08 GMT-0500 (CDT)
module.exports = function(config) {
  config.set({
      // base path that will be used to resolve all patterns (eg. files, exclude)
      basePath: '',

      // frameworks to use
      // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
      frameworks: ['mocha'],

      // list of files / patterns to load in the browser
      files: [
          'src/**/*.js'
      ],

      // list of files / patterns to exclude
      exclude: [
          'src/index*.js',
      ],

      webpack: {
          devtool: 'inline-source-map',
          mode: 'development',
          optimization: {
              splitChunks: {
                  cacheGroups: {
                      default: false,
                      vendors: false,
                  },
              },
          },
          module: {
              rules: [
                  {
                      test: /\.js$/,
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
                                  sourceMap: true,
                                  hmr: true,
                              },
                          },
                          {
                              loader: 'css-loader',
                              options: {
                                  sourceMap: true,
                                  modules: true,
                              },
                          },
                          {
                              loader: 'postcss-loader',
                              options: {
                                  sourceMap: true,
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
                                  sourceMap: true
                              },
                          }
                      ],
                  },
              ],
          },
          plugins: [
              new webpack.optimize.LimitChunkCountPlugin({
                  maxChunks: 1
              }),
          ],
          resolve: {
              extensions: ['.js'],
              modules: [
                  'src',
                  'node_modules',
              ],
          },
      },

      plugins: [
          'karma-mocha',
          'karma-mocha-reporter',
          'karma-webpack',
          'karma-coverage',
          'karma-jsdom-launcher',
          'karma-sourcemap-loader',
          'karma-junit-reporter',
          'karma-allure-reporter',
      ],

      // preprocess matching files before serving them to the browser
      // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
          'src/**/*.js': ['webpack', 'sourcemap']
      },

      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: ['mocha', 'coverage', 'junit', 'allure'],

      coverageReporter: {
          type : 'html',
          dir : 'reports/karma/coverage',
          subdir: '.',
      },

      junitReporter: {
          outputDir: 'reports/karma/junit',
          outputFile: 'tests.xml',
          useBrowserName: false,
      },

      // the default configuration
      allureReport: {
          reportDir: 'reports/karma/allure',
      },

      // web server port
      port: 9876,

      // enable / disable colors in the output (reporters and logs)
      colors: true,

      // level of logging
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      logLevel: config.LOG_INFO,

      // start these browsers
      // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
      browsers: ['jsdom'],

      // Continuous Integration mode
      // if true, Karma captures browsers, runs the tests and exits
      singleRun: true,

      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: true,

      // Concurrency level
      // how many browser should be started simultaneous
      concurrency: 1,
  })
};
