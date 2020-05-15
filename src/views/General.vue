<template>
    <div class="general">
        <BreadNav :texts="['企业履历']" />
        <div class="content">
            <div class="record">
                <h2>{{ record.company }}</h2>

                <p class="desc" v-if="tableData.length !== 0">
                    本公司从本系统建成以来一共出现
                    <span class="danger_total">{{ record.total }}</span>
                    个隐患，其中等级一的隐患
                    <span class="level1">{{ tableData[0].count }}</span>
                    个，等级二的
                    <span class="level2">{{ tableData[1].count }}</span>
                    个，等级三的隐患
                    <span class="level3">{{ tableData[2].count }}</span>
                    个，等级四的隐患
                    <span class="level4">{{ tableData[3].count }}</span>
                    个，已处理<span class="danger_solved">{{
                        record.solved
                    }}</span
                    >个，未处理<span style="color:red">
                        {{ record.total - record.solved }}</span
                    >个
                </p>
            </div>
            <div class="points">
                <div class="show_box">
                    <el-button
                        icon="el-icon-menu"
                        circle
                        type="primary"
                        @click="boxVisible = true"
                        class="open_btn"
                    ></el-button>
                    <el-popover
                        placement="top"
                        width="400"
                        v-model="boxVisible"
                    >
                        <el-button
                            icon="el-icon-close"
                            type="danger"
                            circle
                            size="mini"
                            class="close_btn"
                            @click="boxVisible = false"
                        ></el-button>
                        <h3>各种隐患的个数</h3>
                        <p>
                            隐患总数<span class="danger_total">{{
                                record.total
                            }}</span>
                            个
                        </p>
                        <p>
                            已治理的隐患<span class="danger_solved">{{
                                record.solved
                            }}</span>
                            个
                        </p>
                        <p>
                            未治理的隐患<span class="danger_unso">{{
                                record.total - record.solved
                            }}</span>
                            个
                        </p>

                        <el-table
                            :data="tableData"
                            :cellStyle="{ padding: '10px' }"
                        >
                            <el-table-column
                                prop="level"
                                label="等级"
                            ></el-table-column>
                            <el-table-column
                                prop="count"
                                label="数目"
                            ></el-table-column>

                            <el-table-column label="数目占比"
                                ><template v-slot="{ row }">
                                    {{ row.countPro | toPro }}
                                </template></el-table-column
                            >
                            <el-table-column label="治理数目"
                                ><template v-slot="{ row }">
                                    {{ row.solved }}
                                </template></el-table-column
                            >
                            <el-table-column label="治理占比"
                                ><template v-slot="{ row }">
                                    {{ row.solvePro | toPro }}
                                </template></el-table-column
                            >
                        </el-table>
                    </el-popover>
                </div>
                <el-amap class="amap" :center="center" :zoom="17" ref="amap">
                    <div v-if="positions.length !== 0">
                        <el-amap-circle-marker
                            v-for="(item, index) in positions"
                            :center="item.position"
                            :radius="10"
                            :fill-color="fillColor(item.level)"
                            :key="index"
                            :strokeWeight="1"
                            :events="events"
                            :vid="index + ''"
                        />
                        <el-amap-info-window
                            v-for="(item, index) in positions"
                            :position="item.position"
                            :key="100 + index"
                            :visible="item.visible"
                            ><div class="window">
                                <p>{{ item.deviceName }}</p>
                                <p>
                                    风险等级:
                                    <span :class="'level' + item.level">{{
                                        item.level
                                    }}</span>
                                </p>
                            </div>
                        </el-amap-info-window>
                    </div>
                </el-amap>
            </div>
        </div>
    </div>
</template>

<script>
import mapmixin from 'commonjs/mapmixin';
import { getDangers } from 'network/danger';
import { getDevice } from 'network/device';
import { getCompanys } from 'network/company';
export default {
    name: 'General',
    mixins: [mapmixin],
    data() {
        return {
            record: {},
            tableData: [],
            positions: [],
            center: [105.757223, 29.33282],
            // events: {},
            boxVisible: true,
        };
    },
    filters: {
        toPro(val) {
            return (val * 100).toFixed() + '%';
        },
    },
    computed: {},
    components: {},
    methods: {
        async getData() {
            this.record = {}; //清空数据
            this.tableData = [];
            this.positions = [];
            const name = localStorage.getItem('enterpriseName');
            let res = await getDangers({
                enterpriseName: name,
                page: 1,
                limit: 9999,
            });
            console.log(res);
            if (!res.flag) {
                return this.$message.error('风险数据获取失败');
            }
            const obj = {};

            let solved = 0, //每种等级得 个数
                level1 = 0,
                level2 = 0,
                level3 = 0,
                level4 = 0;
            let level1S = 0, //每种等级 治理得个数
                level2S = 0,
                level3S = 0,
                level4S = 0;
            const total = res.risks.length;

            if (res.risks.length > 0) {
                res.risks.forEach((val) => {
                    if (val.state === '1') solved++;
                    switch (val.level) {
                        case 1:
                            level1++;
                            if (val.state === '1') level1S++;
                            break;
                        case 2:
                            level2++;
                            if (val.state === '1') level2S++;
                            break;
                        case 3:
                            level3++;
                            if (val.state === '1') level3S++;
                            break;
                        case 4:
                            level4++;
                            if (val.state === '1') level4S++;
                            break;
                    }
                    if (!obj[val.deviceName]) {
                        // 处理risks 数组，如果 设备有重复 ，取等级最高的 风险
                        obj[val.deviceName] = {
                            level: val.level,
                        };
                    } else {
                        const old = obj[val.deviceName].level;
                        const theNew = val.level;
                        obj[val.deviceName].level = old > theNew ? old : theNew;
                    }
                });
            }
            // console.log(obj);

            this.record = {
                company: localStorage.getItem('enterpriseName'),
                total: total,
                solved: solved,
            };
            this.tableData = [
                {
                    level: '1',
                    count: level1,
                    countPro: level1 / total,
                    solvePro: level1S / level1,
                    solved: level1S,
                },
                {
                    level: '2',
                    count: level2,
                    countPro: level2 / total,
                    solvePro: level2S / level2,
                    solved: level2S,
                },
                {
                    level: '3',
                    count: level3,
                    countPro: level3 / total,
                    solvePro: level3S / level3,
                    solved: level3S,
                },
                {
                    level: '4',
                    count: level4,
                    countPro: level1 / total,
                    solvePro: level4S / level4,
                    solved: level4S,
                },
            ];
            const temp = [];
            for (let prop in obj) {
                res = await getDevice({ name: prop, limit: 1, page: 1 });
                console.log(res);
                if (res.flag) {
                    this.positions.push({
                        level: obj[prop].level,
                        position: [
                            res.devices[0].longitude,
                            res.devices[0].latitude,
                        ],
                        visible: false,
                        deviceName: prop,
                    });
                }
            }
            // this.positions = temp;
            res = await getCompanys({ name, page: 1, limit: 1 });
            console.log(res);

            if (!res.flag) this.$message.error('企业信息获取失败');
            else {
                const { longitude, latitude } = res.enterprises[0];
                sessionStorage.setItem('longitude', longitude);
                sessionStorage.setItem('latitude', latitude);
            }
            const { longitude, latitude } = res.enterprises[0];
            if (this.positions.length > 0)
                this.center = this.positions[0].position;
            else this.center = [longitude, latitude];
        },
        fillColor(level) {
            switch (level) {
                case 1:
                    return '#FE0000'; // 红色
                case 2:
                    return '#FFAD5B'; //橙色
                case 3:
                    return '#FFFF00'; //黄
                case 4:
                    return '#0000FE'; //蓝色
            }
        },
    },
    created() {
        this.getData();
        this.mountEvent('positions'); //绑定 信息窗口的 点击 事件 显示，
    },
    activated() {
        this.getData();
    },
};
</script>

<style scoped lang="less">
.content {
    padding-left: 20px;
    .record {
        width: 800px;
        margin: 0 auto;
        h2 {
            text-align: center;
        }
        .desc {
            text-indent: 2em;
            font-size: 14px;
        }
    }
}
.danger_total {
    color: #f56c6c;
}
.danger_solved {
    color: #67c23a;
}
.danger_unso {
    color: #f56c6c;
}
.level1 {
    color: #fe0000;
}
.level2 {
    color: #ffad5b;
}
.level3 {
    color: greenyellow;
}
.level4 {
    color: #0000fe;
}
.points {
    display: flex;
    .show_box {
        margin-right: 10px;
        position: absolute;
        z-index: 2;
        /deep/ .el-popover {
            top: 10px;
            p {
                display: flex;
                span {
                    margin-left: 70px;
                    margin-right: 10px;
                }
                .danger_total {
                    margin-left: 100px;
                }
            }
        }
        .open_btn {
            margin-top: 10px;
        }
        .close_btn {
            position: absolute;
            top: -8px;
            right: -9px;
            padding: 4px;
            border: 1px;
        }
    }
    .amap {
        height: 520px;
        // width: 1160px;
        width: calc(100% - 10px);

        .window {
            font-size: 13px;
        }
        span {
            margin-right: 3px;
        }
    }
}
</style>
