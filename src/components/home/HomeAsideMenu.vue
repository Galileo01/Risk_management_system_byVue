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
       
        <el-submenu index="1">
            <template slot="title"
                ><i class="iconfont icon-shijie "></i>
                <span class="title">综合浏览</span></template
            >
            <el-menu-item index="device_query" @click="savePath('device_query')"
                >设备浏览</el-menu-item
            >
        </el-submenu>
        <el-submenu index="2">
            <template slot="title"
                ><i class="iconfont icon-ye "></i>
                <span class="title">日常任务</span></template
            >
            <el-menu-item
                index="routine_task_allocate"
                @click="savePath('routine_task_allocate')"
                >任务分配</el-menu-item
            >
            <el-menu-item
                index="routine_task_manage"
                @click="savePath('routine_task_manage')"
                >任务管理</el-menu-item
            >
            <el-menu-item
                index="routine_task_examine"
                @click="savePath('routine_task_examine')"
                >任务审核</el-menu-item
            >
        </el-submenu>
        <el-submenu index="3">
            <template slot="title"
                ><i class="iconfont icon-eyes "></i>
                <span class="title">自定义任务</span></template
            >
            <el-menu-item
                index="diy_task_allocate"
                @click="savePath('diy_task_allocate')"
                >任务分配</el-menu-item
            >
            <el-menu-item
                index="diy_task_manage"
                @click="savePath('diy_task_manage')"
                >任务管理</el-menu-item
            >
        </el-submenu>
        <el-submenu index="4">
            <template slot="title"
                ><i class="iconfont icon-shuju "></i>
                <span class="title">数据统计</span></template
            >
             <el-menu-item
                index="last_statis"
                @click="savePath('last_statis')"
                >最新数据</el-menu-item
            >
            <el-menu-item
                index="patrol_data"
                @click="savePath('patrol_data')"
                >巡查报表</el-menu-item
            >
             <el-menu-item
                index="danger_data"
                @click="savePath('danger_data')"
                >隐患数据</el-menu-item
            >
            <el-menu-item
                index="global_statis"
                @click="savePath('global_statis')"
                >总体统计</el-menu-item
            >
           
           
        </el-submenu>
        <el-submenu index="5">
            <template slot="title"
                ><i class="iconfont icon-jiankong "></i>
                <span class="title">人员监控</span></template
            >
            <el-menu-item
                index="people_location"
                @click="savePath('people_location')"
                >人员定位</el-menu-item
            >
            <el-menu-item
                index="people_trail"
                @click="savePath('people_trail')"
                >人员轨迹</el-menu-item
            >
             <el-menu-item
                index="device_trail"
                @click="savePath('device_trail')"
                >设备轨迹</el-menu-item
            >
        </el-submenu>
        <el-submenu index="6">
            <template slot="title"
                ><i class="iconfont icon-shezhi "></i>
                <span class="title">基础设置</span></template
            >
            
            <el-menu-item
                index="danger_type"
                @click="savePath('danger_type')"
                >隐患类型</el-menu-item
            >
            <el-menu-item
                index="point_manage"
                @click="savePath('point_manage')"
                >点位设置</el-menu-item
            >
            <el-menu-item
                index="device_menu"
                @click="savePath('device_menu')"
                >设备分册</el-menu-item
            >
             <el-menu-item
                index="task_setting"
                @click="savePath('task_setting')"
                >自动任务</el-menu-item
            >
             <el-menu-item
                index="account_manage"
                @click="savePath('account_manage')"
                >账号管理</el-menu-item
            >
        </el-submenu>
    </el-menu>
</template>

<script>
export default {
    name: 'HomeAsideMenu',
    data() {
        return {
            // activePath: '' // 选中的 menu对于的path
        };
    },
    computed: {
        activePath() {
            return this.$store.state.activePath;
        }
    },
    props: {
        isCollapse: Boolean
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
        }
    },
    created() {
        this.getActivePath();
    }
};
</script>

<style scoped lang="less">
.aside-menu {
    overflow-x: hidden;
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
