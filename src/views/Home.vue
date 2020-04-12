<template>
    <div class="home">
        <el-container>
            <el-header>
                <div class="logo-wapper">
                    <img src="~assets/img/logo.png" alt="" class="logo" />
                    <h3>永川区非煤矿山企业安全检查监督管理平台</h3>
                </div>
                <div class="left-wapper">
                    <div class="avator" @click="goProfile">
                        <el-tooltip
                            effect="light"
                            content="设置个人信息"
                            placement="bottom"
                        >
                            <img
                                src="https://note.youdao.com/yws/api/image/normal/1576755416467?userId=1354541676%40qq.com"
                                alt=""
                            />
                        </el-tooltip>
                        <span>{{ userInfo.username }}</span>
                    </div>
                    <el-button size="mini" type="danger" @click="logout"
                        >退出</el-button
                    >
                </div>
            </el-header>
            <el-container>
                <el-aside :width="asideWidth"
                    ><div class="collapse" @click="collapse">
                        <i :class="iconClass"></i>
                    </div>
                    <HomeAsideMenu
                        :isCollapse="isCollapse"
                    ></HomeAsideMenu
                ></el-aside>
                <el-main><router-view></router-view></el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import HomeAsideMenu from 'components/home/HomeAsideMenu';
export default {
    name: 'Home',
    data() {
        return {
            //侧边栏 菜单
            isCollapse: false //是否折叠
        };
    },
    computed: {
        iconClass() {
            let c = 'el-icon-d-arrow-';
            if (this.isCollapse) {
                c += 'right';
            } else c += 'left';
            return c;
        },
        asideWidth() {
            if (this.isCollapse) {
                return '50px';
            } else {
                return '150px';
            }
        },
        userInfo() {
            return this.$store.getters.userdata;
        }
    },
    methods: {
        async logout() {
            const result = await this.$confirm(
                '此操作将退出此系统, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(error => error);
            console.log(result);

            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                window.sessionStorage.removeItem('token');
                this.$router.push('/login');
                this.$message.success('成功退出');
            }
        },
        collapse() {
            this.isCollapse = !this.isCollapse;
        },
        goProfile() {
            this.$router.push(`/home/person_info:${this.userInfo.id}`);
        }
    },
    components: {
        HomeAsideMenu
    },
    created() {
       
    }
};
</script>

<style scoped lang="less">
.home {
    height: 100%;
}
.el-container {
    height: 100%;
}
.el-header {
    background-color: #fefefe;
    display: flex;
    justify-content: space-between;
    align-items: center; /*文字居中*/
    height: 50px !important;
    border-bottom: 2px solid #008fc7;
    .logo-wapper {
        display: flex;
        height: 50px;
        align-items: center;
    }
    .logo {
        height: 40px;
        margin: 5px 0;
    }
    h3 {
        margin-left: 10px;
    }
}
.el-aside {
    background-color: #f2f2f2;
    // overflow: hidden;
    overflow-y: auto;
}
.collapse {
    font-size: 20px; //给图标 设置大小
    height: 28px;
    display: flex;
    justify-content: space-around;
    text-align: center;
    i {
        margin: 2px 0;
        border-radius: 50%;
        background-color: #fff;
        height: 24px;
        width: 24px;
        line-height: 24px;
    }
}
.el-main {
    background-color: #ffffff;
    border-left: 1px solid #d2d6de;
    padding: 0;
}
.left-wapper {
    margin-right: 10px;
    display: flex;
    align-items: center;
    .avator {
        margin-right: 30px;
        cursor: pointer;
        img {
            height: 34px;
            width: 34px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 10px;
        }
    }
}
</style>
