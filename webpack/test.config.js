/* eslint no-var: 0 */
var _ = require('lodash');
var webpack = require('webpack');

var baseConfig = require('./base.config');

module.exports = _.merge({}, baseConfig, {

  // Temporary workaround (https://github.com/webpack/webpack/issues/300)
  entry: {
    Hairdresser: './test/Hairdresser',
  },

  output: {
    pathinfo: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('test'),
    }),
  ],

  devtool: 'eval',
});
