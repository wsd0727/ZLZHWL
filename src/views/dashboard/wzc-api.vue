<template>
  <div>
    <div class="cars-num">
      <v-chart
        :option="option0"
        autoresize
        :style="{ height: height + 'px' }"
      />
    </div>

    <div class="cars-num">
      <v-chart
        :option="option1"
        autoresize
        :style="{ height: height + 'px' }"
      />
    </div>
    <!-- filterable remote -->
    <div class="cars-num">
      <div class="select-wrap">
        <el-select
          v-model="compvalue"
          placeholder="请选择企业"
          :remote-method="remoteMethod"
          @change="selectEvent"
        >
          <el-option
            v-for="item in copOptions"
            :key="item.COMPANYID"
            :label="item.SHORTNAME"
            :value="item.COMPANYID"
          />
        </el-select>
      </div>

      <v-chart
        :option="option2"
        autoresize
        :style="{ height: height + 'px' }"
      />
    </div>
  </div>
</template>

<script setup name="">
import { getVchartData } from "#/dashboard/index";

const height = (window.innerHeight - 170) / 2;

const colors = ["#5470C6", "#91CC75", "#EE6666"];

const copOptions = ref([]);
const compvalue = ref("");

const option0 = ref({
  title: {
    text: "汇总统计",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {
    data: ["总车数", "总业务量"],
  },
  xAxis: {
    axisLabel: {
      interval: 0,
      rotate: 40,
    },
    data: [],
  },
  // yAxis:{},
  yAxis: [
    {
      type: "value",
      name: "总车数",
      // min: 0,
      // max: 100,
      axisLabel: {
        formatter: "{value} 车",
      },
    },
    {
      type: "value",
      name: "总业务量",
      // min: 0,
      // max: 5000,
      // interval: 10,
      axisLabel: {
        formatter: "{value} 吨",
      },
    },
  ],
  series: [
    // {
    //   name: "总车数",
    //   type: "bar",
    //   label: {
    //     show: true,
    //     position: "top",
    //   },
    //   data: [100, 200, 300, 320, 350],
    // },
    // {
    //   name: "总业务量",
    //   type: "line",
    //   label: {
    //     show: true,
    //     position: "top",
    //   },
    //   data: [150, 260, 300, 180, 160],
    // },
  ],
});

const option1 = ref({
  title: {
    text: "实时统计",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {
    data: ["采购/车", "销售/车", "采购/吨", "销售/吨"],
  },
  xAxis: {
    axisLabel: {
      interval: 0,
      rotate: 40,
    },
    data: ["A企业", "B企业", "C企业", "D企业", "F企业"],
  },
  yAxis: [
    {
      type: "value",
      name: "车数",
      // min: 0,
      // max: 250,
      axisLabel: {
        formatter: "{value} 车",
      },
    },
    {
      type: "value",
      name: "吨数",
      // min: 0,
      // max: 5000,
      // interval: 10,
      axisLabel: {
        formatter: "{value} 吨",
      },
    },
  ],
  series: [
    {
      name: "采购/车",
      type: "bar",
      // label: {
      //   show: true,
      //   position: "top",
      // },
      tooltip: {
        valueFormatter: function (value) {
          return value + " 车";
        },
      },
      data: [
        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,
      ],
    },
    {
      name: "销售/车",
      type: "bar",
      tooltip: {
        valueFormatter: function (value) {
          return value + " 车";
        },
      },
      data: [
        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,
      ],
    },
    {
      name: "采购/吨",
      type: "line",
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + " 吨";
        },
      },
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
    },
    {
      name: "销售/吨",
      type: "line",
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + " 吨";
        },
      },
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
    },
  ],
});

const option2 = ref({
  title: {
    text: "物料统计",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {
    data: ["全部"],
  },
  xAxis: {
    axisLabel: {
      interval: 0,
      rotate: 40,
    },
    data: ["A企业", "B企业", "C企业", "D企业", "F企业"],
  },
  yAxis: [
    {
      type: "value",
      name: "吨数",
      // min: 0,
      // max: 250,
    },
  ],
  series: [
    {
      name: "采购",
      type: "bar",
      // label: {
      //   show: true,
      //   position: "top",
      // },
      data: [100, 200, 300, 320, 350],
    },
  ],
});

getCarsNum();
// getMaterNum();
function getCarsNum() {
  let query = {
    STARTDATE: "2023-06-01",
    ENDDATE: "2025-06-23",
    XTYPE: "1", // 1-企业 2-车牌号 3- 物料
    YTYPE: "1", // 1-个数   2-吨数
    BUSSITYPE: "0", // 0-采购销售  1-采购 2-销售 3-总量
    SORTNAME: "",
    REVERSE: "",
    PARENTPAGE: "",
    COMPANYID: "",
  };
  getVchartData("/eosZnWeight/statistics", query).then((res) => {
    let { X, Y } = res.RESULT;
    option1.value.xAxis.data = X;

    let maxNumArr = [];
    // 处理车数
    let newArr = Y.map((i) => {
      i.name = i.name == "采购" ? "采购/车" : "销售/车";
      // i.label = {
      //   show: true,
      //   position: "top",
      // };
      i.tooltip = {
        valueFormatter: function (value) {
          return value + " 车";
        },
      };
      i.itemStyle = {
        normal: {
          barWidth: 10, // 设置柱子宽度为30
        },
      };
      maxNumArr.push(Math.max(...i.data));
      return i;
    });
    option1.value.series = newArr;
    // option1.value.yAxis[0].max =  Math.max(...maxNumArr)
    getWightNum();
  });
}

function getWightNum() {
  let query = {
    STARTDATE: "2023-06-01",
    ENDDATE: "2025-06-23",
    XTYPE: "1", // 1-企业 2-车牌号 3- 物料
    YTYPE: "2", // 1-个数   2-吨数
    BUSSITYPE: "0", // 0-采购销售  1-采购 2-销售 3-总量
    SORTNAME: "",
    REVERSE: "",
    PARENTPAGE: "",
    COMPANYID: "",
  };
  getVchartData("/eosZnWeight/statistics", query).then((res) => {
    let { Y } = res.RESULT;
    let maxNumArr = [];

    // 处理车数
    let newArr = Y.map((i) => {
      i.type = "line";
      i.name = i.name == "采购" ? "采购/吨" : "销售/吨";
      // i.label = {
      //   show: true,
      //   position: "top",
      // };
      i.tooltip = {
        valueFormatter: function (value) {
          return value + " 吨";
        },
      };
      maxNumArr.push(Math.max(...i.data));
      option1.value.series.push(i);
      return i;
    });
    // option1.value.yAxis[1].max =  Math.max(...maxNumArr)
  });
}

// 获取物料
function getMaterNum(compKey) {
  let query = {
    STARTDATE: "2023-06-01",
    ENDDATE: "2025-06-23",
    XTYPE: "3", // 1-企业 2-车牌号 3- 物料
    YTYPE: "2", // 1-个数   2-吨数  3 总车数 和总业务量
    BUSSITYPE: "3", // 0-采购销售  1-采购 2-销售 3-总量
    SORTNAME: "",
    REVERSE: "",
    PARENTPAGE: "",
    COMPANYID: compKey || "",
  };
  getVchartData("/eosZnWeight/statistics", query).then((res) => {
    let { X, Y } = res.RESULT;

    let newArr = Y.map((i) => {
      // i.label = {
      //   show: true,
      //   position: "top",
      // };
      i.tooltip = {
        valueFormatter: function (value) {
          return value + " 吨";
        },
      };
      return i;
    });

    option2.value.xAxis.data = X;
    option2.value.series = newArr;
  });
}

function selectEvent(v) {
  getMaterNum(v);
}

remoteMethod("");
function remoteMethod(key) {
  let query = { KEYWORD: key };
  getVchartData("/eosZnCompany/getCompany", query).then((res) => {
    copOptions.value = res.RESULT;
    if (!key) {
      compvalue.value = res.RESULT[0].COMPANYID;
      getMaterNum(res.RESULT[0].COMPANYID);
    }
  });
}

getAllCount();
// 获取汇总的数据  总车数  总业务量
function getAllCount() {
  let query = {
    STARTDATE: "2023-06-01",
    ENDDATE: "2025-06-23",
    XTYPE: "1", // 1-企业 2-车牌号 3- 物料
    YTYPE: "3", // 1-个数   2-吨数  3 总车数 和总业务量
    BUSSITYPE: "3", // 0-采购销售  1-采购 2-销售 3-总量
    SORTNAME: "",
    REVERSE: "",
    PARENTPAGE: "",
    COMPANYID: "",
  };
  getVchartData("/eosZnWeight/statistics", query).then((res) => {
    let { X, Y } = res.RESULT;
    let cMax = null,
      nMax = null;
    option0.value.xAxis.data = X;

    console.log("all==", Y);
    let newArr = Y.map((i) => {
      if (i.name == "总车数") {
        i.type = "bar";
        i.yAxisIndex = 0;
        cMax = Math.max(...i.data);
      } else {
        i.type = "line";
        i.yAxisIndex = 1;

        nMax = Math.max(...i.data);
      }
      return i;
    });

    // option0.value.yAxis[0].max = cMax ;
    // option0.value.yAxis[1].max = nMax;
    option0.value.series = newArr;
    console.log(option0.value);

    // option0.value.yAxis[0].interval = Math.ceil( cMax / 4 ) ;
    // option0.value.yAxis[1].interval = Math.ceil( nMax / 4 ) ;
  });
}
</script>

<style scoped lang="scss">
.cars-num {
  margin-top: 20px;
}

.select-wrap {
  // float: right;
  display: flex;
  justify-content: end;
  margin-right: 30px;
}
</style>
