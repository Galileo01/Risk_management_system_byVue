<template>
    <div class="danger_manage">
        <BreadNav :texts="['基础设置', '隐患类型']" />
        <el-card>
            <el-button type="primary" size="medium" @click="add"
                >添加类型</el-button
            >
            <el-table :data="dangers" border stripe size="small">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="类型" prop="name"></el-table-column>
                <el-table-column label="数据格式" prop="form"></el-table-column>
                <el-table-column
                    label="完成情况"
                    prop="finishState"
                ></el-table-column>
                <el-table-column label="启用状态" prop="state">
                    <template v-slot="{ row }">
                        <el-switch v-model="row.state"></el-switch>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template v-slot="{ row }">
                        <el-button
                            icon="el-icon-view"
                            size="mini"
                            @click="show(row.id)"
                        ></el-button>
                        <el-button
                            icon="el-icon-edit"
                            size="mini"
                            type="primary"
                            @click="edit(row.id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog :visible.sync="dialogVisible" :title="title" @close="clear">
            <el-form :model="opratingType" label-width="70px" ref="form">
                <el-form-item label="类型名称" prop="name">
                    <el-input
                        placeholder="请输入类型名称"
                        v-model="opratingType.name"
                        v-if="dialogType!=='show'"
                    ></el-input>
                    <span v-else>{{opratingType.name}}</span>
                </el-form-item>
                <el-form-item label="数据格式" prop="form"
                    ><el-input v-model="opratingType.form" v-if="dialogType!=='show'"></el-input
                >
                <span v-else>{{opratingType.form||'无'}}</span>
                </el-form-item>
                <el-form-item label="完成情况" prop="finishState"
                    ><el-input v-model="opratingType.finishState" v-if="dialogType!=='show'" ></el-input
                >
                <span v-else>{{opratingType.finishState}}</span></el-form-item>
                <el-form-item label="治理标准" prop="standard"
                    ><el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入治理标准"
                        v-model="opratingType.standard"
                        v-if="dialogType!=='show'" 
                    >
                    </el-input
                >
                <span v-else>{{opratingType.standard||'无'}}</span></el-form-item>
            </el-form>
            <span slot="footer" v-show="dialogType !== 'show'">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'SetDanger',
    data() {
        return {
            dangers: [],
            dialogVisible: false,
            canEdit: true,
            opratingID: 0, //正在操作的 类型
            dialogType: 'add', //当前对话框的 类型,
            opratingType: {
                 name: '',
                    form: '',
                    state: true,
                    id: 0,
                    finishState: '',
                    standard: ''
            }
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
        }
    },
    methods: {
        getDangers() {
            const data = [
                {
                    name: '证照不齐',
                    form: '',
                    state: true,
                    id: 0,
                    finishState: '好？',
                    standard: ''
                },
                {
                    name: '资料不全',
                    form: '',
                    state: true,
                    id: 1,
                    finishState: '好？',
                    standard: ''
                },
                {
                    name: '安全隐患',
                    form: '',
                    state: true,
                    id: 2,
                    finishState: '好？',
                    standard: ''
                },
                {
                    name: '巡查处理',
                    form: '	现场发现问题及时处理',
                    state: true,
                    id: 3,
                    finishState: '好？',
                    standard: ''
                },
                {
                    name: '巡查异常上报',
                    form: '后续发起整改',
                    state: true,
                    id: 4,
                    finishState: '好？',
                    standard: ''
                }
            ];
            this.dangers = data;
        },
        clear() {
            this.opratingType = {
                 name: '',
                    form: '',
                    state: true,
                    id: 0,
                    finishState: '',
                    standard: ''
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
                    standard: ''
            };
        },
        edit(id) {
            this.dialogVisible = true;
            this.dialogType = 'edit';
            this.opratingID = id;
            this.opratingType = this.dangers.find(val => val.id === id);
            console.log(this.opratingType);
        },
        show(id) {
            this.dialogVisible = true;
            this.dialogType = 'show';
            this.opratingID = id;
            this.opratingType = this.dangers.find(val => val.id === id);
        },
        subAdd() {
            //添加新类型 不携带  id
            const newType=this.opratingType;
            if(newType.name===''||newType.standard==='')
            return this.$message.error('请填写必要的信息');
            
            this.$message.success('隐患类型添加成功');
            this.dialogVisible = false;
        },
        subEdit() {
            this.$message.success('隐患类型修改成功');
            this.dialogVisible = false;
        }
    },
    created() {
        this.getDangers();
    }
};
</script>

<style></style>
