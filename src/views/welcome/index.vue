<template>
  <!-- 默认的公共模板 -->
  <div class="app-container">
    <el-row :gutter="6">
      <el-col :span="16" class="card-box oneContent">
        <el-card>
          <template #header><span>快捷入口</span>
            <el-button style="float: right" @click="editMenu" size="small">编辑</el-button>
          </template>
          <div class="IconContent">
            <div class="cell" v-for="(item, index) in IconOption" :key="index" @click="IconClick(item)">
              <!-- <el-icon class="IconImg" :style="cycleColor(item.background)">
                <Postcard />
              </el-icon> -->
              <router-link :to="'/' + item.ROUTE">
                <i :class="'fa ' + item.ICON" class="IconImg" :style="cycleColor(item.COLOR)"></i>
                <p>{{ item.VNAME }}</p>
              </router-link>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="card-box oneContent">
        <el-card>
          <template #header><span>系统通知</span></template>
          <div class="text item" v-for="item in rightCardData" :key="item">
            <span>{{ item.label }}</span>
            <span class="topRightTitle"> {{ item.value }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="card-box twoPadd">
        <el-card>
          <template #header><span>产品统计</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div id="myChart" style="height: 450px"></div>
            <!-- <div ref="commandstats" style="height: 420px" /> -->
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box twoPadd">
        <el-card>
          <template #header>
            <span>产品走势</span>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div id="myRightChart" style="height: 450px" />
          </div>
        </el-card>
      </el-col>
      <!-- <el-col :span="8" class="card-box twoPadd" v-if="false">
        <el-card>
          <template #header><span>待办事项</span></template>
          <div class="text botitem" v-for="item in BottomCardData" :key="item">
            <span> {{ item.value }}</span>
            <el-button type="primary">{{ item.label }}</el-button>
          </div>
        </el-card>
      </el-col>-->
    </el-row> 
  </div>
</template>

<script setup name="Cache">
import { getCache } from "@/api/monitor/cache";
import { onMounted } from "@vue/runtime-core";
import * as echarts from "echarts";
import { IconList } from "@/api/system/welcome";
const rightCardData = [
  {
    label: "审批通知",
    value: "12",
  },
  {
    label: "合同统计",
    value: "78",
  },
  {
    label: "申请通知",
    value: "49",
  },
  {
    label: "公告",
    value: "81",
  },
];
const BottomCardData = [
  {
    label: "审批",
    value: "煤焦油",
  },
  {
    label: "审批",
    value: "中煤",
  },
  {
    label: "审批",
    value: "焦炭",
  },
  {
    label: "审批",
    value: "焦煤",
  },
  {
    label: "审批",
    value: "洗精煤",
  },
  {
    label: "审批",
    value: "黄金",
  },
  {
    label: "审批",
    value: "桐木",
  },
  {
    label: "审批",
    value: "钢铁",
  },
];
const IconRouter = [
  {
    imgName: "pay-circle",
    title: "销售订单",
    background: "#7879ff",
    type: 1,
  },
  {
    imgName: "money-collect",
    title: "采购订单",
    background: "#00bfd0",
    type: 2,
  },
  {
    imgName: "profile",
    title: "销售配载",
    background: "#1677ff",
    type: 3,
  },
  {
    imgName: "project",
    title: "采购配载",
    background: "#00b578",
    type: 4,
  },
  {
    imgName: "picture",
    title: "销售任务",
    background: "#ff6010",
    type: 5,
  },
  {
    imgName: "project",
    title: "采购配载",
    background: "#00b578",
    type: 4,
  },
  {
    imgName: "picture",
    title: "销售任务",
    background: "#ff6010",
    type: 5,
  },
  { imgName: "robot", title: "采购任务", background: "#00b7f0", type: 6 },
];

const cache = ref([]);
const commandstats = ref(null);
const usedmemory = ref(null);
const optionsFont = ref([]);
const getIconData = import("@/utils/font-awesome").then((res) => {
  optionsFont.value = res.default;
});
onMounted(() => {
  const { proxy } = getCurrentInstance();
  const chartDom = document.getElementById("myChart");
  const myChart = echarts.init(chartDom);
  const chartRightDom = document.getElementById("myRightChart");
  const myRightChart = echarts.init(chartRightDom);
  const option = {
    legend: {
      top: "bottom",
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: "",
        type: "pie",
        radius: [50, 100],
        center: ["45%", "50%"],
        // roseType: "area",
        itemStyle: {
          borderRadius: 3,
        },
        data: [
          { value: 80, name: "无人值守称重系统" },
          { value: 57, name: "智能物流一卡通" },
          { value: 32, name: "i-WMS仓储系统" },
          { value: 30, name: "i-TMS运输系统" },
          { value: 28, name: "i-MES生产系统" },
        ],
      },
    ],
  };
  option && myChart.setOption(option);
  const RighrOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: ["无人值守称重系统", "智能物流一卡通", "i-WMS仓储系统", "i-TMS运输系统", "i-MES生产系统"],
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
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
        data: ["无人值守称重系统", "智能物流一卡通", "i-WMS仓储系统", "i-TMS运输系统", "i-MES生产系统"],
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "Email",
        type: "line",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "Union Ads",
        type: "line",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: "Video Ads",
        type: "line",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: "Direct",
        type: "line",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: "Search Engine",
        type: "line",
        // label: {
        //   show: true,
        //   position: "top",
        // },
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  };
  option && myRightChart.setOption(RighrOption);
});
function IconClick(data) {
  // console.log(data.type);
}
const IconOption = ref([]);
function getIconList() {
  let data = {
    DR: "0",
    ISSHOW: "1",
    ENABLESTATE: "1",
  };
  IconList(data).then((res) => {
    IconOption.value = res.RESULT;
  });
}
function editMenu() {
  router.push("/da/base/kjrkgl");
  // router.push("/system/setting/kjrkgl");
}
function getList() {
  // console.log(123456);
  // proxy.$modal.loading("正在加载缓存监控数据，请稍候！");
  // getCache().then((response) => {
  //   console.log(response);
  //   proxy.$modal.closeLoading();
  //   console.log(response.data);
  //   cache.value = response.data;
  //   const commandstatsIntance = echarts.init(commandstats.value, "macarons");
  //   commandstatsIntance.setOption({
  //     tooltip: {
  //       trigger: "item",
  //       formatter: "{a} <br/>{b} : {c} ({d}%)",
  //     },
  //     series: [
  //       {
  //         name: "命令",
  //         type: "pie",
  //         roseType: "radius",
  //         radius: [15, 95],
  //         center: ["50%", "38%"],
  //         data: response.data.commandStats,
  //         animationEasing: "cubicInOut",
  //         animationDuration: 1000,
  //       },
  //     ],
  //   });
  //   const usedmemoryInstance = echarts.init(usedmemory.value, "macarons");
  //   usedmemoryInstance.setOption({
  //     tooltip: {
  //       formatter: "{b} <br/>{a} : " + cache.value.info.used_memory_human,
  //     },
  //     series: [
  //       {
  //         name: "峰值",
  //         type: "gauge",
  //         min: 0,
  //         max: 1000,
  //         detail: {
  //           formatter: cache.value.info.used_memory_human,
  //         },
  //         data: [
  //           {
  //             value: parseFloat(cache.value.info.used_memory_human),
  //             name: "内存消耗",
  //           },
  //         ],
  //       },
  //     ],
  //   });
  // });
}
function cycleColor(data) {
  return "background-color:" + data;
}
getList();
getIconList();
</script>
<style lang="scss" scoped>
.app-container {
  padding-bottom: 0px !important ;
  padding-top: 8px;
  overflow: hidden;
}
.topRightTitle {
  float: right;
}
.bottomBtn {
  float: right;
  border-radius: 4px;
  color: #fff;
  background-color: #337ab7;
}
.bottomBtn:hover {
  color: #fff !important;
  background-color: #286090 !important;
  border-color: #204d74 !important;
}
.item {
  padding: 10px 0;
  line-height: 30px;
}
.text {
  font-size: 14px;
}
.botitem {
  padding: 16.2px 0;
  line-height: 17px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.oneContent {
  margin-bottom: 5px !important;
}
.twoPadd {
  margin-bottom: 4px !important;
}
.IconContent {
  width: 100%;
  min-height: 200px;
  height: auto;
  .cell {
    display: inline-block;
    box-sizing: border-box;
    width: 25%;
    height: 100px;
    padding: 20px;
    padding-left: 10px;
    text-align: center;
  }
  .IconImg {
    border-radius: 50%;
    font-size: 25px;
    padding: 10px;
    color: #fff;
    // background: #00dfff;
  }
  p {
    font-size: 12px;
    padding-top: 3px;
  }
}
</style>
