/* eslint no-var: 0, vars-on-top: 0 */
var browsers;
var reporters;
var webpackConfig;

if (process.env.TEST_COVERALLS === 'true') {
  // Coveralls report
  browsers = ['ChromeTravisCI'];
  reporters = ['mocha', 'coverage', 'coveralls'];
  webpackConfig = require('./webpack/test-coverage.config');
} else if (process.env.TEST_COVERAGE === 'true') {
  // Local coverage report
  browsers = ['PhantomJS'];
  reporters = ['mocha', 'coverage'];
  webpackConfig = require('./webpack/test-coverage.config');
} else {
  // Local test
  browsers = ['PhantomJS'];
  reporters = ['mocha'];
  webpackConfig = require('./webpack/test.config');
}

module.exports = function(config) { // eslint-disable-line func-names
  config.set({

    basePath: '',

    frameworks: [
      'jasmine',
    ],

    files: [
      'node_modules/es5-shim/es5-shim.js',
      'test/index.js',
    ],

    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap'],
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    sauceLabs: {
      testName: 'Hairdresser Unit Tests',
    },

    customLaunchers: {
      ChromeTravisCI: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
      IE8: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE8',
      },
      IE9: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE9',
      },
      IE10: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE10',
      },
      IE11: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE11',
      },
    },

    captureTimeout: 60000,

    browserNoActivityTimeout: 45000,

    mochaReporter: {
      output: 'autowatch',
    },

    coverageReporter: {
      dir: '.coverage',
      reporters: [
        { type: 'html' },
        { type: 'lcovonly' },
        { type: 'text' },
      ],
    },

    webpackMiddleware: {
      noInfo: true,
    },

    webpack: webpackConfig,

    reporters: reporters,

    browsers: browsers,
  });
};
