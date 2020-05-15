import { ins, errFun } from './index';
import qs from 'qs';
export function getCompanys({ name, page, limit }) {
    return ins
        .get('/enterprise/query', {
            params: {
                name,
                limit,
                offset: (page - 1) * limit,
            },
        })
        .catch(errFun);
}

export function getInsdustrys({ name, page, limit }) {
    return ins.get('/industry/query', {
        params: { name, offset: (page - 1) * limit, limit }
    })
    .catch(errFun)
}
