<template>
    <div class="statis_patrol">
        <BreadNav :texts="['数据统计', '巡查报表']" />
        <el-card>
            <div class="title">
                <span>{{ showType === 'chart' ? '图形报表' : '数据表格' }}</span
                ><el-button
                    size="medium"
                    type="primary"
                    @click="changeShowForm($event)"
                    >查看{{
                        showType === 'table' ? '图形报表' : '数据表格'
                    }}</el-button
                >
            </div>
            <section class="charts" v-show="showType === 'chart'">
                <section class="bar-wapper">
                    <div class="bar-chart"></div>
                </section>
                <section class="pie-wapper">
                    <div class="pie-chart"></div>
                </section>
            </section>
            <section class="table" v-show="showType === 'table'">
                <div class="btns">
                    <el-button size="mini" type="info" @click="reset"
                        >重置输入</el-button
                    >
                    <el-button type="success" size="medium" @click="saveExcel"
                        >下载</el-button
                    >
                    <el-button
                        type="primary"
                        size="medium"
                        @click="getTableData"
                        >查询</el-button
                    >
                </div>
                <el-form
                    inline
                    label-width="100px"
                    ref="form"
                    :model="queryInfo"
                >
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
                    <el-form-item label="任务类型" prop="cycle">
                        <el-select
                            v-model="queryInfo.cycle"
                            clearable
                            @change="getTableData"
                        >
                            <el-option label="不限" :value="-1"></el-option>
                            <el-option label="日巡" :value="1"></el-option>
                            <el-option label="周巡" :value="7"></el-option>
                            <el-option label="月巡" :value="30"></el-option>
                            <el-option label="自定义" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="巡查人员" prop="userName">
                        <el-select
                            v-model="queryInfo.userName"
                            clearable
                            @change="getTableData"
                        >
                            <el-option
                                v-for="(item, index) in staffs"
                                :key="index"
                                :label="item.name"
                                :value="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="任务状态" prop="taskState">
                        <el-select
                            v-model="queryInfo.taskState"
                            clearable
                            @change="getTableData"
                        >
                            <el-option label="待完成" value="0"></el-option>
                            <el-option label="待审核" value="1"></el-option>
                            <el-option label="合格" value="2"></el-option>
                            <el-option label="不合格" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <PatrolTable :data="showData" @show="show" />
                <!--包含所有的 数据，不显示专门用于 表格的下载-->
                <PatrolTable :data="tableData" id="table" v-show="false" />
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.page"
                    :page-sizes="[8, 10]"
                    :page-size="queryInfo.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="queryInfo.total"
                ></el-pagination>
            </section>
        </el-card>
        <el-dialog :visible.sync="dialogVisible" title="审核备注">
            <p>{{ showComment }}</p>
        </el-dialog>
    </div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/toolbox');
import PatrolTable from 'components/statis/PatrolTable';
import { getTaskDevices } from 'network/task';
import { formatDate } from 'commonjs/utils';
import FileSaver from 'file-saver';
import Xlsx from 'xlsx';
export default {
    name: 'StatisPatrol',
    data() {
        return {
            showType: 'chart',
            barChart: {},
            pieChart: {}, //图表对象
            queryInfo: {
                startTime: '',
                endTime: '',
                taskState: '',
                cycle: -1,
                userName: '',
                page: 1,
                size: 8,
                total: 0,
            },
            tableData: [],
            showData: [],
            dialogVisible: false,
            showComment: '',
        };
    },
    computed: {
        staffs() {
            return this.$store.state.staffs;
        },
    },
    methods: {
        async getTableData() {
            this.tableData = [];
            const queryInfo = this.queryInfo;
            if (queryInfo.endTime && queryInfo.startTime) {
                queryInfo.startTime = formatDate(
                    queryInfo.startTime,
                    'yyyy-MM-dd hh:mm:ss'
                );
                queryInfo.endTime = formatDate(
                    queryInfo.endTime,
                    'yyyy-MM-dd hh:mm:ss'
                );
            }
            const res = await getTaskDevices(queryInfo);
            console.log(res);
            if (!res.flag) return this.$message.error('巡查数据获取失败');

            this.tableData = res.task_devices;
            const { size, page } = this.queryInfo;
            const offset = (page - 1) * size;
            this.showData = this.tableData.slice(offset, offset + size);
            this.queryInfo.total = res.task_devices.length;
            console.log(this.showData);
        },
        async getChartData() {
            const res = await getTaskDevices({});
            console.log(res);
            if (!res.flag) return this.$message.error('巡查数据获取失败');
            let weekly = 0;
            let dayly = 0;
            let monthly = 0;
            let diy = 0;
            const states = {};
            for (let i = 0; i < 4; i++) {
                states[i] = 0;
            }

            for (const item of res.task_devices) {
                switch (item.cycle) {
                    case 1:
                        dayly++;
                        break;
                    case 7:
                        weekly++;
                        break;
                    case 30:
                        monthly++;
                        break;
                    case 0:
                        diy++;
                        break;
                }
                if (item.taskState) states[item.taskState]++;
            }
            console.log(states);
            console.log(weekly, dayly, monthly, diy);

            this.drawChart([dayly, weekly, monthly, diy], states);
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
        show(note) {
            this.showComment = note;
            this.dialogVisible = true;
        },
        reset() {
            this.$refs.form.resetFields();
        },
        //改变展示 数据的形势
        changeShowForm(e, type = 'switch') {
            //表示 切换 类型  switch/choose :单纯的切换 /选中某一字段 切换
            if (this.showType === 'chart') {
                // 如果 只是单纯的 切换，清空表单，
                if (type === 'switch') {
                    this.queryInfo.cycle = -1;
                    this.queryInfo.taskState = '';
                }
                this.getTableData();
                this.showType = 'table';
            } else {
                this.showType = 'chart';
            }
        },
        //准备  图表
        prepareChart() {
            this.$nextTick(() => {
                this.barChart = echarts.init(
                    document.querySelector('.bar-chart')
                );
                this.barChart.setOption({
                    title: {
                        text: '所有任务类型数量',
                        textStyle: {
                            fontSize: 14,
                            fontWeight: 'bold',
                        },
                    },
                    tooltip: {},
                    toolbox: {
                        feature: {
                            saveAsImage: {},
                        },
                    },
                    xAxis: {
                        data: ['日巡', '周巡', '月巡', '自定义'],
                    },
                    yAxis: {},
                    series: [
                        {
                            name: '任务数量',
                            type: 'bar',
                            label: {
                                show: true,
                                position: 'top',
                            },
                            itemStyle: {
                                color: ({ dataIndex }) => {
                                    const colorList = [
                                        '#749F83',
                                        '#C23531',
                                        '#61A0A8',
                                        '#2F4554',
                                    ];
                                    return colorList[dataIndex];
                                },
                            },
                            data: [],
                        },
                    ],
                });
                this.barChart.on('click', ({ dataIndex }) => {
                    const types = [1, 7, 30, 0];
                    this.queryInfo.cycle = types[dataIndex];
                    this.changeShowForm(null, 'choose');
                });
                this.pieChart = echarts.init(
                    document.querySelector('.pie-chart')
                );
                this.pieChart.setOption({
                    title: {
                        text: '任务状态',
                        textStyle: {
                            fontSize: 14,
                            fontWeight: 'bold',
                        },
                    },
                    tooltip: {
                        formatter: '{a} <br/>{b} : {c} ({d}%)',
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {},
                        },
                    },
                    series: [
                        {
                            name: '占比',
                            type: 'pie',
                            radius: '75%',
                            roseType: 'angle',
                            data: [],
                        },
                    ],
                });
                this.pieChart.on('click', ({ dataIndex }) => {
                    this.queryInfo.taskState = dataIndex + '';
                    this.changeShowForm(null, 'choose');
                    //   console.log(dataIndex);
                });
            });
        },
        //获取 数据，绘制 图表
        drawChart(types, states) {
            this.$nextTick(() => {
                this.barChart.setOption({
                    series: [
                        {
                            name: '任务数量',
                            data: types,
                        },
                    ],
                });
                this.pieChart.setOption({
                    series: [
                        {
                            name: '占比',
                            data: [
                                { value: states[0], name: '待完成' },
                                { value: states[1], name: '已完成' },
                                { value: states[2], name: '不合格' },
                                {
                                    value: states[3],
                                    name: '合格',
                                },
                            ],
                        },
                    ],
                });
            });
        },
        //保存表格到 xlsx 文件
        saveExcel() {
            const wb = Xlsx.utils.table_to_book(
                document.querySelector('#table')
            );
            const wbout = Xlsx.write(wb, {
                bookType: 'xlsx',
                bookSST: true,
                type: 'array',
            });
            try {
                FileSaver.saveAs(
                    new Blob([wbout], { type: 'application/octet-stream' }),
                    '巡查报表.xlsx'
                );
            } catch (err) {
                console.log(err);
            }
        },
    },
    created() {
        this.prepareChart();
        this.getChartData();
    },
    components: {
        PatrolTable,
    },
};
</script>

<style scoped lang="less">
.statis_patrol {
    /deep/ .el-card__body {
        padding: 10px 20px 10px 20px;
    }
    .title {
        display: flex;
        justify-content: space-between;
        span {
            font-weight: bold;
        }
        margin-bottom: 20px;
    }
    .charts {
        display: flex;
    }
    .bar-chart,
    .pie-chart {
        width: 600px;
        height: 400px;
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
