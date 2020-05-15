<template>
    <div class="statis_patrol">
        <BreadNav :texts="['数据统计', '巡查报表']" />
        <el-card>
            <div class="btns">
                 <el-button size="mini" type="info" @click="reset">重置输入</el-button>
                <el-button type="success" size="medium">下载</el-button>
                <el-button type="primary" size="medium">查询</el-button>
            </div>
            <el-form inline label-width="100px" ref="form" :model="queryInfo">
                <el-form-item label="巡查时间(起)" prop="startTime">
                    <el-date-picker
                        v-model="queryInfo.startTime"
                        type="date"
                        placeholder="选择起始日期"
                        clearable
                        size="mini"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="巡查时间(止)" prop="endTime">
                    <el-date-picker
                        v-model="queryInfo.endTime"
                        type="date"
                        placeholder="选择截至日期"
                        clearable
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="管理部门" prop="part">
                    <el-input v-model="queryInfo.part" clearable></el-input>
                </el-form-item>
                <el-form-item label="任务类型" prop="type">
                    <el-select v-model="queryInfo.type" clearable>
                        <el-option label="日常" value="routine"></el-option>
                        <el-option label="自定义" value="diy"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="巡查人员" prop="staff">
                    <el-select v-model="queryInfo.staff" clearable>
                        <el-option
                            v-for="(item, index) in staffs"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="电子身份"></el-form-item> -->
                <el-form-item label="审核状态" prop="examState">
                    <el-select v-model="queryInfo.examState" clearable>
                        <el-option label="未审核" value="not-exam"></el-option>
                        <el-option label="不合格" value="not-pass"></el-option>
                        <el-option label="合格" value="pass"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="巡查状态" prop="patrolState">
                    <el-input
                        v-model="queryInfo.patrolState"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="设备编号" prop="deviceNum">
                    <el-input
                        v-model="queryInfo.deviceNum"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="设备册编号" prop="menu">
                    <el-input v-model="queryInfo.menu" clearable></el-input>
                </el-form-item>
                <el-form-item label="设备类型" prop="deviceType">
                    <el-input
                        v-model="queryInfo.deviceType"
                        clearable
                    ></el-input>
                </el-form-item>
            </el-form>
            <PatrolTable :data="tableData" @show="show" />
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
        <el-dialog :visible.sync="dialogVisible" title="审核备注">
            <p>{{ showComment }}</p>
        </el-dialog>
    </div>
</template>

<script>
import PatrolTable from 'components/statis/PatrolTable';
export default {
    name: 'StatisPatrol',
    data() {
        return {
            queryInfo: {
                startTime: '',
                endTime: '',
                part: '', //部门
                type: '',
                examState: '',
                patrolState: '',
                deviceNum: '',
                deviceType: '',
                menu:'',
                page: 1,
                size: 10,
                total: 0
            },
            staffs: [],
            tableData: [],
            dialogVisible: false,
            showComment: ''
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
                    deviceNum: 'R001',
                    patrolNum: '12312',
                    deviceType: '办公楼日巡',
                    address: '办公楼',
                    staff: '曾温根',
                    patrolTime: '2019-09-20 10:10:10',
                    examState: '合格',
                    patrolState: '正常巡查',
                    examComment: 'dasdsadadavdfbgsbgasdasdasdasdasdasdasdasdsa'
                },
                {
                    deviceNum: 'P032',
                    patrolNum: '12445657',
                    deviceType: '办公楼日巡',
                    address: '办公楼',
                    staff: '曾',
                    patrolTime: '2019-09-20 10:10:10',
                    examState: '合格',
                    patrolState: '正常巡查',
                    examComment: 'lllllll'
                },
                {
                    deviceNum: 'P111',
                    patrolNum: '12312',
                    deviceType: '办公楼日巡',
                    address: '办公楼',
                    staff: '曾温根',
                    patrolTime: '2019-09-20 10:10:10',
                    examState: '合格',
                    patrolState: '正常巡查',
                    examComment: 'kkkkkkk'
                },
                {
                    deviceNum: 'R057',
                    patrolNum: '34535',
                    deviceType: '办公楼日巡',
                    address: '办公楼',
                    staff: '曾温根',
                    patrolTime: '2019-09-20 10:10:10',
                    examState: '合格',
                    patrolState: '正常巡查',
                    examComment: 'yyyyyyyyy'
                },
                {
                    deviceNum: 'R001',
                    patrolNum: '12312',
                    deviceType: '办公楼日巡',
                    address: '办公楼',
                    staff: '曾温根',
                    patrolTime: '2019-09-20 10:10:10',
                    examState: '合格',
                    patrolState: '正常巡查',
                    examComment: 'hhhhhhhhhh'
                },
                {
                    deviceNum: 'P032',
                    patrolNum: '12445657',
                    deviceType: '办公楼日巡',
                    address: '办公楼',
                    staff: '曾',
                    patrolTime: '2019-09-20 10:10:10',
                    examState: '合格',
                    patrolState: '正常巡查',
                    examComment: 'bbbbbbbbbbb'
                },
                {
                    deviceNum: 'P111',
                    patrolNum: '12312',
                    deviceType: '办公楼日巡',
                    address: '办公楼',
                    staff: '曾温根',
                    patrolTime: '2019-09-20 10:10:10',
                    examState: '合格',
                    patrolState: '正常巡查',
                    examComment: 'vvvvvvvvvvvv'
                },
                {
                    deviceNum: 'R057',
                    patrolNum: '34535',
                    deviceType: '办公楼日巡',
                    address: '办公楼',
                    staff: '曾温根',
                    patrolTime: '2019-09-20 10:10:10',
                    examState: '合格',
                    patrolState: '正常巡查',
                    examComment: 'sadsadasd'
                }
            ];
            this.tableData = tableData;
            this.staffs = staffs;
        },
        handleSizeChange() {},
        handleCurrentChange() {},
        show(num) {
            const { examComment } = this.tableData.find(
                val => val.patrolNum === num
            );
            this.showComment = examComment || '';
            console.log(examComment);

            this.dialogVisible = true;
        },
        reset(){
               this.$refs.form.resetFields();
        }
    },
    created() {
        this.getData();
    },
    components: {
        PatrolTable
    }
};
</script>

<style scoped lang="less">
.statis_patrol {
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
