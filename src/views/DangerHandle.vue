<template>
    <div class="danger_handle">
        <BreadNav :texts="['隐患管理', '隐患处理']" />
        <el-card>
            <div class="btns">
                <el-button size="mini" type="info" @click="resetQuery"
                    >重置输入</el-button
                >
                <el-button type="primary" size="medium" @click="getData"
                    >查询</el-button
                >
            </div>
            <el-form
                inline
                label-width="100px"
                :model="queryInfo"
                ref="queryForm"
                class="query"
            >
                <!-- <el-form-item label="来源时间(起)" prop="startTime"
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
                ></el-form-item> -->
                <el-form-item label="来源任务" prop="taskName">
                    <el-input
                        v-model="queryInfo.taskName"
                        clearable
                        @clear="getData"
                    ></el-input>
                </el-form-item>
                <el-form-item label="来源设备" prop="deviceName">
                    <el-input
                        v-model="queryInfo.deviceName"
                        clearable
                        @clear="getData"
                    ></el-input>
                </el-form-item>
                <el-form-item label="隐患类型" prop="dangerType"
                    ><el-select
                        v-model="queryInfo.riskTypeName"
                        clearable
                        @change="getData"
                    >
                        <el-option
                            v-for="(item, index) in dangerTypes"
                            :key="index"
                            :value="item.name"
                            :label="item.name"
                        ></el-option></el-select
                ></el-form-item>
                <el-form-item label="风险等级" prop="level">
                    <el-select
                        v-model="queryInfo.level"
                        @change="getData"
                        clearable
                    >
                        <el-option
                            v-for="number in 4"
                            :key="number"
                            :value="number"
                            :label="'等级' + number"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="上报人员" prop="staff"
                    ><el-select v-model="queryInfo.staff" clearable>
                        <el-option
                            v-for="(item, index) in staffs"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        ></el-option> </el-select
                ></el-form-item> -->
            </el-form>
            <DangerTable
                :data="showData"
                @show="show"
                oprateType="handle"
                @handle="showDealDialog"
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

        <MKDialog
            :visible.sync="showDialogVisible"
            title="隐患描述"
            :showFooter="false"
        >
            <p>{{ showDes }}</p>
        </MKDialog>
        <MKDialog
            title="填写处理信息"
            :visible.sync="dealDialogVisible"
            @close="resetDealInfo"
            @dialog-cancel="dealDialogVisible = false"
            @dialog-confirm="submitDeal"
        >
            <el-form
                :model="dealInfo"
                label-width="80px"
                size="medium"
                ref="dealForm"
                :rules="infoRules"
            >
                <el-form-item label="处理人员" prop="dealStaff">
                    <el-input v-model="dealInfo.dealStaff"></el-input>
                </el-form-item>
                <el-form-item label="处理备注" prop="dealNote">
                    <el-input
                        v-model="dealInfo.dealNote"
                        type="textarea"
                    ></el-input>
                </el-form-item>
            </el-form>
        </MKDialog>
    </div>
</template>

<script>
import DangerTable from 'components/statis/DangerTable';
import { getDangers, dealDanger } from 'network/danger';
import MKDialog from 'components/com/MKDialog';
export default {
    name: 'DangerHandle',
    data() {
        return {
            queryInfo: {
                startTime: '',
                endTime: '',
                taskName: '', //来源 任务
                deviceName: '', //来源设备
                riskTypeName: '',
                level: '',
                state: '',
                page: 1,
                size: 5,
                total: 0,
            },
            tableData: [],
            showData: [],
            showDialogVisible: false,
            dealDialogVisible: false,
            dealInfo: {
                dealStaff: '',
                dealNote: '',
                riskID: 0,
            },
            infoRules: {
                dealStaff: [
                    { required: true, message: '请输入处理人员', trigger: 'blur' },
                ],
            },
            showDes: '',
        };
    },
    computed: {
        dangerTypes() {
            return this.$store.state.dangerTypes;
        },
    },
    methods: {
        async getData() {
            //获取 state 为0 ，未处理的 隐患
            const res = await getDangers({
                ...this.queryInfo,
                limit: 9999,
                state: '0',
            });
            console.log(res);
            if (!res.flag) return this.$message.error('风险获取失败');

            this.queryInfo.total = res.risks.length;
            //过滤掉 已经处理的 风险
            this.tableData = res.risks;
            const { size, page } = this.queryInfo;
            const offset = (page - 1) * size;
            this.showData = this.tableData.slice(offset, offset + size);
        },
        handleSizeChange(size) {
            this.queryInfo.size = size;
            this.changeShowData();
        },
        handleCurrentChange(page) {
            this.queryInfo.page = page;
            this.changeShowData();
        },
        changeShowData() {
            const { page, size } = this.queryInfo;
            const offset = (page - 1) * size;
            this.showData = this.tableData.slice(offset, offset + size);
        },
        show(num) {
            console.log(num);

            const { note } = this.tableData.find((val) => val.riskID === num);
            this.showDes = note || '';
            this.showDialogVisible = true;
        },
        resetQuery() {
            this.$refs.queryForm.resetFields();
        },
        resetDealInfo() {
            this.$refs.dealForm.resetFields();
        },
        showDealDialog(riskID) {
            this.dealInfo.riskID = riskID;
            this.dealDialogVisible = true;
        },
        submitDeal() {},
    },
    created() {
        this.getData();
    },
    components: {
        DangerTable,
        MKDialog,
    },
};
</script>

<style scoped lang="less">
.danger_handle {
    /deep/ .el-card__body {
        padding: 10px 20px 10px 20px;
    }
    .query {
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
    }

    .btns {
        margin-bottom: 10px;
        display: flex;
        justify-content: flex-end;
        padding-right: 30px;
    }
}
</style>
