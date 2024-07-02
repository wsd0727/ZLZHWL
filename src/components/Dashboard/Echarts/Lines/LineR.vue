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
  title: {},
  tooltip: {},
  legend: {},
  series: [],
});

const PK_CLASS = inject("PK_CLASS");
const QueryJson = inject("QueryJson");
function getData() {
  let query = {
    ...QueryJson.value,
    BEGINDATE: "",
    ENDDATE: "",
  };
  console.log(789, query );
  getVchartData(props.CFG.url, query).then((res) => {
      option2.value = res.RESULT
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
