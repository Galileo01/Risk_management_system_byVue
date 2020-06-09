<template>
    <div class="company_choose">
        <BreadNav :texts="['综合浏览', '选择企业']" />
        <h3>{{ industryName }}</h3>
        <el-card class="wapper">
            <el-card
                v-for="(item, index) in companys"
                :key="index"
                class="item"
                shadow="hover"
            >
                <span> {{ item.name }}</span>
                <el-button @click="choose(item.name)">选择此公司</el-button>
            </el-card>
        </el-card>
    </div>
</template>

<script>
import { getCompanys } from 'network/company';
import { checkToken } from 'network/account';
export default {
    name: 'CompanyChoose',
    data() {
        return {
            companys: {},
            industryName: '',
        };
    },
    methods: {
        async getData() {
            const state = await checkToken();
            console.log(state);

            const res = await getCompanys({
                page: 1,
                limit: 9999,
                industryName: localStorage.getItem('industryName'),
            });
            // console.log(res);
            if (!res.flag) return this.$message.error('企业列表获取失败');

            this.companys = res.enterprises;
            this.industryName = localStorage.getItem('industryName');
        },
        choose(name) {
            localStorage.setItem('enterpriseName', name);
            this.$store.commit('changeActivePath', 'general');
            this.$emit('choose');
            this.$router.push('/home/general');
        },
    },
    created() {
        this.$emit('changeToUnchange'); //进入companychoose 页面 始终把 页面状态改为 未选择公司\
        this.getData();
    },
};
</script>

<style scoped lang="less">
h3 {
    padding-left: 10px;
}
/deep/ .wapper .el-card__body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
        margin-bottom: 20px;
        background-color: #f2f2f2;
        border: 1px solid #e6e6e6;
    }
    .item {
        width: 48%;
        height: 100px;
    }
}
</style>
