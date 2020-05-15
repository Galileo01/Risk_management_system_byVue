<template>
    <div class="point_set">
        <BreadNav
            :texts="['基础设置', '设备管理', '设备设置']"
            :navObjs="{ '1': 'point_manage' }"
        />
        <el-card>
            <el-tabs
                v-model="activeName"
                tab-position="left"
                @tab-click="tabClick"
            >
                <el-tab-pane label="基础信息" name="baseInfo" class="baseinfo">
                    <el-form :model="baseInfo" label-width="70px">
                        <el-form-item label="设备编号" prop="name">
                            <!-- <el-input v-model="baseInfo.name"></el-input> -->
                            <span>{{ baseInfo.name }}</span>
                        </el-form-item>

                        <el-form-item label="标记" prop="lable">
                            <el-input v-model="baseInfo.lable"></el-input>
                            <el-tag type="danger">请以逗号分隔标记</el-tag>
                        </el-form-item>
                        <el-form-item label="设备类型" prop="type">
                            <el-input v-model="baseInfo.type"></el-input>
                        </el-form-item>
                        <el-form-item label="设备状态" prop="state">
                            <el-input v-model="baseInfo.state"></el-input>
                        </el-form-item>
                        <el-form-item label="安装地址" prop="address">
                            <el-input v-model="baseInfo.address"></el-input>
                        </el-form-item>
                        <el-form-item label="经度" prop="longitude">
                            <el-input v-model="baseInfo.longitude"></el-input>
                        </el-form-item>
                        <el-form-item label="纬度" prop="latitude">
                            <el-input v-model="baseInfo.latitude"></el-input>
                        </el-form-item>
                        <el-form-item label="安装日期" prop="createTime">
                            <el-input v-model="baseInfo.createTime"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button
                        type="danger"
                        @click="submitBaseInfoEdit"
                        size="medium"
                        >提交更改</el-button
                    >
                </el-tab-pane>
                <el-tab-pane label="图文导航" name="navImgs" class="navimg">
                    <el-button type="primary" @click="showAddDialog"
                        >添加图片</el-button
                    >
                    <el-button type="danger" @click="submitBaseInfoEdit"
                        >提交设置</el-button
                    >
                    <div class="imgs">
                        <div
                            v-for="(img, index) in navImgs"
                            :key="index"
                            class="img-wapper"
                        >
                            第{{ index + 1 }}步
                            <img :src="img" alt="" />
                            <div class="btns">
                                <el-button
                                    size="medium"
                                    @click="showRepDialog(index)"
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
                </el-tab-pane>
                <el-tab-pane label="关联检查项" name="items">
                    <el-row class="ali-c" v-if="itemsTabType === 'show'"
                        ><el-col :span="4"
                            ><el-tag type="info"
                                >关联的检查项如下</el-tag
                            ></el-col
                        >
                        <el-col :span="5" :offset="15"
                            ><el-button
                                size="medium"
                                type="primary"
                                @click="ChangeItemsTabType"
                                >从所有检查项中重新选择</el-button
                            ></el-col
                        >
                    </el-row>
                    <el-row class="ali-c" v-else>
                        <el-col :span="4"
                            ><el-tag type="info">所有检查项如下</el-tag></el-col
                        >
                        <el-col :span="3" :offset="14"
                            ><el-button
                                type="warning"
                                size="medium"
                                @click="ChangeItemsTabType"
                                >取消选择</el-button
                            ></el-col
                        >
                        <el-col :span="5"
                            ><el-button
                                size="medium"
                                type="danger"
                                @click="subSelect"
                                >提交选择</el-button
                            ></el-col
                        >
                    </el-row>
                    <ItemTable
                        size="mini"
                        v-bind="tableProps"
                        :data="showItems"
                        @remove="remove"
                    />
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="query.page"
                        :page-sizes="[5, 10]"
                        :page-size="query.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="query.total"
                    ></el-pagination>
                </el-tab-pane>
            </el-tabs>
            <!--添加图片 对话框-->
            <el-dialog
                :visible.sync="addImgVisible"
                title="添加图片导航"
                class="adddia"
            >
                <el-row class="ali-c"
                    ><el-col :span="6"
                        ><span>此图片作为导航的步数</span></el-col
                    >
                    <el-col :span="5"
                        ><el-input
                            v-model="addImgInfo.step"
                            size="mini"
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
            <!-- 替换 图片 对话框 -->
            <el-dialog
                title="替换图片"
                :visible.sync="replaceVisible"
                class="repdia"
            >
                <el-row>
                    <el-col :span="6">
                        <div class="img-preview">
                            <img
                                v-if="replaceImgInfo.src"
                                :src="replaceImgInfo.src"
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
                    <el-button @click="replaceVisible = false">取消</el-button>
                    <el-button type="primary" @click="subReplace"
                        >确认</el-button
                    >
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import ItemTable from 'components/setting/ItemTable';
import { getDevice, setDevicePatrolItem, updateDevice } from 'network/device';
import { getItems, getItemByDevice } from 'network/patrolitem';
export default {
    name: 'SetPoint',
    props: {
        name: String,
    },
    data() {
        return {
            activeName: 'baseInfo', //baseInfo
            baseInfo: {}, //基础信息
            navImgs: [], //导航图片
            addImgVisible: false,
            addImgInfo: {
                step: 1,
                src: '',
            },
            replaceImgInfo: {
                // 用于 替换的 图片的 信息
                step: 0,
                newRrc: '',
            },
            replaceVisible: false,
            showVisible: false,
            showItem: {},
            query: {
                page: 1,
                size: 10,
                total: 0,
            },
            //巡查项
            items: [],
            showItems: [], //渲染在 表格 里的 巡查项
            itemsTabType: 'show', //标识 items tab 栏 处于哪种模式 展示/选择  show/select
            tableProps: {
                canEdit: false,
                canRemove: true,
                selectional: false,
            },
            allItems: [], //选择 巡查项 时， 数据库所有的 检查项,
        };
    },
    filters: {
        levelText(value) {
            switch (value) {
                case 1:
                    return '等级一';
                case 2:
                    return '等级二';
                case 3:
                    return '等级三';
                case 4:
                    return '等级四';
            }
        },
    },
    methods: {
        getData(cate) {
            if (cate === 'baseInfo') this.getBaeInfo();
            else if (cate === 'navImgs') this.getNavImgs();
            else {
                this.getItems();
            }

            console.log(cate);
        },
        async getBaeInfo() {
            const res = await getDevice({ name: this.name, page: 1, limit: 1 });
            console.log(res);
            if (!res.flag) return this.$message.error('设备信息获取失败');

            this.baseInfo = res.devices[0];
        },
        getNavImgs() {
            const navmgs = [
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/d4fed3a81dd84fa2b689420ca64ed0be_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/75a96784e09e4965b1b372cdbc8407d8_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/5ace41339f184023bd53231faf5821a7_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/4f17ea34abb748ab90bba9ada3f11b6a_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/e60c145bf7c24d02b57ff61899000dbf_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/34ee640cafe441cb878fe8a90b16ac80_1909071031copy.jpg',
                'http://118.190.1.65/NDMMSKQ/image/ndmmsImage/navigation/D001/10a9511bc4b841e3bb8e0071b7050dae_1909071031tuya.jpg',
            ];
            this.navImgs = navmgs;
        },
        async getItems() {
            const res = await getItemByDevice(this.baseInfo.deviceID);
            console.log(res);
            if (!res.flag) return this.$message.error('检查项获取失败');
            this.items = res.checkItems;
            this.query.total = this.items.length;

            this.showItems = this.items.slice(0, 10);
        },
        async removeImg(index) {
            const result = await this.$confirm(
                '此操作将从导航中删除此图片, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((error) => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                this.navImgs.splice(index, 1);
                this.$message.success('删除成功');
            }
        },
        showAddDialog() {
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
            this.navImgs.push(this.addImgInfo.src);
            this.addImgVisible = false;
        },
        showRepDialog(index) {
            this.replaceVisible = true;
            this.replaceImgInfo.step = index;
        },
        subReplace() {
            this.$message.success('图片替换成功');
            this.replaceVisible = false;
        },
        handleSizeChange(size) {
            this.query.size = size;
            this.changeShowData();
        },
        handleCurrentChange(page) {
            this.query.page = page;
            this.changeShowData();
        },

        async removeItem(id) {
            const result = await this.$confirm(
                '此操作将删除此巡查项, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((error) => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                this.$message.success('成功');
            }
        },

        async submitBaseInfoEdit() {
            const res = await updateDevice(this.baseInfo);
            console.log(res);
            if (!res.flag) return this.$message.error('修改失败');
            else {
                this.$message.success('基础信息修改成功');
                this.getBaeInfo();
            }
        },
        tabClick() {
            //只有 第一次切换到 某个 tab 时才 加载对应数据
            const target = this.activeName;
            if (Object.keys(this[target]).length === 0) {
                //如果  对应的 信息没有获取，
                this.getData(target);
            }
        }, //更改 关联检查项 tab 里的 table 显示类型
        async ChangeItemsTabType() {
            const curType = this.itemsTabType;
            if (curType === 'show') {
                //当前  类型是 show
                this.itemsTabType = 'select';
                this.tableProps.canRemove = false;
                this.tableProps.selectional = true;
                await this.getAllItem(); //每次从新获取 所有items
            } else {
                this.itemsTabType = 'show';
                this.tableProps.canRemove = true;
                this.tableProps.selectional = false;
            }
            this.changeShowData();
        },
        //更具当前类型，更改 table 显示 的数据
        changeShowData() {
            this.query.page = 1;
            const curType = this.itemsTabType;
            if (curType === 'show') {
                this.showItems = this.items.slice(0, this.query.size);
            } else {
                this.showItems = this.allItems.slice(0, this.query.size);
                console.log(this.showItems);
            }
        },
        //获取所有 items
        async getAllItem() {
            const res = await getItems();
            console.log(res);
            if (!res.flag) return this.$message.error('获取检查项列表失败');
            const data = res.checkItems;
            //根据 allItems 和 items 计算应该展示的  待选择的 items
            // //讲 所有items 里 当前 设备包含的 检查项 设置checked 属性
            data.forEach((val1, index) => {
                if (
                    this.items.findIndex(
                        (val2) => val2.checkItemID === val1.checkItemID
                    ) !== -1
                ) {
                    //如果 包含
                    data[index].checked = true;
                } else {
                    data[index].checked = false;
                }
            });
            this.query.total = res.checkItems.length;
            this.allItems = data;
        },

        async subSelect() {
            const result = await this.$confirm(
                '此操作将提交检查项的修改, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((error) => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                const checked = this.showItems
                    .filter((val) => val.checked)
                    .map((val) => val.name)
                    .join(',');
                // console.log(checked);

                const res = await setDevicePatrolItem(this.name, checked);
                this.$message.success('修改成功');
                await this.getItems();
                this.ChangeItemsTabType();
            }
        },
        async remove(id) {
            const result = await this.$confirm(
                '此操作将删除此检查项, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((error) => error);
            if (result === 'cancel') {
                this.$message.info('操作取消');
            } else {
                const newItems = this.items
                    .map((val) => {
                        if (val.checkItemID !== id) return val.name;
                    })
                    .join(',');
                console.log(newItems);

                const res = await setDevicePatrolItem(this.name, newItems);
                console.log(res);

                if (res.flag) {
                    this.$message.success('删除成功');
                    this.getItems();
                } else this.$message.error('删除失败');
            }
        },
    },

    created() {
        this.getData('baseInfo');
    },
    components: {
        ItemTable,
    },
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

    .adddia,
    .repdia {
        .el-row {
            margin-bottom: 15px;
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
}
</style>
