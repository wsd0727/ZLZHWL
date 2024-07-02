// 金德运营动态数据看板
<template>
  <el-scrollbar :height="windowHeight">
    <el-row class="query board-bg" :gutter="10">
      <el-col span=".5">
        <el-date-picker v-model="DATE" type="date" value-format="YYYY-MM-DD" />
      </el-col>
    </el-row>

    <div class="board board-flex">
      <div class="board-item" style="width:70%">
        <div class="board-item board-bg board-flex">
          <div class="board-item" style="width:20%">
            <div class="title">实时运力</div>
            <div class="charts num-item board-flex board-flex-sb board-flex-col" style="height:90%">
              <div class="title">车辆总数</div>
              <div class="nums">{{SSYLDATA}}</div>
              <div class="unit">辆</div>
            </div>
          </div>
          <div class="board-item" style="width:80%">
            <div class="charts big" id="PQCL"></div>
          </div>
        </div>
        <div class="board-item board-flex">
          <div class="board-item board-bg" style="width:40%">
            <div class="title">运力模式</div>
            <div class="charts" id="YLMS"></div>
          </div>
          <div class="board-item board-bg" style="width:60%">
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
      <div class="board-item board-bg" style="width:30%">
        <div class="title">
          <el-date-picker v-model="YEAR" type="year" value-format="YYYY" />
        </div>
        <div class="board-item" v-for="(item,index) in JDDATA" :key="index">
          <div class="title">{{item.groupname}}</div>
          <div class="charts custem" :id="`JD${index}`"></div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import * as echarts from "echarts";
import { GetDateAfter } from "@/utils"
import { getSSYL, getPQCL, getYLMS, getCLZT, getJDDATA } from "@/api/JDWL/Board/jdyydtsjkb"
import { nextTick } from "vue";

const { proxy } = getCurrentInstance();
const windowHeight = computed(() => (window.innerHeight - 120))

const DATE = ref(`${GetDateAfter()}`)
const queryParams = computed(() => {
  return {
    DATE: DATE.value,
  }
})

// 实时运力
const SSYLDATA = ref()
const getSSYLDATA = () => {
  getSSYL(queryParams.value).then(res => {
    SSYLDATA.value = res.RESULT
  })
}

// 片区车辆
const PQCLDATA = ref({})
const initPQCL = () => {
  const options = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '30',
      right: '10',
      bottom: '10',
      top: '10',
      containLabel: true
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    dataset: PQCLDATA.value,
    series: [{ type: 'bar' }]
  }
  let chart = echarts.init(document.getElementById("PQCL"));
  chart.setOption(options)
}
const getPQCLDATA = () => {
  getPQCL(queryParams.value).then(res => {
    PQCLDATA.value = res.RESULT
    initPQCL()
  })
}

// 运力模式
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
  // chart.on("mouseover", res => {
  //   console.log("🚀 ~ initAREA ~ res:", res)
  // })
}
const getYLMSDATA = () => {
  getYLMS(queryParams.value).then(res => {
    YLMSDATA.value = res.RESULT
    initYLMS()
  })
}

// 车辆状态
const CLZTDATA = ref({})
const getCLZTDATA = () => {
  getCLZT(queryParams.value).then(res => {
    CLZTDATA.value = res.RESULT

  })
}

// 基地数据
const YEAR = ref(`${new Date().getFullYear()}`)
const JDDATA = ref([])
const custemChartsHeight = computed(() => `${(window.innerHeight - 340) / JDDATA.value.length}px`)
const initJDDATA = () => {
  for (let i = 0; i < JDDATA.value.length; i++) {
    const el = JDDATA.value[i];
    initCharts(el, `JD${i}`)
  }

  function initCharts(data, id) {
    const options = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '30',
        right: '10',
        bottom: '10',
        top: "10",
        containLabel: true
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        type: 'value'
      },
      dataset: data,
      series: [{ type: 'line' }]
    }
    let chart = echarts.init(document.getElementById(id));
    chart.setOption(options)
  }
}
const getJDSJDATA = () => {
  getJDDATA({ YEAR: YEAR.value }).then(res => {
    console.log("🚀 ~ getJDDATA ~ res:", res.RESULT)
    JDDATA.value = res.RESULT
    nextTick(() => {
      initJDDATA()
    })
  })
}

watch(queryParams, val => {
  getSSYLDATA()
  getPQCLDATA()
  getYLMSDATA()
  getCLZTDATA()
  getJDSJDATA()
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
  &.big {
    height: 400px;
  }
  &.custem {
    height: v-bind(custemChartsHeight);
  }
}
.num-item {
  height: 100%;
  padding: 20px;
  margin: 5px;
  background: var(--el-color-primary-light-9);
  border-radius: 5px;
  box-sizing: border-box;
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