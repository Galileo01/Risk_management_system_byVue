<template>
    <el-dialog
        :visible="dialogVisible"
        @update:visible="$emit('update:dialogVisible', false)"
        top="50px"
        width="60%"
        @open="openHandler"
        title="重新分配设备"
    >
        <el-row>
            <el-col :span="4">
                <el-select
                    v-model="query.menu"
                    placeholder="请选择设备册"
                    clearable
                    @clear="getDevices"
                    size="medium"
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
            <el-col :span="2" :offset="1">
                <el-button @click="getDevices" size="medium"
                    >查询设备册</el-button
                ></el-col
            >
            <el-table :data="showData" size="mini">
                <el-table-column width="50px">
                    <template v-slot="{row}">
                        <el-checkbox v-model="row.checked"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="设备名称" prop="name"></el-table-column>
                <el-table-column label="类型" prop="type"></el-table-column>
                <el-table-column
                    label="安装地址"
                    prop="address"
                ></el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="query.page"
                :page-sizes="[3, 5, 10]"
                :page-size="query.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="query.total"
                size="mini"
            >
            </el-pagination>
        </el-row>
        <span slot="footer">
            <el-button @click="$emit('update:dialogVisible', false)" size="small">取消</el-button>
            <el-button type="primary" @click="submitClick" size="small">确认</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { GetDeviceMap, getDeviceByMap, getDevice } from 'network/device';
export default {
    name: 'ReAllocateDia',
    props: {
        dialogVisible: Boolean,
        choosed: {
            type: Array,
            default() {
                return [];
            },
            required: true,
        },
    },
    data() {
        return {
            menu: [],
            query: {
                page: 1,
                size: 10,
                total: 0,
                menu: '',
            },
            tableData: [],
            showData: [],
        };
    },
    methods: {
        async getMenus() {
            //获得所哟设备数据
            this.menu = [];
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
            for(const val of res.devices)
            {
                let checked=false;
                if(this.choosed.find(item=>item.deviceName===val.name))
                checked=true;
                this.tableData.push({
                    ...val,
                    checked
                })
            }
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
        openHandler() {
            this.getMenus();
            this.getDevices();
        },
        submitClick(){
            const checked=this.tableData.filter(val=>val.checked).map(val=>val.name).join(',');
            this.$emit('setDevice',checked);
        }
    },
};
</script>

<style></style>
