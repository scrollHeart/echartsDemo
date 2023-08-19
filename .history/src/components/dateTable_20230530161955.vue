<script>
import fecha from '../utils/date';
import { range as rangeArr, getFirstDayOfMonth, getPrevMonthLastDays, getMonthDays } from '../utils/date-util';

export default {
  props: {
    selectedDay: String, // formated date yyyy-MM-dd
    date: Date,
    hideHeader: Boolean,
    firstDayOfWeek: Number
  },

  inject: ['elCalendar'],

  methods: {
    toNestedArr(days) {
      return rangeArr(days.length / 7).map((_, index) => {
        const start = index * 7;
        return days.slice(start, start + 7);
      });
    },

    getFormateDate(day, type) {
      if (!day || ['prev', 'current', 'next'].indexOf(type) === -1) {
        throw new Error('invalid day or type');
      }
      let prefix = this.curMonthDatePrefix;
      if (type === 'prev') {
        prefix = this.prevMonthDatePrefix;
      } else if (type === 'next') {
        prefix = this.nextMonthDatePrefix;
      }
      day = `00${day}`.slice(-2);
      return `${prefix}-${day}`;
    },

    getCellClass({ text, type}) {
      let classes = [type];
      if (type === 'current') {
        let newSet = new Set(classes);
        newSet.delete('is-past');
        classes = [...newSet];
        const date = this.getFormateDate(text, type);
        if (date === this.selectedDay) {
          classes.push('is-selected');
        }
        if (date === this.$moment().format('YYYY-MM-DD')) {
          classes.push('is-today');
        }
        if (date.slice(0, date.lastIndexOf('-')) === this.$moment().format('YYYY-MM') && Number(date.split('-')[2]) < Number(this.$moment().format('DD'))) {
          classes.push('is-past');
        }

      }
      else {
        classes.push('cantclick');
        let newSet = new Set(classes);
        newSet.delete('is-past');
        classes = [...newSet];
      }
      console.log(classes, 'classes----')
      return classes;
    },

    pickDay({ text, type }) {
      const date = this.getFormateDate(text, type);
      this.$emit('pick', date);
    },

    cellRenderProxy({ text, type }) {
      let render = this.elCalendar.$scopedSlots.dateCell;
      if (!render) return <span>{ text }</span>;

      const day = this.getFormateDate(text, type);
      const date = new Date(day);
      const data = {
        isSelected: this.selectedDay === day,
        type: `${type}-month`,
        day
      };
      return render({ date, data });
    }
  },

  computed: {
    WEEK_DAYS() {
      return ['日', '一', '二', '三', '四', '五', '六'];
    },
    prevMonthDatePrefix() {
      const temp = new Date(this.date.getTime());
      temp.setDate(0);
      return fecha.format(temp, 'yyyy-MM');
    },

    curMonthDatePrefix() {
      return fecha.format(this.date, 'yyyy-MM');
    },

    nextMonthDatePrefix() {
      const temp = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
      return fecha.format(temp, 'yyyy-MM');
    },
    rows() {
      let days = [];
        const date = this.date;
        let firstDay = getFirstDayOfMonth(date);
        firstDay = firstDay === 0 ? 7 : firstDay;
        const firstDayOfWeek = typeof this.firstDayOfWeek === 'number' ? this.firstDayOfWeek : 1;
        const offset = (7 + firstDay - firstDayOfWeek) % 7;
        const prevMonthDays = getPrevMonthLastDays(date, offset).map(day => ({
          text: day,
          type: 'prev'
        }));
        const currentMonthDays = getMonthDays(date).map(day => ({
          text: day,
          type: 'current'
        }));
        days = [...prevMonthDays, ...currentMonthDays];
        const nextMonthDays = rangeArr(42 - days.length).map((_, index) => ({
          text: index + 1,
          type: 'next'
        }));
        days = days.concat(nextMonthDays);
      return this.toNestedArr(days);
    },

    weekDays() {
      const start = this.firstDayOfWeek;
      const { WEEK_DAYS } = this;

      if (typeof start !== 'number' || start === 0) {
        return WEEK_DAYS.slice();
      } else {
        return WEEK_DAYS.slice(start).concat(WEEK_DAYS.slice(0, start));
      }
    }
  },

  render() {
    const thead = this.hideHeader ? null : (<thead>
      {
        this.weekDays.map(day => <th key={day}>{ day }</th>)
      }
    </thead>);
    return (
      <table
        class={{
          'calendar-table': true,
        }}
        cellspacing="0"
        cellpadding="0">
        {
          thead
        }
        <tbody>
          {
            this.rows.map((row, index) => <tr
              class={{
                'calendar-table__row': true,
                'calendar-table__row--hide-border': index === 0 && this.hideHeader
              }}
              key={index}>
              {
                row.map((cell, key) => <td key={key}
                  class={ this.getCellClass(cell) }
                  onClick={this.pickDay.bind(this, cell)}>
                  <div class="calendar-day">
                    {
                      this.cellRenderProxy(cell)
                    }
                  </div>
                </td>)
              }
            </tr>)
          }
        </tbody>
      </table>);
  }
};
</script>
