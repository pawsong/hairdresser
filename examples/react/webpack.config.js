var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/entry.js',

  output: {
    path: './build',
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style!css' },
    ],
  },

  resolve: {
    extensions: ['', '.js'],
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],

  dev: 'cheap-module-source-map',

  devServer: {
    open: true,
  },
};
