<template>
  <div class="calendar">
    <div class="calendar__header">
      <div class="calendar__title">
        <div class="block">
            <span class="demonstration">选择年份</span>
            <el-date-picker
            v-model="valueYear"
            type="year"
            :picker-options="forbiddenTime"
            value-format="yyyy"
            @change="changeYear"
            >
            </el-date-picker>
        </div>
      </div>
    </div>
    <div
      class="calendar__button-group"
      v-if="validatedRange.length === 0">
      <el-button-group>
          <el-button
              v-for="(item,index) in validTypes"
              :key="index"
              :disabled="isDisabledMonthBtnArr[index]"
              :class="{'active' : curIndex === index}"
              type="plain"
              size="mini"
              @click="selectDate(item, index)">
              <mark
                  v-if="!isDisabledMonthBtnArr[index]"
                  :class="{'gray' : configMonthData[index] === '0', 'green' : configMonthData[index] === '1'}"
              ></mark>
              {{item}}月
          </el-button>
      </el-button-group>
    </div>
    <div class="main-box">
      <div class="calendar-main-box">
        <div class="btn-box">
          <span v-if="configBtnObj['editShow']" @click="editClickHandle">编辑</span>
          <span v-if="configBtnObj['canceShow']" @click="canceClickHandle">取消</span>
          <span v-if="configBtnObj['saveShow']" @click="saveClickHandle">保存</span>
        </div>
        <div
          class="calendar__body"
          v-if="validatedRange.length === 0"
          key="no-range">
          <date-table
            :date="date"
            :selected-day="realSelectedDay"
            :first-day-of-week="realFirstDayOfWeek"
            @pick="pickDay" />
        </div>
        <div
          v-else
          class="calendar__body"
          key="has-range">
          <date-table
            v-for="(range, index) in validatedRange"
            :key="index"
            :date="range[0]"
            :selected-day="realSelectedDay"
            :range="range"
            :hide-header="index !== 0"
            :first-day-of-week="realFirstDayOfWeek"
            @pick="pickDay" />
        </div>
      </div>
      <div class="slot-flex-box">
        <slot name="default-info"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import DateTable from './dateTable.vue';
import { validateRangeInOneMonth } from '../utils/date-util';
const validTypes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const oneDay = 86400000;

export default {
  name: 'calendarCom',
  props: {
    value: [Date, String, Number],
    range: {
      type: Array,
      validator(range) {
        if (Array.isArray(range)) {
          return range.length === 2 && range.every(
            item => typeof item === 'string' ||
            typeof item === 'number' ||
            item instanceof Date);
        } else {
          return true;
        }
      }
    },
    firstDayOfWeek: {
      type: Number,
      default: 1
    },
  },
  components: {
    DateTable,
  },
  provide() {
    return {
      elCalendar: this
    };
  },

  methods: {
    pickDay(day) {
      debugger
      // 点击编辑按钮后，可操作日历配置
      if (!this.configBtnObj.editClicked) {
        // this.$message({
        //   message: '请先点击编辑按钮',
        //   type: 'warning'
        // });
        console.log('请先点击编辑按钮')
        return;
      }
      this.realSelectedDay = day;
    },
    changeYear(val) {
        console.log(val);
    },
    selectDate(type, index) {
      // 编辑状态，提示保存
      if (this.configBtnObj.editClicked) {
        // this.$message({
        //   message: '请先保存当前配置',
        //   type: 'warning'
        // });
        console.log('请先保存当前配置')
        return;
      }
      this.curIndex = index;
      if (validTypes.indexOf(type) === -1) {
        throw new Error(`invalid type ${type}`);
      }
      let day = `${this[`monthDatePrefix${type}`]}-01`;
      this.pickDay(day);
    },
    editClickHandle() {
      this.configBtnObj.editClicked = true;
      // 编辑按钮点击后，保存按钮显示，取消按钮显示，编辑按钮隐藏
      this.configBtnObj.editShow = false;
      this.configBtnObj.saveShow = true;
      this.configBtnObj.canceShow = true;
      this.$emit('toggle-show', true);
    },
    canceClickHandle() {
      this.configBtnObj.canceClicked = true;
      this.configBtnObj.editClicked = false;
      // 取消按钮点击后，保存按钮隐藏，取消按钮隐藏，编辑按钮显示
      this.configBtnObj.editShow = true;
      this.configBtnObj.saveShow = false;
      this.configBtnObj.canceShow = false;
      this.$emit('toggle-show', false);
    },
    saveClickHandle() {
      this.configBtnObj.saveClicked = true;
      this.configBtnObj.editClicked = false;
      // 保存按钮点击后，保存按钮隐藏，取消按钮隐藏，编辑按钮显示
      this.configBtnObj.editShow = true;
      this.configBtnObj.saveShow = false;
      this.configBtnObj.canceShow = false;
      // 保存按钮点击后，保存当前配置
      this.configMonthData[this.curIndex] = this.realSelectedDay.split('-')[2];
      this.$emit('toggle-show', false);
      // 保存按钮点击后，保存当前配置
      // this.$emit('save', this.configMonthData);
    },
    toDate(val) {
      if (!val) {
        throw new Error('invalid val');
      }
      return val instanceof Date ? val : new Date(val);
    },

    rangeValidator(date, isStart) {
      const firstDayOfWeek = this.realFirstDayOfWeek;
      const expected = isStart ? firstDayOfWeek : (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1);
      const message = `${isStart ? 'start' : 'end'} of range should be ${weekDays[expected]}.`;
      if (date.getDay() !== expected) {
        console.warn('[ElementCalendar]', message, 'Invalid range will be ignored.');
        return false;
      }
      return true;
    }
  },

  computed: {
    monthDatePrefix1() {
      return `${this.valueYear}-01`;
    },
    monthDatePrefix2() {
      return `${this.valueYear}-02`;
    },
    monthDatePrefix3() {
      return `${this.valueYear}-03`;
    },
    monthDatePrefix4() {
      return `${this.valueYear}-04`;
    },
    monthDatePrefix5() {
      return `${this.valueYear}-05`;
    },
    monthDatePrefix6() {
      return `${this.valueYear}-06`;
    },
    monthDatePrefix7() {
      return `${this.valueYear}-07`;
    },
    monthDatePrefix8() {
      return `${this.valueYear}-08`;
    },
    monthDatePrefix9() {
      return `${this.valueYear}-09`;
    },
    monthDatePrefix10() {
      return `${this.valueYear}-10`;
    },
    monthDatePrefix11() {
      return `${this.valueYear}-11`;
    },
    monthDatePrefix12() {
      return `${this.valueYear}-12`;
    },
    isDisabledMonthBtnArr() {
        let arr = validTypes.map((item) => {
            if (this.valueYear === `${(new Date()).getFullYear()}`) {
                if (Number(item) < Number(this.curMonth)) {
                    return true;
                }
                return false;
            } else {
                return false;
            }
        });
        return arr;
    },
    realSelectedDay: {
      get() {
        if (!this.value) return this.selectedDay;
        return this.$moment().format('YYYY-MM-DD');
      },
      set(val) {
        this.selectedDay = val;
        const date = new Date(val);
        this.$emit('input', date);
      }
    },

    date() {
      if (!this.value) {
        if (this.realSelectedDay) {
          const d = this.selectedDay.split('-');
          return new Date(d[0], d[1] - 1, d[2]);
        } else if (this.validatedRange.length) {
          return this.validatedRange[0][0];
        }
        return this.now;
      } else {
        return this.toDate(this.value);
      }
    },

    // if range is valid, we get a two-digit array
    validatedRange() {
      let range = this.range;
      if (!range) return [];
      range = range.reduce((prev, val, index) => {
        const date = this.toDate(val);
        if (this.rangeValidator(date, index === 0)) {
          prev = prev.concat(date);
        }
        return prev;
      }, []);
      if (range.length === 2) {
        const [start, end] = range;
        if (start > end) {
          console.warn('[ElementCalendar]end time should be greater than start time');
          return [];
        }
        // start time and end time in one month
        if (validateRangeInOneMonth(start, end)) {
          return [
            [start, end]
          ];
        }
        const data = [];
        let startDay = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        const lastDay = this.toDate(startDay.getTime() - oneDay);
        if (!validateRangeInOneMonth(startDay, end)) {
          console.warn('[ElementCalendar]start time and end time interval must not exceed two months');
          return [];
        }
        // 第一个月的时间范围
        data.push([
          start,
          lastDay
        ]);
        // 下一月的时间范围，需要计算一下该月的第一个周起始日
        const firstDayOfWeek = this.realFirstDayOfWeek;
        const nextMontFirstDay = startDay.getDay();
        let interval = 0;
        if (nextMontFirstDay !== firstDayOfWeek) {
          if (firstDayOfWeek === 0) {
            interval = 7 - nextMontFirstDay;
          } else {
            interval = firstDayOfWeek - nextMontFirstDay;
            interval = interval > 0 ? interval : 7 + interval;
          }
        }
        startDay = this.toDate(startDay.getTime() + interval * oneDay);
        if (startDay.getDate() < end.getDate()) {
          data.push([
            startDay,
            end
          ]);
        }
        return data;
      }
      return [];
    },

    realFirstDayOfWeek() {
      if (this.firstDayOfWeek < 1 || this.firstDayOfWeek > 6) {
        return 0;
      }
      return Math.floor(this.firstDayOfWeek);
    }
  },
  data() {
    return {
        selectedDay: '',
        now: new Date(),
        valueYear: `${(new Date()).getFullYear()}`,
        forbiddenTime: {
            disabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7;
            },
        },
        curMonth: this.$moment().format('MM'),
        validTypes,
        configMonthData: ['1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '0', '0'], // '0'-未配置，'1'-已配置
        curIndex: Number(this.$moment().format('MM')) - 1,
        configBtnObj: {
          'editShow': true,
          'editClicked': false,
          'saveShow': false,
          'saveClicked': false,
          'cancelShow': false,
          'cancelClicked': false,
        },
    };
  },
};
</script>
<style lang="less">
@import '../styles/calendar.css';
.gray {
    background-color: rgb(163, 180, 204);
}
.green {
    background-color: rgb(30, 204, 153);
}
.calendar__button-group {
    mark {
        width: 8px;
        height: 8px;
        display: inline-block;
        border-radius: 50%;
    }
}
.main-box {
  margin: 16px 24px;
  display: flex;
  height: 368px;
  box-sizing: border-box;
  border: 1px solid rgb(237, 241, 246);
  .calendar-main-box {
    padding: 12px 24px 16px;
    box-sizing: border-box;
    width: 496px;
  }
  .slot-flex-box {
    flex: 1;
  }
}
.btn-box {
  width: 100%;
  justify-content: flex-end;
  display: flex;
  span {
    display: inline-block;
    width: 60px;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid rgb(0, 92, 230);
  }
}
.active {
  color: #409EFF;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
</style>

