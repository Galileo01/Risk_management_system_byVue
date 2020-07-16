<template>
    <el-dialog
        :visible="dialogVisible"
        @update:visible="$emit('update:dialogVisible', false)"
        width="60%"
        top="50px"
        @open="getData"
        @close="closeHandle"
    >
        <el-tabs v-model="curTab">
            <el-tab-pane label="基础信息" name="base">
                <el-row>
                    <el-col :span="10">设备名称</el-col>
                    <el-col :span="14">{{ info.name }}</el-col>
                </el-row>
                <el-row class="marks">
                    <el-col :span="10">特殊标记</el-col>
                    <el-col :span="14"
                        ><el-tag>{{ info.lable }}</el-tag></el-col
                    >
                </el-row>
                <el-row>
                    <el-col :span="10">设备类型</el-col>
                    <el-col :span="14">{{ info.type }}</el-col>
                </el-row>
                <el-row class="status">
                    <el-col :span="10">设备状态</el-col>
                    <el-col :span="14">
                        <el-tag>{{ info.state }}</el-tag></el-col
                    >
                </el-row>
                <el-row>
                    <el-col :span="10">安装地址</el-col>
                    <el-col :span="14">{{ info.address }}</el-col>
                </el-row>

                <el-row>
                    <el-col :span="10">经纬度</el-col>
                    <el-col :span="14"
                        >{{ info.longitude }},{{ info.latitude }}</el-col
                    >
                </el-row>
                <el-row>
                    <el-col :span="10">安装日期</el-col>
                    <el-col :span="14">{{ info.createTime }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">生产商</el-col>
                    <el-col :span="14">{{ info.manu }}</el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="导航图文" name="navi"
                ><el-carousel
                    arrow="always"
                    :autoplay="false"
                    height="520px"
                    trigger="click"
                    class="steps"
                    ref="swipper"
                    v-if="naviImgs.length!==0"
                >
                    <el-carousel-item
                        v-for="(item, index) in naviImgs"
                        :key="index"
                        :label="index + 1"
                    >
                        <div>
                            <h4 class="step_text">第{{ index + 1 }}步</h4>
                            <img :src="item" />
                        </div>
                    </el-carousel-item> </el-carousel
            >
            <el-tag v-else type="warning">图文导航为空</el-tag>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script>
import { getStaticUrl } from 'commonjs/utils';
export default {
    name: 'DeviceDetail',
    data() {
        return {
            curTab: 'base',
            naviImgs: [],
        };
    },
    props: {
        dialogVisible: Boolean,
        info: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    methods: {
        closeHandle() {
            this.$emit('update:visible', false);
        },
        getData() {
            if (!this.info.navigation) return;
            const navmgs = this.info.navigation
                .split(',')
                .filter((item) => item)
                .map((item) => {
                    return getStaticUrl(item);
                });
            console.log(navmgs);
            this.naviImgs = navmgs;
        },
        closeHandle() {
            // this.naviImgs=[];
            this.curTab = 'base';
            this.naviImgs = [];
            //滚动到 第一张
            this.$refs.swipper.activeIndex = 0;
        },
    },
};
</script>

<style scoped lang="less">
/deep/ .el-dialog__header {
    padding: 0;
}
.el-row {
    margin-bottom: 20px;
}
.status,
.mark {
    height: 30px;
    line-height: 30px;
}
.marks {
    .el-tag {
        margin-right: 5px;
    }
}
.steps {
    img {
        height: 500px;
        width: 100%;
    }
    .step_text {
        margin: 4px auto;
        width: 50px;
    }
}
</style>
