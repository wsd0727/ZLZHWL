// 太阳事业部经营看板
<template>
  <el-scrollbar :height="windowHeight">
    <el-row class="query board-bg" :gutter="10">
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
      <div class="board-item board-bg" style="width:33%">
        <div class="title board-flex board-flex-sb">
          <div class="title">逾期借款</div>
          <div class="desc">
            <el-date-picker v-model="JKTIME" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" @change="getYQJKDATA" />
          </div>
        </div>
        <div class="charts">
          <miniTable :data="YQJKDATA" height="380px">
            <vxe-column type="seq" title="序号" width="50" align="center" show-overflow="tooltip" />
            <vxe-column field="OWNER_NAME" title="车辆管理人" width="100" align="center" show-overflow="tooltip" />
            <vxe-column field="OWNER_TEL" title="电话" width="80" align="center" show-overflow="tooltip" />
            <vxe-column field="TOTAL" title="本息合计" width="100" align="left" show-overflow="tooltip" />
            <vxe-column field="CYCLE" title="还款月份" width="100" align="center" show-overflow="tooltip" />
            <vxe-column field="PAY_CURRENT" title="当月应还" width="80" align="left" show-overflow="tooltip" />
          </miniTable>
        </div>
      </div>
      <div class="board-item board-bg">
        <div class="title board-flex board-flex-sb">
          <div class="title">大额货损</div>
          <div class="desc">毛利润：999元</div>
        </div>
        <div class="charts" id="DEHS"></div>
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
import { getFHL, getYQJK, getDEHS, getSBCB, getJYMS, getCBJK } from "@/api/JDWL/Board/tysybjykb"
import { GetDateAfter } from "@/utils"

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

// 逾期借款
const JKTIME = ref([GetDateAfter(-30), GetDateAfter()])
const YQJKDATA = ref({})
const getYQJKDATA = () => {
  getYQJK({ ...queryParams.value, DATEARR: JKTIME.value.join(",") }).then(res => {
    YQJKDATA.value = res.RESULT
  })
}

// 大额货损
const DEHSDATA = ref({})
const initDEHS = () => {
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
    dataset: DEHSDATA.value,
    series: [{ type: 'line' }]
  }
  let chart = echarts.init(document.getElementById("DEHS"));
  chart.setOption(options)
}
const getDEHSDATA = () => {
  getDEHS(queryParams.value).then(res => {
    DEHSDATA.value = res.RESULT
    initDEHS()
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
  getYQJKDATA()
  getDEHSDATA()
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