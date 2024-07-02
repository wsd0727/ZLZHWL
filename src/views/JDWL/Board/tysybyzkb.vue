// 太阳事业部运作看板
<template>
  <el-scrollbar :height="windowHeight">
    <div class="board board-flex">
      <div class="board-item board-bg" style="width:35%">
        <div class="title board-flex board-flex-sb">
          <div class="title">发货量</div>
          <div class="nums">{{ FHLDATA.TOTAL}}吨</div>
          <div class="desc">
            <el-date-picker v-model="FHLTIME" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" @change="getFHLDATA" style="width:210px" />
          </div>
        </div>
        <div class="charts" id="FHL"></div>
      </div>
      <div class="board-item board-bg board-flex" style="width:65%">
        <div class="board-item">
          <div class="title">实时运力</div>
          <div class="charts" id="SSYL"></div>
        </div>
        <div class="board-item">
          <div class="title">车辆状态</div>
          <div class="charts board-flex">
            <div class="board-item board-flex board-flex-sb board-flex-col" style="width:40%">
              <div class="board-item num-item board-flex board-flex-sb board-flex-col">
                <div class="title">待配载</div>
                <div class="nums">{{ CLZTDATA.LOADED }}</div>
                <div class="unit">辆</div>
              </div>
              <div class="board-item num-item board-flex board-flex-sb board-flex-col">
                <div class="title">返程中</div>
                <div class="nums">{{ CLZTDATA.ONRETURN  }}</div>
                <div class="unit">辆</div>
              </div>
            </div>
            <div class="board-item board-flex board-flex-col">
              <div class="num-item board-flex board-flex-sb board-flex-center">
                <div class="title">未到厂</div>
                <div class="nums">{{ CLZTDATA.NOFACTORY }}</div>
                <div class="unit">辆</div>
              </div>
              <div class="num-item board-flex board-flex-sb board-flex-center">
                <div class="title">未出发</div>
                <div class="nums">{{ CLZTDATA.NOTRANSPORT }}</div>
                <div class="unit">辆</div>
              </div>
              <div class="num-item board-flex board-flex-sb board-flex-center">
                <div class="title">在途中</div>
                <div class="nums">{{ CLZTDATA.TRANSPORT }}</div>
                <div class="unit">辆</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="board board-flex">
      <div class="board-item board-bg" style="width:45%">
        <div class="title board-flex board-flex-sb">
          <div class="title">实时订单</div>
          <div class="desc">
            <el-date-picker v-model="SSDDTIME" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" @change="getSSDDDATA" style="width:210px" />
          </div>
        </div>
        <div class="charts board-flex">
          <div class="board-item board-flex board-flex-sb board-flex-col">
            <div class="num-item board-flex board-flex-sb board-flex-center">
              <div class="title col">开单车数</div>
              <div class="nums">{{ SSDDDATA.KDCS }}</div>
              <div class="unit">辆</div>
            </div>
            <div class="num-item board-flex board-flex-sb board-flex-center">
              <div class="title col">开单吨数</div>
              <div class="nums">{{ SSDDDATA.KDDS }}</div>
              <div class="unit">吨</div>
            </div>
          </div>
          <div class="board-item board-flex board-flex-sb board-flex-col">
            <div class="num-item board-flex board-flex-sb board-flex-center">
              <div class="title col">已配载</div>
              <div class="nums">{{ SSDDDATA.YPZ }}</div>
              <div class="unit">单</div>

            </div>
            <div class="num-item board-flex board-flex-sb board-flex-center">
              <div class="title col">已出库</div>
              <div class="nums">{{ SSDDDATA.YCK }}</div>
              <div class="unit">单</div>
            </div>
          </div>
          <div class="board-item board-flex board-flex-sb board-flex-col">
            <div class="num-item board-flex board-flex-sb board-flex-center">
              <div class="title col">超时</div>
              <div class="nums">{{ SSDDDATA.CS }}</div>
              <div class="unit">单</div>
            </div>
            <div class="num-item board-flex board-flex-sb board-flex-center">
              <div class="title col">滞留</div>
              <div class="nums">{{ SSDDDATA.ZL }}</div>
              <div class="unit">单</div>
            </div>
          </div>
        </div>
      </div>
      <div class="board-item board-bg" style="width:55%">
        <div class="title board-flex board-flex-sb">
          <div class="title">KPI出库指标</div>
          <div class="desc">
            <el-row>
              <el-col :span=".5">
                <el-date-picker v-model="KPIMONTH" type="month" value-format="YYYY-MM" @change="getKPICKZBDATA" style="width:140px" />
              </el-col>
              <el-col :span=".5">
                <el-select v-model="KPITYPE" placeholder="请选择" @change="getKPICKZBDATA" style="width:150px">
                  <el-option v-for=" item in FG_TYPE" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="charts">
          <miniTable :data="KPICKZBDATA" height="390px" :loading="loading">
            <vxe-column field="AREA" title="片区" width="100" align="center" show-overflow="tooltip" />
            <vxe-column v-for="item in monDay" :key="item" :field="item" :title="`${Number(kpimon)}.${item>9?item:'0'+item}`" width="50" align="center" show-overflow="tooltip" />
          </miniTable>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import * as echarts from "echarts";
import miniTable from "@/components/Tables/mini"
import { GetDateAfter } from "@/utils"
import { getFHL, getSSYL, getCLZT, getSSDD, getKPICKZB, getKPICKZBXQ } from "@/api/JDWL/Board/tysybyzkb"

const { proxy } = getCurrentInstance();
const windowHeight = computed(() => (window.innerHeight - 120))
const { FG_TYPE } = proxy.useDict("FG_TYPE")

// 发货量
const FHLTIME = ref([GetDateAfter(-7), GetDateAfter(-1)])
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
  getFHL({
    DATATYPE: "3",
    DATEARR: FHLTIME.value.join(",")
  }).then(res => {
    FHLDATA.value = res.RESULT
    initFHL()
  })
}
getFHLDATA()

// 实时运力
const SSYLDATA = ref({})
const initSSYL = () => {
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
    dataset: SSYLDATA.value,
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
  let chart = echarts.init(document.getElementById("SSYL"));
  chart.setOption(options)
  // chart.on("mouseover", res => {
  //   console.log("🚀 ~ initAREA ~ res:", res)
  // })
}
const getSSYLDATA = () => {
  getSSYL({}).then(res => {
    SSYLDATA.value = res.RESULT
    initSSYL()
  })
}
getSSYLDATA()

// 车辆状态
const CLZTDATA = ref({})
const getCLZTDATA = () => {
  getCLZT({}).then(res => {
    CLZTDATA.value = res.RESULT
  })
}
getCLZTDATA()

// 实时订单
const SSDDTIME = ref([GetDateAfter(-7), GetDateAfter(-1)])
const SSDDDATA = ref({})
const getSSDDDATA = () => {
  getSSDD({
    DATATYPE: "3",
    DATEARR: SSDDTIME.value.join(",")
  }).then(res => {
    SSDDDATA.value = res.RESULT
  })
}
getSSDDDATA()

// KPI出库指标
const KPIMONTH = ref(`${new Date().getMonth() + 1 < 10 ? `${new Date().getFullYear()}-0${new Date().getMonth() + 1}` : `${new Date().getFullYear()}-${new Date().getMonth() + 1}`}`)
const kpimon = computed(() => KPIMONTH.value.split("-")[1])
const monDay = computed(() => {
  const year = KPIMONTH.value.split("-")[0]
  const month = KPIMONTH.value.split("-")[1]
  const days = new Date(year, month, 0).getDate()
  const arr = []
  for (let i = 0; i < days; i++) {
    arr.push(i + 1)
  }
  return arr
})
const KPITYPE = ref("1")
const KPICKZBDATA = ref({})
const loading = ref(true)
const getKPICKZBDATA = () => {
  getKPICKZB({
    FG_TYPE: KPITYPE.value,
    YEAR: KPIMONTH.value.split("-")[0],
    MONTH: KPIMONTH.value.split("-")[1]
  }).then(res => {
    KPICKZBDATA.value = res.RESULT
  }).finally(() => {
    loading.value = false
  })
}
getKPICKZBDATA()
// KPI出库指标详情
const KPICKZBXQDATA = ref([])
const getKPICKZBXQDATA = () => {

}

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
    &-col {
      flex-direction: column;
    }
    &-center {
      align-items: center;
    }
  }
  &-item {
    width: 100%;
    margin: 2px 5px;
  }
}
.charts {
  height: 400px;
}
.num-item {
  height: 100%;
  padding: 20px;
  margin: 5px;
  background: var(--el-color-primary-light-9);
  border-radius: 5px;
  .title {
    font-size: 20px;
    text-align: left;
    &.col {
      width: 30px;
    }
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