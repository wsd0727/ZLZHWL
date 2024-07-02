<!--
 * @Author: cc2049
 * @Date: 2024-05-20 19:26:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-23 15:44:31
 * @Description: 简介
-->
<template>
  <v-chart :option="option1" autoresize :style="{ height: height + 'px' }" />
</template>

<script setup name="">
import { getVchartData } from "#/dashboard/index";


const props = defineProps({
  height: Number,
  CFG: Object,
});

const option1 = ref({
  tooltip: {},
  legend: {
    data: ["销量"],
  },
  xAxis: {
    data: ["苹果", "核桃", "香蕉"],
  },
  yAxis: {},
  series: [{ name: "销量", type: "bar", data: [100, 200, 300] }],
});

const PK_CLASS = inject("PK_CLASS");
const QueryJson = inject("QueryJson");
function getData() {
  let query = {
    ...QueryJson.value,
    BEGINDATE: "",
    ENDDATE: "",
  };
  getVchartData(props.CFG.url, query).then((res) => {
    option1.value = res.RESULT;
  });
}

watch(
  PK_CLASS,
  (val) => {
    getData()
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

<style scoped></style>
