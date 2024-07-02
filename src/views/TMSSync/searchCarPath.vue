// 我找车对外开放-车辆轨迹查询
<template>
  <div class="map">
    <div id="map" style="width:100%;height:100%"></div>
    <div class="control" v-if="mapPath.length">
      <p>轨迹回放控制</p>
      <el-button @click="startAnimation" type="primary">开始回放</el-button>
      <el-button @click="pauseAnimation" type="primary">暂停回放</el-button>
      <el-button @click="resumeAnimation" type="primary">继续回放</el-button>
      <el-button @click="stopAnimation" type="primary">停止回放</el-button>
    </div>
  </div>
</template>

<script setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "@vue/reactivity";
import { deepClone } from "@/utils"
import Reg from "@/utils/reg"
const { proxy } = getCurrentInstance();
import request from '@/utils/request'
import GPS from "@/utils/gpsToAmap";

/** 
 * 地址栏参数 
 * @author piplns<piplns@163.com>
 * 必填
 * @param type 类型 [o-订单，t-时间]
 * @param showLocation 是否展示实时位置 Boolean 默认false
 * @param companyId 企业id
 * @param carNo 车牌号
 * 
 * type = o
 * 必填
 * @param transOrder 派车单
 * 
 * type = t 
 * 必填
 * @param startTime 开始节点
 * @param endTime 结束节点
 * 
 * 选填
 * @param companyName 企业名称
 * @param businessType 业务类型  1-采购 2-销售 3-调拨
 */

const route = useRoute()
const formData = ref({
  TYPE:"",
  CARSNAME:"",
  COMPANYID:"",
  TRANSORDER:"",
  COMPANYNAME:"",
  BUSINESSTYPE:"",
  SHOWLOCATION:false,
  STARTTIME:"",
  ENDTIME:"",
})

const AMap = shallowRef(null)
const MapRef = ref(null)

const key = "ad52cd2ca0c59d1f83ae03abb84c0796";

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
    const map = new AMap.value.Map("map", {
      viewMode: "2D",
      zoom: 10,
      center: [116.397527, 39.90798],
    });
    AMap.value.plugin([
      "container",
      "AMap.ToolBar",
      "AMap.Scale",
      "AMap.MoveAnimation",
    ]);
    MapRef.value = map;
  });
};
initMap()

const showLocation = ref(false) // 是否展示实时位置
const locationData = ref({}) // 实时位置数据

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
}

const mapPath = ref([])
const marker = ref()
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
    icon: new URL("../../assets/images/map/qd.png", import.meta.url).href,
    position: startPath,
    anchor: "bottom-center",
  });
  const endIcon = new AMap.value.Marker({
    icon: new URL("../../assets/images/map/zd.png", import.meta.url).href,
    position: endPath,
    anchor: "bottom-center",
  });
  // 汽车动画
  marker.value = new AMap.value.Marker({
    map: MapRef.value,
    position: startPath,
    icon: "https://webapi.amap.com/images/car.png",
    offset: new AMap.value.Pixel(-26, -13),
    angle: -90,
  });

  const passedPolyline = new AMap.value.Polyline({
    map: MapRef.value,
    //   path: lineArr,
    strokeColor: "#18DA88", //线颜色
    //   strokeOpacity: 1,     //线透明度
    strokeWeight: 6, //线宽
    //   strokeStyle: "solid"  //线样式
    isOutline: true,
    outlineColor: "#ffeeff",
    lineJoin: "round",
    lineCap: "round",
    showDir: true,
  });

  marker.value.on("moving", function (e) {
    passedPolyline.setPath(e.passedPath);
  });

  MapRef.value.add([polyline, startIcon, endIcon]);
  MapRef.value.setFitView();
};

// * 实时位置  10s刷新一次
const addLocation = (lnglat)=>{
  if(!lnglat) return false

}

const getData = () => {
  request({
    url: "/tms/tmsTransportPoints/getPointByCar",
    method: "post",
    data: formData.value
  }).then(res => {
    let arr = [];
    if (res.RESULT) {
      let gps = res.RESULT.GPS;
      gps.forEach((el) => {
        let { lon, lat } = GPS.gcj_encrypt(Number(el.LAT), Number(el.LNG))
        arr.push([lon, lat]);
      });
      mapPath.value = arr;
    }
    arr.length && addPolyLine();
    res.RESULT.MARKERS.length && addDKMarker(res.RESULT.MARKERS);
    (showLocation.value && res.RESULT.CARLOCATION) && addLocation(res.RESULT.CARLOCATION)
  })
}

const startAnimation = () => {
  marker.value.moveAlong(mapPath.value, 1000);
}
const pauseAnimation = () => {
  marker.value.pauseMove();
}
const resumeAnimation = () => {
  marker.value.resumeMove();
}
const stopAnimation = () => {
  marker.value.stopMove();
}

watch(() => route, val => {
  let UrlParams = deepClone(val.query)
  formData.value.TYPE = UrlParams.type
  formData.value.CARSNAME = UrlParams.carNo
  formData.value.COMPANYID = UrlParams.companyId
  formData.value.TRANSORDER = UrlParams.transOrder
  formData.value.COMPANYNAME = UrlParams.companyName
  formData.value.BUSINESSTYPE = UrlParams.businessType
  formData.value.SHOWLOCATION = UrlParams.showLocation == 'true'
  formData.value.STARTTIME = UrlParams.startTime
  formData.value.ENDTIME = UrlParams.endTime
  showLocation.value = formData.value.SHOWLOCATION
  if (formData.value.TYPE == 't' && (!formData.value.CARSNAME || !formData.value.STARTTIME || !formData.value.ENDTIME || !formData.value.COMPANYID)) return proxy.$$modal.msgError("参数不正确")
  if (formData.value.TYPE == 'o' && (!formData.value.COMPANYID || !formData.value.CARSNAME || !formData.value.TRANSORDER)) return proxy.$modal.msgError("参数不正确")
  let testCarno = Reg.CarNo.test(formData.value.CARSNAME)
  if (!testCarno) return proxy.$modal.msgError("车牌号不符合格式")
  getData()
}, {
  immediate: true,
})

</script>
<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  min-height: 800px;
}
.control {
  position: fixed;
  right: 30px;
  bottom: 30px;
  background: #fff;
  padding: 10px;
}
</style>