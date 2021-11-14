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
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  nprogress.start()
  if (store.getters.token) {
    // 只有有token的情况下才需要获取资料
    // 有token
    if (to.path === '/login') {
      // 如果要访问的是登录页
      next('/') // 跳转到主页
    } else {
      // 只有放行的时候才去获取用户资料
      // 如果当前vuex中有数据了  不需要重复获取  如果没有数据  才需要获取
      if (!store.getters.userId) {
        // 如果没有id 才表示当前用户资料没有获取过
        const { roles } = await store.dispatch('user/getUserInfo')
        // 如果说后续  需要根据用户资料获取数据的话  这里必须改成  同步

        // 筛选用户可用的路由
        const routes = await store.dispatch('permission/filterRoute', roles.menus)
        // routes 是筛选得到的路由
        // 将 动态路由 加入到 路由表中  默认的路由表  只有静态路由 没有动态路由
        // addRoutes
        // 404页面必须放到最后
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由表
        // 添加动态路由之后
        next(to.path) // 相当于多做一次跳转
        // 添加动态路由之后 即调用addRoutes之后 可能会导致 程序无法跳转 必须强制重新跳转一次
      } else {
        next()
      }
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
