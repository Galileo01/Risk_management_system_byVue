<template>
    <el-table :data="data" :size="size" stripe border>
        <el-table-column v-if="selectional" width="40px">
            <template v-slot="{ row }">
                <el-checkbox v-model="row.checked"></el-checkbox>
            </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column
            label="检查项名称"
            prop="name"
            width="300px"
        ></el-table-column>
        <el-table-column label="巡查类型" prop="type"></el-table-column>
        <el-table-column label="隐患类型">
            <template v-slot="{ row }">
                {{ getTypeText(row.riskTypeID) }}
            </template>
        </el-table-column>
        <el-table-column label="风险等级" prop="level"></el-table-column>
        <el-table-column
            label="巡查标准"
            prop="standard"
            width="450px"
        ></el-table-column>
        <el-table-column label="操作">
            <template v-slot="{ row }">
                <el-button
                    size="mini"
                    icon="el-icon-edit"
                    v-if="canEdit"
                    @click="
                        $emit('oprate', { id: row.checkItemID, type: 'edit' })
                    "
                ></el-button>
                <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    v-if="canRemove"
                    @click="$emit('remove', row.checkItemID)"
                ></el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { getDangerTypes } from 'network/danger';
export default {
    name: 'ItemTable',
    data() {
        return {
            riskTypes: [],
        };
    },
    props: {
        data: Array,
        size: {
            type: String,
            default: 'medium',
        },
        selectional: {
            //是否有 选择框
            type: Boolean,
            default: false,
        },
        canEdit: {
            // 是否可以进行 编辑操作
            type: Boolean,
            default: true,
        },
        canRemove: {
            //是否可以进行 移除操作
            type: Boolean,
            default: true,
        },
    },
    methods: {
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

            // console.log(riskTypes);
            this.riskTypes = riskTypes;
        },
        getTypeText(id) {
            const type = this.riskTypes.find((val) => val.id === id);
            return type ? type.name : '';
        },
    },
    created() {
        this._getDangerTypes();
    },
};
</script>

<style></style>
