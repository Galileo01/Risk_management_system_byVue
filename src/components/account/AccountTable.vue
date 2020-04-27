<template>
    <el-table size="small" :data="tableData" stripe border="">
        <el-table-column label="用户编号" prop="accountID" ></el-table-column>
        <el-table-column label="企业" prop="industryID" ></el-table-column>
        <el-table-column label="行业" prop="companyID"></el-table-column>
        <el-table-column label="账号" prop="accountName"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="权限等级" prop="rightLevel"></el-table-column>
        <el-table-column label="操作" width="200px">
            <template v-slot="{ row }">
                <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="$emit('edit',row.accountID)"
                ></el-button>
                <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="$emit('remove',row.accountID)"
                ></el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'AccountTable',
    props: {
        tableData: Array
    }
};
</script>

<style></style>
