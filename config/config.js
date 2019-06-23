const path = require('path')

const resolve = {
  modules: ['node_modules', 'src'],
  extensions: ['.js', '.jsx', '.json', '.less', '.css'],
  alias: {
    '@': path.resolve(__dirname, '../src/'),
    component: path.resolve(__dirname, '../src/component/'),
    superInject: path.resolve(__dirname, '../src/util/superInject.js'),
  },
}

module.exports = {
  resolve,
}
