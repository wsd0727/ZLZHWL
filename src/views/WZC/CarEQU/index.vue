<template>
<!-- // 车载设备信息 -->

  <div class="CarEQU">
    <div class="query">
      <el-form ref="formRef" :model="queryForm" inline size="default" :rules="rules" :disabled="isLoading">
        <el-form-item label="车牌号" prop="carno">
          <el-input v-model="queryForm.carno" style="width:150px" @blur="setupcarno()" clearable></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="dateArr">
          <el-date-picker v-model="queryForm.dateArr" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledDate" style="width:370px" />
        </el-form-item>
        <el-form-item>
          <el-button @click="getData" type="primary" size="Default">查找</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="map">
      <div id="map"></div>
      <div class="input-card">
        <div class="card-title">轨迹回放控制</div>
        <MapPlayBack ref="PlayBackRef" :AmapRef="AMap" :mapRef="MapRef" :path="playPath" :speed="false" :progress="false" />
      </div>
    </div>
    <div class="charts">
      <div class="title">时间、载重(吨)速度曲线</div>
      <div id="charts"></div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import MapPlayBack from "@/components/Map/PlayBack.vue"
import InitAMap from "@/utils/map"
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "vue"
import request from "@/utils/request";
import REG from "@/utils/reg";

const windowHeight = computed(() => (window.innerHeight - 200) / 2 + 'px')

const formRef = ref(null)
const isLoading = ref(false)
const rules = {
  carno: [{ required: true, message: '请输入', trigger: 'blur' }, { pattern: REG.CarNo, message: "车牌号格式不正确", }],
  dateArr: [{ required: true, message: '请选择', trigger: 'blur' },
  {
    validator: (rule, value, callback) => {
      const d1 = new Date(value[0])
      const d2 = new Date(value[1])
      if ((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24) > 3) {
        callback('时间跨度不可大于3天')
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
  ]
}
const queryForm = ref({
  carno: "",
  dateArr: []
})
const setupcarno = () => {
  queryForm.value.carno = queryForm.value.carno.toUpperCase()
}
const disabledDate = (time) => {
  return time.getTime() > Date.now();
};

const AMap = shallowRef(null)
const MapRef = ref(null)
const PlayBackRef = ref(null)
const initMap = () => {
  InitAMap().then((res) => {
    AMap.value = res;
    const map = new AMap.value.Map("map", {
      viewMode: "2D",
      zoom: 6,
      center: [116.397527, 39.90798],
    });
    AMap.value.plugin([
      "container",
      "AMap.MoveAnimation",
    ]);
    MapRef.value = map;
  });
};
initMap()

const mapPath = ref([])
const playPath = computed(() => mapPath.value.map((item) => [Number(item.longitude), Number(item.latitude)]))
const addPath = () => {
  MapRef.value.clearMap();
  let path = playPath.value
  const polyline = new AMap.value.Polyline({
    path: path,
    isOutline: true,
    outlineColor: "#ffeeff",
    borderWeight: 1,
    strokeColor: "#f93a4a",
    strokeOpacity: 1,
    strokeWeight: 7,
    // 折线样式还支持 'dashed'
    strokeStyle: "solid",
    // strokeStyle是dashed时有效
    // strokeDasharray: [10, 5],
    lineJoin: "round",
    lineCap: "round",
    showDir: true,
  });
  let startPath = path[0],
    endPath = path[path.length - 1];
  const startIcon = new AMap.value.Marker({
    icon: new URL("@/assets/images/map/qd.png", import.meta.url).href,
    position: startPath,
    anchor: "bottom-center",
  });
  const endIcon = new AMap.value.Marker({
    icon: new URL("@/assets/images/map/zd.png", import.meta.url).href,
    position: endPath,
    anchor: "bottom-center",
  });
  PlayBackRef.value.Init()
  MapRef.value.add([polyline, startIcon, endIcon]);
  MapRef.value.setFitView();
}

const hexToRgba = (hex, opacity) => {
  let rgbaColor = "";
  let reg = /^#[\da-f]{6}$/i;
  if (reg.test(hex)) {
    rgbaColor = `rgba(${parseInt("0x" + hex.slice(1, 3))},${parseInt(
      "0x" + hex.slice(3, 5)
    )},${parseInt("0x" + hex.slice(5, 7))},${opacity})`;
  }
  return rgbaColor;
}

const initEcharts = () => {
  const color = ["#8B5CFF", "#00CA69"]
  const options = {
    color: color,
    legend: {
      top: 20,
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        let html = '';
        params.forEach(v => {
          html +=
            `<div style="color: #666;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color[v.componentIndex]};"></span>
                ${v.seriesName}${v.name}  
                <span style="color:${color[v.componentIndex]};font-weight:700;font-size: 18px;margin-left:5px">${v.value}</span>${v.seriesName == "载重曲线" ? '吨' : 'km/h'}`;
        })
        return html
      },
      extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: '#ffffff',
          shadowColor: 'rgba(225,225,225,1)',
          shadowBlur: 5
        }
      }
    },
    grid: {
      top: 80,
      left: 30,
      bottom: 20,
      right: 50,
      containLabel: true
    },
    xAxis: [{
      type: "category",
      boundaryGap: false,
      axisLabel: {
        formatter: '{value}',
        textStyle: {
          color: "#333"
        }
      },
      axisLine: {
        lineStyle: {
          color: "#D9D9D9"
        }
      },
      data: mapPath.value.map(el => el.locTime)
    }],
    yAxis: [{
      type: "value",
      axisLabel: {
        textStyle: {
          color: "#666"
        }
      },
      nameTextStyle: {
        color: "#666",
        fontSize: 12,
        lineHeight: 40
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#E9E9E9"
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    }],
    series: [
      {
        name: "载重曲线",
        type: "line",
        smooth: true,
        symbolSize: 8,
        zlevel: 3,
        lineStyle: {
          normal: {
            color: color[0],
            shadowBlur: 3,
            shadowColor: hexToRgba(color[0], 0.5),
            shadowOffsetY: 8
          }
        },
        symbol: 'circle', //数据交叉点样式
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [{
                offset: 0,
                color: hexToRgba(color[0], 0.3)
              },
              {
                offset: 1,
                color: hexToRgba(color[0], 0.1)
              }
              ],
              false
            ),
            shadowColor: hexToRgba(color[0], 0.1),
            shadowBlur: 10
          }
        },
        data: mapPath.value.map(el => el.loadWeight)
      },
      {
        name: "速度曲线",
        type: "line",
        smooth: true,
        symbolSize: 8,
        zlevel: 3,
        lineStyle: {
          normal: {
            color: color[1],
            shadowBlur: 3,
            shadowColor: hexToRgba(color[1], 0.5),
            shadowOffsetY: 8
          }
        },
        symbol: 'circle', //数据交叉点样式 (实心点)
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [{
                offset: 0,
                color: hexToRgba(color[1], 0.3)
              },
              {
                offset: 1,
                color: hexToRgba(color[1], 0.1)
              }
              ],
              false
            ),
            shadowColor: hexToRgba(color[1], 0.1),
            shadowBlur: 10
          }
        },
        data: mapPath.value.map(el => el.speed)
      }
    ]
  }
  let chart = echarts.init(document.getElementById("charts"));
  chart.setOption(options)
}

const getData = () => {
  formRef.value.validate(valid => {
    if (!valid) return
    isLoading.value = true
    request({
      url: "/tms/tmsTransportPoints/getDeviceInfoByCar",
      method: "post",
      data: {
        CARSNAME: queryForm.value.carno,
        STARTDATE: queryForm.value.dateArr[0],
        ENDDATE: queryForm.value.dateArr[1]
      }
    }).then(res => {
      mapPath.value = res.RESULT.DEVICEINFO
      if (mapPath.value.length > 0) {
        setTimeout(() => {
          addPath()
          initEcharts()
        }, 100)
      }
    }).finally(() => {
      isLoading.value = false
    })
  })
}


</script>
<style lang="scss" scoped>
.CarEQU {
  width: 100%;
  background: #fff;
  padding: 10px;
  box-sizing: border-box;
  .title {
    background: var(--el-color-primary);
    color: #fff;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
    font-size: 16px;
  }
  .query {
    margin-bottom: 20px;
  }
  #map,
  #charts {
    width: 100%;
    height: v-bind(windowHeight);
  }
}
.map {
  position: relative;
}
.input-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border-radius: 0.25rem;
  border-width: 0;
  border-radius: 0.4rem;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 0.75rem 1.25rem;
  .card-title {
    margin-bottom: 5px;
  }
  .mt-10 {
    margin-top: 10px;
  }
}
</style>