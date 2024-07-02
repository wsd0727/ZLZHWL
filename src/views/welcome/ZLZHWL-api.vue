<template>
  <div class="workbench">
    <!-- <img :src="avatarUrl" alt="" srcset="" class="welcome-img" /> -->
    <div class="workbench-top">
      <div class="workbench-top-left">
        <div class="disflex justify-sb mb-20">
          <div class="disflex">
            <img src="@/assets/images/WZC/home/Slice.png" class="image1" alt="">
            <div>
              <div class="top-title">运单量（单）</div>
              <div class="disflex">
                <div class="top-num">{{ totalTranSport.TOTALTRAN }}</div>
                <div>环比 {{ totalTranSport.TOTALTRANRATE }} </div>
              </div>
            </div>
          </div>
          <img src="@/assets/images/WZC/home/float.png" class="image2" alt="">
        </div>
        <div class="statusData">
          <div class="workbench-top-left-block" v-for="item in overviewData" :key="item.value">
            <div class="workbench-top-left-block-title">{{ item.label }}</div>
            <div class="workbench-top-left-block-num">{{ totalTranSport[item.value] || 0 }}</div>
            <div class="workbench-top-left-block-chain disflex" v-if="totalTranSport[item.rate]">
              环比
              <el-icon>
                <CaretTop color="#67C23A" v-if="(totalTranSport[item.rate].replace('%', '') > 0)" />
                <CaretBottom color="#F56C6C" v-else />
              </el-icon>
              {{ totalTranSport[item.rate] }}
            </div>
          </div>
        </div>
      </div>
      <div class="workbench-top-right">
        <div class="disflex workbench-top-left-block" v-for="item in rightOverviewData" :key="item.value">
          <!-- <img src="@/assets/images/WZC/login-title-icon.png" class="workbench-top-left-block-img" alt=""> -->
          <!-- <img :src="require('@/assets/images/WZC/'+item.img)" class="workbench-top-left-block-img" alt=""> -->
          <img :src="item.img" class="workbench-top-left-block-img" alt="">
          <!-- <img src="@/assets/images/WZC/home/index-right1.png" class="workbench-top-left-block-img" alt=""> -->
          <div class="">
            <div class="workbench-top-left-block-title">{{ item.label }}</div>
            <div class="workbench-top-left-block-num">{{ totalTranSport[item.value] || 0 }} </div>
            <div class="workbench-top-left-block-chain disflex" v-if="totalTranSport[item.rate]">
              环比
              <el-icon>
                <CaretTop color="#67C23A" v-if="(totalTranSport[item.rate].replace('%', '') > 0)" />
                <CaretBottom color="#F56C6C" v-else />
              </el-icon>
              {{ totalTranSport[item.rate] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="workbench-bottom ">
      <div class="workbench-bottom-left">
        <div class="lineRanking">
          <div class="commonTitle">线路排行</div>
          <el-table :data="tranTimeData" style="width: 100%" height="300">
            <el-table-column type="index" width="50" label="序号" fixed />
            <el-table-column prop="LINENAME" label="线路（市）" />
            <!-- <el-table-column prop="adds" label="运单量" />
            <el-table-column prop="address" label="重量（吨）" />
            <el-table-column prop="addres" label="占比" /> -->
            <el-table-column prop="AVGTRANTIME" label="平均耗时" />
            <el-table-column prop="MAXTRANTIME" label="最大用时" />
            <el-table-column prop="MINTRANTIME" label="最小用时" />
          </el-table>
        </div>
        <div class="allCategory">
          <div class="commonTitle">全部品类</div>
          <div class="allCategory-content">
            <div class="allCategory-content-alone" v-for="(item, index) in materialData" :key="index">
              <!-- <img src="@/assets/images/WZC/login-title-icon.png" class="allCategory-content-alone-image" alt=""> -->
              <img src="@/assets/images/WZC/home/car.png" class="allCategory-content-alone-image" alt="">
              <div>
                <div class="allCategory-content-alone-topText">
                  {{ item.MATERIALNAME }}
                </div>
                <div class="allCategory-content-alone-bottomText">{{ item.TRANSPORTNUM }}({{ item.TRANSPORTNUMRATE }})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="workbench-bottom-right notification">
        <div class="commonTitle disflex justify-sb ">
          <div>系统通知</div>
          <div class="notification-more" @click="clickMore">更多></div>
        </div>
        <div class="notification-main">
          <div class="disflex notification-alone" v-for="item in notificationData" :key="item.BILLNO"
            @click="clicknatification(item)">
            <div class="notification-title">{{ item.STARTDATE.substr(5) }}</div>
            <el-tooltip class="box-item" effect="dark" :content="item.TITLE" placement="top-start">
              <div class="notification-content">{{ item.TITLE }}</div>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="workbench-tabOrChart">
      <div class="workbench-tabOrChart-tab">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
          <el-tab-pane label="物料" name="0">
            <!-- <el-table :data="tranMateriaData" style="width: 100%"  height="400">
              <el-table-column type="index" width="50" label="序号" />
              <el-table-column prop="MATERIALNAME" label="物料" />
              <el-table-column prop="TOTALCARNUM" label="派车数量" />
              <el-table-column prop="YSZCARCOUNT" label="运输中（辆）" />
              <el-table-column prop="YSZWIGHT" label="运输中（吨）" />
              <el-table-column prop="TRANSPORTNUMRATE" label="已签收（吨）" />
            </el-table> -->
          </el-tab-pane>
          <el-tab-pane label="销售" name="1"></el-tab-pane>
          <el-tab-pane label="采购" name="2"></el-tab-pane>
          <el-tab-pane label="调拨" name="3"></el-tab-pane>
        </el-tabs>
        <div>
          <el-table :data="tranMateriaData" style="width: 100%" height="300">
            <el-table-column type="index" width="50" label="序号" />
            <el-table-column prop="MATERIALNAME" label="物料" />
            <el-table-column prop="TOTALCARNUM" label="派车数量" />
            <el-table-column prop="YSZCARCOUNT" label="运输中（辆）" />
            <el-table-column prop="YSZWIGHT" label="运输中（吨）" />
            <el-table-column prop="TRANSPORTNUMRATE" label="已签收（吨）" />
          </el-table>
        </div>
      </div>
      <div class="workbench-tabOrChart-chart">
        <div class="commonTitle disflex justify-sb">
          <div>派车单柱状图</div>
          <el-radio-group v-model="radio" @change="changeRadio" style="transform:scale(0.8)">
            <!-- <el-radio-button label="当日" name="1" />
            <el-radio-button label="本周" name="2" />
            <el-radio-button label="当月" name="3" /> -->

            <el-radio-button label="1" size="large">当日</el-radio-button>
            <el-radio-button label="2" size="large">本周</el-radio-button>
            <el-radio-button label="3" size="large">当月</el-radio-button>

          </el-radio-group>
        </div>
        <div>
          <div class="chart" id="truckingOrder" style="width: 100%;height: 300px;"></div>
        </div>
      </div>
    </div>
    <vxe-modal destroy-on-close v-model="detailModal" id="formModal" width="50%"
      height="50%" resize storage transfer show-zoom show-footer>
      <template #title>
        <span class="modal-title">详情</span>
      </template>
      <div v-html="detailModalMsg">

      </div>
      <!-- <template #footer>
        <el-button
          type="primary"
          :loading="confirmForgotPasswordLoading"
          @click="confirmForgotPassword"
          >确 定</el-button
        >
        <el-button
          :loading="confirmForgotPasswordLoading"
          @click="cancelForgotPassword"
          >取 消</el-button
        >
      </template> -->
    </vxe-modal>
  </div>
</template>

<script setup name="">
import { getPageConfig, getTableData, axiosSave } from "@/api/system/page";


import * as echarts from "echarts";
let myEcharts = echarts;
const { proxy } = getCurrentInstance();
const router = useRouter();

const avatarUrl = ref();

import { onMounted, onUnmounted } from "vue";
const tableData = ref([])
const overviewData = ref([
  {
    label: '待开启',
    value: 'DKQTRAN',
    rate: 'DKQTRANRATE',
  },
  {
    label: '运输中',
    value: 'YSZTRAN',
    rate: 'YSZTRANRATE',
  },
  {
    label: '已签到',
    value: 'YQDTRAN',
    rate: 'YQDTRANRATE',
  },
  {
    label: '已完成',
    value: 'YWCTRAN',
    rate: 'YWCTRANRATE',
  },
  {
    label: '异常结束',
    value: 'YCGBTRAN',
    rate: 'YCGBTRANRATE',
  },
])
const detailModal = ref(false)
const detailModalMsg = ref('')

import indexRight1 from '@/assets/images/WZC/home/index-right1.png'
import indexRight2 from '@/assets/images/WZC/home/index-right2.png'
import indexRight3 from '@/assets/images/WZC/home/index-right3.png'
import indexRight4 from '@/assets/images/WZC/home/index-right4.png'
const rightOverviewData = ref([
  {
    label: '注册车辆',
    value: 'CARCOUNT',
    // rate: 'TOTALMONEYRATE',
    img: indexRight1
  },
  {
    label: '注册司机',
    value: 'DRIVERCOUNT',
    // rate: 'CZMONEYMONEYRATE',
    img: indexRight4

  },
  {
    label: '结算额（万元）',
    value: 'YJSTRAN',
    rate: 'YJSTRANRATE',
    img: indexRight3
  },
  {
    label: '开票额（万元）',
    value: 'KPMONEY',
    rate: 'KPMONEYRATE',
    img: indexRight2

  },
])
const radio = ref(1)
const activeName = ref('0')

onMounted(() => {
  getMonitorCarStatus()
  getMaterial()
  getTranTime()
  getNotification()
  getTranSportDate()
  getTranMateria()
});

const totalTranSport = ref({})
// 平台业务数据统计
const getMonitorCarStatus = () => {
  // getTableData('tms/screenDisplay/getTotalTranSport', {})
  getTableData('tms/screenDisplay/getMonitorCarStatus', {})
    .then((res) => {
      totalTranSport.value = res.RESULT
    })
}
// 今日物料派单量
const materialData = ref([])
const getMaterial = () => {
  getTableData('tms/screenDisplay/getMaterial', {})
    .then((res) => {
      materialData.value = res.RESULT
    })
}
// 路线运输失效
const tranTimeData = ref([])
const getTranTime = () => {
  getTableData('tms/screenDisplay/getTranTime', {})
    .then((res) => {
      tranTimeData.value = res.RESULT
    })
}

// 通知
const notificationData = ref([])
const getNotification = () => {
  // getTableData('/sys/notice/getPageList', {
  getTableData('/sys/notice/getSysMessage', {
    DATA: { DR: "0", PAGENUM: 1, PAGESIZE: 20, MODULEID: "MU221012772756", PAGEID: "PG221012151975" }, MODULEID: "MU221012772756", PAGEID: "PG221012151975",PUBLISHSTATUS:"1"
  }).then((res) => {
      notificationData.value = res.RESULT.RECORDS
    })
}

const clickMore = () => {
  router.push({
    path: '/PLAT_YW/notice',
  });
}

const clicknatification = (item) => {
  detailModalMsg.value = item.CONTENT
  detailModal.value = true
}

const handleClick = (e) => {
  console.log(e)
  getTranMateria()
}
// 左下角
const tranMateriaData = ref([])
const getTranMateria = () => {
  getTableData('tms/screenDisplay/getTranMateria', { qtype: activeName.value }
  )
    .then((res) => {
      tranMateriaData.value = res.RESULT
    })
}






const changeRadio = (e) => {
  getTranSportDate()
}
const getTranSportDate = () => {
  getTableData('tms/screenDisplay/getTranSportDate', { qtype: radio.value }
  )
    .then((res) => {

      // let CREATEDATE,TRANRECEIVED,TRANSIGN = []
      let CREATEDATE = []
      let TRANRECEIVED = []
      let TRANSIGN = []

      res.RESULT.forEach(ele => {
        CREATEDATE.push(ele.CREATEDATE)
        TRANRECEIVED.push(ele.TRANRECEIVED)
        TRANSIGN.push(ele.TRANSIGN)
      })
      console.log(CREATEDATE)
      TruckingOrder(CREATEDATE, TRANRECEIVED, TRANSIGN)

    })
}




const TruckingOrder = (CREATEDATE, TRANRECEIVED, TRANSIGN) => {
  // let chart = $echart.init(document.getElementById("truckingOrder"))
  // 基于准备好的dom，初始化echarts实例
  let chart = myEcharts.init(document.getElementById("truckingOrder"), "purple-passion");
  chart.setOption({
    // 设置图表的标题
    // title: {
    //   // 设置标题文本
    //   // text: "2021年各月份销售量（单位：件）",
    //   // title 组件离容器左侧的距离
    //   left: "center",
    // },
    // // 设置图表的 X 轴
    // xAxis: {
    //   // 数据类型为离散的类目数据
    //   type: "category",
    //   // 设置 X 轴数据
    //   data: [
    //     "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
    //   ]
    // },
    // // 设置提示框组件
    // tooltip: {
    //   // 设置提示框的触发条件
    //   trigger: "axis"
    // },
    // // 设置图表的 Y 轴
    // yAxis: {
    //   // 数据类型为连续的数值数据
    //   type: "value"
    // },
    // // 设置图表的图例
    // series: [
    //   {
    //     // 图例中要展示的数据
    //     data: [
    //       606, 542, 985, 687, 501, 787, 339, 706, 383, 684, 669, 737
    //     ],
    //     // 设置图表的类型为折线图
    //     type: "line",
    //     // 平滑曲线
    //     smooth: true,
    //     // 在顶部显示数据
    //     itemStyle: {
    //       normal: {
    //         label: {
    //           show: true,
    //           position: "top",
    //           formatter: "{c}"
    //         }
    //       }
    //     }
    //   }
    // ]


    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['派车数量', '签收量',],
    },
    color: ['#e08174', '#3d73e7',],
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      // feature: {
      //   mark: { show: true },
      //   dataView: { show: true, readOnly: false },
      //   magicType: { show: true, type: ['line', 'bar', 'stack'] },
      //   restore: { show: true },
      //   saveAsImage: { show: true }
      // }
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: CREATEDATE
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '派车数量',
        type: 'bar',
        barGap: 0,
        label: '派车数量',
        emphasis: {
          focus: 'series'
        },
        data: TRANSIGN,
        itemStyle: {
          //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
          normal: {
            //柱形图圆角，初始化效果
            // barBorderRadius: [10, 10, 0, 0]
          }
        },

      },
      {
        name: '签收量',
        type: 'bar',
        label: '签收量',
        emphasis: {
          focus: 'series'
        },
        data: TRANRECEIVED,
        itemStyle: {
          //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
          normal: {
            //柱形图圆角，初始化效果
            // barBorderRadius: [10, 10, 0, 0]
          }
        },
      },
    ]
  });
  // 大小自适应窗口大小变化
  window.onresize = function () {
    // 重置容器高宽
    chart.resize();
  };
}

// getDataA()
// function getDataA() {
//   getTableData('tms/screenDisplay/getTotalTranSport', {})
//     .then((res) => {
//       console.log(444, res);
//     })
// }



</script>

<style scoped lang="scss">
.welcome-img {
  max-width: 100%;
}

.disflex {
  display: flex;
  align-items: center;
}

.align-s {
  align-items: start;
}

.justify-sb {
  justify-content: space-between;
}

.mb-10 {
  margin-bottom: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}


.workbench {
  // background-color: #fff;
  color: #333;
  font-size: 14px;

  .top-num {
    font-size: 24px;
    color: #000;
    font-weight: bold;
    margin-right: 20px;
  }

  .top-title {
    font-size: 18px;
  }

  .image1 {
    width: 40px;
    height: 40px;
    margin-right: 10px;

  }

  .image2 {
    // width: 80px;
    height: 80px;
    margin-right: 10px;
  }

  .commonTitle {
    font-size: 20px;
    font-weight: bold;
    color: #000;
    margin-bottom: 20px;
  }

  &-top {
    padding: 20px;
    background-color: #fff;
    margin-bottom: 10px;

    display: grid;
    grid-template-columns: 65% 35%;
    // grid-template-rows: 100px 100px 100px;
    // grid-row-gap: 20px;
    // grid-column-gap: 10px;

    &-left {
      .statusData {
        display: grid;
        grid-template-columns: repeat(5, calc(20% - 10px));
        // grid-template-rows: 100px 100px 100px;
        // grid-row-gap: 20px;
        grid-column-gap: 10px;

      }

      &-block {
        background-color: #f8faff;
        padding: 10px 16px;

        &-img {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }

        &-title {
          font-size: 18px;
          color: #555;
        }

        &-num {
          font-size: 18px;
          color: #000;
          margin: 6px 0;
          font-weight: 500;
        }

        &-chain {
          font-size: 14px;
          color: #555;

        }
      }
    }

    &-right {
      display: grid;
      grid-template-columns: repeat(2, calc(50% - 10px));
      // grid-template-rows: 100px 100px 100px;
      grid-row-gap: 10px;
      grid-column-gap: 10px;

    }
  }

  &-bottom {
    display: grid;
    grid-template-columns: calc(70% - 10px) 30%;
    // grid-template-rows: 100px 100px 100px;
    // grid-row-gap: 20px;
    grid-column-gap: 10px;
    margin-bottom: 10px;

    &-left {
      // width: 68%;
      padding: 20px;
      background-color: #fff;

      display: grid;
      grid-template-columns: 60% 40%;
      // grid-template-rows: 100px 100px 100px;
      // grid-row-gap: 20px;
      grid-column-gap: 20px;

      // .lineRanking {}

      .allCategory {
        &-content {
          display: grid;
          grid-template-columns: repeat(2, calc(50% - 10px));
          // grid-template-rows: 100px 100px 100px;
          grid-row-gap: 10px;
          grid-column-gap: 10px;

          height: 300px;
          overflow-y: auto;

          &-alone {
            background-color: #f8faff;
            display: flex;
            align-items: center;
            padding: 6px 12px;

            &-image {
              width: 30px;
              // height: 30px;
              margin-right: 10px;
            }

            &-topText {
              font-size: 16px;
              color: #999;
            }

            &-bottomText {
              color: #000;
            }
          }
        }
      }

    }

    &-right {
      // width: 30%;
      padding: 20px;
      background-color: #fff;

      .notification {
        &-main {
          height: 300px;
          overflow-y: auto;
        }

        &-alone {
          margin: 10px 0;
          border-bottom: 1px dashed #ddd;
          padding-bottom: 5px;
        }

        &-more {
          color: #666;
          font-weight: 400;
          font-size: 16px;
          cursor: pointer;
        }

        &-title {
          color: #666;
          flex: 0;
          margin-right: 10px;
          white-space: nowrap;
        }

        &-content {
          color: #000;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
        }
      }
    }
  }

  &-tabOrChart {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    // grid-template-rows: 100px 100px 100px;
    // grid-row-gap: 20px;
    grid-column-gap: 10px;

    &-tab {
      background-color: #fff;
      padding: 20px;
    }

    &-chart {
      background-color: #fff;
      padding: 20px;


    }
  }

}
</style>
