<template>
    <div class="alert">
        <span @click="goMessage">有消息未查看,点击确认消息</span>
        <i class="el-icon-close" @click="$emit('alert-close')"></i>
    </div>
</template>

<script>
export default {
    name: 'MessageAlert',
    methods: {
        goMessage() {
            this.$router.push('/message');
        },
    },
};
</script>

<style scoped lang="less">
@keyframes shining {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
.alert {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 300px;
    height: 20px;
    color: #fff;
    line-height: 20px;
    // text-align: center;
    font-size: 14px;
    cursor: pointer;
    background-color: #e6a23c;
    // background-color: rgba(230, 162, 60,1);
    padding: 8px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation: shining 1.5s infinite;
}
.alert:hover {
    animation: none;
}
</style>
