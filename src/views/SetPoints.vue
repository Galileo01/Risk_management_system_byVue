<template>
    <div class="point_manage">
        <BreadNav :texts="['基础设置', '点位管理']" />
        <el-card>
            <el-row class="ali-c ">
                <el-col :span="2"> <el-tag>选择设备册</el-tag></el-col>
                <el-col :span="4">
                    <el-select v-model="query.menu" placeholder="请选择设备册">
                        <el-option
                            v-for="item in menu"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    
                </el-col>
                
            </el-row>
            <el-row><el-col :span="4"><el-tag>该设备册包含以下设备</el-tag></el-col>
            <el-col :span="4"><el-tag type="danger">点击编号设置对应的设备</el-tag></el-col></el-row>
            <DeviceTable :tableData="tableData" @showdetail="goSetting" />
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="query.page"
                :page-sizes="[5, 10, 15]"
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
    name: 'SetPoints',
    data() {
        return {
            tableData: [],
            query: {
                page: 1,
                size: 10,
                total: 0,
                menu: ''
            },
            menu: []
        };
    },
    methods: {
        getTableData() {
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
                    number: 'D004',
                    status: 'unknown',
                    type: '低压配电房督查',
                    date: '2019-09-09 13:24:55',

                    address: '低压配电房'
                },
                {
                    number: 'D005',
                    status: 'unknown',
                    type: '低压配电室督查',
                    date: '2019-09-09 13:24:55',

                    address: '低压配电室'
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
                total: 30,
                menu: ''
            };

            this.menu = [
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
        goSetting(id) {
            this.$router.push('point_setting' + id);
            
        },
        handleSizeChange() {},
        handleCurrentChange() {}
    },
    created() {
        this.getTableData();
    },
    components: {
        DeviceTable
    }
};
</script>

<style></style>
