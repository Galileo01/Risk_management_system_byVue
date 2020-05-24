<template>
    <div>
        <el-row>
            <el-col :span="5">
                <el-input
                    placeholder="输入企业名称"
                    size="medium"
                    v-model="query.name"
                    clearable=""
                    @clear="getData"
                    @keyup.enter.native="getData"
                    ><el-button slot="append" @click="getData"
                        >搜索</el-button
                    ></el-input
                ></el-col
            >
            <el-col :span="3" :offset="15"
                ><el-button size="medium" type="primary" @click="addClick"
                    >添加企业</el-button
                ></el-col
            >
        </el-row>
        <el-table :data="showData" size="small" border stripe>
            <el-table-column
                label="名称"
                prop="name"
                width="300px"
            ></el-table-column>
            <el-table-column label="行业" prop="industryName"></el-table-column>
            <el-table-column label="电话" prop="tel"></el-table-column>
            <el-table-column label="纬度" prop="latitude"></el-table-column>
            <el-table-column label="经度" prop="longitude"></el-table-column>
            <el-table-column label="地址" prop="address"></el-table-column>
            <el-table-column label="操作">
                <template v-slot="{ row }">
                    <el-button
                        size="mini"
                        type="primary"
                        icon="el-icon-edit"
                        @click="editClick(row)"
                    ></el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        icon="el-icon-delete"
                        @click="remove(row.name)"
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.page"
            :page-sizes="[2, 5, 10]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="query.total"
        ></el-pagination>
        <el-dialog
            :visible.sync="dialogVisible"
            :title="dialogType === 'edit' ? '编辑企业' : '添加企业'"
            @close="resetForm"
        >
            <el-form
                :model="oprateInfo"
                label-width="70px"
                :rules="rules"
                ref="form"
            >
                <el-form-item label="名称" prop="name">
                    <el-input
                        size="medium"
                        v-model="oprateInfo.name"
                    ></el-input>
                </el-form-item>
                <el-form-item label="行业" prop="industryName">
                    <el-select size="medium" v-model="oprateInfo.industryName">
                        <el-option
                            v-for="(item, index) in industries"
                            :key="index"
                            :value="item"
                            :label="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input size="medium" v-model="oprateInfo.tel"></el-input>
                </el-form-item>
                <el-form-item label="纬度" prop="longitude">
                    <el-input
                        size="medium"
                        v-model="oprateInfo.longitude"
                    ></el-input>
                </el-form-item>
                <el-form-item label="经度" prop="latitude">
                    <el-input
                        size="medium"
                        v-model="oprateInfo.latitude"
                    ></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input
                        size="medium"
                        v-model="oprateInfo.address"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="medium" @click="dialogVisible = false"
                    >取消</el-button
                >
                <el-button size="medium" type="primary" @click="submitClick"
                    >确认</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getCompanys,
    addCompany,
    updateCompany,
    removeCompany,
} from 'network/company';
export default {
    name: 'SetIndustry',
    data() {
        return {
            query: {
                name: '',
                page: 1,
                size: 5,
                total: 0,
            },
            enterprises: [],

            showData: [],
            dialogVisible: false,
            dialogType: 'edit',
            oprateInfo: {
                name: '',
                industryName: '',
                tel: '',
                latitude: 0,
                longitude: 0,
                address: '',
            },
            industries: ['采矿业', '建筑业'],
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入企业名称',
                        trigger: 'blur',
                    },
                ],
                industryName: [
                    {
                        required: true,
                        message: '请选择行业',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    methods: {
        async getData() {
            this.enterprises = [];
            const { name, page, size } = this.query;
            const res = await getCompanys({
                name,
                page,
                limit: 9999,
            });
            console.log(res);
            if (!res.flag) return this.$message.error('企业列表获取失败');
            this.enterprises = res.enterprises;
            const offset = (page - 1) * size;
            this.showData = this.enterprises.slice(
                offset,
                offset + res.enterprises.length
            );
            this.query.total = res.enterprises.length;
        },
        async getIndustries() {},
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
            this.showData = this.enterprises.slice(offset, offset + size);
        },
        addClick() {
            this.dialogVisible = true;
            this.dialogType = 'add';
        },
        editClick(row) {
            this.dialogVisible = true;
            this.oprateInfo = {
                ...row,
                oldName: row.name,
            };
            this.dialogType = 'edit';
        },
        resetForm() {
            this.oprateInfo = {
                name: '',
                industryName: '',
                tel: '',
                latitude: 0,
                longitude: 0,
                address: '',
            };
        },
        submitClick() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.dialogType === 'add') {
                        this.submitAdd();
                    } else {
                        this.submitEdit();
                    }
                }
            });
        },
        async submitAdd() {
            const res = await addCompany(this.oprateInfo);
            // console.log(res);
            if (!res.flag) this.$message.error('添加失败');
            else {
                this.$message.success('添加成功');

                this.getData();
            }
            this.dialogVisible = false;
        },
        async submitEdit() {
            const {
                name,
                oldName,
                tel,
                industryName,
                latitude,
                longitude,
                address,
            } = this.oprateInfo;
            const res = await updateCompany({
                name: oldName,
                afterName: name,
                tel,
                industryName,
                longitude,
                latitude,
                address,
            });
            // console.log(res);
            if (!res.flag) this.$message.error('更新失败');
            else {
                this.$message.success('更新成功');
                this.getData();
            }
            this.dialogVisible = false;
        },
        async remove(name) {
            const result = await this.$confirm(
                '此操作将删除该企业, 是否继续?',
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
                const res = await removeCompany(name);
                console.log(res);
                if (res.flag) {
                    this.$message.success('删除成功');
                    this.getData();
                } else this.$message.error('');
                this.dialogVisible = false;
            }
        },
    },
    activated() {
        this.getData();
    },
};
</script>

<style scoped lang="less">
/deep/ .el-dialog {
}
</style>
