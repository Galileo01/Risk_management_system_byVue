<template>
    <div class="set-auto-task">
        <BreadNav :texts="['基础设置', '自动任务', '任务设置']" :navObjs="{1:'task_setting'}"/>
        <el-card>
            <el-row class="ali-c"
                ><el-col :span="4">
                    <el-tag>要设置的自动任务名称为</el-tag></el-col
                >
                <el-col :span="4"
                    ><el-tag type="info">{{ taskid }}</el-tag></el-col
                ></el-row
            >
            <el-row class="ali-c">
                <el-col :span="3" class="info"
                    ><el-tag>选择设备册</el-tag></el-col
                >
                <el-col :span="5"
                    ><el-select v-model="query.menu" placeholder="请选择设备册">
                        <el-option
                            v-for="(item, index) in menus"
                            :key="index"
                            :value="item.value"
                            :label="item.label"
                        ></el-option></el-select
                ></el-col>
                <el-col :span="2" :offset="16"><el-button type="danger" size="medium" @click="submitSet">提交设置</el-button></el-col>
            </el-row>
            <el-table
                :data="tableData"
                border
                size="small"
            >
                <el-table-column width="50px">
                    <template v-slot="{ row }">
                        <el-checkbox
                            v-model="row.checked"
                        ></el-checkbox> </template
                ></el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="number" label="设备编号">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template v-slot="{ row }">
                        <el-tag v-if="row.status === 'good'" type="success"
                            >好</el-tag
                        >
                        <el-tag v-else-if="row.status === 'bad'" type="danger"
                            >差</el-tag
                        >
                        <el-tag v-else type="warning">未知</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型"></el-table-column>
                <el-table-column
                    prop="address"
                    label="安装地址"
                ></el-table-column>
                <el-table-column prop="date" label="安装日期"></el-table-column>
            </el-table>
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
    props: {
        taskid: String
    },
    data() {
        return {
            menus: [],
            query: {
                page: 1,
                size: 10,
                total: 0,
                menu: '002'
            },
            tableData: []
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
                    address: '办公楼',
                    checked: true
                },
                {
                    number: 'D002',
                    status: 'good',
                    type: '磅房督查',
                    date: '2019-09-09 13:24:55',

                    address: '磅房',
                    checked: true
                },
                {
                    number: 'D003',
                    status: 'bad',
                    type: '大门内右侧督查',
                    date: '2019-09-09 13:24:55',

                    address: '大门内右侧',
                    checked: false
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

                    address: '高压配电房2督查',
                    checked: true
                },
                {
                    number: 'D008',
                    status: 'unknown',
                    type: '巡线点1',
                    date: '2019-09-09 13:24:55',

                    address: '巡线点1',
                    checked: false
                },
                {
                    number: 'D009',
                    status: 'unknown',
                    type: '巡线点2督查',
                    date: '2019-09-09 13:24:55',

                    address: '巡线点2',
                    checked: true
                },
                {
                    number: 'D010',
                    status: 'unknown',
                    type: '巡线点3督查',
                    date: '2019-09-09 13:24:55',

                    address: '巡线点3',
                    checked: true
                }
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
        handleSizeChange() {},
        handleCurrentChange() {},
        submitSet(){
            this.$message.success('自动任务设置提交成功');
            
        }
    },
    created() {
        this.getData();
        console.log(111);
        
    },
    components: {
        DeviceTable
    }
};
</script>

<style></style>
