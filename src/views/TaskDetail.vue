<template>
    <div class="task-detail">
        <el-container>
            <el-header
                ><div class="logo-wapper">
                    <img src="~assets/img/logo.png" alt="" class="logo" />
                    <!-- <h3>永川区非煤矿山企业安全检查监督管理平台</h3> -->
                    <h3>风险治理与管控平台</h3>
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
                <div class="op-btns" v-if="type === 'manage'">
                    <el-button @click="alloVisible=true">重新分配设备</el-button>
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
                                <div>巡查顺序:{{ row.patrolOrder }}</div>
                                <div>设备名称:{{ row.deviceName }}</div>
                                <div>终端人员:{{ row.staff }}</div>
                                <div>上传时间:{{ row.uploadTime }}</div>

                                <div>RFID状态:{{ row.RFIDStatus }}</div>

                                <div>
                                    巡线点视频:
                                    <el-icon
                                        class="el-icon-caret-right"
                                    ></el-icon>
                                    <span
                                        class="a-style"
                                        @click="showVideo(row.videoSrc)"
                                        >查看</span
                                    >
                                </div>
                                <div>审核用户:{{ row.examUser }}</div>
                                <div>审核时间:{{ row.examTime }}</div>
                                <div>
                                    审核状态:{{ row.examState | examState }}
                                </div>
                                <div>审核备注:{{ row.examComment }}</div>
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
                                    label="是否符合/巡查备注"
                                    prop="content"
                                    width="300px"
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
                        v-if="type === 'examine'"
                    >
                        <template v-slot="{ row }">
                            <el-button
                                size="mini"
                                circle
                                icon="el-icon-check"
                                type="primary"
                                @click="passOne(row.patrolOrder - 1)"
                            ></el-button>
                            <el-button
                                size="mini"
                                circle
                                icon="el-icon-close"
                                type="danger"
                                @click="dispassOne(row.patrolOrder - 1)"
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
                        v-model="disPassInfo.auditNote"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="disPassVisible = false">取消</el-button>
                <el-button type="primary" @click="submitExam">确认</el-button>
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
        <el-dialog :visible.sync="alloVisible" title="分配设备">
            <span slot="footer">
                <el-button></el-button>
                <el-button type="primary"></el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import BaseInfo from 'components/routine_task/BaseInfo';
import {
    GetTasks,
    getTaskDevices,
    setDeviceOrder,
    examTask,
} from 'network/task';
import { getItemByDevice } from 'network/patrolitem';
import { getDevice } from 'network/device';
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
            indexs: {},
            disPassVisible: false, //审核 用到的 对象
            disPassInfo: {
                auditNote: '', //审核备注
                isMessage: true, //是否 发送消息
            },
            isPass: [], // 表示每个设备的 巡查是否合格
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
    filters: {
        examState(val) {
            if (val === 1) return '合格';
            else if (val === 0) return '不合格';
            else return '未审核';
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
            console.log(taskRes);
            if (!taskRes.flag) return this.$message.error('任务信息获取失败');
            if (taskRes.status !== 200) {
            }
            this.baseInfo = taskRes.tasks[0];
            //获取 设备
            const deviceRes = await getTaskDevices(this.baseInfo.taskID);
            console.log(deviceRes);
            if (!deviceRes.flag) return this.$message.error('任务设备获取失败');

            // 遍历数组 获取每一个设备的  检查项
            const tableData = [];
            const isPass = []; // 根据 设备的审核状态 初始化isPass 数组
            for (const [index, val] of deviceRes.devices.entries()) {
                const itemRes = await getItemByDevice(val.deviceID);
                console.log(itemRes);
                const checkItems = [];
                if (!itemRes.flag) return this.$message.error('巡查项获取失败');
                else {
                    for (const val of itemRes.checkItems) {
                        checkItems.push({
                            title: val.name,
                            content: '符合 [好]',
                            imgSrc:
                                'http://pic13.photophoto.cn/20091209/0038037977031807_b.jpg',
                        });
                    }
                }
                const patrol = {
                    itemID: index + 1,
                    patrolOrder: index + 1,
                    uploadTime: '2020 -4-2 10:28',
                    staff: '打工的张三',
                    RFIDStatus: '正常',
                    videoSrc:
                        'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/deviceJob/1861/33/284a73e6563c4d43bcaef06004d13c49.mp4',
                    deviceName: val.name,
                    examUser: '',
                    examTime: '',
                    examState: -1,
                    examComment: '',
                    checkItems,
                };
                isPass.push(-1);
                tableData.push(patrol);
            }

            this.tableData = tableData;
            this.isPass = isPass;
            this.initIndexs();
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
                '此操作将当前任务项处理为合格, 是否继续?',
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
                this.isPass[index] = 1;
                this.submitExam();
            }
        },
        dispassOne(index) {
            this.isPass[index] = 0;
            this.disPassVisible = true;
        },
        async submitExam() {
            console.log(this.isPass);

            const res = await examTask(
                this.baseInfo.taskID,
                this.isPass.join(',')
            );
            console.log(res);
            if(!res.flag) this.$message.error('审核失败');
            else this.$message.success('审核成功');
            
            this.disPassVisible = false;
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
        async allocateClick() {
         
        },
        async submitAllocate() {},
    },
    created() {
        this.getData();
    },
    components: {
        BaseInfo,
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
