import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userdata: {
            //用户信息
        },
        activePath: '' //动态路由信息
    },
    mutations: {
        getUserdata(state, payload) {
            const { id, username, token, role ,companyID} = payload;
            state.userdata = {
                id,
                username,
                token,
                role
            };      
            localStorage.setItem('accountName', username);//获取用户信息时， 同时存储部分数据 在  session 防止刷新丢失
            sessionStorage.setItem('companyID',companyID);
            localStorage.setItem('Role', role); //本地存储 role 用于 下次自动登录
        },
        changeActivePath(state, path) {
            state.activePath = path;
            sessionStorage.setItem('activePath', path);
        }
    },
    actions: {},
    modules: {},
    getters: {
        UserRole(state) {
            return state.userdata.role || localStorage.getItem('Role');
        },
        userdata(state) {
            return state.userdata;
        },
        activePath(state) {
            return state.activePath;
        },
        accountName(state) {
            return (
                state.userdata.accountName ||
                localStorage.getItem('accountName')
            );
        }
    }
});
