import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getSession } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: "http://47.97.105.123:8080/", // api的base_url 外网
  // baseURL: "http://192.168.1.111:8082/", // api的base_url王超华
  //baseURL: "http://192.168.1.123:8088/", //api的base_url温明明
  timeout: 15000, // 请求超时时间
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  transformResponse: [function(data) {
    if (data) {
      data = JSON.parse(data);
    }
    return data;
  }],
})
// request拦截器
service.interceptors.request.use(config => { // 在发送请求之前做些什么
  if (store.getters.token) {
    config.headers['token'] = getSession(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // console.log(config);
  console.log(config);
  return config
}, error => { // 对请求错误做些什么
  debugger;
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})
// respone拦截器
service.interceptors.response.use( // 对响应数据做点什么
  response => {
    console.log(response.data);
    return response.data
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
