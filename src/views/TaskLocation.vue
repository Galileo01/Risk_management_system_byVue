<template>
    <div class="task_loction">
        <el-container direction="vertical">
            <GeneralHeader />
            <el-main>
                <el-row>
                    <el-col :span="1">
                        任务名称:
                    </el-col>
                    <el-col :span="2">
                        {{ name }}
                    </el-col>
                </el-row>
                <el-amap
                    vid="amapDemo"
                    class="amap"
                    :center="center"
                    :zoom="17"
                    ref="amap"
                    :plugin="plugin"
                    ><div v-if="windowInfos.length !== 0">
                        <el-amap-marker
                            v-for="(item, index) in windowInfos"
                            :position="item.point"
                            :key="index"
                            :events="events"
                            :vid="index + ''"
                            :offset="[-15, -34]"
                            :title="item.num"
                        ></el-amap-marker>
                        <el-amap-info-window
                            v-for="(item, index) in this.windowInfos"
                            :position="item.point"
                            :key="100 + index"
                            :visible="item.visible"
                        >
                            <div class="info-window">
                                <p>
                                    设备名称: <span>{{ item.num }}</span>
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
import { getTaskDevices2, getDeviceBaseinfoByTaskID } from 'network/task';
import GeneralHeader from 'components/com/GeneralHeader';
import Amap from 'vue-amap';
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
            id: sessionStorage.getItem('taskID'),
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
            center: [],
        };
    },
    props: {
        name: String,
    },
    methods: {
        async getTask() {
            // let res = await getTaskDevices2({});
            let res = await getDeviceBaseinfoByTaskID(this.id);
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
    components: {
        GeneralHeader,
    },
    created() {
        this.getTask();
        this.mountEvent('windowInfos');
    },
};
</script>

<style scoped lang="less">
.task_loction {
    font-size: 14px;
    .amap {
        margin-top: 10px;
        // height: 600px;
        height: calc(100vh - 60px - 60px);
        width: 100%;
        .info-window {
            font-size: 13px;
            span {
                margin-left: 3px;
            }
        }
    }
}
</style>
