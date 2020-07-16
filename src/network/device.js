import axios from 'axios'
import { ins, errFun } from './index';
import qs from 'qs';
//查询 所有设备册
export function GetDeviceMap(page, limit) {
    return ins
        .get('/deviceMap/query', {
            params: {
                limit,
                offset: (page - 1) * limit,
            },
        })
        .catch(errFun);
}

//查询 某设备册下的  所有设备
export function getDeviceByMap({ deviceMapName, offset, limit }) {
    console.log(deviceMapName);

    return ins
        .get('/deviceMap/queryOwner', {
            params: {
                deviceMapName,
                limit,
                offset,
            },
        })
        .catch(errFun);
}

export function addDeviceMap(name) {
    return ins.post('/deviceMap/insert', qs.stringify({ name })).catch(errFun);
}

export function deleteDeviceMap(name) {
    return ins.post('/deviceMap/delete', qs.stringify({ name })).catch(errFun);
}
export function updateDeviceMap(name, afterName) {
    return ins
        .post('/deviceMap/update', qs.stringify({ name, afterName }))
        .catch(errFun);
}

export function allocateDeviceMap(deviceMapName, deviceNames) {
    return ins
        .post(
            '/deviceMap/allocation',
            qs.stringify({ deviceMapName, deviceNames })
        )
        .catch(errFun);
}

//设备相关  函数
export function getDevice({ state, label, name, page, limit }) {
    page = page || 1;
    limit = limit || 9999;
    return ins
        .get('/device/query', {
            params: {
                enterpriseName: localStorage.getItem('enterpriseName'),
                state,
                label,
                name,
                offset: (page - 1) * limit,
                limit,
            },
        })
        .catch(errFun);
}

//设置 设备关联的 检查项
export function setDevicePatrolItem(deviceName, checkItems) {
    return ins
        .post(
            '/checkItem_device/insert',
            qs.stringify({ deviceName, checkItems })
        )
        .catch(errFun);
}
//添加设备
export function addDevice({
    lable,
    type,
    address,
    longitude,
    latitude,
    name,
    RFID,
}) {
    return ins
        .post(
            '/device/insert',
            qs.stringify({
                lable,
                type,
                address,
                longitude,
                latitude,
                name,
                RFID,
            })
        )
        .catch(errFun);
}
//删除设备
export function deleteDevice(name) {
    return ins
        .post(
            '/device/delete',
            qs.stringify({
                name,
            })
        )
        .catch(errFun);
}
//更新 设备
export function updateDevice({
    lable,
    type,
    address,
    longitude,
    latitude,
    name,
    RFID,
}) {
    return ins
        .post(
            '/device/update',
            qs.stringify({
                lable,
                type,
                address,
                longitude,
                latitude,
                name,
                RFID,
            })
        )
        .catch(errFun);
}

//设置设备的图文导航
export function uploadNavgation(formData) {
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
    return instance.post('/device/navigationUpdate', formData).catch(errFun)

}
//删除设备导航
export function deleteNavigation(deviceID, navigationNO) {
    return ins.post('/device/navigationDelete', qs.stringify({
        deviceID, navigationNO
    })).catch(errFun)
}