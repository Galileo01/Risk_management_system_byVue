import { ins, errFun } from './index';
import qs from 'qs';
//获取 某个设备的检查项
export function getItemByDevice(deviceID) {
    return ins
        .get('/MT/CheckItem/query', {
            params: {
                deviceID,
            },
        })
        .catch(errFun);
}

export function getItems(info) {
    if (info <= 4 && info >= 1) info = parseInt(info); //如果 输入的是等级 就转换为 数字
    console.log(typeof info);

    return ins
        .get('/checkItem/query', {
            params: {
                info,
                limit: 9999,
                offset: 0,
            },
        })
        .catch(errFun);
}
//添加检查项
export function addItem({ type, name, standard, riskTypeName, level }) {
    return ins
        .post(
            '/checkItem/insert',
            qs.stringify({ type, name, standard, riskTypeName, level })
        )
        .catch(errFun);
}
//更新 检查项 信息
export function updateItem({
    checkItemID,
    type,
    afterName,
    standard,
    riskTypeName,
    level,
}) {
    return ins
        .post(
            '/checkItem/update',
            qs.stringify({
                checkItemID,
                type,
                afterName,
                standard,
                riskTypeName,
                level,
            })
        )
        .catch(errFun);
}
//删除检查项

export function removeItem(name) {
    return ins.post('/checkItem/delete', qs.stringify({ name }))
    .catch(errFun)
}
