<template>
    <div class="device_manage">
        <BreadNav :texts="['基础设置', '设备册']" />
        <el-card>
            <el-row>
                <el-col :span="4"><el-select v-model="query.menu">
                    <el-option v-for="(item,index) in menus" :key="index" :value="item.value" :label="item.label"></el-option>
                    </el-select></el-col>
                <el-col :span="6"
                    ><el-button type="info" @click="goDistribute">分配此设备册</el-button></el-col
                >
            </el-row>
            <DeviceTable :tableData="tableData" :numCanClick="false"/>
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
import DeviceTable from 'components/general_show/DeviceTable'
export default {
    name:'SetDeviceMenus',
    data(){
        return {
            tableData:[],
           query: {
                page: 1,
                size: 10,
                total: 0,
                menu:''
            },
            menus: [],
        }
    },
    methods:{
        getData(){
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
                menu:'0012'
            };

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
        goDistribute(){
            this.$router.push('device_distri'+this.query.menu);
        }
    },
    created(){
        this.getData();
    },
    components:{
        DeviceTable
    }
}
</script>

<style></style>
