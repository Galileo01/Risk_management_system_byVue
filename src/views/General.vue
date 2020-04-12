<template>
    <div class="general">
        <BreadNav :texts="['企业履历']" />
        <div class="content">
            <div class="record">
                <h2>{{ record.company }}</h2>

                <p class="desc">
                    本公司从本系统建成以来一共出现
                    {{ record.total }} 个隐患，其中等级一的隐患
                    {{ record.level1 }} 个，等级二的
                    {{ record.level2 }} 个，等级三的隐患
                    {{ record.level3 }} 个，等级四的隐患
                    {{ record.level4 }} 个，等级五的隐患 已处理{{
                        record.solved
                    }}个，未处理{{ record.total - record.solved }}个
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
                        <!-- <p>
                            等级一的隐患<span>占比{{ record.level1/record.total }} </span>
                        </p>
                        <p>
                            等级二的隐患<span>{{ record.level2 }}</span> 个
                        </p>
                        <p>
                            等级三的隐患<span>{{ record.level3 }}</span> 个
                        </p>
                        <p>
                            等级四的隐患<span>{{ record.level4 }}</span> 个
                        </p> -->
                        <el-table :data="tableData"  :cellStyle="{ padding: '10px' }">
                            <el-table-column prop="level" label="等级"></el-table-column>
                             <el-table-column prop="count" label="数目"></el-table-column>
                             <el-table-column  label="数目占比"><template v-slot="{row}">
                                 {{row.countPro|toPro}}
                                 </template></el-table-column>
                                  <el-table-column  label="治理占比"><template v-slot="{row}">
                                 {{row.solvePro|toPro}}
                                 </template></el-table-column>
                                  <el-table-column  label="未占比"><template v-slot="{row}">
                                 {{1-row.solvePro|toPro}}
                                 </template></el-table-column>
                        </el-table>
                    </el-popover>
                </div>
                <el-amap
                   
                    class="amap"
                    :center="center"
                    :zoom="16"
                    ref="amap"
                >
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
                        :content="'等级' + item.level"
                        :key="100 + index"
                        :visible="item.visible"
                    />
                </el-amap>
            </div>
        </div>
    </div>
</template>

<script>
import mapmixin from 'commonjs/mapmixin';
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
            boxVisible: true
        };
    },
    filters:{
        toPro(val){
            return (val*100).toFixed()+'%';
        }
    },
    computed: {},
    components: {},
    methods: {
        getData() {
            const data = {
                total: 40,
                solved: 38,
                level1: 30,
                level2: 20,
                level3: 10,
                level4: 33
            };

            this.record = {
                company: '重庆市永川区金银坡斗子丘建材有限公司',
                total: data.total,
                solved: data.solved
            };
            this.tableData = [
                {
                    level: '1',
                    count: data.level1,
                    countPro: data.level1 / data.total,
                    solvePro: 0.7
                },
                {
                    level: '2',
                    count: data.level2,
                    countPro: data.level2 / data.total,
                    solvePro: 0.7
                },
                {
                    level: '3',
                    count: data.level3,
                    countPro: data.level3 / data.total,
                    solvePro: 0.5
                },
                {
                    level: '4',
                    count: data.level1,
                    countPro: data.level1 / data.total,
                    solvePro: 0.8
                }
            ];
            this.positions = [
                {
                    position: [105.756894, 29.336377],
                    level: 1,
                    visible: false
                },
                {
                    position: [105.752402, 29.332034],
                    level: 2,
                    visible: false
                },
                {
                    position: [105.756618, 29.3362],
                    level: 3,
                    visible: false
                },
                {
                    position: [105.757223, 29.33282],
                    level: 4,
                    visible: false
                }
            ];
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
        }
    },
    created() {
        this.getData();
        this.mountEvent('positions'); //绑定 信息窗口的 点击 事件 显示，
    }
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
                    color: #f56c6c;
                    margin-left: 100px;
                }
                .danger_solved {
                    color: #67c23a;
                }
                .danger_unso {
                    color: #f56c6c;
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
        // margin-ma: 0 auto;
    }
}
</style>
