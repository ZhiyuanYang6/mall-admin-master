import router from './router'
import store from './store'
import { Message } from 'element-ui'
import { getSession, removeToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => { //全局前置守卫
  if (getSession()) { //验证登陆权限通过，进入主界面
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else { //验证不通过
    if (whiteList.indexOf(to.path) !== -1) { //如果是登陆界面不重定向
      next();
    } else {
      next('/login');
    }
  }
})
