
// 专门处理路由 的模块
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 一开始  肯定拥有静态路由的权限
  // 路由表  表示 当前用户所拥有的所有路由的数组
  routes: constantRoutes
}

const mutations = {
  // 定义修改路由  routes  的  mutations
  // payload 即 newRoutes 认为是我们登录成功需要添加的新路由
  setRoutes(state, newRortes) {
    // state.routes = [...constantRoutes, ...newRortes]  不能在当前路由表的基础上增加
    state.routes = [...constantRoutes, ...newRortes] // 每次都在静态路由的基础上去添加新路由权限
  }
}

const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户所拥有的的菜单权限
  // name:["setting","permission"]
  // asyncRoutes 是所有的动态路由
  // asyncRoutes  [{},{}]
  filterRoute(context, menus) {
    const routes = []
    // 筛选出  动态路由中和menus中能够对应上的路由
    menus.forEach(key => {
      // key就是标识
      // asyncRoutes 中 有没有对象中的name属性等于key  如果没有就说明没有权限  如果找到了就筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组  可能是空  也可能是有数据的
    })
    // 得到的routes是所有模块中满足要求的动态路由
    context.commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes // 这里的  return  是给vue-router的addRoutes使用的  state数据 是用来显示左侧菜单使用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
