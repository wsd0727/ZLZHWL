// 经营态势分析
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
        <div class="search-item">
          <div class="label">时间</div>
          <div class="value">
            <el-date-picker v-model="dateTime" type="date" :default-value="dateTime" :disabled-date="timeDSIABLED" placeholder="选择日期" size="default" value-format="YYYY-MM-DD" @change="Init" />
          </div>
        </div>
      </div>
      <div class="board-content">
        <div class="list-item left">
          <div class="group">
            <div class="group-content">
              <div class="group-item-flex">
                <div class="group-item" style="flex:.6">
                  <div class="group-title">
                    <div class="title">结构分布/同期比</div>
                    <div class="types">
                      <el-radio-group v-model="TQDATE" size="default" @change="getJGFBTQBDATA">
                        <el-radio-button value="0" label="0">年</el-radio-button>
                        <el-radio-button value="1" label="1">月</el-radio-button>
                        <el-radio-button value="2" label="2">日</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="group-board">
                    <!-- 月度成本 图表 -->
                    <div id="JGFBTQB" style="width: 100%;height: 360px;"></div>
                  </div>
                </div>
                <div class="group-item" style="flex:.4">
                  <div class="group-title">
                    <div class="title">月度收入</div>
                  </div>
                  <div class="group-board">
                    <!-- 月度收入 图表 -->
                    <div id="monthSR" style="width: 100%;height: 360px;"></div>
                  </div>
                </div>
              </div>
              <div class="group-item-flex">
                <div class="group-content w6">
                  <div class="group-item">
                    <div class="group-title">
                      <div class="title">净利率</div>
                    </div>
                    <div class="group-board">
                      <!-- 净利率 图表 -->
                      <div id="JLL" style="width: 100%;height: 170px;"></div>
                    </div>
                  </div>
                  <div class="group-item">
                    <div class="group-title">
                      <div class="title">纳税</div>
                    </div>
                    <div class="group-board">
                      <!-- 纳税 图表 -->
                      <div id="NS" style="width: 100%;height: 170px;"></div>
                    </div>
                  </div>
                </div>
                <div class="group-content w4">
                  <div class="group-item">
                    <div class="group-title">
                      <div class="title">费用</div>
                    </div>
                    <div class="group-board">
                      <div class="FY">
                        <div id="FYZB" style="width: 50%;height: 170px;"></div>
                      </div>
                      <!-- 费用 图表 -->
                      <div id="FY" style="width: 100%;height: 170px;"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list-item right">
          <div class="group">
            <div class="group-title">
              <div class="title">超额成本</div>
            </div>
            <div class="group-content">
              <div class="group-item">
                <div class="group-title">
                  <div class="title">月度成本</div>
                </div>
                <div class="group-board">
                  <!-- 月度成本 图表 -->
                  <div id="monthCB" style="width: 100%;height: 360px;"></div>
                </div>
              </div>
              <div class="group-item">
                <div class="group-title">
                  <div class="title">结构分布/同期比</div>
                </div>
                <div class="group-board">
                  <!-- 结构分布/同期比 图表 -->
                  <div id="cb_JGFB" style="width: 100%;height: 360px;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import * as echarts from "echarts";
let myEcharts = echarts;
import { getAreaData, getJGFB, getYDSR, getFY, getJLL, getNS, getYDCB, getCECBTQB } from "@/api/JDWL/Board/business"
import { trimAll, toThousands, GetDateAfter } from "@/utils"

/** 片区 */
const PK_AREA = ref("")
const areaList = ref([])
const getArea = (word) => {
  getAreaData({
    KEYWORD: word
  }).then(res => {
    areaList.value = [...res.RESULT]
    if (!PK_AREA.value) PK_AREA.value = res.RESULT[0].VALUE
  })
}
getArea()
/** 查询 */
const timeDSIABLED = time => {
  let date = new Date()
  return time.getTime() > date.getTime()
}
/** 日期  */
const dateTime = ref(GetDateAfter(0))
const dateYEAR = computed(() => dateTime.value.substring(0, 4))
const dateMON = computed(() => dateTime.value.substring(0, 7))

/** 结构分布/同期比  */
const JGFBTQBDATA = ref([])
const TQDATE = ref("0")
const TQTYPE = ref("0")
const initJGFBTQBDATA = () => {
  // let data = JGFBTQBDATA.value.map(el => {
  //   el.name = el.AREA
  //   el.value = Number(el.RECEIVABLEPROPORTION)
  //   return el
  // })
  // let option = {
  //   tooltip: {
  //     formatter: el => {
  //       let name = TQDATE.value == '0' ? '运输收入' : '毛利润'
  //       return `
  //       <div class="title">${el.name}</div>
  //       <div>${name}：${toThousands(el.data.RECEIVABLE)}元</div>
  //       <div>运输占比：${el.data.RECEIVABLEPROPORTION}% </div>
  //       <div>同期收入：${toThousands(el.data.SYNCHRECEIVABLE)}元 </div>
  //       <div>同期比：${el.data.SYNCHPROPORTIONTYPE == '0' || el.data.SYNCHPROPORTIONTYPE == '1' ? '上浮' : '下浮'} ${Number(el.data.SYNCHPROPORTION).toFixed(2)}% </div>
  //       `
  //     }
  //   },
  //   series: [
  //     {
  //       type: 'treemap',
  //       data: data,
  //     }
  //   ]
  // }

  let option = {
    legend: {
      selectedMode: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
    },
    xAxis: [
      {
        type: 'category',
        data: JGFBTQBDATA.value.map(el => el.AREA)
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: "毛利润",
        type: "bar",
        data: JGFBTQBDATA.value.map(el => {
          return {
            name: el.AREA,
            value: Number(el.RECEIVABLE)
          }
        })
      },
      {
        name: "毛利率",
        type: "line",
        data: JGFBTQBDATA.value.map(el => {
          return {
            name: el.AREA,
            value: Number(el.RECEIVABLEPROPORTION)
          }
        })
      },
    ]
  }

  let chart = myEcharts.init(document.getElementById("JGFBTQB"), "shine");
  chart.clear()
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}
const getJGFBTQBDATA = () => {
  getJGFB({
    DATATYPE: "1",
    DATETYPE: TQDATE.value,
    DATADATE: dateTime.value,
  }).then(res => {
    JGFBTQBDATA.value = res.RESULT
    initJGFBTQBDATA()
  })
}

/** 月度收入 */
const YDSRDATA = ref([])
const initYDSRDATA = () => {
  let data = YDSRDATA.value.map(el => {
    el.value = el.RECEIVABLE
    return el
  })
  let name = TQDATE.value == '0' ? '运输收入' : '毛利润'
  let option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      name: "月份",
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      name: "金额",
      type: 'value'
    },
    series: [
      {
        name,
        type: "line",
        data
      }
    ]
  };
  let chart = myEcharts.init(document.getElementById("monthSR"), "shine");
  chart.clear()
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}
const getYDSRDATA = () => {
  getYDSR({
    PK_AREA: PK_AREA.value,
    YEAR: dateYEAR.value,
    DATATYPE: TQTYPE.value
  }).then(res => {
    YDSRDATA.value = res.RESULT
    initYDSRDATA()
  })
}

/** 净利率  */
const JLLDATA = ref([])
const initJLLDATA = () => {
  let data = JLLDATA.value.map(el => {
    el.value = Number(el.PROFIT_ZB)
    return el
  })
  let option = {
    grid: {
      top: 30,
      left: 50,
      bottom: 30,
      right: 40
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      name: "月份",
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      name: "利率",
      type: 'value'
    },
    series: [
      {
        name: "利率",
        type: "line",
        data
      }
    ]
  };
  let chart = myEcharts.init(document.getElementById("JLL"), "shine");
  chart.clear()
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}
const getJLLDATA = () => {
  getJLL({
    YEAR: dateYEAR.value
  }).then(res => {
    JLLDATA.value = res.RESULT
    initJLLDATA()
  })
}

/** 纳税  */
const NSDATA = ref([])
const initNSDATA = () => {
  let data = NSDATA.value.map(el => {
    el.value = el.COST_MONEY
    return el
  })
  let option = {
    grid: {
      top: 30,
      left: 50,
      bottom: 30,
      right: 40
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      name: "月份",
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      name: "金额",
      type: 'value'
    },
    series: [
      {
        name: "纳税额",
        type: "line",
        data
      }
    ]
  };
  let chart = myEcharts.init(document.getElementById("NS"), "shine");
  chart.clear()
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}
const getNSDATA = () => {
  getNS({
    YEAR: dateYEAR.value
  }).then(res => {
    NSDATA.value = res.RESULT
    initNSDATA()
  })
}

/** 费用 */
const FYDATA = ref([])
const initFYDATA = () => {
  let FYLINE = [], FYZB = []
  for (let i = 0; i < FYDATA.value.length; i++) {
    const el = FYDATA.value[i];
    let name = trimAll(el.COST_NAME)
    FYLINE.push({
      name,
      type: "line",
      data: el.YMDATA.map(el => el.COST_MONEY)
    })
    FYZB.push({
      name,
      value: Number(el.COST_MONEY_ZB).toFixed(2)
    })
  }
  let option = {
    grid: {
      top: 30,
      left: 50,
      bottom: 30,
      right: 40
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      name: "月份",
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      name: "金额",
      type: 'value'
    },
    series: FYLINE
  };
  let chart = myEcharts.init(document.getElementById("FY"), "shine");
  chart.clear()
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };

  let option2 = {
    tooltip: {
      trigger: 'item',
      position: [100, 100]
    },
    series: [
      {
        name: '费用占比',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: FYZB
      }
    ]
  }
  let ZBchart = myEcharts.init(document.getElementById("FYZB"), "shine");
  ZBchart.clear()
  ZBchart.setOption(option2)
}
const getFYDATA = () => {
  getFY({
    DATADATE: dateMON.value
  }).then(res => {
    FYDATA.value = res.RESULT
    initFYDATA()
  })
}

/** 月度成本 */
const YDCBDATA = ref([])
const initYDCBDATA = () => {
  let series = []
  YDCBDATA.value.forEach(el => {
    series.push({
      name: el.COST_NAME,
      type: 'bar',
      stack: 'car',
      emphasis: {
        focus: 'series'
      },
      data: el.YMDATA.map(al => {
        al.value = al.COST_MONEY
        return al
      })
    })
  })
  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      // formatter:el => {
      //   return `${toThousands(el.value)}元`
      // }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      name: "月份",
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: series
  }
  let chart = myEcharts.init(document.getElementById("monthCB"), "shine");
  chart.clear()
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}
const getYDCBDATA = () => {
  getYDCB({
    PK_AREA: PK_AREA.value,
    YEAR: dateYEAR.value
  }).then(res => {
    YDCBDATA.value = res.RESULT
    initYDCBDATA()
  })
}

/** 超额成本同期比 */
const CECBTQBDATA = ref([])
const initCECBTQBDATA = () => {
  let data = CECBTQBDATA.value.map(el => {
    el.name = el.AREA
    el.value = Number(el.RECEIVABLEPROPORTION)
    return el
  })
  let option = {
    tooltip: {
      formatter: el => {
        let name = TQDATE.value == '0' ? '运输收入' : '毛利润'
        return `
        <div class="title">${el.name}</div>
        <div>${name}：${toThousands(el.data.RECEIVABLE)}元</div>
        <div>运输占比：${el.data.RECEIVABLEPROPORTION}% </div>
        <div>同期收入：${toThousands(el.data.SYNCHRECEIVABLE)}元 </div>
        <div>同期比：${el.data.SYNCHPROPORTIONTYPE == '0' || el.data.SYNCHPROPORTIONTYPE == '1' ? '上浮' : '下浮'} ${Number(el.data.SYNCHPROPORTION).toFixed(2)}% </div>
        `
      }
    },
    series: [
      {
        type: 'treemap',
        data: data,
      }
    ]
  }
  let chart = myEcharts.init(document.getElementById("cb_JGFB"), "shine");
  chart.clear()
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}
const getCECBTQBDATA = () => {
  getCECBTQB({
    DATADATE: dateMON.value
  }).then(res => {
    CECBTQBDATA.value = res.RESULT
    initCECBTQBDATA()
  })
}

/** 利率类型变化 */
watch(TQTYPE, () => {
  getJGFBTQBDATA()
  getYDSRDATA() // 月度收入
})
/** 年变化 */
watch(dateYEAR, () => {
  getYDSRDATA() // 月度收入
  getJLLDATA() // 净利率
  getNSDATA() // 纳税
  getFYDATA() // 费用
  getYDCBDATA() // 月度成本
  getCECBTQBDATA() // 超额成本同期比
})

watch(PK_AREA, val => {
  if (!val) return
  getYDSRDATA() // 月度收入
})

const Init = () => {
  getJGFBTQBDATA() // 结构分布/同期比
  getJLLDATA() // 净利率
  getNSDATA() // 纳税
  getFYDATA() // 费用
  getYDCBDATA() // 月度成本
  getCECBTQBDATA() // 超额成本同期比
}
Init()
</script>
<style lang="scss" scoped>
.search {
  background: #fff;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  &-item {
    display: flex;
    align-items: center;
    .label {
      font-size: 16px;
      margin-right: 10px;
    }
  }
}
.board {
  min-width: 1300px;
  min-height: 100%;
  height: 100%;
  position: relative;
  &-content {
    display: flex;
    align-items: stretch;
    .list-item {
      flex: 0.3;
    }
    .left {
      flex: 0.7;
    }
  }
  .nodata {
    position: absolute;
    z-index: 10;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
.group {
  padding: 6px;
  &-item {
    &-flex {
      display: flex;
      align-items: stretch;
    }
  }
  &-content {
    background: #fff;
  }
  &-title {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    padding: 5px;
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
    .desc {
      font-size: 16px;
      color: #8a8a8a;
    }
  }
}
.w6 {
  flex: 0.6;
  margin-right: 10px;
}
.w4 {
  flex: 0.4;
}
</style>