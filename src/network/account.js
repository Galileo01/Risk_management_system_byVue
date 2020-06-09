import { errFun, ins } from './index';
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

// 修改 用户信息
export function updateAccount({
    name,
    permission,
    TEL,
    Email,
    address,
    position,
    enterpriseName,
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
                enterpriseName,
                address,
            })
        )
        .catch(errFun);
}

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
