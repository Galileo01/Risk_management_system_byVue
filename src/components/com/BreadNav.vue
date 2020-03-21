<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }"><i class="el-icon-s-home"></i>首页</el-breadcrumb-item>
  <el-breadcrumb-item v-for="(item,index) in texts" :key="index">{{item}}</el-breadcrumb-item>
</el-breadcrumb>

</template>

<script>
export default {
    name:"BreadNav",
    props:{
        texts:Array
    }
}
</script>

<style scoped lang="less">
.el-breadcrumb{
    background-color: #eaedf1;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: 14px !important;
    i{
        margin-right: 5px;
    }
}
</style>