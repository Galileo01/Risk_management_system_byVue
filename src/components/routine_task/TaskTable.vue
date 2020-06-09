<template>
    <el-table
        ref="table"
        :data="tasklist"
        stripe
        size="mini"
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
                <a class="task-name" @click="showdetail(row.name)">{{
                    row.name
                }}</a>
            </template>
        </el-table-column>
        <el-table-column prop="state" label="任务状态" width="90px">
            <template v-slot="{ row }">
                <span>{{ stateText(row.state) }}</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="userName"
            label="终端人员"
            width="100px"
        ></el-table-column>
        <el-table-column
            prop="checkState"
            label="审核进度"
            width="90px"
        ></el-table-column>
        <el-table-column
            prop="passNumber"
            label="合格数"
            width="90px"
        ></el-table-column>
        <el-table-column
            prop="createTime"
            label="生成时间"
            width="220px"
        ></el-table-column>
        <el-table-column
            prop="cycle"
            label="任务周期(天)"
            v-if="taskType === 'r'"
        ></el-table-column>
        <el-table-column prop="note" label="备注"></el-table-column>
        <el-table-column
            label="操作"
            v-if="tableType === 'manage'"
            width="250px"
        >
            <template v-slot="{ row }">
                <el-tooltip
                    class="item"
                    effect="light"
                    placement="top"
                    content="编辑任务"
                >
                    <el-button
                        icon="el-icon-edit"
                        size="mini"
                        circle
                        @click="$emit('edit', row)"
                    ></el-button>
                </el-tooltip>
                <el-tooltip
                    class="item"
                    effect="light"
                    content="地图定位"
                    placement="top"
                    ><el-button
                        icon="el-icon-location"
                        size="mini"
                        circle
                        @click="location(row)"
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
                        @click="$emit('generate', row)"
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
                        @click="$emit('refresh', row)"
                    ></el-button>
                </el-tooltip>

                <el-tooltip
                    class="item"
                    effect="light"
                    content="删除"
                    placement="top"
                >
                    <el-button
                        icon="el-icon-close"
                        size="mini"
                        class="stop"
                        type="danger"
                        circle
                        @click="$emit('remove', row.name)"
                    ></el-button
                ></el-tooltip>
            </template>
        </el-table-column>
        <el-table-column label="操作" v-else>
            <template v-slot="{ row }">
                <a class="task-name" @click="exam(row.name)">
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
            default: 'manage',
        },
        taskType: {
            type: String,
            default: 'r', //默认是日常任务
        },
    },
    computed: {},
    data() {
        return {
            isCheckedAll: false,
        };
    },
    methods: {
        //新开一个页面进行 设备定位
        location(row) {
            const { href } = this.$router.resolve({
                path: `/task_location${row.name}`,
            });
            sessionStorage.setItem('taskID', row.taskID);
            window.open(href, '_blank');
        },
        async refresh(id) {
            const result = await this.$confirm(
                '此操作将重置该任务, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((error) => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                this.$emit('refreshOne', id);
            }
        },
        async stop(id) {
            const result = await this.$confirm(
                '此操作将终止该任务, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((error) => error);
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
            const value = this.isCheckedAll;
            this.tasklist.forEach((val) => (val.checked = !value));
            this.isCheckedAll = !value;
        },
        //进入任务详情页
        showdetail(name) {
            const { href } = this.$router.resolve({
                path: `/task/${this.tableType}/${name}`, //进入任务详情页
            });
            window.open(href, '_blank');
        },

        //任务审核 功能中 进入审核页面
        exam(name) {
            const { href } = this.$router.resolve({
                path: `/task/examine/${name}`,
            });
            window.open(href, '_blank');
        },
        stateText(state) {
            const states = ['待完成', '待审核', '合格', '不合格'];
            return states[state];
        },
    },
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
