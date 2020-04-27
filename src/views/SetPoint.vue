<template>
    <div class="point_set">
        <BreadNav
            :texts="['基础设置', '点位管理', '点位设置']"
            :navObjs="{'1':'point_manage'}"
        />
        <el-card>
            <el-tabs v-model="activeName" tab-position="left" >
                <el-tab-pane label="基础信息" name="first" class="baseinfo">
                    <el-form :model="baseInfo" label-width="70px">
                        <el-form-item label="设备编号" prop="num"
                            ><el-input v-model="baseInfo.num"></el-input
                        ></el-form-item>

                        <el-form-item label="标记" prop="mark">
                            <el-input v-model="baseInfo.mark"></el-input>
                            <el-tag type="danger">请以逗号分隔标记</el-tag>
                        </el-form-item>
                        <el-form-item label="设备类型" prop="type">
                            <el-input v-model="baseInfo.type"></el-input>
                        </el-form-item>
                        <el-form-item label="设备状态" prop="status">
                            <el-input v-model="baseInfo.status"></el-input>
                        </el-form-item>
                        <el-form-item label="安装地址" prop="address">
                            <el-input v-model="baseInfo.address"></el-input>
                        </el-form-item>
                        <el-form-item label="经纬度" prop="location">
                            <el-input v-model="baseInfo.location"></el-input>
                            <el-tag type="danger">请以（x,y）的形式填写</el-tag>
                        </el-form-item>
                        <el-form-item label="安装日期" prop="install_date">
                            <el-input
                                v-model="baseInfo.install_date"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="生产商" prop="manu">
                            <el-input v-model="baseInfo.manu"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button type="danger" @click="submitBaseInfoEdit">提交更改</el-button>
                </el-tab-pane>
                <el-tab-pane label="图文导航" name="second" class="navimg">
                     <el-button type="primary" @click="addImg"
                        >添加图片</el-button
                    >
                    <el-button type="danger" @click="submitBaseInfoEdit">提交设置</el-button>
                    <div class="imgs">
                        <div
                            v-for="(img, index) in naviImgs"
                            :key="index"
                            class="img-wapper"
                        >
                            第{{ index + 1 }}步
                            <img :src="img" alt="" />
                            <div class="btns">
                                <el-button size="medium" @click="replace(index)"
                                    >替换</el-button
                                >
                                <el-button
                                    type="danger"
                                    size="medium"
                                    @click="removeImg(index)"
                                    >删除</el-button
                                >
                            </div>
                        </div>
                    </div>
                    
                    </el-tab-pane
                >
                <el-tab-pane label="关联检查项" name="third"
                    ><div class="selections">
                        <el-table
                            :data="selections"
                            stripe
                            border
                            size="small"
                            style="width:800px"
                        >
                            <el-table-column type="index"></el-table-column>
                            <el-table-column
                                label="巡查项名称"
                                prop="title"
                                width="500px"
                            ></el-table-column>
                            <el-table-column label="操作" width="200px">
                                <template v-slot="{ row }">
                                    <el-button
                                        icon="el-icon-edit"
                                        size="mini"
                                        type="primary"
                                        @click="editItem(row.itemID)"
                                    ></el-button>
                                    <el-button
                                        icon="el-icon-delete"
                                        size="mini"
                                        type="danger"
                                        @click="removeItem(row.itemID)"
                                    ></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="query.page"
                            :page-sizes="[5, 10, 15]"
                            :page-size="query.size"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="query.total"
                        >
                        </el-pagination></div
                ></el-tab-pane>
              
            </el-tabs>
            <el-dialog
                :visible.sync="addImgVisible"
                title="添加图片导航"
                class="adddia"
            >
                <el-row type="flex" align="center"
                    ><el-col :span="8" class="align-c"
                        ><span>此图片作为导航的步数</span></el-col
                    >
                    <el-col :span="5"
                        ><el-input
                            v-model="addImgInfo.step"
                        ></el-input> </el-col
                ></el-row>
                <el-row>
                    <el-col :span="6">
                        <div class="img-preview">
                            <img
                                v-if="addImgInfo.src"
                                :src="addImgInfo.src"
                                class="avatar"
                            />
                            <i
                                v-else
                                class="el-icon-plus avatar-uploader-icon"
                            ></i>
                        </div>
                    </el-col>
                    <el-col :span="4" :offset="2">
                        <el-upload
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :on-success="handleSuccess"
                        >
                            <el-button
                                size="medium"
                                type="primary"
                                @click="test"
                                >选择图片</el-button
                            ></el-upload
                        >
                    </el-col>
                </el-row>

                <span slot="footer">
                    <el-button @click="addImgVisible = false">取消</el-button>
                    <el-button type="primary" @click="subAdd">确认</el-button>
                </span>
            </el-dialog>
            <el-dialog :visible.sync="editItemVisible">
                
                    <el-row align="center" type="flex">
                        <el-col :span="4"  class="align-c">巡查项名称</el-col>
                        <el-col :span="20"><el-input  v-model="edttingItem.title"></el-input></el-col>
                    </el-row>
                   
                <span slot="footer">
                    <el-button @click="editItemVisible = false">取消</el-button>
                    <el-button type="primary" @click="subEdit">确认</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'SetPoint',
    props: {
        id: String
    },
    data() {
        return {
            activeName: 'first',
            baseInfo: {},
            naviImgs: [],
            addImgVisible: false,
            addImgInfo: {
                step: 1,
                src: ''
            },
            selections: [],
            editItemVisible: false,
            edttingItem:{},
            query: {
                page: 1,
                size: 5,
                total: 10
            },
            isSubmitBaseinfo:false,  //标识 对应的板块 的更改是否提交
            isSubmitNav:false,
            
        };
    },
    methods: {
        getData() {
            const info = {
                num: this.id,
                mark: '标签正常,正常巡查,巡查合格',
                type: '办公楼督查',
                status: 'good',
                address: '办公楼',
                location: '(105.756894，29.336377)',
                install_date: '2019-09-09 13:24:55',
                manu: '重庆市永川区金银坡斗子丘建材有限公司'
            };
            const naviImgs = [
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/d4fed3a81dd84fa2b689420ca64ed0be_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/75a96784e09e4965b1b372cdbc8407d8_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/5ace41339f184023bd53231faf5821a7_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/4f17ea34abb748ab90bba9ada3f11b6a_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/e60c145bf7c24d02b57ff61899000dbf_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/34ee640cafe441cb878fe8a90b16ac80_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/10a9511bc4b841e3bb8e0071b7050dae_1909071031tuya.jpg'
            ];
            const selections = [
                {
                    title: '操作平台及通道是否规范完整设置护栏',
                    itemID: '01'
                },
                {
                    title:
                        '对生产作业范围及周边的高陡边坡是否采取有效安全防控措施',
                    itemID: '123'
                },
                {
                    title: '防尘装备、设备完好，可正常使用',
                    itemID: '234'
                },
                {
                    title:
                        '分层高度或台阶高度以及留设的安全平台距离是否符合开采设计要求',
                    itemID: '456'
                },
                {
                    title: '高处临边铲装或排危作业是否留足安全间距',
                    itemID: '02'
                },
                {
                    title:
                        '进料口是否规范设置倒车档，料仓口内檐、外檐是否规范设置防护栏',
                    itemID: '12311'
                },
                {
                    title:
                        '开采作业面位置是否与开采设计一致，符合国家法律法规标准要求',
                    itemID: '45q3'
                },
                {
                    title: '开关、插座、电缆线路符合规定，无私搭乱接行为',
                    itemID: '1131'
                },
                {
                    title:
                        '矿山边界、边坡危险地带、变电所、机械电气设备可能被人触及部位、炸药库、运输道路、排土场等设立相应警示标识',
                    itemID: '657678'
                }
            ];
            this.baseInfo = info;
            this.naviImgs = naviImgs;
            this.selections = selections;
        },
       
        async removeImg(index) {
            const result = await this.$confirm(
                '此操作将从导航中删除此图片, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(error => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                this.naviImgs.splice(index, 1);
                this.$message.success('删除成功');
            }
        },
        addImg() {
            this.addImgVisible = true;
        },
        handleSuccess() {},
        //MARK:  测试函数
        test() {
            this.addImgInfo.src =
                'https://note.youdao.com/yws/api/image/normal/1576755416467?userId=1354541676%40qq.com';
        },
        subAdd() {
            this.$message.success('图片上传成功');
            this.naviImgs.push(this.addImgInfo.src);
            this.addImgVisible = false;
        },
        handleSizeChange() {},
        handleCurrentChange() {},
        async removeItem(id) {
            const result = await this.$confirm('此操作将删除此巡查项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(error => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                this.$message.success('成功');
            }
        },
        editItem(id){
            this.editItemVisible=true;
            this.edttingItem=this.selections.find(val=>val.itemID===id);
            console.log(id);
            
        },subEdit(){
             this.$message.success('巡查项修改成功');
            this.editItemVisible = false;
        },
        submitBaseInfoEdit(){
            this.$message.success('基础信息修改成功');
        }
    },
    watch:{
        activeName(val)
        {
            if((val==='third'&&!this.isSubmitBaseinfo)||(val==='third'&&!this.isSubmitNav))
            {
                 this.$message.error('提示:如有更改请提交更改之后在退出本页面');
                
            }
        }
    },
    created() {
        this.getData();
    }
};
</script>

<style scoped lang="less">
.point_set {
    .el-tabs /deep/ .el-tabs__item {
        padding: 0 10px;
    }
    .el-tab-pane {
        margin-left: 20px;
    }
   .baseinfo .el-form .el-input {
        width: 500px;
    }
    .el-form .el-tag {
        margin-left: 10px;
    }
    .imgs {
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;
        text-align: center;
        .img-wapper {
            margin: 0 5px 5px 0;
            display: flex;
            flex-direction: column;
            img {
                width: 200px;
                height: 112px;
            }
            .btns {
                margin-top: 5px;
                display: flex;
                justify-content: space-around;
            }
        }
    }
    /* el-col 中的 span 竖直居中 */

    .adddia {
        .el-row {
            margin-bottom: 10px;
        }
        .img-preview {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                line-height: 178px;
                text-align: center;
            }
            .avatar {
                width: 178px;
                height: 178px;
                display: block;
            }
        }
    }
    .align-c {
            display: flex;
            align-items: center;
        }
}
</style>
