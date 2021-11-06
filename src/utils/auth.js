import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const TimeKey = 'hrsaas-timestamp-key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export function getTimeStamp(time) {
  return Cookies.get(TimeKey, time)
}

// 设置时间戳
export function setTimeStamp() {
  return Cookies.set(TimeKey, Date.now())
}
