<template>
    <el-menu
        class="aside-menu"
        :collapse="isCollapse"
        :collapse-transition="false"
        text-color="#616161"
        active-text-color="#409EFF"
        :default-active="activePath"
        router
        unique-opened
    >
        <!--一级菜单-->
        <el-submenu
            v-for="(item, index) in menulist"
            :key="item.id"
            :index="item.id + ''"
        >
            <template slot="title">
                <i :class="['iconfont', 'icon-' + item.icon]"></i>
                <span class="title">{{ item.authName }}</span>
            </template>

            <!--二级菜单-->
            <el-menu-item
                v-for="subItem in item.children"
                :key="subItem.id"
                :index="subItem.path"
                @click="savePath(subItem.path)"
            >
                <span>{{ subItem.authName }}</span>
            </el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'HomeAsideMenu',
    data() {
        return {
            // activePath: '' // 选中的 menu对于的path
            menulist: [],
        };
    },
    computed: {
        activePath() {
            return this.$store.state.activePath;
        },
        ...mapGetters(['UserRole', 'userdata']),
    },
    props: {
        isCollapse: Boolean,
    },
    methods: {
        savePath(path) {
            // console.log(path);

            window.sessionStorage.setItem('activePath', path);

            this.$store.commit('changeActivePath', path);
        },
        getActivePath() {
            //保证页面刷新，侧边栏 选中不变 ,从  sessionStrorage 获取 路径
            const activePath = sessionStorage.getItem('activePath');
            if (activePath) this.$store.commit('changeActivePath', activePath);
        },
        getData() {
            const role = this.$store.getters.UserRole;
            if (this.UserRole == 0) {
                // 是 系统管理员
                this.menulist = [
                    {
                        id: 700,
                        authName: '基础设置',
                        icon: 'shezhi',
                        path: '',
                        children: [
                            {
                                id: 805,
                                authName: '账号管理',
                                path: 'account_manage',
                                children: [],
                            },
                            {
                                id: 807,
                                authName: '企业行业',
                                path: 'enter_indus',
                                children: [],
                            },
                        ],
                    },
                ];
            } else if (
                this.UserRole == 1 &&
                sessionStorage.getItem('ischoose') !== 'true'
            ) {
                //是行业管理员
                this.menulist = [
                    {
                        id: 100,
                        authName: '综合浏览',
                        icon: 'shijie',
                        path: '',
                        children: [
                            {
                                id: 103,
                                authName: '企业选择',
                                path: 'company_choose',
                                children: [],
                            },
                        ],
                    },
                    {
                        id: 200,
                        authName: '个人中心',
                        icon: 'shezhi',
                        path: '',
                        children: [
                            {
                                id: 203,
                                authName: '个人信息',
                                path: 'person_info',
                                children: [],
                            },
                        ],
                    },
                ];
                sessionStorage.setItem('ischoose', 'false');
            } else {
                //是 企业管理员
                this.menulist = [
                    {
                        id: 100,
                        authName: '综合浏览',
                        icon: 'shijie',
                        path: '',
                        children: [
                            {
                                id: 102,
                                authName: '企业履历',
                                path: 'general',
                                children: [],
                            },
                            {
                                id: 101,
                                authName: '设备查询',
                                path: 'device_query',
                                children: [],
                            },
                        ],
                    },
                    {
                        id: 200,
                        authName: '日常任务',
                        icon: 'ye',
                        path: '',
                        children: [
                            {
                                id: 201,
                                authName: '任务分配',
                                path: 'routine_task_allocate',
                                children: [],
                            },
                            {
                                id: 202,
                                authName: '任务管理',
                                path: 'routine_task_manage',
                                children: [],
                            },
                            {
                                id: 203,
                                authName: '任务审核',
                                path: 'routine_task_examine',
                                children: [],
                            },
                        ],
                    },
                    {
                        id: 300,
                        authName: '自定义任务',
                        icon: 'eyes',
                        path: '',
                        children: [
                            {
                                id: 301,
                                authName: '任务分配',
                                path: 'diy_task_allocate',
                                children: [],
                            },
                            {
                                id: 302,
                                authName: '任务管理',
                                path: 'diy_task_manage',
                                children: [],
                            },
                        ],
                    },
                    {
                        id: 400,
                        authName: '隐患管理',
                        path: '',
                        icon: 'jinggao',
                        children: [
                            {
                                id: 402,
                                authName: '隐患处理',
                                path: 'danger_handle',
                                children: [],
                            },
                        ],
                    },
                    {
                        id: 500,
                        authName: '数据统计',
                        path: '',
                        icon: 'shuju',
                        children: [
                            {
                                id: 501,
                                authName: '最新数据',
                                path: 'last_statis',
                                children: [],
                            },
                            {
                                id: 502,
                                authName: '巡查报表',
                                path: 'patrol_data',
                                children: [],
                            },
                            {
                                id: 503,
                                authName: '隐患数据',
                                path: 'danger_data',
                                children: [],
                            },
                        ],
                    },
                    {
                        id: 600,
                        authName: '人员监控',
                        icon: 'jiankong',
                        path: '',
                        children: [
                            {
                                id: 601,
                                authName: '人员定位',
                                path: 'people_location',
                                children: [],
                            },
                            {
                                id: 602,
                                authName: '设备轨迹',
                                path: 'device_trail',
                                children: [],
                            },
                        ],
                    },
                    {
                        id: 700,
                        authName: '基础设置',
                        icon: 'shezhi',
                        path: '',
                        children: [
                            {
                                id: 701,
                                authName: '隐患类型',
                                path: 'danger_type',
                                children: [],
                            },
                            {
                                id: 702,
                                authName: '设备管理',
                                path: 'point_manage',
                                children: [],
                            },
                            {
                                id: 703,
                                authName: '检查项管理',
                                path: 'patrol_item',
                                children: [],
                            },
                            {
                                id: 804,
                                authName: '设备分册',
                                path: 'device_menu',
                                children: [],
                            },
                            // {
                            //     id: 805,
                            //     authName: '自动任务',
                            //     path: 'task_setting',
                            //     children: [],
                            // },
                            {
                                id: 806,
                                authName: '账号管理',
                                path: 'account_manage',
                                children: [],
                            },
                            {
                                id: 807,
                                authName: '企业行业',
                                path: 'enter_indus',
                                children: [],
                            },
                        ],
                    },
                ];
            }
        },
        //侧边栏 变成 未选择企业的状态
        changeToUnchoose() {
            this.menulist = [
                {
                    id: 100,
                    authName: '综合浏览',
                    icon: 'shijie',
                    path: '',
                    children: [
                        {
                            id: 103,
                            authName: '企业选择',
                            path: 'company_choose',
                            children: [],
                        },
                    ],
                },
                {
                    id: 200,
                    authName: '个人中心',
                    icon: 'shezhi',
                    path: '',
                    children: [
                        {
                            id: 203,
                            authName: '个人信息',
                            path: 'person_info',
                            children: [],
                        },
                    ],
                },
            ];
        },
        //变为 没有选择企业的 侧边栏
        changeToChoosed() {
            this.menulist = [
                {
                    id: 100,
                    authName: '综合浏览',
                    icon: 'shijie',
                    path: '',
                    children: [
                        {
                            id: 102,
                            authName: '企业履历',
                            path: 'general',
                            children: [],
                        },
                        {
                            id: 101,
                            authName: '设备查询',
                            path: 'device_query',
                            children: [],
                        },
                    ],
                },
                {
                    id: 200,
                    authName: '日常任务',
                    icon: 'ye',
                    path: '',
                    children: [
                        {
                            id: 201,
                            authName: '任务分配',
                            path: 'routine_task_allocate',
                            children: [],
                        },
                        {
                            id: 202,
                            authName: '任务管理',
                            path: 'routine_task_manage',
                            children: [],
                        },
                        {
                            id: 203,
                            authName: '任务审核',
                            path: 'routine_task_examine',
                            children: [],
                        },
                    ],
                },
                {
                    id: 300,
                    authName: '自定义任务',
                    icon: 'eyes',
                    path: '',
                    children: [
                        {
                            id: 301,
                            authName: '任务分配',
                            path: 'diy_task_allocate',
                            children: [],
                        },
                        {
                            id: 302,
                            authName: '任务管理',
                            path: 'diy_task_manage',
                            children: [],
                        },
                    ],
                },
                {
                    id: 400,
                    authName: '隐患管理',
                    path: '',
                    icon: 'jinggao',
                    children: [
                        {
                            id: 402,
                            authName: '隐患处理',
                            path: 'danger_handle',
                            children: [],
                        },
                    ],
                },
                {
                    id: 500,
                    authName: '数据统计',
                    path: '',
                    icon: 'shuju',
                    children: [
                        {
                            id: 501,
                            authName: '最新数据',
                            path: 'last_statis',
                            children: [],
                        },
                        {
                            id: 502,
                            authName: '巡查报表',
                            path: 'patrol_data',
                            children: [],
                        },
                        {
                            id: 503,
                            authName: '隐患数据',
                            path: 'danger_data',
                            children: [],
                        },
                    ],
                },
                {
                    id: 600,
                    authName: '人员监控',
                    icon: 'jiankong',
                    path: '',
                    children: [
                        {
                            id: 601,
                            authName: '人员定位',
                            path: 'people_location',
                            children: [],
                        },
                        {
                            id: 602,
                            authName: '设备轨迹',
                            path: 'device_trail',
                            children: [],
                        },
                    ],
                },
            ];
        },
    },
    created() {
        this.getActivePath();
        this.getData();
    },
};
</script>

<style scoped lang="less">
.aside-menu {
    overflow-x: hidden;
    // overflow: hidden;
    max-height: calc(100vh - 28px - 48px);
    overflow-y: auto;
    /deep/ span {
        font-size: 13px;
    }
    .title {
        margin-left: 10px;
    }
    .el-submenu .el-menu-item {
        height: 40px;
        line-height: 40px;
        font-size: 13px;
    }
    span {
        font-size: 13px;
    }
}
</style>
