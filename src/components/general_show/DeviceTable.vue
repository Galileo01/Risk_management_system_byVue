<template>
    <el-table :data="tableData" border :cellStyle="{padding:'3px'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="number" label="设备编号">
            <template v-slot="{row}">
                <a class="num" @click="$emit('showdetail',row.number)">{{row.number}}</a>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
            <template v-slot="{row}">
               <el-tag v-if="row.status==='good'" type="success">好</el-tag>
               <el-tag v-else-if="row.status==='bad'" type="danger">差</el-tag>
               <el-tag v-else type="warning">未知</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="address" label="安装地址"></el-table-column>
        <el-table-column prop="date" label="安装日期"></el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'DeviceTable',
    props: {
        tableData: Array
    },
    methods:{
        
    }
};
</script>

<style scoped lang="less">
.el-table{
    .num{
        cursor: pointer;
         color:rgb(64, 158, 255); 
    }
   /deep/ td{
        font-size: 13px;
    }
}
</style>
