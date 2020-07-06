<template>
    <div class="people-location">
        <BreadNav :texts="['人员监控', '人员定位']" />

        <div class="content">
            <el-amap :center="center" :zoom="16" class="amap" :plugin="plugin">
                <el-amap-marker
                    :icon="marker.online ? imgs.online : imgs.offline"
                    v-for="(marker, index) in showPoints"
                    :position="marker.position"
                    :key="index"
                    :events="events"
                    :vid="index + ''"
                ></el-amap-marker>
                <el-amap-info-window
                    v-for="(item, index) in showPoints"
                    :position="item.position"
                    :key="100 + index"
                    :visible="item.visible"
                >
                    <div class="window-info">
                        {{ item.name + ' ' + item.updataTime }}
                    </div></el-amap-info-window
                >
            </el-amap>
            <div class="selections">
                <h3>选择终端人员</h3>
                <el-checkbox v-model="ischeckAll" @change="handleCheckAllChange"
                    >全选</el-checkbox
                >
                <el-checkbox-group v-model="checkList" @change="handleChange">
                    <el-checkbox
                        v-for="(item, index) in selections"
                        :key="index"
                        :label="item.name"
                        >{{ item.name }}
                        <span class="online" v-if="item.online">在线</span
                        ><span v-else class="offline">离线</span>
                    </el-checkbox>
                </el-checkbox-group>
                <el-button type="primary" size="medium" @click="getShowPoints"
                    >定位</el-button
                >
            </div>
        </div>
    </div>
</template>

<script>
import mapmixin from 'commonjs/mapmixin';
export default {
    name: 'PeopleLocation',
    mixins: [mapmixin],
    data() {
        return {
            center: [105.757223, 29.33282],
            plugin: [
                {
                    pName: 'ToolBar',
                },
                {
                    pName: 'MapType',
                    defaultType: 0,
                },
            ],
            checkList: [],

            ischeckAll: false,
            points: [],
            showPoints: [],
            imgs: {
                offline: require('../assets/img/offline.png'),
                online: require('../assets/img/online.png'),
            },
        };
    },
    computed: {
        selections() {
            return this.$store.state.staffs.map((item) => {
                return { name: item.name };
            });
        },
    },
    methods: {
        //获取所有终端人员 的位置 信息
        getData() {
            this.points = [
                {
                    position: [105.757243, 29.333],
                    name: '吴磊',
                    online: true,
                    updataTime: '2020-03-30 23:07:49',
                },
                {
                    position: [105.757223, 29.334],
                    name: '孔容',
                    online: false,
                    updataTime: '2020-04-08 23:07:49',
                },
                {
                    position: [105.758523, 29.3355],
                    name: '宋飞',
                    online: false,
                    updataTime: '2020-03-27 23:07:49',
                },
                {
                    position: [105.757223, 29.3326],
                    name: '曾温根',
                    online: true,
                    updataTime: '2020-03-30 23:07:49',
                },
                {
                    position: [105.757263, 29.332],
                    name: '李沛儒',
                    online: false,
                    updataTime: '2020-03-30 23:07:49',
                },
            ];
        },
        //返回  选中的 位置信心
        getShowPoints() {
            if (this.checkList.length === 0)
                return this.$message.error('请选中人员');
            this.showPoints = [];
            const checkList = this.checkList;
            const show = [];
            this.points.forEach((val) => {
                if (checkList.find((val2) => val2 === val.name)) {
                    show.push({
                        ...val, // 扩展运算符 ，在val 的基础上 加上 visible 属性 ，解决 未知原因导致 更改 showPoints 的visible 属性会同步到points 上
                        visible: false,
                    });
                }
            });
            this.showPoints = show;
            this.$message.success('定位成功');
        },
        handleCheckAllChange() {
            const now = this.ischeckAll; //点击之后 选中状态为 true
            if (!now) {
                //将要取消 全部选中
                this.checkList = [];
                this.ischeckAll = false;
            } else {
                //将要选中全部
                this.selections.forEach((val) => {
                    this.checkList.push(val.name);
                });
                this.ischeckAll = true;
            }
            console.log(this.ischeckAll);
        },
        handleChange() {
            const val = this.checkList.length === this.selections.length;
            this.ischeckAll = val;
        },
    },
    created() {
        this.getData();
        this.mountEvent('showPoints'); //绑定 window 视窗显示 处理函数
    },
};
</script>

<style scoped lang="less">
.content {
    padding: 10px;
    display: flex;
}
.amap {
    height: calc(100vh - 60px - 30px - 20px);
    width: calc(100% - 240px);
}
.selections {
    width: 200px;
    margin: 20px 10px 0 10px;
    h3 {
        text-align: center;
    }
    .el-checkbox {
        font-size: 16px;
        margin-bottom: 5px;
        width: 180px;
    }
    .el-button {
        margin: 10px 0 0 50px;
    }
    .offline {
        color: #dd6161;
    }
    .online {
        color: #67c23a;
    }
}
/deep/ .amap-icon img {
    height: 30px;
    width: 24px;
}
.window-info {
    font-size: 13px;
}
</style>
