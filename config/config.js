const path = require('path')

const resolve = {
  modules: ['node_modules', 'src'],
  extensions: ['.js', '.jsx', '.json', '.less', '.css'],
  alias: {
    '@': path.resolve(__dirname, '../src/'),
    component: path.resolve(__dirname, '../src/component/'),
    mydb: path.resolve(__dirname, '../src/util/db.js'),
    util: path.resolve(__dirname, '../src/util'),
  },
}

module.exports = {
  resolve,
}
