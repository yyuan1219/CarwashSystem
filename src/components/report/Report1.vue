<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 2.为Echarts准备一个Dom -->
      <div id="main2" style="width: 550px; height: 500px"></div>
    </el-card>
  </div>
</template>
  
  <script>
import echarts from "echarts";
export default {
    data() {
        return {
            type:[],
            count:[],
        };
    },
       
  async mounted() {
    await fetch(
        `http://localhost:3000/report/report1`
      )
        .then((res) => res.json())
        .then((res) => {
            res.data.forEach(item=>{
                this.type.push(item.type)
            })
            res.data.forEach(item=>{
                this.count.push(item.count)
            })

        });
    // 3.基于准备好的dom，初始化echarts实例
     // 3.基于准备好的dom，初始化echarts实例
    
    var myChart1 = echarts.init(document.getElementById("main2"));
    var option = {
        title: {
            text: '投诉情况'
            
          },
      xAxis: {
        data: this.type,
      },
      yAxis: {
      },
      series: [
        {
        
          data:this.count,
          type: "bar",
          name:'投诉人数',
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