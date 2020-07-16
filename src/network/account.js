import { errFun, ins } from './index';
import axios from 'axios'
import qs from 'qs';
//登录函数
export function logReq(account, password) {
    return ins
        .post(
            '/login',
            qs.stringify({
                account,
                password,
            })
        )
        .catch(errFun);
}
//
//用户注册/添加新用户
export function addAccount({
    account,
    password,
    name,
    permission,
    enterpriseName,
    industryName,
    IMEI,
    Email,
    TEL,
    position,
}) {
    return ins
        .post(
            '/register',
            qs.stringify({
                account,
                password,
                name,
                permission,
                enterpriseName,
                industryName,
                IMEI,
                Email,
                TEL,
                position,
            })
        )
        .catch(errFun);
}

//验证 用户的 登陆状态：token 是否有效
export function checkToken() {
    return ins.get('/isLogin').catch(errFun);
}

//查询 用户
export function getUsers({
    name,
    permission,
    limit,
    page,
    position,
    enterpriseName,
    industryName,
}) {
    return ins
        .get('/user/query', {
            params: {
                name: name || null,
                permission: permission || null,
                enterpriseName: enterpriseName || null,
                industryName: industryName || null,
                limit,
                offset: (page - 1) * limit,
                position: position || null,
            },
        })
        .catch(errFun);
}

// 修改 用户基础信息
export function updateAccount({
    name,
    permission,
    TEL,
    Email,
    address,
    position,
    sex
}) {
    return ins
        .post(
            '/user/update',
            qs.stringify({
                name,
                permission,
                TEL,
                Email,
                address,
                position,
                enterpriseName: localStorage.getItem('enterpriseName'),
                address,
                sex
            })
        )
        .catch(errFun);
}

//更新用户 头像
export function updateAvatar(avatar) {
    const instance = axios.create({
        baseURL: 'http://139.224.68.137:8081',
        timeout: 5000,
        headers: {
            token: localStorage.getItem('token')
        }
    });
    instance.interceptors.response.use((res) => {
        return { ...res.data, status: res.status };
    });
    return instance.post('/user/avatarUpload', avatar)
        .catch(errFun)

};

export function deleteUser(enterpriseName, name) {
    return ins
        .post(
            '/user/delete',
            qs.stringify({
                enterpriseName,
                name,
            })
        )
        .catch(errFun);
}

//更改密码
export function updatePass({
    userID, beforePassword, afterPassword
}) {

    return ins.post('/user/updatePassword', qs.stringify({
        userID, beforePassword,
        afterPassword
    }))
        .catch(errFun)
}
