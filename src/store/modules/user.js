import { LoginByUsername, logout } from '@/api/login' //, GetUserInfo,  
import { getSession, setSession, removeSession } from '@/utils/auth'

const user = {
  state: {
    token: getSession(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  actions: {
    LoginByUsername({ commit, state }, userInfo) { // 登录、获取用户信息
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        LoginByUsername(username, userInfo.password).then(response => {
          const data = response.obj;
          setSession(data.token);
          // debugger;
          commit('SET_TOKEN', data.token);
          commit('SET_NAME', data.login_name)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          // commit('SET_ROLES', [])
          removeSession()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeSession()
        resolve()
      })
    }
  }
}

export default user
