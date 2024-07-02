<template>
  <el-scrollbar :height="height">
    <InfoTimeLine :height="200" :data="activities" :config="[]" />
  </el-scrollbar>
</template>

<script setup name="">
import { getVchartData } from "#/dashboard/index";
import InfoTimeLine from "@/components/TimeLine"; // 单据进度条

const props = defineProps({
  height: Number,
  CFG: Object,
});

const activities = ref([]);
const PK_CLASS = inject("PK_CLASS");
const QueryJson = inject("QueryJson");

function getData() {
  console.log('节点信息' , QueryJson.value );

  let query = {
    ...QueryJson.value,
    // BEGINDATE: "",
    // ENDDATE: "",
    "PK_CLASS": "",
    "MODULEID": "MU230302801025",
    "PAGEID": "PG230302569470"
  };
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
</style>
