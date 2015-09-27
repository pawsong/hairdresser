/* eslint no-var: 0, vars-on-top: 0 */

var webpackConfig = require('./webpack/test.config.js');
var isCI = process.env.CONTINUOUS_INTEGRATION === 'true';
var runCoverage = process.env.COVERAGE === 'true' || isCI;
var isWin = /^win/.test(process.platform);
var defaultBrowsers = isWin ? ['IE8', 'IE9', 'IE10', 'IE11'] : ['Chrome'];
var devBrowsers = process.env.PHANTOM ? ['PhantomJS'] : defaultBrowsers;

var preprocessors = ['webpack', 'sourcemap'];
var reporters = ['mocha'];

if (runCoverage) {
  webpackConfig = require('./webpack/test-coverage.config');
  reporters.push('coverage');

  if (isCI) {
    reporters.push('coveralls');
  }
}

module.exports = function(config) { // eslint-disable-line func-names
  config.set({

    basePath: '',

    frameworks: [
      'jasmine',
    ],

    files: [
      'node_modules/es5-shim/es5-shim.js',
      'node_modules/es5-shim/es5-sham.js',
      'test/index.js',
    ],

    preprocessors: {
      'test/index.js': preprocessors,
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: isCI,
    },

    reporters: reporters,

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

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: isCI ? ['ChromeTravisCI'] : devBrowsers,

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

    singleRun: isCI,
  });
};
