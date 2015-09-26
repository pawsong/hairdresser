/* eslint no-var: 0 */

module.exports = {
  entry: {
    Hairdresser: './src/Hairdresser.js',
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
    ],
  },

  output: {
    path: './dist',
    filename: '[name].js',
    library: 'Hairdresser',
    libraryTarget: 'umd',
  },

  resolve: {
    extensions: ['', '.js'],
  },
};
