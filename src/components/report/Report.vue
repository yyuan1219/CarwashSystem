<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb> 
    <Report1></Report1>

    <Report2></Report2>
    <Report3></Report3>
  </div>
</template>
<script>
  import Report1 from './Report1.vue'
  import Report3 from './Report3.vue'
  import Report2 from './Report2.vue'

export default {
  components:{Report1,Report2,Report3},
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>

</style>
