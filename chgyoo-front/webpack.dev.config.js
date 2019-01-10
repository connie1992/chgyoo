const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const config = require('./src/config');
const path = require('path');

const env = require('./src/config/dev.env');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = merge(webpackBaseConfig, {
  mode: 'development',
  output: {
    publicPath: config.dev.assetsPublicPath,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: config.dev.host,
    port: config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    // 控制台打印编译过程日志
    quiet: false,
    watchOptions: {
      poll: config.dev.poll
    }
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/template/index.ejs',
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'bms',
      path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory
    })
  ]
});
