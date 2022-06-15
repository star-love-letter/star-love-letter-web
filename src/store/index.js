import { createStore } from 'vuex'

export default createStore({
  state: {
    isLogin: false,
  },
  getters: {
  },
  mutations: {
    changeLogin(state, isLogin) {
      state.isLogin = isLogin
    }
  },
  actions: {
  },
  modules: {
  }
})
