import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import('views/Login');
const Home = () => import('views/Home');
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
});
//设置 导航守卫
router.beforeEach((to,from,next)=>{
    if(to.path=='/login')
    return next();
    const token=sessionStorage.getItem('token');
    //没有登录，强制 跳转 登录页面， 禁止 未登录 通过url 进入页面
    if(!token)
    return next('/login');
    next();
  })
  
export default router;
