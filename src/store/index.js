import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userdata:{ //用户信息
      accountID: 1,
                    industryID: 1,
                    companyID: 1,
                    accountName: 'aaa',
                    name:'wws',
                    mobile: '158235674908',
                    email: '1354541676@',
                    rightLevel: 66,
                    sex:'male',
                    position:'主管',
                    address:''
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
    },
    accountName(state){
      return state.userdata.accountName;
    }

  }
  
})
