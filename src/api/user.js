import request from '@/utils/request'

export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data

  })
}

// 获取用户资料接口
export function getUserInfo() {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}

// 根据用户id获取用户的详情
export function setUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}

export function logout() {

}
