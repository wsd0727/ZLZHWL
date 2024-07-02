// 运营-车辆运转看板
<template>
  <el-scrollbar :height="windowHeight">
    <div class="app-wrap">
      <div class="search">
        <div class="search-item">
          <div class="label">片区</div>
          <div class="value">
            <el-tree-select v-model="PK_AREA" size="default" check-strictly clearable filterable remote-show-suffix remote :remote-method="getArea" :data="areaList" @change="AreaChange" @clear="AreaChange" popper-class="popMaxWidth" :render-after-expand="false" :placeholder="' '" :props="{ label: 'LABEL', children: 'CHILDREN' , disabled: 'ISDISABLED', }" value-key="VALUE" highlightCurrent />
          </div>
        </div>
      </div>
      <div class="top">
        <div class="chart-item left">
          <div class="title">车辆状态</div>
          <div id="lineStatus" style="width: 100%;height: 250px;"></div>
        </div>
        <div class="chart-item center">
          <div class="title">车辆运输状态</div>
          <div id="carStatus" style="width: 100%;height: 250px;"></div>
        </div>
        <div class="chart-item right">
          <div class="title">拉运趟数Top10</div>
          <div id="top10" style="width: 100%;height: 250px;"></div>
        </div>
      </div>
      <div class="chart-item lyunqushi">
        <div class="title">拉运趋势</div>
        <div id="qushi" style="width: 100%;height: 470px;"></div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import * as echarts from "echarts";
let myEcharts = echarts;
import { deepClone } from "@/utils/index";
import { getAreaData, getTop10, getLYQS, getInLine, getCarStatus } from "@/api/JDWL/Board/clyzb"

const windowHeight = computed(() => (window.innerHeight - 120))

/** 片区 */
const PK_AREA = ref("")
const areaList = ref([])
const getArea = (word) => {
  getAreaData({
    KEYWORD: word
  }).then(res => {
    areaList.value = [...res.RESULT]
    PK_AREA.value = res.RESULT[0].VALUE
  })
}
getArea()

/** 车辆状态 */
const CLZTData = ref([])
const getCLZT = () => {
  getInLine({
    PK_AREA: PK_AREA.value,
  }).then(res => {
    CLZTData.value = res.RESULT
    InitCLZT()
  })
}
const InitCLZT = () => {
  let option = {
    tooltip: {
      trigger: 'item'
    },
    color: ["#ADDE8B", "#EE7975"],
    series: [
      {
        name: '车辆状态',
        type: 'pie',
        radius: '65%',
        data: [
          { value: CLZTData.value.ONLINE, name: '在线' },
          { value: CLZTData.value.OFFLINE, name: '离线' },
        ],
        label: {
          fontSize: 14,
          show: true,
          position: 'inner', // 数值显示在内部
          formatter: '{b} \n {c}', // 格式化数值百分比输出
        },
      }
    ]
  }
  let chart = myEcharts.init(document.getElementById("lineStatus"));
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}

/** 车辆运输状态 */
const CLYSZDDATA = ref([])
const getCLYS = () => {
  getCarStatus({
    PK_AREA: PK_AREA.value,
  }).then(res => {
    CLYSZDDATA.value = res.RESULT
    InitCLYS()
  })
}
const InitCLYS = () => {
  let { WAIT_SEND = 0, SEND = 0, IDLE = 0, ERR = 0, RETURN_TRIP = 0 } = CLYSZDDATA.value
  let option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '运输状态',
        type: 'pie',
        radius: '65%',
        data: [
          { value: IDLE, name: '空闲' },
          { value: SEND, name: '运输中' },
          { value: ERR, name: '异常' },
          { value: WAIT_SEND, name: '待发货' },
          { value: RETURN_TRIP, name: '回程' },
        ],
        label: {
          fontSize: 14,
          show: true,
          formatter: '{b}\n {d}%', // 格式化数值百分比输出
        },
      }
    ]
  }
  let chart = myEcharts.init(document.getElementById("carStatus"), "shine");
  chart.setOption(option)
  // 大小自适应窗口大小变化
  window.onresize = function () {
    // 重置容器高宽
    chart.resize();
  };
}

/** top10 */
const TOP10Data = ref([])
const getTop10Data = () => {
  getTop10({
    PK_AREA: PK_AREA.value,
    SORT: "1",
    DATE: "2023-12-01",
  }).then(res => {
    TOP10Data.value = res.RESULT
    InitTop10()
  })
}
const InitTop10 = () => {
  let options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: "1%",
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
      inverse: true,
      data: TOP10Data.value.map(el => el.OWNER)
    },
    series: [
      {
        name: '拉运趟数',
        type: 'bar',
        data: TOP10Data.value.map(el => Number(el.COUNT)),
        label: {
          show: true,
          position: "insideRight", // 数值显示在内部
          formatter: '{c}趟', // 格式化数值百分比输出
        },
      }
    ]
  }
  let chart = myEcharts.init(document.getElementById("top10"), "shine");
  chart.setOption(options)
  // 大小自适应窗口大小变化
  window.onresize = function () {
    // 重置容器高宽
    chart.resize();
  };
}

/** 拉运趋势 */
const LYQSDATA = ref([])
const getLYQSData = () => {
  getLYQS({
    PK_AREA: PK_AREA.value,
    DATE: "2023-12-01",
  }).then(res => {
    LYQSDATA.value = res.RESULT
    InitLYQS()
  })
}
/** 补全12个月数据 */
const mapData = (data) => {
  let deepData = deepClone(data)
  let month = data.map(el => el.MONTH)
  let newData = []
  for (let i = 0; i < 12; i++) {
    const el = i + 1;
    let Sel = String(el);
    if (month.includes(Sel)) {
      let hasData = deepData.find(al => al.MONTH == el)
      hasData.value = hasData.COUNT
      newData.push(hasData)
    } else {
      let margeData = deepClone(deepData[0])
      margeData.COUNT = 0
      margeData.MONTH = Sel
      margeData.value = 0
      newData.push(margeData)
    }
  }
  return newData
}
const InitLYQS = () => {
  let series = []
  for (let i = 0; i < LYQSDATA.value.length; i++) {
    const el = LYQSDATA.value[i];
    let monthDATA = mapData(el.SUB_LIST)
    series.push({
      name: el.OWNER,
      data: monthDATA,
      type: 'line'
    })
  }
  let option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: series.map(el => el.name)
    },
    xAxis: {
      name: "月份",
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      name: "趟数",
      type: 'value'
    },
    series: series
  };
  let chart = myEcharts.init(document.getElementById("qushi"), "shine");
  chart.clear()
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}

watch(PK_AREA, val => {
  if (val == '') return
  getTop10Data()
  getLYQSData()
  getCLZT()
  getCLYS()
}, {
  immediate: true
})

</script>
<style lang="scss" scoped>
.app-wrap {
  height: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  .bg-white {
    border-radius: 4px;
  }
  .padding-8 {
    padding: 8px;
  }
  .query-wrap {
    margin: 8px 0;
    // margin-bottom: 6px !important;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .tool-wrap {
    padding-bottom: 8px;
  }
  .page-fixe-bottom {
    position: fixed !important;
    z-index: 10;
    bottom: 10px;
    right: 30px !important;
    height: 34px !important;
  }
}
.search {
  background: #fff;
  padding: 10px;
  &-item {
    display: flex;
    align-items: center;
    .label {
      font-size: 16px;
      margin-right: 10px;
    }
  }
}
.top {
  width: 100%;
  padding-top: 10px;
  height: 300px;
  min-width: 1100px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin-bottom: 10px;
  .left,
  .center,
  .right {
    width: calc((100% - 20px) / 3);
    padding: 10rpx;
  }
}
.chart-item {
  padding: 10px;
  background: #fff;
  .title {
    padding-left: 10px;
    font-size: 18px;
    font-weight: 700;
    color: #272727;
    position: relative;
    &::before {
      position: absolute;
      top: 3px;
      left: 0;
      content: "";
      width: 5px;
      height: 18px;
      background: #1964f8;
      border-radius: 3px;
      margin-right: 5px;
    }
  }
}
</style>