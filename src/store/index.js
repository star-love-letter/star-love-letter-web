import { createStore } from 'vuex'
import { getView } from '@/apis/view.js';


export default createStore({
  state: {
    isLogin: false,
    userInfo: {},
    viewData: {}
  },
  getters: {
  },
  mutations: {
    changeLogin(state, isLogin) {
      state.isLogin = isLogin
    },
    getUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    getView(state,data){
      state.viewData = data
    }
  },
  actions: {
    getView(context){
      getView().then(res => {
        context.commit('getView', res.data)
      });
    }
  },
  modules: {
  }
})
