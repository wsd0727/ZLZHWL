<template>
  <div class="mapCar">
    <el-form :inline="true" :model="formInline" size="default" class="demo-form-inline searchQuery">
      <el-form-item label="">
        <el-input v-model="formInline.carNo" placeholder="请输入车牌号" />
      </el-form-item>
      <el-form-item label="">
        <el-date-picker v-model="formInline.date" type="datetimerange" range-separator="至" value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间" :size="size" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="container"></div>
    <div class="input-card" v-if="mapPath.length">
      <h4>轨迹回放控制</h4>
      <MapPlayBack ref="PlayBackRef" :AmapRef="AMap" :mapRef="MapRef" :path="mapPath" />
    </div>
  </div>
</template>

<script setup>
import InitAMap from "@/utils/map"
import { shallowRef } from "@vue/reactivity";
import { getCartrack } from "@/api/system/cartrack";
import GPS from "@/utils/gpsToAmap";
import MapPlayBack from "@/components/Map/PlayBack"

const formInline = reactive({
  carNo: "",
  date: "",
});

const mapHeight = computed(() => window.innerHeight - 165 + 'px')

const AMap = shallowRef(null)
const MapRef = ref();
const map = ref(null);
const PlayBackRef = ref(null);
const infoWindow = ref(null)

const initMap = () => {
  InitAMap().then(AMapRes => {
    AMap.value = AMapRes
    AMap.value.plugin([
      "container",
      "AMap.ToolBar",
      "AMap.Scale",
      "AMap.MoveAnimation",
    ]);
    const map = new AMap.value.Map("container", {
      zoom: 6,
      resizeEnable: true,
      center: [116.397428, 39.90923],
    });
    MapRef.value = map;
  })
};
initMap()

const mapPath = ref([])
const addPolyLine = () => {
  MapRef.value.clearMap();
  let path = mapPath.value;
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
    endPath = path.slice(-1)[0];
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

  // 轨迹组件初始化
  PlayBackRef.value.Init()

  MapRef.value.add([polyline, startIcon, endIcon]);
  MapRef.value.setFitView();
}

// 打卡标记
function addDKMarker(CARSNUM) {
  let newMarkers = [];
  let textStyle = {
    fontSize: 12,
    fontWeight: "normal",
    fillColor: "#fff",
    padding: "2, 5",
    backgroundColor: "#409EFF",
    borderColor: "#fff",
    borderWidth: 1,
  };
  CARSNUM.forEach((car) => {
    var marker = new AMap.value.LabelMarker({
      name: car.STATUS,
      position: [car.LNG, car.LAT],
      zIndex: 16,
      offset: [-200, -500],
      text: {
        content: car.STATUS,
        direction: "center",
        style: textStyle,
      },
    }); w
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
}

const onSubmit = () => {
  let data = {
    CARSNAME: formInline.carNo,
    STARTTIME: formInline.date[0],
    ENDTIME: formInline.date[1],
  };
  getCartrack(data).then((res) => {
    let arr = [];
    if (res.RESULT) {
      let gps = res.RESULT.GPS;
      gps.forEach((el) => {
        let { lon, lat } = GPS.gcj_encrypt(Number(el.LAT), Number(el.LNG))
        arr.push([lon, lat]);
      });
      mapPath.value = arr;
    }
    if (arr.length) {
      addPolyLine();
    } else {
      MapRef.value.clearMap();
    }
    res.RESULT.MARKERS.length && addDKMarker(res.RESULT.MARKERS);
  });
};
</script>

<style lang="scss">
.mapCar {
  background: #fff;
}
.searchQuery {
  padding: 10px;
}
#container {
  height: v-bind(mapHeight);
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
