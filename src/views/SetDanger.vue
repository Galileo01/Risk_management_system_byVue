<template>
    <div class="danger_manage">
        <BreadNav :texts="['基础设置', '隐患类型']" />
        <el-card>
            <el-button type="primary" size="medium" @click="add" 
                >添加类型</el-button
            >
            <el-table :data="dangerTypes" border stripe size="mini">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="类型" prop="name"></el-table-column>
                <!-- <el-table-column label="数据格式" prop="form"></el-table-column> -->

                <el-table-column label="备注" prop="note"> </el-table-column>
                <el-table-column label="治理标准" prop="resolveStandard">
                    <template v-slot="{ row }">
                        <p class="note">
                            {{ row.resolveStandard }}
                        </p>
                    </template></el-table-column
                >
                <el-table-column label="操作">
                    <template v-slot="{ row }">
                        <el-button
                            icon="el-icon-view"
                            size="mini"
                            @click="show(row.riskTypeID)"
                        ></el-button>
                        <el-button
                            icon="el-icon-edit"
                            size="mini"
                            type="primary"
                            @click="edit(row.riskTypeID)"
                        ></el-button>
                        <el-button
                            icon="el-icon-delete"
                            size="mini"
                            type="danger"
                            @click="remove(row.riskTypeID)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog :visible.sync="dialogVisible" :title="title" @close="clear">
            <el-form
                :model="opratingType"
                label-width="100px"
                ref="form"
                :rules="rules"
            >
                <el-form-item label="类型名称" prop="name">
                    <el-input
                        placeholder="请输入类型名称"
                        v-model="opratingType.name"
                        v-if="dialogType !== 'show'"
                    ></el-input>
                    <span v-else>{{ opratingType.name }}</span>
                </el-form-item>
                <el-form-item label="备注" prop="note"
                    ><el-input
                        v-model="opratingType.note"
                        v-if="dialogType !== 'show'"
                    ></el-input>
                    <span v-else>{{ opratingType.note || '无' }}</span>
                </el-form-item>
                <el-form-item label="治理标准" prop="resolveStandard"
                    ><el-input
                        type="textarea"
                        :rows="4"
                        placeholder="请输入治理标准"
                        v-model="opratingType.resolveStandard"
                        v-if="dialogType !== 'show'"
                    >
                    </el-input>
                    <span v-else>{{
                        opratingType.standard || '无'
                    }}</span></el-form-item
                >
            </el-form>
            <span slot="footer" v-show="dialogType !== 'show'">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getDangerTypes,
    addDangerType,
    deleteDangerType,
    updateDangerType,
} from 'network/danger';
export default {
    name: 'SetDanger',
    data() {
        return {
            dangerTypes: [],
            dialogVisible: false,
            canEdit: true,
            opratingID: 0, //正在操作的 类型
            dialogType: 'add', //当前对话框的 类型,
            opratingType: {
                name: '',
                iriskTypeID: 0,
                note: '',
                resolveStandard: '',
            },
            oldName: '', //编辑 风险类型 必须提交的 旧名称
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入类型名称',
                        trigger: 'focus',
                    },
                ],

                note: [
                    {
                        required: true,
                        message: '请输入隐患备注',
                        trigger: 'focus',
                    },
                ],
                resolveStandard: [
                    {
                        required: true,
                        message: '请输入治理标准',
                        trigger: 'focus',
                    },
                ],
            },
        };
    },
    computed: {
        title() {
            switch (this.dialogType) {
                case 'add':
                    return '添加隐患类型';
                case 'edit':
                    return '编辑隐患';
                case 'show':
                    return '展示隐患';
            }
        },
    },
    methods: {
        async getDangerTypes() {
            const res = await getDangerTypes({
                page: 1,
                limit: 9999,
            });
            console.log(res);
            if (!res.flag) return this.$message.error('隐患类型获取失败');

            this.dangerTypes = res.riskTypes;
            this.$store.commit('getDangerTypes', res.riskTypes); //更新 vuex
        },
        clear() {
            this.opratingType = {
                name: '',
                iriskTypeID: 0,
                note: '',
                standard: '',
            };
        },
        submit() {
            if (this.dialogType === 'add') this.subAdd();
            else {
                this.subEdit();
            }
        },
        add() {
            this.dialogVisible = true;
            this.dialogType = 'add';
            this.opratingType = {
                name: '',
                form: '',
                state: true,
                id: 0,
                finishState: '',
                standard: '',
            };
        },
        edit(id) {
            this.dialogVisible = true;
            this.dialogType = 'edit';
            this.opratingID = id;
            this.opratingType = {
                ...this.dangerTypes.find((val) => val.riskTypeID === id),
            };
            this.oldName = this.opratingType.name;
            console.log(this.opratingType);
        },
        show(id) {
            this.dialogVisible = true;
            this.dialogType = 'show';
            this.opratingID = id;
            this.opratingType = {
                ...this.dangerTypes.find((val) => val.riskTypeID === id),
            };
        },
        subAdd() {
            this.$refs.form.validate(async (valid) => {
                const res = await addDangerType(this.opratingType);
                console.log(res);
                if (!res.flag) this.$message.error('添加失败');
                else {
                    this.$message.success('隐患类型添加成功');
                    this.getDangerTypes();
                }
            });
            this.dialogVisible = false;
        },
        subEdit() {
            this.$refs.form.validate(async (valid) => {
                //必须提交旧名称用来匹配
                const {
                    name: afterName,
                    riskTypeID,
                    note,
                    resolveStandard,
                } = this.opratingType;
                const res = await updateDangerType({
                    name: this.oldName,
                    afterName,
                    riskTypeID,
                    note,
                    resolveStandard,
                });
                console.log(res);
                if (!res.flag) this.$message.error('修改失败');
                else {
                    this.$message.success('修改成功');
                    this.getDangerTypes();
                }
            });
            this.dialogVisible = false;
        },
        async remove(id) {
            const result = await this.$confirm(
                '此操作将删除此隐患类型, 是否继续?',
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
                const type = this.dangerTypes.find(
                    (val) => val.riskTypeID == id
                );
                const res = await deleteDangerType(type.name);
                console.log(res);
                if (!res.flag) this.$message.error('删除失败');
                else {
                    this.$message.success('删除成功');
                    this.getDangerTypes();
                }
            }
        },
    },
    created() {
        this.getDangerTypes();
    },
};
</script>

<style scoped lang="less">
.danger_manage {
    .note {
        /*设置文本溢出 */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
