<template>
    <div class="statis_danger">
        <BreadNav :texts="['数据统计', '隐患数据']" />
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
                <section class="line-wapper">
                    <p>不同等级的隐患数量变化</p>
                    <el-row class="ali-c"
                        ><el-col :span="4"
                            ><el-tag size="medium">选择时间范围</el-tag></el-col
                        >
                        <el-col :span="6">
                            <el-select
                                v-model="chartInfo.lineTime"
                                size="small"
                                @change="changeLineData"
                            >
                                <el-option
                                    label="近7周"
                                    value="weekly"
                                ></el-option>
                                <el-option
                                    label="近7月"
                                    value="monthly"
                                ></el-option>
                                <el-option
                                    label="近4年"
                                    value="yearly"
                                ></el-option> </el-select
                        ></el-col>
                    </el-row>
                    <div class="line-chart"></div>
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
                    :model="queryInfo"
                    ref="form"
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
                            @clear="getTableData"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="来源设备" prop="deviceName">
                        <el-input
                            v-model="queryInfo.deviceName"
                            clearable
                            @clear="getTableData"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="隐患类型" prop="dangerType"
                        ><el-select
                            v-model="queryInfo.riskTypeName"
                            clearable
                            @change="getTableData"
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
                            @change="getTableData"
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
                    <el-form-item label="隐患状态" prop="state">
                        <el-select
                            v-model="queryInfo.state"
                            @change="getTableData"
                            clearable
                        >
                            <el-option label="未处理" value="0"></el-option>
                            <el-option label="已处理" value="1"></el-option>
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
                <DangerTable :data="showData" @show="show" :showState="true" />
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
        <el-dialog :visible.sync="dialogVisible" title="隐患描述">
            <p>{{ showDes }}</p>
        </el-dialog>
    </div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/line');
require('echarts/lib/chart/pie');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/toolbox');
import { getDangers } from 'network/danger';
import { statistic } from 'commonjs/utils';
import DangerTable from 'components/statis/DangerTable';
export default {
    name: 'StatisDanger',
    data() {
        return {
            showType: 'chart',
            chartInfo: {
                lineTime: 'weekly', //曲线展示的时间范围
            },
            lineData: {}, //曲线图表的 数据
            lineChart: {},
            pieChart: {}, //图表对象

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
            showData: [],
            tableData: [],
            dialogVisible: false,
            showDes: '',
        };
    },
    computed: {
        dangerTypes() {
            return this.$store.state.dangerTypes;
        },
    },
    methods: {
        async getTableData() {
            const res = await getDangers({
                ...this.queryInfo,
                limit: 9999,
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
        async getChartData() {
            const res = await getDangers({
                ...this.queryInfo,
                limit: 9999,
            });
            console.log(res);
            if (!res.flag) return this.$message.error('风险获取失败');
            //根据返回的数据 统计  图表所需要的数据
            const levels = [
                {
                    value: 0,
                    name: '等级1',
                },
                {
                    value: 0,
                    name: '等级2',
                },
                { value: 0, name: '等级3' },
                { value: 0, name: '等级4' },
            ];
            console.log('types', this.dangerTypes);
            const types = {};
            for (const item of this.dangerTypes) {
                types[item.riskTypeID - 1] = {
                    value: 0,
                    name: item.name,
                };
            }

            for (const item of res.risks) {
                const { level, riskTypeID } = item;
                console.log(riskTypeID - 1);
                levels[level - 1].value++;
                types[riskTypeID - 1].value++;
            }
            const result = statistic(res.risks);
            this.lineData = result;
            this.drawChart({
                levels,
                types: Object.values(types),
            });
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
            const { note } = this.tableData.find((val) => val.riskID === num);
            this.showDes = note || '';
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
                    this.queryInfo.level = '';
                    this.queryInfo.riskTypeName = '';
                }
                this.getTableData();
                this.showType = 'table';
            } else {
                this.showType = 'chart';
            }
        },
        changeLineData() {
            const xAxis = [];
            const time = this.chartInfo.lineTime;
            const data = this.lineData[time];
            let unit = ''; //横轴的单位
            if (time === 'weekly') unit = '周';
            else if (time === 'monthly') unit = '月';
            else {
                unit = '年';
            }
            for (let i = 0; i < data.length - 1; i++) {
                xAxis.push(`第${i + 1}${unit}`);
            }
            xAxis.push('本' + unit);
            this.lineChart.setOption({
                xAxis: {
                    data: xAxis,
                },
                series: [
                    {
                        name: '等级1',
                        data: data['1'],
                    },
                    {
                        name: '等级2',
                        data: data['2'],
                    },
                    {
                        name: '等级3',
                        data: data['3'],
                    },
                    {
                        name: '等级4',
                        data: data['4'],
                    },
                ],
            });
        },
        //准备  图表
        prepareChart() {
            this.$nextTick(() => {
                this.lineChart = echarts.init(
                    document.querySelector('.line-chart')
                );
                this.lineChart.setOption({
                    legend: {},
                    xAxis: {
                        data: [],
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {},
                        },
                    },
                    label: {
                        show: true,
                    },
                    yAxis: {},
                    series: [
                        {
                            name: '等级1',
                            type: 'line',
                            data: [],
                            itemStyle: {
                                color: '#F56C6C',
                            },
                        },
                        {
                            name: '等级2',
                            type: 'line',
                            data: [],
                            itemStyle: {
                                color: '#E6A23C',
                            },
                        },
                        {
                            name: '等级3',
                            type: 'line',
                            data: [],
                            itemStyle: {
                                color: '#D7DF01',
                            },
                        },
                        {
                            name: '等级4',
                            type: 'line',
                            data: [],
                            itemStyle: {
                                color: '#409EFF',
                            },
                        },
                    ],
                });

                this.pieChart = echarts.init(
                    document.querySelector('.pie-chart')
                );
                this.pieChart.setOption({
                    tooltip: {
                        formatter: '{a} <br/>{b} : {c} ({d}%)',
                    },

                    title: [
                        {
                            text: '隐患等级',
                            subtext: '总数比例',
                            textStyle: {
                                fontSize: 14,
                                fontWeight: 'bold',
                            },
                        },
                        {
                            text: '隐患类型',
                            subtext: '总数比例',
                            left: '50%',
                            textStyle: {
                                fontSize: 14,
                                fontWeight: 'bold',
                            },
                        },
                    ],
                    toolbox: {
                        feature: {
                            saveAsImage: {},
                        },
                    },
                    label: {
                        show: true,
                        // formatter: '{b}: {d}%',
                    },
                    series: [
                        {
                            name: '隐患等级',
                            type: 'pie',
                            center: ['25%', '50%'],
                            radius: '55%',

                            itemStyle: {
                                color: ({ dataIndex }) => {
                                    const colorList = [
                                        '#FA5858',
                                        '#FFB46A',
                                        '#D7DF01',
                                        '#2E64FE',
                                    ];
                                    return colorList[dataIndex];
                                },
                            },
                            data: [],
                        },
                        {
                            name: '隐患类型',
                            type: 'pie',
                            center: ['75%', '50%'],
                            radius: '55%',
                            data: [],
                        },
                    ],
                });
                this.pieChart.on('click', ({ seriesIndex, dataIndex }) => {
                    const types = this.dangerTypes.map((item) => item.name);
                    console.log(seriesIndex, dataIndex);
                    this.queryInfo.level = '';
                    this.queryInfo.riskTypeName = '';
                    if (seriesIndex === 0) {
                        this.queryInfo.level = dataIndex + 1;
                    } else {
                        this.queryInfo.riskTypeName = types[dataIndex];
                    }

                    this.changeShowForm(null, 'choose');
                });
            });
        },
        //获取 数据，绘制 图表
        drawChart({ levels, types }) {
            const xAxis = [];
            const time = this.chartInfo.lineTime;
            const data = this.lineData[time];
            let unit = ''; //横轴的单位
            if (time === 'weekly') unit = '周';
            else if (time === 'monthly') unit = '月';
            else {
                unit = '年';
            }
            for (let i = 0; i < data.length - 1; i++) {
                xAxis.push(`第${i + 1}${unit}`);
            }
            xAxis.push('本' + unit);
            this.$nextTick(() => {
                this.lineChart.setOption({
                    xAxis: {
                        data: xAxis,
                    },
                    series: [
                        {
                            name: '等级1',
                            data: data['1'],
                        },
                        {
                            name: '等级2',
                            data: data['2'],
                        },
                        {
                            name: '等级3',
                            data: data['3'],
                        },
                        {
                            name: '等级4',
                            data: data['4'],
                        },
                    ],
                });
            });

            this.pieChart.setOption({
                series: [
                    {
                        name: '隐患等级',
                        data: levels,
                    },
                    {
                        name: '隐患类型',
                        data: types,
                    },
                ],
            });
        },
    },
    created() {
        this.prepareChart();
        if (this.dangerTypes.length === 0) {
            //由于页面刷新 重新获取 异步请求 还没有完成
            this.$store.dispatch('reqDangerTypes').then((res) => {
                this.getChartData();
            });
        } else {
            this.getChartData();
        }
    },
    components: {
        DangerTable,
    },
};
</script>

<style scoped lang="less">
.statis_danger {
    /deep/ .el-card__body {
        padding: 10px 20px 10px 20px;
    }
    .title {
        display: flex;
        justify-content: space-between;
        span {
            font-weight: bold;
        }
        margin-bottom: 10px;
    }
    .charts {
        display: flex;
    }
    .line-chart {
        width: 600px;
        height: 400px;
    }
    .pie-wapper {
        width: calc(100% - 600px);
        height: 400px;
    }
    .pie-chart {
        height: 400px;
        width: 100%;
        margin-top: 32px;
    }
    .line-wapper {
        p {
            font-size: 14px;
            font-weight: bold;
        }
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
