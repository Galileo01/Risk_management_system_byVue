<template>
    <div class="d_allocate">
        <BreadNav :texts="['自定义任务', '任务分配']" />
        <el-card>
            <el-row>
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
                <el-col :span="1">
                     <el-button>查询设备册</el-button>
                </el-col>
                <el-col :span="8" :offset="4" class="all-btns">
                    <el-button type="primary" @click="all_BtnClick(1)"
                        >分配全部</el-button
                    >
                    <el-button type="primary" @click="all_BtnClick(2)"
                        >分配选中</el-button
                    >
                </el-col>
            </el-row>
            <DeviceTable
                :tableData="tableData"
                @showdetail="showDetail"
                :sectional="true"
            />
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
        <AllocateDialog
            :dialogVisible.sync="allocateVisible"
            ref="all_dia"
            @allocate="allocate"
        />
    </div>
</template>

<script>
import DeviceTable from 'components/general_show/DeviceTable';
import DeviceDetail from 'components/general_show/DeviceDetail';
import AllocateDialog from 'components/routine_task/AllocateDialog';
export default {
    name: 'D_TaskAllocate',
    data() {
        return {
            tableData: [],
            detailVisible: false,
            allocateVisible: false,
            detailnum: '', //显示详情的 编号
            menu: [],
            query: {
                page: 1,
                size: 10,
                total: 0,
                menu: ''
            },
            isAll_all: false //是否是 分配全部的 设备
        };
    },
    methods: {
        getData() {
            //获得所哟设备数据
            const tableData = [
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
            tableData.forEach(val => {
                val.checked = false;
            });
            this.tableData = tableData;
            this.query = {
                page: 1,
                size: 10,
                total: 30,
                menu:'0012'
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
        showDetail(num) {
            console.log(num);

            this.detailnum = num;
            this.detailVisible = true;
        },
        //底部分页 更改size 和 page  触发 更改 tableData 数据
        handleSizeChange() {},
        handleCurrentChange() {},
        allocate() {
            let data = [];
            if (this.isAll_all) {
                //如果分配 全部
                data = this.tableData;
            } else {
                data = this.getCheckedDevice();
            }
            this.$message.success('分配成功');
        },
        all_BtnClick(num) {
            if (num === 1) {
                //如果是 分配全部
                this.isAll_all = true;
                this.allocateVisible = true;
            }
            else if(num===2)
            {
                if(this.getCheckedDevice().length===0)
                  this.$message.error('请选中设备');
                else
                this.allocateVisible = true;
            }
        },
        getCheckedDevice() {
            return this.tableData.filter(val => val.checked);
        }
    },
    created() {
        this.getData();
    },
    components: {
        DeviceTable,
        DeviceDetail,
        AllocateDialog
    }
};
</script>

<style scoped lang="less">
.d_allocate {
    .all-btns {
        .el-button {
            margin-left: 50px;
        }
    }
}
</style>
