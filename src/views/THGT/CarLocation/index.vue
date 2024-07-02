<template>
  <div class="zt-Tracking">
    <div class="leftContent">
      <!-- <div class="topContent">
        <div class="topContent-item" style="background: #b2cff2">
          <p class="car-num">{{ NumText.allCount }}</p>
          <p>
            <el-icon class="istem-icon1">
              <Menu />
            </el-icon>
          </p>
          <p>全部</p>
        </div>
        <div class="topContent-item" style="background: #79bbff">
          <p class="car-num">{{ NumText.online }}</p>
          <p>
            <el-icon class="istem-icon2">
              <SuccessFilled />
            </el-icon>
          </p>
          <p>在线</p>
        </div>
        <div class="topContent-item" style="background: #f89898">
          <p class="car-num">{{ NumText.offline }}</p>
          <p>
            <el-icon class="istem-icon3">
              <RemoveFilled />
            </el-icon>
          </p>
          <p>离线</p>
        </div>
      </div> -->
      <div class="QueryClass">
        <!-- <el-select v-model="value" class="m-2 SelectClass" placeholder="车牌号" size="small">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select> -->
        <div class="title">
          <span>临时车辆 </span>
          <el-input v-model="carNoLS" size="default" class="inputClass" placeholder="请输完整车号查询临时车" @input="getCarNoLS" />
        </div>

        <div class="title mt-10">
          <span>业务车辆 </span>
          <el-input v-model="carNo" size="default" class="inputClass" placeholder="请输入至少两位车牌" />
        </div>

      </div>
      <el-scrollbar class="treeContent" :height="treeHeight">
        <el-tree :data="Treedata" :props="{ label: 'LABEL', children: 'CHILDREN' }" class="global-left" default-expand-all node-key="VALUE" @node-click="handleNodeClick">
          <template #default="{ data }">
            <span>{{ data.LABEL }}
              <template v-if="data.CHILDREN?.length > 0">
                ({{ data.CHILDREN?.length }})
              </template>
              <template v-if="data.STATUS">
                <el-tag v-if="data.STATUS == '1'" type="success">在线</el-tag>
                <el-tag v-if="data.STATUS == '0'" type="info">离线</el-tag>
              </template>
            </span>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="rightContent">
      <div class="map">
        <div id="container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InitAMap from "@/utils/map";
import { shallowRef } from "@vue/reactivity";
import { getTreeData, getPath } from "@/api/track";
import GPS from "@/utils/gpsToAmap";
import { getCartrack } from "@/api/system/cartrack";

const router = useRouter();
const routerParams = router.currentRoute.value.meta;
const { proxy } = getCurrentInstance();
const carNo = ref("");
const carNoLS = ref("");
const NumText = ref({
  allCount: 0,
  online: 0,
  offline: 0,
});
const treeHeight = window.innerHeight - 280 + "px";
const mapheight = ref(window.innerHeight - 120 + "px");
const mapData = ref({
  type: "",
  path: [],
  center: [],
  radius: "",
  adcode: [],
});
const Treedata = ref([]);
watchEffect(() => {
  if (carNo.value || carNo.value == "") {
    handTreeData();
  } else {
    return;
  }
});

function getCarNoLS(e) {
  if(e.length<7) return 
  let newCar = {
    CHILDREN: [],
    LABEL: e,
  };
  handleNodeClick(newCar);
}

function handTreeData() {
  let data = {
    VNAME: "",
    DR: "0",
    PAGENUM: "1",
    PAGESIZE: "10000",
    KEYWORD: carNo.value,
    // MODULEID: routerParams.BILLNO,
  };
  getTreeData(data).then((res) => {
    NumText.value.allCount = res.RESULT.ALLCOUNT || 0;
    NumText.value.offline = res.RESULT.OFFLINE || 0;
    NumText.value.online = res.RESULT.ONLINE || 0;
    Treedata.value = res.RESULT.TREE;
  });
}

/** 地图 */
const AMap = shallowRef(null);
const MapRef = ref();
const initMap = () => {
  InitAMap().then((AMapRes) => {
    AMap.value = AMapRes;
    const map = new AMap.value.Map("container", {
      viewMode: "2D",
      zoom: 7,
      center: [116.397527, 39.90798],
    });
    MapRef.value = map;
  });
};
const mapPath = ref([]);
const marker = ref(null);

const LocatinInfo = ref({});
const carInfo = ref(null);

const getCarLngLat = () => {
  if (!LocatinInfo.value) return null;
  let [Lng, Lat] = LocatinInfo.value.CARLOCATION.split(",");
  let { lon, lat } = GPS.gcj_encrypt(Number(Lat), Number(Lng));
  return [lon, lat];
};

const addLocation = () => {
  MapRef.value.clearMap();
  let CARLOCATION = getCarLngLat();
  let icon = new AMap.value.Icon({
    size: new AMap.value.Size(60, 45),
    image: new URL("@/assets/images/map/car.png", import.meta.url).href,
    imageSize: new AMap.value.Size(60, 45),
  });
  const CarIcon = new AMap.value.Marker({
    icon,
    position: CARLOCATION,
    anchor: "bottom-center",
  });
  carInfo.value = new AMap.value.InfoWindow({
    position: CARLOCATION,
    content: `<div style="font-size:14px">
    <div>车辆：${LocatinInfo.value.CARSNAME}</div>
    <div>位置：${LocatinInfo.value.CARLOCATIONINFO}附近</div>
    </div>`,
    offset: new AMap.value.Pixel(0, -50),
  });
  CarIcon.on("click", function (e) {
    let isopen = carInfo.value.getIsOpen();
    if (isopen) {
      carInfo.value.close();
    } else {
      carInfo.value.open();
    }
  });
  MapRef.value.add([CarIcon]);
  carInfo.value.open(MapRef.value);
  MapRef.value.setFitView([CarIcon], false, [60, 60, 60, 60], 15);
};

const handleNodeClick = (node) => {
  let { CHILDREN, LABEL } = node;
  if (CHILDREN && CHILDREN?.length != 0) return false;
  getCartrack({
    CARSNAME: LABEL,
    SHOWLOCATION: true,
  }).then((res) => {
    LocatinInfo.value = res.RESULT;
    const { CARLOCATION } = res.RESULT;
    if (CARLOCATION) {
      addLocation();
    } else {
      MapRef.value.clearMap();
    }
  });
};

const textStyle = {
  fontSize: 12,
  fontWeight: "normal",
  fillColor: "#fff",
  padding: "2, 5",
  backgroundColor: "#409EFF",
  borderColor: "#fff",
  borderWidth: 1,
};

// 打卡标记
function addDKMarker(CARSNUM) {
  let newMarkers = [];
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

initMap();
</script>

<style lang="scss" scoped>
#container {
  height: v-bind(mapheight);
}
.zt-Tracking {
  width: 100%;
  background: #dee1e6;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: stretch;
  .leftContent {
    padding: 10px;
    background: #fff;
    // display: inline-block;
    width: 25%;
    .topContent {
      display: flex;
      align-items: stretch;
      height: 90px;
      margin-bottom: 10px;
      gap: 5px;
      .car-num {
        font-weight: 600;
        font-size: 22px;
        margin-top: 12px;
      }
      div {
        border-radius: 8px;
        width: 100%;
        font-size: 12px;
        font-weight: 600;
        cursor: default;
        p {
          margin: 0;
          padding: 2px;
          display: flex;
          justify-content: center;
          .el-icon {
            font-size: 18px;
          }
          .istem-icon1 {
            color: #fff;
          }
          .istem-icon2 {
            color: #fff;
          }
          .istem-icon3 {
            color: #fff;
          }
        }
      }
    }
    .QueryClass {
      margin-bottom: 15px;
      .SelectClass {
        width: 100px;
      }
      .inputClass {
        width: calc(100% - 100px);
      }
      .mt-10 {
        margin-top: 10px;
      }
    }
  }
  .rightContent {
    background: #fff;
    width: 75%;
  }
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
  .card-title {
    margin-bottom: 20px;
  }
  .mt-10 {
    margin-top: 10px;
  }
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
</style>
