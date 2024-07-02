// 运力态势
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
            <div class="group-title">
              <div class="title">运力池</div>
            </div>
            <div class="group-content">
              <div class="group-item">
                <div class="group-title">
                  <div class="title">车辆运力</div>
                </div>
                <div class="group-board">
                  <div class="yunli">
                    <!-- 车辆运力图表 -->
                    <div id="yunli" style="width: 50%;height: 200px;"></div>
                    <div class="list">
                      <div class="list-item">
                        <span class="t">原车辆</span>
                        <div class="num all">{{YLallCars.COUNT}}</div>
                      </div>
                      <div class="list-item">
                        <span class="t">新增车辆</span>
                        <div class="num add">{{YLaddCars.COUNT}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="group-item">
                <div class="group-title">
                  <div class="title">车辆状态</div>
                </div>
                <div class="group-board">
                  <!-- 车辆状态 -->
                  <div class="status">
                    <div class="status-item">
                      <span class="t">在途车辆</span>
                      <div class="num ing">{{YLCLZZDATA.SEND || 0}}</div>
                    </div>
                    <div class="status-item">
                      <span class="t">未出发</span>
                      <div class="num no">{{YLCLZZDATA.WAIT_SEND || 0}}</div>
                    </div>
                    <div class="status-item">
                      <span class="t">回程</span>
                      <div class="num back">{{YLCLZZDATA.RETURN_TRIP || 0}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="group-item">
                <div class="group-title">
                  <div class="title">异常预警</div>
                </div>
                <div class="group-board">
                  <!-- 异常预警 -->
                  <template v-if="YCYJDATA.length">
                    <miniTable :data="YCYJDATA" height="305px">
                      <vxe-column field="CARNO" title="车号" width="100" align="center" show-overflow="tooltip" />
                      <vxe-column field="OWNERSHIP" title="车辆管理人" width="100" align="center" show-overflow="tooltip" />
                      <vxe-column field="OWNERSHIPTEL" title="电话" width="130" align="center" show-overflow="tooltip" />
                      <vxe-column field="VMEMO" title="异常状态" width="100" align="left" show-overflow="tooltip" />
                    </miniTable>
                  </template>
                  <el-empty v-else :image-size="50" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list-item center">
          <div class="group">
            <div class="group-title">
              <div class="title">总运力</div>
            </div>
            <div class="group-content">
              <div id="map"></div>
            </div>
          </div>
        </div>
        <div class="list-item right">
          <div class="group">
            <div class="group-title">
              <div class="title">片区车辆</div>
            </div>
            <div class="group-content">
              <div class="group-item">
                <div class="group-title">
                  <div class="title">车辆状态</div>
                </div>
                <div class="group-board">
                  <!-- 片区车辆状态图表 -->
                  <div id="areaCarStatus" style="width: 100%;height: 220px;"></div>
                </div>
              </div>
              <div class="group-item">
                <div class="group-title">
                  <div class="title">平均趟数</div>
                </div>
                <div class="group-board">
                  <!-- 片区车辆平均趟数图表 -->
                  <div id="areaCarsNum" style="width: 100%;height: 220px;"></div>
                </div>
              </div>
              <div class="group-item">
                <div class="group-title">
                  <div class="title">省份车辆</div>
                </div>
                <div class="group-board" style="height:275px">
                  <!-- 省份车辆 -->
                  <template v-if="SFCLDATA.length">
                    <miniTable :data="SFCLDATA" height="275px">
                      <vxe-column field="SF" title="所在省份" align="left" show-overflow="tooltip" />
                      <vxe-column field="ONLINE" title="在线" align="left" show-overflow="tooltip" />
                      <vxe-column field="OFFLINE" title="离线" align="left" show-overflow="tooltip" />
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
  </el-scrollbar>
</template>

<script setup>
import InitAMap from "@/utils/map"
import * as echarts from "echarts";
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "@vue/reactivity";
let myEcharts = echarts;
import miniTable from "@/components/Tables/mini"
import GPS from "@/utils/gpsToAmap";
import { getAreaData, getCLYL, getYLCCLZZ, getCLZZ, getYCYL, getZYL, getPJTS, getSFCL } from "@/api/JDWL/Board/ylstkb"
import { GetDateAfter } from "@/utils"

const windowHeight = computed(() => (window.innerHeight - 120))
const mapHeight = computed(() => (windowHeight.value - 100) + 'px')

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

/** Map */
const AMap = shallowRef(null)
const MapRef = ref(null)
const initMap = () => {
  InitAMap().then((res) => {
    AMap.value = res;
    const map = new AMap.value.Map("map", {
      viewMode: "2D",
      zoom: 10,
      center: [116.397527, 39.90798],
    });
    MapRef.value = map;
  });
};
initMap()

/** map 车辆标记  */
const addMarker = (arr) => {
  MapRef.value.clearMap();
  if (!arr) return
  let newMarkers = [];
  let textStyle = {
    fontSize: 14,
    fontWeight: "normal",
    fillColor: "#fff",
    padding: "2,5",
    backgroundColor: "#409EFF",
    borderColor: "#fff",
    borderWidth: 1,
  };
  arr.forEach((car) => {
    if (car.STATUS != '1') return
    let { lat, lon } = GPS.gcj_encrypt(Number(car.LAT), Number(car.LNG))
    var marker = new AMap.value.LabelMarker({
      name: car.CARNO,
      position: [lon, lat],
      zIndex: 16,
      offset: [-200, -500],
      text: {
        content: car.CARNO,
        direction: "center",
        style: textStyle,
      },
    });
    marker.on("click", function (e) {
      // openContent(e);
    });
    newMarkers.push(marker);
  });
  const labelsLayer = new AMap.value.LabelsLayer({
    zooms: [3, 20],
    zIndex: 1000,
    collision: true, // 该层内标注是否避让
    allowCollision: true, // 设置 allowCollision：true，可以让标注避让用户的标注
  });
  labelsLayer.add(newMarkers);
  MapRef.value.add(labelsLayer);
  MapRef.value.setFitView();
}

/** 车辆运力 */
const CLYLDATA = ref([])
const YLallCars = ref({})
const YLaddCars = ref({})
const initCLYL = () => {
  let data = (YLaddCars.value.COUNT / YLallCars.value.COUNT) * 100
  data = Number(data.toFixed(1))
  let option = {
    title: {
      text: data + "%",
      left: 'center',
      top: 75,
      textStyle: {
        fontSize: '30px',
        color: '#00b578'
      },
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
          { value: Math.abs(data), itemStyle: { color: '#00b578' } },
          { value: 100 - data, itemStyle: { color: '#1964f8' } },
        ],
        label: {
          show: false,
        },
        itemStyle: {
          borderWidth: 1,
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
  let chart = myEcharts.init(document.getElementById("yunli"), "shine");
  chart.clear()
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}
const getCLYLDATA = () => {
  getCLYL({
    DATE_TYPE: "3",
    DATE: dateTime.value
  }).then(res => {
    CLYLDATA.value = res.RESULT
    YLallCars.value = res.RESULT.find(el => el.TYPE == '1')
    YLaddCars.value = res.RESULT.find(el => el.TYPE == '2')
    initCLYL()
  })
}

/** 运力池 车辆状态 */
const YLCLZZDATA = ref({})
const getYLCLZZ = () => {
  getYLCCLZZ({
    PK_AREA: PK_AREA.value
  }).then(res => {
    console.log("🚀 ~ getYLCLZZ ~ res:", res)
    YLCLZZDATA.value = res.RESULT
  })
}


/** 车辆状态 */
const CLZTDATA = ref([])
const initAREACARSTATUSDATA = () => {
  /** 片区车辆状态图表 */
  let type1 = [], type2 = [], type3 = [];
  for (let i = 0; i < CLZTDATA.value.length; i++) {
    const el = CLZTDATA.value[i];
    let { AREA, PK_AREA, SUBLIST } = el
    let [Type1, Type2, Type3] = SUBLIST
    Type1.value = Number(Type1.COUNT)
    Type2.value = Number(Type2.COUNT)
    Type3.value = Number(Type3.COUNT)
    type1.push({ AREA, PK_AREA, ...Type1 })
    type2.push({ AREA, PK_AREA, ...Type2 })
    type3.push({ AREA, PK_AREA, ...Type3 })
  }
  /** SUBLIST TYPE  1-原车 2-新增 3-销户 */
  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    grid: {
      left: 30,
      right: 30,
      bottom: 30,
      top: 30,
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: CLZTDATA.value.map(el => el.AREA)
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    dataZoom: [
      {
        show: true,
        start: 0,
        end: 50
      },
    ],
    series: [
      {
        name: '原车辆',
        type: 'bar',
        stack: 'car',
        emphasis: {
          focus: 'series'
        },
        data: type1
      },
      {
        name: '新增',
        type: 'bar',
        stack: 'car',
        emphasis: {
          focus: 'series'
        },
        data: type2
      },
      {
        name: '销户',
        type: 'bar',
        stack: 'car',
        emphasis: {
          focus: 'series'
        },
        data: type3
      }
    ]
  }
  let chart = myEcharts.init(document.getElementById("areaCarStatus"), "shine");
  chart.clear()
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}
const getCLZTDATA = () => {
  getCLZZ({
    DATE_TYPE: "3",
    DATE: dateTime.value
  }).then(res => {
    CLZTDATA.value = res.RESULT
    initAREACARSTATUSDATA()
  })
}

/** 异常预警 */
const YCYJDATA = ref([])
const getYCYJDATA = () => {
  getYCYL().then(res => {
    YCYJDATA.value = res.RESULT
  })
}

/** 总运力 */
const ZYLDATA = ref([])
const getZYLDATA = () => {
  getZYL({
    PK_AREA: PK_AREA.value
  }).then(res => {
    ZYLDATA.value = res.RESULT
    addMarker(ZYLDATA.value.CARLIST)
  })
}

/** 平均趟数  */
const AREAPJTSDATA = ref([])
const initAREAPJTSDATA = () => {
  let data = AREAPJTSDATA.value.map(el => el.COUNT)
  let name = AREAPJTSDATA.value[0].AREA
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
      name: "趟数",
      type: 'value'
    },
    grid: {
      top: 30,
      bottom: 30,
      left: 30,
      right: 30
    },
    series: [
      {
        name: name,
        data: data,
        type: 'line'
      }
    ]
  };
  let chart = myEcharts.init(document.getElementById("areaCarsNum"), "shine");
  chart.clear()
  chart.setOption(option)
  window.onresize = function () {
    chart.resize();
  };
}
const getAREAPJTSDATA = () => {
  getPJTS({
    PK_AREA: PK_AREA.value,
    YEAR: dateTime.value,
    AREA: ""
  }).then(res => {
    AREAPJTSDATA.value = res.RESULT
    initAREAPJTSDATA()
  })
}

/** 省份车辆 */
const SFCLDATA = ref([])
const getSDCLDATA = () => {
  getSFCL({
    PK_AREA: PK_AREA.value
  }).then(res => {
    SFCLDATA.value = res.RESULT
  })
}

watch(PK_AREA, val => {
  if (val == '') return
  getYLCLZZ() // 运力池车辆状态
  getZYLDATA() // 总运力
  getCLZTDATA() // 车辆状态
  getAREAPJTSDATA() // 平均趟数
  getSDCLDATA() // 省份车辆
})

/** 初始化 */
const Init = () => {
  getCLYLDATA() // 车辆运力
  getYCYJDATA() // 异常预警
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
    .left,
    .right {
      width: 30%;
    }
    // .list-item {
    //   flex: 0.3;
    // }
    .center {
      width: 40%;
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
.yunli {
  display: flex;
  align-items: stretch;
  .list {
    flex: 1;
    padding: 10px;
    &-item {
      border: 1px solid #f1f1f1;
      margin-bottom: 10px;
      padding: 10px;
      .num {
        font-size: 32px;
        text-align: right;
        font-weight: bold;
        &::after {
          content: "辆";
          font-size: 18px;
        }
        &.all {
          color: #1964f8;
        }
        &.add {
          color: #00b578;
        }
      }
    }
  }
}
.status {
  width: 100%;
  height: 200px;
  display: flex;
  flex-wrap: wrap;
  &-item {
    width: calc((100% - 26px) / 2);
    margin: 6px;
    padding: 10px;
    border: 1px solid #f1f1f1;
    &:first-child {
      width: 100%;
    }
    .num {
      font-size: 32px;
      text-align: right;
      font-weight: bold;
      &::after {
        content: "辆";
        font-size: 18px;
      }
      &.ing {
        color: #00b578;
      }
      &.no {
        color: #f93a4a;
      }
      &.back {
        color: #ff8f1f;
      }
    }
  }
}
#map {
  width: 100%;
  height: v-bind(mapHeight);
}
</style>