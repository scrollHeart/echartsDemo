<template>
  <div id="app">
    <!-- <el-button @click="showClick">调度配置</el-button>
    <el-dialog
      title="调度配置"
      class="dialog-scheduling-config"
      width="768px"
      :visible.sync="schedulingDialogVisible"
      @close="schedulingDialogClose"
    >
      <div class="scheduling-config-wrap">
        <calendar-com
          ref="calendarCom"
          @toggle-show="schedulingToggleShow"
          @change-board="schedulingChangeBoard"
        >
          <template
            slot="dateCell"
            slot-scope="{date, data}"
          >
            <div
                :class="data.isSelected ? 'is-selected' : ''"
                class="scheduling-cell-box"
                @click="schedulingToggleClick(date, data)"
            >
              <div
                class="scheduling-bg-box"
              >
                <div
                  v-if="!data.isSelected"
                  :class="{'scheduling-work-style': schedulingObj[data.day] === '工', 'scheduling-no-work': schedulingObj[data.day] === '非'}"
                >
                {{ Number(data.day.split('-').slice(2).join('-')) }}
                </div>
                <div
                  v-else-if="data.isSelected"
                  :class="{'scheduling-work-style': schedulingCurTxt === '工', 'scheduling-no-work': schedulingCurTxt === '非'}"
                >
                {{ Number(data.day.split('-').slice(2).join('-')) }}
                </div>
              </div>
            </div>
          </template>
          <template
            slot="calendar-default-info"
          >
            <div class="scheduling-default-info-box">
              <div class="scheduling-default-title">默认调度</div>
              <span>工作日：周一至周五</span>
              <span>非工作日：周六至周日</span>
              <div class="scheduling-default-title">默认调度变更</div>
              <span>
                <i class="scheduling-no-work-icon"></i>工作日调度变更为非工作日调度
              </span>
              <span>
                <i class="scheduling-work-icon"></i>非工作日调度变更为工作日调度
              </span>
            </div>
          </template>
        </calendar-com>
        <span class="scheduling-info-box">*说明：该功能为全部路口公共配置，用于调整特殊日期调度，可将【工作日】调度变更为【非工作日】，或将【非工作日】调度变更为【工作日】。</span>
        <span class="scheduling-hlight-btn scheduling-done-btn" @click="schedulingDialogClose">完成</span>
      </div>
    </el-dialog> -->
    <div>
      <diagnosis-chart
          v-loading="chartLoading"
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
      chartLoading: false,
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
            // title: this.valueflag === 1 ? '多日(' + this.start.slice(0, 4) + '/' + this.start.slice(4, 6) + '/'
            //     + this.start.slice(6, 8) + '-' + this.end.slice(0, 4) + '/' + this.end.slice(4, 6) + '/'
            //     + this.end.slice(6, 8) + ')' : '单日(' + this.moment(this.datevalue1, 'YYYYMMDD').format('YYYY/MM/DD')
            //         + ')',
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
        console.log(this.chartOptions);
    },
  },
  created() {
    let data = {"data":{"series":[{"name":"2023-07-27","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-26","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-29","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-28","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-23","values":[{"key":"14:00:00-14:05:00","value":"1.0"},{"key":"14:05:00-14:10:00","value":"0.0"},{"key":"14:10:00-14:15:00","value":"1.0"}]},{"name":"2023-07-25","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]},{"name":"2023-07-24","values":[{"key":"14:00:00-14:05:00","value":"0.0"},{"key":"14:05:00-14:10:00","value":"0.0"},{"key":"14:10:00-14:15:00","value":"1.0"}]},{"name":"2023-07-30","values":[{"key":"14:00:00-14:05:00","value":"-999999.0"},{"key":"14:05:00-14:10:00","value":"-999999.0"},{"key":"14:10:00-14:15:00","value":"-999999.0"}]}],"axis":[{"start_time":"14:00:00","end_time":"14:05:00"},{"start_time":"14:05:00","end_time":"14:10:00"},{"start_time":"14:10:00","end_time":"14:15:00"}]},"code":200,"msg":"OK","timestamp":1690703428684}
    this.crossAnalysisDiagram = data.data.series;
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
<style lang="less" scoped>
.scheduling-config-wrap {
    width: 768px;
    border-radius: 4px;
    margin: 0 auto;
    padding-bottom: 24px;
}
.scheduling-cell-box {
  padding-right: 28px;
  >div {
    width: 40px;
    height: 40px;
  }
}
.scheduling-default-info-box{
  width: 100%;
  height: 100%;
  background: rgb(237, 241, 246);
  padding: 16px 0 0 16px;
  box-sizing: border-box;
  text-align: left;
  .scheduling-default-title {
    color: rgb(52, 65, 86);
    margin-bottom: 12px;
    line-height: 22px;
  }
  .scheduling-default-title:nth-of-type(2){
    padding-top: 16px;
  }
  span {
    margin-bottom: 8px;
    line-height: 20px;
    font-size: 12px;
    display: block;
  }
}
.scheduling-work-style {
    color: rgb(247, 89, 86);
    background: rgba(247, 89, 86, 0.2);
    position: absolute;
    border-radius: 4px;
    width: 100%;
    height: 100%;
    top: 0;
    &::after {
      content: '';
      display: block;
      position: absolute;
      right: -4px;
      top: -4px;
      width: 14px;
      height: 14px;
      background: url('./assets/image/work.png') no-repeat;
      background-size: 100%;
    }
}
.scheduling-no-work {
    color: rgb(0, 92, 230);
    background: rgba(0, 92, 230, 0.2);
    position: absolute;
    border-radius: 4px;
    width: 100%;
    height: 100%;
    top: 0;
    &::after {
      content: '';
      display: block;
      position: absolute;
      right: -4px;
      top: -4px;
      width: 14px;
      height: 14px;
      background: url('./assets/image/no-work.png') no-repeat;
      background-size: 100%;
    }
}
.is-past {
  .scheduling-work-style,
  .scheduling-no-work {
    background: rgba(163, 180, 204, 0.1);
    color: rgb(163, 180, 204);
    &::after {
      content: '';
      display: block;
      position: absolute;
      right: -4px;
      top: -4px;
      width: 14px;
      height: 14px;
    }
  }
  .scheduling-work-style {
    &::after {
      content: '';
      background: url('./assets/image/work-past.png') no-repeat;
      background-size: 100%;
    }
  }
  .scheduling-no-work {
    &::after {
      content: '';
      background: url('./assets/image/no-work-past.png') no-repeat;
      background-size: 100%;
    }
  }
}
.scheduling-info-box {
  font-size: 12px;
  color: rgb(230, 38, 35);
  text-align: left;
  display: block;
  padding: 0 24px;
  line-height: 22px;
}
.scheduling-hlight-btn {
  background: rgb(0, 92, 230);
  border-radius:4px;
  color: #fff;
}
.scheduling-done-btn{
  display: block;
  margin-top: 24px;
  position: relative;
  left: calc(100% - 94px);
  width: 70px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
}
.scheduling-no-work-icon {
  background: url('./assets/image/no-work.png') no-repeat;
  background-size: 100%;
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
  margin-top: -2px;
}
.scheduling-work-icon {
  background: url('./assets/image/work.png') no-repeat;
  background-size: 100%;
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
  margin-top: -2px;
}
.dialog-scheduling-config {
  /deep/ .el-dialog__body {
    padding: 0;
  }
}
</style>
<style lang="less">
.cantclick {
  pointer-events: none;
  visibility: hidden;
}
.default-custom-msg {
  background: rgb(235, 242, 253);
  /* 主题色/默认色 */
  border: 1px solid rgb(0, 92, 230);
  border-radius: 4px;
  color: rgb(52, 65, 86);
  font-family: FZLanTingHeiS-R-GB;
  font-size: 14px;
  padding: 16px;
  height: 54px;
  min-width: 100px;
  .el-message__content {
    color: rgb(52, 65, 86);
    line-height: 22px;
  }
  .el-icon-info:before {
    content: '';
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url('./assets/image/default-msg-icon.png') no-repeat;
    background-size: 100%;
    position: relative;
    top: 1px;
  }
  .el-message__icon {
    margin-right: 8px;
  }
}
</style>
