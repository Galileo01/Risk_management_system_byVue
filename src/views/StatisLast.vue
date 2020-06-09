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
                                    巡线顺序:<span>{{ item.patrolOrder }}</span>
                                </div>
                                <div>
                                    终端人员:<span>{{ item.staff }}</span>
                                </div>
                                <div>
                                    执行时间:<span>{{ item.commitTime }}</span>
                                </div>
                                <div>
                                    巡查状态:<span>{{
                                        item.patrolStatus
                                    }}</span>
                                </div>

                                <div>
                                    审核用户:<span>{{ item.examUser }}</span>
                                </div>
                                <div>
                                    审核时间:<span>{{ item.examTime }}</span>
                                </div>
                                <div class="supervise">
                                    <div>
                                        督察:<span>{{
                                            item.superviseInfo.content
                                        }}</span>
                                    </div>
                                    <i
                                        v-for="(item, index) in item
                                            .superviseInfo.imgs"
                                        :key="index"
                                        class="el-icon-picture"
                                        @click="showImg(item)"
                                    ></i>
                                    <i
                                        v-for="(item, index) in item
                                            .superviseInfo.videos"
                                        :key="10 + index"
                                        class="el-icon-video-play"
                                        @click="showVideo(item)"
                                    ></i>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div>
                                    设备编号:
                                    <span class="num">{{
                                        item.deviceInfo.num
                                    }}</span>
                                </div>
                                <div>
                                    安装地址:<span>{{
                                        item.deviceInfo.address
                                    }}</span>
                                </div>
                                <div>
                                    类型:<span>{{ item.deviceInfo.type }}</span>
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
        getData() {
            const data = [
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '15:23',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    cycle: 1,
                    patrolStatus: '正常巡逻', //巡查状态
                    videoSrc:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '10:23',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    cycle: 7,
                    patrolStatus: '正常巡逻', //巡查状态
                    video:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '8:23',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    cycle: 7,
                    patrolStatus: '正常巡逻', //巡查状态
                    video:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '7:23',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    cycle: 1,
                    patrolStatus: '正常巡逻', //巡查状态
                    videoSrc:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '05:23',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    cycle: 0,
                    patrolStatus: '正常巡逻', //巡查状态
                    videoSrc:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
            ];
            const data2 = [
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1: sdsad',
                    uploadTime: '2020-05-22-15:23',
                    cycle: 1,
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    videoSrc:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    cycle: 7,
                    uploadTime: '2020-05-23-15:23',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    video:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '2020-05-22-15:23',
                    cycle: 0,
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    video:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '2020-05-22-15:23',
                    cycle: 7,
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    videoSrc:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    cycle: 7,
                    uploadTime: '2020-05-22-15:23',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    videoSrc:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '2020-05-22-15:23',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1: sdsad',
                    uploadTime: '2020-05-22-15:23',
                    cycle: 1,
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    videoSrc:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '2020-05-23-15:23',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    video:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    cycle: 30,
                    uploadTime: '2020-05-22-15:23',
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    video:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '2020-05-22-15:23',
                    cycle: 30,
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    videoSrc:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '符合',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
                {
                    itemID: '1',
                    patrolOrder: 1,
                    staff: '罗世红',
                    commitTime: '2020-4-1:123 sdsad',
                    uploadTime: '2020-05-22-15:23',
                    cycle: 30,
                    intime: true, // 是否按时完成
                    RFIDStatus: '正常',
                    patrolStatus: '正常巡逻', //巡查状态
                    videoSrc:
                        'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                    deviceInfo: {
                        //设备信息
                        num: 'R010',
                        address: '阡陌道左侧',
                        type: '巡线点3日巡',
                    },
                    examUser: '',
                    examTime: '',
                    superviseInfo: {
                        content: '2020-05-22-15:23',
                        imgs: [
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://wf.zlcdgroup.cn/NDMMSKQ/image/ndmmsImage/deviceJob/3/1/561db3e5098f453ab8c98310c313ea8f.jpg',
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/083eef1437a04cbe987300d647ee709e.jpg',
                        ],
                        videos: [
                            'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/3/2/249fa0e45c634e8b9e4d0801cd230396.mp4',
                        ],
                    },
                },
            ];
            this.lastData.day = data;
            this.lastData.week = [...data2,...data2,...data2];
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
