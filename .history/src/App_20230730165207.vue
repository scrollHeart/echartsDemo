<template>
  <div id="app">
      <diagnosis-chart
          :chart-data="crossAnalysisDiagram"
          :name="chartOptions.name"
          :color="chartOptions.color"
          :line-color="chartOptions.lineColor"
          :border-color="chartOptions.borderColor"
          :title="chartOptions.title"
          :min="start_value.split(':')[0] + ':' + start_value.split(':')[1]"
          :max="end_value.split(':')[0] + ':' + end_value.split(':')[1]"
          no-data-text="路口暂无报警"
          style="height: 300px;"
      />
  </div>
</template>
<script>
import diagnosisChart from './components/diagnosisChart.vue'

export default {
  name: 'App',
  components: {
    diagnosisChart
  },
  data() {
    return {
      // 路口报警诊断图
      crossAnalysisDiagram: [],
      // 左侧图表参数
      chartOptions: {},
      start_value: '00:00',
      end_value: '24:00',
      value1: 1034,
    }
  },
  methods: {
    updateChartOption() { // 更新路口报警诊断图参数
        const option = {
            title: 'test',
        };
        console.log('更新了');
        if (this.value1 === 1034) {
            option.name = '过饱和';
            option.color = {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0,
                        color: '#6C55ED', // 0% 处的颜色
                    },
                    {
                        offset: 0.92,
                        color: '#927FF7', // 100% 处的颜色
                    },
                ],
                global: false, // 缺省为 false
            };
            option.borderColor = '#AE5CE6';
            option.lineColor = '#AE5CE6';
        }
        else if (this.value1 === 1036) {
            option.name = '空放';
            option.color = {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0,
                        color: '#43D7F7', // 0% 处的颜色
                    },
                    {
                        offset: 0.92,
                        color: '#15B0DA', // 100% 处的颜色
                    },
                ],
                global: false, // 缺省为 false
            };
            option.borderColor = '#2AC2E7';
            option.lineColor = '#2AC2E7';
        }
        else if (this.value1 === 1037) {
            option.name = '失衡';
            option.color = {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0,
                        color: '#FF8531', // 0% 处的颜色
                    },
                    {
                        offset: 0.92,
                        color: '#FFA05B', // 100% 处的颜色
                    },
                ],
                global: false, // 缺省为 false
            };
            option.borderColor = '#FF9449';
            option.lineColor = '#F28C44';
        }
        else if (this.value1 === 1038) {
            option.name = '溢流';
            option.color = {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0,
                        color: '#FFA98C', // 0% 处的颜色
                    },
                    {
                        offset: 0.92,
                        color: '#FF4D4D', // 100% 处的颜色
                    },
                ],
                global: false, // 缺省为 false
            };
            option.borderColor = '#F75956';
            option.lineColor = '#F75956';
        }
        this.chartOptions = option;
        console.log(this.chartOptions, 'chartOptions');
    },
  },
  created() {
    let data = {"data":{"series":[{"name":"2023-07-27","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-26","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-29","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-28","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-23","values":[{"key":"14:00:00-14:05:00","value":"1.0"},{"key":"14:05:00-14:10:00","value":"0.0"},{"key":"14:10:00-14:15:00","value":"1.0"}]},{"name":"2023-07-25","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-24","values":[{"key":"14:00:00-14:05:00","value":"0.0"},{"key":"14:05:00-14:10:00","value":"0.0"},{"key":"14:10:00-14:15:00","value":"1.0"}]},{"name":"2023-07-30","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]}],"axis":[{"start_time":"14:00:00","end_time":"14:05:00"},{"start_time":"14:05:00","end_time":"14:10:00"},{"start_time":"14:10:00","end_time":"14:15:00"}]},"code":200,"msg":"OK","timestamp":1690703428684}
    this.crossAnalysisDiagram = data.data.series;
    this.updateChartOption();
    console.log(this.crossAnalysisDiagram, 'this.crossAnalysisDiagram')
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
<style lang="less">
  .diagnosis-chart-wrap {
      width: 800px;
      height: 310px;
      transform: translateY(-2px);
  }
</style>
