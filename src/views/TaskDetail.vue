<template>
    <div class="task-detail">
        <el-container>
            <el-header
                ><div class="logo-wapper">
                    <img src="~assets/img/logo.png" alt="" class="logo" />
                    <h3>永川区非煤矿山企业安全检查监督管理平台</h3>
                </div></el-header
            >
            
            <el-main>
                <BreadNav
                    :texts="['日常任务', componentType]"
                    :toHome="false"
                />
                <BaseInfo
                    :taskInfo="baseInfo"
                    :isCollapse="type === 'examine'"
                />
                <div class="exam-op" v-if="type === 'examine'">
                    <el-button type="danger" @click="dispassMany(1)"
                        >全部不合格</el-button
                    >
                    <el-button type="primary" @click="passMany(1)"
                        >全部合格</el-button
                    >
                    <el-button type="danger" @click="dispassMany(2)"
                        >不合格</el-button
                    >
                    <el-button type="primary" @click="passMany(2)"
                        >合格</el-button
                    >
                    <el-button>单个审核</el-button>
                </div>
                <el-table
                    :data="tableData"
                    stripe
                    border
                    size="medium"
                    class="total-table"
                    @select="select"
                    @select-all="selectAll"
                >
                <el-table-column type="index"></el-table-column>
                    <el-table-column type="selection" min-width="60px" v-if="type==='examine'">
                    </el-table-column>
                    <el-table-column label="任务数据" min-width="800px"  class-name="left-mar">
                        <template v-slot="{ row }">
                            <div class="table-data">
                                <div>巡线顺序:{{ row.patrolOrder }}</div>
                                <div>终端人员:{{ row.staff }}</div>
                                <div>执行时间:{{ row.commitTime }}</div>
                                <div>上传时间:{{ row.uploadTime }}</div>
                                <div>
                                    按时完成:{{ row.intime ? '是' : '否' }}
                                </div>
                                <div>RFID状态:{{ row.RFIDStatus }}</div>
                                <div>巡查状态:{{ row.patrolStatus }}</div>
                                <div>
                                    巡线点视频: <el-icon class="el-icon-caret-right"></el-icon>
                                    <span
                                        class="a-style"
                                        @click="showVideo(row.videoSrc)"
                                        >查看</span
                                    >
                                </div>
                                <div>审核用户:{{ row.examUser }}</div>
                                <div>审核时间:{{ row.examTime }}</div>
                                <div>巡查内容:</div>
                            </div>
                            <!-- 子表格 -->
                            <el-table
                                :data="row.tableData"
                                size="mini"
                                class="commont-table"
                            >
                                <el-table-column
                                    label="标题"
                                    prop="title"
                                    width="700px"
                                ></el-table-column>
                                <el-table-column
                                    label="是否符合"
                                    prop="content"
                                ></el-table-column>
                                <el-table-column
                                    label="图片"
                                    class-name="a-style"
                                    ><template v-slot="{ row }">
                                        <span
                                            class="a-style"
                                            @click="showImg(row.imgSrc)"
                                            >查看</span
                                        >
                                    </template></el-table-column
                                >
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="150px"
                        class-name="in-top"
                        v-if="type==='examine'"
                    >
                        <template v-slot="{ row }">
                            <el-button
                                size="mini"
                                circle
                                icon="el-icon-check"
                                type="primary"
                                @click="passOne(row.itemID)"
                            ></el-button>
                            <el-button
                                size="mini"
                                circle
                                icon="el-icon-close"
                                type="danger"
                                 @click="dispassOne(row.itemID)"
                            ></el-button>
                            <el-button
                                size="mini"
                                circle
                                icon="el-icon-edit"
                                type="warning"
                            ></el-button> </template
                    ></el-table-column>
                </el-table>
            </el-main>
        </el-container>
        <!-- 对话框 展示 图片和视频-->
        <el-dialog
            class="img-dialog"
            :visible.sync="imgVisible"
            width="60%"
            top="50px"
        >
            <img :src="showingImg" alt="" />
        </el-dialog>
        <el-dialog
            class="video-dialog"
            :visible.sync="videoVisible"
            width="40%"
            top="50px"
        >
            <video :src="showingVideo" controls></video>
        </el-dialog>
    </div>
</template>

<script>
import BaseInfo from 'components/routine_task/BaseInfo';
export default {
    name: 'TaskDetail',
    data() {
        return {
            baseInfo: {}, //任务的基础信息
            tableData: [],
            imgVisible: false,
            showingImg: '',
            videoVisible: false,
            showingVideo: ''
        };
    },
    props:{
        type:String,  //当前 组件展示 的模式 manage/ examine ,通过 路由解耦
        id:String
    },
    computed: {
        //当前 组件的类型，是展示 任务详情还是任务审核
        componentType() {
            return this.type === 'detail' ? '任务详情' : '任务审核';
        }
    },
    methods: {
        getData() {
            const data = {
                taskName: '20200329日巡',
                taskId: '123',
                deviceNums: 'R1 R2 R4',
                taskStatus: '进行中',
                staff: '孔荣',
                uploadProcess: '1/3',
                examineProcess: '0/3',
                passedNum: 1,
                trans_from: '', //转发 人员
                trans_time: '', //转发的时间
                lastDownTime: '2020-04-03 14:48:56', //最近一次下载时间
                gene_Time: '2020-03-29 08:35:57', //生成时间
                stopTime: '2020-04-03 14:12', //完成/终止时间
                finalFinishTime: '2020-04-03 14:48:56', //最终完成时间
                geneUser: '罗世红',
                stopUSer: '罗世红',
                menuName: '004日巡',
                selections: [true, false],
                taskType: 0,
                commont: ''
            };
            this.baseInfo = data;
            const tableData = [
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
                    checked: false,
                    tableData: [
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/78fec4ade3d64f64a82a1b5b68433d92.jpg'
                        },
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65:80/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/fac0222dcd07403b90cf3110e09d710a.jpg'
                        },
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/91c127e633c94bfaaa8784afc0092062.jpg'
                        },
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/542c51f4e54c4444846461e88c5c499c.jpg'
                        },
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/ba652949e6034b15b9851a8ba4c4c18c.jpg'
                        }
                    ]
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
                    checked: false,
                    tableData: [
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/78fec4ade3d64f64a82a1b5b68433d92.jpg'
                        },
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/78fec4ade3d64f64a82a1b5b68433d92.jpg'
                        },
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/78fec4ade3d64f64a82a1b5b68433d92.jpg'
                        },
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/78fec4ade3d64f64a82a1b5b68433d92.jpg'
                        },
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/78fec4ade3d64f64a82a1b5b68433d92.jpg'
                        }
                    ]
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
                    checked: false,
                    tableData: [
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/78fec4ade3d64f64a82a1b5b68433d92.jpg'
                        },
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/78fec4ade3d64f64a82a1b5b68433d92.jpg'
                        },
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/78fec4ade3d64f64a82a1b5b68433d92.jpg'
                        },
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/78fec4ade3d64f64a82a1b5b68433d92.jpg'
                        },
                        {
                            title:
                                '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求。（1.标准：【国家标准】《金属非金属矿..：',
                            content: '符合 [好]',
                            imgSrc:
                                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/35/78fec4ade3d64f64a82a1b5b68433d92.jpg'
                        }
                    ]
                }
            ];
            this.tableData = tableData;
        },
        //展示 图片 对话框
        showImg(src) {
            this.imgVisible = true;
            this.showingImg = src;
        },
        showVideo(src) {
            this.videoVisible = true;
            this.showingVideo = src;
        },
        //表格选中 事件
        select(s, row) {
            row.checked = !row.checked;
        },
        selectAll(se) {
            se.forEach(val => (val.checked = true));
        },
        getChecked() {
            return this.tableData.filter(val => val.checked);
        },
        async passMany(num) {
            //一次 合格多个 num:1/2 标识是全部合格还是选中合格
            let data = [];
            if (num === 1) {
                data = this.tableData;
            } else if (num === 2) {
                data = this.getChecked();
                console.log(data);
                if (data.length === 0) {
                    this.$message.warning('请选中数据');
                    return;
                }
            }
            const result = await this.$confirm(
                '此操作将多个任务数据处理为合格, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(error => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else this.$message.success('操作成功');
        },
        async dispassMany(num) {
            //一次 合格多个 num:1/2 标识是全部不合格还是选中不合格
            let data = [];
            if (num === 1) {
                data = this.tableData;
            } else if (num === 2) {
                data = this.getChecked();
                if (data.length === 0) {
                    this.$message.warning('请选中数据');
                    return;
                }
            }
            const result = await this.$confirm(
                '此操作将多个任务数据处理为不合格, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(error => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else this.$message.success('操作成功');
        },
        async passOne(id) {
            const result = await this.$confirm(
                '此操作将当前任务项处理为合格, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(error => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else this.$message.success('操作成功');
        },
       async dispassOne(id) {
           const result = await this.$confirm(
                '此操作将当前数据项处理为不合格, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(error => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else this.$message.success('操作成功');
       }
    },
    created() {
        this.getData();
    },
    components: {
        BaseInfo,
    }
};
</script>

<style scoped lang="less">
.task-detail {
    width: 100%;
}
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
.el-main {
    padding: 0px;
    .exam-op {
        margin-top: 5px;
        display: flex;
        justify-content: flex-end;
    }
}
.total-table {
    /* 总体 table  */
    font-size: 13px;
    margin: 10px 0px 20px 0px;
    
}
span.a-style {
    cursor: pointer;
    color: #409eff;
}

.img-dialog img {
    width: 100%;
}
.video-dialog video {
    width: 300px;
    margin: 0 auto;
    display: block;
}

</style>
