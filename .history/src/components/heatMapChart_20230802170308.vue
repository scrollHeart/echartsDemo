<template>
    <div ref="chart" class="heat-map-chart-wrap"></div>
</template>
<script>
let echarts = require('echarts');
import moment from 'moment';
export default {
    props: {
        hours: {
            type: Array,
            default: () => ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
            '07:00', '08:00', '09:00', '10:00', '11:00',
            '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
            '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
        },
        chartData: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            days: ['07-01', '07-02', '07-03','07-04', '07-05', '07-06', '07-07', '07-08'],

        }
    }
}
var option;
// prettier-ignore
const chartData = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]]
    .map(function (item) {
    return [item[1], item[0], item[2] || '-'];
});
const getMinutes = (time) => {
  if (time.indexOf(':') > 0) {
    const [h, m] = time.split(':').map((s) => parseInt(s, 10));
    const minutes = h * 60 + m;
    if (!isNaN(minutes)) {
      return minutes - this.startMinute;
    }
  }
  return 0;
};
const min = getMinutes('00:00');
const max = getMinutes('24:00');
option = {
  tooltip: {
    position: 'top'
  },
  grid: {
    show: false,
    right: 20,
    left: 60 + 16,
    top: 40,
    bottom: 60
  },
  xAxis: {
    type: 'category',
    data: this.hours,
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  },
  yAxis: {
    type: 'category',
    data: this.days,
    min: 0,
    max: this.days.length,
    // y轴显示不全，鼠标移上去显示全部，记得加上这个
    triggerEvent: true,
    boundaryGap: true,
    offset: 30,
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  },
  visualMap: {
    type: 'piecewise',
    min: 0,
    max: 10,
    orient: 'horizontal',
    // left: 'center',
    top: '-5%',
    inRange: {
      color: ['#abd9e9', '#74add1', '#4575b4', '#313695']
    }
  },
  dataZoom: [
    {
      start: (min / max) * 100,
      end: max > 60 ? max : 100,
      // labelFormatter: this.getTimeByMinutes,
      height: 16,
      borderColor: '#D3DBEC',
      filterMode: 'none',
      borderRadius: 0,
      handleIcon:
        'path://M120 100L150 100A20 20 0 0 1 170 120L170 180A20 20 0 0 1 150 200' +
        'L120 200A20 20 0 0 1 100 180L100 120A20 20 0 0 1 120 100 Z',
      handleSize: 9,
      fillerColor: 'rgba(233,239,255,.4)',
      handleStyle: {
        borderColor: '#AEB9CF',
        color: '#fff'
      },
      bottom: 16,
      right: 45
    },
    {
      type: 'inside',
      end: 100,
      minValueSpan: 7,
      filterMode: 'none',
      maxValueSpan: 7,
      labelFormatter: () => '',
      yAxisIndex: [0]
    },
    {
      show: this.days.length > 7,
      end: 100,
      minValueSpan: 7,
      maxValueSpan: 7,
      filterMode: 'none',
      width: 8,
      borderColor: '#D3DBEC',
      handleSize: 0,
      borderRadius: 0,
      brushSelect: false,
      zoomLock: true,
      labelFormatter: () => '',
      yAxisIndex: [0],
      right: 16
    }
  ],
  series: [
    {
      name: 'Punch Card',
      type: 'heatmap',
      // coordinateSystem: 'calendar',
      data: data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};

option && myChart.setOption(option);

</script>
<style>
.heat-map-chart-wrap {
      width: 800px;
      height: 310px;
      transform: translateY(-2px);
  }
</style>