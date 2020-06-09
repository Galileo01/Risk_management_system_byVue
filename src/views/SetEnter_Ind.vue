<template>
    <div class="set_enter_ind">
        <BreadNav :texts="['基础设置', '企业行业']" />
        <el-card>
            <el-tabs tab-position="left" v-model="name">
                <el-tab-pane label="行业管理" name="industry">
                    <SetIndustry />
                </el-tab-pane>
                <el-tab-pane label="企业管理" name="enterprise">
                    <SetEnterprise  />
                </el-tab-pane> </el-tabs
        ></el-card>
    </div>
</template>

<script>
import SetEnterprise from 'components/setting/SetEnterprise';
import SetIndustry from 'components/setting/SetIndustry';
export default {
    name: 'SetEnter_Ind',
    data() {
        return {
            name:'industry'
        };
    },
    components: {
        SetEnterprise,
        SetIndustry,
    },
    created(){
        this.name='industry'
    }
};
</script>

<style scoped lang="less">
.set_enter_ind {
    /deep/ .el-card__body {
        padding-left: 10px;
    }
}
</style>
