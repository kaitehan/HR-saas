<template>
  <div ref="raderRef" class="radar-chart" />
</template>
<script>
// 完整加载
// var echarts = require('echarts')

// 按需导入
var echarts = require('echarts/lib/echarts') // 引入echarts主模块
require('echarts/lib/chart/radar') // 引入雷达图
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')

export default {
  created() {},
  mounted() {
    const myChart = echarts.init(this.$refs.raderRef)
    const option = {
      title: {
        text: '绩效指数'
      },
      tooltip: {
        show: true,
        trigger: 'item'
      },
      legend: {
        data: ['张三', '李四']
      },
      radar: {
        // shape: 'circle',
        // 每个区域的极值
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [20, 60, 90, 40, 100, 10],
              name: '张三'
            },
            {
              value: [100, 50, 100, 100, 80, 90],
              name: '李四'
            }
          ]
        }
      ]
    }
    myChart.setOption(option)
  }
}
</script>
<style lang="scss" scoped>
.radar-chart{
  width: 600px;
  height: 400px;
}

</style>
