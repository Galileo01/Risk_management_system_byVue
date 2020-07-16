<template>
    <div class="task-detail">
        <el-container direction="vertical">
            <GeneralHeader />
            <el-main>
                <BreadNav
                    :texts="['日常任务', componentType]"
                    :toHome="false"
                />
                <BaseInfo
                    :taskInfo="baseInfo"
                    :isCollapse="type === 'examine'"
                />
                <div class="op-btns" v-if="type === 'manage'">
                    <el-button @click="alloVisible = true"
                        >重新分配设备</el-button
                    >
                    <el-button type="primary" @click="sortVisible = true"
                        >设置巡查顺序</el-button
                    >
                </div>
                <el-table
                    :data="tableData"
                    stripe
                    border
                    size="medium"
                    class="total-table"
                >
                    <el-table-column type="index"></el-table-column>
                    <el-table-column
                        label="基本任务数据"
                        width="250px"
                        class-name="left-mar"
                    >
                        <template v-slot="{ row }">
                            <div class="table-data">
                                <div>巡查顺序:{{ row.deviceOrder }}</div>
                                <div>设备名称:{{ row.deviceName }}</div>
                                <div>终端人员:{{ row.userName }}</div>
                                <div>上传时间:{{ row.doneTime }}</div>

                                <!-- <div>RFID状态:{{ row.RFIDStatus }}</div> -->

                                <div>
                                    设备视频:
                                    <el-icon
                                        class="el-icon-caret-right"
                                    ></el-icon>
                                    <span
                                        v-if="row.videoPath"
                                        class="a-style"
                                        @click="showVideo(row.videoPath)"
                                        >查看</span
                                    >
                                </div>
                                <div>审核用户:{{ row.auditAdmin || '无' }}</div>
                                <div>审核时间:{{ row.auditTime || '无' }}</div>
                                <div>
                                    审核状态:<span
                                        :class="{ red: row.auditState !== 1 }"
                                        >{{
                                            getStateText(row.auditState)
                                        }}</span
                                    >
                                </div>
                                <div>审核备注:{{ row.auditNote || '无' }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="巡查内容">
                        <template v-slot="{ row }">
                            <el-table
                                :data="row.checkItems"
                                size="mini"
                                class="commont-table"
                            >
                                <el-table-column
                                    label="标题"
                                    prop="title"
                                    width="500px"
                                ></el-table-column>
                                <el-table-column
                                    label="是否符合/巡查结果"
                                    prop="result"
                                    width="300px"
                                ></el-table-column>
                                <el-table-column
                                    label="图片"
                                    class-name="a-style"
                                    ><template v-slot="{ row }">
                                        <span
                                            v-if="row.imgSrc"
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
                        v-if="type === 'examine'"
                    >
                        <template v-slot="{ row }">
                            <span :class="{ red: row.auditState !== 1 }"
                                >{{
                                    row.auditState === 1 ? '已' : '未'
                                }}审核</span
                            >
                            <el-button
                                size="mini"
                                circle
                                icon="el-icon-check"
                                type="primary"
                                @click="passOne(row.deviceOrder - 1)"
                            ></el-button>
                            <el-button
                                size="mini"
                                circle
                                icon="el-icon-close"
                                type="danger"
                                @click="dispassOne(row.deviceOrder - 1)"
                            ></el-button>
                            <!-- <el-button
                                size="mini"
                                circle
                                icon="el-icon-edit"
                                type="warning"
                            ></el-button>  -->
                        </template></el-table-column
                    >
                </el-table>
            </el-main>
        </el-container>
        <!-- 对话框 展示 图片和视频-->
        <el-dialog
            class="img-dialog"
            :visible.sync="imgVisible"
            width="60%"
            top="50px"
            title="巡查图片"
        >
            <img :src="showingImg" alt="" />
        </el-dialog>
        <el-dialog
            class="video-dialog"
            :visible.sync="videoVisible"
            width="40%"
            top="50px"
            title="设备视频"
            @open="videoDialogOpen"
            @close="videoDialogClose"
        >
            <video :src="showingVideo" controls ref="video"></video>
        </el-dialog>
        <!--某个巡查项 不合格 ，展示的 对话框-->
        <el-dialog
            :visible.sync="disPassVisible"
            title="不合格备注"
            @close="resetDis"
        >
            <el-form :model="disPassInfo" ref="disPassForm" label-width="90px">
                <el-form-item label="发送信息" prop="isMessage">
                    <el-checkbox v-model="disPassInfo.isMessage"></el-checkbox>
                </el-form-item>
                <el-form-item label="审核备注" prop="auditNote">
                    <el-input
                        type="textarea"
                        v-model="examInfo.auditNote[examInfo.oprateIndex]"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="disPassVisible = false">取消</el-button>
                <el-button type="primary" @click="submitDisPass"
                    >确认</el-button
                >
            </span>
        </el-dialog>
        <el-dialog
            :visible.sync="sortVisible"
            title="设置巡查顺序"
            @close="initIndexs"
        >
            <el-row
                ><el-tag type="primary" style="font-size:14px"
                    >请输入设备新次序（>1）</el-tag
                ></el-row
            >
            <el-form :model="indexs" label-width="100px" v-if="indexs !== {}">
                <el-form-item
                    v-for="(item, index) in tableData"
                    :key="index"
                    :label="item.deviceName"
                >
                    <el-input
                        style="width:150px"
                        size="medium"
                        v-model.number="indexs[index]"
                        @input="fresh()"
                        clearable
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="sortVisible = false">取消</el-button>
                <el-button type="primary" @click="submitSort">确认</el-button>
            </span>
        </el-dialog>
        <!-- <el-dialog :visible.sync="alloVisible" title="分配设备">
            <span slot="footer">
                <el-button></el-button>
                <el-button type="primary"></el-button>
            </span>
        </el-dialog> -->
        <ReAllocateDia
            :dialogVisible.sync="alloVisible"
            :choosed="tableData"
            @setDevice="submitSetDevice"
        ></ReAllocateDia>
    </div>
</template>

<script>
import BaseInfo from 'components/routine_task/BaseInfo';
import GeneralHeader from 'components/com/GeneralHeader';
import ReAllocateDia from 'components/routine_task/ReAllocateDia';
import {
    GetTasks,
    getTaskDevices2,
    getTaskDevices,
    setDeviceOrder,
    examTask,
    SetTaskDevices,
} from 'network/task';
import { getItemByDevice } from 'network/patrolitem';
import { getDevice } from 'network/device';
import { generateRisk } from 'network/danger';
import { sendMessage } from 'network/message';
import { getStaticUrl } from 'commonjs/utils';
export default {
    name: 'TaskDetail',
    data() {
        return {
            baseInfo: {}, //任务的基础信息
            tableData: [],
            imgVisible: false,
            showingImg: '',
            videoVisible: false,
            showingVideo: '',
            sortVisible: false,
            indexs: {}, //初始的巡查顺序
            disPassVisible: false, //审核 用到的 对象
            disPassInfo: {
                auditNote: [], //审核备注
                isMessage: true, //是否 发送消息
            }, //审核信息
            examInfo: {
                isMessage: true,
                auditState: [],
                auditNote: [],
                oprateIndex: 0, //正在 操作的 设备
            },
            allDevices: [], //所有设备
            alloVisible: false,
        };
    },
    props: {
        type: String, //当前 组件展示 的模式 manage/ examine ,通过 路由解耦
        name: String,
    },
    computed: {
        //当前 组件的类型，是展示 任务详情还是任务审核
        componentType() {
            return this.type === 'manage' ? '任务详情' : '任务审核';
        },
    },
    methods: {
        async getData() {
            //获取 任务数据
            let taskRes = await GetTasks({
                name: this.name,
                page: 1,
                limit: 9999,
            });
            if (!taskRes.flag) return this.$message.error('任务信息获取失败');
            console.log(taskRes);

            this.baseInfo = taskRes.tasks.find(
                (item) => item.name === this.name
            );
            this.examInfo.auditNote = [];
            this.examInfo.auditState = [];
            //获取 设备 的巡查情况
            const deviceRes = await getTaskDevices({
                taskID: this.baseInfo.taskID,
            });

            console.log(deviceRes);
            if (!deviceRes.flag) return this.$message.error('任务设备获取失败');

            // 遍历数组 获取每一个设备的  检查项
            const tableData = [];
            for (const val of deviceRes.task_devices) {
                const itemRes = await getItemByDevice(val.deviceID);
                const results = val.result; //每个设备的 巡查结果 string
                const pictures = val.picturePath
                    ? val.picturePath.split(',')
                    : []; //设备巡查的图片
                let videoPath = val.videoPath;
                //拼接 视频地址
                if (videoPath) {
                    val.videoPath = getStaticUrl(val.videoPath);
                }
                const checkItems = [];
                if (!itemRes.flag) return this.$message.error('巡查项获取失败');
                else {
                    for (const [index, item] of itemRes.checkItems.entries()) {
                        //处理 图片地址
                        const imgSrc =
                            pictures.length !== 0
                                ? getStaticUrl(pictures[index])
                                : '';

                        let patrolInfo = {
                            title: item.name,
                            result: '',
                            imgSrc,
                        };

                        console.log('imgSrc', imgSrc);

                        //已经巡查并产生了巡查结果
                        if (results) {
                            patrolInfo.result =
                                results.charAt(index) === '1'
                                    ? '符合 [好]'
                                    : '不符合';
                        } else {
                            patrolInfo.result = '无';
                        }
                        checkItems.push(patrolInfo);
                    }
                }

                tableData.push({ ...val, checkItems });
                const note = val.auditNote || '';
                const state = val.auditState || '0';
                this.examInfo.auditNote.push(note);
                this.examInfo.auditState.push(state);
            }

            this.tableData = tableData;
            this.initIndexs(); //初始化 初始巡查顺序
        },
        //获取所有的设备
        async getAlldevices() {
            this.allDevices = [];
            const { size, page } = this.query;
            const offset = (page - 1) * size;
            const res = await getDevice({
                page: 1,
                limit: 9999,
            });
            console.log(res);
            if (!res.flag) return this.$message.error('设备获取失败');
            for (const item of res.devices) {
                this.allDevices.push({ ...item, checked: false });
            }
            this.showDevices = this.allDevices.slice(offset, offset + size);
            this.query.total = res.devices.length;
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
        async passOne(index) {
            const result = await this.$confirm(
                '此操作将改任务的巡查处理为合格, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((error) => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                this.examInfo.auditState[index] = '1';
                this.submitExam();
            }
        },

        dispassOne(index) {
            this.examInfo.auditState[index] = '0';
            this.examInfo.oprateIndex = index;
            this.disPassVisible = true;
        },
        async submitExam() {
            console.log(this.examInfo.auditState);
            console.log(this.examInfo.auditNote);
            const res = await examTask({
                taskID: this.baseInfo.taskID,
                // ...this.examInfo,
                auditNote: this.examInfo.auditNote.join(','),
                auditState: this.examInfo.auditState.join(','),
            });
            console.log(res);
            if (!res.flag) this.$message.error('审核失败');
            else {
                this.$message.success('审核成功');
                this.getData(); //刷新数据
            }
            this.disPassVisible = false;
        },
        async submitDisPass() {
            this.submitExam();
            if (this.examInfo.isMessage) {
                //选择给 终端人员发送信息
                const res = await sendMessage({
                    receiver: this.baseInfo.userName,
                    content: `任务：${this.name}不合格;审核备注:${
                        this.examInfo.auditNote[this.examInfo.oprateIndex]
                    }`,
                });
                if (!res.flag) return this.$message.error('信息发送失败');
            }
        },

        resetDis() {
            this.$refs.disPassForm.resetFields();
        },
        //初始化 indexs 对象
        initIndexs() {
            let length = this.tableData.length;
            while (length--) {
                this.indexs[length] = length + 1;
            }
        },
        async submitSort() {
            const indexs = this.indexs;
            const length = this.tableData.length;
            const newOrder = [];
            for (const prop in indexs) {
                if (indexs[prop] < 0 || indexs[prop] > length) {
                    return this.$message.error('请输入有效的次序');
                }
                newOrder[indexs[prop] - 1] = this.tableData[prop].deviceName;
            }
            console.log(newOrder);
            const res = await setDeviceOrder({
                taskName: this.baseInfo.name,
                enterpriseName: localStorage.getItem('enterpriseName'),
                devices: newOrder.join(','),
            });
            console.log(res);

            this.$message.success('排序成功');
            this.getData();
            this.sortVisible = false;
        }, //强制 刷新 视图 ，解决 嵌套层次过多 v-model 无法双向绑定
        fresh() {
            this.$forceUpdate();
        },
        //重新分配 任务设备
        async submitSetDevice(devices) {
            console.log(devices);

            const res = await SetTaskDevices(this.name, devices);
            console.log(res);
            if (!res.flag) this.$message.error('分配失败');
            else {
                this.$message.success('分配成功');
                this.getData();
            }
            this.alloVisible = false;
        },
        //审核状态的 文字展示
        getStateText(state) {
            if (state) return '已审核';
            else return '未审核';
        },
        videoDialogOpen() {
            //等待 视频加载完成，dom 更新 就自动播放
            this.$nextTick(() => {
                this.$refs.video.play();
            });
        },
        videoDialogClose() {
            this.$refs.video.pause();
            this.showingVideo = '';
        },
    },
    created() {
        this.getData();
    },
    components: {
        BaseInfo,
        ReAllocateDia,
        GeneralHeader,
    },
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
    .op-btns {
        margin-top: 5px;
        display: flex;
        justify-content: flex-end;
    }
}
.total-table {
    /* 总体 table  */
    font-size: 13px;
    margin: 10px 0px 20px 0px;
    .red {
        color: #f56c6c;
    }
    .in-top span {
        margin-right: 10px;
    }
}

span.a-style {
    cursor: pointer;
    color: #409eff;
}

.video-dialog video {
    width: 300px;
    margin: 0 auto;
    display: block;
}

/deep/ .el-dialog__footer {
    padding: 0px 20px 10px !important;
}
/deep/ .img-dialog .el-dialog__body {
    height: 80vh;
    img {
        width: 90%;
        height: 100%;
    }
}
</style>
