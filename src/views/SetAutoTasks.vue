<template>
    <div class="task_set">
        <BreadNav :texts="['基础设置', '自动任务']" />
        <el-card>
            <el-row class="ali-c">
                <el-col :span="3" class="info"
                    ><el-tag>选择自动任务</el-tag></el-col
                >
                <el-col :span="5">
                    <el-select
                        v-model="taskChioce.taskId"
                        placeholder="请选择要设置的自动任务"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in taskSelections"
                            :key="index"
                            :label="item.value"
                            :value="item.id"
                        ></el-option> </el-select
                ></el-col>
                <el-col :span="6"><el-button type="warning" size="medium" @click="gotoSet">设置该自动任务</el-button></el-col>
            </el-row>
            <el-row>
                <el-alert title="该自动任务包含的设备" type="info" center show-icon>
                </el-alert>
            </el-row>
          
            <DeviceTable
                :tableData="taskChioce.taskId=== '' ? [] : tableData"
                :numCanClick="false"
            />
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="query.page"
                :page-sizes="[5, 10]"
                :page-size="query.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="query.total"
            >
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
import DeviceTable from 'components/general_show/DeviceTable';
export default {
    name: 'SetAutoTask',
    data() {
        return {
           taskChioce:{
               taskId:''
           },
            taskSelections: [],
            menus: [],
            query: {
                page: 1,
                size: 10,
                total: 0,
                menu: ''
            },
            tableData:[]
        };
    },
    methods: {
        getData() {
            this.tableData = [
                {
                    number: 'D001',
                    status: 'good',
                    type: '办公楼督查',
                    date: '2019-09-09 13:24:55',
                    address: '办公楼'
                },
                {
                    number: 'D002',
                    status: 'good',
                    type: '磅房督查',
                    date: '2019-09-09 13:24:55',

                    address: '磅房'
                },
                {
                    number: 'D003',
                    status: 'bad',
                    type: '大门内右侧督查',
                    date: '2019-09-09 13:24:55',

                    address: '大门内右侧'
                },
                {
                    number: 'D006',
                    status: 'unknown',
                    type: '高压配电房1督查',
                    date: '2019-09-09 13:24:55',

                    address: '高压配电房1'
                },
                {
                    number: 'D007',
                    status: 'unknown',
                    type: '高压配电房2督',
                    date: '2019-09-09 13:24:55',

                    address: '高压配电房2督查'
                },
                {
                    number: 'D008',
                    status: 'unknown',
                    type: '巡线点1',
                    date: '2019-09-09 13:24:55',

                    address: '巡线点1'
                },
                {
                    number: 'D009',
                    status: 'unknown',
                    type: '巡线点2督查',
                    date: '2019-09-09 13:24:55',

                    address: '巡线点2'
                },
                {
                    number: 'D010',
                    status: 'unknown',
                    type: '巡线点3督查',
                    date: '2019-09-09 13:24:55',

                    address: '巡线点3'
                }
            ];
            this.query = {
                page: 1,
                size: 10,
                total: 0,
                menu: ''
            };
            this.taskSelections = [
                {
                    value: '日巡001',
                    id: '1'
                },
                {
                    value: '周巡0012',
                    id: '0012'
                },
                { value: '月巡0034', id: '0034' },
                {
                    value: '日巡003',
                    id: '003'
                },
                {
                    value: '周巡0010',
                    id: '0010'
                },
                { value: '月巡0020', id: '0020' }
            ];
            this.menus = [
                {
                    label: '001  月巡',
                    value: '001'
                },
                {
                    label: '0012 周巡',
                    value: '0012'
                },
                {
                    label: '002  日巡',
                    value: '002'
                },
                {
                    label: '004  督察',
                    value: '004'
                }
            ];
        },
        handleSizeChange(){},
        handleCurrentChange(){},
        gotoSet(){
            if(this.taskChioce.taskId==='')
            return this.$message.info('请选择 自动任务');
            this.$router.push(`set_auto_task${this.taskChioce.taskId}`)
        }
    },
    created() {
        this.getData();
    },
    components: {
        DeviceTable
    }
};
</script>

<style scoped lang="less">
.task_set {
    .info .el-tag {
        font-size: 13px;
    }
}
</style>
