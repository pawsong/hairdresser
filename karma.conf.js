var coveralls = process.env.TEST_COVERALLS === 'true';
var coverage = coveralls || process.env.TEST_COVERAGE === 'true';

var browsers = ['PhantomJS'];
var transform = [];
var reporters = ['mocha'];

if (coveralls) {
  browsers = ['ChromeTravisCI'];
}

if (coverage) {
  transform = [
    ['browserify-istanbul', {
      ignore: ['**/node_modules/**', '**/test/**'],
      defaultIgnore: true,
      instrumenterConfig: { embedSource: true },
    }],
  ];

  if (coveralls) {
    reporters = ['mocha', 'coverage', 'remap-coverage', 'coveralls'];
  } else {
    reporters = ['mocha', 'coverage', 'remap-coverage'];
  }
}

module.exports = function(config) {
  config.set({
    basePath: './',

    frameworks: ['browserify', 'jasmine'],

    files: [
      'node_modules/es5-shim/es5-shim.js',
      'src/**/*.ts',
      'test/**/*.ts',
    ],

    preprocessors: {
      '**/*.ts': ['browserify'],
    },

    browserify: {
      debug: true,
      plugin: [['tsify', require('./compilerOptions')]],
      transform: transform,
    },

    browsers: browsers,

    reporters: reporters,

    mochaReporter: {
      output: 'autowatch',
    },

    coverageReporter: { type: 'in-memory' },

    // define where to save final remaped coverage reports
    remapCoverageReporter: {
      'text-summary': null, // to show summary in console
      html: './coverage/html',
      cobertura: './coverage/cobertura.xml'
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
  });
};
