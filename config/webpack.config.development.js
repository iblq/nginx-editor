const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const dxMock = require('dx-mock')

const rules = require('./webpack.rules')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'main.js'
  },
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    modules: ['node_modules', 'src']
  },
  module: {
    rules: rules.concat([
      {
        test: /\.jsx?$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: p => {
          if (/dx-lib/.test(p)) {
            return false
          }

          return /node_modules/.test(p)
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: 'config/postcss.config.js'
              }
            }
          }
        ]
      },
      {
        test: /\.less$/,
        exclude: /(node_modules|antd|codemirror)/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: 'config/postcss.config.js'
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              relativeUrls: false,
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /antd\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: 'url-loader?limit=8192&name=image/[hash].[ext]'
      }
    ])
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new webpack.DefinePlugin({
      API_SERVER_PLACEHOLDER: JSON.stringify('')
    })
  ],
  devServer: {
    contentBase: [path.join(__dirname, '../build'), path.join(__dirname, '..')],
    hot: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    port: '3000',
    disableHostCheck: true,
    before(app) {
      dxMock(app, { root: path.join(__dirname, '../api') })
    }
  }
}
