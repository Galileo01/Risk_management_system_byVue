<template>
    <div class="statis_last">
        <BreadNav :texts="['数据统计', '最新数据']" />
        <el-card>
            <el-alert
                center
                show-icon
                title="最新数据(按照时间排序)"
            ></el-alert>
            <el-row
                ><el-col :span="2">选择时间</el-col>
                <el-col :span="4"
                    ><el-radio-group v-model="listType">
                        <el-radio label="day">今日</el-radio>
                        <el-radio label="week">本周</el-radio></el-radio-group
                    ></el-col
                ></el-row
            >
            <el-timeline>
                <el-timeline-item
                    v-for="(item, index) in showData"
                    :key="index"
                    :timestamp="item.uploadTime"
                    :color="stampColor(item.cycle)"
                    placement="top"
                >
                    <el-card>
                        <el-row type="flex">
                            <el-col :span="12">
                                <div>
                                    设备名称:<span>{{ item.deviceName }}</span>
                                </div>
                                <div>
                                    巡线顺序:<span>{{ item.deviceOrder }}</span>
                                </div>

                                <div>
                                    任务名称:<span>{{ item.taskName }}</span>
                                </div>
                                <div>
                                    任务类型:<span>{{
                                        taskTypeText(item.cycle)
                                    }}</span>
                                </div>
                                <div>
                                    完成时间:<span>{{ item.doneTime }}</span>
                                </div>
                                <div>
                                    任务状态:<span>{{
                                        taskStateText(item.taskState)
                                    }}</span>
                                </div>
                                <div>
                                    终端人员:<span>{{ item.userName }}</span>
                                </div>
                                <div class="supervise">
                                    <div>巡查数据：</div>
                                    <i
                                        v-for="(item, index) in dealPath(
                                            item.picturePath
                                        )"
                                        :key="index"
                                        class="el-icon-picture"
                                        @click="showImg(item)"
                                    ></i>
                                    <i
                                        v-for="(item, index) in dealPath(
                                            item.videoPath
                                        )"
                                        :key="10 + index"
                                        class="el-icon-video-play"
                                        @click="showVideo(item)"
                                    ></i>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div>
                                    审核用户:<span>{{ item.auditAdmin }}</span>
                                </div>
                                <div>
                                    审核时间:<span>{{ item.auditTime }}</span>
                                </div>
                                <div>
                                    审核备注:<span>{{ item.auditNote }}</span>
                                </div>
                            </el-col></el-row
                        ></el-card
                    >
                </el-timeline-item>
            </el-timeline>
            <el-alert center ref="bottom">已经到底了</el-alert>
        </el-card>
        <el-dialog :visible.sync="dialogVisible" @close="close" @open="open">
            <img :src="showSrc" alt="" v-show="showType === 'img'" />
            <video
                :src="showSrc"
                v-show="showType === 'video'"
                controls
                ref="video"
            ></video>
        </el-dialog>
    </div>
</template>

<script>
import { getTaskDevices } from 'network/task';
import { formatDate } from 'commonjs/utils';
export default {
    name: 'StatisLast',
    data() {
        return {
            lastData: {
                day: [],
                week: [],
                showNum: 10, //默认展示 10 条
            },
            listType: 'day',
            showType: 'img',
            showSrc: '',
            dialogVisible: false,
            query: {
                page: 1,
                size: 10,
                total: 0,
            },

            IObserver: {}, //交叉观察器
        };
    },
    computed: {
        showData() {
            const { showNum } = this.lastData;
            return this.lastData[this.listType].slice(0, showNum);
        },
    },
    methods: {
        async getData() {
            const now = new Date();

            const endTime = `${now.getFullYear()}-${now.getMonth() +
                1}-${now.getDate() + 1} 00:00:00`;
            const startTime = new Date(endTime);
            startTime.setDate(startTime.getDate() - startTime.getDay()); //将日期设置 为本周第一天
            console.log(startTime.toString(), endTime);

            const res = await getTaskDevices({
                endTime,
                startTime: formatDate(startTime, 'yyyy-MM-dd hh:mm:ss'),
            });
            // const res = await getTaskDevices({
            //     endTime: '2020-06-24 00:00:00',
            //     startTime: '2020-06-9 00:00:00',
            // });
            //只获取 本周的数据
            console.log(res);
            if (!res.flag) return this.$message.error('巡查数据获取失败');
            // 按照时间 先后顺序排序
            res.task_devices.sort((a, b) => {
                return (
                    new Date(a.doneTime).getTime() -
                    new Date(b.doneTime).getTime()
                );
            });
            // 统计今日巡查
            const day = [];
            for (const item of res.task_devices) {
                const doneTime = new Date(item.doneTime);

                if (
                    now.getFullYear() === doneTime.getFullYear() &&
                    now.getMonth() == doneTime.getMonth() &&
                    now.getDate() === doneTime.getDate()
                ) {
                    day.push(item);
                }
            }

            this.lastData.day = day;
            this.lastData.week = res.task_devices;
        },
        showImg(src) {
            this.showType = 'img';
            this.showSrc = src;
            this.dialogVisible = true;
        },
        showVideo(src) {
            this.showType = 'video';
            this.showSrc = src;
            this.dialogVisible = true;
        },
        close() {
            //关闭 对话框后 关闭视频，
            this.$nextTick((_) => {
                this.$refs.video.pause();
            });
        },
        open() {
            //每次打开视频都 从头开始
            this.$nextTick((_) => {
                if (this.showType === 'video') this.$refs.video.currentTime = 0;
            });
        }, //根据任务类型，设置stamp的颜色
        stampColor(cycle) {
            switch (cycle) {
                case 1: //日巡
                    return '#F56C6C';

                case 7: //周巡
                    return '#E6A23C';

                case 30:
                    return '#67C23A';
                case 0: //自定义
                    return '#409EFF';
            }
        },
        loadMore() {
            if (this.showData.length < this.lastData[this.listType].length)
                //如果当前没有显示完数据
                this.lastData.showNum += 10; //每次多加载10 条
        },
        //绑定 交叉观察器，实现无限滚动
        bindInfiniteScroll() {
            this.$nextTick(() => {
                this.IObserver = new IntersectionObserver((entries) => {
                    if (entries[0].intersectionRatio <= 0) return;
                    this.loadMore();
                    console.log('Loaded more data');
                });
                this.IObserver.observe(this.$refs.bottom.$el);
            });
        },
        taskTypeText(cycle) {
            const obj = {
                0: '自定义',
                1: '日巡',
                7: '周巡',
                30: '月巡',
            };
            return obj[cycle];
        },
        taskStateText(state) {
            const states = ['待完成', '待审核', '合格', '不合格'];
            return states[state];
        },
        //处理  路径
        dealPath(path) {
            if (!path) return [];
            else return path.split(',');
        },
    },
    created() {
        this.getData();
        this.bindInfiniteScroll();
    },
};
</script>

<style scoped lang="less">
.statis_last {
    font-size: 14px;
    .el-alert {
        margin-bottom: 10px;
    }
    /deep/ .el-card__body {
        padding-bottom: 10px;
    }
    /deep/ .el-timeline-item {
        font-size: 14px;
        color: #606266;
        div {
            margin-bottom: 5px;
            span {
                margin-left: 8px;
            }
            .supervise {
                span {
                    margin-right: 10px;
                }
                i {
                    font-size: 20px;
                    cursor: pointer;
                }
            }
        }
    }
    .num {
        color: #409eff;
    }
    /deep/ .el-dialog {
        img {
            width: 100%;
        }
        video {
            height: 500px;
            margin: 0 auto;
            display: block;
            max-width: 100%;
        }
        .el-dialog__header {
            padding: 0px;
        }
    }
}
</style>
