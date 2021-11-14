import { login, getUserInfo, setUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { resetRouter } from '@/router'

// 状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {}// 这里定义一个空对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
}

// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
    setToken(token) // vuex和 缓存数据的同步
  },
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  setUserInfo(state, data) {
    // 更新对象
    state.userInfo = { ...data }
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

// 执行异步
const actions = {
  // 定义login action  也需要参数 调用action时 传递过来的参数
  async login(context, data) {
    // 经过响应拦截器的处理之后 这里的res实际上就是 token
    const res = await login(data) // 实际上就是一个promise  res就是执行的结果
    // axios默认给数据加了一层data
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', res)
    // 写入时间戳
    setTimeStamp() // 将当前的最新时间写入缓存
  },
  async getUserInfo(context) {
    const res = await getUserInfo()
    // 获取用户详情
    const baseInfo = await setUserDetailById(res.userId)

    context.commit('setUserInfo', { ...res, ...baseInfo })// 提交到mutations
    return res // 这里为什么要返回呢 这里是给我们后期做权限的时候 埋下的伏笔
  },
  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户信息
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 重新设置权限模块下路由为初始状态
    // Vuex子模块 怎么调用 子模块的mutation ,都没有加锁（命名空间）的情况下  可以随意调用
    // 不加命名空间的情况下的 所有mutation和action都是挂载全局上的  所以可以直接调用
    // 但是加了命名空间的子模块 怎么调用另一个加了命名空间的子模块呢
    // 加了命名空间的子模块 actions 中的  context 指的不是全局的 context  而是其本身
    // 解决方法 ： context.commit()中有三个参数
    // 第一个参数 ：mutation名称
    // 第二个参数： 载荷payload
    // 第三个参数： {root:true} 值为 true 表示调用根级别的 mutations 或者 actions
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
