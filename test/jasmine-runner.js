/* eslint no-var: 0, vars-on-top: 0 */

var Jasmine = require('jasmine');
var SpecReporter = require('jasmine-spec-reporter');
function noop() {}

var jrunner = new Jasmine();
jrunner.configureDefaultReporter({print: noop});    // remove default reporter logs
jasmine.getEnv().addReporter(new SpecReporter());   // add jasmine-spec-reporter
jrunner.loadConfig({
  'spec_dir': 'test',
  'spec_files': [
    '*.test.js',
  ],
  'helpers': [
    'support/setup.js',
  ],
});
jrunner.execute();
