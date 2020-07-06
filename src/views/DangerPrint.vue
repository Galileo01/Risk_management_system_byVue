<template>
    <div class="danger_print">
        <el-main>
            <el-card>
                <el-row type="flex" class="ali-c ">
                    <el-col :span="20" class="title">
                        <h2>
                            隐患信息[{{ dangerInfo.examState }}][{{
                                dangerInfo.ge_time
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
                                dangerInfo.dangerType
                            }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">上报人员 :</el-col>
                            <el-col :span="20">{{ dangerInfo.staff }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">上报时间 :</el-col>
                            <el-col :span="20">{{ dangerInfo.ge_time }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">关联设备 :</el-col>
                            <el-col :span="20">{{
                                dangerInfo.deivceNum
                            }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">位置描述 :</el-col>
                            <el-col :span="20">{{
                                dangerInfo.addressDes
                            }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">隐患描述 :</el-col>
                            <el-col :span="20">{{
                                dangerInfo.dangerDes
                            }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="14" v-if="position.length != 0">
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
import { getDangers } from 'network/danger';
import { getDevice } from 'network/device';
//初始化地图组件
Vue.use(Amap);
Amap.initAMapApiLoader({
    // 申请的高德key
    key: '6e350de4372aea6e14e89161fe4816c0',
    // 插件集合
    plugin: ['ToolBar', 'MapType'],
});
lazyAMapApiLoaderInstance.load().then(() => {

    localStorage.removeItem('_AMap_raster');
})

export default {
    name: 'DangerPrint',
    props: {
        id: String,
    },
    data() {
        return {
            dangerInfo: {},
            position: [],
            now: '',
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
            let res = await getDangers({
                page: 1,
                limit: 9999,
                riskID: this.id,
            });
            console.log(res);
            if (!res.flag) {
                return this.$message.error('风险数据失败');
            } else {
                this.dangerInfo = res.risks[0];

                res = await getDevice({
                    page: 1,
                    limit: 1,
                    name: this.dangerInfo.deviceName,
                });
                console.log(res);

                if (!res.flag) return this.$message.error('设备信息获取失败');
                else {
                    const { latitude, longitude } = res.devices[0];
                    this.position = [
                        parseFloat(longitude),
                        parseFloat(latitude),
                    ];
                    console.log(parseFloat(longitude), parseFloat(latitude));
                }
            }

            this.dangerInfo = {
                dangerNum: '123',
                deivceNum: 'R017',
                dangerType: '安全隐患',
                staff: '李沛儒',
                ge_time: '2019-11-27 07:41:33', // 生成时间
                addressDes: '低压变电房前', //位置描述
                dangerDes: '杂物乱堆', //异常/隐患描述
                examState: '未处理',
                imgs: [
                    'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/reportInfo/301/3dde9027efdb49fa898a9b8e8e05bf15.jpg',
                    'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/reportInfo/283/4640e1b78dbc4d47bf938a8dd5ab3908.jpg',
                ],
            };
            // this.position = [105.757223, 29.3326];
        },
        print() {
            window.print();
        },
    },
    created() {
        this.getData();
        this.now = new Date().toString();
        // localStorage.removeItem('_AMap_raster');
    },
    mounted() {
        // localStorage.removeItem('_AMap_raster');
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
