<template>
    <div id="app">
        <keep-alive include="Home">
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'app',
    components: {},
    created() {},
};
</script>

<style>
@import url(./assets/css/base.css);
@import url(./assets/fonts/iconfont.css);
#app {
    height: 100%;
}
</style>
