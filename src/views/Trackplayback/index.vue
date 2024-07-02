<template>
  <div class="mapCar">
    <el-form :inline="true" :model="formInline" class="demo-form-inline searchQuery">
      <el-form-item label="">
        <el-input v-model="formInline.carNo" placeholder="请输入车牌号" />
      </el-form-item>
      <el-form-item label="">
        <el-date-picker v-model="formInline.date" type="daterange" range-separator="至" value-format="YYYY-MM-DD" start-placeholder="开始时间" end-placeholder="结束时间" :size="size" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="container"></div>
    <div class="input-card">
      <h4>轨迹回放控制</h4>
      <div class="input-item">
        <input type="button" class="btn" value="开始动画" id="start" @click="startAnimation()" />
        <input type="button" class="btn" value="暂停动画" id="pause" @click="pauseAnimation()" />
      </div>
      <div class="input-item">
        <input type="button" class="btn" value="继续动画" id="resume" @click="resumeAnimation()" />
        <input type="button" class="btn" value="停止动画" id="stop" @click="stopAnimation()" />
      </div>
    </div>
  </div>
</template>

<script setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import { getCartrack } from "@/api/system/cartrack";
const key = "f72d3b331458a54999b38c33c98aa7df";
const path = ref([]);
const formInline = reactive({
  carNo: "",
  date: "",
});
const lineArr = [
  [116.478935, 39.997761],
  [116.478939, 39.997825],
  [116.478912, 39.998549],
  [116.478912, 39.998549],
  [116.478998, 39.998555],
  [116.478998, 39.998555],
  [116.479282, 39.99856],
  [116.479658, 39.998528],
  [116.480151, 39.998453],
  [116.480784, 39.998302],
  [116.480784, 39.998302],
  [116.481149, 39.998184],
  [116.481573, 39.997997],
  [116.481863, 39.997846],
  [116.482072, 39.997718],
  [116.482362, 39.997718],
  [116.483633, 39.998935],
  [116.48367, 39.998968],
  [116.484648, 39.999861],
];
const MapRef = ref();
const map = ref(null);
const marker = ref(null);
const infoWindow = ref(null)
const initMap = () => {
  window._AMapSecurityConfig = {
    securityJsCode: "60e3b3dbaa5c6e69aa05481d86e35ccb",
  };
  AMapLoader.load({
    key: key,
    version: "2.0",
  }).then((res) => {
    AMap.value = res;
    const map = new AMap.value.Map("container", {
      zoom: 17,
      resizeEnable: true,
      center: [116.397428, 39.90923],
    });
    MapRef.value = map;
    marker.value = new AMap.value.Marker({
      map: MapRef.value,
      position: [116.478935, 39.997761],
      icon: "https://webapi.amap.com/images/car.png",
      offset: new AMap.value.Pixel(-26, -13),
      autoRotation: true,
      angle: -90,
    });
    marker.value.on("click", function (e) {
      console.log(e);
      openContent(e);
    });
    const polyline = new AMap.value.Polyline({
      map: MapRef.value,
      path: lineArr,
      showDir: true,
      strokeColor: "#008dff", //线颜色
      //   strokeOpacity: 1, //线透明度
      strokeWeight: 6, //线宽
      //   strokeStyle: "solid", //线样式
    });
    const passedPolyline = new AMap.value.Polyline({
      map: MapRef.value,
      //   path: lineArr,
      strokeColor: "#18DA88", //线颜色
      //   strokeOpacity: 1,     //线透明度
      strokeWeight: 6, //线宽
      //   strokeStyle: "solid"  //线样式
    });
    MapRef.value.add([polyline]);
    MapRef.value.add([passedPolyline]);
    marker.value.on("moving", function (e) {
      passedPolyline.setPath(e.passedPath);
    });
    MapRef.value.setFitView();
    AMap.value.plugin([
      //   "container",
      //   "AMap.PlaceSearch",
      //   "AMap.AutoComplete",
      //   "AMap.ToolBar",
      //   "AMap.Scale",
      //   "AMap.CircleEditor",
      //   "AMap.PolygonEditor",
      //   "AMap.DistrictLayer",
      //   "AMap.Geocoder",
      "AMap.MoveAnimation",
    ]);
    // setTimeout(() => {
    //     addMapMarker();
    //   }, 500);
    // })
    // .catch((err) => {
    //   console.error("Error:地图初始化失败:", err);
  });
};

function openContent(data) {
  console.log(666, data);
  // let statusName = proxy.selectDictLabel(tmsNodeEnum.value, cars.BILLSTATUS);
  var CONTENT = [
    "<div><b class='car-bg'> " + '晋A12345' + "</b>",
    "<div><span class='color-999'>状态：</span>" + '开始运输',
    "<span class='color-999'>司机：</span>" + '张三' + "-" + '19012341234',
    "<span class='color-999'>货物：</span>" + '煤炭',
    "<span class='color-999'>起点：</span>" + '银川市金凤区建材大厦',
    "<span class='color-999'>终点：</span>" + '山西省小店区南中环街道清空创新基地',
    "<span class='color-999'>派车时间：</span>" + '2023-12-07 17:10:17',
    "<span class='color-999'>运输时间：</span>" + '2023-12-07 17:10:17' + "</div></div>",
  ];
  infoWindow.value = new AMap.value.InfoWindow({
    content: CONTENT.join("<br>"), //使用默认信息窗体框样式，显示信息内容
  });
  infoWindow.value.open(MapRef.value, data.target._position);
}

function startAnimation() {
  marker.value.moveAlong(lineArr, {
    // 每一段的时长
    duration: 500,//可根据实际采集时间间隔设置  
    // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
    autoRotation: true,
    angle: -90,
  })
  infoWindow.value.close()
}
function pauseAnimation() {
  marker.value.pauseMove();
}
function resumeAnimation() {
  marker.value.resumeMove();
}
function stopAnimation() {
  marker.value.stopMove();
}
const onSubmit = () => {
  let data = {
    CARNO: formInline.carNo,
    STARTTIME: formInline.date[0],
    ENDTIME: formInline.date[1],
  };
  getCartrack(data).then((res) => {
    path.value = res;
  });
  //   path.value = [
  //     [116.362209, 39.887487],
  //     [116.422897, 39.878002],
  //     [116.372105, 39.90651],
  //     [116.428945, 39.89663],
  //   ];
  mapRef.value.cleatAllMarker(); // 清空地图
  mapRef.value.addMapMarker(); // 重新渲染

  //   console.log("submit!", formInline);
};
// // 销毁地图
// const clearMap = () => {
//   MapRef.value.clearMap();
//   MapRef.value.destroy();
// };
// onUnmounted(() => {
//   clearMap();
// });
setTimeout(() => {
  initMap();
}, 1000);
</script>

<style lang="scss">
.mapCar {
  background: #fff;
}
.searchQuery {
  padding: 10px;
}
#container {
  height: 800px;
  width: 100%;
}

.input-card .btn {
  margin-right: 1.2rem;
  width: 9rem;
}

.input-card .btn:last-child {
  margin-right: 0;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  background-color: transparent;
  background-image: none;
  color: #25a5f7;
  border-color: #25a5f7;
  padding: 0.25rem 0.5rem;
  line-height: 1.5;
  border-radius: 1rem;
  -webkit-appearance: button;
  cursor: pointer;
}

.input-item {
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  height: 3rem;
}

.input-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border-radius: 0.25rem;
  width: 22rem;
  border-width: 0;
  border-radius: 0.4rem;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 0.75rem 1.25rem;
}
</style>
