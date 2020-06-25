<template>
    <el-table :data="data" size="mini" >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="设备名称" prop="deviceName"></el-table-column>
        <el-table-column label="任务名称" prop="taskName"></el-table-column>
        <el-table-column label="巡查人员" prop="userName"></el-table-column>

        <el-table-column label="任务状态" prop="taskState">
            <template v-slot="{ row }">
                <span>{{ taskStateText(row.taskState) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="任务类型" >
            <template v-slot="{ row }">
                <span>{{ taskTypeText(row.cycle) }}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="巡查时间"
            prop="doneTime"
            width="200px"
        ></el-table-column>
        <el-table-column label="审核备注" width="100px">
            <template v-slot="{ row }">
                <div class="auditNote">
                    <span>{{ row.auditNote || '无' }}</span>
                    <el-button
                        icon="el-icon-view"
                        size="mini"
                        type="primary"
                        @click="$emit('show', row.auditNote)"
                    ></el-button>
                </div>
            </template>
            <!---两种方案，后面讨论--->
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'PatrolTable',
    props: {
        data: Array,
    },
    methods: {
        taskStateText(state) {
            const states = ['待完成', '待审核', '合格', '不合格'];
            return states[state];
        },
        taskTypeText(cycle) {
            const obj = {
                0: '自定义',
                1: '日巡',
                7: '周巡',
                30: '月巡',
            };
            return obj[cycle];
        },
    },
};
</script>

<style scoped lang="less">
.comment {
    display: flex;
    justify-content: space-between;
    span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
