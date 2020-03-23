<template>
    <el-dialog
        :visible="dialogVisible"
        @update:visible="$emit('update:dialogVisible', false)"
        width="60%"
        top="50px"
        @open="getData"
        @close="closeHandle"
    >
        <el-tabs v-model="curTab">
            <el-tab-pane label="基础信息" name="base">
                <el-row>
                    <el-col :span="10">设备编号</el-col>
                    <el-col :span="14">{{ info.num }}</el-col>
                </el-row>
                <el-row class="marks">
                    <el-col :span="10">特殊标记</el-col>
                    <el-col :span="14"
                        ><el-tag
                            v-for="(item, index) in info.mark"
                            :key="index"
                            >{{ item }}</el-tag
                        ></el-col
                    >
                </el-row>
                <el-row>
                    <el-col :span="10">设备类型</el-col>
                    <el-col :span="14">{{ info.type }}</el-col>
                </el-row>
                <el-row class="status">
                    <el-col :span="10">设备状态</el-col>
                    <el-col :span="14">
                        <el-tag v-if="info.status === 'good'" type="success"
                            >好</el-tag
                        >
                        <el-tag v-else-if="info.status === 'bad'" type="danger"
                            >差</el-tag
                        >
                        <el-tag v-else type="warning">未知</el-tag></el-col
                    >
                </el-row>
                <el-row>
                    <el-col :span="10">安装地址</el-col>
                    <el-col :span="14">{{ info.address }}</el-col>
                </el-row>

                <el-row>
                    <el-col :span="10">经纬度</el-col>
                    <el-col :span="14">{{ info.location }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">安装日期</el-col>
                    <el-col :span="14">{{ info.install_date }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">生产商</el-col>
                    <el-col :span="14">{{ info.manu }}</el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="导航图文" name="navi" 
                ><el-carousel arrow="always" :autoplay="false"  height="520px" trigger="click" class="steps"> 
                    <el-carousel-item  v-for="(item,index) in naviImgs" :key="index"  :label="index+1">
                      <div>  <h4 class="step_text">第{{index+1}}步</h4>
                      <img :src="item" ></div>
                    </el-carousel-item>
                </el-carousel></el-tab-pane
            >
        </el-tabs>
    </el-dialog>
</template>

<script>
export default {
    name: 'DeviceDetail',
    data() {
        return {
            curTab: 'base',
            info: {},
            naviImgs:[]
        };
    },
    props: {
        dialogVisible: Boolean,
        num: String
    },
    methods: {
        closeHandle() {
            this.$emit('update:vi', false);
        },
        getData() {
            this.info = {
                num: this.num,
                mark: ['标签正常', '正常巡查', '巡查合格'],
                type: '办公楼督查',
                status: 'good',
                address: '办公楼',
                location: '(105.756894，29.336377)',
                install_date: '2019-09-09 13:24:55',
                manu: '重庆市永川区金银坡斗子丘建材有限公司'
            };
            this.naviImgs=[
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/d4fed3a81dd84fa2b689420ca64ed0be_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/75a96784e09e4965b1b372cdbc8407d8_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/5ace41339f184023bd53231faf5821a7_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/4f17ea34abb748ab90bba9ada3f11b6a_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/e60c145bf7c24d02b57ff61899000dbf_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/34ee640cafe441cb878fe8a90b16ac80_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/10a9511bc4b841e3bb8e0071b7050dae_1909071031tuya.jpg'
            ]
        },
        closeHandle(){
            this.info={},
            this.naviImgs=[];
            this.curTab='base';
        }
    }
};
</script>

<style scoped lang="less">
/deep/ .el-dialog__header {
    padding: 0;
}
.el-row {
    margin-bottom: 20px;
}
.status,
.mark {
    height: 30px;
    line-height: 30px;
}
.marks {
    .el-tag {
        margin-right: 5px;
    }
}
.steps{
     img{
         height: 500px;
         width: 100%;
     }
   .step_text{
         margin: 4px auto;
         width: 50px;
     }
}
</style>
