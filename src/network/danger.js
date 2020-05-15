import { ins, errFun } from './index';
import qs from 'qs';
//风险
//获取风险
export function getDangers({
    enterpriseName,
    taskName,
    deviceName,
    level,
    state,
    page,
    limit,
}) {
    console.log(enterpriseName);

    return ins.get('/risk/query', {
        params: {
            enterpriseName,
            taskName,
            deviceName,
            level,
            state,
            offset: (page - 1) * limit,
            limit,
        },
    });
}

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
    console.log(name,afterName);
    
    return ins
        .post(
            '/riskType/update',
            qs.stringify({ name, note, afterName, resolveStandard, riskTypeID })
        )
        .catch(errFun);
}
