// 外部项目经营看板
<template>
  <el-scrollbar :height="windowHeight">
    <el-row class="query board-bg" :gutter="10">
      <el-col span=".5">
        <el-select v-model="PKPRO" clearable>
          <el-option v-for="item in WAYPROJECT" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
        </el-select>
      </el-col>
      <el-col span=".5">
        <el-date-picker v-model="YEAR" type="year" value-format="YYYY" />
      </el-col>
    </el-row>

    <div class="board board-flex">
      <div class="board-item board-bg">
        <div class="title board-flex board-flex-sb">
          <div class="title ">发货量</div>
          <div class="desc">总发货量：999吨</div>
        </div>
        <div class="charts" id="FHL"></div>
      </div>
      <div class="board-item board-bg">
        <div class="title board-flex board-flex-sb">
          <div class="title">营业额</div>
          <div class="desc">总金额：999吨</div>
        </div>
        <div class="charts" id="YYE"></div>
      </div>
      <div class="board-item board-bg">
        <div class="title board-flex board-flex-sb">
          <div class="title">毛利润</div>
          <div class="desc">毛利润：999吨</div>
        </div>
        <div class="charts" id="MLR"></div>
      </div>
    </div>

    <div class="board board-flex">
      <div class="board-item board-bg board-flex">
        <div class="board-item">
          <div class="title board-flex board-flex-sb">
            <div class="title">运力模式</div>
            <div class="desc">
              <el-date-picker v-model="YLMSTIME" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" @change="getYLMSDATA" style="width:210px" />
            </div>
          </div>
          <div class="charts" id="YLMS"></div>
        </div>
        <!-- <div class="board-item">
          <div class="title board-flex board-flex-sb">
            <div class="title">结算模式</div>
            <div class="desc">
              <el-date-picker v-model="JSMSTIME" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" @change="getJSMSDATA" style="width:210px" />
            </div>
          </div>
          <div class="charts" id="JSMS"></div>
        </div> -->
      </div>
      <div class="board-item board-bg" style="width:50%">
        <div class="title">成本监控</div>
        <div class="charts">
          <miniTable :data="CBJKDATA" height="260px">
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

    <div class="board board-flex">
      <div class="board-item board-bg" style="width:70%">
        <div class="title board-flex board-flex-sb">
          <div class="title">应收款</div>
          <div class="desc">
            <el-date-picker v-model="YSKTIME" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" @change="getYSKDATA" style="width:210px" />
          </div>
        </div>
        <div class="board-flex board-flex-sb charts">
          <div class="board-item num-item">
            <div class="title">本月回款</div>
            <div class="nums">{{ YSKDATA.BYHK }}</div>
            <div class="unit">元</div>
          </div>
          <div class="board-item num-item">
            <div class="title">累计占压资金</div>
            <div class="nums">{{ YSKDATA.LJZYZJ }}</div>
            <div class="unit">元</div>
          </div>
          <div class="board-item num-item">
            <div class="title">保证金</div>
            <div class="nums">{{ YSKDATA.BZJ }}</div>
            <div class="unit">元</div>
          </div>
          <div class="board-item num-item">
            <div class="title">已开票未到期</div>
            <div class="nums">{{ YSKDATA.YKPWDQ }}</div>
            <div class="unit">元</div>
          </div>
          <div class="board-item num-item">
            <div class="title">到期未付款</div>
            <div class="nums">{{ YSKDATA.DQWFK }}</div>
            <div class="unit">元</div>
          </div>
        </div>
      </div>
      <div class="board-item board-bg" style="width:30%">
        <div class="title board-flex board-flex-sb">
          <div class="title">合作性质</div>
          <div class="desc">
            <el-date-picker v-model="HZXZTIME" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" @change="getHZXZDATA" style="width:210px" />
          </div>
        </div>
        <div class="charts" id="HZXZ"></div>
      </div>
    </div>

  </el-scrollbar>
</template>

<script setup>
import * as echarts from "echarts";
import miniTable from "@/components/Tables/mini"
import { GetDateAfter } from "@/utils"
import { getFHL, getYYE, getMLR, getYLMS, getJSMS, getCBJK, getYSK, getHZXZ } from "@/api/JDWL/Board/wbxmjykb"

const { proxy } = getCurrentInstance();
const windowHeight = computed(() => (window.innerHeight - 120))
const { WAYPROJECT, BALATYPE } = proxy.useDict("WAYPROJECT", "BALATYPE")

const YEAR = ref(`${new Date().getFullYear()}`)
const PKPRO = ref()
const queryParams = computed(() => {
  return {
    YEAR: YEAR.value,
    PROJECTBILLNO: PKPRO.value
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
  getMLR(queryParams.value).then(res => {
    MLRDATA.value = res.RESULT
    initMLR()
  })
}

// 运力模式
const YLMSTIME = ref([GetDateAfter(-30), GetDateAfter()])
const YLMSDATA = ref({})
const initYLMS = () => {
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
    dataset: YLMSDATA.value,
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
  let chart = echarts.init(document.getElementById("YLMS"));
  chart.setOption(options)
}
const getYLMSDATA = () => {
  getYLMS({ ...queryParams.value, DATEARR: YLMSTIME.value.join(",") }).then(res => {
    YLMSDATA.value = res.RESULT
    initYLMS()
  })
}

// 结算模式
const JSMSTIME = ref([GetDateAfter(-30), GetDateAfter()])
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
}
const getJSMSDATA = () => {
  getJSMS({ ...queryParams.value, DATEARR: JSMSTIME.value.join(",") }).then(res => {
    JSMSDATA.value = res.RESULT
    initJSMS()
  })
}

// 成本监控
const CBJKDATA = ref({})
const getCBJKDATA = () => {
  getCBJK(queryParams.value).then(res =>
    CBJKDATA.value = res.RESULT
  )
}

// 应收款
const YSKTIME = ref([GetDateAfter(-30), GetDateAfter()])
const YSKDATA = ref({})
const getYSKDATA = () => {
  getYSK({ ...queryParams.value, DATEARR: YSKTIME.value.join(",") }).then(res => {
    console.log("🚀 ~ getYSK ~ res:", res)
    YSKDATA.value = res.RESULT
  })
}

// 合作性质
const HZXZTIME = ref([GetDateAfter(-30), GetDateAfter()])
const HZXZDATA = ref({})
const initHZXZ = () => {
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
    dataset: HZXZDATA.value,
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
  let chart = echarts.init(document.getElementById("HZXZ"));
  chart.setOption(options)
}
const getHZXZDATA = () => {
  getHZXZ({ ...queryParams.value, DATEARR: HZXZTIME.value.join(",") }).then(res => {
    HZXZDATA.value = res.RESULT
    initHZXZ()
  })
}

watch(() => WAYPROJECT.value, val => {
  if (PKPRO.value) return
  if (!val) return
  PKPRO.value = val[0]?.VALUE
}, {
  immediate: true
})

watch(queryParams, val => {
  if (!PKPRO.value) return
  getFHLDATA()
  getYYEDATA()
  getMLRDATA()
  getYLMSDATA()
  // getJSMSDATA()
  getCBJKDATA()
  getYSKDATA()
  getHZXZDATA()
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
  height: 260px;
}
.num-item {
  padding: 20px;
  margin: 5px;
  background: var(--el-color-primary-light-9);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  .title {
    font-size: 20px;
    text-align: left;
  }
  .nums {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
  .unit {
    font-size: 16px;
    text-align: center;
  }
}
</style>