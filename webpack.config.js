const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src', 'website', 'index.jsx'),
  output: {
    path: path.join(__dirname, 'src', 'website', 'public'),
    filename: 'bundle.js',
    publicPath: '/public'
  },
  node: {
    fs: 'empty'
  },
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
    }, {
      test: /\.s?css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'sass-loader'
      }, {
        loader: 'import-glob-loader'
      }]
    }, {
      test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
          name: '/fonts/[name].[ext]'
        }
      }]
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '/fonts/[name].[ext]'
        }
      }]
    }]
  }
};
