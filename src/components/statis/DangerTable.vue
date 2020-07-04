<template>
    <el-table :data="data" size="mini">
        <el-table-column type="index"></el-table-column>
        <!-- <el-table-column label="隐患ID" prop="dangerNum"></el-table-column> -->

        <el-table-column label="来源设备" prop="deviceName"></el-table-column>
        <el-table-column label="来源任务" prop="taskName"></el-table-column
        ><el-table-column label="隐患类型">
            <template v-slot="{ row }">
                <span>{{ dangerTypes[row.riskTypeID - 1].name }}</span>
            </template>
        </el-table-column>
        <el-table-column label="隐患状态" v-if="showState">
            <template v-slot="{ row }">
                {{ row.state === '1' ? '已处理' : '未处理' }}
            </template>
        </el-table-column>
        <el-table-column label="风险等级" prop="level"></el-table-column>
        <el-table-column label="上报时间" prop="createTime"></el-table-column>
        <el-table-column label="隐患描述" prop="note" width="250px">
            <template v-slot="{ row }">
                <div class="comment">
                    <span>{{ row.note }}</span>
                    <el-tooltip
                        effect="light"
                        content="点击查看完整隐患描述"
                        placement="top"
                        ><el-button
                            icon="el-icon-view"
                            size="mini"
                            type="primary"
                            @click="$emit('show', row.riskID)"
                        ></el-button
                    ></el-tooltip>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="70px">
            <template v-slot="{ row }">
                <el-tooltip
                    v-if="oprateType === 'print'"
                    effect="light"
                    placement="top"
                    content="打印"
                >
                    <el-button
                        type="info"
                        size="mini"
                        icon="el-icon-printer"
                        @click="print(row.riskID)"
                    ></el-button>
                </el-tooltip>
                <el-tooltip
                    v-else
                    effect="light"
                    placement="top"
                    content="处理"
                >
                    <el-button
                        type="success"
                        size="mini"
                        icon="el-icon-check"
                        @click="$emit('handle', row.riskID)"
                    ></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'DangerTable',
    props: {
        data: Array,
        oprateType: {
            type: String,
            default: 'print',
        },
        showState: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        print(id) {
            const { href } = this.$router.resolve({
                path: `/danger_print${id}`, //进入任务详情页
            });
            window.open(href, '_blank');
        },
    },
    computed: {
        dangerTypes() {
            return this.$store.state.dangerTypes;
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
