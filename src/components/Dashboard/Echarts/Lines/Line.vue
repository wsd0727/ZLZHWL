<template>
  <v-chart
    :option="RighrOption"
    :style="{ height: height + 'px' }"
    autoresize
  />
</template>

<script setup name="">
import { getVchartData } from "#/dashboard/index";

const props = defineProps({
  height: Number,
  CFG: Object,
});
const RighrOption = ref({
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: [],
  },
  toolbox: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: [],
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    // {
    //   name: "Email",
    //   type: "line",
    //   stack: "Total",
    //   data: [120, 132, 101, 134, 90, 230, 210],
    // },
  ],
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
    let { xAxis  , series} = res.RESULT ;
      RighrOption.value.xAxis = [xAxis]
      RighrOption.value.series = series
      RighrOption.value.legend.data = series.map(i=>{return i.name })
  });
}

watch(PK_CLASS, val => {
   getData() 
}, {
  immediate: true
})

watch(props.CFG , val => {
  if(val.refresh>1){
    getData();
  }
})



</script>

<style scoped></style>
