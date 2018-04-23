import request from '@/utils/request'

export function LoginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: 'mall/login.do',
    method: 'post',
    data
  });
}

export function logout() {
  const data = {}
  return request({
    url: 'mall/logout.do',
    method: 'post',
    data
  })
}

// export function getUserInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
