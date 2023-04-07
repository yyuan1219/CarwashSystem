<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 2.为Echarts准备一个Dom -->
      <div id="main1" style="width: 550px; height: 500px "></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      names:[],
      count:[],
    };
  },
  async mounted() {
      await fetch(
        `http://localhost:3000/report/report2`
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(res.data);
            res.data.forEach(item=>{
                this.names.push(item.good_name)
            })
            res.data.forEach(item=>{
                this.count.push(item.count)
            })
        });
    // 3.基于准备好的dom，初始化echarts实例
    var myChart1 = echarts.init(document.getElementById("main1"));
    var option = {
        title: {
            text: '商品销售额'
            
          },
      xAxis: {
        data: this.names,
      },
      yAxis: {
      },
      series: [
        {
        
          data:this.count,
          type: "bar",
          name:'商品名',
        },
      ],
    };
    
    // 5.展示数据
    option && myChart1.setOption(option);
  },
};
</script>

<style>
</style>