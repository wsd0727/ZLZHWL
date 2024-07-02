<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" @click="submit">提交</el-button>
  </teleport>
  <div class="app-wrap">
    <el-scrollbar :height="scrollHeight">
      <Form ref="FormRef" v-model:formData="form" labelWidth="90px" :formConfig="Config" :rules="Rules" @select="SearchDrivers">
        <template #DISTANCE>
          <div class="unit">{{ formatterDIS }}</div>
        </template>
        <template #DURATION>
          <div class="unit">{{ formatterDUR }}</div>
        </template>
      </Form>
      <div class="map">
        <div id="container" style="height:500px"></div>
        <div class="panel">
          <div class="panel-item">
            <span>策略</span>
            <el-radio-group v-model="DriverType" @change="changeDriverType" size="default">
              <el-radio-button v-for="item in DriverTypeEnum" :key="item.VALUE" :label="item.VALUE">{{item.LABEL}}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
/**
 * 通化钢铁 运输订单-线路维护
 */
import Form from "@/components/Form";
import { getLineDetail, saveLineEdit, Config } from "@/api/THGT/LineEdit"
import { getFormValue, getFormRule } from "@/utils";
import InitAMap from "@/utils/map"
import { nextTick } from "vue";

const props = defineProps({
  currentData: String
})
const emits = defineEmits(['close'])
const { proxy } = getCurrentInstance();

const scrollHeight = ref(window.innerHeight - 160 + 'px')

const Row = computed(() => props.currentData[0])

const FormRef = ref(null)
const form = ref()
const Rules = ref(getFormRule(Config))

const formatterDIS = computed(() => {
  return form.value.DISTANCE ? (form.value.DISTANCE / 1000).toFixed(3) + ' 公里' : undefined
})
const formatterDUR = computed(() => {
  return form.value.DURATION ? secondsToHms(form.value.DURATION) : ''
})

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);

  var hDisplay = h > 0 ? h + ' 小时' : "";
  var mDisplay = m > 0 ? m + ' 分' : "";
  return hDisplay + ' ' + mDisplay;
}

const InitForm = () => {
  const info = {
    PK_SENDCOMPANY: Row.value.PK_SENDCOMPANY,
    SENDCOMPANY: Row.value.SENDCOMPANY,
    PK_RECECOMPANY: Row.value.PK_RECECOMPANY,
    RECVCOMPANY: Row.value.RECVCOMPANY
  }
  form.value = { ...getFormValue(Config), ...info }
}
InitForm()

const getDetail = () => {
  getLineDetail({
    BILLNO: props.currentData[0].BILLNO
  }).then(res => {
    form.value = { ...form.value, ...res.RESULT }
    setTimeout(() => {
      SearchDrivers()
    }, 200)
  })
}

const AMap = shallowRef(null)
const MapRef = ref()
const DriverClassRef = ref(null);

const initMap = () => {
  return new Promise(resolve => {
    InitAMap().then(AMapRes => {
      AMap.value = AMapRes
      const map = new AMap.value.Map("container", {
        viewMode: "2D",
        zoom: 10,
        center: [116.397527, 39.90798]
      });
      MapRef.value = map
      AMap.value.plugin(["AMap.Driving"], () => {
        createdDriverPath()
      })
      resolve()
    })
  })
}
initMap()

// 驾车策略Enum
const DriverTypeEnum = reactive([
  { LABEL: "速度最快", VALUE: 0 },
  { LABEL: "费用最低", VALUE: 1 },
  { LABEL: "距离最短", VALUE: 2 },
])
const DriverType = ref(0)

const SearchDrivers = () => {
  if (!form.value.STARTLNGLAT || !form.value.ENDLNGLAT) return false
  const [slng, slat] = form.value.STARTLNGLAT.split(",")
  const [elng, elat] = form.value.ENDLNGLAT.split(",")
  if (!slng || !slat || !elng || !elat) return false
  const startLngLat = new AMap.value.LngLat(slng, slat)
  const endLngLat = new AMap.value.LngLat(elng, elat)
  DriverClassRef.value.search(startLngLat, endLngLat, function (status, result) {
    if (status === 'complete') {
      if (result.routes && result.routes.length) {
        const routersF = result.routes[0]
        form.value.DISTANCE = routersF.distance
        form.value.DURATION = parseInt(routersF.time)
        drawRoute(routersF)
      }
    } else {
      console.error('获取驾车数据失败：' + result)
    }
  });
}

// 设置 Drier策略
const changeDriverType = () => {
  DriverClassRef.value.setPolicy(DriverType.value)
  SearchDrivers()
}

// 创建 Driver对象
const createdDriverPath = () => {
  DriverClassRef.value = new AMap.value.Driving({
    policy: DriverType.value,
    waypoints: []
  })
}

function drawRoute(route) {
  MapRef.value?.clearMap()
  var path = parseRouteToPath(route)
  const startMarker = new AMap.value.Marker({
    position: path[0],
    icon: new URL('@/assets/images/map/qd.png', import.meta.url).href,
    offset: [-23, -50],
  })
  const endMarker = new AMap.value.Marker({
    position: path[path.length - 1],
    icon: new URL('@/assets/images/map/zd.png', import.meta.url).href,
    offset: [-23, -50],
  })
  const routeLine = new AMap.value.Polyline({
    path: path,
    isOutline: true,
    outlineColor: "#ffeeff",
    borderWeight: 1,
    strokeColor: "#0091ff",
    strokeOpacity: 1,
    strokeWeight: 7,
    strokeStyle: "solid",
    lineJoin: "round",
    lineCap: "round",
    showDir: true
  })
  MapRef.value.add([routeLine, startMarker, endMarker]);
  MapRef.value.setFitView()
}

// 解析DrivingRoute对象，构造成AMap.Polyline的path参数需要的格式
function parseRouteToPath(route) {
  var path = []
  for (var i = 0, l = route.steps.length; i < l; i++) {
    var step = route.steps[i]
    for (var j = 0, n = step.path.length; j < n; j++) {
      path.push(step.path[j])
    }
  }
  return path
}

const submit = () => {
  FormRef.value.submitForm().then(valid => {
    form.value.BILLNO = props.currentData[0].BILLNO
    saveLineEdit(form.value).then(res => {
      proxy.$modal.msgSuccess("操作成功");
      emits("close")
    })
  })
}

// InitForm()
getDetail()

</script>
<style lang="scss" scoped>
.app-wrap {
  background: #fff;
  height: v-bind(scrollHeight);
  padding: 10px;
  box-sizing: border-box;
}
:deep(.Form .form-group) {
  margin-bottom: 0;
}
.map {
  position: relative;
  .panel {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
    width: auto;
    background: #fff;
    padding: 5px;
    &-item {
      font-size: 14px;
      display: flex;
      align-items: center;
      span {
        margin-right: 5px;
      }
    }
  }
}
</style>