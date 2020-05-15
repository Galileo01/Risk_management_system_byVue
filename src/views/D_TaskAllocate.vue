<template>
    <div class="d_allocate">
        <BreadNav :texts="['自定义任务', '任务分配']" />
        <el-card>
            <el-row>
                <el-col :span="4">
                    <el-select v-model="query.menu" placeholder="请选择设备册">
                        <el-option
                            v-for="(item, index) in menu"
                            :key="index"
                            :label="item"
                            :value="item"
                        >
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="1">
                    <el-button @click="getDevices"
                        >查询设备册</el-button
                    ></el-col
                >
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
                :tableData="showData"
                @showdetail="showDetail"
                :sectional="true"
            />
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="query.page"
                :page-sizes="[3, 5, 10]"
                :page-size="query.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="query.total"
            >
            </el-pagination>
        </el-card>
        <DeviceDetail :dialogVisible.sync="detailVisible" :info="showInfo" />
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
import { AllocateTask } from 'network/task';
import { GetDeviceMap, getDeviceByMap, getDevice } from 'network/device';

export default {
    name: 'D_TaskAllocate',
    data() {
        return {
            tableData: [],
            showData: [],
            detailVisible: false,
            showInfo: {},
            allocateVisible: false,
            detailnum: '', //显示详情的 编号
            menu: [],
            query: {
                page: 1,
                size: 10,
                total: 0,
                menu: '',
            },
            isAll_all: false, //是否是 分配全部的 设备
        };
    },
    methods: {
        async getMenus() {
            //获得所哟设备数据
            const res = await GetDeviceMap(1, 9999);
            console.log(res);
            if (!res.flag) return this.$message.error('设备册获取失败');

            for (const val of res.deviceMaps) {
                this.menu.push(val.name);
            }
        },
        async getDevices() {
            this.tableData = [];
            const { size, page } = this.query;
            const offset = (page - 1) * size;
            let res = {};
            if (this.query.menu !== '') {
                //如果  选择了menu  就根据menu 来获取
                res = await getDeviceByMap({
                    deviceMapName: this.query.menu,
                    limit: 9999,
                    offset,
                });
                console.log(res);
                if (!res.flag) return this.$message.error('设备获取失败');
            } else {
                //没有选择 设备册 就获取 所有的 设备
                res = await getDevice({
                    page: 1,
                    limit: 9999,
                });
                console.log(res);
                if (!res.flag) return this.$message.error('设备获取失败');
            }
            this.tableData = res.devices;

            this.showData = this.tableData.slice(offset, offset + size);
            this.query.total = res.devices.length;
        },
        showDetail(name) {
            const info = this.tableData.find((val) => val.name === name);
            if (info) this.showInfo = info;
            this.detailVisible = true;
        },
        //底部分页 更改size 和 page  触发 更改 tableData 数据
        handleSizeChange(size) {
            this.query.size = size;
            this.changeShowData();
        },
        handleCurrentChange(page) {
            this.query.page = page;
            this.changeShowData();
        },
        changeShowData() {
            const { page, size } = this.query;
            const offset = (page - 1) * size;
            this.showData = this.tableData.slice(offset, offset + size);
        },
        async allocate(para) {
            let data = [];
            if (this.isAll_all) {
                //如果分配 全部
                data = this.tableData;
            } else {
                data = this.getCheckedDevice();
            }
            data = data.map((val) => {
                return val.name;
            });

            let devices = data.join(',');
            const res = await AllocateTask({
                devices,
                ...para,
                number: data.length,
            });
            console.log(res);

            this.$message.success('分配成功');
        },
        all_BtnClick(num) {
            if (num === 1) {
                //如果是 分配全部
                this.isAll_all = true;
                this.allocateVisible = true;
            } else if (num === 2) {
                if (this.getCheckedDevice().length === 0)
                    this.$message.error('请选中设备');
                else this.allocateVisible = true;
            }
        },
        getCheckedDevice() {
            return this.showData.filter((val) => val.checked);
        },
    },
    activated() {
        this.getMenus();
        this.getDevices();
    },
    components: {
        DeviceTable,
        DeviceDetail,
        AllocateDialog,
    },
};
</script>

<style scoped lang="less">
.r_allocate {
    .all-btns {
        .el-button {
            margin-left: 50px;
        }
    }
}
</style>
