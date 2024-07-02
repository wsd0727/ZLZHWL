// 未回单看板
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
        <el-date-picker v-model="MONTH" type="month" value-format="YYYY-MM" />
      </el-col>
    </el-row>

    <div class="board board-flex">
      <div class="board-item board-bg board-flex">
        <div class="icon"><el-icon>
            <Tickets />
          </el-icon></div>
        <div class="numinfo">
          <div class="title">总发生问题单</div>
          <p class="nums">{{NUMS.proBlemNumber}}</p>
        </div>
      </div>
      <div class="board-item board-bg board-flex">
        <div class="icon"><el-icon>
            <Tickets />
          </el-icon></div>
        <div class="numinfo">
          <div class="title">已处理问题单</div>
          <p class="nums">{{NUMS.proBlemNumberCl}}</p>
        </div>
      </div>
      <div class="board-item board-bg board-flex">
        <div class="icon"><el-icon>
            <Tickets />
          </el-icon></div>
        <div class="numinfo">
          <div class="title">未处理问题单</div>
          <p class="nums">{{NUMS.proBlemNumberWCl}}</p>
        </div>
      </div>
      <div class="board-item board-bg board-flex">
        <div class="icon"><el-icon>
            <Tickets />
          </el-icon></div>
        <div class="numinfo">
          <div class="title">太阳超期单数</div>
          <p class="nums">{{NUMS.proBlemNumberTYCq}}</p>
        </div>
      </div>
      <div class="board-item board-bg board-flex">
        <div class="icon"><el-icon>
            <Tickets />
          </el-icon></div>
        <div class="numinfo">
          <div class="title">万国超期单数</div>
          <p class="nums">{{NUMS.proBlemNumberWGCq}}</p>
        </div>
      </div>
    </div>
    <div class="board board-flex">
      <div class="board-item board-flex board-bg">
        <div class="board-item">
          <div class="title">承运商排名</div>
          <el-scrollbar height="300px">
            <div class="list-item" v-for="(item,index) in CYSDATA" :key="index">
              <div class="no">{{ index+1 }}</div>
              <div class="title">{{item.CARRIER}}</div>
              <div class="gress"><el-progress :percentage="(item.COUNT / item.ALLCOUNT)*100" :format="()=>item.COUNT" /></div>
            </div>
          </el-scrollbar>
        </div>
        <div class="board-item">
          <div class="title">客户占比</div>
          <el-scrollbar height="300px">
            <div class="list-item" v-for="(item,index) in KHDATA" :key="index">
              <div class="no">{{ index+1 }}</div>
              <div class="title">{{item.CUSTOMER}}</div>
              <div class="gress"><el-progress :percentage="item.A" :format="()=>item.A+'%'" /></div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="board-item board-bg">
        <div class="board-flex">
          <div class="title">问题单类型</div>
          <el-date-picker v-model="TYPESMONTH" type="month" value-format="MM" @change="TYPESMONTHChange" />
        </div>
        <div id="TYPES" class="charts"></div>
      </div>
    </div>
    <div class="board board-flex" style="width:100%;height:370px">
      <div class="board-item board-bg" style="width:35%">
        <div class="board-flex">
          <div class="title">到达地占比</div>
          <el-date-picker v-model="DDDMONTH" type="month" value-format="MM" @change="DDDMONTHChange" />
        </div>
        <div id="DDDZB" class="charts"></div>
      </div>
      <div class="board-item board-bg" style="width:65%">
        <div class="title">问题单片区</div>
        <miniTable :data="AREADATA" height="315px">
          <vxe-column field="AREA" title="片区" width="100" align="center" show-overflow="tooltip" />
          <vxe-column field="1" title="1月" width="60" align="center" show-overflow="tooltip" />
          <vxe-column field="2" title="2月" width="60" align="center" show-overflow="tooltip" />
          <vxe-column field="3" title="3月" width="60" align="center" show-overflow="tooltip" />
          <vxe-column field="4" title="4月" width="60" align="center" show-overflow="tooltip" />
          <vxe-column field="5" title="5月" width="60" align="center" show-overflow="tooltip" />
          <vxe-column field="6" title="6月" width="60" align="center" show-overflow="tooltip" />
          <vxe-column field="7" title="7月" width="60" align="center" show-overflow="tooltip" />
          <vxe-column field="8" title="8月" width="60" align="center" show-overflow="tooltip" />
          <vxe-column field="9" title="9月" width="60" align="center" show-overflow="tooltip" />
          <vxe-column field="10" title="10月" width="60" align="center" show-overflow="tooltip" />
          <vxe-column field="11" title="11月" width="60" align="center" show-overflow="tooltip" />
          <vxe-column field="12" title="12月" width="60" align="center" show-overflow="tooltip" />
          <vxe-column field="HJ" title="合计(吨)" width="100" align="center" show-overflow="tooltip" />
        </miniTable>
      </div>
    </div>
    <div class="board board-bg">
      <div class="title">发生趋势</div>
      <div id="FSQS" class="charts"></div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import * as echarts from "echarts";
import miniTable from "@/components/Tables/mini"
import { getORG, WtdNUMS, WtdCYS, WtdKH, WtdTYPES, WtdDDD, WtdAREA, WtdQS } from "#/JDWL/Board/wtdkb"
const { proxy } = getCurrentInstance();
const windowHeight = computed(() => (window.innerHeight - 120))

const { TASKTYPE } = proxy.useDict("TASKTYPE")
const PKGROUP = ref("")
const MONTH = ref(`${new Date().getMonth() + 1 < 10 ? `${new Date().getFullYear()}-0${new Date().getMonth() + 1}` : `${new Date().getFullYear()}-${new Date().getMonth() + 1}`}`)
const TASK = ref("1")
const queryParams = computed(() => {
  return {
    PK_GROUP: PKGROUP.value,
    YEAR: MONTH.value.split("-")[0],
    MONTH: MONTH.value.split("-")[1],
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

// 顶部数字区
const NUMS = ref([])
const getNUMS = () => {
  WtdNUMS({ ...queryParams.value }).then(res => {
    NUMS.value = res.RESULT
  })
}

// 承运商排名
const CYSDATA = ref([])
const getWtdCYS = () => {
  WtdCYS({ ...queryParams.value }).then(res => {
    CYSDATA.value = res.RESULT
  })
}

// 客户占比
const KHDATA = ref([])
const getWtdKH = () => {
  WtdKH({ ...queryParams.value }).then(res => {
    KHDATA.value = res.RESULT
  })
}

// 类型
const TYPESMONTH = ref(new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`)
const TYPESDATA = ref([])
const initTYPES = () => {
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
      bottom: '20',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    dataset: TYPESDATA.value,
    series: [{ type: 'bar' }]
  }
  let chart = echarts.init(document.getElementById("TYPES"));
  chart.setOption(options)
}
const getTYPES = () => {
  WtdTYPES({ ...queryParams.value, MONTH: TYPESMONTH.value }).then(res => {
    TYPESDATA.value = res.RESULT
    initTYPES()
  })
}
const TYPESMONTHChange = (val) => {
  getTYPES()
}

// 到达地占比
const DDDMONTH = ref(new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`)
const DDDDATA = ref([])
const initDDDZB = () => {
  const options = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '10',
      left: 'center'
    },
    grid: {
      top: '30',
      left: '10',
      right: '10',
      bottom: '0',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    dataset: DDDDATA.value,
    series: [{
      type: 'pie',
      label: {
        formatter: '{b}\n{d}%',
        fontSize: 12
      },
    }]
  }
  let chart = echarts.init(document.getElementById("DDDZB"));
  chart.setOption(options)
}
const getDDDZB = () => {
  WtdDDD({ ...queryParams.value, MONTH: DDDMONTH.value }).then(res => {
    DDDDATA.value = res.RESULT
    initDDDZB()
  })
}
const DDDMONTHChange = val => {
  getDDDZB()
}

// 片区
const AREADATA = ref({})
const getAREAS = () => {
  WtdAREA({ ...queryParams.value }).then(res => {
    AREADATA.value = res.RESULT
  })
}

//发生趋势
const QSDATA = ref([])
const initQS = () => {
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
      bottom: '20',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    dataset: QSDATA.value,
    series: [{ type: 'bar' }, {name:"", type: 'line' }]
  }
  let chart = echarts.init(document.getElementById("FSQS"));
  chart.setOption(options)
}
const getQS = () => {
  WtdQS({ ...queryParams.value }).then(res => {
    console.log("🚀 ~ WtdQS ~ res:", res)
    QSDATA.value = res.RESULT
    initQS()
  })
}

watch(queryParams, val => {
  getNUMS()
  getWtdCYS()
  getWtdKH()
  getTYPES()
  getDDDZB()
  getAREAS()
  getQS()
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
  height: 300px;
}
.w25 {
  width: 25%;
}
.icon {
  width: 60px;
  height: 60px;
  background: #e2e2e2;
  border-radius: 4px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-icon {
    font-size: 30px;
  }
}
.numinfo {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}
.nums {
  display: block;
  font-size: 22px;
  margin: 0;
  text-align: right;
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