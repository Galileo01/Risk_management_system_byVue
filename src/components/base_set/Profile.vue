<template>
  <div class="profile">
        <BreadNav :texts="['个人信息']"/>
        个人信息
        用户id： {{id}}
  </div>
</template>

<script>
export default {
  name:"Profile",
  data(){
      return {
          id:0
      }
  },
  created(){
      this.id=this.$route.params.id;
  }
}
</script>

<style>

</style>