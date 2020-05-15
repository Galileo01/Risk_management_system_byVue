<template>
    <el-table :data="data" size="mini">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="巡查ID" prop="patrolNum"></el-table-column>
        <el-table-column label="设备编号" prop="deviceNum"></el-table-column>
        <el-table-column label="设备类型" prop="deviceType"></el-table-column>
        <el-table-column label="安装地址" prop="address"></el-table-column>
        <el-table-column label="巡查人员" prop="staff"></el-table-column>
        <el-table-column
            label="巡查时间"
            prop="patrolTime"
            min-width="100px"
        ></el-table-column>
        <el-table-column label="审核状态" prop="examState"></el-table-column>
        <el-table-column label="巡查状态" prop="patrolState"></el-table-column>
        <el-table-column label="审核备注" width="200px">
            <template v-slot="{ row }">
                <div class="comment">
                    <span>{{ row.examComment }}</span>
                    <el-button
                        icon="el-icon-view"
                        size="mini"
                        type="primary"
                        @click="$emit('show', row.patrolNum)"
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
        data: Array
    }
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
