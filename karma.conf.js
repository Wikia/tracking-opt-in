const path = require('path');

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
          module: {
              rules: [
                  {
                      test: /\.js$/,
                      include: path.resolve(__dirname, './src'),
                      use: [{
                          loader: 'babel-loader',
                          options: {
                              plugins: [
                                  'istanbul',
                              ]
                          },
                      }]
                  },
                  {
                      test: /\.s?css$/,
                      use: [
                          {
                              loader: 'style-loader',
                              options: {
                                  sourceMap: true,
                              }
                          },
                          {
                              loader: 'css-loader',
                              options: {
                                  sourceMap: false,
                                  modules: true,
                              },
                          },
                          {
                              loader: 'sass-loader',
                              options: {
                                  sourceMap: false
                              },
                          }
                      ],
                  }
              ],
          },
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
      ],

      // preprocess matching files before serving them to the browser
      // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
          'src/**/*.js': ['webpack', 'sourcemap']
      },

      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: ['mocha', 'coverage'],

      coverageReporter: {
          type : 'html',
          dir : 'reports/karma/coverage'
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
