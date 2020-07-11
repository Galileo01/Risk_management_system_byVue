<template>
    <div class="device_trail">
        <BreadNav :texts="['人员监控', '巡查轨迹']" />
        <div class="content">
            <el-amap :center="center" :plugin="plugin" :zoom="16" class="amap">
                <el-amap-marker
                    :position="trilInfo[0].position"
                    v-if="trilInfo.length !== 0"
                    ><template>
                        <span class="text">起点</span></template
                    ></el-amap-marker
                >
                <el-amap-marker
                    :position="trilInfo[trilInfo.length - 1].position"
                    v-if="trilInfo.length !== 0"
                    ><template>
                        <span class="text">终点</span></template
                    ></el-amap-marker
                >
                <el-amap-marker
                    v-for="(marker, index) in trilInfo"
                    :position="marker.position"
                    :key="index"
                    :events="events"
                    :vid="index + ''"
                    :icon="marker.checked ? imgs.checked : imgs.uncheck"
                    :offset="[-15, -34]"
                    :title="marker.checked ? '已巡查' : '未巡查'"
                ></el-amap-marker>
                <el-amap-info-window
                    v-for="(item, index) in trilInfo"
                    :position="item.position"
                    :key="100 + index"
                    :visible="item.visible"
                >
                    <div class="window-info">
                        <p>设备名称：{{ item.num }}</p>
                        <p>执行时间：{{ item.updataTime }}</p>
                        <p>
                            巡查状态: {{ item.checked ? '已巡查' : '未巡查' }}
                        </p>
                        <p>巡查结果: {{ item.result }}</p>
                    </div></el-amap-info-window
                >
                <el-amap-polyline :path="path" />
            </el-amap>
            <div class="select">
                <el-select
                    v-model="queryInfo.staff"
                    placeholder="请选择终端人员"
                    size="mini"
                    @change="_getTasks"
                >
                    <el-option
                        v-for="(item, index) in staffs"
                        :key="index"
                        :label="item.name"
                        :value="item.name"
                        size="mini"
                    >
                    </el-option>
                </el-select>
                <el-date-picker
                    v-model="queryInfo.date"
                    type="date"
                    placeholder="选择日期"
                    size="small"
                    @change="filterSelection"
                >
                </el-date-picker>
                <el-select
                    v-model="queryInfo.taskID"
                    placeholder="请选择任务"
                    size="mini"
                >
                    <el-option
                        v-for="(item, index) in taskSelections"
                        :key="index"
                        :label="item.name"
                        :value="item.taskID"
                    >
                    </el-option>
                </el-select>
                <el-button type="primary" size="medium" @click="getData"
                    >查询</el-button
                >
            </div>
        </div>
    </div>
</template>

<script>
import mapmixin from 'commonjs/mapmixin';
import {
    GetTasks,
    getTaskDevices,
    getDeviceBaseinfoByTaskID,
} from 'network/task';
export default {
    name: 'DeviceTrail',
    mixins: [mapmixin],
    data() {
        return {
            center: this.$store.state.enterpriseLocation,
            plugin: [
                {
                    pName: 'ToolBar',
                },
                {
                    pName: 'MapType',
                    defaultType: 0,
                },
            ],
            tasks: ['日常任务', '自定义任务'], //某个 人员 在某一天 执行的所有任务 ,从数据库获取
            queryInfo: {
                staff: '',
                date: '',
                taskID: '',
            },
            taskSelections: [],
            trilInfo: [],
            path: [],
            windows: [],
            imgs: {
                uncheck: require('../assets/img/point_red.png'),
                checked: require('../assets/img/point_blue.png'),
            },
        };
    },
    computed: {
        staffs() {
            return this.$store.state.staffs.map((item) => {
                return {
                    name: item.name,
                };
            });
        },
    },
    methods: {
        async getData() {
            if (this.queryInfo.staff === '')
                return this.$message.error('请选择终端人员');
            else if (this.queryInfo.date === '')
                return this.$message.error('请选择日期');
            else if (this.queryInfo.taskID === '')
                return this.$message.error('请选择任务');

            // const res = await getDeviceBaseinfoByTaskID(this.queryInfo.taskID);
            const [res1, res2] = await Promise.all([
                getTaskDevices({ taskID: this.queryInfo.taskID }),
                getDeviceBaseinfoByTaskID(this.queryInfo.taskID),
            ]);
            if (!res1.flag || !res2.flag)
                return this.$message.error('任务信息获取失败');
            console.log(res1, res2);
            this.path = [];

            const data = res1.task_devices.map((item, index) => {
                const { longitude, latitude } = res2.devices[index];
                const itemsResult = item.result;
                //  console.log(itemsResult);
                let checked = false,
                    result = '无';
                if (itemsResult) {
                    checked = true;
                    if (itemsResult.includes('0'))
                        //该设备的某一个检查项 存在不合格的情况
                        result = '不合格';
                    else result = '合格';
                }
                const position = [longitude, latitude];
                this.path.push(position);
                return {
                    position,
                    num: item.deviceName,
                    updataTime: item.doneTime,
                    visible: false,
                    checked,
                    result,
                };
            });
            console.log(data);
            this.$message.success('查询成功');
            this.trilInfo = data;
            //移动 地图中心
            this.center = data[parseInt(data.length / 2)].position;
        },
        async _getTasks() {
            const res = await GetTasks({ userName: this.queryInfo.staff });
            if (!res.flag) return this.$message.error('任务信息获取失败');
            this.tasks = res.tasks;
            // this.filterSelection();
        },
        //过滤数据
        filterSelection() {
            this.taskSelections = [];
            const time = new Date(this.queryInfo.date);
            const date = time.getDate();
            const year = time.getFullYear();
            const month = time.getMonth();
            this.tasks.forEach((item) => {
                const crateTime = new Date(item.createTime);
                if (
                    crateTime.getDate() === date &&
                    crateTime.getMonth() === month &&
                    crateTime.getFullYear() === year
                )
                    this.taskSelections.push({
                        name: item.name,
                        taskID: item.taskID,
                    });
            });
        },
    },
    created() {
        this.mountEvent('trilInfo');
        this.queryInfo.date = new Date().toString(); // 设置默认的时间
        // if (this.center.length === 0)
        //     this.$store.dispatch('reqEnterpriseLocation');
    },
};
</script>

<style scoped lang="less">
.content {
    padding: 10px;
    display: flex;
}
.amap {
    height: calc(100vh - 60px - 30px - 20px);
    width: calc(100% - 300px);
    .window-info {
        font-size: 13px;
    }
    /deep/ .amap-info-content {
        padding: 5px 18px 5px 5px;
    }
}
.select {
    width: 270px;
    margin: 20px 10px 0 50px;
    .el-select,
    .el-date-editor {
        margin-bottom: 10px;
    }
    .el-button {
        margin: 10px 0 0 100px;
    }
}
.text {
    margin-left: 20px;
    display: block;
}
</style>
