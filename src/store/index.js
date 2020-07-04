import Vue from 'vue';
import Vuex from 'vuex';
import { getDangerTypes } from 'network/danger';
import { getUsers } from 'network/account';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userdata: {
            //用户信息
        },
        activePath: '', //动态路由信息
        staffs: [], //巡查人员
        dangerTypes: [], //风险类型
        messageMiss: true,//是否有消息错过
    },
    mutations: {
        getUserdata(state, payload) {
            const {
                id,
                username,
                token,
                role,
                companyID,
                industryName,
            } = payload;
            state.userdata = {
                id,
                username,
                token,
                role,
                industryName,
            };
            localStorage.setItem('accountName', username); //获取用户信息时， 同时存储部分数据 在  session 防止刷新丢失
            sessionStorage.setItem('companyID', companyID);
            localStorage.setItem('Role', role); //本地存储 role 用于 下次自动登录
        },
        changeActivePath(state, path) {
            state.activePath = path;
            sessionStorage.setItem('activePath', path);
        },
        getStaffs(state, staffs) {
            state.staffs = staffs;
        },
        getDangerTypes(state, dangerTypes) {
            state.dangerTypes = dangerTypes;
        },
        changeMiss(state,value) {
            state.messageMiss = value;
        }
    },
    //异步的更改
    actions: {
        //第一次记载页面/页面刷新 后 主动获取 风险类型
        async reqDangerTypes({ commit }) {
            return new Promise(async (resolve, reject) => {
                const res = await getDangerTypes({
                    page: 1,
                    limit: 9999,
                });
                if (!res.flag) {
                    console.log('隐患类型获取失败');
                    return reject('failed');
                }
                commit('getDangerTypes', res.riskTypes);
                return resolve('success');
            });
        },
        //请求获取 staffs  巡查人员
        async reqStaffs({ commit }) {
            const res = await getUsers({ permission: 3, limit: 9999, page: 1 });
            if (!res.flag) return console.log('终端人员获取失败');
            commit('getStaffs', res.users);
        },
    },
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
        },
    },
});
