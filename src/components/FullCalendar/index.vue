<template>
  <div class="calendar">
    <div class="calendar-header">
      <div class="left">
        <el-button-group>
          <el-button @click="month">月</el-button>
          <el-button @click="week">周</el-button>
          <el-button @click="today">今天</el-button>
        </el-button-group>
      </div>
      <div class="center">
        <el-icon @click="prev">
          <ArrowLeft />
        </el-icon>
        <h2 class="title">{{ title }}</h2>
        <el-icon @click="next">
          <ArrowRight />
        </el-icon>
      </div>
      <div class="right"></div>
    </div>
    <div class="calendar-dody">
      <FullCalendar ref="fullCalendarRef" :options="options">
        <template v-slot:eventContent='arg'>
          <div>{{ arg.event.title }}</div>
          <!-- <el-popover placement="top-start" title="标题" width="200" :visible-arrow="true" trigger="hover">
            <div class="title">{{ arg.event.title }}</div>
            <el-button @click="more">更多</el-button>
            <template v-slot:reference class="popper-content">
              <span>{{ arg.timeText }}</span>
              <i>{{ arg.event.title }}</i>
              <i>{{ arg.event.title }}</i>
            </template>
          </el-popover> -->
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'

const props = defineProps({
  modelValue: Array
})

const fullCalendarRef = ref(null)
const handleDateClick = val => {
  // console.log("dateClick::", val);
}
const title = ref("")
const API = ref(null)

const options = reactive({
  locale: 'zh',
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
  initialView: 'dayGridMonth',
  dateClick: handleDateClick,
  selectable: true, // 日历格子可选择
  headerToolbar: false,
  displayEventEnd: false, // like 08:00 - 13:00
  eventTimeFormat: { // like '14:30:00'
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false,
    hour12: false, // 设置时间为24小时
  },
  slotLabelFormat: { // 左侧时间格式
    hour: '2-digit',
    minute: '2-digit',
    meridiem: 'lowercase',
    hour12: false, // false设置时间为24小时
  },
  events: props.modelValue
})

// 初始化
const init = () => {
  API.value = fullCalendarRef.value.getApi();
  setTitle()
}

const setTitle = () => {
  title.value = API.value.view?.title
}

// 操作
const next = () => {
  API.value.next();
  setTitle()
}
const prev = () => {
  API.value.prev();
  setTitle()
}
const today = () => {
  API.value.today();
  setTitle()
}

// 视图
const month = () => {
  API.value.changeView("dayGridMonth")
  today()
}
const week = () => {
  API.value.changeView("timeGridWeek")
  today()
}

watch(() => props.modelValue, val => {
  API.value.setDates(val)
})

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.calendar {
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    .center {
      display: flex;
      align-items: center;
      .title {
        font-size: 16px;
        margin: 0 10px;
      }
    }
  }
  &-body {
  }
}
</style>