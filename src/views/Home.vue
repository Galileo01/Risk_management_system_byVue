<template>
    <div class="home">
        <el-container direction="vertical">
            <GeneralHeader>
                <div class="left-wapper">
                    <el-tooltip
                        placement="left"
                        content="查看消息"
                        effect="light"
                        ><el-icon
                            class="el-icon-chat-dot-round message"
                            @click.native="goMessage"
                    /></el-tooltip>
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
                        <span>{{ accountName }}</span>
                    </div>
                    <el-button size="mini" type="danger" @click="logout"
                        >退出</el-button
                    >
                </div>
            </GeneralHeader>
            <el-container>
                <el-aside :width="asideWidth"
                    ><div class="collapse" @click="collapse">
                        <i :class="iconClass"></i>
                    </div>
                    <HomeAsideMenu
                        :isCollapse="isCollapse"
                        ref="asidemenu"
                    ></HomeAsideMenu
                ></el-aside>
                <el-main>
                    <keep-alive include="General"
                        ><router-view
                            @choose="chooseCompany"
                            @changeToUnchange="unchooseCompany"
                        ></router-view></keep-alive
                ></el-main>
            </el-container>
        </el-container>
        <MessageAlert v-if="isShowAlert" @alert-close="is_show_alert = false" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import HomeAsideMenu from 'components/home/HomeAsideMenu';
import GeneralHeader from 'components/com/GeneralHeader';
import MessageAlert from 'components/com/MessageAlert';
import { getMyMessages } from 'network/message';
export default {
    name: 'Home',
    data() {
        return {
            //侧边栏 菜单
            isCollapse: false, //是否折叠
            is_show_alert: true,
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
        isShowAlert() {
            const messageMiss = this.$store.state.messageMiss;
            return messageMiss && this.is_show_alert;
        },
        ...mapGetters(['accountName', 'UserRole']),
    },
    methods: {
        async logout() {
            const result = await this.$confirm(
                '此操作将退出此系统, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((error) => error);
            console.log(result);

            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                sessionStorage.clear();
                localStorage.clear();
                this.$store.commit('clearState');
                this.$router.push('/login');
                this.$message.success('成功退出');
            }
        },
        collapse() {
            this.isCollapse = !this.isCollapse;
        },
        goProfile() {
            this.$router.push(`/home/person_info`);
            this.$store.commit('changeActivePath', ''); //取消 侧边栏的选中
        },
        chooseCompany() {
            this.$refs.asidemenu.changeToChoosed();
            sessionStorage.setItem('ischoose', 'true');
            this.$store.dispatch('reqDangerTypes');
            this.$store.dispatch('reqStaffs');
            this.$store.dispatch('reqEnterpriseLocation');
        },
        unchooseCompany() {
            this.$refs.asidemenu.changeToUnchoose();
            // console.log(1222);
            sessionStorage.setItem('ischoose', 'false');
        },
        //进入 消息页面
        goMessage() {
            this.$router.push('/message');
        },
        async _getMyMessage() {
            const res = await getMyMessages({});
            if (!res.flag) return this.$message.error('消息获取失败');
            const find = res.messages.find((item) => item.statue === 1); //寻找 是否还有 没有确认的消息
            if (!find) {
                this.$store.commit('changeMiss', false);
            }
        },
    },
    components: {
        HomeAsideMenu,
        GeneralHeader,
        MessageAlert,
    },
    created() {
        this._getMyMessage();
    },
    mounted() {
        //页面刷新后 同时也刷新vuex 的状态
        this.$store.dispatch('reqDangerTypes');
        this.$store.dispatch('reqStaffs');
        this.$store.dispatch('reqEnterpriseLocation');
        // console.log('mounted');
    },
};
</script>

<style scoped lang="less">
.home {
    height: 100%;
}
.el-container {
    height: 100%;
}

.el-aside {
    background-color: #f2f2f2;
    overflow-x: hidden;
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
    .message {
        font-size: 25px;
        margin-right: 10px;
        cursor: pointer;
    }
}
</style>
