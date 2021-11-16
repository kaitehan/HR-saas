import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

// 导入自定义组件
import Components from '@/components'

import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives'

import * as filters from '@/filters'

import i18n from '@/lang'

// 引入混入方法
import CheckPermission from '@/mixin/checkPermission'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  // element 本身支持  i18n 的处理
  // 此时 i18n 就会根据当前的 locale 属性去寻找对应的显示内容
  i18n: (key, value) => i18n.t(key) // t方法 会去对应的语言包里寻找对应的内容
  // 改变 locale 的值 可以更换页面语言
})

// 注册自定义组件
Vue.use(Components)

// 全局混入检查对象
Vue.mixin(CheckPermission) // 表示所有组件都有了一个检查的方法

// 注册自定义指令
// Object.keys(对象)方法用于将对象的属性装入一个数组中并返回该数组
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  // 第一个参数   指令名称
  // 第二个参数   配置对象
  Vue.directive(key, directives[key])
})

// 注册自定义过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
