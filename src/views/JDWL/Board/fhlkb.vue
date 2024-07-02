// 发货量看板
<template>
  <el-scrollbar :height="windowHeight">
    <div class="board">
      <div class="search">
        <div class="search-item">
          <div class="label">片区</div>
          <div class="value">
            <el-tree-select v-model="PK_AREA" size="default" check-strictly clearable filterable remote-show-suffix remote :remote-method="getArea" :data="areaList" popper-class="popMaxWidth" :render-after-expand="false" :placeholder="' '" :props="{ label: 'LABEL', children: 'CHILDREN' , disabled: 'ISDISABLED', }" value-key="VALUE" highlightCurrent />
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
            <div class="group-title">
              <div class="title">发货占比</div>
              <div class="time">
                <el-radio-group v-model="fhtime" size="default" @change="resetLoadLeftBoard">
                  <el-radio-button value="1" label="1">年</el-radio-button>
                  <el-radio-button value="2" label="2">月</el-radio-button>
                  <el-radio-button value="3" label="3">日</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="group-content">
              <div class="group-board">
                <!-- 发货占比-图表 -->
                <div id="fhzb" style="width: 100%;height: 250px;"></div>
              </div>
            </div>
          </div>
          <div class="group">
            <div class="group-title">
              <div class="title">KPI</div>
            </div>
            <div class="group-content">
              <div class="group-board">
                <!-- KPI-图表 -->
                <div id="kpi" style="width: 100%;height: 200px;"></div>
              </div>
              <div class="group-item">
                <div class="group-title">
                  <div class="title">超时未出库</div>
                  <div class="desc">{{CSDDDATA.length}}单</div>
                </div>
                <div class="group-board">
                  <!-- table -->
                  <miniTable :data="CSDDDATA" height="250px">
                    <vxe-column field="ORDERCODE" title="订单号" min-width="130" align="left" show-overflow="tooltip" />
                    <!-- <vxe-column field="OUT_DATE" title="出库时间" width="120" align="left" show-overflow="tooltip">
                      <template #default="{row}">
                        {{ CSDD_CALC_time(row.OUT_DATE) }}
                      </template>
                    </vxe-column> -->
                    <vxe-column field="TIME" title="超时" align="right" show-overflow="tooltip">
                      <template #default="{row}">
                        <span class="red">{{row.TIME}}h</span>
                      </template>
                    </vxe-column>
                    <!-- <vxe-column field="IS_OUT" title="出库" width="65" align="center" show-overflow="tooltip">
                      <template #default="{row}">
                        <el-tag v-if="row.IS_OUT == '1'" type="success">出库</el-tag>
                        <el-tag v-else type="danger">未出库</el-tag>
                      </template>
                    </vxe-column> -->
                  </miniTable>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list-item center">
          <div class="group">
            <div class="group-title">
              <div class="title">发货量对比</div>
              <div class="time">
                <el-radio-group v-model="FHLtime" size="default" @change="getYearSendData">
                  <el-radio-button value="1" label="1">年</el-radio-button>
                  <el-radio-button value="2" label="2">月</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="group-content">
              <div class="group-board">
                <div class="yearsend">
                  <div id="yearsend" style="width: 50%;height: 260px;"></div>
                  <div class="info">
                    <div class="info-item">
                      <span class="t">{{FHLtime == '1'?'今年':'当月'}}总发货量</span>
                      <div class="num new">{{newYearData.WEIGHT}}</div>
                    </div>
                    <div class="info-item">
                      <span class="t">{{FHLtime == '1'?'去年':'上月'}}总发货量</span>
                      <div class="num prev">{{prevYearData.WEIGHT}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="group-item">
                <div class="group-title">
                  <div class="title">月发货量对比</div>
                </div>
                <div class="group-board">
                  <!-- 月发货量对比图表  -->
                  <div id="monthSend" style="width: 100%;height: 483px;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list-item right">
          <div class="group">
            <div class="group-title">
              <div class="title">排行榜</div>
              <div class="time">
                <el-radio-group v-model="PHBTYPE" size="default" @change="getPH">
                  <el-radio-button value="1" label="1">年</el-radio-button>
                  <el-radio-button value="2" label="2">月</el-radio-button>
                  <el-radio-button value="3" label="3">日</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="group-content">
              <div class="group-item">
                <div class="group-title">
                  <div class="title">客户发货量</div>
                </div>
                <div class="group-board">
                  <!-- 客户发货量-图表 -->
                  <el-scrollbar :height="220" class="KHSEND-list">
                    <template v-if="KHSENDDATA.length">
                      <div class="KHSEND-list-item" v-for="(item,index) in KHSENDDATA" :key="index">
                        <div class="no">{{ index + 1 }}</div>
                        <div class="info">
                          <div class="name">{{item.CUSTOM}}</div>
                          <el-progress :percentage="KHSEND_CALC(index)">
                            <span class="total">{{ item.WEIGHT }}吨</span>
                          </el-progress>
                        </div>
                      </div>
                    </template>
                    <el-empty v-else :image-size="50" />
                  </el-scrollbar>
                </div>
              </div>
              <div class="group-item">
                <div class="group-title">
                  <div class="title">片区发货量</div>
                </div>
                <div class="group-board">
                  <!-- 片区发货量-图表 -->
                  <div id="areaSend" style="width: 100%;height: 220px;position: relative;">
                    <el-empty class="nodata" v-if="!PQSENDDATA.length" :image-size="50" />
                  </div>
                </div>
              </div>
              <div class="group-item">
                <div class="group-title">
                  <div class="title">纸种发货量</div>
                </div>
                <div class="group-board">
                  <!-- 纸种发货量 -->
                  <div id="typeSend">
                    <template v-if="ZZSENDDATA.length">
                      <miniTable :data="ZZSENDDATA" height="234px">
                        <vxe-column type="seq" title="排名" width="60" align="center" />
                        <vxe-column field="MATCLASSNAME" title="纸种" min-width="150" align="left" show-overflow="tooltip" />
                        <vxe-column field="WEIGHT" title="数量" width="140" align="right" show-overflow="tooltip">
                          <template #default="{row}">
                            {{row.WEIGHT}}吨
                          </template>
                        </vxe-column>
                      </miniTable>
                    </template>
                    <el-empty v-else :image-size="50" />
                  </div>
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
import { deepClone, GetDateAfter } from "@/utils";
import { getAreaData, getMSfhl, getKPI, getCSDDAPI, getYearSend, getMonthSend, getKHSend, getPQSend, getZZSend } from "@/api/JDWL/Board/fhlkb"
import miniTable from "@/components/Tables/mini"

const windowHeight = computed(() => (window.innerHeight - 120))

/** 查询 */
const timeDSIABLED = time => {
  let date = new Date()
  return time.getTime() > date.getTime()
}

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
/** 日期  */
const dateTime = ref(GetDateAfter(0))

/** 发货占比 */
const fhzbDATA = ref([])
const fhtime = ref("1")
const initFhzb = () => {
  let namearr = {
    "1": "模式一",
    "2": "模式二",
    "3": "模式三",
    "4": "小门店"
  }
  let seriesData = fhzbDATA.value.map(el => {
    return { value: Number(el.COUNT), name: namearr[el.MS] }
  })
  let option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: seriesData.map(el => el.name),
      bottom: '5'
    },
    series: [
      {
        name: '发货占比',
        type: 'pie',
        radius: ['30%', '60%'],
        data: seriesData,
        label: {
          fontSize: 14,
          show: true,
          formatter: '{b}\n {d}%', // 格式化数值百分比输出
        },
      }
    ]
  }
  let chart = myEcharts.init(document.getElementById("fhzb"), "shine");
  chart.setOption(option)
  // 大小自适应窗口大小变化
  window.onresize = function () {
    // 重置容器高宽
    chart.resize();
  };
}
const getFhzb = () => {
  getMSfhl({
    PK_AREA: PK_AREA.value,
    DATE_TYPE: fhtime.value,
    DATE: dateTime.value
  }).then(res => {
    fhzbDATA.value = res.RESULT
    initFhzb()
  })
}

/** KPI */
const KPIDATA = ref([])
const initkpi = () => {
  let out = Number(KPIDATA.value.find(el => el.TYPE == '1')?.COUNT || 0),
    shenyu = Number(KPIDATA.value.find(el => el.TYPE == '0')?.COUNT || 0),
    all = out + shenyu;
  let data = Number((out / all) * 100).toFixed(1);
  let option = {
    title: {
      text: data + " %",
      subtext: "出库占比",
      left: "50%",
      top: "70",
      textStyle: {
        fontSize: "30px",
        color: data > 80 ? '#00ff00' : data > 50 ? '#ffff33' : '#ff3333'
      },
      subtextStyle: {
        fontSize: "18px"
      }
    },
    grid: {
      top: 30,
      bottom: 30,
      left: 30,
      right: 200
    },
    xAxis: {
      data: ["百分比"],
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        interval: 0,
        textStyle: {
          color: '#fff',
          fontSize: 20,
        },
        margin: 20, //刻度标签与轴线之间的距离。
      },
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#fff',
          fontSize: 20,
        },
      }
    },
    series: [{
      name: '最上层立体圆',
      type: 'pictorialBar',
      symbolSize: [120, 28],
      symbolOffset: [0, -14],
      z: 12,
      itemStyle: {
        color: '#f9fafc'
      },
      data: [{
        value: 100,
        bolPosition: 'end'
      }]
    }, {
      name: '中间立体圆',
      type: 'pictorialBar',
      symbolSize: [120, 28],
      symbolOffset: [0, -14],
      z: 12,
      itemStyle: {
        color: '#ddf0db'
      },
      data: [{
        value: data,
        symbolPosition: 'end'
      }]
    }, {
      name: '最底部立体圆',
      type: 'pictorialBar',
      symbolSize: [120, 28],
      symbolOffset: [0, 14],
      z: 12,
      itemStyle: {
        color: '#01CC04'
      },
      data: [101 - data]
    }, {
      //底部立体柱
      stack: '1',
      type: 'bar',
      itemStyle: {
        color: '#01CC04',
        opacity: .7
      },
      silent: true,
      barWidth: 120,
      barGap: '-100%', // Make series be overlap
      data: [data]
    }, {
      //上部立体柱
      stack: '1',
      type: 'bar',
      itemStyle: {
        color: '#edeff5',
        opacity: .7
      },
      silent: true,
      barWidth: 120,
      barGap: '-100%', // Make series be overlap
      data: [100 - data]
    }]
  }
  let chart = myEcharts.init(document.getElementById("kpi"), "shine");
  chart.setOption(option)
  // 大小自适应窗口大小变化
  window.onresize = function () {
    // 重置容器高宽
    chart.resize();
  };
}
const getKpi = () => {
  getKPI({
    PK_AREA: PK_AREA.value,
    DATE_TYPE: fhtime.value,
    DATE: dateTime.value,
  }).then(res => {
    KPIDATA.value = res.RESULT
    initkpi()
  })
}

/** 超时订单 */
const CSDDDATA = ref([])
const getCSDD = () => {
  getCSDDAPI({
    PK_AREA: PK_AREA.value,
    DATE_TYPE: fhtime.value,
    DATE: dateTime.value,
  }).then(res => {
    CSDDDATA.value = res.RESULT
  })
}
const CSDD_CALC_time = val => {
  if (!val) return
  return val.substring(2, val.length - 3)
}

const resetLoadLeftBoard = () => {
  getFhzb()
  getKpi()
  getCSDD()
}

/** 发货量对比 */
const yearsendDATA = ref([])
const FHLtime = ref("1")
const newYearData = ref({})
const prevYearData = ref({})
const inityearsend = () => {
  let data = prevYearData.value.WEIGHT == '0' ? 100 : ((newYearData.value.WEIGHT - prevYearData.value.WEIGHT) / prevYearData.value.WEIGHT) * 100
  data = Number(data.toFixed(2))
  let type = data > 0 ? 'up' : 'down'
  let option = {
    title: {
      text: data + "%",
      subtext: type == 'up' ? "上浮" : "下浮",
      left: 'center',
      top: 90,
      textStyle: {
        fontSize: '30px',
        color: type == 'up' ? '#1890fe' : '#f81942'
      },
      subtextStyle: {
        fontSize: '20px',
        color: type == 'up' ? '#1890fe' : '#f81942'
      }
    },
    visualMap: {
      show: false,
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '80%'],
        center: ['50%', '50%'],
        data: [
          //itemSyle是单项的背景颜色设置。
          { value: Math.abs(data), itemStyle: { color: type == 'up' ? '#1890fe' : '#f81942' } },
          { value: 100 - data, itemStyle: { color: '#f1f1f1' } },
        ],
        label: {
          show: false,
        },
        itemStyle: {
          borderWidth: 7,
          borderColor: '#fff'
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  }
  let chart = myEcharts.init(document.getElementById("yearsend"), "shine");
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}
const getYearSendData = () => {
  getYearSend({
    PK_AREA: PK_AREA.value,
    DATE_TYPE: FHLtime.value,
    DATE: dateTime.value,
  }).then(res => {
    yearsendDATA.value = res.RESULT
    newYearData.value = res.RESULT.find(el => el.TYPE == '1')
    prevYearData.value = res.RESULT.find(el => el.TYPE == '2')
    inityearsend()
  })
}
/**  月发货量对比 */
const monthDATA = ref([])
const mapMonthData = (data, isLast = false) => {
  let ZLArr = [], NUMArr = []
  for (let i = 0; i < data.length; i++) {
    const el = data[i];
    el.value = el.VALUE
    if (el.TYPE == '1') {
      // 数量
      NUMArr.push(el)
    } else {
      // 吨数
      ZLArr.push(el)
    }
  }
  let barOption = {
    name: (isLast ? '去' : '今') + '年订单数',
    tooltip: {
      valueFormatter: function (value) {
        return value + ' 单';
      }
    },
    type: 'bar',
    data: NUMArr
  }
  let LineOption = {
    name: (isLast ? '去' : '今') + '年吨数',
    tooltip: {
      valueFormatter: function (value) {
        return value + ' 吨';
      }
    },
    smooth: true,
    type: 'line',
    data: ZLArr
  }
  return [barOption, LineOption]
}
const initmonthsend = () => {
  let prevYear = monthDATA.value.filter(el => el.YEAR_TYPE == '0'),
    newYear = monthDATA.value.filter(el => el.YEAR_TYPE == '1');
  let prevYearData = mapMonthData(prevYear, true)
  let newYearData = mapMonthData(newYear)
  let series = [...prevYearData, ...newYearData]
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
      type: 'value'
    },
    series
  };
  let chart = myEcharts.init(document.getElementById("monthSend"), "shine");
  chart.clear()
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}
const getMonthSendData = () => {
  getMonthSend({
    PK_AREA: PK_AREA.value,
    DATE_TYPE: "1",
    DATE: dateTime.value,
  }).then(res => {
    monthDATA.value = res.RESULT
    initmonthsend()
  })
}

/** 排行榜 */
const PHBTYPE = ref("1")
const getPH = () => {
  getKHSENGDDATA()
  getPSSENDDATA()
  gerZZSENDDATA()
}
/** 客户发货量 */
const KHSENDDATA = ref([])
const KHSEND_CALC = index => {
  if (index == '0') return 100
  let no1 = KHSENDDATA.value[0]
  let data = KHSENDDATA.value[index]
  return Number(((Number(data.WEIGHT) / Number(no1.WEIGHT)) * 100).toFixed(2))
}
const getKHSENGDDATA = () => {
  getKHSend({
    PK_AREA: PK_AREA.value,
    DATE_TYPE: PHBTYPE.value,
    DATE: dateTime.value,
  }).then(res => {
    KHSENDDATA.value = res.RESULT
  })
}

/** 片区发货量 */
const PQSENDDATA = ref([])
const PSSEND_CALCSize = (num, index) => {
  let max = parseInt(PQSENDDATA.value[0].WEIGHT);
  if (index != 0) {
    return parseInt((num / max) * 100) < 1 ? 20 : parseInt((num / max) * 100);
  } else {
    return 100;
  }
}
const colorArr = reactive([
  [
    "#ff7f50",
    "#87cefa",
    "#da70d6",
    "#32cd32",
    "#6495ed",
    "#ff69b4",
    "#ba55d3",
    "#cd5c5c",
    "#ffa500",
    "#40e0d0",
    "#1e90ff",
    "#ff6347",
    "#7b68ee",
    "#d0648a",
    "#ffd700",
    "#6b8e23",
    "#4ea397",
    "#3cb371",
    "#b8860b",
    "#7bd9a5"
  ],
  [
    "#ff7f50",
    "#87cefa",
    "#da70d6",
    "#32cd32",
    "#6495ed",
    "#ff69b4",
    "#ba55d3",
    "#cd5c5c",
    "#ffa500",
    "#40e0d0",
    "#1e90ff",
    "#ff6347",
    "#7b68ee",
    "#00fa9a",
    "#ffd700",
    "#6b8e23",
    "#ff00ff",
    "#3cb371",
    "#b8860b",
    "#30e0e0"
  ],
  [
    "#929fff",
    "#9de0ff",
    "#ffa897",
    "#af87fe",
    "#7dc3fe",
    "#bb60b2",
    "#433e7c",
    "#f47a75",
    "#009db2",
    "#024b51",
    "#0780cf",
    "#765005",
    "#e75840",
    "#26ccd8",
    "#3685fe",
    "#9977ef",
    "#f5616f",
    "#f7b13f",
    "#f9e264",
    "#50c48f"
  ]
][2]
)
const initPQSEND = () => {
  let data = PQSENDDATA.value.map((el, index) => {
    return {
      name: el.AREA,
      value: Number(el.WEIGHT),
      symbolSize: PSSEND_CALCSize(Number(el.WEIGHT), index),
      draggable: true,
      itemStyle: {
        shadowBlur: 5,
        shadowColor: colorArr[index],
        color: colorArr[index]
      }
    }
  })
  let option = {
    tooltip: {
      valueFormatter: function (value) {
        return value + ' 吨';
      }
    },
    grid: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    },
    series: [
      {
        type: "graph",
        layout: "force",
        force: {
          gravity: 0.3,
          repulsion: 200
        },
        roam: true,
        label: {
          show: true
        },
        data
      }
    ]
  }
  let chart = myEcharts.init(document.getElementById("areaSend"));
  chart.clear()
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}
const getPSSENDDATA = () => {
  getPQSend({
    PK_AREA: PK_AREA.value,
    DATE_TYPE: PHBTYPE.value,
    DATE: dateTime.value,
  }).then(res => {
    PQSENDDATA.value = res.RESULT
    nextTick(() => {
      initPQSEND()
    })
  })
}

/** 纸种发货量 */
const ZZSENDDATA = ref([])
const gerZZSENDDATA = () => {
  getZZSend({
    PK_AREA: PK_AREA.value,
    DATE_TYPE: PHBTYPE.value,
    DATE: dateTime.value,
  }).then(res => {
    ZZSENDDATA.value = res.RESULT
  })
}

/** 初始化  */
const Init = () => {
  getFhzb() // 发货占比
  getKpi() // KPI
  getCSDD() // 超时订单
  getYearSendData() // 年发货量
  getMonthSendData() // 月发货量
  getKHSENGDDATA() // 客户发货量
  getPSSENDDATA() // 片区发货量
  gerZZSENDDATA() // 纸种发货量
}

watch(PK_AREA, val => {
  if (val == '') return
  Init()
})

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
    .center {
      flex: 0.4;
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

.yearsend {
  display: flex;
  align-items: center;
  .info {
    padding: 10px;
    flex: 1;
    &-item {
      padding: 10px;
      border: 1px solid #f1f1f1;
      margin-bottom: 10px;
      .t {
        display: flex;
        margin-bottom: 10px;
      }
      .num {
        font-size: 32px;
        text-align: right;
        font-weight: bold;
        &::after {
          content: "吨";
          font-size: 18px;
        }
        &.new {
          color: #1964f8;
        }
        &.prev {
          color: orange;
        }
      }
    }
  }
}

.KHSEND-list {
  &-item {
    display: flex;
    align-items: center;
    font-size: 13px;
    padding: 2px 15px;
    .no {
      width: 20px;
      height: 20px;
      border: 50%;
      margin-right: 5px;
      text-align: center;
    }
    &:nth-of-type(1) .no {
      background: rgb(219, 0, 0);
      color: #fff;
    }
    &:nth-of-type(2) .no {
      background: rgb(1, 216, 1);
      color: #fff;
    }
    &:nth-of-type(3) .no {
      background: rgb(231, 231, 3);
      color: #fff;
    }
    .title {
      font-size: 13px;
    }
    .info {
      flex: 1;
    }
  }
}
</style>