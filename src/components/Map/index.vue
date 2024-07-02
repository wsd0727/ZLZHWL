<template>
  <div class="map">
    <div id="container" :style="{'height':height}"></div>
    <map-search ref="mapSearchRef" v-if="search && !detail" :AMap="AMap" :mapRef="MapRef" @change="changeMap" @closeedit="closeEdit" />
    <map-edit ref="mapEditRef" v-if="edit && !detail && (type == 'circle' || type == 'polygon')" :AMap="AMap" :mapRef="MapRef" :type="mapType" @change="changeMap" />
  </div>
</template>

<script setup name=''>
import { shallowRef } from '@vue/reactivity'
import InitAMap from "@/utils/map" // 全局配置读取Key
import mapSearch from "./search.vue"
import mapEdit from "./edit.vue"

const props = defineProps({
  height: {
    type: String,
    default: '600px'
  },
  type: {
    type: String,
    default: "point",
  },
  detail: {
    type: Boolean,
    default: false
  },
  search: {
    type: Boolean,
    default: true
  },
  edit: {
    type: Boolean,
    default: false
  },
  zoom: {
    type: Number,
    default: 10
  },
  center: {
    type: Array,
    default: [116.397527, 39.90798]
  },
  path: {
    type: Array,
    default: []
  },
  radius: {
    type: Number,
    default: 1000
  },
  adcode: {
    type: [Array, String],
    default: "110000"
  },
  searchBeforeEditInit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(["change"]);

const mapType = computed(() => props.type)
const mapRadius = computed(() => props.radius)
provide("type", mapType)
provide("radius", mapRadius)

watch(mapType, (val) => {
  closeEdit()
  setTimeout(() => {
    cleatAllMarker()
    addMapMarker()
  }, 200)
})

watch(() => props.adcode, (val, oldval) => {
  if (props.type != 'region') return
  if (JSON.stringify(val) == JSON.stringify(oldval)) return
  cleatAllMarker()
  addMapMarker()
})

watch(() => props.detail, val => {
  if (val) return
  mapEditRef.value && mapEditRef.value.endEdit(true)
})

// map实例
const AMap = shallowRef(null)
const UI = ref(null)
// 当前地图
const MapRef = ref()
const EditRef = ref(null)
const districtExplorer = ref(null)

const mapSearchRef = ref(null)
const mapEditRef = ref(null)

const initMap = () => {
  InitAMap().then(AMapRes => {
    AMap.value = AMapRes
    UI.value = AMapUI
    const map = new AMap.value.Map("container", {
      viewMode: "3D",
      zoom: props.zoom,
      center: props.center.length ? props.center : [116.397527, 39.90798]
    });
    map.on('click', mapClick);
    MapRef.value = map
    AMap.value.plugin(["AMap.PlaceSearch",
      "AMap.CitySearch",
      "AMap.AutoComplete",
      "AMap.ToolBar",
      "AMap.Scale",
      "AMap.CircleEditor",
      "AMap.PolygonEditor",
      "AMap.Geocoder"], () => {
        nextTick(() => {
          MapRef.value.addControl(new AMap.value.Scale()); // 比例尺
          mapSearchRef.value.init()
        })
      });
    UI.value.loadUI(['geo/DistrictExplorer'], (DistrictExplorer) => {
      UI.value.DistrictExplorer = DistrictExplorer
      districtExplorer.value = new UI.value.DistrictExplorer({ map: MapRef.value })
      addMapMarker()
    })
  })
}

// 地图点击
const mapClick = e => {
  if (props.type == 'region') return
  let center = e.lnglat.toArray()
  if (props.edit && (!props.detail && mapType.value == 'circle' || mapType.value == 'polygon') && (mapEditRef.value && mapEditRef.value.isEdit)) {
    mapEditRef.value.endEdit(true)
    setCenter(center)
    setTimeout(() => {
      cleatAllMarker()
      initEdit(center)
    }, 200)
  } else if (mapType.value == 'point') {
    cleatAllMarker()
    // setCenter(center)
    setTimeout(() => {
      initEdit(center)
    }, 200)
  }
}

// 覆盖物 相关
// 添加覆盖物
const addMapMarker = (center) => {
  if (!center) center = props.center.length ? props.center : MapRef.value?.getCenter().toArray()
  switch (props.type) {
    case "point":  // 点
      addPoint(center)
      break;
    case "polyline":  // 折线
      addPolyLine()
      break;
    case "circle":  // 圆形
      addCircle(center)
      break;
    case "polygon": // 多边形
      addPolygon(center)
      break;
    case "region": // 行政区
      addRegion()
      break
  }
}
// 清除全部覆盖物
const cleatAllMarker = () => {
  MapRef.value?.clearMap()
}

// 转化数据
const initPath = (center) => {
  if (!center) center = MapRef.value?.getCenter().toArray()
  // if (mapType.value != 'region' && !Array.isArray(props.path)) props.path = props.path.length ? JSON.parse(props.path) : center
  let path = [];
  switch (mapType.value) {
    default:
    case "point": // 点
      path = Array.isArray(props.path) && props.path.length ? props.path : center
      break;
    case "circle":  // 圆形
      path = Array.isArray(props.path) && props.path.length ? props.path : center
      break;
    case "polygon": // 多边形
      path = Array.isArray(props.path) && props.path.length >= 3 ? props.path : [center, [center[0] + 0.01, center[1] + 0.01], [center[0] + 0.02, center[1]]]
      break;
    case "region":
      path = Array.isArray(props.adcode) ? props.adcode.slice(-1) : props.adcode.split(",").slice(-1)
      break;
  }
  return path
}
const mapPath = val => {
  let [lng, lat] = val
  return new AMap.value.LngLat(lng, lat)
}
// 经纬度转地址
const mapPathToAddress = (val) => {
  return new Promise(resolve => {
    let geocoder = new AMap.value.Geocoder({
      city: '全国'
    })
    geocoder.getAddress(val, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        let { addressComponent, formattedAddress } = result.regeocode
        resolve({
          address: formattedAddress,
          adcode: addressComponent.adcode,
          adcodeAddress: `${addressComponent.province},${addressComponent.city == '' ? '市辖区' : addressComponent.city},${addressComponent.district}`,
        })
      }
    })
  })
}
// 计算全部adcode
const calcAdCode = adcode => {
  if (adcode == '' || adcode.length == 0) return []
  if (Array.isArray(adcode)) adcode = adcode.slice(-1) + ''
  let adcodes = [],
    ad1 = adcode.slice(0, 2),
    ad2 = adcode.slice(0, 4);
  adcodes = [ad1 + '0000', ad2 + '00', adcode]
  return adcodes
}

// 中心点
const setCenter = val => {
  MapRef.value.setCenter(val, false, 100)
}
const autoCenter = () => {
  MapRef.value.setFitView()
}

// 点 相关
const pointConfig = reactive({
  icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
  anchor: 'bottom-center',
})
const addPoint = (center) => {
  let position = initPath(center)
  const marker = new AMap.value.Marker({
    position: position,
    zIndex: 101,
    ...pointConfig
  })
  MapRef.value.add([marker])
  autoCenter()
  pointChange(marker)
}
const pointChange = (marker) => {
  mapPathToAddress(marker._position).then((val) => {
    let { address, adcode, adcodeAddress } = val
    emit("change", {
      type: "point",
      data: {
        type: "point",
        path: JSON.stringify(marker._position),
        address: address,
        radius: 0,
        adcode: calcAdCode(adcode).join(","),
        adcodeArr: calcAdCode(adcode),
        adcodeAddress
      }
    })
  })
}

// 折线 相关
const polylineConfig = reactive({
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
  showDir: true
})
const addPolyLine = () => {
  if (props.path.length == 0) return;
  let path = props.path
  const polyline = new AMap.value.Polyline({
    path: path,
    ...polylineConfig
  });
  let startPath = path[0], endPath = path.slice(-1)[0];
  const startIcon = new AMap.value.Marker({
    icon: new URL('../../assets/images/map/qd.png', import.meta.url).href,
    position: startPath,
    anchor: 'bottom-center'
  })
  const endIcon = new AMap.value.Marker({
    icon: new URL('../../assets/images/map/zd.png', import.meta.url).href,
    position: endPath,
    anchor: 'bottom-center'
  })
  MapRef.value.add([polyline, startIcon, endIcon]);
  autoCenter()
}

// 圆 相关
const circleConfig = reactive({
  strokeColor: "#f93a4a",  //线颜色
  strokeOpacity: 1,  //线透明度
  strokeWeight: 3,  //线粗细度
  fillColor: "#ee2200",  //填充颜色
  fillOpacity: 0.4 //填充透明度
})
const addCircle = (center) => {
  const newcenter = initPath(center) // 圆心位置
  const circle = new AMap.value.Circle({
    center: newcenter,
    radius: props.radius * 1,
    ...circleConfig
  })
  MapRef.value.add([circle]);
  autoCenter()
  props.edit && mapEditRef.value.init(circle)
}

// 多边形 相关
const polygonConfig = reactive({
  strokeColor: "#f93a4a",  //线颜色
  strokeOpacity: 1,  //线透明度
  strokeWeight: 3,  //线粗细度
  fillColor: "#ee2200",  //填充颜色
  fillOpacity: 0.4 //填充透明度
})
const addPolygon = (center) => {
  const path = initPath(center);
  const polygon = new AMap.value.Polygon({
    path: path,
    ...polygonConfig
  })
  MapRef.value.add([polygon]);
  autoCenter()
  props.edit && mapEditRef.value.init(polygon)
}

// 行政区
const regionConfig = reactive({
  styles: {
    'fill': (properties) => {
      var adcode = properties.adcode;
      return getColorByAdcode(adcode);
    },
    'province-stroke': 'cornflowerblue',
    'city-stroke': 'white',//中国地级市边界
    'county-stroke': 'rgba(255,255,255,0.5)'//中国区县边界  
  }
})
const addRegion = () => {
  const adCode = initPath()
  if (adCode == '') return
  if (!districtExplorer.value) return;
  districtExplorer.value.loadAreaNode(adCode.join(","), (err, node) => {
    MapRef.value.setBounds(node.getBounds(), null, [30, 30, 30, 30], true);
    // districtExplorer.value.setHoverFeature(null);
    districtExplorer.value.clearFeaturePolygons();
    districtExplorer.value.renderParentFeature(node, {
      cursor: 'default',
      bubble: true,
      strokeColor: 'red', //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 1, //线宽
      fillColor: "#3366cc", //填充色
      fillOpacity: 0.4, //填充透明度
    });
    MapRef.value.setFitView(districtExplorer.value.getAllFeaturePolygons());
  })
  RegionChange(adCode)
}
const RegionChange = (adcode) => {
  emit("change", {
    type: props.type,
    data: {
      type: props.type,
      path: "",
      address: "",
      radius: props.radius,
      adcode: calcAdCode(adcode).join(","),
      adcodeArr: calcAdCode(adcode)
    }
  })
}
let colors = {}
const getColorByAdcode = (adcode) => {
  if (!colors[adcode]) {
    var gb = Math.random() * 155 + 50;
    colors[adcode] = 'rgb(' + gb + ',' + gb + ',255)';
  }
  return colors[adcode];
};

const initEdit = (center) => {
  addMapMarker(center)
}

// 销毁地图
const clearMap = () => {
  MapRef.value.clearMap()
  MapRef.value.destroy()
}

const changeMap = (val) => {
  if (props.searchBeforeEditInit && val.initEdit) {
    mapEditRef.value && mapEditRef.value.removeEditMarker()
    initEdit(JSON.parse(val.data.path))
  }
  emit("change", val)
}

const closeEdit = () => {
  mapEditRef.value && mapEditRef.value.endEdit(true)
  cleatAllMarker()
}

onUnmounted(() => {
  clearMap()
})
initMap()

// 主动暴露方法
defineExpose({ type: 'map', init: initEdit, cleatAllMarker, addMapMarker });
</script>

<style lang="scss" scoped>
.map {
  position: relative;
  width: 100%;
  height: 100%;
  #container {
    padding: 0px;
    margin: 0px;
    width: 100%;
  }
  .search {
    width: 220px;
    position: absolute;
    top: 20px;
    left: 20px;
  }
  .btn {
    position: absolute;
    top: 20px;
    right: 30px;
  }
  #output {
    background: #fff;
    max-height: 340px;
    overflow: auto;
    overflow-x: hidden;
  }
  :deep(.auto-item) {
    font-size: 14px !important;
    padding: 4px;
    line-height: 22px !important;
    box-sizing: border-box !important;
  }
}
</style>
