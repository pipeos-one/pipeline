const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'pipesource.min.js',
    library: 'pipesource',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: 'babel-loader'
      }
    ]
  }
};
