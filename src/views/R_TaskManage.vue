<template>
    <div class="r_task_manage">
        <BreadNav :texts="['日常任务', '任务管理']" />
        <el-card>
            <el-row class="ali-c">
                <el-col :span="4" :offset="16">
                    <el-switch
                        active-text="模板任务"
                        inactive-text="普通任务"
                        v-model="isModelType"
                        @change="changeisModelType"
                    ></el-switch>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="getList" size="medium"
                        >查询</el-button
                    >

                    <el-button type="danger" @click="removeMany" size="medium"
                        >删除</el-button
                    ></el-col
                ></el-row
            >
            <el-form inline>
                <el-form-item label="任务名称"
                    ><el-input
                        v-model="queryInfo.taskName"
                        class="inputInwidth"
                        clearable
                        @clear="getList"
                        size="medium"
                    ></el-input
                ></el-form-item>

                <el-form-item label="终端人员">
                    <el-select
                        v-model="queryInfo.staff"
                        clearable
                        @clear="getList"
                        size="medium"
                    >
                        <el-option
                            v-for="(item, index) in options"
                            :key="index"
                            :label="item.name"
                            :value="item.name"
                        ></el-option></el-select
                ></el-form-item>
                <el-form-item label="任务周期">
                    <el-input
                        v-model.number="queryInfo.cycle"
                        placeholder="输入任务的周期，单位天"
                        clearable
                        @clear="getList"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="任务状态">
                    <el-input
                        v-model="queryInfo.state"
                        clearable
                        @clear="getList"
                        size="medium"
                    ></el-input>
                </el-form-item>
            </el-form>
            <TaskTable
                :tasklist="showData"
                @remove="removeOne"
                @refresh="refreshOne"
                @generate="showDialog"
                @edit="editClick"
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
        </el-card>
        <el-dialog
            :visible.sync="newDialogVisible"
            @close="oprateTask.name = ''"
            title="输入新任务名称"
        >
            <el-form label-width="100px">
                <el-form-item label="新任务名称">
                    <el-input v-model="oprateTask.name" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="newDialogVisible = false">取消</el-button>
                <el-button @click="generate" type="primary">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="editVisible" title="编辑任务">
            <el-form :model="oprateTask" label-width="100px">
                <el-form-item label="终端人员" prop="userName">
                    <el-select
                        v-model="oprateTask.userName"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="(item, index) in options"
                            :key="index"
                            :label="item.name"
                            :value="item.name"
                        >
                        </el-option> </el-select
                ></el-form-item>
                <el-form-item label="任务名称" prop="name"
                    ><el-input v-model="oprateTask.name" disabled=""></el-input
                ></el-form-item>

                <el-form-item label="任务周期(天)" prop="type">
                    <el-input v-model="oprateTask.cycle"></el-input>
                </el-form-item>

                <el-form-item label="备注" prop="note"
                    ><el-input v-model="oprateTask.note"></el-input
                ></el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import TaskTable from 'components/routine_task/TaskTable';
import {
    GetTasks,
    setTask,
    getTaskDevices,
    AllocateTask,
    removeTask,
} from 'network/task';
import { mapState } from 'vuex';

export default {
    name: 'R_TaskManage',
    data() {
        return {
            queryInfo: {
                taskName: '',
                cycle: '',
                staff: '',
                pageSize: 10,
                page: 1,
                total: 0,
                state: '',
            },
            isModelType: false, // dmodel/common
            tasklist: [], //普通任务模板
            tasklist_M: [], //模板任务列表
            showData: [],
            trans_to_staff: '',
            tran_taskID: 0,
            newDialogVisible: false,
            oprateTask: {},
            editVisible: false,
        };
    },
    computed: {
        ...mapState({
            options: 'staffs',
        }),
    },
    methods: {
        //获取任务列表
        async getList() {
            this.tasklist = [];
            this.tasklist_M=[];
            const res = await GetTasks({
                enterpriseName: sessionStorage.getItem('enterpriseName'),
                name: this.queryInfo.taskName,
                cycle: this.queryInfo.cycle,
                userName: this.queryInfo.staff,
                state: this.queryInfo.state,
            });

            if (!res.flag) return this.$message.error('任务列表获取失败');

            res.tasks.forEach((val) => {
                if (val.cycle !== 0) {
                    //只显示 日常任务

                    if (val.cycle < 0) {
                        this.tasklist.push({
                            ...val,
                            checked: false,
                        });
                    } else if (val.cycle > 0) {
                        this.tasklist_M.push({
                            ...val,
                            checked: false,
                        });
                    }
                }
            });

            console.log(res.tasks, this.tasklist, this.tasklist_M);

            const { pageSize: size, page } = this.queryInfo;
            const offset = (page - 1) * size;
            if (!this.isModelType) {
                this.showData = this.tasklist.slice(offset, offset + size);
                this.queryInfo.total = this.tasklist.length;
            } else {
                this.showData = this.tasklist_M.slice(offset, offset + size);
                this.queryInfo.total = this.tasklist_M.length;
            }
        },
        handleSizeChange(size) {
            this.queryInfo.pageSize = size;
            this.changeShowData();
        },
        handleCurrentChange(page) {
            this.queryInfo.page = page;
            this.changeShowData();
        },
        changeShowData() {
            const { page, pageSize: size } = this.queryInfo;
            const offset = (page - 1) * size;
            if (this.isModelType) {
                this.showData = this.tasklist_M.slice(offset, offset + size);
            } else this.showData = this.tasklist.slice(offset, offset + size);
        },
        getChecked() {
            return this.showData.filter((val) => val.checked);
        },
        async removeMany() {
            const checked = this.getChecked();
            if (checked.length === 0) {
                this.$message.warning('请选中任务');
            } else {
                const result = await this.$confirm(
                    `此操作将终止${checked.length}个任务, 是否继续?`,
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
                    let count = 0;
                    console.log(checked);

                    for (const val of checked) {
                        const res = await removeTask(val.name);
                        if (res.flag) count++;
                    }
                    this.$message.success(
                        `成功删除${count}个,失败${checked.length - count}个`
                    );
                    this.getList();
                }
            }
        },
        async removeOne(name) {
            const result = await this.$confirm(
                '此操作将删除该任务, 是否继续?',
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
                const res = await removeTask(name);
                console.log(res);
                if (!res.flag) return this.$message.error('删除操作失败');
                this.$message.success('任务成功删除');
                this.getList();
            }
        },
        async refreshOne(task) {
            const result = await this.$confirm(
                '此操作将重置任务, 是否继续?',
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
                const res = await setTask({ name: task.name, state: 0 });
                console.log(res);
                if (!res.flag) this.$message.error('操作失败');
                this.$message.success('重置操作成功');
                this.getList();
            }
        },
        showDialog(task) {
            this.oprateTask = { ...task };
            this.oprateTask.name = '';
            this.newDialogVisible = true;
        },
        async generate() {
            let res = await getTaskDevices(this.oprateTask.taskID);
            console.log(res);

            if (!res.flag) return this.$message.error('操作失败');
            const devices = res.devices.map((val) => val.name).join(','); //生成字符串数组
            res = await AllocateTask({
                ...this.oprateTask,
                devices,
                number: res.devices.length,
            });
            console.log(res);
            if (!res.flag) return this.$message.error('操作失败');
            this.$message.success('操作成功');
            this.getList();
            this.newDialogVisible = false;
        },
        editClick(task) {
            console.log(task);

            this.oprateTask = { ...task };
            this.editVisible = true;
        },
        async submitEdit() {
            const res = await setTask(this.oprateTask);
            console.log(res);
            if (!res.flag) return this.$message.error('修改失败');
            else {
                this.$message.success('修改成功');
                this.editVisible = false;
                this.getList();
            }
        },
        //切换展示模式  模板/普通
        changeisModelType() {
            this.queryInfo.page = 1;
            const { pageSize: size, page } = this.queryInfo;
            const offset = (page - 1) * size;
            if (!this.isModelType) {
                this.showData = this.tasklist.slice(offset, offset + size);
                this.queryInfo.total = this.tasklist.length;
            } else {
                this.showData = this.tasklist_M.slice(offset, offset + size);
                this.queryInfo.total = this.tasklist_M.length;
            }
            console.log(this.showData);
        },
    },
    created() {
        this.getList();
    },
    components: {
        TaskTable,
    },
};
</script>

<style scoped lang="less">
.r_task_manage {
    /deep/ .el-card__body {
        padding-top: 10px;
    }
    .el-form {
        /deep/ input {
            width: 220px;
        }
        .el-form-item {
            margin-bottom: 22px;
        }
    }
    .el-row {
        margin-bottom: 10px;
    }
    .el-table {
        margin-top: 0px;
    }
}
</style>
