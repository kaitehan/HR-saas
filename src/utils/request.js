import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
const timeOut = 120 // 定义超时时间
const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
})
// 请求拦截器
service.interceptors.request.use(config => {
  // config是请求配置信息
  if (store.getters.token) {
    if (CheckTimeOut()) {
      // 如果为true表示超时了
      // token没用了，因为超时了
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token 超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  //   要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, err => {
  Message.error(err.message) // 提示错误信息
  return Promise.reject(new Error(err.message)) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

// 是否超时
// 超时逻辑 当前时间 - 缓存中的时间 是否大于 时间戳
function CheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp()
  if ((currentTime - timeStamp) > timeOut) {
    return true
  } else {
    return false
  }
}
export default service
