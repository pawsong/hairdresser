/* eslint no-var: 0 */
var webpack = require('webpack');
var _ = require('lodash');
var baseConfig = require('./base.config');

module.exports = _.merge({}, baseConfig, {
  output: {
    filename: '[name].min.js',
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false,
      },
    }),
  ],

  devtool: 'source-map',
});
