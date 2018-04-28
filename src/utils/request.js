import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getSession } from '@/utils/auth'


// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000, // 请求超时时间
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  transformResponse: [function(data) {
    // debugger;
    // data = data ? JSON.parse(data) : '';
    return data;
  }],
})
// request拦截器
service.interceptors.request.use(config => { // 在发送请求之前做些什么
  if (store.getters.token) {
    config.headers['token'] = getSession(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // console.log(config.data);
  console.log(config);
  return config
}, error => { // 对请求错误做些什么
  console.log(error) // for debug
  Promise.reject(error)
})
// respone拦截器
service.interceptors.response.use( // 对响应数据做点什么
  response => {
    if (typeof response.data == "string") {
      response.data = JSON.parse(response.data);
    }
    if (typeof response.data.data == "string") {
      response.data.data = JSON.parse(response.data.data);
    }
    if (response.request.responseURL.indexOf("searchspflbysplx.do") !== -1) {
      return response.data
    }
    // console.log(response);
    console.log(response.data);
    return response.data.data
  },
  error => { // 对响应错误做点什么
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
