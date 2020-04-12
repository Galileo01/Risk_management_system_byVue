<template>
    <el-table
        ref="table"
        :data="tasklist"
        stripe
        :cellStyle="{ padding: '10px' }"
        border
        @select="select"
        @select-all="selectAll"
        style="width: 100%"
    >
        <el-table-column
            type="selection"
            width="55"
            v-if="tableType === 'manage'"
        ></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="任务名称" width="150px">
            <template v-slot="{ row }">
                <a class="task-name" @click="showdetail(row.taskId)">{{
                    row.taskName
                }}</a>
            </template>
        </el-table-column>
        <el-table-column
            prop="taskStatus"
            label="任务状态"
            width="90px"
            v-if="tableType === 'manage'"
        ></el-table-column>
        <el-table-column
            prop="staff"
            label="终端人员"
            width="90px"
        ></el-table-column>
        <el-table-column
            prop="examineProcess"
            label="审核进度"
            width="90px"
        ></el-table-column>
        <el-table-column
            prop="passedNum"
            label="合格数"
            width="90px"
        ></el-table-column>
        <el-table-column prop="gene_Time" label="生成时间"></el-table-column>
        <el-table-column label="任务选项" width="120px">
            <template v-slot="{ row }">
                <el-tooltip
                    class="item"
                    effect="light"
                    :content="
                        row.selections[0] ? '支持异常巡查' : '不支持异常巡查'
                    "
                    placement="left"
                >
                    <el-tag :type="row.selections[0] ? 'warning' : 'info'"
                        >异</el-tag
                    >
                </el-tooltip>
                <el-tooltip
                    class="item"
                    effect="light"
                    :content="
                        row.selections[1]
                            ? '按照规定路线排查'
                            : '不按照规定路线排查'
                    "
                    placement="top"
                >
                    <el-tag :type="row.selections[1] ? 'primary' : 'info'"
                        >规</el-tag
                    ></el-tooltip
                >
            </template>
        </el-table-column>
        <el-table-column label="操作" v-if="tableType === 'manage'">
            <template v-slot="{ row }">
                <el-tooltip
                    class="item"
                    effect="light"
                    content="地图定位"
                    placement="top"
                    ><el-button
                        icon="el-icon-location"
                        size="mini"
                        circle
                        @click="location(row.taskId)"
                        class="location"
                    ></el-button
                ></el-tooltip>

                <el-tooltip
                    class="item"
                    effect="light"
                    content="生成新任务"
                    placement="top"
                >
                    <el-button
                        icon="el-icon-circle-plus-outline"
                        size="mini"
                        circle
                        class="generate"
                        @click="generate"
                    ></el-button
                ></el-tooltip>

                <el-tooltip
                    class="item"
                    effect="light"
                    content="完成"
                    placement="top"
                >
                    <el-button
                        icon="el-icon-check"
                        size="mini"
                        circle
                        class="check"
                        @click="check(row.taskId)"
                    ></el-button
                ></el-tooltip>

                <el-tooltip
                    class="item"
                    effect="light"
                    content="重置"
                    placement="top"
                    ><el-button
                        icon="el-icon-refresh-left"
                        size="mini"
                        circle
                        class="refresh"
                        @click="refresh(row.taskId)"
                    ></el-button>
                </el-tooltip>

                <el-tooltip
                    class="item"
                    effect="light"
                    content="转发"
                    placement="top"
                >
                    <el-button
                        icon="el-icon-link"
                        size="mini"
                        class="trans"
                        circle
                        @click="trans(row.taskId)"
                    ></el-button
                ></el-tooltip>
                <!--
                <el-tooltip
                    class="item"
                    effect="light"
                    content="终止"
                    placement="top"
                >
                    <el-button
                        icon="el-icon-switch-button"
                        size="mini"
                        class="stop"
                        circle
                         @click="stop(row.taskId)"
                    ></el-button
                ></el-tooltip> -->
            </template>
        </el-table-column>
        <el-table-column label="操作" v-else>
            <template v-slot="{ row }">
                <a class="task-name" @click="exam(row.taskId)">
                    审核
                </a>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'TaskTable',
    props: {
        tasklist: {},
        tableType: {
            //当前  表格展示类型  manage/examine  管理/审核
            type: String,
            default: 'manage'
        }
        // nav:{        //标识 当前 所处的侧边导航  r/d :日常任务/自定义任务
        //     type:String,
        //     default:'r' //默认 日常任务
        // }
    },
    data(){
        return {
              isCheckedAll:false
        }
    },
    methods: {
        //新开一个页面进行 设备定位
        location(id) {
            const { href } = this.$router.resolve({
                path: `/task_location${id}`
            });
            window.open(href, '_blank');
        },
        generate() {
            this.$router.push('/home/routine_task_allocate');
            this.$store.commit(
                'changeActivePath',
                '/home/routine_task_allocate'
            );
        },
        async check(id) {
            const result = await this.$confirm(
                '此操作将完成该任务, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(error => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                this.$emit('checkOne', id);
            }
        },
        async refresh(id) {
            const result = await this.$confirm(
                '此操作将重置该任务, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(error => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                this.$emit('refreshOne', id);
            }
        },
        trans(id) {
            this.$emit('tran_res', id);
        },
        async stop(id) {
            const result = await this.$confirm(
                '此操作将终止该任务, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(error => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                this.$emit('stopOne', id);
            }
        },
        //选择框 选中 更改数据 状态
        select(_, row) {
            row.checked = !row.checked; //在这里更改 ，会影响到 父组件 通过 props 传递的 tavleData 属性
        },
        //全选
        selectAll() {
            const value=this.isCheckedAll;
            this.tasklist.forEach(val=>val.checked=!value);
            this.isCheckedAll=!value;
        },
        //进入任务详情页
        showdetail(id) {
            const { href } = this.$router.resolve({
                path: `/task/detail/${id}` //进入任务详情页
            });
            window.open(href, '_blank');
        },

        //任务审核 功能中 进入审核页面
        exam(id) {
            const { href } = this.$router.resolve({
                path: `/task/examine/${id}`
            });
            window.open(href, '_blank');
        }
    }
};
</script>

<style scoped lang="less">
.el-table {
    /deep/ td {
        font-size: 13px;
    }
    /deep/ th {
        display: table-cell !important;
    }
    .el-tag {
        margin-left: 5px;
    }
    /deep/.location i {
        color: #80b762;
    }
    /deep/.generate i {
        color: #93bde0;
    }
    /deep/.refresh {
        color: #e68372;
    }
    /deep/.stop {
        color: #ffcea6;
    }
    /deep/.check {
        color: #80b762;
    }
    /deep/.trans {
        color: #93bde0;
    }
    .task-name {
        cursor: pointer;
        color: rgb(64, 158, 255);
    }
}
</style>
