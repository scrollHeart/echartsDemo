<template>
  <div class="calendar-wrap">
    <div class="calendar-header">
      <div class="calendar-title">
        <div class="calendar-title-block">
            <span class="calendar-picker-label">选择年份</span>
            <el-date-picker
              ref="test"
              v-model="valueYear"
              type="year"
              :picker-options="forbiddenTime"
              :disabled="disabledYear"
              popper-class="calendar-date-picker-panel"
              value-format="yyyy"
              @change="changeYear"
              @focus="focusYear"
              @blur="blurYear"
            >
            </el-date-picker>
            <span :class="{'suffix-arrow-down': arrowDown, 'suffix-arrow-up': !arrowDown}" @click="test"></span>
        </div>
      </div>
    </div>
    <div
      class="calendar__button-group"
      v-if="validatedRange.length === 0">
      <!-- :disabled="isDisabledMonthBtnArr[index]" -->
      <el-button-group>
          <el-button
              v-for="(item,index) in validTypes"
              :key="index"
              :class="{'active' : curIndex === index, 'gray-font': curIndex > index && valueYear === `${(new Date()).getFullYear()}`}"
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
          <span
            v-if="configBtnObj['editShow']" @click="editClickHandle"
            class="default-btn"
            :class="{'cantEvent': isAbledClick}"
          >编辑</span>
          <span
            v-if="configBtnObj['canceShow']" @click="canceClickHandle"
            class="default-btn"
          >取消</span>
          <span
            v-if="configBtnObj['saveShow']" @click="saveClickHandle"
            class="height-light-btn"
          >保存</span>
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
    test() {
      if (!document.querySelector('.calendar-date-picker-panel') || document.querySelector('.calendar-date-picker-panel').style.display === 'none') {
        this.$refs.test.focus();
      }
      else {
        this.$refs.test.blur();
      }
    },
    pickDay(day, isCurMonth) {
      // 点击编辑按钮后，可操作日历配置, 未切换到其他月份
        if (!this.configBtnObj.editClicked && isCurMonth == undefined) {
          this.$message({message: '请先点击编辑按钮！', customClass: 'default-custom-msg'});
          return;
        }
      this.realSelectedDay = day;
    },
    changeYear(val) {
      if (val !== `${(new Date()).getFullYear()}`) {
        this.$emit('change-board', `${val}-01`);
        this.selectDate('1', 0);
      }
      else {
        this.curMonth = this.$moment().format('MM');
        this.$emit('change-board', `${this.curMonth}-01`);
        this.selectDate(`${Number(this.curMonth)}`, Number(this.curMonth) - 1);
      }
      this.changeYearBool = true;
        console.log(val);
    },
    focusYear() {
      this.arrowDown = false;
      // 编辑状态，提示保存
      if (this.configBtnObj.editClicked) {
        this.disabledYear = true;
        this.$message({message: '请先保存当前配置内容！', customClass: 'default-custom-msg'});
        return;
      }
    },
    blurYear() {
      this.arrowDown = true;
    },
    selectDate(type, index) {
      // 编辑状态，提示保存
      if (this.configBtnObj.editClicked) {
        this.$message({message: '请先保存当前配置内容！', customClass: 'default-custom-msg'});
        return;
      }

      if (validTypes.indexOf(type) === -1) {
        throw new Error(`invalid type ${type}`);
      }
      let day = `${this[`monthDatePrefix${type}`]}-01`;
      this.pickDay(day, this.curIndex === index);
      if (this.curIndex !== index) {
        // 切换到其他月份
        this.$emit('change-board', day.slice(0, day.lastIndexOf('-')));
      }
      this.curIndex = index;
      this.curMonth = type;
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
      this.disabledYear = false;
      this.configBtnObj.canceClicked = true;
      this.configBtnObj.editClicked = false;
      // 取消按钮点击后，保存按钮隐藏，取消按钮隐藏，编辑按钮显示
      this.configBtnObj.editShow = true;
      this.configBtnObj.saveShow = false;
      this.configBtnObj.canceShow = false;
      this.$emit('toggle-show', false);
    },
    saveClickHandle() {
      this.disabledYear = false;
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
    },
    isAbledClick() {
      return (this.valueYear === `${(new Date()).getFullYear()}` && Number(this.$moment().format('MM')) > Number(this.curMonth))
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
        lastSelectedIndex: null,
        changeYearBool: false,
        disabledYear: false,
        arrowDown: true,
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
  margin-top: 10px;
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
  box-sizing: border-box;
  border: 1px solid rgb(237, 241, 246);
  .calendar-main-box {
    padding: 12px 24px 16px;
    box-sizing: border-box;
    width: 496px;
  }
  .slot-flex-box {
    width: 100%;
  }
}
.btn-box {
  width: 100%;
  justify-content: flex-end;
  display: flex;
  margin-bottom: 8px;
  span {
    display: inline-block;
    width: 60px;
    height: 32px;
    margin-left: 16px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid rgb(0, 92, 230);
    cursor: pointer;
    font-size: 14px;
    box-sizing: border-box;
  }
}
.active {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: calc(100% - 2px);
    height: 100%;
    border: 1px solid #005ce6!important;
    border-radius: 4px!important;
    z-index: 1;
  }
    background-color: #fff!important;
    color: #005ce6!important;
  &:hover {
    background-color: #fff!important;
  }
}
.el-button-group>.el-button {
  width: 60px;
  height: 32px;
  border: 1px solid rgb(237, 241, 246);
  color: rgb(52, 65, 86);
  font-size: 14px;
  padding: 0;
  &:hover {
    background: rgba(0, 92, 230, 0.05);
  }
}
.el-button-group > .el-button.gray-font {
  color: rgb(107, 116, 143);
}
.cantEvent{
  pointer-events: none;
  opacity: 0.3;
}
.default-btn {
  border: 1px solid rgb(0, 92, 230);
  border-radius:4px;
  color: rgb(0, 92, 230);
}
.height-light-btn {
  background: rgb(0, 92, 230);
  border-radius:4px;
  color: #fff;
}
</style>

