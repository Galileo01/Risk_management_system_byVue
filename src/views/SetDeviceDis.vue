<template>
    <div class="device_distri">
        <BreadNav :texts="['基础设置', '设备册', '设备分册']" :navObjs="{1:'device_menu'}"/>
        <el-card>
            <el-row>
                <el-col :span="4"
                    >设备册：<el-tag>{{ menu }}</el-tag></el-col
                >
                <el-col :span="6"
                    ><el-button type="danger" @click="subDistri" size="medium"
                        >提交此次分配</el-button
                    ></el-col
                >
            </el-row>
            <el-table
                :data="showDevices"
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
    name: 'SetDeviceDis',
    props: {
        menuid: String
    },
    data() {
        return {
            allDevices: [], //MARK: 组件创建完成后 必须把所有的设备一次请求 并 保存到本地
            showDevices: [], //展示在表格的数据
            query: {
                page: 1,
                size: 5,
                total: 0,
                menu: ''
            },
            menu: '日巡0012',
        };
    },
    methods: {
        getData() {
            //所有 设备
            const allDevices = [
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
            //当前设备册包含的设备
            const menuDevices = [
                {
                    number: 'D001',
                    status: 'good',
                    type: '办公楼督查',
                    date: '2019-09-09 13:24:55',
                    address: '办公楼'
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
                    number: 'D006',
                    status: 'unknown',
                    type: '高压配电房1督查',
                    date: '2019-09-09 13:24:55',

                    address: '高压配电房1'
                },
                {
                    number: 'D008',
                    status: 'unknown',
                    type: '巡线点1',
                    date: '2019-09-09 13:24:55',

                    address: '巡线点1'
                },

                {
                    number: 'D010',
                    status: 'unknown',
                    type: '巡线点3督查',
                    date: '2019-09-09 13:24:55',

                    address: '巡线点3'
                }
            ];
            allDevices.forEach((val1, index) => {
                if (menuDevices.find(val2 => val2.number === val1.number)) {
                    val1.checked = true;
                } else {
                    val1.checked = false;
                }
                if (index < this.query.size) this.showDevices.push(val1);
            });
            this.allDevices = allDevices;

            this.query = {
                page: 1,
                size: 5,
                total: 10,
                menu: '0012'
            };
        },
        handleSizeChange(size) {
            this.query.size = size;
            const page = this.query.page;
            const offset = size * (page - 1);
            this.showDevices = this.allDevices.slice(offset, offset + size);
        },
        handleCurrentChange(page) {
            const size = this.query.size;
            this.query.page = page;
            const offset = size * (page - 1);
            this.showDevices = this.allDevices.slice(offset, offset + size);
        },
        subDistri(){
            const checked=this.allDevices.filter(val=>val.checked);
            this.$message.success('提交成功');
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

<style></style>
