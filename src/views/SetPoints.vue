<template>
    <div class="point_manage">
        <BreadNav :texts="['基础设置', '设备管理']" />
        <el-card>
            <el-row class="ali-c ">
                <el-col :span="2"> <el-tag>选择设备册</el-tag></el-col>
                <el-col :span="4">
                    <el-select
                        v-model="query.menu"
                        placeholder="请选择设备册"
                        @change="getDevices"
                        size="medium"
                        clearable
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
                <el-col :span="3" :offset="15"
                    ><el-button type="primary" @click="dialogVisible = true"
                        >添加设备</el-button
                    ></el-col
                >
            </el-row>
            <el-row
                ><el-col :span="4"
                    ><el-tag>该设备册包含以下设备</el-tag></el-col
                >
                <el-col :span="4"
                    ><el-tag type="danger"
                        >点击编号设置对应的设备</el-tag
                    ></el-col
                ></el-row
            >
            <DeviceTable
                :tableData="showData"
                @showdetail="goSetting"
                :canRemove="true"
                @remove="remove"
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
        <el-dialog
            :visible.sync="dialogVisible"
            title="添加设备"
            @close="clear"
        >
            <el-form
                :model="newInfo"
                label-width="70px"
                :rules="formuRules"
                ref="addform"
            >
                <el-form-item label="名称" prop="name"
                    ><el-input
                        v-model="newInfo.name"
                        clearable
                        size="medium"
                    ></el-input
                ></el-form-item>
                <el-form-item label="类型" prop="type"
                    ><el-input
                        v-model="newInfo.type"
                        clearable
                        size="medium"
                    ></el-input
                ></el-form-item>
                <el-form-item label="标签" prop="lable"
                    ><el-input
                        v-model="newInfo.lable"
                        clearabl
                        size="medium"
                    ></el-input
                ></el-form-item>
                <el-form-item label="地址" prop="address"
                    ><el-input
                        v-model="newInfo.address"
                        clearable
                        size="medium"
                        style="width:300px"
                    ></el-input
                ></el-form-item>
                <el-form-item label="经度" prop="longitude"
                    ><el-input
                        v-model="newInfo.longitude"
                        clearable
                        size="medium"
                    ></el-input
                ></el-form-item>
                <el-form-item label="纬度" prop="latitude"
                    ><el-input
                        v-model="newInfo.latitude"
                        clearable
                        size="medium"
                    ></el-input
                ></el-form-item>
                <el-form-item label="RFID" prop="RFID"
                    ><el-input
                        v-model="newInfo.RFID"
                        clearable
                        size="medium"
                    ></el-input
                ></el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitAdd">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import DeviceTable from 'components/general_show/DeviceTable';
import {
    GetDeviceMap,
    getDeviceByMap,
    addDevice,
    getDevice,
    deleteDevice,
} from 'network/device';
export default {
    name: 'SetPoints',
    data() {
        return {
            tableData: [],
            query: {
                page: 1,
                size: 10,
                total: 0,
                menu: '',
            },
            menu: [],
            showData: [],
            dialogVisible: false,
            newInfo: {
                lable: '',
                type: '',
                address: '',
                longitude: 0,
                latitude: 0,
                name: '',
                RFID: '',
            },
            formuRules: {
                name: [
                    {
                        required: true,
                        message: '请输入设备名称',
                        trigger: 'blur',
                    },
                ],
                type: [
                    {
                        required: true,
                        message: '请输入类型',
                        trigger: 'blur',
                    },
                ],
                address: [
                    {
                        required: true,
                        message: '请输入安装地址',
                        trigger: 'blur',
                    },
                ],
                longitude: [
                    {
                        required: true,
                        message: '请输入纬度',
                        trigger: 'blur',
                    },
                ],
                latitude: [
                    {
                        required: true,
                        message: '请输入经度',
                        trigger: 'blur',
                    },
                ],
            },
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
        goSetting(name) {
            this.$router.push('point_setting' + name);
        },
        clear() {
            this.$refs.addform.resetFields();
        },
        async remove(name) {
            const result = await this.$confirm(
                '此操作将删除此设备, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((error) => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                const device = this.showData.find(val=>val.name === name);
                const res = await deleteDevice(device.name);
                console.log(res);
                if(!res.flag)
                return this.$message.error('删除失败');
                else {
                    this.$message.success('删除成功');
                    this.getDevices();
                }
            }
        },
        submitAdd() {
            this.$refs.addform.validate(async (valid) => {
                if (valid) {
                    const res = await addDevice(this.newInfo);
                    console.log(res);
                    if (!res.flag) {
                        this.dialogVisible = false;
                        return this.$message.error('添加失败');
                    }
                    this.$message.success('添加成功');
                    this.dialogVisible = false;
                    this.getDevices();
                }
            });
        },
    },
    activated() {
        this.getMenus();
        this.getDevices();
    },
    components: {
        DeviceTable,
    },
};
</script>

<style scoped lang="less">
.point_manage {
    /deep/ .el-dialog {
        .el-input {
            width: 200px;
        }
    }
}
</style>
