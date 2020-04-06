<template>
    <div class="r_task_manage">
        <BreadNav :texts="['自定义任务', '任务管理']" />
        <el-card>
            <el-form inline>
                <el-form-item label="任务名称"
                    ><el-input
                        v-model="queryInfo.taskName"
                        class="inputInwidth"
                    ></el-input
                ></el-form-item>
                <el-form-item label="设备编号"
                    ><el-input
                        v-model="queryInfo.deviceNum"
                        placeholder="请输入完整编号"
                        class="inputInwidth"
                    ></el-input
                ></el-form-item>
                <el-form-item label="任务状态">
                    <el-select v-model="queryInfo.taskStatus">
                        <el-option
                            v-for="item in taskStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传状态">
                    <el-select v-model="queryInfo.uploadStatus">
                        <el-option
                            v-for="item in uploadStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="终端人员">
                    <el-select v-model="queryInfo.staff">
                        <el-option
                            v-for="item in staffList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option> </el-select
                ></el-form-item>
                <el-form-item label="生成时间">
                    <el-date-picker
                        v-model="queryInfo.startTime"
                        type="datetime"
                        placeholder="选择日期时间"
                    >
                        >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="截至时间"
                    ><el-date-picker
                        v-model="queryInfo.endTime"
                        type="datetime"
                        placeholder="选择日期时间"
                    >
                        >
                    </el-date-picker></el-form-item
                >
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                    <el-button type="success" @click="checkMany"
                        >完成</el-button
                    >
                    <el-button type="warning" @click="stopMany">终止</el-button>
                    <el-button type="danger" @click="removeMany"
                        >删除</el-button
                    >
                </el-form-item>
            </el-form>
            <TaskTable
                :tasklist="tasklist"
                @tran_res="tran_res"
                @checkOne="checkOne"
                @stopOne="stopOne"
                @remove="removeOne"
                @refreshOne="refreshOne"
            />
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.page"
                :page-sizes="[5, 10, 15]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="queryInfo.total"
            >
            </el-pagination>
            <el-dialog
                :visible.sync="dialogVisible"
                width="400px"
                top="200px"
                title="选择终端人员"
            >
                <el-form>
                    <el-form-item label="终端人员">
                        <el-select v-model="trans_to_staff">
                            <el-option
                                v-for="item in staffList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="transmit"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import TaskTable from 'components/routine_task/TaskTable';
export default {
    name: 'R_TaskManage',
    data() {
        return {
            queryInfo: {
                taskName: '',
                deviceNum: '',
                taskStatus: '',
                uploadStatus: '',
                startTime: '',
                endTime: '',
                pageSize: 10,
                page: 1,
                total: 0,
                staff: ''
            },
            taskStatusList: [
                {
                    value: '待下载',
                    label: '待下哉'
                },
                { value: '进行中', label: '进行中' },
                { value: '申请转发', label: '申请转发' },
                { value: '已转发', label: '已转发' },
                { value: '申请完成', label: '申请完成' },
                { value: '已完成', label: '已完成' },
                { value: '已终止', label: '已终止' }
            ],
            uploadStatusList: [
                {
                    value: '未上传',
                    label: '未上传'
                },
                { value: '部分上传', label: '部分上传' },
                { value: '全部上传', label: '全部上传' }
            ],
            staffList: [
                {
                    value: '01',
                    label: '吴磊'
                },
                {
                    value: '02',
                    label: '孔容'
                },
                {
                    value: '03',
                    label: '宋飞'
                },
                {
                    value: '04',
                    label: '曾温根'
                },
                {
                    value: '05',
                    label: '李沛儒'
                }
            ],
            tasklist: [],
            dialogVisible: false,
            trans_to_staff: '',
            tran_taskID: 0
        };
    },
    methods: {
        getList() {
            const tasklist = [
                {
                    taskName: '20200329日巡',
                    taskId: '123',
                    deviceNums: 'R1 R2 R4',
                    taskStatus: '进行中',
                    staff: '孔荣',
                    uploadProcess: '1/3',
                    examineProcess: '0/3',
                    passedNum: 1,
                    gene_Time: '2020-03-29 08:35:57',
                    selections: [true, false],
                    taskType: 0
                },
                {
                    taskName: '20200328日巡',
                    taskId: '111',
                    deviceNums: 'R1',
                    taskStatus: '进行中',
                    staff: '孔荣',
                    uploadProcess: '1/3',
                    examineProcess: '2/3',
                    passedNum: 1,
                    gene_Time: '2020-03-29 08:35:57',
                    selections: [true, true],
                    taskType: 0
                },
                {
                    taskName: '20200325日巡',
                    taskId: '222',
                    deviceNums: 'R1 R2 R4 R6',
                    taskStatus: '进行中',
                    staff: '蒋兴广',
                    uploadProcess: '1/3',
                    examineProcess: '0/3',
                    passedNum: 1,
                    gene_Time: '2020-03-29 08:35:57',
                    selections: [true, false],
                    taskType: 0
                },
                {
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
                },
                {
                    taskName: '20200329周巡',
                    taskId: '333',
                    deviceNums: 'R1 R2 R4',
                    taskStatus: '进行中',
                    staff: '蒋兴广',
                    uploadProcess: '1/3',
                    examineProcess: '0/3',
                    passedNum: 1,
                    gene_Time: '2020-03-29 08:35:57',
                    selections: [true, false],
                    taskType: 0
                },
                {
                    taskName: '20200326日巡',
                    taskId: '321',
                    deviceNums: 'R1 R2 R4 R5',
                    taskStatus: '进行中',
                    staff: '袁世彬',
                    uploadProcess: '1/3',
                    examineProcess: '0/3',
                    passedNum: 1,
                    gene_Time: '2020-03-29 08:35:57',
                    selections: [true, false],
                    taskType: 0
                }
            ];
            tasklist.forEach(val => {
                val.checked = false;
            });
            this.tasklist = tasklist;

            this.queryInfo.page = 1;
            this.queryInfo.pageSize = 10;
            this.queryInfo.total = 30;
        },
        handleSizeChange() {},
        handleCurrentChange() {},
        tran_res(id) {
            this.dialogVisible = true;
            this.tran_taskID = id;
        },
        transmit() {
            if (this.trans_to_staff) {
                this.$message.success('转发成功');
                this.trans_to_staff = '';
                this.dialogVisible = false;
            }
        },
        getChecked() {
            return this.tasklist.filter(val => val.checked);
        },
        async checkMany() {
            const checked = this.getChecked();
            if (checked.length === 0) {
                this.$message.warning('请选中任务');
            } else {
                const result = await this.$confirm(
                    '此操作将完成多个任务, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(error => error);
                if (result === 'cancel') {
                    this.$message.info('操作取消');
                } else {
                    this.$message.success('选中任务已批量完成');
                }
            }
        },
        async stopMany() {
            const checked = this.getChecked();
            if (checked.length === 0) {
                this.$message.warning('请选中任务');
            } else {
                const result = await this.$confirm(
                    '此操作将终止多个任务, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(error => error);
                if (result === 'cancel') {
                    this.$message.info('操作取消');
                } else {
                    this.$message.success('选中任务已批量终止');
                }
            }
        },
        async removeMany() {
            const checked = this.getChecked();
            if (checked.length === 0) {
                this.$message.warning('请选中任务');
            } else {
                const result = await this.$confirm(
                    '此操作将终止多个任务, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(error => error);
                if (result === 'cancel') {
                    this.$message.info('操作取消');
                } else {
                    this.$message.success('选中任务已批量删除');
                }
            }
        },
        checkOne(id) {
            console.log(id);
            this.$message.success('任务完成');
        },
        stopOne(id) {
            console.log(id);
            this.$message.success('任务成功终止');
        },
        removeOne(id) {
            console.log(id);
            this.$message.success('任务成功删除');
        },
        refreshOne(id){
            console.log(id);
            this.$message.success('任务成功重置');
        }
    },
    created() {
        this.getList();
    },
    components: {
        TaskTable
    }
};
</script>

<style scoped lang="less">
.el-form {
    /deep/ input {
        width: 220px;
    }
}
</style>
