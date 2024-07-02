<template>
  <v-chart :option="option2" autoresize :style="{ height: height + 'px' }" />
</template>

<script setup name="">
import { getVchartData } from "#/dashboard/index";


const props = defineProps({
  height: Number,
  CFG: Object,
});

const option2 = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
  },
  series: [
    {
      name: '2011',
      type: 'bar',
      data: [18203, 23489, 29034, 104970, 131744, 630230]
    },
    {
      name: '2012',
      type: 'bar',
      data: [19325, 23438, 31000, 121594, 134141, 681807]
    }
  ]
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
    option2.value = res.RESULT;
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

</script>

<style scoped></style>
