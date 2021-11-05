// 权限拦截在路由跳转中执行  导航守卫
import router from '@/router'
import store from '@/store' // 引入vuex 实例
import nprogress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/404']
// 不需要导出 因为只需要让代码执行即可
// 前置守卫
// next 是前置守卫必须要执行的钩子函数  next 必须执行 如果不执行 页面就不执行了
// next() 放行
// next(false) 跳转终止
// next(地址)  跳转到某个地址
router.beforeEach((to, from, next) => {
  // 开启进度条
  nprogress.start()
  if (store.getters.token) {
    // 有token
    if (to.path === '/login') {
      next('/') // 跳转到主页
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('login')
    }
  }
  // 手动强制关闭进度条，解决手动切换地址时，进度条不关闭问题
  nprogress.done()
})

// 后置守卫
router.afterEach(() => {
  // 关闭进度条
  nprogress.done()
}
)
