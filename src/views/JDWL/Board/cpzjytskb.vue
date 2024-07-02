// 成品纸经营态势看板
<template>
  <el-scrollbar :height="windowHeight">
    <el-row class="query board-bg" :gutter="10">
      <el-col span=".5">
        <el-select v-model="PKGROUP" clearable>
          <el-option v-for="item in ORGList" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
        </el-select>
      </el-col>
      <el-col span=".5">
        <el-date-picker v-model="YEAR" type="year" value-format="YYYY" />
      </el-col>
    </el-row>
    <div class="board board-flex">
      <div class="board-item board-bg" style="width:40%">
        <div class="board-flex board-flex-sb">
          <div class="title">发货量</div>
          <div class="select board-flex ">
            <label for="">
              片区: <el-select v-model="PKAREA" style="width:100px">
                <el-option v-for="item in areaList" :key="item.BILLNO" :value="item.VALUE" :label="item.LABEL"></el-option>
              </el-select>
            </label>
            <label for="">
              物料: <el-select v-model="PKMTERA" style="width:100px">
                <el-option v-for="item in WLData" :key="item.BILLNO" :value="item.VALUE" :label="item.LABEL"></el-option>
              </el-select>
            </label>
          </div>
        </div>
        <div class="board-item">
          <div id="FHL" class="charts"></div>
        </div>
      </div>
      <div class="board-item board-bg" style="width:60%">
        <div class="board-flex board-flex-sb">
          <div class="title">营收指标</div>
          <div class="select">
            <label for="">
              片区: <el-select v-model="PKAREA" style="width:100px">
                <el-option v-for="item in areaList" :key="item.BILLNO" :value="item.VALUE" :label="item.LABEL"></el-option>
              </el-select>
            </label>
            <label for="">
              物料: <el-select v-model="PKMTERA" style="width:100px">
                <el-option v-for="item in WLData" :key="item.BILLNO" :value="item.VALUE" :label="item.LABEL"></el-option>
              </el-select>
            </label>
          </div>
        </div>
        <div class="board-item">
          <div id="YSZB" class="charts"></div>
        </div>
      </div>
    </div>
    <div class="board board-flex">
      <div class="board-item board-bg" style="width:65%">
        <div class="title">费用</div>
        <div class="board-flex">
          <div class="board-item">
            <div id="FYPie" class="charts"></div>
          </div>
          <div class="board-item">
            <div id="FYLine" class="charts"></div>
          </div>
        </div>
      </div>
      <div class="board-item board-bg" style="width:35%">
        <div class="title">净利率</div>
        <div class="board-item">
          <div id="JLR" class="charts"></div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import * as echarts from "echarts";
import { getORG, getAreaData, getWL, CpzFHL, CpzYSZB, CpzFYPie, CpzFYLine, CpzJLR } from "#/JDWL/Board/cpzjytskb"
import { watch } from "vue";
const { proxy } = getCurrentInstance();
const windowHeight = computed(() => (window.innerHeight - 120))

const { TASKTYPE } = proxy.useDict("TASKTYPE")
const PKGROUP = ref("")
const YEAR = ref(`${new Date().getFullYear()}`)
const PKMTERA = ref("")
const PKAREA = ref("")
const queryParams = computed(() => {
  return {
    PK_GROUP: PKGROUP.value,
    YEAR: YEAR.value,
  }
})

// 组织
const ORGList = ref([])
const getORGList = (init = false) => {
  getORG().then(res => {
    ORGList.value = res.RESULT
    if (init) PKGROUP.value = res.RESULT[0].VALUE
  })
}
getORGList(true)

/** 片区 */
const areaList = ref([])
const getArea = (word) => {
  getAreaData({
    KEYWORD: word
  }).then(res => {
    areaList.value = [{ LABEL: "全部", VALUE: "" }, ...res.RESULT]
  })
}
getArea()

// 物料
const WLData = ref({})
const getWLList = () => {
  getWL().then(res => {
    WLData.value = [{ LABEL: "全部", VALUE: "" }, ...res.RESULT]
  })
}
getWLList()

// 发货量
const FHLData = ref({})
const initFHL = () => {
  const options = {
    tooltip: {
      trigger: 'axis',
      formatter: val => {
        return `${val[0].data.month}月 <br/>
        发货量: ${val[0].data['发货量']}吨 <br/>
        同比: ${val[0].data.tb} <br/>
        环比: ${val[0].data.hb}`
      }
    },
    legend: {
      left: 'center'
    },
    grid: {
      left: '30',
      right: '20px',
      bottom: '10px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    dataset: FHLData.value,
    series: [{ type: "line" }]
  }
  let chart = echarts.init(document.getElementById("FHL"));
  chart.setOption(options)
}
const getFHLData = () => {
  CpzFHL(queryParams.value).then(res => {
    FHLData.value = res.RESULT
    initFHL()
  })
}

// 营收指标
const YSZBData = ref({})
const initYSZB = () => {
  const options = {
    tooltip: {
      trigger: 'axis',
      formatter: val => {
        return `${val[0].data.month}月 <br/>
        收入: ${val[0].data['应收']}元 <br/>
        支出: ${val[0].data['应付']}元 <br/>
        毛利润: ${val[0].data['毛利润']}元 <br/>
        毛利率: ${val[0].data['毛利率']}% <br/>
        同比: ${val[0].data.tb} <br/>
        环比: ${val[0].data.hb}`
      }
    },
    legend: {
      left: 'center'
    },
    grid: {
      left: '30',
      right: '20px',
      bottom: '10px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    dataset: YSZBData.value,
    series: [{ type: "bar" }, { type: "bar" }, { type: "line" }, { type: "line" }]
  }
  let chart = echarts.init(document.getElementById("YSZB"));
  chart.setOption(options)
}
const getYSZBData = () => {
  CpzYSZB(queryParams.value).then(res => {
    YSZBData.value = res.RESULT
    initYSZB()
  })
}

// 费用
const FYPieData = ref({})
const initFYPie = () => {
  const options = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '10',
      left: 'center'
    },
    grid: {
      left: '30',
      right: '10',
      bottom: '10',
      containLabel: true
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    dataset: FYPieData.value,
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      label: {
        show: false,
        position: 'center',
        formatter: '{b}\n{d}%',
        fontSize: 12
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
    }]
  }
  let chart = echarts.init(document.getElementById("FYPie"));
  chart.setOption(options)
  chart.on("mouseover", res => {
    console.log("🚀 ~ initFYPie ~ res:", res)
    getFYLineData(res.data)
  })
  getFYLineData()
}
const getFYPieData = () => {
  CpzFYPie(queryParams.value).then(res => {
    console.log("🚀 ~ CpzFYPie ~ 费用Pie:", res)
    FYPieData.value = res.RESULT
    initFYPie()
  })
}
const FYLineData = ref({})
const initFYLine = () => {
  const options = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      left: 'center'
    },
    grid: {
      left: '30',
      right: '20px',
      bottom: '10px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    dataset: FYLineData.value,
    series: [{ type: "line" }]
  }
  let chart = echarts.init(document.getElementById("FYLine"));
  chart.setOption(options)
}
const lastPies = ref({})
const getFYLineData = (res) => {
  if (!res) res = FYPieData.value.source[0]
  if (lastPies.value.COST_TYPE == res.COST_TYPE) return
  lastPies.value = res
  CpzFYLine({ ...queryParams.value, COSTTYPE: lastPies.value.COST_TYPE }).then(res => {
    FYLineData.value = res.RESULT
    initFYLine()
  })
}

// 净利率
const JLRData = ref({})
const initJLR = () => {
  const options = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      left: 'center'
    },
    grid: {
      left: '30',
      right: '20px',
      bottom: '10px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    dataset: JLRData.value,
    series: [{ type: "line" }, { type: "line" }]
  }
  let chart = echarts.init(document.getElementById("JLR"));
  chart.setOption(options)
}
const getJLRData = () => {
  CpzJLR(queryParams.value).then(res => {
    console.log("🚀 ~ CpzJLR ~ res:", res)
    JLRData.value = res.RESULT
    initJLR()
  })
}

watch(queryParams, val => {
  getFHLData()
  getYSZBData()
  getFYPieData()
  getJLRData()
}, {
  immediate: true
})

watch(() => {
  return { PKAREA: PKAREA.value, PKMTERA: PKMTERA.value }
}, val => {
  getFHLData()
  getYSZBData()
})

</script>
<style lang="scss" scoped>
.board {
  .title {
    font-size: 16px;
  }
  &-bg {
    background: #fff;
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
    margin: 5px !important;
  }
  &-flex {
    display: flex;
    align-items: stretch;
    &-sb {
      justify-content: space-between;
    }
  }
  &-item {
    width: 100%;
    margin: 2px 5px;
  }
}
.charts {
  height: 375px;
}
.w25 {
  width: 25%;
}
.list-item {
  position: relative;
  padding-left: 20px;
  .no {
    position: absolute;
    left: 5px;
    top: 5px;
  }
  .title {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>