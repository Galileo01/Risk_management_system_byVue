<template>
    <div class="set-account">
        <BreadNav :texts="['基础设置', '账号管理']" />
        <el-card>
            <el-row>
                <el-col :span="2" :offset="20"
                    ><el-button type="primary" @click="addAccount" size="small"
                        >添加账号</el-button
                    ></el-col
                >
                <el-col :span="2"
                    ><el-button type="success" @click="_getUSers" size="small"
                        >查询</el-button
                    ></el-col
                >
            </el-row>
            <el-form
                :model="query"
                inline
                label-width="70px"
                size="mini"
                class="input-query"
            >
                <el-form-item label="姓名" prop="name"
                    ><el-input
                        v-model="query.name"
                        clearable
                        size="mini"
                        @clear="_getUSers"
                        @keyup.enter.native="_getUSers"
                    ></el-input
                ></el-form-item>
                <el-form-item label="权限" prop="permission"
                    ><el-select
                        v-model="query.permission"
                        clearable
                        size="mini"
                        @clear="_getUSers"
                    >
                        <el-option
                            v-for="(item, index) in levels"
                            :label="item.label"
                            :key="index"
                            :value="item.value"
                        ></el-option> </el-select
                ></el-form-item>
                <el-form-item label="职位" prop="position" @clear="_getUSers">
                    <el-input
                        v-model="query.position"
                        clearable
                        size="mini"
                        @keyup.enter.native="_getUSers"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="行业名称"
                    prop="industryName"
                    v-if="Role == 0"
                >
                    <el-input
                        size="mini"
                        clearable
                        v-model="query.industryName"
                        @clear="_getUSers"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="企业名称"
                    prop="enterpriseName"
                    v-if="Role <= 1"
                >
                    <el-input
                        size="mini"
                        clearable
                        v-model="query.enterpriseName"
                        @clear="_getUSers"
                    ></el-input>
                </el-form-item>
            </el-form>
            <AccountTable :tableData="showData" @edit="edit" @remove="remove" />
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="query.page"
                :page-sizes="[5, 10]"
                :page-size="query.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="query.total"
            ></el-pagination>
        </el-card>
        <el-dialog
            :visible.sync="dialogVisible"
            :title="typeText + '账户'"
            @close="reset"
            top="40px"
        >
            <el-form
                :model="oprateAccount"
                ref="form"
                label-width="80px"
                :rules="formRules"
            >
                <el-form-item label="行业" prop="industryName">
                    <el-select
                        v-model="oprateAccount.industryName"
                        v-if="formInputType.industryID === 'select'"
                        size="medium"
                    >
                        <el-option
                            v-for="(item, index) in industrys"
                            :key="index"
                            :label="item"
                            :value="item"
                        ></el-option>
                    </el-select>
                    <el-input
                        v-else
                        v-model="oprateAccount.industryName"
                        clearable
                        size="medium"
                    ></el-input>
                    <el-button
                        type="primary"
                        size="medium"
                        @click="changeInputType('industryID')"
                        >{{
                            formInputType.industryID === 'select'
                                ? '新建输入'
                                : '选择已有'
                        }}</el-button
                    >
                </el-form-item>
                <el-form-item label="企业" prop="enterpriseName"
                    ><el-select
                        v-model="oprateAccount.enterpriseName"
                        style="width:300px"
                        v-if="formInputType.companyID === 'select'"
                        size="medium"
                    >
                        <el-option
                            v-for="(item, index) in companys[
                                oprateAccount.industryName
                            ]"
                            :key="index"
                            :value="item.name"
                            :label="item.name"
                        ></el-option>
                    </el-select>
                    <el-input
                        v-else
                        v-model="oprateAccount.enterpriseName"
                        style="width:300px"
                        clearable
                        size="medium"
                    ></el-input>
                    <el-button
                        type="primary"
                        size="medium"
                        @click="changeInputType('companyID')"
                        >{{
                            formInputType.companyID === 'select'
                                ? '新建输入'
                                : '选择已有'
                        }}</el-button
                    >
                </el-form-item>
                <el-form-item
                    label="账户名"
                    prop="account"
                    v-if="dialogType === 'add'"
                >
                    <el-input
                        clearable
                        v-model="oprateAccount.account"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="密码"
                    v-if="dialogType === 'add'"
                    prop="password"
                >
                    <el-input
                        show-password
                        clearable
                        v-model="oprateAccount.password"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input
                        clearable
                        v-model="oprateAccount.name"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="TEL" prop="TEL">
                    <el-input
                        style="width:400px"
                        clearable
                        v-model="oprateAccount.TEL"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="职位" prop="position">
                    <el-input
                        style="width:400px"
                        clearable
                        v-model="oprateAccount.position"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="Email">
                    <el-input
                        style="width:300px"
                        clearable
                        v-model="oprateAccount.Email"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="权限等级"
                    prop="permission"
                    v-if="!(dialogType === 'edit' && Role !== 0)"
                >
                    <el-select v-model="oprateAccount.permission" size="medium">
                        <el-option
                            v-for="(item, index) in levels"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="IMEI码"
                    prop="IMEI"
                    v-if="dialogType === 'add'"
                >
                    <el-input
                        v-model="oprateAccount.IMEI"
                        size="medium"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import AccountTable from 'components/setting/AccountTable';
import {
    getUsers,
    addAccount,
    updateAccount,
    deleteUser,
} from 'network/account';
import { getIndustrys, getCompanys } from 'network/company';
export default {
    name: 'SetAccount',
    data() {
        return {
            accounts: [],
            showData: [],
            query: {
                page: 1,
                size: 10,
                total: 0,
                account: [],
                name: '',
                permission: '',
                position: '',
                industryName: '',
                enterpriseName: '', //localStorage.getItem('enterpriseName')
            },
            dialogVisible: false,
            dialogType: 'show', //对话框 此时的类型  show/edit
            formInputType: {
                // 用于描述对话框的 表单中 companyID 和 industryID 的 输入方式 : select/input
                companyID: 'select',
                industryID: 'select',
            },
            oprateAccount: {
                industryName: '',
                enterpriseName: '',
                account: '',
                TEL: '',
                Email: '',
                permission: 3,
                name: '',
                password: '',
                IMEI: '',
                position: '',
            }, //正在操作的 账户对象
            industrys: [],
            companys: [],
            levels: [
                { label: '行业管理员', value: 1 },
                { label: '企业管理员', value: 2 },
                { label: '安检员', value: 3 },
            ], //权限 等级
            formRules: {
                permission: [
                    {
                        required: true,
                        message: '请选择权限等级',
                        trigger: 'blur',
                    },
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur',
                    },
                ],
                IMEI: [
                    {
                        required: true,
                        message: '请输入IMEI',
                        trigger: 'blur',
                    },
                ],
                enterpriseName: [
                    {
                        required: true,
                        message: '请选择/输入企业',
                        trigger: 'blur',
                    },
                ],
                industryName: [
                    {
                        required: true,
                        message: '请选择/输入行业',
                        trigger: 'blur',
                    },
                ],
                account: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                ],
                name: [
                    {
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur',
                    },
                ],
                permission: [
                    {
                        required: true,
                        message: '请选择权限',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    computed: {
        typeText() {
            if (this.dialogType === 'edit') return '修改';
            else return '添加';
        },
        Role() {
            return localStorage.getItem('Role');
        },
    },
    methods: {
        async _getUSers() {
            const res = await getUsers({ ...this.query, limit: 9999 });
            console.log(res);
            if (!res.flag) return this.$message.error('用户获取失败');
            this.accounts = res.users;
            const { size, page } = this.query;
            const offset = (page - 1) * size;
            this.showData = this.accounts.slice(offset, offset + size);
            this.query.total = res.users.length;
        },

        async getData() {
            Promise.all([
                getIndustrys({ page: 1, limit: 9999 }),
                getCompanys({
                    page: 1,
                    limit: 9999,
                }),
            ])
                .then((res) => {
                    // console.log(res);
                    const insdustrys = res[0].industrys;
                    const companys = res[1].enterprises;
                    this.industrys = insdustrys.map((item) => item.name);
                    for (const ins of insdustrys) {
                        const coms = companys.filter(
                            (val) => val.industryName === ins.name
                        );
                        this.companys[ins.name] = coms;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$message.error('行业/企业列表获取失败');
                });
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
            this.showData = this.accounts.slice(offset, offset + size);
        },
        addAccount() {
            this.dialogType = 'add';
            this.oprateAccount.password = '';
            this.dialogVisible = true;
        },
        edit(accountID) {
            this.oprateAccount = this.accounts.find(
                (val) => val.userID === accountID
            );
            this.dialogVisible = true;
            this.dialogType = 'edit';
        },
        async remove(accountID) {
            const result = await this.$confirm(
                '此操作将删除该账号, 是否继续?',
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
                const user = this.accounts.find(
                    (val) => val.userID === accountID
                );
                if (user.permission < this.Role)
                    return this.$message.error('权限不够');

                const res = await deleteUser(user.enterpriseName, user.name);
                console.log(res);
                if (res.flag) {
                    this.$message.success('删除成功');
                    this._getUSers();
                } else this.$message.error('删除失败');
            }
        },
        //更改  描述表单输入的 方式 对象
        changeInputType(attr) {
            const pre = this.formInputType[attr];
            if (this.Role != 0 && pre === 'select')
                return this.$message.error('权限不够');

            this.formInputType[attr] = pre === 'select' ? 'input' : 'select';
            this.oprateAccount[attr] = '';
        },
        //重置  oprateAccount 对象
        reset() {
            this.oprateAccount = {
                industryName: '',
                enterpriseName: '',
                account: '',
                TEL: '',
                Email: '',
                permission: 3,
                name: '',
                password: '',
                IMEI: '',
            };
        },
        submit() {
            this.$refs.form.validate(async (valid) => {
                if (!valid) return;
                switch (this.dialogType) {
                    case 'add':
                        if (this.oprateAccount.permission < this.Role)
                            //只能创建 权限比自己低的用户
                            return this.$message.info('不能创建权限更高的用户');

                        const res = await addAccount(this.oprateAccount);

                        if (!res.flag)
                            return this.$message.error('账号添加失败');
                        else {
                            this.$message.success('账号添加成功');
                            this._getUSers();
                            this.$store.dispatch('reqStaffs'); //刷新vuex
                        }
                        break;
                    case 'edit':
                        const res1 = await updateAccount(this.oprateAccount);
                        console.log(res1);
                        if (!res1.flag) return this.$message.error('修改失败');
                        else {
                            this.$message.success('修改成功');
                            this._getUSers();
                            this.$store.dispatch('reqStaffs'); //刷新vuex
                        }
                        break;
                }

                this.dialogVisible = false;
            });
        },
    },
    created() {
        this._getUSers();
        this.getData();
    },
    components: {
        AccountTable,
    },
};
</script>

<style scoped lang="less">
.el-dialog {
    .el-form-item /deep/ .el-button {
        margin-left: 50px;
    }
    .el-form .el-input {
        width: 200px;
    }
    .el-form-item {
        margin-bottom: 16px;
    }
}
.el-dialog__wrapper {
    /deep/ .el-dialog__footer {
        padding-top: 0px;
    }
}
.input-query.el-form {
    /deep/ .el-form-item {
        margin-right: 0;
    }
}
</style>
