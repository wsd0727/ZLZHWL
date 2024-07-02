<template>
  <div class="zt-Tracking">
    <div class="leftContent">
      <div class="topContent">
        <div class="topContent-item" style="background:#b2cff2;">
          <p>
            <el-icon class="istem-icon1">
              <Menu />
            </el-icon>
          </p>
          <p>全部</p>
          <p>{{NumText.allCount}}</p>
        </div>
        <div class="topContent-item" style="background:#9ed0ad;">
          <p>
            <el-icon class="istem-icon2">
              <SuccessFilled />
            </el-icon>
          </p>
          <p>在线</p>
          <p>{{NumText.online}}</p>
        </div>
        <div class="topContent-item" style="background:#c0c3c8;">
          <p>
            <el-icon class="istem-icon3">
              <RemoveFilled />
            </el-icon>
          </p>
          <p>离线</p>
          <p>{{NumText.offline}}</p>
        </div>
      </div>
      <div class="QueryClass">
        <!-- <el-select v-model="value" class="m-2 SelectClass" placeholder="车牌号" size="small">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select> -->
        <el-input v-model="carNo" size="default" class="inputClass" placeholder="请输入至少两位车牌" style="width:100%" />
      </div>
      <el-scrollbar class="treeContent" :height="treeHeight">
        <el-tree :data="Treedata" :props="{ label: 'LABEL', children: 'CHILDREN' }" class="global-left" default-expand-all node-key="VALUE" @node-click="handleNodeClick">
          <template #default="{ data }">
            <span>{{ data.LABEL }}
              <template v-if="data.CHILDREN.length > 0">
                ({{data.CHILDREN.length}})
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
import { shallowRef } from '@vue/reactivity'
import { getTreeData, getPath } from "@/api/JDWL/ztTracking";
import GPS from '@/utils/gpsToAmap'
const router = useRouter();
const routerParams = router.currentRoute.value.meta;
import InitAMap from "@/utils/map"

const carNo = ref('')
const NumText = ref({
  allCount: 0,
  online: 0,
  offline: 0
})
const treeHeight = window.innerHeight - 280 + 'px';
const mapheight = ref(window.innerHeight - 120 + 'px');
const mapData = ref({
  type: "",
  path: [],
  center: [],
  radius: '',
  adcode: [],
});
const Treedata = ref([]);
watchEffect(() => {
  if (carNo.value || carNo.value == '') {
    // 如果变量不为空，则运行所需的方法
    handTreeData();
  } else {
    // 如果变量为空，则什么都不做
    return;
  }
});
function handTreeData() {
  let data = {
    VNAME: "",
    DR: "0",
    PAGENUM: '1',
    PAGESIZE: '10000',
    CARNO: carNo.value,
    MODULEID: routerParams.BILLNO,
  };
  getTreeData(data).then((res) => {
    NumText.value.allCount = res.RESULT.ALLCOUNT;
    NumText.value.offline = res.RESULT.OFFLINE;
    NumText.value.online = res.RESULT.ONLINE;
    Treedata.value = res.RESULT.TREE;
  });
}

/** 地图 */
const AMap = shallowRef(null)
const MapRef = ref()
const initMap = () => {
  InitAMap().then(AMapRes => {
    AMap.value = AMapRes
    const map = new AMap.value.Map("container", {
      viewMode: "3D",
      zoom: 10,
      center: [116.397527, 39.90798]
    });
    MapRef.value = map
  })
}
const mapPath = ref([])
const addPolyLine = () => {
  MapRef.value.clearMap()
  let path = mapPath.value
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
    showDir: true
  });
  let startPath = path[0], endPath = path.slice(-1)[0];
  const startIcon = new AMap.value.Marker({
    icon: new URL('../../../assets/images/map/qd.png', import.meta.url).href,
    position: startPath,
    anchor: 'bottom-center'
  })
  const endIcon = new AMap.value.Marker({
    icon: new URL('../../../assets/images/map/zd.png', import.meta.url).href,
    position: endPath,
    anchor: 'bottom-center'
  })
  MapRef.value.add([polyline, startIcon, endIcon]);
  MapRef.value.setFitView()
}

const handleNodeClick = (node) => {
  let { CHILDREN, LABEL } = node
  if (CHILDREN.length != 0) return false
  getPath({
    CARNO: LABEL
  }).then(res => {
    let arr = []
    if (res.RESULT) {
      let gps = res.RESULT.GPS
      gps.forEach(el => {
        let { lat, lon } = GPS.gcj_encrypt(Number(el.LAT), Number(el.LNG))
        arr.push([lon, lat])
      })
      mapPath.value = arr
    }
    arr.length && addPolyLine()
  })
}

initMap()
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
          transform: translateY(100%);
          .el-icon {
            font-size: 18px;
          }
          .istem-icon1 {
            color: #4291e0;
          }
          .istem-icon2 {
            color: #129c3d;
          }
          .istem-icon3 {
            color: #6f7277;
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
        width: 220px;
      }
    }
  }
  .rightContent {
    background: #fff;
    width: 75%;
  }
}
</style>