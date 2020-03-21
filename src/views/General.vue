<template>
    <div class="general">
        <BreadNav :texts="['企业介绍']" />
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
                <div class="show_box"></div>
                <el-amap
                    vid="amapDemo"
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
export default {
    name: 'General',
    data() {
        return {
            record: {},
            positions: [],
            center: [105.757223, 29.33282],
            events: {}
        };
    },
    computed: {},
    components: {},
    methods: {
        getData() {
            this.record = {
                company: '重庆市永川区金银坡斗子丘建材有限公司',
                total: 40,
                solved: 38,
                level1: 30,
                level2: 20,
                level3: 10,
                level4: 33
            };
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
        },
        mountEvent() {
            //定义 坐标点 点击的事件 ，显示 提示框
            const self = this;
            this.events = {
                click(event) {
                    const vid = event.target.F.vid;
              // 高德地图只支持同时一个信息窗体的显示。
                    self.positions[vid].visible=false;

                    //dom 更新完之后才 显示
                    self.$nextTick(()=>{
                       self.positions[vid].visible=true;//点击 显示
                    })
                }
            };
        }
    },
    created() {
        this.getData();
        this.mountEvent();
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
        width: 150px;
        height: 300px;
        border: 1px solid black;
        margin-right: 10px;
    }
    .amap {
        height: 520px;
        // width: 1160px;
         width: calc(100% - 180px);
        // margin-ma: 0 auto;
    }
}
</style>
