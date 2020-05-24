<template>
    <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
            <div class="base_info">
                <el-row
                    ><el-col :span="2" :offset="2">任务名称</el-col>
                    <el-col :span="6">{{ taskInfo.name }}</el-col>
                    <!-- <el-col :span="2" :offset="2">任务类型</el-col>
                    <el-col :span="6">{{ typeText }}</el-col> -->
                    <el-col :span="2" :offset="2">企业</el-col>
                    <el-col :span="6">{{ taskInfo.enterpriseName }}</el-col>
                </el-row>
                <el-row
                    ><el-col :span="2" :offset="2">终端人员</el-col>
                    <el-col :span="6">{{ taskInfo.userName || '无' }}</el-col>
                    <el-col :span="2" :offset="2">设备册编号</el-col>
                    <el-col :span="6">{{ taskInfo.menuName }}</el-col>
                </el-row>

                <el-row>
                    <el-col :span="2" :offset="2">生成时间</el-col>
                    <el-col :span="6">{{ taskInfo.createTime }}</el-col>
                    <el-col :span="2" :offset="2">任务类型</el-col>
                    <el-col :span="2">{{ typeText }}</el-col>
                </el-row>
                <el-row v-if="taskInfo.cycle!==0">
                    <el-col :span="2" :offset="2">任务周期(天)</el-col>
                    <el-col :span="6">{{ taskInfo.cycle }}</el-col>
                </el-row>
            </div>
        </el-collapse-item></el-collapse
    >
</template>

<script>
export default {
    name: 'BaseInfo',
    data() {
        return {
            activeNames: !this.isCollapse ? '1' : '', //el-collapse  当前展示的item  name 属性
        };
    },
    props: {
        taskInfo: Object,
        isCollapse: {
            //标识 是否折叠,默认 不折叠
            type: Boolean,
            default: false,
        },
    },
    computed: {
        typeText() {
            return this.taskInfo.cycle === 0 ? '自定义任务':'日常任务'  ;
        },
    },
};
</script>

<style scoped lang="less">
.base_info {
    margin: 10px;
    padding-top: 10px;
    font-size: 13px;
    color: #393939;
    border: 1px solid #ebeef5;
    .el-col {
        span {
            margin-left: 0px;
        }
    }
    .el-row {
        margin-bottom: 18px;
    }
}
.el-collapse {
    /deep/ .el-collapse-item__header {
        width: 100px;
        margin-left: 20px;
        height: 30px;
        border-radius: 4px;
        cursor: pointer;
        color: #409eff;
    }
}
</style>
