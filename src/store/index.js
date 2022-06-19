import { createStore } from 'vuex'

export default createStore({
  state: {
    isLogin: false,
    userInfo: {},
  },
  getters: {
  },
  mutations: {
    changeLogin(state, isLogin) {
      state.isLogin = isLogin
    },
    getUserInfo(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
  },
  modules: {
  }
})
