<template>
    <div class="device_query">
        <BreadNav :texts="['综合浏览', '设备浏览']" />
        <el-card>
            <el-row>
                <el-col :span="4">
                    <el-select
                        v-model="query.menu"
                        placeholder="请选择设备册"
                        size="medium" clearable
                    >
                        <el-option
                            v-for="(item, index) in menu"
                            :key="index"
                            :label="item"
                            :value="item"
                        >
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button @click="getDevices" size="medium"
                        >查询设备册</el-button
                    ></el-col
                >
                <el-col :span="8"
                    ><el-input
                        placeholder="输入关键词"
                        v-model="query.name"
                        @clear="changeShowData"
                        clearable
                        @keyup.enter.native="find"
                        size="medium"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="find"
                        ></el-button></el-input
                ></el-col>
            </el-row>
            <DeviceTable :tableData="showData" @showdetail="showDetail" />
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
        <DeviceDetail :dialogVisible.sync="detailVisible" :info="showInfo" />
    </div>
</template>

<script>
import DeviceTable from 'components/general_show/DeviceTable';
import DeviceDetail from 'components/general_show/DeviceDetail';
import { GetDeviceMap, getDeviceByMap, getDevice } from 'network/device';
export default {
    name: 'DeviceQuery',
    data() {
        return {
            tableData: [],
            detailVisible: false,
            query: {
                page: 1,
                size: 10,
                total: 0,
                menu: '',
                name: '',
            },
            menu: [],
            showData: [],
            showInfo: {},
        };
    },
    methods: {
        async getMenus() {
            //获得所哟设备数据
            this.menu = [];
            const res = await GetDeviceMap(1, 9999);
            // console.log(res);
            if (!res.flag) return this.$message.error('设备册获取失败');

            for (const val of res.deviceMaps) {
                this.menu.push(val.name);
            }
            // this.query.menu = this.menu[0];
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
        find() {
            this.query;
            if (!this.query.name) return;
            const finds = this.showData.filter((val) =>
                val.name.includes(this.query.name)
            );
            if (finds.length > 0) this.showData = finds;
            else {
                this.$message.info('查找失败');
            }
        },
    },
    activated() {
        this.getMenus();
        this.getDevices();
    },
    components: {
        DeviceTable,
        DeviceDetail,
    },
};
</script>

<style scoped lang="less">
.device_query {
    /deep/ .el-pagination {
        margin-top: 10px;
    }
}
</style>
