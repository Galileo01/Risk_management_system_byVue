<template>
    <div>
        <el-row>
            <el-col :span="5">
                <el-input
                    placeholder="输入行业名称"
                    size="medium"
                    v-model="query.name"
                    clearable
                    @clear="getData"
                    ><el-button slot="append" @click="getData"
                        >搜索</el-button
                    ></el-input
                ></el-col
            >
            <el-col :span="3" :offset="15"
                ><el-button size="medium" type="primary" @click="addClick"
                    >添加行业</el-button
                ></el-col
            >
        </el-row>
        <el-table :data="showData" size="small" border stripe>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="操作">
                <template v-slot="{ row }">
                    <el-button
                        size="mini"
                        icon="el-icon-edit"
                        type="primary"
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
            :title="dialogType === 'add' ? '添加行业' : '编辑行业'"
            @close="reset"
        >
            <el-row type="flex" class="ali-c"
                ><el-col :span="2">行业名称:</el-col>
                <el-col :span="6" :offset="1">
                    <el-input
                        size="medium"
                        v-model="oprateInfo.name"
                        clearable
                        @keyup.enter.native="submitClick"
                    ></el-input></el-col
            ></el-row>
            <span slot="footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitClick">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getIndustrys,
    addIndustry,
    updateIndustry,
    removeIndustry,
} from 'network/company';
export default {
    name: 'SetEnterprise',
    data() {
        return {
            query: {
                name: '',
                page: 1,
                size: 5,
                total: 0,
            },
            industries: [],
            showData: [],
            dialogVisible: false,
            dialogType: 'edit',
            oprateInfo: {
                name: '',
            },
        };
    },
    methods: {
        async getData() {
            const { name, size, page } = this.query;
            const res = await getIndustrys({ name, page, limit: 9999 });
            console.log(res);
            if (!res.flag) return this.$message.error('行业列表获取失败');
            this.industries = res.industrys;
            const offset = (page - 1) * size;
            this.showData = this.industries.slice(offset, offset + size);
            this.query.total = res.industrys.length;
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
            this.showData = this.enterprises.slice(offset, offset + size);
        },
        addClick() {
            this.dialogVisible = true;
            this.dialogType = 'add';
        },
        editClick(row) {
            this.oprateInfo = {
                ...row,
                oldName: row.name,
            };
            this.dialogVisible = true;
            this.dialogType = 'edit';
        },
        submitClick() {
            if (this.dialogType === 'add') {
                this.submitAdd();
            } else {
                this.submitEdit();
            }
        },
        async submitAdd() {
            const res = await addIndustry(this.oprateInfo);
            console.log(res);

            if (res.flag) {
                this.$message.success('添加成功');
                this.getData();
            } else {
                this.$message.error('添加失败');
            }
            this.dialogVisible = false;
        },
        async submitEdit() {
            const res = await updateIndustry({
                name: this.oprateInfo.oldName,
                afterName: this.oprateInfo.name,
            });
            console.log(res);

            if (res.flag) {
                this.$message.success('添加成功');
                this.getData();
            } else {
                this.$message.error('添加失败');
            }
            this.dialogVisible = false;
        },
        async remove(name) {
            const result = await this.$confirm(
                '此操作将删除该行业, 是否继续?',
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
                const res = await removeIndustry(name);
                console.log(res);

                if (res.flag) {
                    this.$message.success('添加成功');
                    this.getData();
                } else {
                    this.$message.error('添加失败');
                }
            }
        },
        reset() {
            this.oprateInfo.name = '';
        },
    },
    created() {
        this.getData();
    },
};
</script>

<style></style>
