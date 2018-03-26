const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const path = require('path')

module.exports = {
  entry: {
    server: ['babel-polyfill', 'fetch-everywhere', './server.js']
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'css-loader/locals',
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
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/test|__snapshots__/),

    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.css']
  }
}
