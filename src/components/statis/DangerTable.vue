<template>
    <el-table :data="data" size="mini">
        <el-table-column type="index"></el-table-column>
        <!-- <el-table-column label="隐患ID" prop="dangerNum"></el-table-column> -->
        <el-table-column label="隐患类型" prop="dangerType"></el-table-column>
        <el-table-column label="关联设备" prop="deivceNum"></el-table-column>
        <el-table-column label="审核状态" prop="examState"></el-table-column>
        <el-table-column label="隐患状态" prop="dangerState"></el-table-column>
        <el-table-column label="上报人员" prop="staff"></el-table-column>
        <el-table-column label="上报时间" prop="ge_time"></el-table-column>
        <el-table-column label="位置描述" prop="addressDes"></el-table-column>

        <el-table-column label="隐患描述" prop="dangerDes" width="200px">
            <template v-slot="{ row }">
                <div class="comment">
                    <span>{{ row.dangerDes }}</span>
                    <el-tooltip effect="light" content="点击查看完整隐患描述" placement="top"
                        ><el-button
                            icon="el-icon-view"
                            size="mini"
                            type="primary"
                            @click="$emit('show', row.dangerNum)"
                        ></el-button
                    ></el-tooltip>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="70px">
            <template v-slot="{ row }">
                <el-button
                    type="info"
                    size="mini"
                    icon="el-icon-printer"  v-if="oprateType==='print'"
                    @click="print(row.dangerNum)"
                ></el-button>
                <el-button v-else type="success" size="mini" icon="el-icon-check" @click="$emit('handle',row.dangerNum)"></el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'DangerTable',
    props: {
        data: Array,
        oprateType:{
            type:String,
            default:'print'
        }
    },
    methods: {
        print(num) {
            const { href } = this.$router.resolve({
                path: `/danger_print:${num}` //进入任务详情页
            });
            window.open(href, '_blank');
        }
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
