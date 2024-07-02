// 损纸单看板
<template>
  <el-scrollbar :height="windowHeight">
    <el-row class="query board-bg" :gutter="10">
      <el-col span=".5">
        <el-select v-model="PKGROUP" clearable>
          <el-option v-for="item in ORGList" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
        </el-select>
      </el-col>
      <el-col span=".5">
        <el-select v-model="TASK" clearable>
          <el-option v-for="item in TASKTYPE" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
        </el-select>
      </el-col>
      <el-col span=".5">
        <el-date-picker v-model="YEAR" type="year" value-format="YYYY" />
      </el-col>
    </el-row>

    <div class="board board-bg">
      <div class="title">损纸数量</div>
      <div class="board-flex">
        <div class="board-item">
          <div id="SZNUMS" class="charts"></div>
        </div>
        <div class="board-item">
          <miniTable :data="SZNUMSTab" height="250px">
            <vxe-column field="AREA" title="片区" width="100" align="center" show-overflow="tooltip" />
            <vxe-column field="m1" title="1月" width="60" align="center" show-overflow="tooltip" />
            <vxe-column field="m2" title="2月" width="60" align="center" show-overflow="tooltip" />
            <vxe-column field="m3" title="3月" width="60" align="center" show-overflow="tooltip" />
            <vxe-column field="m4" title="4月" width="60" align="center" show-overflow="tooltip" />
            <vxe-column field="m5" title="5月" width="60" align="center" show-overflow="tooltip" />
            <vxe-column field="m6" title="6月" width="60" align="center" show-overflow="tooltip" />
            <vxe-column field="m7" title="7月" width="60" align="center" show-overflow="tooltip" />
            <vxe-column field="m8" title="8月" width="60" align="center" show-overflow="tooltip" />
            <vxe-column field="m9" title="9月" width="60" align="center" show-overflow="tooltip" />
            <vxe-column field="m10" title="10月" width="60" align="center" show-overflow="tooltip" />
            <vxe-column field="m11" title="11月" width="60" align="center" show-overflow="tooltip" />
            <vxe-column field="m12" title="12月" width="60" align="center" show-overflow="tooltip" />
            <vxe-column field="TOTAL" title="合计(吨)" width="100" align="center" show-overflow="tooltip" />
          </miniTable>
        </div>
      </div>
    </div>
    <div class="board board-flex">
      <div class="board-item board-bg">
        <div class="title board-flex" style="justify-content: space-between;">
          <span>损纸金额</span>
          <span>总金额：{{SZPRICES.ALL}}元 同期比：{{SZPRICES.ALLRIGT}} </span>
        </div>
        <div id="SZPRICES" class="charts"></div>
      </div>
      <div class="board-item board-bg">
        <div class="board-flex">
          <div class="title">到达地占比</div>
          <el-date-picker v-model="DDDMONTH" type="month" value-format="MM" @change="DDDMONTHChange" />
        </div>
        <div class="board-flex">
          <div class="board-item">
            <!-- 到达地占比 -->
            <div id="DDDZB" class="charts"></div>
          </div>
          <div class="board-item">
            <!-- 损纸类型占比 -->
            <div id="DDDTYPE" class="charts"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="board board-flex" style="width:100%">
      <div class="board-item board-bg" style="width:40%">
        <div class="title">客户占比</div>
        <!-- 客户占比 -->
        <el-scrollbar height="237px">
          <div class="list-item" v-for="(item,index) in KHZBDATA" :key="index">
            <div class="no">{{ index+1 }}</div>
            <div class="title">{{item.CUSTOMER}}</div>
            <div class="gress"><el-progress :percentage="item.A" :format="()=>item.A+'%'" /></div>
          </div>
        </el-scrollbar>
      </div>
      <div class="board-item board-bg" style="width:60%">
        <div class="title">大额损纸</div>
        <!-- 大额损纸 -->
        <div id="DESZ">
          <miniTable :data="DESZDATA" height="250px">
            <vxe-column field="CARRIER" title="承运商" width="100" align="left" show-overflow="tooltip" />
            <vxe-column field="CARNO_TRAN" title="承运车号" width="100" align="center" show-overflow="tooltip" />
            <vxe-column field="OUT_DATE" title="出库日期" width="100" align="center" show-overflow="tooltip" />
            <vxe-column field="OUT_NO" title="出库单号" width="160" align="center" show-overflow="tooltip" />
            <vxe-column field="CUSTOMER" title="收货客户" width="100" align="left" show-overflow="tooltip" />
            <vxe-column field="AREA" title="片区" width="100" align="center" show-overflow="tooltip" />
            <vxe-column field="WEIGHT" title="出库重量" width="100" align="center" show-overflow="tooltip" />
            <vxe-column field="TYPE" title="损纸类别" width="100" align="center" show-overflow="tooltip" />
            <vxe-column field="DEMWEIGHT" title="损纸重量" width="100" align="center" show-overflow="tooltip" />
            <vxe-column field="MONEY" title="损纸金额" width="100" align="center" show-overflow="tooltip" />
          </miniTable>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import * as echarts from "echarts";
import miniTable from "@/components/Tables/mini"
import { getORG, SzNums, SzPrices, SzDDD, SzDDDTYPES, SzKhzb, SzDESZ } from "#/JDWL/Board/szdkb"
const { proxy } = getCurrentInstance();
const windowHeight = computed(() => (window.innerHeight - 120))

const { TASKTYPE } = proxy.useDict("TASKTYPE")
const PKGROUP = ref("")
const YEAR = ref(`${new Date().getFullYear()}`)
const TASK = ref("1")
const queryParams = computed(() => {
  return {
    PK_GROUP: PKGROUP.value,
    YEAR: YEAR.value,
    TASKTYPE: TASK.value
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

// 损纸数量
const SZNUMS = ref({})
const SZNUMSTab = ref([])
const initSZNUMS = () => {
  const series = []
  for (let i = 0; i < SZNUMS.value.dimensions.length - 1; i++) {
    series.push({ type: 'line', smooth: true })
  }
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
    dataset: SZNUMS.value,
    series
  }
  let chart = echarts.init(document.getElementById("SZNUMS"));
  chart.setOption(options)
}
const setTABLEDATA = () => {
  let arr = []
  for (let i = 0; i < SZNUMS.value.dimensions.length; i++) {
    if (i == '0') continue
    const el = SZNUMS.value.dimensions[i];
    let list = [SZNUMS.value.source[1][i] * 1, SZNUMS.value.source[2][i] * 1,
    SZNUMS.value.source[3][i] * 1, SZNUMS.value.source[4][i] * 1,
    SZNUMS.value.source[5][i] * 1, SZNUMS.value.source[6][i] * 1,
    SZNUMS.value.source[7][i] * 1, SZNUMS.value.source[8][i] * 1,
    SZNUMS.value.source[9][i] * 1, SZNUMS.value.source[10][i] * 1,
    SZNUMS.value.source[11][i] * 1, SZNUMS.value.source[12][i] * 1,]
    let total = list.reduce((a, b) => a + b, 0)
    arr.push
    arr.push({
      AREA: el,
      m1: list[0],
      m2: list[1],
      m3: list[2],
      m4: list[3],
      m5: list[4],
      m6: list[5],
      m7: list[6],
      m8: list[7],
      m9: list[8],
      m10: list[9],
      m11: list[10],
      m12: list[11],
      TOTAL: total.toFixed(3)
    })
  }
  SZNUMSTab.value = arr
}
const getSZNUMS = () => {
  SzNums({
    ...queryParams.value
  }).then(res => {
    SZNUMS.value = res.RESULT
    initSZNUMS()
    setTABLEDATA()
  })
}

// 损纸金额
const SZPRICES = ref({})
const initSZPRICES = () => {
  const options = {
    tooltip: {
      trigger: 'axis',
      formatter: val => {
        return `${val[0].data.month} <br/>
        金额:${val[0].data.MONEY}元 <br/>
        占比:${val[0].data.zb}`
      }
    },
    grid: {
      left: '30',
      right: '10px',
      bottom: '10px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    dataset: SZPRICES.value,
    series: [{
      type: 'bar',
      label: {
        show: true,
        position: 'top',
        formatter: val => {
          if (val.data.MONEY > 0) return `${val.data.zb} \n ${val.data.MONEY}元`
          return `${val.data.MONEY}元`
        }
      },
    }]
  }
  let chart = echarts.init(document.getElementById("SZPRICES"));
  chart.setOption(options)
}
const getSZPRICES = () => {
  SzPrices({
    ...queryParams.value
  }).then(res => {
    SZPRICES.value = res.RESULT
    initSZPRICES()
  })
}

// 到达地占比
const DDDMONTH = ref(new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`)
const DDDZB = ref({})
const DDDTYPES = ref({})
const initDDDZB = () => {
  const options = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      type: "scroll",
    },
    grid: {
      top: '50',
      left: '30',
      right: '10',
      bottom: '0',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    dataset: DDDZB.value,
    series: [{
      type: 'pie',
      label: {
        formatter: "{b}:{d}%"
      }
    }]
  }
  let chart = echarts.init(document.getElementById("DDDZB"));
  chart.setOption(options)
  chart.on("mouseover", val => {
    getDDDTYPES(val.name)
  })
}
const initDDDTYPE = () => {
  const options = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '30',
      right: '10',
      bottom: '10',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    dataset: DDDTYPES.value,
    series: [{ type: 'bar' }]
  }
  let chart = echarts.init(document.getElementById("DDDTYPE"));
  chart.setOption(options)

}
const getDDDZB = () => {
  SzDDD({ ...queryParams.value, MONTH: DDDMONTH.value }).then(res => {
    DDDZB.value = res.RESULT
    initDDDZB()
    getDDDTYPES()
  })
}
const lastnaems = ref("")
const getDDDTYPES = (arae = '') => {
  if (!arae) arae = DDDZB.value.source[0].destination
  if (lastnaems.value == arae) return
  lastnaems.value = arae
  SzDDDTYPES({ ...queryParams.value, MONTH: DDDMONTH.value, DESTINATION: arae }).then(res => {
    DDDTYPES.value = res.RESULT
    initDDDTYPE()
  })
}
const DDDMONTHChange = (val) => {
  getDDDZB()
}

// 客户占比
const KHZBDATA = ref([])
const getKHZB = () => {
  SzKhzb({
    ...queryParams.value
  }).then(res => {
    KHZBDATA.value = res.RESULT
  })
}

// 大额损纸
const DESZDATA = ref([])
const getDESZDATA = () => {
  SzDESZ({
    ...queryParams.value
  }).then(res => {
    DESZDATA.value = res.RESULT
  })
}

watch(queryParams, val => {
  getSZNUMS()
  getSZPRICES()
  getDDDZB()
  // getDDDTYPES()
  getKHZB()
  getDESZDATA()
}, {
  immediate: true
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
  }
  &-item {
    width: 100%;
    margin: 2px 5px;
  }
}
.charts {
  height: 260px;
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