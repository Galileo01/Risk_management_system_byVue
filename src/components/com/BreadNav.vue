<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="home" @click.native="goHome"
            ><i class="el-icon-s-home"></i>首页</el-breadcrumb-item
        >
        <el-breadcrumb-item v-for="(item, index) in texts" :key="index">{{
            item
        }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name: 'BreadNav',
    props: {
        texts: Array, //导航条 的文字内容
        canNav: {
            //是否支持 点击导航到 首页，新标签页为false
            type: Boolean,
            default: true
        }
    },
    methods: {
        goHome() {
            if (this.canNav) {
                this.$router.push('/home/general');
                this.$store.commit('changeActivePath', '/home/general');
                sessionStorage.setItem('activePath', '/home/general');
            }
        }
    }
};
</script>

<style scoped lang="less">
.el-breadcrumb {
    background-color: #eaedf1;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: 14px !important;
    i {
        margin-right: 5px;
    }
    .home {
        i:hover {
            color: #409eff;
        }
        /deep/ span:hover {
            color: #409eff;
        }
        cursor: pointer;
        font-weight: 800;
    }
}
</style>
