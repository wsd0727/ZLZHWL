<template>
  <el-scrollbar :height="height">
    <div class="gante-table">
      <div class="left">
        <el-input
          v-model="keyword"
          class="key-clas"
          clearable
          @change="getProject(keyword)"
        ></el-input>
        <el-scrollbar :height="height - 60">
          <div
            class="project"
            v-for="item in projectList"
            :key="item.VALUE"
            @click="handelPro(item)"
          >
            {{ item.LABEL }}
          </div>
        </el-scrollbar>
      </div>
      <div class="center">
        <div class="round">
          <el-progress
            type="circle"
            :width="180"
            :stroke-width="14"
            :percentage="teamList.projectPress"
          />
        </div>
        <div class="flex-wrap">
          <div class="count" v-for="item in teamList.count" :key="item.i">
            <p class="desc">{{ item.label }}</p>
            <p class="title" :class="item.isRed ? 'red' : ''">
              {{ item.value }}
            </p>
          </div>
        </div>
      </div>
      <div class="right">
        <v-chart
          :option="optionGante"
          autoresize
          :style="{ height: height - 50 + 'px' }"
        />
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup name="">
import { getProjectData } from "@/api/dashboard/index";
import { getVchartData } from "#/dashboard/index";
const props = defineProps({
  height: Number,
  CFG: Object,
});

const tableData = ref([]);
const columnCFG = ref([]);

const teamList = ref({
  projectPress: "80",
  echarts: "",
  count: [
    {
      label: "预计",
      value: "180",
      unit: "天",
    },
    {
      label: "预计",
      value: "180",
      unit: "天",
    },
    {
      label: "预计",
      value: "180",
      unit: "天",
    },
    {
      label: "预计",
      value: "180",
      unit: "天",
      isRed: true,
    },
  ],
});
const QueryJson = inject("QueryJson");
function getData() {
  let query = {
    BEGINDATE: "",
    ENDDATE: "",
    PK_CLASS: PK_CLASS.value,
  };
  getVchartData(props.CFG.url, query).then((res) => {
    teamList.value = res.RESULT;
    optionGante.value = res.RESULT.echarts

    console.log(optionGante.value);
    // optionGante.value.yAxis.data = res.RESULT.echarts.yAxis.data
    // optionGante.value.series = res.RESULT.echarts.series
  });
}

// 获取项目列表
const keyword = ref("");
const PK_CLASS = ref("");
const activeDash = ref();
const projectList = ref([]);

function getProject(key) {
  // if (!key && key != "") {
  //   return;
  // }
  getProjectData({ KEYWORD: key }).then((res) => {
    projectList.value = res.RESULT;
    if (!key) {
      PK_CLASS.value = projectList.value[0].VALUE;
      getData()
    }
  });
}
getProject();

function handelPro(data) {
  PK_CLASS.value = data.VALUE;
  keyword.value = data.LABEL;
  getData();
}
watch(
  PK_CLASS,
  (val) => {
    // getData();
  },
  {
    immediate: true,
  }
);

watch(props.CFG, (val) => {
  if (val.refresh > 1) {
    // getData();
  }
});

const optionGante = ref({
  // 鼠标移入提示工具
  tooltip: {
    trigger: "axis",
    formatter(params) {
      if (params[1].data && params[0].data) {
        return (
          `<div>开始时间：${params[1].data}</div>` +
          `<div>结束时间：${params[0].data}</div>`
        );
      } else {
        return "";
      }
    },
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    containLabel: true,
    show: false,
    right: 80,
    left: 40,
    bottom: 40,
    top: 20,
    backgroundColor: "#fff",
  },
  legend: {
    // 图例组件
    data: ["持续时间"],
    align: "auto",
    top: "bottom",
  },
  xAxis: {
    type: "time",
    position: "top", // x 轴位置
    axisTick: {
      // 隐藏刻度
      show: false,
    },
    axisLine: {
      // 隐藏轴线
      show: false,
    },
    splitLine: {
      // 显示网格线
      show: true,
    },
  },
  yAxis: {
    inverse: true, // y 轴数据翻转，该操作是为了保证项目一放在最上面，项目七在最下面
    axisTick: {
      // 隐藏刻度
      show: false,
    },
    axisLine: {
      // 隐藏轴线
      show: false,
    },
    data: [
      "项目一",
      "项目二",
      "项目三",
      "项目四",
      "项目五",
      "项目六",
      "项目七",
    ],
  },
  series: [
    {
      name: "持续时间",
      type: "bar",
      stack: "duration",
      itemStyle: {
        color: "#007acc",
        borderColor: "#fff",
        borderWidth: 1,
      },
      zlevel: -1,
      data: [
        "2021-01-31",
        "2021-02-25",
        "2021-03-25",
        "2021-04-01",
        "2021-04-10",
        "2021-05-25",
        "2021-07-25",
      ], // 结束时间
    },
    {
      name: "持续时间",
      type: "bar",
      stack: "duration", // 堆叠标识符，同个类目轴上系列配置相同的 stack 值可以堆叠放置
      itemStyle: {
        color: "#fff",
      },
      zlevel: -1, // zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
      z: 9, // z值小的图形会被z值大的图形覆盖，z相比zlevel优先级更低，而且不会创建新的 Canvas
      data: [
        "2021-01-01",
        "2021-01-31",
        "2021-02-25",
        "2021-03-25",
        "2021-04-01",
        "2021-04-10",
        "2021-05-25",
      ], // 开始时间
    },
  ],
});
</script>

<style scoped lang="scss">
.gante-table {
  display: flex;
  .left {
    width: 20%;
    padding-top: 6px;
    .project {
      padding: 5px 0;
      color: #333;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
  }
  .center {
    width: 30%;
    text-align: center;

    .red {
      color: #f56c6c;
    }
  }
  .right {
    width: 50%;
  }

  .flex-wrap {
    display: flex;
    justify-content: space-around;
  }
}

.desc {
  font-size: 12px;
  color: #333;
}
.title {
  font-size: 26px;
  font-weight: 600;
}
</style>
