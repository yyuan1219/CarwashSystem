<template>
    <div>
      <!-- 卡片视图 -->
      <el-card>
          <!-- 2.为Echarts准备一个Dom -->
          <div id="main" style="width: 750px;height:400px;"></div>
      </el-card>
    </div>
  </template>
  
  <script>
  // 1.导入echarts
  
  import echarts from 'echarts'
  import _ from 'lodash'
  
  export default {
    data () {
      return {
        // 需要合并的数据
        options: {
          
          title: {
            text: '主题销量'
          },
          
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    
    // 此时,页面上的元素,已经被渲染完毕了
    async mounted () {
      // 3.基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) return this.$message('获取折线图数据失败!')
      
      // 数据合并
      const result = _.merge(res.data, this.options)
      // 5.展示数据
      myChart.setOption(result)
    },
    
  }
  </script>
  
  <style lang="less" scoped>
  
  </style>
  