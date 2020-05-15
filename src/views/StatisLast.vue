<template>
    <div class="statis_last">
        <BreadNav :texts="['数据统计', '最新数据']" />
        <el-card>
            <el-alert center show-icon  title="最新数据(按照时间排序)" ></el-alert>
            <el-table :data="lastData" stripe border size="mini">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="任务数据">
                    <template v-slot="{ row }">
                        <div class="table-data">
                            <div>巡线顺序:{{ row.patrolOrder }}</div>
                            <div>终端人员:{{ row.staff }}</div>
                            <div>执行时间:{{ row.commitTime }}</div>
                            <div>上传时间:{{ row.uploadTime }}</div>
                            <div>按时完成:{{ row.intime ? '是' : '否' }}</div>
                            <div>RFID状态:{{ row.RFIDStatus }}</div>
                            <div>巡查状态:{{ row.patrolStatus }}</div>

                            <div>审核用户:{{ row.examUser }}</div>
                            <div>审核时间:{{ row.examTime }}</div>
                            <div class="supervise">
                                <span
                                    >督察:{{ row.superviseInfo.content }}</span
                                >
                                <i
                                    v-for="(item, index) in row.superviseInfo
                                        .imgs"
                                    :key="index"
                                    class="el-icon-picture"
                                    @click="showImg(item)"
                                ></i>
                                <i
                                    v-for="(item, index) in row.superviseInfo
                                        .videos"
                                    :key="10 + index"
                                    class="el-icon-video-play"
                                    @click="showVideo(item)"
                                ></i>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="设备信息">
                  <template v-slot="{row}">
                    <div>
                      <p>设备编号: <span class="num">{{row.deviceInfo.num}}</span></p>
                      <p>安装地址:{{row.deviceInfo.address}}</p>
                      <p>类型:{{row.deviceInfo.type}}</p>
                    </div>
                  </template>
                </el-table-column>
            </el-table>
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="query.page"
                :page-sizes="[5, 10]"
                :page-size="query.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="query.total"
            ></el-pagination>
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
export default {
    name: 'StatisLast',
    data() {
        return {
            lastData: [],
            showType: 'img',
            showSrc: '',
            dialogVisible: false,
            query: {
                page: 1,
                size: 10,
                total: 0
            },
        };
    },
    methods: {
        getData() {
            const data = [
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '2020 -4-2sdasdad',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    videoSrc:
                        'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/33/284a73e6563c4d43bcaef06004d13c49.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡'
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/5ed63e153ec04089835e5a0a6534cb04.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/5ed63e153ec04089835e5a0a6534cb04.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg'
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4'
                        ]
                    }
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '2020 -4-2sdasdad',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    video:
                        'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/33/284a73e6563c4d43bcaef06004d13c49.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡'
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/5ed63e153ec04089835e5a0a6534cb04.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/5ed63e153ec04089835e5a0a6534cb04.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg'
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4'
                        ]
                    }
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '2020 -4-2sdasdad',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    video:
                        'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/33/284a73e6563c4d43bcaef06004d13c49.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡'
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/5ed63e153ec04089835e5a0a6534cb04.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/5ed63e153ec04089835e5a0a6534cb04.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg'
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4'
                        ]
                    }
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '2020 -4-2sdasdad',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    videoSrc:
                        'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/33/284a73e6563c4d43bcaef06004d13c49.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡'
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/5ed63e153ec04089835e5a0a6534cb04.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/5ed63e153ec04089835e5a0a6534cb04.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg'
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4'
                        ]
                    }
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '2020 -4-2sdasdad',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    videoSrc:
                        'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/33/284a73e6563c4d43bcaef06004d13c49.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡'
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/5ed63e153ec04089835e5a0a6534cb04.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/5ed63e153ec04089835e5a0a6534cb04.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg'
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4'
                        ]
                    }
                }
            ];

            this.lastData = data;
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
            this.$nextTick(_ => {
                this.$refs.video.pause();
            });
        },
        open() { //每次打开视频都 从头开始
            this.$nextTick(_ => {
                if (this.showType === 'video') this.$refs.video.currentTime = 0;
            });
        },
        handleSizeChange() {},
        handleCurrentChange() {},
    },
    created() {
        this.getData();
    }
};
</script>

<style scoped lang="less">
.statis_last {
    .el-table {
        font-size: 13px;
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
    .num{
      color: #409EFF;
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
