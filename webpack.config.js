const path = require('path');

module.exports = {
  mode: 'development',
  entry: './chat.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './')
  },
  devServer: {
    compress: true,
    open: true,
    port: 9000
  }
};