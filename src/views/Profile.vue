<template>
    <div class="profile">
        <BreadNav :texts="['个人信息']" />
        <el-card>
            <el-row type="flex">
                <el-col :span="6" :offset="1">
                    <div class="wapper">
                        <img :src="userdata.avatar || defalutAvatar" alt="" />
                        <div class="btns">
                            <el-upload
                                action="https://jsonplaceholder.typicode.com/posts/"
                                ><el-button size="mini" type="primary"
                                    >上传</el-button
                                ></el-upload
                            >
                        </div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <el-form :model="userdata" label-width="70px">
                        <el-form-item label="账户名" prop="accountName">
                            <el-input v-model="userdata.accountName"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-button
                                type="primary"
                                size="mini"
                                @click="dialogVisible = true"
                                >修改密码</el-button
                            >
                        </el-form-item>
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="userdata.name"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-radio v-model="userdata.sex" label="female"
                                >女</el-radio
                            >
                            <el-radio v-model="userdata.sex" label="male"
                                >男</el-radio
                            >
                        </el-form-item>
                        <el-form-item label="职位" prop="position">
                            <el-input v-model="userdata.position"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="userdata.email"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="mobile"
                            ><el-input v-model="userdata.mobile"></el-input
                        ></el-form-item>
                        <el-form-item label="居住地址" prop="address"
                            ><el-input
                                v-model="userdata.address"
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
        <el-dialog :visible.sync="dialogVisible" title="修改密码" width="40%">
            <div class="input-wa">
                <span>旧密码</span>
                <el-input
                    v-model="passwords.old"
                    type="password"
                    show-password
                ></el-input>
            </div>
            <div class="input-wa">
                <span>新密码</span
                ><el-input
                    v-model="passwords.thenew"
                    type="password"
                    show-password
                ></el-input>
            </div>
            <span slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitChangePass"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'Profile',
    data() {
        return {
            id: 0,
            userdata: this.$store.getters.userdata,
            defalutAvatar: require('../assets/img/default-avatar.jpg'),
            dialogVisible: false,
            passwords: {
                old: '',
                thenew: ''
            },
        };
    },
    computed: {
        ...mapGetters(['accountName'])
    },
    methods: {
        submitAll() {
            this.$message.success('修改成功');
        },
        submitChangePass() {
            this.$message.success('修改成功');
        }
    },
    created() {
        this.id = this.$route.params.id;
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
</style>
