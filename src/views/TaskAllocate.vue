<template>
    <div class="r_allocate">
        <BreadNav :texts="['日常任务', '任务分配']" />
        <el-card>
            <el-row >
                <el-col :span="8"
                    ><el-input placeholder="输入关键词">
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                        ></el-button></el-input
                ></el-col>
                <el-col :span="8" :offset="4" class="all-btns">
                    <el-button type="primary" @click="all_all">分配全部</el-button>
                    <el-button type="primary" @click="all_checked">分配选中</el-button>
                </el-col>
            </el-row>
            <DeviceTable :tableData="tableData" @showdetail="showDetail" :sectional="true"/>
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
        <DeviceDetail :dialogVisible.sync="detailVisible" :num="detailnum" />
        <AllocateDialog :dialogVisible.sync="allocateVisible" ref="all_dia"/>
    </div>
</template>

<script>
import DeviceTable from 'components/general_show/DeviceTable';
import DeviceDetail from 'components/general_show/DeviceDetail';
import AllocateDialog from 'components/routine_task/AllocateDialog'
export default {
    name: 'TaskAllocate',
    data() {
        return {
            tableData: [],
            detailVisible: false,
            allocateVisible:false,
            detailnum: '', //显示详情的 编号
            query: {
                page: 1,
                size: 10,
                total: 0
            }
        };
    },
    methods: {
        getTableData() {
            //获得所哟设备数据
            const tableData=[
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
            //循环遍历，为每一个 数据添加
            tableData.forEach(val=>{
                val.checked=false;
            })
            this.tableData = tableData;
            this.query = {
                page: 1,
                size: 10,
                total: 30
            };
        },
        showDetail(num) {
            console.log(num);

            this.detailnum = num;
            this.detailVisible = true;
        },
        //底部分页 更改size 和 page  触发 更改 tableData 数据
        handleSizeChange(){},
        handleCurrentChange(){},
        all_checked(){
            // console.log(this.$refs.all_dia.formData);
           this.allocateVisible=true; 
        },
        all_all(){
             this.allocateVisible=true; 
        }
    },
    created() {
        this.getTableData();
    },
    components: {
        DeviceTable,
        DeviceDetail,
        AllocateDialog
    }
};
</script>

<style scoped lang="less">
.r_allocate {
  /deep/  .el-pagination {
        margin-top: 10px 
    }
    .all-btns{
        .el-button{
            margin-left: 50px;
        }
    }
}
</style>
