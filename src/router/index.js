import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import('views/Login');
const Home = () => import('views/Home');
const DeviceQuery = () => import('views/DeviceQuery');
const General = () => import('views/General');
const R_TaskAllocate = () => import('views/R_TaskAllocate');
const R_TaskManage = () => import('views/R_TaskManage');
const R_TaskExam = () => import('views/R_TaskExam');
const TaskLocation = () => import('views/TaskLocation');
const TaskDetail = () => import('views/TaskDetail');
const D_TaskAllocate = () => import('views/D_TaskAllocate');
const D_TaskManage = () => import('views/D_TaskManage');
const PeopleLocation = () => import('views/PeopleLocation');
const PeopleTrail = () => import('views/PeopleTrail');
const DeviceTrail = () => import('views/DeviceTrail');
const SetDanger = () => import('views/SetDanger');
const SetPoints = () => import('views/SetPoints');
const SetPoint = () => import('views/SetPoint');
const SetDeviceMenus =()=>import('views/SetDeviceMenus')
const SetDeviceDis=()=>import('views/SetDeviceDis')
const Profile = () => import('views/Profile');
const SetAutoTasks=()=> import('views/SetAutoTasks')
const SetAutoTask=()=>import('views/SetAutoTask')
const SetAccount=()=>import('views/SetAccount')
const StatisLast =()=>import('views/StatisLast')
const StatisPatrol=()=>import('views/StatisPatrol')
const StatisDanger=()=>import('views/StatisDanger')
const DangerPrint=()=>import('views/DangerPrint')
const SetPatrolItem=()=>import('views/SetPatrolItem')
const DangerHandle=()=>import('views/DangerHandle')
const CompanyChoose=()=> import('views/CompanyChoose')
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
        children: [
            // {
            //     path: '',
            //     redirect: 'general'
            // },
            {
                path: 'general',
                component: General
            },
            {
                path: 'device_query',
                component: DeviceQuery
            },
            {
                path: 'person_info',
                component: Profile,
            },
            {
                path: 'routine_task_allocate',
                component: R_TaskAllocate
            },
            {
                path: 'routine_task_manage',
                component: R_TaskManage
            },
            {
                path: 'routine_task_examine',
                component: R_TaskExam
            },
            {
                path: 'diy_task_allocate',
                component: D_TaskAllocate
            },
            {
                path: 'diy_task_manage',
                component: D_TaskManage
            },
            {
                path: 'people_location',
                component: PeopleLocation
            },
            // {
            //     path: 'people_trail',
            //     component: PeopleTrail
            // },
            {
                path: 'device_trail',
                component: DeviceTrail
            },
            {
                path: 'danger_type',
                component: SetDanger
            },
            {
                path: 'point_manage',
                component: SetPoints
            },
            {
                path: 'point_setting:name',
                component: SetPoint,
                props: true
            },{
                path:'device_menu',
                component:SetDeviceMenus
            },{
                path:'device_distri:name',
                component:SetDeviceDis,
                props:true
            },
            {
                path:'task_setting',
                component:SetAutoTasks
            },{
                path:'set_auto_task:taskid',
                component:SetAutoTask,
                props:true
            },
            {
                path:'account_manage',
                component:SetAccount
            },
            {
                path:'last_statis',
                component:StatisLast
            },
            {
                path:'patrol_data',
                component:StatisPatrol
            },{
                path:'danger_data',
                component:StatisDanger
            },{
                path:'patrol_item',
                component:SetPatrolItem
            },{
                path:'danger_handle',
                component:DangerHandle
            },
            {
                path:'company_choose',
                component:CompanyChoose
            }
        ]
    },
    {
        path: '/task_location:name',
        component: TaskLocation,
        props:true
    },
    {
        path: '/task/:type/:name',
        component: TaskDetail,
        props: true //将 路由 参数映射到 组件props
    },
    {
        path:'/danger_print:num',
        component:DangerPrint,
        props:true
    }
    
];

const router = new VueRouter({
    mode: 'hash',
    routes
});
//设置 导航守卫
router.beforeEach((to, from, next) => {
    if (to.path == '/login') return next();
    // const token = sessionStorage.getItem('user');
    const token = localStorage.getItem('token');
    //没有登录，强制 跳转 登录页面， 禁止 未登录 通过url 进入页面
    if (!token) return next('/login');
    next();
});

export default router;
