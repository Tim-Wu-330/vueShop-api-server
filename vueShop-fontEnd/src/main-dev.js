Vue.config.productionTip = false

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import axios from 'axios'
// 导入字体图标
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器quillEditor相关依赖
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

// 导入NProgress包和对应的JS/CSS文件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 只要发起了ajax请求就会触发request拦截器,请求响应完毕会调用response拦截器
// 在 request拦截器中,显示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须返回config
  return config
})

// 请求响应完毕后在response拦截器中,隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

// 配置完axios对象后将它挂载到原型上
Vue.prototype.$http = axios

// 将导入的TableTree对象注册为table-tree全局组件
Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
 
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
