/* eslint no-var: 0 */
var _ = require('lodash');
var path = require('path');
var testConfig = require('./test.config');

const paths = {
  SRC: path.resolve('src'),
  TEST: path.resolve('test'),
};

module.exports = _.extend({}, testConfig, {
  module: {
    loaders: [
      {
        test: /\.js/,
        include: paths.TEST,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
    preLoaders: [
      {
        test: /\.js/,
        loader: 'isparta',
        include: paths.SRC,
        exclude: /node_modules/,
      },
    ],
  },
});
