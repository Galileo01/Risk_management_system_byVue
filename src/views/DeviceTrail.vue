<template>
    <div class="device_trail">
        <BreadNav :texts="['人员监控', '设备访问']" />
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
                ></el-amap-marker>
                <el-amap-info-window
                    v-for="(item, index) in trilInfo"
                    :position="item.position"
                    :key="100 + index"
                    :visible="item.visible"
                >
                    <div class="window-info">
                        <p>设备编号：{{ item.num }}</p>
                        <p>执行时间：{{ item.updataTime }}</p>
                        <p>RFID状态：{{ item.status }}</p>
                    </div></el-amap-info-window
                >
                <el-amap-polyline :path="path" />
            </el-amap>
            <div class="select">
                <el-select
                    v-model="queryInfo.type"
                    placeholder="请选择任务类型"
                >
                    <el-option
                        v-for="(item, index) in types"
                        :key="index"
                        :label="item"
                        :value="item"
                    >
                    </el-option>
                </el-select>
                <el-select
                    v-model="queryInfo.staff"
                    placeholder="请选择终端人员"
                    size="medium"
                >
                    <el-option
                        v-for="(item, index) in staffs"
                        :key="index"
                        :label="item.name"
                        :value="item.name"
                    >
                    </el-option>
                </el-select>
                <el-date-picker
                    v-model="queryInfo.date"
                    type="date"
                    placeholder="选择日期"
                    size="small"
                >
                </el-date-picker>
                <el-button type="primary" size="medium" @click="getData"
                    >查询</el-button
                >
            </div>
        </div>
    </div>
</template>

<script>
import mapmixin from 'commonjs/mapmixin';
export default {
    name: 'DeviceTrail',
    mixins: [mapmixin],
    data() {
        return {
            center: [105.757223, 29.33282],
            plugin: [
                {
                    pName: 'ToolBar'
                },
                {
                    pName: 'MapType',
                    defaultType: 0
                }
            ],
            staffs: [
                {
                    name: '吴磊'
                },
                {
                    name: '孔容'
                },
                {
                    name: '宋飞'
                },
                {
                    name: '曾温根'
                },
                {
                    name: '李沛儒'
                }
            ],
            types: ['日常任务', '自定义任务'],
            queryInfo: {
                staff: '',
                date: '',
                type: ''
            },
            trilInfo: [],
            path: [],
            windows: []
        };
    },
    methods: {
        getData() {
            if (this.queryInfo.type === '')
                return this.$message.error('请选择任务类型');
            else if (this.queryInfo.staff === '')
                return this.$message.error('请选择终端人员');
            else if (this.queryInfo.date === '')
                return this.$message.error('请选择日期');

            const data = [
                {
                    position: [105.757243, 29.333],
                    num: 'R10',
                    status: '正常',
                    updataTime: '2020-03-30 23:07:49',
                    visible: false
                },
                {
                    position: [105.757223, 29.334],
                    num: 'R16',
                    status: '正常',
                    updataTime: '2020-04-08 23:07:49',
                    visible: false
                },
                {
                    position: [105.758523, 29.3355],
                    num: 'R18',
                    status: '正常',
                    updataTime: '2020-03-27 23:07:49',
                    visible: false
                }
            ];
            this.$message.success('查询成功');

            this.trilInfo = data;
            this.path = [];
            data.forEach(val => {
                this.path.push(val.position);
            });
        }
    },
    created() {
        this.mountEvent('trilInfo');
    }
};
</script>

<style scoped lang="less">
.content {
    padding: 10px;
    display: flex;
}
.amap {
    height: 620px;
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
    .el-select {
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
