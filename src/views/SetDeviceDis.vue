<template>
    <div class="device_distri">
        <BreadNav
            :texts="['基础设置', '设备册', '设备分册']"
            :navObjs="{ 1: 'device_menu' }"
        />
        <el-card>
            <el-row>
                <el-col :span="4"
                    >设备册：<el-tag>{{ name }}</el-tag></el-col
                >
                <el-col :span="6"
                    ><el-button type="danger" @click="subDistri" size="medium"
                        >提交此次分配</el-button
                    ></el-col
                >
            </el-row>
            <el-row><el-tag>系统所有设备如下</el-tag></el-row>
            <el-table :data="showDevices" border size="mini">
                <el-table-column width="50px">
                    <template v-slot="{ row }">
                        <el-checkbox
                            v-model="row.checked"
                        ></el-checkbox> </template
                ></el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="name" label="设备名称">
                </el-table-column>
                <el-table-column prop="state" label="状态">
                    <!-- <template v-slot="{ row }">
                        <el-tag v-if="row.status === 'good'" type="success"
                            >好</el-tag
                        >
                        <el-tag v-else-if="row.status === 'bad'" type="danger"
                            >差</el-tag
                        >
                        <el-tag v-else type="warning">未知</el-tag>
                    </template> -->
                </el-table-column>
                <el-table-column prop="type" label="类型"></el-table-column>
                <el-table-column
                    prop="address"
                    label="安装地址"
                ></el-table-column>
                <el-table-column
                    prop="createTime"
                    label="安装日期"
                ></el-table-column>
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
import {
    GetDeviceMap,
    getDeviceByMap,
    getDevice,
    allocateDeviceMap,
} from 'network/device';
export default {
    name: 'SetDeviceDis',
    props: {
        name: String,
    },
    data() {
        return {
            allDevices: [], //MARK: 组件创建完成后 必须把所有的设备一次请求 并 保存到本地
            showDevices: [], //展示在表格的数据
            query: {
                page: 1,
                size: 10,
                total: 0,
                menu: '',
            },
            choosed: [], //当前 设备册 已经包含的设备
        };
    },
    methods: {
        async getChoose() {
            this.tableData = [];
            const { size, page } = this.query;
            const offset = (page - 1) * size;
            const res = await getDeviceByMap({
                deviceMapName: this.name,
                limit: 9999,
                offset,
            });
            console.log(res);
            if (!res.flag) return this.$message.error('设备获取失败');

            this.choosed = res.devices;
            this.getAll();
        },
        async getAll() {
            this.allDevices = [];
            const { size, page } = this.query;
            const offset = (page - 1) * size;
            const res = await getDevice({
                page: 1,
                limit: 9999,
            });
            console.log(res);
            if (!res.flag) return this.$message.error('设备获取失败');
            for (const item of res.devices) {
                let checked = false;
                if (
                    this.choosed.find((val) => val.deviceID === item.deviceID)
                ) {
                    checked = true;
                }
                this.allDevices.push({ ...item, checked });
            }
            this.showDevices = this.allDevices.slice(offset, offset + size);
            this.query.total = res.devices.length;
        },
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
            this.showDevices = this.allDevices.slice(offset, offset + size);
        },
        async subDistri() {
            const checked = this.allDevices
                .filter((val) => val.checked)
                .map((val) => val.name)
                .join(',');
            const res = await allocateDeviceMap(this.name, checked);
            console.log(res);
            if (!res.flag) return this.$message.error('提交失败');
            else {
                this.$message.success('提交成功');
                this.getChoose();
            }
        },
    },
    activated() {
        this.getChoose();
    },
    components: {
        DeviceTable,
    },
};
</script>

<style scoped lang="less">
.device_distri {
    font-size: 14px;
}
</style>
