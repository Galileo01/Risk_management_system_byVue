<template>
    <div class="task_loction">
        <el-container>
            <el-header
                ><div class="logo-wapper">
                    <img src="~assets/img/logo.png" alt="" class="logo" />
                    <!-- <h3>永川区非煤矿山企业安全检查监督管理平台</h3> -->
                    <h3>重大风险隐患排查及监督治理系统</h3>
                </div></el-header
            >
            <el-main>
                <el-row>
                    <el-col>
                        {{ name }}
                    </el-col>
                </el-row>
                <el-amap
                    vid="amapDemo"
                    class="amap"
                    :center="center"
                    :zoom="16"
                    ref="amap"
                    :plugin="plugin"
                    ><div v-if="windowInfos.length !== 0">
                        <el-amap-circle-marker
                            v-for="(item, index) in this.windowInfos"
                            :center="item.point"
                            :radius="10"
                            :fill-color="item.pointColor"
                            :key="index"
                            :strokeWeight="1"
                            :events="events"
                            :vid="index + ''"
                        />
                        <el-amap-info-window
                            v-for="(item, index) in this.windowInfos"
                            :position="item.point"
                            :key="100 + index"
                            :visible="item.visible"
                        >
                            <div class="info-window">
                                <p>
                                    设备编号: <span>{{ item.num }}</span>
                                </p>
                                <p>
                                    安装地址: <span>{{ item.location }}</span>
                                </p>
                            </div>
                        </el-amap-info-window>
                    </div>
                </el-amap>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import mapmixin from 'commonjs/mapmixin';
import { getTaskDevices } from 'network/task';
// import Amap from 'vue-amap';
// Amap.initAMapApiLoader({
//     // 申请的高德key
//     key: '6e350de4372aea6e14e89161fe4816c0',
//     // 插件集合
//     plugin: ['ToolBar', 'MapType'],
// });
export default {
    name: 'TaskLocation',
    mixins: [mapmixin],
    data() {
        return {
            taskInfo: {},
            events: {},
            windowInfos: [],
            plugin: [
                {
                    pName: 'ToolBar',
                },
                {
                    pName: 'MapType',
                    defaultType: 0,
                },
            ],
            id: parseInt(sessionStorage.getItem('taskID')),
            center: [],
        };
    },
    props: {
        name: String,
    },
    methods: {
        async getTask() {
            let res = await getTaskDevices(this.id);
            console.log(res);
            if (!res.flag) return this.$message.error('设备获取失败');

            for (const val of res.devices) {
                this.windowInfos.push({
                    point: [val.longitude, val.latitude],
                    num: val.name,
                    location: val.address,
                    pointColor: this.RandomColor(),
                    visible: false,
                });
            }
            if (res.devices.length === 0)
                this.center = [
                    parseFloat(sessionStorage.getItem('longitude')),
                    parseFloat(sessionStorage.getItem('latitude')),
                ];
            else {
                this.center = [
                    res.devices[0].longitude,
                    res.devices[0].latitude,
                ];
            }
        },
    },
    created() {
        this.getTask();
        this.mountEvent('windowInfos');
    },
};
</script>

<style scoped lang="less">
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
.amap {
    margin-top: 10px;
    height: 600px;
    width: 100%;
    .info-window {
        font-size: 13px;
        span {
            margin-left: 3px;
        }
    }
}
</style>
