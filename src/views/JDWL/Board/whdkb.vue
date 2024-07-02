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
        <el-date-picker v-model="YEAR" type="year" value-format="YYYY" />
      </el-col>
    </el-row>

    <div class="board board-flex">
      <div class="board-item board-bg board-flex">
        <div class="icon"><el-icon>
            <Tickets />
          </el-icon></div>
        <div class="numinfo">
          <div class="title">倒纸</div>
          <p class="nums">{{NUMS.DZ}}</p>
        </div>
      </div>
      <div class="board-item board-bg board-flex">
        <div class="icon"><el-icon>
            <Tickets />
          </el-icon></div>
        <div class="numinfo">
          <div class="title">客户问题单</div>
          <p class="nums">{{NUMS.KHWTD}}</p>
        </div>
      </div>
      <div class="board-item board-bg board-flex">
        <div class="icon"><el-icon>
            <Tickets />
          </el-icon></div>

        <div class="numinfo">
          <div class="title">单据丢失</div>
          <p class="nums">{{NUMS.DJDS}}</p>
        </div>
      </div>
      <div class="board-item board-bg board-flex">
        <div class="icon"><el-icon>
            <Tickets />
          </el-icon></div>
        <div class="numinfo">
          <div class="title">未回单</div>
          <p class="nums">{{NUMS.WH}}</p>
        </div>
      </div>
    </div>
    <div class="board board-flex">
      <div class="board-item board-bg">
        <div class="title">类型</div>
        <div id="TYPES" class="charts"></div>
      </div>
      <div class="board-item board-bg">
        <div class="title">片区</div>
        <div id="AREA" class="charts"></div>
      </div>
    </div>
    <div class="board board-flex" style="width:100%;height:370px">
      <div class="board-item board-bg" style="width:35%">
        <div class="title">承运商</div>
        <el-scrollbar height="315px">
          <div class="list-item" v-for="(item,index) in CYSDATA" :key="index">
            <div class="no">{{ index+1 }}</div>
            <div class="title">{{item.CARRIER}}</div>
            <div class="gress"><el-progress :percentage="(item.COUNT / item.ALLCOUNT)*100" :format="()=>item.COUNT" /></div>
          </div>
        </el-scrollbar>
      </div>
      <div class="board-item board-bg" style="width:65%">
        <div class="board-flex">
          <div class="title">订单明细</div>
          <el-date-picker v-model="DDMONTH" type="month" value-format="MM" @change="DDMONTHChange" />
        </div>
        <miniTable :data="DETAILDATA" height="315px">
          <vxe-column type="seq" title="序号" width="50" align="center" show-overflow="tooltip" />
          <vxe-column field="OUT_DATE" title="出库日期" width="100" align="center" show-overflow="tooltip" />
          <vxe-column field="DELIVERY_NO" title="发货单号" width="150" align="center" show-overflow="tooltip" />
          <vxe-column field="OUT_NO" title="出库单号" width="150" align="center" show-overflow="tooltip" />
          <vxe-column field="CARNO_TRAN" title="承运车辆" width="100" align="center" show-overflow="tooltip" />
          <vxe-column field="WEIGHT" title="出库重量" width="100" align="center" show-overflow="tooltip" />
          <vxe-column field="CARRIER" title="承运商" width="200" align="left" show-overflow="tooltip" />
          <vxe-column field="RECEIVEADDRESS" title="收货地址" width="200" align="left" show-overflow="tooltip" />
          <vxe-column field="CUSTOMER" title="收货客户" width="200" align="left" show-overflow="tooltip" />
          <vxe-column field="COMACHINE" title="出库机台" width="140" align="center" show-overflow="tooltip" />
          <vxe-column field="NO_REMARK" title="未回单备注" width="160" align="left" show-overflow="tooltip" />
          <vxe-column field="AREA" title="片区" width="100" align="center" show-overflow="tooltip" />
          <vxe-column field="DESTINATION" title="到达地" width="100" align="center" show-overflow="tooltip" />
        </miniTable>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import * as echarts from "echarts";
import miniTable from "@/components/Tables/mini"
import { getORG, WhdNUMS, WhdTYPE, WhdAREA, WhdCYS, WhdDETAIL } from "#/JDWL/Board/whdkb"
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

// 顶部数字区
const NUMS = ref([])
const getNUMS = () => {
  WhdNUMS({ ...queryParams.value }).then(res => {
    NUMS.value = res.RESULT
  })
}

// 类型
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
      bottom: '10',
      containLabel: true
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    dataset: TYPESDATA.value,
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
  }
  let chart = echarts.init(document.getElementById("TYPES"));
  chart.setOption(options)
}
const getTYPES = () => {
  WhdTYPE({ ...queryParams.value }).then(res => {
    TYPESDATA.value = res.RESULT
    initTYPES()
  })
}

// 片区
const AREADATA = ref({})
const initAREA = () => {
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
    dataset: AREADATA.value,
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
  let chart = echarts.init(document.getElementById("AREA"));
  chart.setOption(options)
  chart.on("mouseover", res => {
    console.log("🚀 ~ initAREA ~ res:", res)
  })
}
const getAREAS = () => {
  WhdAREA({ ...queryParams.value }).then(res => {
    AREADATA.value = res.RESULT
    initAREA()
  })
}

// 承运商
const CYSDATA = ref([])
const getCYS = () => {
  WhdCYS({ ...queryParams.value }).then(res => {
    CYSDATA.value = res.RESULT
  })
}

// 订单明细
const DDMONTH = ref(new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`)
const DETAILDATA = ref([])
const getDETAIL = () => {
  WhdDETAIL({ ...queryParams.value, MONTH: DDMONTH.value }).then(res => {
    DETAILDATA.value = res.RESULT
  })
}
const DDMONTHChange = (val) => {
  getDETAIL()
}

watch(queryParams, val => {
  getNUMS()
  getTYPES()
  getAREAS()
  getCYS()
  getDETAIL()
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
  height: 340px;
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