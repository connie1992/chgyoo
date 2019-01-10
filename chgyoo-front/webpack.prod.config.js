const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const config = require('./src/config');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 引入环境信息文件
const env = require('./src/config/prod.env');

function resolve(dir) {
  return path.join(__dirname, dir);
}

function assetsPath (_path) {
  const assetsSubDirectory = config.build.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
}

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  output: {
    publicPath: config.build.assetsPublicPath,
    filename: assetsPath('js/[name].[hash].js'),
    chunkFilename: assetsPath('js/[name].[hash].js')
  },
  optimization: {
    /*提取公共类和第三方库*/
    splitChunks: {
      cacheGroups: { // 这里开始设置缓存的 chunks
        commons: {
          chunks: 'initial', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
          minSize: 0, // 最小尺寸，默认0,
          minChunks: 2, // 最小 chunk ，默认1
          maxInitialRequests: 5 // 最大初始化请求书，默认1
        },
        vendor: {
          test: /node_modules/, // 正则规则验证，如果符合就提取 chunk
          chunks: 'initial', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
          name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
          priority: 10, // 缓存组优先级
          enforce: true
        }
      }
    },
    runtimeChunk: true
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 打包CSS文件到css文件夹，方便查看
    new MiniCssExtractPlugin({
      filename: assetsPath('css/[name].[hash].css'),
      chunkFilename: assetsPath('css/[name].[hash].css')
    }),
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: './src/template/index.ejs',
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'bms',
      path: config.build.assetsSubDirectory
    }),
    new CleanWebpackPlugin(
      ['dist'],
      {
        root: path.resolve(__dirname, './'), //根目录
        verbose:  true //开启在控制台输出信息
      }
    )
  ]
});
