const path = require('path');

const ENTRY = path.join(__dirname, 'src', 'website', 'index.jsx');
const OUTPUT = {path: path.join(__dirname, 'src', 'website'), filename: 'bundle.js'};

module.exports = {
  entry: ENTRY,
  output: OUTPUT,
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
          cacheDirectory: true
        }
      }
    }]
  }
};
