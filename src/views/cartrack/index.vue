<template>
  <div class="catrack-app">
    <el-form :inline="true" :model="formInline" class="demo-form-inline searchQuery">
      <el-form-item label="">
        <el-input v-model="formInline.carNo" placeholder="请输入车牌号" />
      </el-form-item>
      <el-form-item label="">
        <el-date-picker v-model="formInline.date" type="daterange" range-separator="至" value-format="YYYY-MM-DD" start-placeholder="开始时间" end-placeholder="结束时间" :size="size" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getAllcars">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="map">
      <div id="container"></div>
    </div>
    <!-- <mapComponent ref="mapRef" detail type="polyline" :path="path"  class="mapContent"/> -->
  </div>
</template>

<script setup>
import { shallowRef } from "@vue/reactivity";
import AMapLoader from "@amap/amap-jsapi-loader";
import { CARSNUM } from "@/api/carLine";
import mapComponent from "@/components/Map";
import { getCartrack } from "@/api/system/cartrack";
import { getDrivingCars } from "@/api/track";
const { proxy } = getCurrentInstance();
const { tmsNodeEnum } = proxy.useDict("tmsNodeEnum")
const formInline = reactive({
  carNo: "",
  date: "",
});

// 地图数据
const mapRef = ref(null);
const path = ref([]);

var textStyle = {
  fontSize: 12,
  fontWeight: "normal",
  fillColor: "#fff",
  padding: "2, 5",
  backgroundColor: "#409EFF",
  borderColor: "#fff",
  borderWidth: 1,
};

const ICON = {
  type: "image", // 图标类型，现阶段只支持 image 类型
  image: "https://webapi.amap.com/images/car.png", // 图片 url
  size: [60, 30], // 图片尺寸
  angle: -90,
  anchor: "bottom-center", // 图片相对 position 的锚点，默认为 bottom-center
};

// 信息窗体的内容

const allCars = ref([]);

const onSubmit = () => {
  let data = {
    CARNO: formInline.carNo,
    STARTTIME: formInline.date[0],
    ENDTIME: formInline.date[1],
  };
  getCartrack(data).then((res) => {
    path.value = res;
  });
  mapRef.value?.cleatAllMarker(); // 清空地图
  mapRef.value?.addMapMarker(); // 重新渲染
};

const key = "ad52cd2ca0c59d1f83ae03abb84c0796";
const AMap = shallowRef(null);
const MapRef = ref(null);
const initMap = () => {
  window._AMapSecurityConfig = {
    securityJsCode: "c5e5d345ca8e26921d9735d5246a88b4",
  };
  AMapLoader.load({
    key: key,
    version: "2.0",
    AMapUI: {
      version: "1.1",
    },
  }).then((res) => {
    AMap.value = res;
    const map = new AMap.value.Map("container", {
      viewMode: "3D",
      zoom: 5,
    });
    MapRef.value = map;
    getAllcars();
  });
};

function getAllcars() {
  let data = {
    CARNO: formInline.carNo,
    STARTTIME: formInline.date[0],
    ENDTIME: formInline.date[1],
  };
  getDrivingCars(data).then((res) => {
    allCars.value = res.RESULT;
    resetLabelMarker();
  });
}

function resetLabelMarker() {
  let newMarkers = [];
  allCars.value.forEach((car) => {
    var marker = new AMap.value.LabelMarker({
      name: car.CARNO,
      position: car.PATH,
      zIndex: 16,
      icon: ICON,
      offset: [-200, -500],
      text: {
        content: car.CARNO,
        direction: "center",
        style: textStyle,
      },
    });
    marker.on("click", function (e) {
      e.extData = car;
      openContent(e, car);
    });
    car.PATH?.length && newMarkers.push(marker);
  });
  const labelsLayer = new AMap.value.LabelsLayer({
    zooms: [3, 20],
    zIndex: 1000,
    collision: true, // 该层内标注是否避让
    allowCollision: true, // 设置 allowCollision：true，可以让标注避让用户的标注
  });

  labelsLayer.add(newMarkers);
  MapRef.value.add(labelsLayer);
}

function openContent(data, cars) {
  console.log(666, data, cars);
  let carsNews = data.data;
  let statusName = proxy.selectDictLabel(tmsNodeEnum.value, cars.BILLSTATUS);
  var CONTENT = [
    "<div><b class='car-bg'> " + carsNews.data.name + "</b>",
    "<div><span class='color-999'>状态：</span>" + statusName,
    "<span class='color-999'>司机：</span>" + cars.DRIVERNAME + "-" + cars.DRIVERPHONE,
    "<span class='color-999'>货物：</span>" + cars.MATERIALNAME,
    "<span class='color-999'>起点：</span>" + cars.SENDADDRESS,
    "<span class='color-999'>终点：</span>" + cars.RECVADDRESS,
    "<span class='color-999'>派车时间：</span>" + cars.CREATIONTIME,
    "<span class='color-999'>运输时间：</span>" + cars.STARTTRANSPORTTIME + "</div></div>",
  ];
  let infoWindow = new AMap.value.InfoWindow({
    content: CONTENT.join("<br>"), //使用默认信息窗体框样式，显示信息内容
  });
  infoWindow.open(MapRef.value, carsNews.data.position);
}

initMap();
</script>

<style lang="scss">
#container {
  height: calc(100vh - 120px);
}

.searchQuery {
  margin: 10px;
}
.mapContent {
  position: relative;
  top: 35px;
}
.catrack-app {
  background: #fff;
  padding: 3px;
  height: calc(100vh - 120px);
}
.car-bg {
  background-color: #ffdada;
  color: #ff6161;
  padding: 2px 3px;
}
.color-999 {
  color: #999;
}
</style>
