<template>
  <el-scrollbar :height="height">
    <el-timeline class="eos-time">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.OPTIME"
        placement="top"
      >
        <span class="text-ellipsis time-content" :title="activity.OPACTION">
           {{  activity.OPACTION }}
          <!-- <el-tooltip
            class="box-item"
            effect="dark"
            :content="activity.OPACTION"
            placement="top-start"
          >
            {{  activity.OPACTION }}
          </el-tooltip> -->
        </span>
      </el-timeline-item>
    </el-timeline>
  </el-scrollbar>
</template>

<script setup name="">
import { getVchartData } from "#/dashboard/index";

const props = defineProps({
  height: Number,
  CFG: Object,
});
console.log("🚀 ~ file: Timeline.vue:31 ~ CFG:", props.CFG)

const activities = ref([]);
const PK_CLASS = inject("PK_CLASS");
const QueryJson = inject("QueryJson");

function getData() {
let query = {}
  if(QueryJson){
    query = {
      ...QueryJson.value,
      BEGINDATE: "",
      ENDDATE: "",
    };
  }else{
    query = {
      BEGINDATE: "",
      ENDDATE: "",
    };
  }

  // let query = {
  //   ...QueryJson.value,
  //   BEGINDATE: "",
  //   ENDDATE: "",
  // };
  getVchartData(props.CFG.url, query).then((res) => {
    activities.value = res.RESULT;
  });
}

watch(
  PK_CLASS,
  (val) => {
    getData();
  },
  {
    immediate: true,
  }
);

watch(props.CFG, (val) => {
  if (val.refresh > 1) {
    getData();
  }
});
</script>

<style scoped lang="scss">
.eos-time {
  padding-left: 120px !important;
  position: relative;
  padding-top: 18px;
  :deep(.el-timeline-item__timestamp.is-top) {
    position: absolute;
    left: -120px;
  }
  .time-content {
    display: inline-block;
    width: 100%;
  }
}

:deep(.el-timeline-item__timestamp){
  color: #838A9D;
}
</style>
