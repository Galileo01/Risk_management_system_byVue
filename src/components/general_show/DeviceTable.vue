<template>
    <el-table
        :data="tableData"
        border
        @select="select"
        @select-all="selectAll"
        size="mini"
    >
        <el-table-column type="selection" v-if="sectional"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="设备名称">
            <template v-slot="{ row }">
                <el-tooltip
                    content="点击进一步操作"
                    effect="light"
                    placement="right"
                >
                    <a
                        :class="{ num: numCanClick }"
                        @click="$emit('showdetail', row.name)"
                        >{{ row.name }}</a
                    ></el-tooltip
                >
            </template>
        </el-table-column>
        <el-table-column label="状态">
            <template v-slot="{ row }">
                <el-tag>{{ row.state }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="lable" label="标签"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="address" label="安装地址"></el-table-column>
        <el-table-column
            prop="createTime"
            label="安装日期"
            width="250px"
        ></el-table-column>
        <el-table-column label="操作" v-if="canRemove">
            <template v-slot="{ row }">
                <el-button
                    size="mini"
                    type="danger"
                    @click="$emit('remove', row.name)"
                    icon="el-icon-delete"
                ></el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'DeviceTable',
    props: {
        tableData: Array,
        sectional: {
            type: Boolean,
            default: false,
        },
        numCanClick: {
            type: Boolean,
            default: true,
        },
        canRemove: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isCheckedAll: false,
        };
    },
    methods: {
        select(_, row) {
            if (!this.sectional) return;
            row.checked = !row.checked; //在这里更改 ，会影响到 父组件 通过 props 传递的 tavleData 属性
        },
        selectAll() {
            const value = this.isCheckedAll;
            this.tableData.forEach((val) => (val.checked = !value));
            this.isCheckedAll = !value;
        },
    },
};
</script>

<style scoped lang="less">
.el-table {
    .num {
        cursor: pointer;
        color: rgb(64, 158, 255);
    }
    /deep/ td {
        font-size: 13px;
    }
}
</style>
