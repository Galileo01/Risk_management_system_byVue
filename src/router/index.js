import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import('views/Login');
const Home = () => import('views/Home');
const DeviceQuery= ()=> import('components/general_show/DeviceQuery')
const General =()=> import('views/General')
const R_TaskAllocate= ()=>import('views/TaskAllocate')

const Profile =()=>import('components/base_set/Profile')
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
        component: Home,
        children:[
            {
                path:'',
                redirect:'general'
            },
            {
                path:'general',
                component:General
            },
            {
                path:'device_query',
                component:DeviceQuery
            },{
                path:'person_info:id',
                component:Profile
            },{
                path:'routine_task_allocate',
                component:R_TaskAllocate
            }
        ]
    }
];

const router = new VueRouter({
    mode: 'hash',
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
