<template>
    <div class="task_loction">
       
        <el-container>
            <el-header
                ><div class="logo-wapper">
                    <img src="~assets/img/logo.png" alt="" class="logo" />
                    <h3>永川区非煤矿山企业安全检查监督管理平台</h3>
                </div></el-header
            >
            <el-main>
                <el-row>
                    <el-col>
                        {{ this.taskInfo.taskName }}
                    </el-col>
                </el-row>
                <el-amap
                    vid="amapDemo"
                    class="amap"
                    :center="this.windowInfos[0].point"
                    :zoom="16"
                    ref="amap"
                    :plugin="plugin"
                >
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
                </el-amap>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import mapmixin from 'commonjs/mapmixin';
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
                    pName: 'ToolBar'
                },
                {
                    pName: 'MapType',
                    defaultType: 0
                }
            ]
        };
    },
    methods: {
        getTask() {
            const taskID=this.$route.params.id;
            this.taskInfo = {
                taskName: '20200330日巡',
                taskId: '132',
                deviceNums: 'R2',
                taskStatus: '进行中',
                staff: '蒋兴广',
                uploadProcess: '1/3',
                examineProcess: '0/3',
                passedNum: 1,
                gene_Time: '2020-03-29 08:35:57',
                selections: [true, true],
                taskType: 0
            };

            this.windowInfos = [
                {
                    point: [105.756297, 29.335506],
                    num: 'R015',
                    location: '下料口右侧',
                    visible: false,
                    pointColor: this.RandomColor()
                },
                {
                    point: [105.755301, 29.334068],
                    num: 'R014',
                    location: '阡陌道左侧',
                    visible: false,
                    pointColor: this.RandomColor()
                },
                {
                    point: [105.757192, 29.332831],
                    num: 'R013',
                    location: '炸药库',
                    visible: false,
                    pointColor: this.RandomColor()
                }
            ];
        }
    },
    created() {
        this.getTask();
        this.mountEvent('windowInfos');
    }
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
