import request from '@/utils/request'

export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data

  })
}

export function getUserInfo(token) {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}

export function logout() {

}
