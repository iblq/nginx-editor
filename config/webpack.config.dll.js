const path = require('path')
const moment = require('moment')
const webpack = require('webpack')
const dependencies = require('../package.json').dependencies

module.exports = {
  mode: 'production',
  entry: {
    vendor: Object.keys(dependencies).filter(name => name !== 'bundle-loader')
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../tmp', 'manifest.json'),
      name: '[name]'
    }),
    new webpack.DefinePlugin({}),
    new webpack.BannerPlugin(`${moment().format('YYYY-MM-DD HH:mm:ss')}`)
  ]
}
