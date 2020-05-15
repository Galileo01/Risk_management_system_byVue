<template>
    <div class="set_patrol_item">
        <BreadNav :texts="['基础设置', '检查项管理']" />
        <el-card>
            <el-row
                ><el-col :span="5"
                    ><el-input
                        size="medium"
                        placeholder="请输入搜索词"
                        v-model="query.info"
                        @keyup.enter.native="getData"
                        clearable
                        @clear="getData"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getData"
                        ></el-button></el-input
                ></el-col>
                <el-col :span="5" :offset="1"
                    ><el-button type="primary" size="medium" @click="add"
                        >添加巡查项</el-button
                    ></el-col
                >
            </el-row>
            <ItemTable
                :data="showData"
                @oprate="oprate"
                @remove="remove"
                size="medium"
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
        </el-card>
        <el-dialog
            :visible.sync="dialogVisible"
            :title="typeText + '检查项'"
            @close="reset"
        >
            <el-form
                :model="opreteInfo"
                ref="form"
                label-width="100px"
                :rules="dialogType !== 'show' ? rules : {}"
            >
                <el-form-item label="检查项名称" prop="name">
                    <el-input
                        v-model="opreteInfo.name"
                        clearable
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="巡查类型" prop="type">
                    <el-input
                        v-model="opreteInfo.type"
                        clearable
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="风险类型" prop="riskTypeID">
                    <el-select v-model="opreteInfo.riskTypeID">
                        <el-option
                            v-for="(item, index) in riskTypes"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="风险等级" prop="level">
                    <el-select
                        v-model="opreteInfo.level"
                        clearable
                        size="medium"
                    >
                        <el-option
                            v-for="(item, index) in levels"
                            :key="index"
                            :value="item.value"
                            :label="item.label"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="检查标准" prop="standard">
                    <el-input
                        v-model="opreteInfo.standard"
                        type="textarea"
                        clearable
                        size="medium"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ItemTable from 'components/setting/ItemTable';
import { getItems, addItem, updateItem, removeItem } from 'network/patrolitem';
import { getDangerTypes } from 'network/danger';
export default {
    name: 'SetPatrolItem',
    data() {
        return {
            tableData: [],
            showData: [],
            riskTypes: [],
            query: {
                page: 1,
                size: 10,
                total: 0,
                info: '',
            },
            levels: [
                {
                    label: '等级一',
                    value: '1',
                },
                {
                    label: '等级二',
                    value: '2',
                },
                {
                    label: '等级三',
                    value: '3',
                },
                {
                    label: '等级四',
                    value: '4',
                },
            ],
            dialogVisible: false,
            dialogType: 'show', //对话框 的 显示类型，show/edit/add
            opreteInfo: {
                type: '',
                name: '',
                level: '',
                sandard: '',
                riskTypeID: '',
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请选择巡查类型',
                        trigger: 'focus',
                    },
                ],
                type: [
                    {
                        required: true,
                        message: '请选择巡查类型',
                        trigger: 'focus',
                    },
                ],
                level: [
                    {
                        required: true,
                        message: '请选择风险等级',
                        trigger: 'focus',
                    },
                ],
                riskTypeID: [
                    {
                        required: true,
                        message: '请选择风险等级',
                        trigger: 'focus',
                    },
                ],
                standard: [
                    {
                        required: true,
                        message: '请输入巡查标准',
                        trigger: 'focus',
                    },
                ],
            },
        };
    },
    computed: {
        typeText() {
            switch (this.dialogType) {
                case 'show':
                    return '展示';
                case 'edit':
                    return '编辑';
                case 'add':
                    return '添加';
            }
        },
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
        type(value) {
            switch (value) {
                case '1':
                    return 'danger';
                case '2':
                    return 'warning';
                case '3':
                    return 'primary';
                case '4':
                    return 'info';
            }
        },
    },
    methods: {
        async getData() {
        
            const { size, page } = this.query;
            const offset = (page - 1) * size;
            const res = await getItems(this.query.info);
            console.log(res);
            if (!res.flag) return this.$message.error('获取检查项列表失败');
            const data = res.checkItems;
            this.query.total = res.checkItems.length;
            this.tableData = data;
            this.showData = this.tableData.slice(offset, offset + size);
        },
        async _getDangerTypes() {
            const res = await getDangerTypes({
                page: 1,
                limit: 9999,
            });
            console.log(res);

            if (!res.flag) return this.$message.error('隐患类型获取失败');
            const riskTypes = [];
            for (const val of res.riskTypes) {
                riskTypes.push({
                    name: val.name,
                    id: val.riskTypeID,
                });
            }

            console.log(riskTypes);
            this.riskTypes = riskTypes;
        },
        getTypeText(id) {
            const type = this.riskTypes.find((val) => val.id === id);
            return type ? type.name : '';
        },
        handleSizeChange(size) {
            this.query.size = size;
            this.changeShowData();
        },
        handleCurrentChange(page) {
            this.query.page = page;
            this.changeShowData();
        },
        changeShowData() {
            const { page, size } = this.query;
            const offset = (page - 1) * size;
            this.showData = this.tableData.slice(offset, offset + size);
        },
        oprate({ id, type }) {
            this.dialogType = type;
            const info = this.tableData.find((val) => val.checkItemID === id);
            if (info) this.opreteInfo = { ...info }; //浅拷贝，防止 引用
            this.dialogVisible = true;
        },
        async remove(id) {
            const result = await this.$confirm(
                '此操作将删除这个检查项, 是否继续?',
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
                const item = this.showData.find(
                    (val) => val.checkItemID === id
                );
                const res = await removeItem(item.name);
                console.log(res);
                if (!res.flag) return this.$message.error('删除失败');
                else {
                    this.$message.success('删除成功');
                    this.getData();
                }
            }
            this.dialogVisible = false;
        },
        add() {
            this.dialogType = 'add';
            this.dialogVisible = true;
        },
        reset() {
            this.opreteInfo = {
                patrolType: '',
                title: '',
                level: '',
                danger: '', //可能 引起的危害
                examStandard: '',
                results: '', //项目结果
                showImg: '',
            };
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.dialogType === 'add') {
                        this.submitAdd();
                    } else this.submitEdit();

                    this.dialogVisible = false;
                }
            });
        },
        async submitAdd() {
            const riskTypeName = this.getTypeText(this.opreteInfo.riskTypeID);
            const res = await addItem({ ...this.opreteInfo, riskTypeName });
            console.log(res);
            if (!res.flag) return this.$message.error('添加失败');
            this.$message.success('添加成功');
            this.getData();
        },
        async submitEdit() {
            const riskTypeName = this.getTypeText(this.opreteInfo.riskTypeID);
            const res = await updateItem({
                ...this.opreteInfo,
                riskTypeName,
                afterName: this.opreteInfo.name,
            });
            console.log(res);
            if (!res.flag) return this.$message.error('修改失败');
            this.$message.success('修改成功');

            this.getData();
        },
        resetAll() {
            this.tableData = [];
            this.showData = [];
            this.query = {
                page: 1,
                size: 10,
                total: 0,
                info: '',
            };
            this.riskTypes = [];
        },
    },
    activated() {
        this.resetAll();
        this.getData();
        this._getDangerTypes();
    },
    components: {
        ItemTable,
    },
};
</script>

<style scoped lang="less">
.set_patrol_item {
    .el-table {
        font-size: 13px;
    }
    .el-dialog {
        .el-input {
            width: 500px;
        }
        .el-form-item {
            margin-bottom: 20px;
        }
    }
}
</style>
