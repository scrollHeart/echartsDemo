<template>
  <div id="app">
      <diagnosis-chart
          :chart-data="crossAnalysisDiagram"
          :min="start_value.split(':')[0] + ':' + start_value.split(':')[1]"
          :max="end_value.split(':')[0] + ':' + end_value.split(':')[1]"
          :value-arr="valueArr"
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
      start_value: '14:00',
      end_value: '14:15',
      valueArr: ['1', '6'],   // '1'-单点自适应 '2'-可变车道 '3'-溢流控制 '4'-截流控制 '5'-无缆协调 '6'-动态绿波 '7'-区域控制
    }
  },
  methods: {
    updateChartOption() { // 更新路口报警诊断图参数
        const option = {
            title: 'test',
        };
        console.log('更新了');
        if (this.value1 === '1') {
            option.name = '单点自适应';
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
                        color: '#492de6', // 100% 处的颜色
                    },
                ],
                global: false, // 缺省为 false
            };
            option.borderColor = '#AE5CE6';
            option.lineColor = '#AE5CE6';
        }
        else if (this.value1 === '2') {
            option.name = '可变车道';
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
        else if (this.value1 === '3') {
            option.name = '溢流控制';
            option.color = {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0,
                        color: '#8cf2ff', // 0% 处的颜色
                    },
                    {
                        offset: 0.92,
                        color: '#21dff7', // 100% 处的颜色
                    },
                ],
                global: false, // 缺省为 false
            };
            option.borderColor = '#FF9449';
            option.lineColor = '#F28C44';
        }
        else if (this.value1 === '4') {
            option.name = '截流控制';
            option.color = {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0,
                        color: '#50f85c', // 0% 处的颜色
                    },
                    {
                        offset: 0.92,
                        color: '#067e0f', // 100% 处的颜色
                    },
                ],
                global: false, // 缺省为 false
            };
            option.borderColor = '#F75956';
            option.lineColor = '#F75956';
        }
        else if (this.value1 === '5') {
            option.name = '无缆协调';
            option.color = {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0,
                        color: '#f7e350', // 0% 处的颜色
                    },
                    {
                        offset: 0.92,
                        color: '#cab205', // 100% 处的颜色
                    },
                ],
                global: false, // 缺省为 false
            };
            option.borderColor = '#F75956';
            option.lineColor = '#F75956';
        }
        else if (this.value1 === '6') {
            option.name = '动态绿波';
            option.color = {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0,
                        color: '#f3a145', // 0% 处的颜色
                    },
                    {
                        offset: 0.92,
                        color: '#eb830f', // 100% 处的颜色
                    },
                ],
                global: false, // 缺省为 false
            };
            option.borderColor = '#F75956';
            option.lineColor = '#F75956';
        }
        else if (this.value1 === '7') {
            option.name = '区域控制';
            option.color = {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0,
                        color: '#ec8f8f', // 0% 处的颜色
                    },
                    {
                        offset: 0.92,
                        color: '#f06161', // 100% 处的颜色
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
    let data = {"data":{"series":[{"name":"2023-07-27","values":[{"key":"14:00:00-14:05:00","value":"0.0"},{"key":"14:05:00-14:10:00","value":"0.0"},{"key":"14:10:00-14:15:00","value":"12.0"}]},{"name":"2023-07-26","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-29","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-28","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-23","values":[{"key":"14:00:00-14:05:00","value":"0.0"},{"key":"14:05:00-14:10:00","value":"0.0"},{"key":"14:10:00-14:15:00","value":"0.0"}]},{"name":"2023-07-25","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-24","values":[{"key":"14:00:00-14:05:00","value":"0.0"},{"key":"14:05:00-14:10:00","value":"0.0"},{"key":"14:10:00-14:15:00","value":"0.0"}]},{"name":"2023-07-30","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]}],"axis":[{"start_time":"14:00:00","end_time":"14:05:00"},{"start_time":"14:05:00","end_time":"14:10:00"},{"start_time":"14:10:00","end_time":"14:15:00"}]},"code":200,"msg":"OK","timestamp":1690703428684}
    let data1 = {"data":{"series":[{"name":"2023-07-27","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-26","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-29","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-28","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-23","values":[{"key":"14:00:00-14:05:00","value":"0.0"},{"key":"14:05:00-14:10:00","value":"0.0"},{"key":"14:10:00-14:15:00","value":"0.0"}]},{"name":"2023-07-25","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-24","values":[{"key":"14:00:00-14:05:00","value":"0.0"},{"key":"14:05:00-14:10:00","value":"0.0"},{"key":"14:10:00-14:15:00","value":"0.0"}]},{"name":"2023-07-30","values":[{"key":"14:00:00-14:05:00","value":"5.0"},{"key":"14:05:00-14:10:00","value":"0.0"},{"key":"14:10:00-14:15:00","value":"1.0"}]}],"axis":[{"start_time":"14:00:00","end_time":"14:05:00"},{"start_time":"14:05:00","end_time":"14:10:00"},{"start_time":"14:10:00","end_time":"14:15:00"}]},"code":200,"msg":"OK","timestamp":1690703428684}
    this.crossAnalysisDiagram = [data.data.series, data1.data.series,];
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
