<template>
    <div class="statis_patrol">
        <BreadNav :texts="['数据统计', '巡查报表']" />
        <el-card>
            <div class="title">
                <span>{{ showType === 'chart' ? '图形报表' : '数据表格' }}</span
                ><el-button size="medium" type="primary" @click="changeShowForm"
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
                    <el-button type="success" size="medium">下载</el-button>
                    <el-button type="primary" size="medium">查询</el-button>
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
                    <el-form-item label="任务类型" prop="type">
                        <el-select v-model="queryInfo.cycle" clearable>
                            <el-option label="日" value="1"></el-option>
                            <el-option label="周" value="7"></el-option>
                            <el-option label="月" value="30"></el-option>
                            <el-option label="自定义" value="0"></el-option>
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

                    <el-form-item label="任务状态" prop="state">
                        <el-select v-model="queryInfo.state" clearable>
                            <el-option
                                label="待完成"
                                value="待完成"
                            ></el-option>
                            <el-option
                                label="已完成"
                                value="已完成"
                            ></el-option>
                            <el-option
                                label="不合格"
                                value="not-pass"
                            ></el-option>
                            <el-option label="合格" value="pass"></el-option>
                        </el-select>
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
                part: '', //部门
                type: '',
                state: '',
                cycle: '',
                menu: '',
                page: 1,
                size: 10,
                total: 0,
            },
            staffs: [],
            tableData: [],
            dialogVisible: false,
            showComment: '',
        };
    },
    methods: {
        getTableData() {
            const staffs = [
                {
                    value: '01',
                    label: '吴磊',
                },
                {
                    value: '02',
                    label: '孔容',
                },
                {
                    value: '03',
                    label: '宋飞',
                },
                {
                    value: '04',
                    label: '曾温根',
                },
                {
                    value: '05',
                    label: '李沛儒',
                },
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
                    examComment: 'dasdsadadavdfbgsbgasdasdasdasdasdasdasdasdsa',
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
                    examComment: 'lllllll',
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
                    examComment: 'kkkkkkk',
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
                    examComment: 'yyyyyyyyy',
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
                    examComment: 'hhhhhhhhhh',
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
                    examComment: 'bbbbbbbbbbb',
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
                    examComment: 'vvvvvvvvvvvv',
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
                    examComment: 'sadsadasd',
                },
            ];
            this.tableData = tableData;
            this.staffs = staffs;
        },
        getChartData() {
            this.drawChart();
        },
        handleSizeChange() {},
        handleCurrentChange() {},
        show(num) {
            const { examComment } = this.tableData.find(
                (val) => val.patrolNum === num
            );
            this.showComment = examComment || '';
            console.log(examComment);

            this.dialogVisible = true;
        },
        reset() {
            this.$refs.form.resetFields();
        },
        //改变展示 数据的形势
        changeShowForm() {
            if (this.showType === 'chart') {
                if (this.tableData.length === 0) {
                    this.getTableData();
                }
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
                    this.changeShowForm();
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
                    },toolbox: {
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
                    const states = ['待完成', '已完成', '不合格', '合格'];
                    this.queryInfo.state = states[dataIndex];
                    this.changeShowForm();
                    //   console.log(dataIndex);
                });
            });
        },
        //获取 数据，绘制 图表
        drawChart() {
            this.$nextTick(() => {
                this.barChart.setOption({
                    series: [
                        {
                            name: '任务数量',
                            data: [36, 10, 10, 20],
                        },
                    ],
                });
                this.pieChart.setOption({
                    series: [
                        {
                            name: '占比',
                            data: [
                                { value: 60, name: '待完成' },
                                { value: 30, name: '已完成' },
                                { value: 20, name: '不合格' },
                                {
                                    value: 40,
                                    name: '合格',
                                },
                            ],
                        },
                    ],
                });
            });
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
        padding: 10px 20px 0 20px;
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
