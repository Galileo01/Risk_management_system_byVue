<template>
    <div class="device_manage">
        <BreadNav :texts="['基础设置', '设备册']" />
        <el-card>
            <el-row>
                <el-col :span="4"
                    ><el-select
                        v-model="query.menu"
                        @change="menuChange"
                        size="medium"
                    >
                        <el-option
                            v-for="(item, index) in menus"
                            :key="index"
                            :value="item"
                            :label="item"
                        ></el-option> </el-select
                ></el-col>
                <el-col :span="6"
                    ><el-button type="info" @click="goDistribute" size="medium"
                        >分配此设备册</el-button
                    ></el-col
                >
                <el-col :span="6" :offset="8"
                    ><el-button size="medium" @click="addClick"
                        >添加设备册</el-button
                    ><el-button type="primary" size="medium" @click="editClick"
                        >重命名</el-button
                    ><el-button type="danger" size="medium" @click="remove"
                        >删除设备册</el-button
                    >
                </el-col>
            </el-row>
            <DeviceTable :tableData="showData" :numCanClick="false" />
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
        <el-dialog :visible.sync="dialogVisible" title="设备册" @close="clear">
            <el-form :model="oprateMenu" ref="form" label-width="70px">
                <el-form-item label="名称" prop="name">
                    <el-input
                        v-model="oprateMenu.name"
                        :disabled="dialogType === 'edit'"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="新名称"
                    prop="afterName"
                    v-if="dialogType === 'edit'"
                >
                    <el-input v-model="oprateMenu.afterName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button @click="submit" type="primary">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import DeviceTable from 'components/general_show/DeviceTable';
import {
    GetDeviceMap,
    getDeviceByMap,
    addDeviceMap,
    deleteDeviceMap,
    updateDeviceMap,
} from 'network/device';
export default {
    name: 'SetDeviceMenus',
    data() {
        return {
            tableData: [],
            showData: [],
            query: {
                page: 1,
                size: 10,
                total: 0,
                menu: '',
            },
            menus: [],
            dialogVisible: false,
            dialogType: 'add',
            oprateMenu: {
                name: '',
                afterName: '',
            },
        };
    },
    methods: {
        async getMenus() {
            //获得所哟设备数据
            this.menus = [];
            const res = await GetDeviceMap(1, 9999);
            console.log(res);
            if (!res.flag) return this.$message.error('设备册获取失败');

            for (const val of res.deviceMaps) {
                this.menus.push(val.name);
            }
            this.query.menu = this.menus[0];

            this.getDevices();
        },
        async getDevices() {
            this.tableData = [];
            const { size, page } = this.query;
            const offset = (page - 1) * size;
            const res = await getDeviceByMap({
                deviceMapName: this.query.menu,
                limit: 9999,
                offset,
            });
            console.log(res);
            if (!res.flag) return this.$message.error('设备获取失败');

            this.tableData = res.devices;
            this.showData = this.tableData.slice(offset, offset + size);
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
            this.showData = this.tableData.slice(offset, offset + size);
        },
        menuChange() {
            this.getDevices();
        },
        goDistribute() {
            this.$router.push('device_distri' + this.query.menu);
        },
        addClick() {
            this.dialogType = 'add';
            this.oprateMenu.name = this.query.menu;
            this.dialogVisible = true;
        },
        editClick() {
            this.dialogType = 'edit';
            this.oprateMenu.name = this.query.menu;
            this.dialogVisible = true;
        },
        submit() {
            if (this.dialogType === 'add') {
                this.submitAdd();
            } else {
                this.submitEdit();
            }
        },
        async submitAdd() {
            const res = await addDeviceMap(this.oprateMenu.name);
            console.log(res);
            if (!res.flag) return this.$message.error('添加失败');
            else {
                this.$message.success('添加成功');
                this.getMenus();
                this.dialogVisible = false;
            }
        },
        async submitEdit() {
            const res = await addDeviceMap(
                this.oprateMenu.name,
                this.oprateMenu.afterName
            );
            console.log(res);
            if (!res.flag) return this.$message.error('修改失败');
            else {
                this.$message.success('修改成功');
                this.getMenus();
                this.dialogVisible = false;
            }
        },
        async remove() {
            const result = await this.$confirm(
                '此操作将删除此设备册, 是否继续?',
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
                const res = await deleteDeviceMap(this.oprateMenu.name);
                console.log(res);
                if (!res.flag) return this.$message.error('删除失败');
                else {
                    this.$message.success('删除成功');
                    this.getMenus();
                }
            }
        },
        clear() {
            this.$refs.form.resetFields();
        },
    },
    created() {
        this.getMenus();
    },
    components: {
        DeviceTable,
    },
};
</script>

<style scoped lang="less">
/deep/ .el-dialog {
    .el-input {
        width: 300px;
    }
}
</style>
