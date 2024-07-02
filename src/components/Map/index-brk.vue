<template>
  <div class="map">
    <div id="container" :style="{'height':height}"></div>
    <map-search />
    <map-edit />
    <div class="search" v-if="!detail">
      <el-input id="keyword" v-model="keyword" placeholder="请输入" size="default"></el-input>
      <div id="output"></div>
    </div>
    <div class="btn" v-if="!detail && (type == 'circle' || type == 'polygon')">
      <el-button @click="initEdit" size="default">初始化</el-button>
      <template v-if="EditRef!= null">
        <el-button @click="startEdit" size="default">开始编辑</el-button>
        <el-button @click="endEdit" size="default">结束编辑</el-button>
      </template>
    </div>
  </div>
</template>

<script setup name=''>
import { shallowRef } from '@vue/reactivity'
import InitAMap from "@/utils/map" // 全局配置读取Key

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
    type: String,
    default: ""
  },
  zoom: {
    type: Number,
    default: 10
  },
  center: {
    type: Array,
    default: () => [116.397527, 39.90798]
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
    default: 11
  },
  searchBeforeEditInit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(["change"]);

watch(() => props.type, () => {
  cleatAllMarker()
  addMapMarker()
})

watch(() => props.adcode, () => {
  if (props.type != 'region') return
  // cleatAllMarker()
  addRegion()
})

watch(() => props.detail, val => {
  if (val) return
  endEdit()
})

// map实例
const AMap = shallowRef(null)
const UI = ref(null)
// 当前地图
const MapRef = ref()
const EditRef = ref(null)

const districtExplorer = ref(null)

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
      "AMap.Geocoder"], function () {
        MapRef.value.addControl(new AMap.value.Scale()); // 比例尺
        addSearchPlugin()
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
  if (!isEdit.value) {
    let center = e.lnglat.toArray()
    setCenter(center)
    setTimeout(() => {
      initEdit(center)
    }, 150)
  }
}

// 搜索 插件
const keyword = ref("")
const searchConfig = reactive({
  city: '全国',
  input: "keyword",
  output: "output"
})
const addSearchPlugin = () => {
  const auto = new AMap.value.AutoComplete(searchConfig);
  const placeSearch = new AMap.value.PlaceSearch({ map: MapRef.value })
  auto.on("select", res => {
    placeSearch.setCity(res.poi.adcode);
    placeSearch.search(res.poi.name);  //关键字查询查询
    let address = res.poi.name;
    let center = `[${res.poi.location.lng},${res.poi.location.lat}]`;
    let adcode = calcAdCode(res.poi.adcode)
    emit("change", {
      type: props.type,
      data: {
        type: props.type,
        path: center,
        address: address,
        radius: props.radius,
        adcode: adcode
      }
    })
    if (props.type == 'point') {
      cleatAllMarker()
      const autoPoint = new AMap.value.Marker({
        position: [res.poi.location.lng, res.poi.location.lat],
        ...pointConfig
      })
      MapRef.value.add([autoPoint])
      autoCenter()
    }
  })
  placeSearch.on("selectChanged", res => {
    let { selected } = res;
    let { data } = selected;
    let address = `${data.pname}${data.cityname}${data.adname}${data.address}`;
    let center = `${data.location.lng},${data.location.lat}`;
    let adcode = calcAdCode(data.adcode)
    if (props.searchBeforeEditInit) initEdit()
    emit("change", {
      type: props.type,
      data: {
        type: props.type,
        path: center,
        address: address,
        radius: props.radius,
        adcode: adcode
      }
    })
  })
}

// 覆盖物 相关
// 添加覆盖物
const addMapMarker = () => {
  // if (props.path == '' || props.adcode == '') return
  switch (props.type) {
    case "point":  // 点
      addPoint()
      break;
    case "polyline":  // 折线
      addPolyLine()
      break;
    case "circle":  // 圆形
      addCircle()
      break;
    case "polygon": // 多边形
      addPolygon()
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
  if (props.type == '') return
  if (!center) center = MapRef.value?.getCenter().toArray()
  let type = props.type,
    path = [];
  switch (type) {
    default:
    case "point": // 点
      if (props.path == '') {
        path = center
      } else {
        path = Array.isArray(props.path) ? props.path : JSON.parse(props.path)
      }
      break;
    case "circle":  // 圆形
      if (props.path == '') {
        path = mapPath(center)
      } else {
        path = mapPath(Array.isArray(props.path) ? props.path : JSON.parse(props.path))
      }
      break;
    case "polygon": // 多边形
      if (props.path == '' || props.path.length < 3) {
        path = [center, [center[0] + 0.01, center[1] + 0.01], [center[0] + 0.02, center[1]]];
      } else {
        path = Array.isArray(props.path) ? props.path : JSON.parse(props.path)
      }
      break;
    case "region":
      if (props.adcode == '') {
        path = []
      } else {
        path = Array.isArray(props.adcode) ? props.adcode.slice(-1) : props.adcode.split(",").slice(-1)
      }
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
  let position = center || initPath(center)
  const marker = new AMap.value.Marker({
    position: position,
    zIndex: 101,
    ...pointConfig
  })
  MapRef.value.add([marker])
  autoCenter()
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
const addCircle = () => {
  const center = initPath() // 圆心位置
  const circle = new AMap.value.Circle({
    center: center,
    radius: !props.radius ? 1000 : props.radius * 1,
    ...circleConfig
  })
  MapRef.value.add([circle]);
  autoCenter()
  editCircle(circle)
}
const editCircle = (circle) => {
  const edit = new AMap.value.CircleEditor(MapRef.value, circle)
  edit.on('end', ({ target }) => {
    let { center, radius } = target._opts
    mapPathToAddress(center.toArray()).then((val) => {
      let { address, adcode, adcodeAddress } = val
      emit("change", {
        type: props.type,
        data: {
          type: props.type,
          path: JSON.stringify(center.toArray()),
          address: address,
          radius: radius + '',
          adcode: adcode,
          adcodeAddress
        }
      })
    })
  })
  EditRef.value = edit
}

// 多边形 相关
const polygonConfig = reactive({
  strokeColor: "#f93a4a",  //线颜色
  strokeOpacity: 1,  //线透明度
  strokeWeight: 3,  //线粗细度
  fillColor: "#ee2200",  //填充颜色
  fillOpacity: 0.4 //填充透明度
})
const addPolygon = () => {
  const path = initPath();
  const polygon = new AMap.value.Polygon({
    path: path,
    ...polygonConfig
  })
  MapRef.value.add([polygon]);
  autoCenter()
  editPolygon(polygon)
}
const editPolygon = (polygon) => {
  const edit = new AMap.value.PolygonEditor(MapRef.value, polygon)
  edit.on('end', ({ target }) => {
    let { path } = target._opts
    mapPathToAddress(path[0]).then(val => {
      let { address, adcode, adcodeAddress } = val
      emit("change", {
        type: props.type,
        data: {
          type: props.type,
          path: JSON.stringify(path),
          address: address,
          radius: '',
          adcode: adcode,
          adcodeAddress
        }
      })
    })
  })
  EditRef.value = edit
}

// 编辑 相关
const initEdit = (center = undefined) => {
  let type = props.type || "circle";
  if (!center) center = MapRef.value.getCenter().toArray()
  cleatAllMarker()
  switch (type) {
    case "point": // 点
      addPoint(center)
      mapPathToAddress(center).then(({ address, adcode, adcodeAddress }) => {
        emit("change", {
          type: props.type,
          data: {
            type: props.type,
            path: JSON.stringify(center),
            address: address,
            radius: '',
            adcode: adcode,
            adcodeAddress
          }
        })
      })
      break;
    case "circle":  // 圆形
      addCircle()
      break;
    case "polygon": // 多边形
      addPolygon()
      break;
    case "region":
      addRegion()
      break;
  }
}
const isEdit = ref(false)
const startEdit = () => {
  if (EditRef.value == null) return
  isEdit.value = true
  EditRef.value.open()
}
const endEdit = () => {
  if (EditRef.value == null) return
  isEdit.value = false
  EditRef.value.close()
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
      radius: '',
      adcode: calcAdCode(adcode).join(",")
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

// 销毁地图
const clearMap = () => {
  MapRef.value.clearMap()
  MapRef.value.destroy()
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
