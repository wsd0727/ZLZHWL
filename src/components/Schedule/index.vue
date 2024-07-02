<template>
  <div class="schedule">
    <div class="timebtn">
      <div class="left"></div>
      <div class="center">
        <el-icon class="left" @click="prev">
          <ArrowLeft />
        </el-icon>
        <div class="time">
          <div class="time-item">
            <el-link class="day" @click="SdRef?.handleOpen">{{ startDay.year }}年{{startDay.month}}月{{startDay.day}}日</el-link>
            <el-date-picker ref="SdRef" v-model="startDay.date" type="date" :size="size" @change="val=>setTime(val,'start')" class="hideDate" :disabled-date="t=>t.getTime() > new Date(endDay.date).getTime()" />
          </div>
          <span style="margin:0 5px;">-</span>
          <div class="time-item">
            <el-link class="day" @click="EdRef?.handleOpen">
              <template v-if="endDay.month > startDay.month">{{endDay.month}}月</template>{{endDay.day}}日
            </el-link>
            <el-date-picker ref="EdRef" v-model="endDay.date" type="date" :size="size" @change="val=>setTime(val,'end')" class="hideDate" :disabled-date="t=>t.getTime() < new Date(startDay.date).getTime()" />
          </div>
        </div>
        <el-icon class="right" @click="next">
          <ArrowRight />
        </el-icon>
      </div>
      <div class="right">
        <el-button @click="scrollDay" :size="size">今天</el-button>
      </div>
    </div>
    <el-scrollbar ref="scrollRef" class="table-box" v-loading="loading">
      <div class="table" :style="{...minWid,height:height+'px'}">
        <div class="table-head" :style="minWid">
          <div class="tr">
            <div class="th fixed block">
              <slot name="menu" />
            </div>
            <div class="th day" :class="[(day.week=='周六'||day.week=='周日')?'notwork':'']" v-for="day in days" :key="day.date">{{day.week}} {{day.month}}/{{day.day}}</div>
          </div>
        </div>
        <div class="table-body" :style="minWid">
          <div ref="groupRef" class="group odd" v-for="(item,index) in data" :key="item[value]">
            <div class="tr">
              <div class="td fixed block" @click="targetOpen(index)">
                <slot name="block" :data="item" :index="index" />
              </div>
              <div class="td" :class="{'notclick':day.value > today,'today':day.value.toLocaleDateString() == today.toLocaleDateString()}" v-for="day in item?.[children]" :key="day.date">
                <div class="content" v-if="!(day.value > today)">
                  <div :class="index=='0'?'addBtn':'add'" @click="index=='0'?handleAdd(day):null">
                    <slot name="day" :data="day">
                      <template v-if="index== '0'">
                        <el-icon class="Add" size="20px">
                          <CirclePlus />
                        </el-icon>
                      </template>
                    </slot>
                  </div>
                  <div class="open-show">
                    <slot name="day-item" :data="day" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="group">
            <div class="tr">
              <div class="td fixed block"></div>
              <div class="td" :class="{'today':day.value.toLocaleDateString() == today.toLocaleDateString()}" v-for="day in days" :key="day.date" />
            </div>
          </div>
        </div>
        <div class="table-foot" :style="minWid">
          <div class="tr">
            <div class="td fixed block">
              <slot name="total" />
            </div>
            <div class="td" v-for="day in totalData" :key="day.date">
              <slot name="total-item" :data="day" />
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup name="Schedule">
const props = defineProps({
  date: Array,
  data: Array,
  totalData: Array,
  height: Number,
  loading: Boolean,
  size: {
    type: String,
    default: "small"
  },
  label: {
    type: String,
    default: 'VNAME'
  },
  value: {
    type: String,
    default: "BLLNO"
  },
  children: {
    type: String,
    default: "CHILDREN"
  }
})
const emit = defineEmits(['click', "change"])
const groupRef = ref(null)

const scrollRef = ref(null)
const SdRef = ref(null)
const EdRef = ref(null)

const today = ref(new Date()) // 今天
const days = ref([]) // 日期数组

const startDay = computed(() => {
  return days.value[0]
})
const endDay = computed(() => {
  return days.value[days.value.length - 1]
})
const diffDay = computed(() => {
  return
})

const minWid = computed(() => {
  return { 'min-width': (days.value.length * 201) + 300 + 'px' }
})

function calcNow() {
  let startTime, endTime;
  let now = new Date(); //当前日期 
  let nowDayOfWeek = now.getDay() - 1; //今天本周的第几天 
  let nowDay = now.getDate(); //当前日 
  let nowMonth = now.getMonth(); //当前月 
  let nowYear = now.getFullYear(); //当前年 
  let jd = Math.ceil((nowMonth + 1) / 3)
  startTime = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek).toLocaleDateString()
  endTime = new Date(nowYear, nowMonth, nowDay + 6 - nowDayOfWeek).toLocaleDateString()
  return [startTime, endTime]
}

function calcDays(dateArr) {
  if (!dateArr || !dateArr.length) dateArr = calcNow()
  let weekArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  let [Sd, Ed] = dateArr;
  let startDay = new Date(Sd),
    endDay = new Date(Ed);
  let arr = [];
  while ((endDay.getTime() - startDay.getTime()) > 0) {
    let year = startDay.getFullYear();
    let month = startDay.getMonth() + 1;
    let day = startDay.getDate();
    let week = startDay.getDay();
    arr.push({
      year,
      month,
      day,
      week: weekArr[week],
      date: `${year}-${month}-${day}`,
      value: new Date(startDay),
    })
    startDay.setDate(startDay.getDate() + 1);
  }
  arr.push({
    year: endDay.getFullYear(),
    month: endDay.getMonth() + 1,
    day: endDay.getDate(),
    week: weekArr[endDay.getDay()],
    date: `${endDay.getFullYear()}-${endDay.getMonth() + 1}-${endDay.getDate()}`,
    value: new Date(endDay)
  })
  days.value = arr

}

function getDaysBetween(startDay, endDay) {
  let num = 0,
    sD = Date.parse(startDay),
    eD = Date.parse(endDay);
  if (sD < eD) { num = 0 }
  if (sD == eD) { num = 0; }
  else { num = (eD - sD) / (1 * 24 * 60 * 60 * 1000) }
  return num
}

const init = () => {
  calcDays(props.date)
}

const prev = () => {
  let diff = getDaysBetween(startDay.value.date, endDay.value.date)
  let date = new Date(startDay.value.date)
  let sD = new Date(date.setDate(date.getDate() - diff - 1)),
    eD = new Date(date.setDate(date.getDate() + diff));
  calcDays([sD, eD])
  emit("change", {
    start: startDay.value.date,
    end: endDay.value.date
  })
}
const next = () => {
  let diff = getDaysBetween(startDay.value.date, endDay.value.date);
  let date = new Date(endDay.value.date)
  let sD = new Date(date.setDate(date.getDate() + 1)).toLocaleDateString(),
    eD = new Date(date.setDate(date.getDate() + diff)).toLocaleDateString();
  calcDays([sD, eD])
  emit("change", {
    start: startDay.value.date,
    end: endDay.value.date
  })
}
const scrollDay = () => {
  let hastoDay = days.value.some(el => el.value.toLocaleDateString() == today.value.toLocaleDateString())
  if (!hastoDay) {
    calcDays()
  } else {
    let index = days.value.findIndex(el => el.value.toLocaleDateString() == today.value.toLocaleDateString())
    scrollRef.value?.scrollTo({ left: (index - 1) * 201, behavior: "smooth" })
  }
  emit("change", {
    start: startDay.value.date,
    end: endDay.value.date
  })
}
const setTime = (val, type) => {
  let date = new Date(val).toLocaleDateString()
  type == 'start' ? calcDays([date, endDay.value.date]) : calcDays([startDay.value.date, date])
  emit("change", {
    start: startDay.value.date,
    end: endDay.value.date
  })
}

const targetOpen = index => {
  let className = groupRef.value[index].className
  groupRef.value[index].className = !className.includes("open") ? className + " open" : "group odd"
}

const handleAdd = val => emit("click", val)

init()
</script>

<style lang="scss" scoped>
.schedule {
  .timebtn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    .center {
      display: flex;
      align-items: center;
      .left {
        margin-right: 20px;
      }
      .time {
        display: flex;
        align-items: center;
        font-size: 14px;
        &-item {
          position: relative;
          :deep(.hideDate) {
            width: 0 !important;
            height: 0 !important;
            opacity: 0 !important;
            position: absolute;
            left: 50%;
            bottom: 0;
          }
        }
        :deep(span) {
          font-size: 14px;
        }
      }
      .right {
        margin-left: 20px;
      }
    }
  }
  .table-box {
    border: 1px solid var(--el-border-color) !important;
  }
  .table {
    min-width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
    flex: auto 1;
    flex-direction: column;
    align-items: stretch;
    border-collapse: collapse;
    font-size: 14px;
    * {
      box-sizing: border-box;
      line-height: 20px;
    }
    .tr {
      flex: 1 0 auto;
      display: inline-flex;
      .th {
        width: 201px;
        flex: 201 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: #fff;
        user-select: none;
        &:first-child {
          border-right: 1px solid var(--el-border-color);
        }
      }
      .td {
        width: 201px;
        max-width: 201px;
        flex: 201 0 auto;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        white-space: nowrap;
        overflow: hidden;
        padding: 0;
        user-select: none;
        .content {
          width: 100%;
          height: 100%;
          display: block;
          .addBtn,
          .add {
            margin: 8px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            padding: 0 8px;
            cursor: pointer;
            box-sizing: border-box;
            &:hover {
              border: 1px dotted var(--el-color-primary);
              color: var(--el-color-primary) !important;
              .Add {
                display: block;
              }
            }
            .Add {
              display: none;
            }
          }
        }
      }
      .fixed {
        position: sticky !important;
        left: 0;
        z-index: 1;
      }
      .block {
        width: 300px;
        max-width: 300px;
        flex: 300 0 auto;
      }
    }
    &-head {
      border-bottom: 1px solid var(--el-border-color);
      height: 50px;
      max-height: 50px;
      background: #fff;
      box-sizing: content-box;
      position: sticky !important;
      top: 0;
      z-index: 3;
      flex: 1 0 auto;
      user-select: none;
      .tr {
        height: 50px;
      }
    }
    &-body {
      display: flex;
      flex-direction: column;
      flex: 1 0 auto;
      .today {
        background: rgba($color: var(-el-color-primary), $alpha: 1);
      }
      .group {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        flex: 0 0 auto;
        min-height: 60px;
        max-height: 60px;
        &.odd {
          .tr {
            border-bottom: 1px solid var(--el-border-color);
            .td {
              cursor: pointer;
            }
          }
        }
        &.open {
          max-height: none;
          .tr {
            z-index: 2;
            height: auto;
            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
          }
        }
        .tr {
          height: 60px;
          .td {
            border-right: 1px solid var(--el-border-color);
          }
        }
      }
      div:last-of-type {
        flex: 1 1 100%;
        max-height: none;
      }
    }
    &-foot {
      box-sizing: content-box;
      border-top: 1px solid var(--el-border-color);
      position: sticky;
      z-index: 2;
      max-height: 40px;
      background: #fff;
      color: var(--el-text-color-secondary);
      position: sticky;
      bottom: 0;
      .tr {
        height: 40px;
        .td {
          border-right: 1px solid var(--el-border-color);
        }
      }
    }
  }
  .day {
    font-weight: 500;
  }
  .today {
    background: var(--el-color-primary-light-9) !important;
  }
  .notwork {
    color: var(--el-text-color-secondary);
  }
  .notclick {
    cursor: not-allowed !important;
  }
}
:deep(.el-scrollbar__bar) {
  z-index: 10 !important;
}
</style>