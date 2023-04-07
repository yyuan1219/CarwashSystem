import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入表格树
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import moment from 'moment'

// 导入NProgress, 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import JsonExcel from 'vue-json-excel'

import axios from 'axios'
// 配置请求根路径
// 本机地址

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  NProgress.start()
  // console.log(config)
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// response 拦截器中,  隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

// 挂在到Vue实例，后面可通过this调用F
Vue.prototype.$http = axios

// 注册导出组件
Vue.component('download-excel', JsonExcel)
Vue.config.productionTip = false
// 组件全局注册 表格树
Vue.component('tree-table', TreeTable)
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)
Vue.filter('fmtdate',(v)=>{
  v=v*1000
return moment(v).format('YYYY-MM-DD')
})
Vue.filter('fmtdates',(v)=>{
return moment(v).format('YYYY-MM-DD')
})
// Vue.filter('dataFormat', function (originVal) {
//   const dt = new Date(originVal)

//   const y = dt.getFullYear()
//   const m = (dt.getMonth() + 1 + '').padStart(2, '0')
//   const d = (dt.getDate() + '').padStart(2, '0')

//   const hh = (dt.getHours() + '').padStart(2, '0')
//   const mm = (dt.getMinutes() + '').padStart(2, '0')
//   const ss = (dt.getSeconds() + '').padStart(2, '0')
//   // yyyy-mm-dd hh:mm:ss
//   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
// })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
