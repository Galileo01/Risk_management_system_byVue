<template>
    <el-menu
        v-if="menulist.length !== 0"
        class="aside-menu"
        :collapse="isCollapse"
        :collapse-transition="false"
        text-color="#616161"
        active-text-color="#409EFF"
        :default-active="activePath"
        router
        unique-opened
    >
        <!--一级菜单 内容-->
        <el-submenu
            v-for="(item, index) in menulist"
            :key="item.id"
            :index="item.id + ''"
        >
            <template slot="title">
                <i :class="['iconfont', 'icon-' + iconlist[index]]"></i>
                <span class="title">{{ item.authName }}</span>
            </template>
            <el-menu-item
                v-for="subItem in item.children"
                :key="subItem.id"
                :index="'/' + subItem.path"
                @click="savePath(subItem.path)"
            >
                <span>{{ subItem.authName }}</span>
            </el-menu-item>
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
        menulist: Array, //侧边栏 菜单
        iconlist: Array, //菜单 icon 类名
        isCollapse: Boolean
    },
    methods: {
        savePath(path) {
            window.sessionStorage.setItem('activePath', '/' + path);
            this.$store.commit('changeActivePath', '/' + path);
        },
        getActivePath() {
            //保证页面刷新，侧边栏 选中不变
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
    }
}
</style>
