<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!--2. 为ECharts准备一个具备大小(宽高)的Dom -->
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1. 导入echarts
// import * as echarts from "echarts"

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts"
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
// import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
// import { CanvasRenderer } from "echarts/renderers"
// import { LineChart } from "echarts/charts"

// 注册必须的组件
// echarts.use([TitleComponent, TooltipComponent, GridComponent, CanvasRenderer, LegendComponent, LineChart])

import _ from "lodash"

export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    }
  },
  // 此时，页面上的元素，已经被渲染完毕了！
  async mounted() {
    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"))

    const { data: res } = await this.$http.get("reports/type/1")
    if (res.meta.status !== 200) {
      return this.$message.error("获取折线图数据失败！")
    }

    // 4. 准备数据和配置项
    const result = _.merge(res.data, this.options)

    // 5. 展示数据
    myChart.setOption(result)
  },
}
</script>

<style lang="less" scoped></style>
