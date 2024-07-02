// 太阳客户分析看板
<template>
  <el-scrollbar :height="windowHeight">
    <el-row class="query board-bg" :gutter="10">
      <el-col span=".5">
        <el-date-picker v-model="DATEARR" type="daterange" value-format="YYYY-MM-DD" />
      </el-col>
    </el-row>

    <div class="board board-flex">
      <div class="board-item board-bg" style="width:25%">
        <div class="board-item">
          <div class="title board-flex board-flex-sb">
            <div class="title">客户类别</div>
            <div class="desc">
              <el-select v-model="KHTYPE">
                <el-option v-for="(item,index) in custType" :key="index" :label="item.LABEL" :value="item.VALUE"></el-option>
              </el-select>
            </div>
          </div>
          <div class="charts" id="KHLB"></div>
        </div>
        <div class="board-item">
          <div class="title">客户发货量</div>
          <div class="charts">
            <el-scrollbar class="list">
              <div class="list-item board-flex board-flex-center" v-for="(item,index) in KHFHLDATA" :key="index">
                <div class="no">{{index + 1}}</div>
                <div class="box">
                  <div class="title">{{item.VNAME}}</div>
                  <el-progress :percentage="((item.WEIGHT / total) * 100).toFixed(2)">
                    <span>{{item.WEIGHT.toFixed(4)}}万吨</span>
                  </el-progress>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="board-item board-bg" style="width:50%">
        <div id="map"></div>
      </div>
      <div class="board-item board-bg" style="width:25%">
        <div class="board-item">
          <div class="title">经销商</div>
          <div class="charts">
            <miniTable :data="JXSDATA" height="385px">
              <vxe-column type="seq" title="序号" width="50" align="center" show-overflow="tooltip" />
              <vxe-column field="VNAME" title="客户" min-width="150" align="left" show-overflow="tooltip" />
              <vxe-column field="CONTACTS" title="业务员" width="100" align="center" show-overflow="tooltip" />
            </miniTable>
          </div>
        </div>
        <div class="board-item">
          <div class="title">终端客户</div>
          <div class="charts">
            <miniTable :data="ZDKHDATA" height="385px">
              <vxe-column type="seq" title="序号" width="50" align="center" show-overflow="tooltip" />
              <vxe-column field="VNAME" title="客户" min-width="150" align="left" show-overflow="tooltip" />
              <vxe-column field="CONTACTS" title="业务员" width="100" align="center" show-overflow="tooltip" />
            </miniTable>
          </div>
        </div>
      </div>
    </div>

  </el-scrollbar>
</template>

<script setup>
import * as echarts from "echarts";
import InitAMap from "@/utils/map"
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "vue"
import miniTable from "@/components/Tables/mini"
import { getKHLB, getKHFHL, getKHMAP, getJXS, getZDKH } from "@/api/JDWL/Board/tykhfxkb"
import { GetDateAfter } from "@/utils"

const { proxy } = getCurrentInstance();
const windowHeight = computed(() => (window.innerHeight - 120))
const mapHeight = computed(() => (windowHeight.value - 80) + 'px')
const { custType } = proxy.useDict("custType")

const DATEARR = ref([GetDateAfter(-30), GetDateAfter(-1)])

const queryParams = computed(() => {
  return {
    DATEARR: DATEARR.value.join(",")
  }
})

// 客户类别
const KHTYPE = ref("")
const KHLBDATA = ref({})
const initKHLB = () => {
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
    dataset: KHLBDATA.value,
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
  let chart = echarts.init(document.getElementById("KHLB"));
  chart.setOption(options)
  // chart.on("mouseover", res => {
  //   console.log("🚀 ~ initAREA ~ res:", res)
  // })
}
const getKHLBDATA = () => {
  getKHLB({ ...queryParams.value, CUSTTYPE: KHTYPE.value }).then(res => {
    KHLBDATA.value = res.RESULT
    initKHLB()
  })
}

// 客户发货量
const KHFHLDATA = ref({})
const total = ref(0)
const getKHFHLDATA = () => {
  getKHFHL({ ...queryParams.value }).then(res => {
    KHFHLDATA.value = res.RESULT
    total.value = res.RESULT.reduce((tt, el) => {
      return tt + el.WEIGHT
    }, 0)
  })
}

// 客户map
const AMap = shallowRef(null)
const MapRef = ref(null)
const initMap = () => {
  InitAMap().then((res) => {
    AMap.value = res;
    const map = new AMap.value.Map("map", {
      viewMode: "2D",
      zoom: 6,
      center: [116.862416, 35.514942],
    });
    MapRef.value = map;
  });
};
initMap()
const KHMAPDATA = ref([])
const hasMAP = ref([])
const targetMapWindowInfo = data => {
  const infos = new AMap.value.InfoWindow({
    content: `<div>
      <div style="font-size:16px">${data.VNAME}</div>
      <div style="font-size:14px">业务经理：${data.CONTACTS} (${data.CONTACTTEL})</div>
      <div style="font-size:14px">地址：${data.ADDRESS}</div>
    </div>`,
    autoMove: true,
    offset: new AMap.value.Pixel(0, -10),
    showShadow: true,
    position: [data.new_LNGLAT[0], data.new_LNGLAT[1]],
    retainWhenClose: true
  })
  MapRef.value.add(infos);
  infos.open();
  data.isShow = true
}
const addMapMaker = () => {
  if (hasMAP.value.length == 0) return false
  const icons = new AMap.value.Icon({
    size: new AMap.value.Size(20, 20),
    image: new URL('../../../assets/images/map/point.png', import.meta.url).href,
    imageSize: new AMap.value.Size(20, 20),
  })
  hasMAP.value.forEach(el => {
    let marker = new AMap.value.Marker({
      position: [el.new_LNGLAT[0], el.new_LNGLAT[1]],
      offset: new AMap.value.Pixel(-10, -10),
      icon: icons,
      title: el.VNAME,
      extData: { ...el, isShow: false },
      clickable: true
    });
    marker.on('click', e => {
      let data = e.target.getExtData()
      targetMapWindowInfo(data)
    })
    MapRef.value.add(marker);
  })
}
const getKHMAPDATA = () => {
  getKHMAP(queryParams.value).then(res => {
    KHMAPDATA.value = res.RESULT
    hasMAP.value = KHMAPDATA.value.filter(el => el.LNGLAT && el.LNGLAT.includes(",")).map(el => {
      el.new_LNGLAT = el.LNGLAT.split(",")
      return el
    })
    hasMAP.value && addMapMaker()
  })
}

// 经销商
const JXSDATA = ref([])
const getJXSDATA = () => {
  getJXS(queryParams.value).then(res => {
    JXSDATA.value = res.RESULT
  })

}

// 终端客户
const ZDKHDATA = ref([])
const getZDKHDATA = () => {
  getZDKH(queryParams.value).then(res => {
    ZDKHDATA.value = res.RESULT
  })
}

watch(queryParams, val => {
  getKHLBDATA()
  getKHFHLDATA()
  getKHMAPDATA()
  getJXSDATA()
  getZDKHDATA()
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
  height: 390px;
}
#map {
  width: 100%;
  height: v-bind(mapHeight);
}
.list {
  &-item {
    .no {
      width: 50px;
      margin-right: 10px;
      text-align: center;
    }
    .title {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>