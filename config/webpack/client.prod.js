const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin')
const { stringified } = require('../env')

module.exports = {
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    'fetch-everywhere',
    path.resolve(__dirname, '../../src/index.js')
  ],
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
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
    new ExtractCssChunks(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].[chunkhash].js',
      minChunks: Infinity
    }),
    new webpack.DefinePlugin(stringified),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        screw_ie8: true,
        comments: false
      },
      sourceMap: true
    }),
    new webpack.HashedModuleIdsPlugin(), // not needed for strategy to work (just good practice)
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
      },
      plugins: [
        new webpack.DefinePlugin(stringified),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true,
            warnings: false
          },
          mangle: {
            screw_ie8: true
          },
          output: {
            screw_ie8: true,
            comments: false
          },
          sourceMap: true
        })
      ]
    })
  ]
}
