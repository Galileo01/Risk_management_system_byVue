import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userdata:{ //用户信息
    },
    activePath:'' //动态路由信息
  },
  mutations: {
    getUserdata(state,payload)
    {
      const {id,username,token,role}=payload;
      state.userdata={
        id,username,token,role
      }
    },
    changeActivePath(state,path)
    {
      state.activePath=path;
    }
  },
  actions: {
  },
  modules: {
  },
  getters:{
    UserRole(state){
      return state.userdata.role;
    },
    userdata(state){
      return state.userdata;
    },
    activePath(state)
    {
      return state.activePath;
    }

  }
  
})
