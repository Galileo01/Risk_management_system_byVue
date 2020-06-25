<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <slot>对话框没有内容</slot>
        <!--向父组件暴露 footer 插槽-->
        <slot name="footer" v-if="showFooter">
            <!--填充el-dialog 的footer 插槽-->
            <span slot="footer">
                <el-button @click="$emit('dialog-cancel')" size="medium"
                    >取 消</el-button
                >
                <el-button
                    type="primary"
                    @click="$emit('dialog-confirm')"
                    size="medium"
                    >确 定</el-button
                >
            </span>
        </slot>
    </el-dialog>
</template>

<script>
//MK 组件
export default {
    name: 'MKDialog',
    props: {
        showFooter: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {};
    },
    inheritAttrs: false, //默认策略： 把未声明再props 里的属性绑定，转换为html 属性，阻止这个策略
};
</script>

<style></style>
