<template>
    <div class="login">
        <!-- <h1 class="title">永川区非煤矿山企业安全检查监督管理平台</h1> -->
        <h1 class="title">重大风险隐患排查及监督治理系统</h1>
        <div class="form-wapper">
            <div class="avator">
                <img src="~assets/img/login.png" alt="" />
            </div>

            <el-form
                :model="formData"
                ref="form"
                :rules="rules"
                @keyup.enter.native="login"
            >
                <el-form-item prop="username">
                    <el-input
                        v-model="formData.username"
                        placeholder="用户名"
                        clearable
                        prefix-icon="el-icon-user"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        v-model="formData.password"
                        placeholder="密码"
                        clearable
                        prefix-icon="el-icon-lock"
                        type="password"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item prop="identify">
                    <div class="identify-wapper">
                        <el-input
                            class="identify-input"
                            placeholder="输入验证码"
                            v-model="formData.identify"
                        ></el-input>
                        <s-identify
                            :contentWidth="150"
                            :contentHeight="40"
                            class="idfentify"
                            :identifyCode="identifyCode"
                            @click.native="generateIdentify"
                        ></s-identify>
                    </div>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { log } from 'util';
import md5 from 'js-md5';
import SIdentify from 'components/com/identify';
import { logReq, checkToken } from 'network/account';
export default {
    name: 'Login',
    data() {
        return {
            formData: {
                username: '',
                password: '',
                identify: '',
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                identify: [
                    {
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur',
                    },
                ],
            },
            identifyCode: '1234', // 验证码
        };
    },
    methods: {
        reset() {
            this.$refs.form.resetFields();
        },
        login() {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    //基本验证 通过
                    if (this.identifyCode === this.formData.identify) {
                        const res = await logReq(
                            this.formData.username,
                            this.formData.password
                        );
                        console.log('login', res);

                        if (res.flag) {
                            const {
                                permission: role,
                                token,
                                enterpriseName,
                                industryName,
                                userName: username,
                            } = res;
                            window.localStorage.setItem('token', token);
                            localStorage.setItem(
                                'enterpriseName',
                                enterpriseName
                            );
                            this.$store.commit('getUserdata', {
                                token,
                                role,
                                accountName: this.formData.username,
                                username,
                                industryName: industryName,
                                password: md5(this.formData.password),
                            });
                            if (industryName)
                                localStorage.setItem(
                                    'industryName',
                                    industryName
                                );
                            if (role == 0) {
                                //系统管理员 进入 账号管理页面
                                this.$router.push('/home/account_manage');
                                this.$store.commit(
                                    'changeActivePath',
                                    'account_manage'
                                );
                            } else if (role === 1) {
                                //行业管理员 进入 企业选择 页面
                                this.$router.push('/home/company_choose');
                                this.$store.commit(
                                    'changeActivePath',
                                    'company_choose'
                                );
                            } //企业管理员 进入 企业履历
                            else if (role === 2) {
                                this.$router.push('/home/general');
                                this.$store.commit(
                                    'changeActivePath',
                                    'general'
                                );
                            } else if (role === 3) {
                               return this.$message.error('权限过低，无法登录系统');
                            }
                            this.$message.success('登录成功');
                        } else {
                            this.$message.error('用户名或密码错误');
                        }
                    } else {
                        this.$message.error('验证码错误');
                        this.formData.identify = '';
                        this.generateIdentify();
                    }
                }
            });
        },
        generateIdentify() {
            let count = 1;
            let code = '';
            while (count <= 4) {
                const num = Math.floor(Math.random() * 10);
                code += num;
                count++;
            }
            this.identifyCode = code;
        },
        async autoLogin() {
            if (localStorage.getItem('token')) {
                //本地存有 token
                //发送自动登录请求，若 token 没有过期 就自动进入 进入首页,并保存 传回的 用户信息
                const res = await checkToken();
                if (res.status !== 200)
                    return this.$message.error('状态过期，请重新登录');

                this.$message.success('自动登录');
                const role = localStorage.getItem('Role'); //根据 本地存储的 上次 登录的 role
                if (role == 0) {
                    //系统管理员 进入 账号管理页面
                    this.$router.push('/home/account_manage');
                    this.$store.commit('changeActivePath', 'account_manage');
                } else if (role == 1) {
                    //行业管理员 进入 企业选择 页面
                    this.$router.push('/home/company_choose');
                    this.$store.commit('changeActivePath', 'company_choose');
                } //企业管理员 进入 企业履历
                else {
                    this.$router.push('/home/general');
                    this.$store.commit('changeActivePath', 'general');
                }
            } else {
                //随机生成 数字 验证码
                this.generateIdentify();
            }
        },
    },
    created() {
        this.autoLogin();
        console.log(this.$store.state);
    },
    components: {
        's-identify': SIdentify,
    },
};
</script>

<style lang="less" scoped>
.login {
    width: 100%;
    height: 100%;
    background-color: #ecf0f5;
}
.form-wapper {
    height: 330px;
    width: 450px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 4px;
}
.el-form {
    margin-top: 90px;
    padding: 0 10px;
    .btns {
        display: flex;
        justify-content: flex-end;
        padding-right: 10px;
    }
}
.avator {
    position: absolute;
    top: -60px;
    background-color: #fff;
    border-radius: 50%;
    padding: 5px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 10px #ddd;
    img {
        height: 120px;
        width: 120px;
        border-radius: 50%;
    }
}
h1.title {
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translate(-50%);
}

.identify-wapper {
    display: flex;
    justify-content: space-between;
    .identify-input {
        width: 140px;
    }
}
</style>
