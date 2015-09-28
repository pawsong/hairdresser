/* eslint no-var: 0, vars-on-top: 0 */
var browsers;
var reporters;
var webpackConfig;

if (process.env.TEST_SAUCELABS === 'true') {
  // Sauce Labs report
  browsers = [
    'slIE8',
    'slIE9',
    'slIE10',
    'slIE11',
    'slChrome',
    'slFireFox',
    'slIphone',
    'slAndroid',
    'slSafari',
  ];
  reporters = ['mocha', 'saucelabs'];
  webpackConfig = require('./webpack/test.config');
} else if (process.env.TEST_COVERALLS === 'true') {
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
      slIE8: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '8',
      },
      slIE9: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '9',
      },
      slIE10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8',
        version: '10',
      },
      slIE11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11',
      },
      slChrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 7',
        version: '37',
      },
      slFireFox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 7',
        version: '32',
      },
      slIphone: {
        base: 'SauceLabs',
        browserName: 'iphone',
        platform: 'OS X 10.9',
        version: '7.1',
      },
      slAndroid: {
        base: 'SauceLabs',
        browserName: 'android',
        platform: 'Linux',
        version: '4.4',
      },
      slSafari: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.9',
        version: '7',
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
