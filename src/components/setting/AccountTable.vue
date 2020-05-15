<template>
    <el-table size="small" :data="tableData" stripe border="">
        <el-table-column label="企业" prop="enterpriseName" width="300px"></el-table-column>
        <el-table-column label="行业" prop="industryName"></el-table-column>
        <el-table-column label="职位" prop="position"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="手机号" prop="tel"  width="200px"></el-table-column>
        <el-table-column label="邮箱" prop="email" width="150px"></el-table-column>
        <el-table-column label="权限等级">
            <template v-slot="{row}">{{row.permission|levelText}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
            <template v-slot="{ row }">
                <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="$emit('edit', row.userID)"
                ></el-button>
                <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="$emit('remove', row.userID)"
                ></el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'AccountTable',
    props: {
        tableData: Array,
    },
    filters:{
        levelText(val){
            switch(val){
                case 0:
                    return '系统管理员';
                case 1:
                    return '行业管理员';
                case 2:
                    return '企业管理员';
                case 3:
                    return  '安检员';
            }
        }
    }
};
</script>

<style></style>
