<template>
    <div class="home">
        <el-container>
            <el-header
                ><h3>永川区非煤矿山企业安全检查监督管理平台</h3>
               <div class="left-wapper"> <div class="avator">
                    <img src="" alt="" />
                    admin</div >
            <el-button size="mini" type="danger">退出</el-button></div>
            </el-header>
            <el-container>
                <el-aside width="200px">Aside</el-aside>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'Home',
    components: {}
};
</script>

<style scoped lang="less">
.el-header {
    background-color: #FEFEFE;
    display: flex;
    justify-content: space-between;
    align-items: center; /*文字居中*/
    height: 50px !important;
    border-bottom: 2px solid #008fc7;
}
.el-aside {
    background-color: #F2F2F2;
}
.el-main {
    background-color: #ffffff;
    border-left: 1px solid #d2d6de;
}
.left-wapper{
  margin-right: 10px;
  display: flex;
  align-items: center;
  .avator{
    margin-right: 15px;
  }
}
</style>
