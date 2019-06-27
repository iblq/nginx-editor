/**
 * 入口
 */
import 'babel-polyfill'
import ReactDOM from 'react-dom'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'

import App from './app'

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <App />
  </LocaleProvider>,
  document.getElementById('app'),
)
