import axios from 'axios';
const baseURL = 'http://139.224.68.137:8081'
// const baseURL ='api';
// const baseURL = 'http://39.106.105.169:9909/api/v2';
const ins = axios.create({
    baseURL,
    timeout: 5000,
});
sessionStorage.setItem('baseURL', baseURL);
ins.interceptors.request.use((config) => {
    // config.headers['Content-Type']='application/json'
    config.headers.token = localStorage.getItem('token');
    return config;
});

ins.interceptors.response.use((res) => {
    return { ...res.data, status: res.status };
});

//请求出错时 catch 的处理函数
const errFun = (err) => {
    return {
        status: err.response.status,
        err,
    };
};

export { ins, errFun };
