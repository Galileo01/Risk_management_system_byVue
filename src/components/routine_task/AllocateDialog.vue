<template>
    <el-dialog
        title="任务设置"
        :visible="dialogVisible"
        @update:visible="$emit('update:dialogVisible', false)"
        width="60%"
        top="50px"
        @close="clear"
    >
        <el-form
            :model="formData"
            label-width="80px"
            ref="form"
            :rules="formRules"
        >
            <el-form-item label="终端人员" prop="staff">
                <el-select v-model="formData.staff" placeholder="请选择">
                    <el-option
                        v-for="(item, index) in options"
                        :key="index"
                        :label="item.name"
                        :value="item.name"
                    >
                    </el-option> </el-select
            ></el-form-item>
            <el-form-item label="任务名称" prop="taskName"
                ><el-input v-model="formData.taskName"></el-input
            ></el-form-item>
            <!-- <el-form-item label="任务选项"
                ><el-checkbox-group v-model="formData.selections">
                    <el-checkbox label="diy">支持异常巡查</el-checkbox>
                    <el-checkbox label="routine">规定线路巡查</el-checkbox>
                </el-checkbox-group></el-form-item
            > -->
            <el-form-item label="任务类型" prop="type" v-if="taskType === 'r'">
                <el-radio-group
                    v-model="formData.type"
                    @change="setDefaultTime"
                >
                    <el-radio label="日巡">日巡</el-radio>
                    <el-radio label="周巡">周巡</el-radio>
                    <el-radio label="月巡">月巡</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                label="完成时间"
                prop="deadline"
                v-if="taskType === 'r'"
                ><el-date-picker
                    v-model="formData.deadline"
                    type="date"
                    placeholder="选择日期时间"
                >
                    >
                </el-date-picker></el-form-item
            >
            <el-form-item label="备注" prop="comments"
                ><el-input v-model="formData.comments"></el-input
            ></el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="$emit('update:dialogVisible', false)"
                >取 消</el-button
            >
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { AllocateTask } from 'network/task';

import { mapState } from 'vuex';
export default {
    name: 'AllocateDialog',
    props: {
        dialogVisible: Boolean,
        taskType: {
            //标识 当前 要分配的 任务类型   r/d 日常任务/自定义任务
            type: String,
            default: 'r',
        },
    },
    data() {
        return {
            formData: {
                staff: '', //number
                taskName: '',
                selections: ['diy'],
                deadline: '',
                comments: '', //备注
                type: '日巡',
            },
            // options: [],
            formRules: {
                staff: [
                    {
                        required: true,
                        message: '请选择巡查人员',
                        trigger: 'blur',
                    },
                ],
                taskName: [
                    {
                        required: true,
                        message: '请输入任务名称',
                        trigger: 'blur',
                    },
                ],
                deadline: [
                    { required: true, message: '请输入时间', trigger: 'blur' },
                ],
                type: [
                    {
                        required: true,
                        message: '请选择类型',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    computed: {
        ...mapState({
            options: 'staffs',
        }),
    },
    methods: {
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return;
                const deadline = new Date(this.formData.deadline);
                const now = new Date();
                const cycle = Math.ceil(
                    (deadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
                );
                // console.log(cycle);

                this.$emit('allocate', {
                    cycle: this.taskType === 'r' ? cycle : 0, // 根据任务类型，设置 cycle
                    name: this.formData.taskName,
                    note: this.formData.comments,
                    userName: this.formData.staff,
                    enterpriseName: localStorage.getItem('enterpriseName'),
                    state: '待执行',
                });
                this.$emit('update:dialogVisible', false);
            });
        },
        clear() {
            this.$refs.form.resetFields();
        },
        //设置 默认时间 24h 之后
        setDefaultTime() {
            let number = 0;
            switch (this.formData.type) {
                case '日巡':
                    number = 1;
                    break;
                case '周巡':
                    number = 7;
                    break;
                case '月巡':
                    number = 30;
                    break;
            }
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * number);
            this.formData.deadline = date.toString();
        },
    },
    created() {
        // this.getData();
        this.setDefaultTime();
    },
};
</script>

<style></style>
