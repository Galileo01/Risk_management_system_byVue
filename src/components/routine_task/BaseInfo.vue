<template>
    <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
            <div class="base_info">
                <el-row
                    ><el-col :span="2" :offset="2">任务名称</el-col>
                    <el-col :span="6">{{ taskInfo.taskName }}</el-col>
                    <el-col :span="2" :offset="2">任务类型</el-col>
                    <el-col :span="6">{{ typeText }}</el-col></el-row
                >
                <el-row
                    ><el-col :span="2" :offset="2">终端人员</el-col>
                    <el-col :span="6">{{ taskInfo.staff }}</el-col>
                    <el-col :span="2" :offset="2">上传进度</el-col>
                    <el-col :span="6">{{
                        taskInfo.uploadProcess
                    }}</el-col></el-row
                >
                <el-row
                    ><el-col :span="2" :offset="2">审核进度</el-col>
                    <el-col :span="6">{{ taskInfo.examineProcess }}</el-col>
                    <el-col :span="2" :offset="2">合格数</el-col>
                    <el-col :span="6">{{ taskInfo.passedNum }}</el-col></el-row
                >
                <el-row
                    ><el-col :span="2" :offset="2">转发人员</el-col>
                    <el-col :span="6">{{ taskInfo.trans_from || '无' }}</el-col>
                    <el-col :span="2" :offset="2">转发时间</el-col>
                    <el-col :span="6">{{
                        taskInfo.trans_time || '无'
                    }}</el-col></el-row
                >
                <el-row>
                    <el-col :span="2" :offset="2">完成/终止用户</el-col>
                    <el-col :span="6">{{ taskInfo.stopUSer }}</el-col>
                    <el-col :span="2" :offset="2">完成终止时间</el-col>
                    <el-col :span="6">{{ taskInfo.stopTime }}</el-col></el-row
                >
                <el-row
                    ><el-col :span="2" :offset="2">生成用户</el-col>
                    <el-col :span="6">{{ taskInfo.geneUser }}</el-col>
                    <el-col :span="2" :offset="2">生成时间</el-col>
                    <el-col :span="6">{{ taskInfo.gene_Time }}</el-col></el-row
                >
                <el-row
                    ><el-col :span="2" :offset="2">最近下载时间</el-col>
                    <el-col :span="6">{{ taskInfo.lastDownTime }}</el-col>
                    <el-col :span="2" :offset="2">最后完成时间</el-col>
                    <el-col :span="6">{{
                        taskInfo.finalFinishTime
                    }}</el-col></el-row
                >
                <el-row class="center"
                    ><el-col :span="2" :offset="2">异常巡查</el-col>
                    <el-col :span="6"
                        ><el-tag
                            :type="taskInfo.selections[0] ? 'warning' : 'info'"
                            >{{
                                taskInfo.selections[0]
                                    ? '支持异常巡查'
                                    : '不支持异常巡查'
                            }}</el-tag
                        ></el-col
                    >
                    <el-col :span="2" :offset="2">规定路线</el-col>
                    <el-col :span="6"
                        ><el-tag
                            :type="taskInfo.selections[0] ? 'primary' : 'info'"
                            >{{
                                taskInfo.selections[1]
                                    ? '规定路线'
                                    : '不按照规定路线'
                            }}</el-tag
                        ></el-col
                    ></el-row
                >
                <el-row
                    ><el-col :span="2" :offset="2">设备册编号</el-col>
                    <el-col :span="6">{{ taskInfo.menuName }}</el-col>
                    <el-col :span="2" :offset="2">备注</el-col>
                    <el-col :span="6">{{
                        taskInfo.commont || '无'
                    }}</el-col></el-row
                >
            </div>
        </el-collapse-item></el-collapse
    >
</template>

<script>
export default {
    name: 'BaseInfo',
    data() {
        return {
            activeNames: !this.isCollapse ? '1' : '' //el-collapse  当前展示的item  name 属性
        };
    },
    props: {
        taskInfo: Object,
        isCollapse: {
            //标识 是否折叠,默认 不折叠
            type: Boolean,
            default: false
        }
    },
    computed: {
        typeText() {
            return this.taskInfo.taskType === 0 ? '日周月巡查' : '自定义巡查';
        }
    }
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
    .center {
        display: flex;
        align-items: center;
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
