/*
 * @Author: baolq
 * @Date: 2019-05-25 12:50:38
 * @Last Modified by:   baolq
 * @Last Modified time: 2019-05-25 12:50:38
 */
// 浏览器配置
const AUTOPREFIXER_BROWSERS = ['> 1%', 'last 2 versions']

module.exports = {
  plugins: [require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS })]
}
