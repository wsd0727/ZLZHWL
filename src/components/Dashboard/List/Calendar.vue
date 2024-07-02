<template>
  <el-calendar
    v-if="tableData.length"
    v-model="calDate"
    ref="calendar"
    class="lar-el-calendar"
  >
    <template #header="{ date }">
      <span>{{ date }}</span>
      <el-button-group>
        <el-button size="small" @click="selectDate('prev-month')"
          >上个月</el-button
        >
        <el-button size="small" @click="selectDate('next-month')"
          >下个月</el-button
        >
      </el-button-group>
    </template>
    <template #date-cell="{ data }">
      <div class="meeting" :class="setMeeting(data).isRed ? 'meeting-red' : ''">
        {{ data.day.split("-").slice(2)[0] }}
        <div class="meeting-title text-ellipsis-3">
          <div
            class="text-ellipsis"
            v-for="(item, index) in setMeeting(data).title"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </template>
  </el-calendar>
</template>

<script setup name="">
import { getVchartData } from "#/dashboard/index";
import { parseTime } from "@/utils/ruoyi";

const props = defineProps({
  height: Number,
  CFG: Object,
});
const calendar = ref(null);
const calDate = ref(new Date());

const tableData = ref([]);
const teamList = ref([]);
const PK_CLASS = inject("PK_CLASS");
const QueryJson = inject("QueryJson");
function getData() {
  let YYMM = parseTime(calDate.value).split(" ")[0];
  let query = {
    ...QueryJson.value,
    BEGINDATE: "",
    ENDDATE: "",
    YEAR: YYMM,
  };
  getVchartData(props.CFG.url, query).then((res) => {
    tableData.value = res.RESULT;
  });
}

function setMeeting(date) {
  let a = date.day.split("-").slice(1).join("-");
  let getTodaytitle = tableData.value.filter((i) => i.DATE == date.day);
  let title = "",
    isRed = false;
  if (getTodaytitle.length) {
    title = getTodaytitle[0].THEME;
    isRed = getTodaytitle[0].FLAG == 1;
  }
  return { title, isRed };
}

const selectDate = (val) => {
  if (!calendar.value) return;
  calendar.value.selectDate(val);
  getData();
};

watch(
  PK_CLASS,
  (val) => {
    if(props.CFG){
      getData();
    }
  },
  {
    immediate: true,
  }
);

// watch(props.CFG, (val) => {
//   if (val.refresh > 1 || props.CFG) {
//     getData();
//   }
// });
</script>

<style lang="scss" scoped>
.lar-el-calendar {
  .el-calendar-table td .el-calendar-day:hover {
    background-color: #a2e5a2 !important;
  }
  .meeting-red {
    background-color: #fbb1b1;
  }
  .meeting {
    height: 100%;
    padding: 4px;
    .meeting-title {
      color: #333;
      font-size: 14px;
    }
  }
}

:deep(.el-calendar-table .el-calendar-day) {
  padding: 0 !important;
  height: 100px;
}
</style>
