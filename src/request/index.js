import axios from 'axios'
const baseURL='http://39.106.127.66:8080'
const axoisins = axios.create({
    baseURL,
    timeout:50000
});

axoisins.interceptors.request.use(config=>{
    return config;
})

axoisins.interceptors.response.use(res=>{
    return res.data;
})

export default axoisins