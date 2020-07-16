import Vue from 'vue';
import Vuex from 'vuex';
import { getDangerTypes } from 'network/danger';
import { getUsers } from 'network/account';
import { getCompanys } from 'network/company'
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
        enterpriseLocation: [],

    },
    mutations: {
        getUserdata(state, payload) {
            console.log(state);
            const {
                id,
                username,
                token,
                role,
                companyID,
                industryName,
                accountName,
                password
            } = payload;
            state.userdata = {
                id,
                username,
                token,
                role,
                industryName,

            };
            localStorage.setItem('accountName', accountName); //
            localStorage.setItem('userName', username); //获取用户信息时， 同时存储部分数据 在  session 防止刷新丢失
            localStorage.setItem('password', password);//保存用md5 加密过的 密码，用于后面修改密码的验证
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
        changeMiss(state, value) {
            state.messageMiss = value;
        },
        getEnterpriseLocation(state, value) {
            state.enterpriseLocation = value;
        },

        //重置state
        clearState(state) {
            state.userdata = {};
            state.activePath = '';
            state.staffs = [];
            state.dangerTypes = [];
            state.messageMiss = true;
            state.enterpriseLocation = [];
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
        async reqEnterpriseLocation({ commit }) {
            const res = await getCompanys({ name: localStorage.getItem('enterpriseName'), limit: 9999, page: 1 });
            if (!res.flag) return console.log('企业信息地理位置失败');
            console.log(res);
            const { longitude, latitude } = res.enterprises[0];
            localStorage.setItem('longitude', longitude);
            localStorage.setItem('latitude', latitude);
            commit('getEnterpriseLocation', [longitude, latitude]);
        }
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
        enterpriseLocation(state) {
            return state.enterpriseLocation;
        }
    },
});
