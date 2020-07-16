<template>
    <div class="danger_print">
        <el-main>
            <el-card>
                <el-row type="flex" class="ali-c ">
                    <el-col :span="20" class="title">
                        <h2>
                            隐患信息[{{ stateText(dangerInfo.state) }}][{{
                                dangerInfo.createTime
                            }}]
                        </h2></el-col
                    >
                    <el-col :span="4">
                        <el-button size="medium" type="primary" @click="print"
                            >打印</el-button
                        ></el-col
                    ></el-row
                >
                <el-row type="flex"
                    ><el-col :span="10">
                        <el-row>
                            <el-col :span="4">隐患类型 :</el-col>
                            <el-col :span="20">{{
                                dangerInfo.riskTypeName
                            }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">上报时间 :</el-col>
                            <el-col :span="20">{{
                                dangerInfo.createTime
                            }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">关联设备 :</el-col>
                            <el-col :span="20">{{
                                dangerInfo.deviceName
                            }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">位置描述 :</el-col>
                            <el-col :span="20">{{ deviceInfo.address }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">隐患描述 :</el-col>
                            <el-col :span="20">{{
                                dangerInfo.note || '无'
                            }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="14" v-if="position.length !== 0">
                        <el-amap
                            vid="amapDemo"
                            class="amap"
                            :center="position"
                            :zoom="16"
                            ref="amap"
                        >
                            <el-amap-circle-marker
                                :center="position"
                                :radius="10"
                                :strokeWeight="1"
                                fill-color="#0000FE"
                                v-if="position.length != 0"
                            />
                            <el-amap-info-window
                                :position="position"
                                :visible="true"
                            >
                                {{ position }}</el-amap-info-window
                            >
                        </el-amap>
                    </el-col>
                </el-row>
                <el-row>图片佐证</el-row>
                <el-row>
                    <img
                        :src="item"
                        :alt="'图片' + index"
                        v-for="(item, index) in dangerInfo.imgs"
                        :key="index"
                    />
                </el-row>
                <el-row type="flex">
                    <el-col :span="5">打印人 :{{ accountName }}</el-col>
                    <el-col :span="6" :offset="11"
                        >打印时间 :{{ now | date }}</el-col
                    >
                </el-row>
            </el-card>
        </el-main>
    </div>
</template>

<script>
import Amap from 'vue-amap';
import Vue from 'vue';
import { lazyAMapApiLoaderInstance } from 'vue-amap';
import { formatDate } from 'commonjs/utils';
import { getDangers, getDeviceByriskID } from 'network/danger';
//初始化地图组件
// Vue.use(Amap);
// Amap.initAMapApiLoader({
//     // 申请的高德key
//     key: '6e350de4372aea6e14e89161fe4816c0',
//     // 插件集合
//     plugin: ['ToolBar', 'MapType'],
// });

export default {
    name: 'DangerPrint',
    props: {
        id: String,
    },
    data() {
        return {
            dangerInfo: {},
            position: [
                localStorage.getItem('longitude'),
                localStorage.getItem('latitude'),
            ],
            now: '',
            isPositionGet: false, //标记位置信息是否 通过
            deviceInfo: {},
        };
    },
    computed: {
        accountName() {
            return this.$store.getters.accountName;
        },
    },
    filters: {
        date(value) {
            return formatDate(value, 'yyyy-MM-dd hh:mm:ss');
        },
    },
    methods: {
        async getData() {
            //优先请求 设备信息
            let res = await await getDeviceByriskID(this.id);
            if (!res.flag) return this.$message.error('设备位置获取失败');
            console.log(res);

            const { latitude, longitude } = res.devices[0];
            this.deviceInfo = res.devices[0];
            this.position = [parseFloat(longitude), parseFloat(latitude)];
            res = await await getDangers({
                page: 1,
                limit: 9999,
                riskID: this.id,
            });
            if (!res.flag) return this.$message.error('设备位置获取失败');
            console.log(res);

            this.dangerInfo = res.risks[0];
        },
        print() {
            window.print();
        },
        stateText(state) {
            const texts = ['未处理', '已处理'];
            return texts[state];
        },
    },
    created() {
        this.getData();
        this.now = new Date().toString();
        // localStorage.removeItem('_AMap_raster');
    },
    mounted() {
        // lazyAMapApiLoaderInstance.load().then(() => {
        //     localStorage.removeItem('_AMap_raster');
        // });
    },
};
</script>

<style scoped lang="less">
/deep/ .el-card {
    width: 100%;
}
.el-main {
    width: 1000px;
    margin: 0 auto;
    .title h2 {
        text-align: center;
        font-size: 1.5em;
    }
    .el-row {
        margin-bottom: 20px;
    }
    .el-col {
        font-size: 14px;
    }
    .amap {
        width: 500px;
        height: 300px;
    }
    img {
        width: 300px;
        margin-right: 10px;
    }
}
</style>
