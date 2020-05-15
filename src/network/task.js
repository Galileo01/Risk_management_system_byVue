import { ins, errFun } from './index';
import qs from 'qs';
export function GetTasks({
    enterpriseName,
    industryName,
    cycle,
    name,
    state,
    note,
    userName,
    page,
    limit,
}) {
    console.log(name);
    return ins
        .get('/task/query', {
            params: {
                enterpriseName,
                industryName,
                cycle,
                name,
                state: state || null,
                limit: 9999,
                userName: userName || null, //过滤 空字符串
                offset: 0,
            },
        })
        .catch(errFun);
}

export function AllocateTask({
    cycle,
    name,
    note,
    devices,
    enterpriseName,
    industryName,
    userName,
    number,
}) {
    return ins
        .post(
            '/task/insert',
            qs.stringify({
                cycle,
                name,
                note,
                devices,
                checkState: `0/${number}`,
                state: '待',
                enterpriseName,
                industryName,
            })
        ) // 创建成功后  在分配 任务
        .then((res) => {
            console.log(res);

            return ins.post(
                '/task/allocation',
                qs.stringify({
                    taskName: name,
                    userName,
                })
            );
        })
        .catch(errFun);
}
///设置 任务信息
export function setTask({ name, userName, state,cycle }) {
    return ins
        .post(
            '/task/update',
            qs.stringify({
                name,
                userName,
                state,
                cycle
            })
        )
        .catch(errFun);
}

//设置 设备
export function SetTaskDevices(taskName, devices) {
    return ins
        .post('/task_deivce/insert', {
            taskName,
            devices,
        })
        .catch(errFun);
}
//排序 任务 设备 顺序
export function setDeviceOrder({ taskName, enterpriseName, devices }) {
    return ins
        .post(
            '/task/UpdateDeviceOrder',
            qs.stringify({
                taskName,
                enterpriseName,
                devices,
            })
        )
        .catch(errFun);
}
//删除 任务
export function removeTask(name) {
    console.log(name);

    return ins
        .post(
            '/task/delete',
            qs.stringify({
                name,
            })
        )
        .catch(errFun);
}

//审核任务
export function examTask(taskID, auditState,auditNote) {
    console.log(auditState);
    
    return ins
        .post(
            './task/audit',
            qs.stringify({
                taskID,
                auditState,
                auditNote
            })
        )
        .catch(errFun);
}

// 获取 任务 设备

export function getTaskDevices(taskID) {
    return ins
        .get('/MT/device/queryByTaskID', { params: { taskID } })
        .catch(errFun);
}
