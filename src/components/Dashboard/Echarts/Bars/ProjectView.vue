<template>
  <div class="project-view">
    <div class="left">
      <div class="title">所有项目</div>
      <div class="value">{{ projectNum }}</div>
      <el-button @click="openProject" type="primary">查看所有  <el-icon><Right /></el-icon></el-button>
    </div>
    <div class="right">
      <v-chart
        :option="option1"
        autoresize
        :style="{ height: height + 'px' }"
      />
    </div>
  </div>
</template>

<script setup name="">
import { getVchartData } from "#/dashboard/index";

const router = useRouter();


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

const projectNum = ref(260)

// {
//     "allProjectNum":"100",
//     "echarts":"{柱状图的数据}"
// }

function getData() {
  let query = {
    ...QueryJson.value,
    BEGINDATE: "",
    ENDDATE: "",
  };
  getVchartData(props.CFG.url, query).then((res) => {
    let { allProjectNum , echarts } = res.RESULT;
    projectNum.value = allProjectNum
    option1.value = echarts
  });
}

function openProject(){
    router.push({
        path: '/project/getProjectMenu/establish',
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
.project-view{
    display: flex;
    height: 100%;
    .left{
        width: 200px;
        text-align: center;
        position: relative;
        top: 25%;

        .value{
            font-size: 60px;
            font-weight: 600;
        }
    }
    .right{
        flex: 1;
    }
}
</style>
