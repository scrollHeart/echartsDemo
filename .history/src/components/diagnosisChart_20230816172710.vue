<!--
 * @FileDescription: 交通指标分析
 * @Date: 2021-11-28 15:48:08
 * @Author: Wangyanle <wangyanle@baidu.com>
 * @LastEditors: pj
 * @LastEditTime: 2023-04-27 15:31:17
-->

<template>
    <div ref="chart" class="diagnosis-chart-wrap"></div>
</template>

<script>
let echarts = require('echarts');
import moment from 'moment';
export default {
    props: {
        valueArr: {
            type: Array,
            default: () => [],
        },
        // 图表颜色
        color: {
            type: [Object, String],
            default: '',
        },
        // Hover状态的splitline颜色
        lineColor: {
            type: String,
            default: '',
        },
        // 数据项边框颜色
        borderColor: {
            type: String,
            default: '',
        },
        // 数据集合名称
        name: {
            type: String,
            default: '',
        },
        // 图表标题
        title: {
            type: String,
            default: '',
        },
        // 图表数据（仅在图表数据更新时刷新图表）
        chartData: {
            type: Array,
            default: () => [],
        },
        // 最小时间
        min: {
            type: String,
            default: '00:00',
        },
        // 最大时间
        max: {
            type: String,
            default: '24:00',
        },
        // label宽度
        labelWidth: {
            type: Number,
            default: 60,
        },
        // 无数据文本显示
        noDataText: {
            type: String,
            default: '无数据',
        },
    },
    data() {
        return {
            // 图表引用
            chartRef: null,
            // 转换后的数据
            parsedChartData: [],
            // labels
            labels: [],
            // 起始时间对应的分钟值
            startMinute: 0,
            // 上一个X轴坐标
            lastXLabel: '',
            series: [],
            optionColorArr: this.valueArr,
            posiYObj: {},
            dubbleIndexArr: [],
            setIndexArr: [],
            oldPosiYObj: {},
            // 策略映射关系:单点自适应、可变车道、溢流、截流、动态绿波、区域热点
            mapObj: {
                '1': '单点自适应',
                '2': '可变车道',
                '3': '溢流',
                '4': '截流',
                '5': '动态绿波',
                '6': '区域热点',
            },
            valArrs: [],
        };
    },
    methods: {
        // 更新数据
        parseChartData() {
            let chartDataArr = [...JSON.parse(JSON.stringify(this.chartData))];
            const chartData = [];
            chartDataArr.forEach(item => {
                if (Object.prototype.toString.call(item) === '[object Object]') {
                    let key = Object.keys(item)[0];
                    let keyArr = key.split('/');
                    for (let i = 0; i < keyArr.length; i++) {
                        chartData.push(item[key]);
                    }
                }else {
                    chartData.push(item);
                }
            })
            for (let j = 0; j < chartData.length; j++) {
                let data = [];
                // 多日时需要排序多个日期的顺序，单日时展示的是路口不需要排序
                if (this.labelWidth === 60) {
                    chartData[j].sort((a, b) => (a.name < b.name ? -1 : 1));
                }
                chartData[j].forEach((s, i) => {
                    let lastTo = -1;
                    (s.values || []).forEach(d => {
                        const {key, value} = d;
                        if (value > 0 && key.indexOf('-') > 0) {
                            const [from, to] = key.split('-').map(this.getMinutes);
                            if (from === lastTo) {
                                data[data.length - 1][2] = to;
                            }
                            else {
                                data.push([from, i, to]);
                            }
                            lastTo = to;
                        }
                    });
                });
                this.parsedChartData.push(data);
            }
            chartData[0].forEach(item => {
                this.labels.push(item.name);
            })
            console.log(this.labels, 'this.labels');
        },
        // 获取时间的数字表示（0-1440）
        getMinutes(time) {
            if (time.indexOf(':') > 0) {
                const [h, m] = time.split(':').map(s => parseInt(s, 10));
                const minutes = h * 60 + m;
                if (!isNaN(minutes)) {
                    return minutes - this.startMinute;
                }
            }
            return 0;
        },
        // 获取日期标签（带工作日非工作日标志）
        getDateLabel(date) {
            const m = date.getMonth() + 1;
            const d = date.getDate();
            const w = date.getDay();
            return `{type|${w % 6 === 0 ? '休 ' : '工 '}}{date|${m < 10 ? '0' : ''}${m}.${
                d < 10 ? '0' : ''
            }${d}}`;
        },
        // 判断是否是合法的日期格式，如果是，生成日期标签
        parseLabel(label) {
            const m = moment(label);
            if (m.isValid()) {
                return this.getDateLabel(m.toDate());
            }
            return label;
        },
        // 根据分钟数获取时间节点
        getTimeByMinutes(d, s) {
            d = Math.round(d); // 四舍五入到整数分钟，避免显示『59』
            let realD = d + this.startMinute;
            const h = Math.floor(realD / 60);
            const m = Math.floor(realD % 60);
            return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
        },
        // 根据分钟数获取时间节点(x轴专用-去掉了重复坐标)
        getTimeByMinutesX(d, s, r) {
            if (s === 0) {
                this.lastXLabel = undefined;
            }
            let realD = d + this.startMinute;
            const h = Math.floor(realD / 60);
            const m = Math.floor(realD % 60);
            let str = `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
            if (this.lastXLabel === str) {
                return '';
            }
            this.lastXLabel = str;
            return str;
        },
        // 获取时间
        updateChart() {
            if (!this.labels || !this.labels.length) {
                return;
            }
            if (!this.chartRef) {
                this.chartRef = echarts.init(this.$refs.chart);
            }
            const min = this.getMinutes(this.min);
            const max = this.getMinutes(this.max);
            const labels = this.labels;
            const labelWidth = this.labelWidth;
            let that = this;
            let series = [];
            let optionNameArr = this.chartOptions.map(item => item.name);
            let setArr = [];
            let dubbleIndexArr = [];
            let setIndexArr = [];
            let height = 10;
            let posiYObj = {};
            series = this.parsedChartData.map((item, index) => {
                let optionName = optionNameArr[index];
                if (setArr.indexOf(optionName) < 0) {
                    setArr.push(optionNameArr[index]);
                    setIndexArr.push(index);
                    posiYObj[index] = - height / 2;
                }
                else {
                    dubbleIndexArr.push(index);
                }

                for (let i = 0; i < dubbleIndexArr.length; i++) {
                    if (dubbleIndexArr[i] % 2 === 0) {
                        posiYObj[index] = 0;
                    }
                    else {
                        posiYObj[index] = - height;
                    }
                }
                this.dubbleIndexArr = dubbleIndexArr;
                this.posiYObj = posiYObj;
                this.oldPosiYObj = JSON.parse(JSON.stringify(posiYObj));
                return {
                    name: this.chartOptions[index] && this.chartOptions[index].name || '',
                    type: 'custom',
                    selectedMode: 'single',
                    zlevel: 10,
                    animationThreshold: 200,
                    renderItem: (params, api) => {
                        let categoryIndex = api.value(1);
                        let start = api.coord([api.value(0), categoryIndex]);
                        let end = api.coord([api.value(2), categoryIndex]);
                        let rectShape = echarts.graphic.clipRectByRect(
                            {
                                x: start[0],
                                y: start[1] + this.posiYObj[index],
                                width: end[0] - start[0],
                                height: height,
                            },
                            {
                                x: params.coordSys.x,
                                y: params.coordSys.y - height,
                                width: params.coordSys.width,
                                height: params.coordSys.height + height * 2,
                            }
                        );
                        if (rectShape) {
                            rectShape.r = 1;
                            return {
                                type: 'group',
                                children: [
                                    {
                                        type: 'rect',
                                        shape: {
                                            x: rectShape.x - 1.5,
                                            y: rectShape.y - 1.5,
                                            width: rectShape.width + 3,
                                            height: rectShape.height + 3,
                                            r: rectShape.r,
                                        },
                                        style: {
                                            fill: 'white',
                                            stroke: this.chartOptions[index] && this.chartOptions[index].borderColor || '',
                                            lineWidth: 1,
                                            opacity: 0.3,
                                        },
                                    },
                                    {
                                        type: 'rect',
                                        shape: rectShape,
                                        style: {
                                            fill: this.chartOptions[index] && this.chartOptions[index].color || '',
                                            opacity: 0.5,
                                        },
                                        emphasis: {
                                            style: {
                                                opacity: 1,
                                            },
                                        },
                                    },
                                ],
                            };
                        }
                    },
                    data: item,
                }
            })
            this.series = series;
            this.setIndexArr = setIndexArr;

            const option = {
                legend: {
                    right: 16,
                    top: -2,
                    icon: 'path://M 120 100 L 160 100 A 20 20 0 0 1 180 120 L 180 160 A 20 20 0 0 1 160 180 L 120 180 A 20 20 0 0 1 100 160 L 100 120 A 20 20 0 0 1 120 100 Z',
                    itemWidth: 8,
                    itemHeight: 8,
                    itemStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        shadowBlur: 1,
                        // shadowColor: this.borderColor,
                    },
                    textStyle: {
                        fontSize: 12,
                        color: '#344156',
                    },
                    // selected: {
                    //     '单点自适应': true,
                    //     '动态绿波': true
                    // },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: params => {
                        if (!params.length) {
                            const val = params.value;
                            return `开始时间：${val ? this.getTimeByMinutes(
                                val[0]
                            ) : '-'}<br/>结束时间：${val ? this.getTimeByMinutes(val[2]) : '-'}`;
                        }
                    },
                    axisPointer: {
                        type: 'cross',
                        snap: true,
                        axis: 'y',
                        label: {
                            show: false,
                        },
                        crossStyle: {
                            color: this.lineColor,
                            type: 'dashed',
                        },
                        z: 2,
                    },
                    backgroundColor: 'rgb(4,8,13)',
                    appendToBody: true,
                    position: 'top',
                    borderWidth: 0,
                    padding: [10, 16],
                    textStyle: {
                        color: 'white',
                        fontSize: 14,
                    },
                    extraCssText: 'opacity:0.8;',
                },
                title: {
                    left: 0,
                    top: -2,
                    text: this.title,
                    textStyle: {
                        fontSize: 14,
                        color: '#344156',
                        fontWeight: 400,
                    },
                },
                color: this.chartOptions.map(item => item.color),
                xAxis: {
                    type: 'value',
                    min,
                    max,
                    offset: 4,
                    axisLabel: {
                        formatter: this.getTimeByMinutesX,
                        color: '#A3B4CC',
                        fontSize: 12,
                    },
                    axisPointer: {
                        show: false,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#F8FAFC',
                        },
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                },
                grid: {
                    show: false,
                    right: 20,
                    left: labelWidth + 16,
                    top: 40,
                    bottom: 60,
                },
                yAxis: {
                    type: 'value',
                    data: this.labels,
                    // y轴显示不全，鼠标移上去显示全部，记得加上这个
                    triggerEvent: true,
                    minInterval: 1,
                    axisLine: {
                        show: false,
                    },
                    min: 0,
                    boundaryGap: true,
                    offset: labelWidth + 5,
                    max: labels.length,
                    axisLabel: {
                        show: true,
                        formatter(val, s) {
                            if (val < labels.length) {
                                if (s === 0) {
                                    that.lastXLabel = undefined;
                                }
                                let str = labels[Math.floor(val)] || '';
                                if (that.lastXLabel === str) {
                                    return '';
                                }
                                that.lastXLabel = str;
                                return str.slice(5);
                            }
                        },
                        width: labelWidth,
                        overflow: 'truncate',
                        color: '#A3B4CC',
                        fontSize: 12,
                        align: 'left',
                        rich: {
                            type: {
                                color: '#344156',
                            },
                            date: {
                                width: 38,
                            },
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#EDF1F6',
                            type: 'dashed',
                        },
                    },
                },
                dataZoom: [
                    {
                        start: min / max * 100,
                        end: max > 60 ? max : 100,
                        labelFormatter: this.getTimeByMinutes,
                        height: 16,
                        borderColor: '#D3DBEC',
                        filterMode: 'none',
                        borderRadius: 0,
                        handleIcon: 'path://M120 100L150 100A20 20 0 0 1 170 120L170 180A20 20 0 0 1 150 200'
                            + 'L120 200A20 20 0 0 1 100 180L100 120A20 20 0 0 1 120 100 Z',
                        handleSize: 9,
                        fillerColor: 'rgba(233,239,255,.4)',
                        handleStyle: {
                            borderColor: '#AEB9CF',
                            color: '#fff',
                        },
                        bottom: 16,
                        right: 45,
                    },
                    {
                        type: 'inside',
                        end: 100,
                        minValueSpan: 7,
                        filterMode: 'none',
                        maxValueSpan: 7,
                        labelFormatter: () => '',
                        yAxisIndex: [0],
                    },
                    {
                        show: this.labels.length > 7,
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
                        right: 16,
                    },
                ],
                series: this.series,
                // graphic: [
                //     {
                //         type: 'rect',
                //         left: 'center',
                //         top: 'middle',
                //         shape: {
                //             width: 0,
                //             height: 0,
                //         },
                        // textContent: {
                        //     type: 'text',
                        //     style: {
                        //         text: this.noDataText,
                        //         font: 'normal 12px FZLTHJW--GB1-0',
                        //         fill: '#a3b4cc',
                        //     },
                        //     silent: true,
                        //     zlevel: 11,
                        //     invisible: this.parsedChartData.length > 0,
                        // },
                        // textConfig: {
                        //     inside: true,
                        //     position: 'inside',
                        //     offset: [(labelWidth - 15) / 2, -10],
                        // },
                //     },
                // ],
            };
            this.chartRef.clear();
            this.chartRef.setOption(option);
            if (this.title.includes('单日')) {
                this.extension(this.chartRef);
            }
            // 注册legendselectchanged事件
            this.chartRef.on('legendselectchanged', (e) => {
                // 点击的策略中，不重复部分数据的索引
                let setIndex = 0;
                // 点击的策略中，重复部分数据的索引(1个或多个，取决于重复的策略有几个)
                let curdubbleIndexArr = [];
                // 关联的其他策略，重复部分数据的map值(1个或多个，取决于重复的策略有几个)
                let aboutMapArr = [];
                let aboutIndexArr = [];
                let eKey = '';
                this.dubbleIndexArr.forEach(i => {
                    if (this.chartOptions[i].name === e.name) {
                        curdubbleIndexArr.push(i);
                    }
                })
                this.setIndexArr.forEach(i => {
                    if (this.chartOptions[i].name === e.name) {
                        setIndex = i;
                    }
                })
                // 不管是取消选中，还是选中，我们都要考虑到n种情况，比如
                // 1.当前策略和其他策略组合时，当前策略组合部分更新渲染
                // 2.受当前策略影响的，其他组合策略部分更新渲染
                for(let key in this.mapObj) {
                    if (this.mapObj[key] === e.name) {
                        eKey = key;
                        this.optionColorArr.forEach(item => {
                            if (item.includes('/') && item.split('/').includes(key)) {
                                item.split('/').forEach(i => {
                                    if (i !== key) {
                                        aboutMapArr.push(i);
                                    }
                                })
                            }
                        })
                    }
                }

                this.optionColorArr.forEach(item => {

                    if (item.includes('/') && item.split('/').includes(e.name)) {
                        item.split('/').forEach(i => {
                            if (i !== e.name) {
                                aboutMapArr.push(i);
                            }
                        })
                    }
                })
                let ttIndexArr = [];
                for (let j = 0; j < aboutMapArr.length; j++) {
                    let ind = (this.optionColorArr).indexOf(`${aboutMapArr[j]}/${eKey}`);
                    let ind2 = (this.optionColorArr).indexOf(`${eKey}/${aboutMapArr[j]}`);
                    if (ind > -1) {
                        ttIndexArr.push(ind);
                    }
                    else if (ind2 > -1) {
                        ttIndexArr.push(ind2);
                    }
                }

                for (let j = 0; j < ttIndexArr.length; j++) {
                    let num = ttIndexArr[j];
                    let ind = 0;
                    for (let k = 0; k < num; k++) {
                        if (this.optionColorArr[k].includes('/')) {
                            ind = ind + 2;
                        }
                        else {
                            ind++;
                        }
                    }
                    this.optionColorArr[num].split('/').forEach((i,index) => {
                        if (i !== eKey) {
                            ind = ind + index;
                        }
                    })
                    aboutIndexArr.push(ind);
                }

                // 点击项是取消选中状态
                if (!e.selected[e.name]) {
                    for (let k = 0; k < aboutIndexArr.length; k++) {
                        let aboutInd = aboutIndexArr[k];
                        this.posiYObj[aboutInd] = - height/2;
                    }

                    // 先判断下，当前策略是否是重复策略，
                    // 如果是重复策略，那么就要把重复策略的所有数据都置为0
                    if (curdubbleIndexArr.length > 0) {
                        curdubbleIndexArr.forEach(i => {
                            this.series[i].data = [];
                        })
                    }
                    // 如果不是重复策略，那么就只把当前策略的数据置为0
                    this.series[setIndex].data = [];
                    option.legend.selected[e.name] = e.selected[e.name];
                }
                else {
                    // 点击项是选中状态
                    for (let k = 0; k < aboutIndexArr.length; k++) {
                        let aboutInd = aboutIndexArr[k];
                        this.posiYObj[aboutInd] = this.oldPosiYObj[aboutInd];
                    }
                    this.series[setIndex].data = this.parsedChartData[setIndex];
                    for (let i = 0; i < curdubbleIndexArr.length; i++) {
                        let dubbleIndex = curdubbleIndexArr[i];
                        this.series[dubbleIndex].data = this.parsedChartData[dubbleIndex];
                        this.posiYObj[dubbleIndex] = this.oldPosiYObj[dubbleIndex];
                    }
                    option.legend.selected[e.name] = e.selected[e.name];

                }
                this.chartRef.clear();
                this.chartRef.setOption(option);
            });
        },
        // 就是这个方法，解决y轴鼠标放上提示全部内容
        extension(myChart) {
            // 注意这里，是以X轴显示内容过长为例，如果是y轴的话，需要把params.componentType == 'xAxis'改为yAxis
            // 判断是否创建过div框,如果创建过就不再创建了
            // 该div用来盛放文本显示内容的，方便对其悬浮位置进行处理
            let labels = this.labels;
            let that = this;
            let elementDiv = document.getElementById('extension');
            if (!elementDiv) {
                let div = document.createElement('div');
                div.setAttribute('id', 'extension');
                div.style.display = 'block';
                document.querySelector('html').appendChild(div);
            }
            myChart.on('mouseover', function (params) {
                if (that.title.includes('多日')) {
                    return;
                }
                /* bca-disable */
                if (params.componentType === 'yAxis') {
                    let elementDiv = document.querySelector('#extension');
                    // 设置悬浮文本的位置以及样式
                    let elementStyle
                        // eslint-disable-next-line max-len
                        = 'position: absolute;z-index: 99999;color: #fff;font-size: 12px;padding: 5px;display: inline;border-radius: 4px;background-color: #303133;box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 8px';
                    elementDiv.style.cssText = elementStyle;
                    let str = labels[params.value * 1];
                    elementDiv.innerHTML = str;
                    document.querySelector('html').onmousemove = function (event) {
                        let elementDiv = document.querySelector('#extension');
                        let xx = event.pageX - 20;
                        let yy = event.pageY + 20;
                        elementDiv.style.top = yy + 'px';
                        elementDiv.style.left = xx + 'px';
                    };
                }
            });
            myChart.on('mouseout', function (params) {
                // 注意这里，我是以X轴显示内容过长为例，如果是y轴的话，需要改为yAxis
                if (params.componentType === 'yAxis') {
                    let elementDiv = document.querySelector('#extension');
                    elementDiv.style.cssText = 'display:none';
                }
            });
        },
        updateChartOption() { // 更新路口报警诊断图参数
        const option = [];
        this.optionColorArr.forEach((item) => {
            let optionFn = (item) => {
                if (!item.includes('/')) {
                    let optionObj = {};
                    switch (item) {
                        case '1':
                            optionObj.name = '单点自适应';
                            optionObj.color = {
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
                            optionObj.borderColor = '#AE5CE6';
                            optionObj.lineColor = '#AE5CE6';
                            break;
                        case '2':
                            optionObj.name = '可变车道';
                            optionObj.color = {
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
                            optionObj.borderColor = '#2AC2E7';
                            optionObj.lineColor = '#2AC2E7';
                            break;
                        case '3':
                            optionObj.name = '溢流控制';
                            optionObj.color = {
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
                            optionObj.borderColor = '#FF9449';
                            optionObj.lineColor = '#F28C44';
                            break;
                        case '4':
                            optionObj.name = '截流控制';
                            optionObj.color = {
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
                            optionObj.borderColor = '#F75956';
                            optionObj.lineColor = '#F75956';
                            break;
                        case '5':
                            optionObj.name = '动态绿波';
                            optionObj.color = {
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
                            optionObj.borderColor = '#F75956';
                            optionObj.lineColor = '#F75956';
                            break;
                        case '6':
                            optionObj.name = '区域热点';
                            optionObj.color = {
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
                            optionObj.borderColor = '#F75956';
                            optionObj.lineColor = '#F75956';
                            break;
                        default:
                            break;
                    }
                    option.push(optionObj);
                    this.valArrs.push(item);
                }
                else {
                    let keyArr = item.split('/');
                    for (let i = 0; i < keyArr.length; i++) {
                        optionFn(keyArr[i]);
                    }
                }
            };
            optionFn(item);
        });
        this.chartOptions = option;
    },
    },
    mounted() {
        this.startMinute = 0;
        this.startMinute = this.getMinutes(this.min);
        this.parseChartData();
        this.updateChart();
    },
    created() {
        this.updateChartOption();
    },
};
</script>
<style lang='less'>
.content {
    width: 100%;
    background: #fff;
    height: 250px;
    position: absolute;
    bottom: 0;
}
.diagnosis-chart-wrap {
      width: 800px;
      height: 310px;
      transform: translateY(-2px);
  }
</style>