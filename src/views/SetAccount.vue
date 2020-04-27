<template>
    <div class="set-account">
        <BreadNav :texts="['基础设置', '账号管理']" />
        <el-card>
            <el-row>
                <el-col :span="6"
                    ><el-input placeholder="输出关键词搜索"
                        ><el-button
                            slot="append"
                            icon="el-icon-search"
                        ></el-button></el-input
                ></el-col>
                <el-col :span="3" :offset="2"
                    ><el-button type="primary" size="medium" @click="addAccount"
                        >添加账号</el-button
                    ></el-col
                >
            </el-row>
            <AccountTable :tableData="accounts" @edit="edit" @remove="remove" />
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
        >
            <el-form
                :model="oprateAccount"
                ref="form"
                label-width="80px"
                :rules="formRules"
            >
                <el-form-item label="行业" prop="industryID">
                    <el-select
                        v-model="oprateAccount.industryID"
                        v-if="formInputType.industryID === 'select'"
                    >
                        <el-option
                            v-for="(item, index) in industrys"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <el-input
                        v-else
                        v-model="oprateAccount.industryID"
                        clearable
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
                <el-form-item label="企业" prop="companyID"
                    ><el-select
                        v-model="oprateAccount.companyID"
                        style="width:300px"
                        v-if="formInputType.companyID === 'select'"
                    >
                        <el-option
                            v-for="(item, index) in companys"
                            :key="index"
                            :value="item.value"
                            :label="item.label"
                        ></el-option>
                    </el-select>
                    <el-input
                        v-else
                        v-model="oprateAccount.companyID"
                        style="width:300px"
                        clearable
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
                <el-form-item label="账户名" prop="accountName">
                    <el-input
                        clearable
                        v-model="oprateAccount.accountName"
                    ></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input clearable v-model="oprateAccount.name"></el-input>
                </el-form-item>
                <el-form-item label="TEL" prop="mobile">
                    <el-input
                        style="width:400px"
                        clearable
                        v-model="oprateAccount.mobile"
                    ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input
                        style="width:300px"
                        clearable
                        v-model="oprateAccount.email"
                    ></el-input>
                </el-form-item>
                <el-form-item label="权限等级" prop="rightLevel">
                    <el-select
                        v-if="dialogType === 'add'"
                        v-model="oprateAccount.rightLevel"
                    >
                        <el-option
                            v-for="(item, index) in levels"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
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
import AccountTable from 'components/account/AccountTable';
export default {
    name: 'SetAccount',
    data() {
        return {
            accounts: [],
            query: {
                page: 1,
                size: 10,
                total: 0
            },
            dialogVisible: false,
            dialogType: 'show', //对话框 此时的类型  show/edit
            formInputType: {
                // 用于描述对话框的 表单中 companyID 和 industryID 的 输入方式 : select/input
                companyID: 'select',
                industryID: 'select'
            },
            oprateAccount: {
                industryID: '',
                companyID: '',
                accountName: '',
                mobile: '',
                email: '',
                rightLevel: '',
                name: ''
            }, //正在操作的 账户对象
            industrys: [],
            companys: [],
            levels: [],
            formRules: {
                industryID: [
                    { required: true, message: '请选择行业', trigger: 'blur' }
                ],
                companyID: [
                    { required: true, message: '请选择企业', trigger: 'blur' }
                ],
                accountName: [
                    {
                        required: true,
                        message: '请输入账户名称',
                        trigger: 'blur'
                    }
                ],
                rightLevel: [
                    {
                        required: true,
                        message: '请选择权限等级',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    computed: {
        typeText() {
            if (this.dialogType === 'edit') return '修改';
            else return '添加';
        }
    },
    methods: {
        getData() {
            const accounts = [
                {
                    accountID: 1,
                    industryID: 1,
                    companyID: 1,
                    accountName: 'aaa',
                    mobile: '158235674908',
                    email: '1354541676@',
                    rightLevel: 66
                },
                {
                    accountID: 2,
                    industryID: 1,
                    companyID: 1,
                    accountName: 'bbb',
                    mobile: '158235674908',
                    email: '1354541676@',
                    rightLevel: 13
                },
                {
                    accountID: 6,
                    industryID: 2,
                    companyID: 1,
                    accountName: 'aadsddsdaa',
                    mobile: '158235674908',
                    email: '1354541676@',
                    rightLevel: 66
                },
                {
                    accountID: 78,
                    industryID: 1,
                    companyID: 1,
                    accountName: 'kklkfj',
                    mobile: '158235674908',
                    email: '1354541676@',
                    rightLevel: 66
                },
                {
                    accountID: 14,
                    industryID: 1,
                    companyID: 67,
                    accountName: 'vbb55',
                    mobile: '158235674908',
                    email: '1354541676@',
                    rightLevel: 66
                },
                {
                    accountID: 78,
                    industryID: 1,
                    companyID: 1,
                    accountName: 'jkuiii',
                    mobile: '158235674908',
                    email: '1354541676@',
                    rightLevel: 66
                }
            ];

            const industrys = [
                {
                    label: '采矿',
                    value: 1
                },
                {
                    label: '建材',
                    value: 2
                }
            ];
            const companys = [
                {
                    label: '重庆市永川区金银坡斗子丘建材有限公司',
                    value: 1
                },
                {
                    label: '重庆安瑞建材有限公司',
                    value: 2
                },
                {
                    label: '重庆翰星建材有限责任公司',
                    value: 3
                },
                {
                    label: '重庆市上善建材有限公司',
                    value: 4
                }
            ];
            const levels = [
                {
                    label: '应急局',
                    value: 100
                },
                {
                    label: '企业主',
                    value: 50
                },
                {
                    label: '安检员',
                    value: 25
                }
            ];

            this.accounts = accounts;
            this.companys = companys;
            this.industrys = industrys;
            this.levels = levels;
        },
        addAccount() {
            this.dialogVisible = true;
            this.dialogType = 'add';
        },
        handleSizeChange() {},
        handleCurrentChange() {},
        edit(accountID) {
            this.oprateAccount = this.accounts.find(
                val => val.accountID === accountID
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
                    type: 'warning'
                }
            ).catch(error => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                this.$message.success('成功');
            }
        },
        //更改  描述表单输入的 方式 对象
        changeInputType(attr) {
            const pre = this.formInputType[attr];
            this.formInputType[attr] = pre === 'select' ? 'input' : 'select';
            this.oprateAccount[attr] = '';
        },
        //重置  oprateAccount 对象
        reset() {
            this.oprateAccount = {
                industryID: '',
                companyID: '',
                accountName: '',
                mobile: '',
                email: '',
                rightLevel: '',
                name: ''
            };
        },
        submit() {
            this.$refs.form.validate(valid => {
                if (!valid) return;
                switch (this.dialogType) {
                    case 'add':
                        this.$message.success('账号添加成功');
                        break;
                    case 'edit':
                        this.$message.success('账号修改成功');
                }

                this.dialogVisible = false;
            });
        }
    },
    created() {
        this.getData();
    },
    components: {
        AccountTable
    }
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
}
</style>
