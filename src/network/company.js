import { ins, errFun } from './index';
import qs from 'qs';
//获取 企业
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

export function addCompany({
    industryName,
    name,
    address,
    tel: TEL,
    latitude,
    longitude,
}) {
    return ins
        .post(
            '/enterprise/insert',
            qs.stringify({
                industryName,
                name,
                address,
                TEL,
                longitude,
                latitude,
            })
        )
        .catch(errFun);
}

export function updateCompany({
    industryName,
    name,
    afterName,
    address,
    tel: TEL,
    latitude,
    longitude,
}) {
    return ins
        .post(
            '/enterprise/update',
            qs.stringify({
                industryName,
                name,
                afterName,
                address,
                TEL,
                latitude,
                longitude,
            })
        )
        .catch(errFun);
}

export function removeCompany(name) {
    return ins
        .post(
            '/enterprise/delete',
            qs.stringify({
                name,
            })
        )
        .catch(errFun);
}

//行业板块

//获取行业
export function getIndustrys({ name, page, limit }) {
    return ins
        .get('/industry/query', {
            params: { offset: (page - 1) * limit, limit },
        })
        .catch(errFun);
}

export function addIndustry(name) {
    return ins.post('/industry/insert', qs.stringify({ name })).catch(errFun);
}

export function updateIndustry({ name, afterName }) {
    return ins
        .post(
            '/industry/update',
            qs.stringify({
                name,
                afterName,
            })
        )
        .catch(errFun);
}
export function removeIndustry(name)
{
    return ins.post('/industry/delete',qs.stringify({name}))
    .catch(errFun);
}