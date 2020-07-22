import { ins, errFun } from './index';
import qs from 'qs';
//风险类型

export function getDangerTypes({ name, note, limit, page }) {
    return ins
        .get('/riskType/query', {
            params: {
                name,
                note,
                limit,
                offset: (page - 1) * limit,
            },
        })
        .catch(errFun);
}

export function addDangerType({ name, note, resolveStandard }) {
    return ins
        .post(
            '/riskType/insert',
            qs.stringify({
                name,
                note,
                resolveStandard,
            })
        )
        .catch(errFun);
}

export function deleteDangerType(name) {
    return ins
        .post(
            '/riskType/delete',
            qs.stringify({
                name,
            })
        )
        .catch(errFun);
}

export function updateDangerType({
    name,
    note,
    riskTypeID,
    resolveStandard,
    afterName,
}) {
    console.log(name, afterName);

    return ins
        .post(
            '/riskType/update',
            qs.stringify({ name, note, afterName, resolveStandard, riskTypeID })
        )
        .catch(errFun);
}

//风险信息
//获取风险
export function getDangers({
    taskName,
    deviceName,
    level,
    repairedFlag,
    page,
    limit,
    riskTypeName,
    riskID
}) {
    return ins.get('/risk/query', {
        params: {
            enterpriseName: localStorage.getItem('enterpriseName'),
            taskName: taskName || null, //去掉 空字符串
            deviceName: deviceName || null,
            level: level || null,
            repairedFlag,
            offset: (page - 1) * limit,
            limit,
            riskTypeName: riskTypeName || null,
            riskID: riskID || null
        },
    });
}

//处理风险
// export function dealDanger({ taskName, deviceName, riskID }) {
//     return ins
//         .post(
//             '/risk/update',
//             qs.stringify({
//                 enterpriseName: localStorage.getItem('enterpriseName'),
//                 taskName,
//                 riskID,
//                 deviceName,
//                 state: '1', //状态改为 已处理
//             })
//         )
//         .catch(errFun);
// }
export function dealDanger( repairNote, repairStaff, riskID ) {
    return ins.post('/risk/repairUpdate', qs.stringify({ repairNote, repairStaff, riskID })).catch(errFun)
}

//根据 riskID 获取 设备信息
export function getDeviceByriskID(riskID) {
    return ins.get('/risk/queryDeviceLatitude', {
        params: {
            riskID
        }
    })
        .catch(errFun)
}
