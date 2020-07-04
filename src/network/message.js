import { ins, errFun } from './index';
import qs from 'qs';

export function getMyMessages({
    sender, startTime
}) {

    return ins.get('/message/query', {
        params: {
            sender, startTime
        }
    })
        .catch(errFun)
}

//发送消息
export function sendMessage({
    receiver, content
}) {
    return ins.post('/message/insert', qs.stringify({
        receiver,
        content
    }))
        .catch(errFun)
}

export function checkOneMessage(messageID){
    return ins.post('/message/setRead',qs.stringify({
        messageID
    }))
    .catch(errFun)
}
