<template>
    <div class="danger_handle">
        <BreadNav :texts="['隐患管理', '隐患处理']" />
        <el-card>
            <div class="btns">
                <el-button size="mini" type="info" @click="reset"
                    >重置输入</el-button
                >
                <el-button type="primary" size="medium">查询</el-button>
            </div>
            <el-form inline label-width="100px" :model="queryInfo" ref="form">
                <el-form-item label="来源时间(起)" prop="startTime"
                    ><el-date-picker
                        v-model="queryInfo.startTime"
                        type="date"
                        placeholder="选择起始日期"
                        clearable
                    >
                    </el-date-picker
                ></el-form-item>
                <el-form-item label="来源时间(止)" prop="endTime"
                    ><el-date-picker
                        v-model="queryInfo.endTime"
                        type="date"
                        placeholder="选择截至日期"
                        clearable
                    >
                    </el-date-picker
                ></el-form-item>
                <el-form-item label="隐患类型" prop="dangerType"
                    ><el-select v-model="queryInfo.dangerType" clearable>
                        <el-option
                            label="证照不齐"
                            value="zhenzhao"
                        ></el-option>
                        <el-option label="资料不全" value="data"></el-option>
                        <el-option label="安全隐患" value="safe"></el-option>
                        <el-option label="巡查处理" value="deal"></el-option>
                        <el-option
                            label="巡查异常上报"
                            value="report"
                        ></el-option>
                        <el-option
                            label="终端上传"
                            value="terminal"
                        ></el-option></el-select
                ></el-form-item>
                <el-form-item label="上报人员" prop="staff"
                    ><el-select v-model="queryInfo.staff" clearable>
                        <el-option
                            v-for="(item, index) in staffs"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        ></el-option> </el-select
                ></el-form-item>
                <el-form-item label="审核状态" prop="examState"
                    ><el-select v-model="queryInfo.examState" clearable>
                        <el-option label="未审核" value="not-exam"></el-option>
                        <el-option label="不合格" value="not-pass"></el-option>
                        <el-option
                            label="合格"
                            value="pass"
                        ></el-option> </el-select
                ></el-form-item>
            </el-form>
            <DangerTable
                :data="tableData"
                @show="show"
                oprateType="handle"
                @handle="handle"
            />
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.page"
                :page-sizes="[5, 10]"
                :page-size="queryInfo.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="queryInfo.total"
            ></el-pagination>
        </el-card>
        <el-dialog :visible.sync="dialogVisible" title="隐患描述">
            <p>{{ showDes }}</p>
        </el-dialog>
    </div>
</template>

<script>
import DangerTable from 'components/statis/DangerTable';
import {getDanger}  from 'network/danger'
export default {
    name: 'StatisDanger',
    data() {
        return {
            queryInfo: {
                startTime: '',
                endTime: '',
                dangerType: '',
                part: '',
                staff: '',
                examState: '',
                dangerState: '',
                page: 1,
                size: 10,
                total: 0
            },
            staffs: [],
            tableData: [],
            dialogVisible: false,
            showDes: ''
        };
    },
    methods: {
        getData() {
            const staffs = [
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
            const tableData = [
                {
                    dangerNum: '123',
                    deivceNum: 'R017',
                    dangerType: '安全隐患',
                    examState: '合格',
                    dangerState: '处理',
                    staff: '李沛儒',
                    ge_time: '2019-11-27 07:41:33', // 生成时间
                    addressDes: '低压变电房前', //位置描述
                    dangerDes: '杂物乱堆' //异常/隐患描述
                },
                {
                    dangerNum: '9876',
                    deivceNum: 'R78',
                    dangerType: '安全隐患',
                    examState: '合格',
                    dangerState: '处理',
                    staff: '李沛儒',
                    ge_time: '2019-11-27 07:41:33', // 生成时间
                    addressDes: '低压变电房前', //位置描述
                    dangerDes: '杂物乱堆' //异常/隐患描述
                },
                {
                    dangerNum: '1689',
                    deivceNum: 'P017',
                    dangerType: '安全隐患',
                    examState: '合格',
                    dangerState: '处理',
                    staff: '李沛儒',
                    ge_time: '2019-11-27 07:41:33', // 生成时间
                    addressDes: '低压变电房前', //位置描述
                    dangerDes: '杂物乱堆' //异常/隐患描述
                },
                {
                    dangerNum: '123',
                    deivceNum: 'R017',
                    dangerType: '安全隐患',
                    examState: '合格',
                    dangerState: '处理',
                    staff: '李沛儒',
                    ge_time: '2019-11-27 07:41:33', // 生成时间
                    addressDes: '低压变电房前', //位置描述
                    dangerDes: '杂物乱堆' //异常/隐患描述
                },
                {
                    dangerNum: '123',
                    deivceNum: 'R017',
                    dangerType: '安全隐患',
                    examState: '合格',
                    dangerState: '处理',
                    staff: '李沛儒',
                    ge_time: '2019-11-27 07:41:33', // 生成时间
                    addressDes: '低压变电房前', //位置描述
                    dangerDes: '杂物乱堆' //异常/隐患描述
                },
                {
                    dangerNum: 'K976',
                    deivceNum: 'R017',
                    dangerType: '安全隐患',
                    examState: '合格',
                    dangerState: '处理',
                    staff: '李沛儒',
                    ge_time: '2019-11-27 07:41:33', // 生成时间
                    addressDes: '低压变电房前', //位置描述
                    dangerDes: '杂物乱堆' //异常/隐患描述
                },
                {
                    dangerNum: '123',
                    deivceNum: 'R017',
                    dangerType: '安全隐患',
                    examState: '合格',
                    dangerState: '处理',
                    staff: '李沛儒',
                    ge_time: '2019-11-27 07:41:33', // 生成时间
                    addressDes: '低压变电房前', //位置描述
                    dangerDes: '杂物乱堆' //异常/隐患描述
                },
                {
                    dangerNum: '123',
                    deivceNum: 'R017',
                    dangerType: '安全隐患',
                    examState: '合格',
                    dangerState: '处理',
                    staff: '李沛儒',
                    ge_time: '2019-11-27 07:41:33', // 生成时间
                    addressDes: '低压变电房前', //位置描述
                    dangerDes: '杂物乱堆' //异常/隐患描述
                }
            ];
            this.staffs = staffs;
            this.tableData = tableData;
        },
        handleSizeChange() {},
        handleCurrentChange() {},
        show(num) {
            console.log(num);

            const { dangerDes } = this.tableData.find(
                val => val.dangerNum === num
            );
            this.showDes = dangerDes || '';
            this.dialogVisible = true;
        },
        reset() {
            this.$refs.form.resetFields();
        },
        async handle(num) {
            const result = await this.$confirm('此操作将更改该隐患的状态, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(error => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                this.$message.success('处理成功');
            }
        }
    },
    created() {
        this.getData();
    },
    components: {
        DangerTable
    }
};
</script>

<style scoped lang="less">
.danger_handle {
    /deep/ .el-card__body {
        padding: 10px 20px 0 20px;
    }
    .el-form-item {
        margin-bottom: 10px;
        width: 320px;
        height: 30px;
        /deep/ input {
            width: 180px;
            height: 30px;
        }
        /deep/ .el-input {
            width: 180px;
        }
    }

    .btns {
        margin-bottom: 10px;
        display: flex;
        justify-content: flex-end;
        padding-right: 30px;
    }
}
</style>
