<template>
    <div class="profile">
        <BreadNav :texts="['个人信息']" />
        <el-card>
            <el-row type="flex">
                <el-col :span="6" :offset="1">
                    <div class="wapper">
                        <img :src="avatar" alt="" />
                        <div class="btns">
                            <el-button
                                type="primary"
                                size="small"
                                @click="avatarDialogVisible = true"
                                >{{
                                    userInfo.avatar ? '重新上传' : '选择图片'
                                }}</el-button
                            >
                        </div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <el-form :model="userInfo" label-width="70px" size="medium">
                        <el-form-item label="账户名" prop="accountName">
                            <el-input v-model="accountName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-button
                                type="primary"
                                size="mini"
                                @click="passDialogVisible = true"
                                >修改密码</el-button
                            >
                        </el-form-item>
                        <el-form-item label="姓名" prop="name">
                            <el-input
                                v-model="userInfo.name"
                                disabled
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-radio v-model="userInfo.sex" label="female"
                                >女</el-radio
                            >
                            <el-radio v-model="userInfo.sex" label="male"
                                >男</el-radio
                            >
                        </el-form-item>
                        <el-form-item label="职位" prop="position">
                            <el-input v-model="userInfo.position"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="Email">
                            <el-input v-model="userInfo.Email"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="TEL"
                            ><el-input v-model="userInfo.TEL"></el-input
                        ></el-form-item>
                        <el-form-item label="居住地址" prop="address"
                            ><el-input
                                v-model="userInfo.address"
                                style="width:300px"
                            ></el-input
                        ></el-form-item>
                    </el-form>
                    <div class="footer">
                        <el-button type="primary" @click="submitAll"
                            >提交</el-button
                        >
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <MKDialog
            :visible.sync="passDialogVisible"
            title="修改密码"
            width="40%"
            @dialog-cancel="passDialogVisible = false"
            @dialog-confirm="submitChangePass"
            @close="resetInput"
        >
            <el-form
                :model="userInfo"
                ref="passForm"
                label-width="70px"
                size="medium"
                :rules="rules"
                status-icon
            >
                <el-form-item label="旧密码" prop="pass_old">
                    <el-input
                        v-model="userInfo.pass_old"
                        type="password"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pass_new">
                    <el-input
                        v-model="userInfo.pass_new"
                        type="password"
                        show-password
                    ></el-input> </el-form-item></el-form
        ></MKDialog>
        <MKDialog
            :visible.sync="avatarDialogVisible"
            title="选择本地图片"
            width="40%"
            @dialog-cancel="avatarDialogVisible = false"
            @dialog-confirm="submitAvatar"
            confirmText="上传"
            @close="resetFIle"
        >
            <el-image :src="avatarChoose">
                <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>
            <el-button @click="bntCLick" size="small" type="primary"
                >选择图片</el-button
            >
            <input
                type="file"
                v-show="false"
                ref="file_input"
                @change="fileChoose"
            />
        </MKDialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import md5 from 'js-md5';
import {
    updateAccount,
    getUsers,
    updatePass,
    updateAvatar,
} from 'network/account';
import MKDialog from 'components/com/MKDialog';
const oldPassCheck = (rule, value, callback) => {
    if (!value) callback(new Error('请输入旧密码'));
    if (md5(value) === localStorage.getItem('password')) return callback();
    callback(new Error('旧密码错误'));
};
export default {
    name: 'Profile',
    data() {
        return {
            defalutAvatar: require('../assets/img/default-avatar.jpg'),
            passDialogVisible: false,
            Username: '',
            userInfo: {},
            rules: {
                pass_old: [
                    {
                        required: true,
                        validator: oldPassCheck,
                        trigger: 'blur',
                    },
                ],
                pass_new: [
                    {
                        required: true,
                        message: '请输入新密码',
                        trigger: 'blur',
                    },
                ],
            },
            avatarDialogVisible: false,
            avatarChoose: null,
        };
    },
    computed: {
        ...mapGetters(['accountName']),
        avatar() {
            if (!this.userInfo.avatar)
                return require('../assets/img/default-avatar.jpg');
            else {
                let avatar = this.userInfo.avatar;
                console.log(avatar);
                avatar = sessionStorage.getItem('baseURL') + avatar.slice(49);
                console.log(avatar);
                return avatar;
            }
        },
    },
    methods: {
        async getData() {
            const res = await getUsers({
                name: localStorage.getItem('userName'),
                page: 1,
                limit: 9999,
            });
            if (!res.flag) return this.$message.error('用户信息获取失败');
            this.userInfo = {
                ...res.users[0],
                pass_old: '',
                pass_new: '',
                Email: res.users[0].email,
                TEL: res.users[0].tel,
            };
            console.log(res);
        },

        async submitAll() {
            const result = await this.$confirm(
                '此操作将更新您的用户信息, 是否继续?',
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
                const res = await updateAccount(this.userInfo);
                if (!res.flag) return this.$message.error('修改失败');
                console.log(res);
                this.$message.success('修改成功');
            }
        },
        async submitChangePass() {
            const res = await updatePass({
                beforePassword: this.userInfo.pass_old,
                afterPassword: this.userInfo.pass_new,
            });
            console.log(res);
            if (!res.flag) return this.$message.error('更改失败');

            this.$message.success('修改成功');
            this.passDialogVisible = false;
        },
        resetInput() {
            this.$refs.passForm.resetFields();
        },
        resetFIle() {
            this.avatar = '';
        },
        bntCLick() {
            this.$refs.file_input.click();
        },
        fileChoose() {
            const file = this.$refs.file_input.files[0];
            //读取图片文件
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.avatarChoose = reader.result;
            };
        },
        async submitAvatar() {
            const file = this.$refs.file_input.files[0];
            const formData = new FormData();
            formData.append('avatar', file);
            const res = await updateAvatar(formData);
            console.log(res);
        },
    },
    created() {
        this.getData();
    },
    components: {
        MKDialog,
    },
};
</script>

<style scoped lang="less">
.el-input {
    width: 200px;
}
.footer {
    display: flex;
    justify-content: flex-end;
}
.wapper {
    margin-top: 30px;
    img {
        width: 200px;
    }
    .btns {
        margin-top: 10px;
    }
}
.input-wa {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    span {
        margin-right: 20px;
    }
}
/deep/ .MK-dialog .el-dialog__body {
    display: flex;
    align-items: center;
}
.el-image {
    width: 150px;
    width: 150px;
    i {
        font-size: 100px;
    }
    margin-right: 20px;
}
</style>
