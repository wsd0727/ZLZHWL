// 太阳项目经营看板
<template>
  <el-scrollbar :height="windowHeight">
    <el-row class="query board-bg" :gutter="10">
      <el-col span=".5">
        <el-select v-model="PKMATER" clearable>
          <el-option v-for="item in MATERLIST" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
        </el-select>
      </el-col>
      <el-col span=".5">
        <el-date-picker v-model="YEAR" type="year" value-format="YYYY" />
      </el-col>
    </el-row>

    <div class="board board-flex">
      <div class="board-item board-bg">
        <div class="title board-flex board-flex-sb">
          <div class="title">发货量</div>
          <div class="desc">总发货量：999吨</div>
        </div>
        <div class="charts" id="FHL"></div>
      </div>
      <div class="board-item board-bg">
        <div class="title board-flex board-flex-sb">
          <div class="title">营业额</div>
          <div class="desc">总金额：999元</div>
        </div>
        <div class="charts" id="YYE"></div>
      </div>
      <div class="board-item board-bg">
        <div class="title board-flex board-flex-sb">
          <div class="title">毛利润</div>
          <div class="desc">毛利润：999元</div>
        </div>
        <div class="charts" id="MLR"></div>
      </div>
    </div>
    <div class="board board-flex">
      <div class="board-item board-bg board-flex">
        <div class="board-item">
          <div class="title board-flex board-flex-sb">
            <div class="title">失败成本</div>
            <div class="desc">总成本：999元</div>
          </div>
          <div class="charts" id="SBCB"></div>
        </div>
        <!-- <div class="board-item">
          <div class="title board-flex board-flex-sb">
            <div class="title">结算模式</div>
            <div class="desc">选择年月日</div>
          </div>
          <div class="charts" id="JSMS"></div>
        </div> -->
      </div>
      <div class="board-item board-bg" style="width:50%">
        <div class="title">成本监控</div>
        <div class="charts">
          <miniTable :data="CBJKDATA" height="380px">
            <vxe-column type="seq" title="序号" width="50" align="center" show-overflow="tooltip" />
            <vxe-column field="ODTIME" title="发货日期" width="150" align="center" show-overflow="tooltip" />
            <vxe-column field="LSZDPSN" title="配载人" width="80" align="center" show-overflow="tooltip" />
            <vxe-column field="LINENAME" title="线路" width="150" align="left" show-overflow="tooltip" />
            <vxe-column field="RECEIVEADDRESS" title="目的地" width="150" align="center" show-overflow="tooltip" />
            <vxe-column field="CAR_PRICE" title="基础运价" width="80" align="left" show-overflow="tooltip" />
            <vxe-column field="BALATYPE" title="结算方式" width="100" align="center" show-overflow="tooltip">
              <template #default="{row}">
                <span>{{ selectDictLabel(BALATYPE,row.BALATYPE) }}</span>
              </template>
            </vxe-column>
            <vxe-column field="RECEIPTCARPRICE" title="历史运价" width="80" align="left" show-overflow="tooltip" />
            <vxe-column field="YC" title="异常值" width="80" align="left" show-overflow="tooltip" />
          </miniTable>
        </div>
      </div>
    </div>

  </el-scrollbar>
</template>

<script setup>
import * as echarts from "echarts";
import miniTable from "@/components/Tables/mini"
import { getTYPES, getFHL, getYYE, getMLL, getSBCB, getJYMS, getCBJK } from "@/api/JDWL/Board/tyxmjykb"

const { proxy } = getCurrentInstance();
const windowHeight = computed(() => (window.innerHeight - 120))
const { BALATYPE } = proxy.useDict("BALATYPE")

const YEAR = ref(`${new Date().getFullYear()}`)
const PKMATER = ref("")
const queryParams = computed(() => {
  return {
    YEAR: YEAR.value,
    PROJECTBILLNO: PKMATER.value
  }
})

const MATERLIST = ref([])
const getMaterList = (init = false) => {
  getTYPES().then(res => {
    MATERLIST.value = res.RESULT
    if (init) PKMATER.value = MATERLIST.value[0].VALUE
  })
}
getMaterList(true)

// 发货量
const FHLDATA = ref({})
const initFHL = () => {
  const options = {
    tooltip: {
      trigger: 'axis'
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
    dataset: FHLDATA.value,
    series: [{ type: 'line' }]
  }
  let chart = echarts.init(document.getElementById("FHL"));
  chart.setOption(options)
}
const getFHLDATA = () => {
  getFHL(queryParams.value).then(res => {
    FHLDATA.value = res.RESULT
    initFHL()
  })
}

// 营业额
const YYEDATA = ref({})
const initYYE = () => {
  const options = {
    tooltip: {
      trigger: 'axis'
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
    dataset: YYEDATA.value,
    series: [{ type: 'line' }]
  }
  let chart = echarts.init(document.getElementById("YYE"));
  chart.setOption(options)
}
const getYYEDATA = () => {
  getYYE(queryParams.value).then(res => {
    YYEDATA.value = res.RESULT
    initYYE()
  })
}

// 毛利润
const MLRDATA = ref({})
const initMLR = () => {
  const options = {
    tooltip: {
      trigger: 'axis'
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
    dataset: MLRDATA.value,
    series: [{ type: 'line' }]
  }
  let chart = echarts.init(document.getElementById("MLR"));
  chart.setOption(options)
}
const getMLRDATA = () => {
  getMLL(queryParams.value).then(res => {
    MLRDATA.value = res.RESULT
    initMLR()
  })
}

// 失败成本
const SBCBDATA = ref({})
const initSBCB = () => {
  const options = {
    tooltip: {
      trigger: 'axis'
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
    dataset: SBCBDATA.value,
    series: [{ type: 'bar', stack: 'car', }, { type: 'bar', stack: 'car', }, { type: 'bar', stack: 'car', }, { type: 'bar', stack: 'car', }]
  }
  let chart = echarts.init(document.getElementById("SBCB"));
  chart.setOption(options)
}
const getSBCBDATA = () => {
  getSBCB(queryParams.value).then(res => {
    SBCBDATA.value = res.RESULT
    initSBCB()
  })
}

// 结算模式
const JSMSDATA = ref({})
const initJSMS = () => {
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
    dataset: JSMSDATA.value,
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
  let chart = echarts.init(document.getElementById("JSMS"));
  chart.setOption(options)
  // chart.on("mouseover", res => {
  //   console.log("🚀 ~ initAREA ~ res:", res)
  // })
}
const getJSMSDATA = () => {
  getJYMS({ ...queryParams.value, DATEARR: "" }).then(res => {
    JSMSDATA.value = res.RESULT
    initJSMS()
  })
}

// 成本监控
const CBJKDATA = ref([])
const getCBJMDATA = () => {
  getCBJK(queryParams.value).then(res => {
    CBJKDATA.value = res.RESULT
  })
}

watch(queryParams, val => {
  getFHLDATA()
  getYYEDATA()
  getMLRDATA()
  getSBCBDATA()
  // getJSMSDATA()
  getCBJMDATA()
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
  height: 380px;
}
</style>