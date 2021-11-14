// 做一个混入对象
import store from '@/store'
export default {
  // 混入对象是组件的选项对象
  methods: {
    // 检查权限
    checkPermission(key) {
      // 去用户信息中找  points 中有没有 key
      const { userInfo } = store.state.user
      if (userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
