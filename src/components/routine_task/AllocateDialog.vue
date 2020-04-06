<template>
    <el-dialog
        title="任务设置"
        :visible="dialogVisible"
        @update:visible="$emit('update:dialogVisible', false)"
        width="60%"
        top="50px"
        @close="clear"
    >
        <el-form :model="formData" label-width="80px" ref="form" :rules="formRules">
            <el-form-item label="终端人员" prop="staff">
                <el-select v-model="formData.staff" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option> </el-select
            ></el-form-item>
            <el-form-item label="任务名称" prop="taskName"
                ><el-input v-model="formData.taskName"></el-input
            ></el-form-item>
            <el-form-item label="任务选项"
                ><el-checkbox-group v-model="formData.selections">
                    <el-checkbox label="diy">支持异常巡查</el-checkbox>
                    <el-checkbox label="routine">规定线路巡查</el-checkbox>
                </el-checkbox-group></el-form-item
            >
            <el-form-item label="完成时间" prop="deadline"
                ><el-date-picker
                    v-model="formData.deadline"
                    type="datetime"
                    placeholder="选择日期时间"
                >
                    >
                </el-date-picker></el-form-item
            >
            <el-form-item label="备注"  prop="comments"
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
export default {
    name: 'AllocateDialog',
    props: {
        dialogVisible: Boolean
    },
    data() {
        return {
            formData: {
                staff: '', //number
                taskName: '',
                selections: ['diy'],
                deadline: '',
                comments: '' //备注
            },
            options: [],
            formRules: {
                staff: [{ required: true, message: '请选择巡查人员', trigger: 'blur' }],
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
                deadline: [{ required: true, message: '请输入时间', trigger: 'blur' }]
                
            }
        };
    },
    methods: {
        //获取 巡查人员列表
        getData() {
            this.options = [
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
            ];
        },
        submit() {
            this.$refs.form.validate(valid => {
                if (!valid) return;
               this.$emit('allocate');
                this.$emit('update:dialogVisible', false);
            });
        },
        clear(){
          this.$refs.form.resetFields();
        },
        //设置 默认时间 24h 之后
        setDefaultTime(){
             const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              this.formData.deadline=date.toString();
        },
        
    },
    created() {
        this.getData();
        this.setDefaultTime();
    }
};
</script>

<style></style>
