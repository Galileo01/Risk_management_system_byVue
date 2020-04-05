<template>
    <div class="r_task_exam">
        <BreadNav :texts="['日常任务', '任务管理']" />
        <el-card>
            <el-form inline>
                <el-form-item label="任务名称"
                    ><el-input
                        v-model="queryInfo.taskName"
                        class="inputInwidth"
                    ></el-input
                ></el-form-item>
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
                <el-button type="primary">查询</el-button>
            </el-form>
            <TaskTable :tasklist="tasklist" tableType="examine" />
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
                staff:''
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
           
           
            
        },
        handleSizeChange() {},
        handleCurrentChange() {},
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
