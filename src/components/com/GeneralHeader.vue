<template>
    <el-header>
            <div class="logo-wapper">
                <img src="~assets/img/logo.png" alt="" class="logo" />
                <!-- <h3>永川区非煤矿山企业安全检查监督管理平台</h3> -->
                <h3>风险隐患排查及监督治理系统</h3>
            </div>
            <slot></slot>
        </el-header>
</template>

<script>
export default {
    name: 'GeneralHeader',
};
</script>

<style scoped lang="less">
.el-header {
    // width: 100%;
    background-color: #fefefe;
    display: flex;
    justify-content: space-between;
    align-items: center; /*文字居中*/
    height: 50px !important;
    min-width: 580px;
    border-bottom: 2px solid #008fc7;
    .logo-wapper {
        display: flex;
        height: 50px;
        align-items: center;
    }
    .logo {
        height: 40px;
        margin: 5px 0;
    }
    h3 {
        margin-left: 10px;
    }
}
</style>
