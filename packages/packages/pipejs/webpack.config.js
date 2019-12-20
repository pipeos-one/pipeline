const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'pipejs.min.js',
    library: 'pipejs',
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
