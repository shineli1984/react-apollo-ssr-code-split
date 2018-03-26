const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')
const StatsPlugin = require('stats-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const { stringified } = require('../env')
const DashboardPlugin = require('webpack-dashboard/plugin')

module.exports = {
  name: 'client',
  target: 'web',
  // devtool: 'source-map',
  devtool: 'eval',
  entry: [
    'babel-polyfill',
    'fetch-everywhere',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false',
    'react-hot-loader/patch',
    path.resolve(__dirname, '../../src/index.js')
  ],
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, '../../buildClient'),
    publicPath: '/static/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractCssChunks.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9' // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009'
                  })
                ]
              }
            }
          ]
        })
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.css']
  },
  plugins: [
    new StatsPlugin('stats.json'),
    new webpack.IgnorePlugin(/test|__snapshots/),
    new WriteFilePlugin(), // used so you can see what chunks are produced in dev
    new ExtractCssChunks(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].js',
      minChunks: Infinity
    }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin(stringified),
    new AutoDllPlugin({
      context: path.join(__dirname, '..'),
      filename: '[name].js',
      entry: {
        vendor: [
          'react',
          'react-dom',
          'react-redux',
          'redux',
          'recompose',
          'ramda',
          'history/createBrowserHistory',
          'transition-group',
          'redux-first-router',
          'redux-first-router-link',
          'fetch-everywhere',
          'babel-polyfill',
          'redux-devtools-extension/logOnlyInProduction',
          'react-apollo',
          'apollo-client',
          'apollo-link-http',
          'apollo-cache-inmemory',
          'apollo-link-state'
        ]
      }
    }),
    new DashboardPlugin()
  ]
}
