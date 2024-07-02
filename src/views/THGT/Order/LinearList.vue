<!-- 线性一览表 -->
<template>
  <div class="app-wrap">
    <div class="app-table-box" v-if="!visibleFormPage">
      <!-- 查询 -->
      <div class="query-wrap" v-if="queryConfig.length">
        <Form class="query-form" ref="formRefTop" v-model:formData="queryJson" :formConfig="set24col(queryConfig, 4)" :inline="true" @select="formSelect" @enter="enterEvent" />
        <div class="flex-row-end">
          <el-button @click="queryEvent" type="primary" size="Default">查找</el-button>
          <el-button @click="queryDrawer=true" size="Default">高级</el-button>
        </div>
      </div>

      <div class="bg-white position-r">
        <!-- 按钮栏 -->
        <div class="tool-wrap">
          <div class="tool-wrap-left">
          </div>
          <div class="tool-wrap-right">
            <el-button-group class="btn-group">
              <el-button :type="showType == 'block'?'primary':''" @click="TargetMod(true)">
                <el-icon>
                  <Menu />
                </el-icon>
              </el-button>
              <el-button :type="showType != 'block'?'primary':''" @click="TargetMod(false)">
                <i class="fa fa-align-justify"></i>
              </el-button>
            </el-button-group>
          </div>
        </div>

        <!-- 列表 内容 -->
        <template v-if="showType == 'block'">
          <el-scrollbar :height="windowHeight">
            <div class="block-list">
              <div class="block-list-item" v-for="(item,index) in dataList" :key="index">
                <div class="head">
                  <div class="title">
                    <div class="label">单号</div>
                    <div class="value">
                      <TextOverflow :content="item.BILLNO" />
                    </div>
                  </div>
                  <div class="btn">
                    <el-link type="primary" class="btn-item" @click="toDetail(item.BILLNO)">详情</el-link>
                    <el-link type="danger" class="btn-item" v-if="(item.BILLSTATUS && item.BILLSTATUS !='99')&& userStore.userInfo.USERTYPE == 0" @click="orderClose(index)">关闭</el-link>
                  </div>
                </div>
                <el-row class="content">
                  <el-col :span="24" class="content-item FROMTO">
                    <div class="from">
                      <TextOverflow :content="item.SENDADDRESS" />
                    </div>
                    <div class="to">
                      <TextOverflow :content="item.RECVADDRESS" />
                    </div>
                  </el-col>
                  <el-col :span="8" class="content-item">
                    <div class="label">状态</div>
                    <div class="value">{{selectDictLabel(tmsNodeEnum,item.BILLSTATUS)}}</div>
                  </el-col>
                  <el-col :span="8" class="content-item">
                    <div class="label">运距</div>
                    <TextOverflow :content="item.MILEAGE+'KM'">
                      <div class="value">{{item.MILEAGE || '-'}}KM</div>
                    </TextOverflow>
                  </el-col>
                  <el-col :span="8" class="content-item">
                    <div class="label">运价</div>
                    <TextOverflow :content="item.MATEMONEY+'元'">
                      <div class="value">{{item.MATEMONEY || '-'}}元</div>
                    </TextOverflow>
                  </el-col>
                  <el-col :span="16" class="content-item">
                    <div class="label">货物</div>
                    <TextOverflow :content="item.MATERIALNAME">
                      <div class="value">{{item.MATERIALNAME}}</div>
                    </TextOverflow>
                  </el-col>
                  <el-col :span="8" class="content-item">
                    <div class="label">运量</div>
                    <div class="value">
                      <TextOverflow :content="`${item.NWEIGHT}${item.UNIT?item.UNIT:''}`" />
                    </div>
                  </el-col>
                  <el-col :span="24" class="content-item">
                    <div class="label">承运商</div>
                    <TextOverflow :content="item.CARRIERNAME">
                      <div class="value">{{item.CARRIERNAME}}</div>
                    </TextOverflow>
                  </el-col>
                  <el-col :span="24" class="content-item">
                    <div class="label">司机</div>
                    <TextOverflow :content="item.DRIVERNAME">
                      <div class="value">{{item.DRIVERNAME}}</div>
                    </TextOverflow>
                  </el-col>
                  <el-col :span="24" class="content-item LinePlan">
                    <div class="line">
                      <el-progress class="percent" :stroke-width="7" text-inside :percentage="item.TRANSPERCENT">
                        <div class="caricon">
                          <img src="/src/assets/images/WZC/car.png" alt="">
                        </div>
                      </el-progress>
                      <div class="num">{{item.TRANSPERCENT}}%</div>
                    </div>
                  </el-col>
                  <!-- <el-col :span="24" class="content-item">
                    <div class="label">运输进度</div>
                    <div class="value">{{item.TRANSPERCENT}}%</div>
                  </el-col> -->
                </el-row>
                <div class="stasus-info">
                  <div class="stasus-info-item warn"><el-icon>
                      <Opportunity />
                    </el-icon>{{item.WARNNUM}}个预警</div>
                  <div class="stasus-info-item message"><el-icon>
                      <BellFilled />
                    </el-icon>{{item.INFONUM}}个通知</div>
                  <div class="stasus-info-item photo"><el-icon>
                      <CameraFilled />
                    </el-icon>{{item.PHOTONUM}}张拍照</div>
                </div>
                <div class="foot">
                  <div class="foot-item" v-if="item.BILLSTATUS >= 15" @click="openMapMarker(index)">轨迹</div>
                  <div class="foot-item" v-if="item.BILLSTATUS > 15" @click="openOrderLine(index)">节点</div>
                  <!-- <div class="foot-item" v-if="(item.BILLSTATUS < 50  || item.BILLSTATUS >=  90 || item.TRANSPORTSTATUS==2)&& userStore.userInfo.USERTYPE == 0" type="primary" @click="orderSignFor(index)">签收</div> -->
                </div>
              </div>
            </div>
          </el-scrollbar>
        </template>
        <template v-else>
          <miniTable :data="dataList" :height="windowHeight">
            <vxe-column type="seq" width="60" title="编号" align="center" fixed="left" />
            <vxe-column field="name" title="运输信息" align="left" width="50%">
              <template #default="{ row }">
                <el-row>
                  <el-col :span="9" class="content-item">货物：{{row.MATERIALNAME || ''}}</el-col>
                  <el-col :span="5" class="content-item">运量：{{row.NWEIGHT || '-'}} {{row.UNIT}}</el-col>
                  <el-col :span="5" class="content-item">运距：{{row.MILEAGE || '-'}} KM</el-col>
                  <el-col :span="5" class="content-item">状态：{{ selectDictLabel(tmsNodeEnum,row.BILLSTATUS) }}</el-col>
                  <el-col :span="24" class="content-item FROMTO">
                    <div class="from-icon"></div>
                    <div class="line">
                      <el-progress class="percent" :stroke-width="7" text-inside :percentage="row.TRANSPERCENT">
                        <div class="caricon" draggable="false">
                          <img src="/src/assets/images/WZC/car.png" alt="">
                        </div>
                      </el-progress>
                    </div>
                    <div class="to-icon"></div>
                  </el-col>
                  <el-col :span="24" class="content-item FROMTO">
                    <div class="from">{{row.SENDADDRESS}}</div>
                    <div class="to">{{row.RECVADDRESS}}</div>
                  </el-col>
                </el-row>
              </template>
            </vxe-column>
            <vxe-column field="sex" title="派车信息" align="left" min-width="260">
              <template #default="{ row }">
                <el-row>
                  <el-col :span="16" class="content-item">单号：{{row.BILLNO}}</el-col>
                  <el-col :span="8" class="content-item">运价：{{row.MATEMONEY}}元</el-col>
                  <el-col :span="24" class="content-item">承运：{{row.CARRIERNAME}}</el-col>
                  <el-col :span="24" class="content-item">司机：{{row.DRIVERNAME}} {{row.CARNO}} {{row.DRIVERPHONE}}</el-col>
                </el-row>
              </template>
            </vxe-column>
            <vxe-column field="age" title="预警通知" align="center" width="100">
              <template #default="{ row }">
                <div class="stasus-info">
                  <div class="stasus-info-item warn">预警:{{row.WARNNUM}}</div>
                  <div class="stasus-info-item message">通知:{{row.INFONUM}}</div>
                  <div class="stasus-info-item photo">拍照:{{row.PHOTONUM}}</div>
                </div>
              </template>
            </vxe-column>
            <vxe-column field="menu" title="操作" width="180" fixed="right">
              <template #default="{ row, rowIndex }">
                <div class="foot warp">
                  <div class="foot-item" @click="toDetail(row.BILLNO)">详情</div>
                  <div class="foot-item" v-if="row.BILLSTATUS >= 15" @click="openMapMarker(rowIndex)">轨迹</div>
                  <div class="foot-item" v-if="row.BILLSTATUS > 15" @click="openOrderLine(rowIndex)">节点</div>
                  <!-- <div class="foot-item" v-if="(row.BILLSTATUS < 50  || row.BILLSTATUS >=  90 || row.TRANSPORTSTATUS==2 )&& userStore.userInfo.USERTYPE == 0" @click="orderSignFor(rowIndex)">签收</div> -->
                  <!-- <div class="foot-item" v-if="(row.BILLSTATUS < 40  || row.BILLSTATUS >=  95 || row.TRANSPORTSTATUS==2 )&& userStore.userInfo.USERTYPE == 0" @click="orderSignFor(rowIndex)">签收</div> -->
                  <!-- <div class="foot-item" v-if="(row.BILLSTATUS && row.BILLSTATUS !='99' && userStore.userInfo.USERTYPE == 0)" type="danger" @click="orderClose(rowIndex)">关闭</div> -->
                  <!-- <el-dropdown>
                    <div class="foot-item" type="danger">更多</div>
                    <template #dropdown>
                      <div class="foot-item" type="danger">关闭</div>
                    </template>
                  </el-dropdown> -->
                </div>
              </template>
            </vxe-column>
          </miniTable>
        </template>
        <!-- 页码  -->
        <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50, 100]" :current-page="pageInfo.currentPage" :total="Total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange" />
      </div>
    </div>

    <div class="detailForm" v-else>
      <el-scrollbar class="">
        <div class="form-title">
          <div class="form-title-left">
            <span class="text-muted" @click="backEvent">
              <el-icon :size="24">
                <Back />
              </el-icon>
              <el-divider direction="vertical" />
            </span>
            {{ pageConfig.pageTitle}}{{pageConfig.modelTitle == pageConfig.pageTitle? "": pageConfig.modelTitle}}
          </div>
          <div class="">
            <!-- <template v-for="itemB in formConfig.buttonList" :key="itemB.BILLNO">
              <el-button type="primary" size="default" @click="formBtnEvent(itemB)" v-if="setShowBtn(itemB)">
                {{ itemB.VNAME }}
              </el-button>
            </template> -->
          </div>
        </div>
        <div class="form-page-content">
          <detailCompontns :currentData="currentData" @close="closeFormPage" />
        </div>
      </el-scrollbar>
    </div>

    <!-- 高级查询条件 -->
    <el-drawer v-model="queryDrawer" title="高级筛选">
      <Form ref="formRefRight" v-model:formData="queryJson" :formConfig="set24col(queryConfig, 24)" @select="formSelect" />
      <template #footer>
        <div style="flex: auto">
          <el-button @click="resetQuery" size="default">重置</el-button>
          <el-button type="primary" @click="queryEvent" size="default">查找</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 轨迹 -->
    <vxe-modal className="FormModel" destroy-on-close v-model="modalConfig.open" :width="modalConfig.width" :height="modalConfig.height" id="FormModel" resize storage transfer show-zoom show-footer @zoom="resizeModal">
      <template #title>
        <span> {{ modalConfig.title }} </span>
      </template>
      <template #default>
        <template v-if="modalConfig.type == 'maps'">
          <div class="LineInfo-item LineMap">
            <div class="map">
              <div id="container" :style="{height:mapHeight}"></div>
              <div class="input-card" v-if="mapData">
                <div class="card-title">轨迹回放控制</div>
                <div class="input-item">
                  <input type="button" class="btn" value="开始动画" id="start" @click="startAnimation()" />
                  <input type="button" class="btn" value="暂停动画" id="pause" @click="pauseAnimation()" />
                </div>
                <div class="input-item mt-10">
                  <input type="button" class="btn" value="继续动画" id="resume" @click="resumeAnimation()" />
                  <input type="button" class="btn" value="停止动画" id="stop" @click="stopAnimation()" />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="modalConfig.type == 'lines'">
          <div>
            <ul class="LineTime">
              <div class="LineTime-item" v-for="(item, index) in timeLineList" :key="index">
                <div class="line"></div>
                <div class="no">{{index == '0'?'装':index}}</div>
                <div class="title">{{selectDictLabel(tmsNodeEnum, item.BILLSTATUS)}}</div>
                <div class="desc" v-if="item.LOADPOINTDESC">{{item.LOADPOINTDESC}}</div>
                <div class="desc">{{item.CREATIONTIME}}</div>
                <div class="imgList">
                  <ImagePreview v-if="item.URL" :src="item.URL" width="50px" height="50px" />
                  <ImagePreview v-if="item.imgUrl" :src="item.imgUrl" width="50px" height="50px" />
                </div>
              </div>
            </ul>
          </div>
        </template>
        <MasterForm v-else ref="MasterFormRef" v-model:formData="formConfig.formValue" :formConfig="formConfig.formColumns" :tableConfig="SubTableConfig" :formRules="formConfig.formRules" :tableRules="SubTableRules" :detail="formConfig.formType == 'DTL'" @select="formSelect" />
      </template>
      <template #footer>
        <el-button type="primary" size="default" @click="modalSubmit" v-if="modalConfig.title == '签收'">保存</el-button>
      </template>
    </vxe-modal>

  </div>
</template>

<script setup>
import miniTable from "@/components/Tables/mini"
import { getPageConfig as PageConfigApi } from "@/api/system/page";
import { QueryConfig, orderClose as orderCloseApi, orderSignFor as orderSignForApi } from "#/WZC/Linear"
import { getOrderList, getOrderMapLine, getLine } from "#/WZC/Order"
import { getFormValue, deepClone, getShowCFG, getFormRule, getUrlParams, evilFn, uuid } from "@/utils/index";
import TextOverflow from "@/components/TextOverflow"
import detailCompontns from "./detail"
import InitAMap from "@/utils/map"

import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();
const systemConfig = computed(() => settingsStore.systemConfig);

import request from '@/utils/request'
const router = useRouter();
const routerParams = router.currentRoute.value.meta;
import GPS from "@/utils/gpsToAmap";

import useUserStore from "@/store/modules/user";

const userStore = useUserStore();

const windowHeight = computed(() => (window.innerHeight - 246) + 'px')
const { proxy } = getCurrentInstance();
const { tmsNodeEnum } = proxy.useDict("tmsNodeEnum")

const MasterFormRef = ref(null)

/** 配置相关 */
const showType = ref("table")
const TargetMod = val => showType.value = val ? 'block' : 'table'

const queryConfig = ref([])
const pageInfo = reactive({
  pageSize: 10,
  currentPage: 1,
})
const getPageConfig = () => {
  PageConfigApi({
    // MODULEID: routerParams.BILLNO,
    // PAGEID: routerParams.ACTION,
    MODULEID: "MU230811295013",
    PAGEID: "PG230811314415",
  }).then(res => {
    const { QUERY, BUTTON } = res.RESULT;
    queryConfig.value = getShowCFG(QUERY)
    queryJson.value = getFormValue(QUERY)
  }).finally(() => {
    getData()
  })
}

const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
  formType: "", // DTL ADD
  buttonList: [], // 表单中的按钮
  showDetail: false, // 是否显示表单 ， 初始时不显示，详情数据查询后显示
});

const dataList = ref([])
const Total = ref(0)

function backEvent() {
  visibleFormPage.value = false;
  currentData.value = [];
}

function closeCustemPage() {
  backEvent()
  queryEvent()
}

const getData = () => {
  getOrderList({
    MODULEID: "MU230811295013",
    PAGEID: "PG230811314415",
    PAGENUM: pageInfo.currentPage,
    PAGESIZE: pageInfo.pageSize,
    ...queryJson.value
  }).then(res => {
    dataList.value = res.RESULT.RECORDS
    Total.value = res.RESULT.TOTAL
  })
}

const currentData = ref({})

/** 查询相关 */
const queryDrawer = ref(false)
const queryJson = ref({})
const formSelect = () => {
}
const resetQuery = () => {
  queryJson.value = getFormValue(queryConfig.value)
  queryEvent()
}
const queryEvent = () => {
  pageInfo.currentPage = 1;
  queryDrawer.value = false
  getData();
}
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  getData();
}
function set24col(data, n) {
  let newdata = deepClone(data);
  let data2 = newdata.filter((i) => {
    i.COL = n == 24 ? n : i.COL || 4;
    return i.GROUPID == 1;
  });
  if (n != 24) {
    data2 = data2.slice(0, 6);
    let sumCol = 0,
      data3 = [];
    data2 = data2.forEach((i) => {
      sumCol += i.COL * 1;
      if (sumCol < 25) {
        data3.push(i);
      }
    });
    data2 = data3;
  } else {
    data2 = newdata;
  }
  return data2;
}

/** 详情页面 */
const visibleFormPage = ref(false);
const pageConfig = reactive({
  pageTitle: "",
  buttonList: []
});
const toDetail = id => {
  let row = dataList.value.find(el => el.BILLNO == id)
  currentData.value = row
  pageConfig.pageTitle = "详情"
  visibleFormPage.value = true
}
const closeFormPage = () => {
  visibleFormPage.value = false
  queryEvent()
}

const modalConfig = reactive({
  open: false,
  title: "",
  MENUID: "",
  PAGEID: "",
  params: {},
  importantParams: {},
  width: "70%",
  height: "60%",
});

const timeLineList = ref([])
const openOrderLine = index => {
  let data = dataList.value[index]
  getLine({
    PK_SENDCAR: data.BILLNO
  }).then(res => {
    timeLineList.value = res.RESULT.reverse()
    modalConfig.title = "节点"
    modalConfig.type = "lines"
    modalConfig.open = true
  })
}

const mapData = ref([])
const openMapMarker = index => {
  let data = dataList.value[index]
  getOrderMapLine({
    BILLNO: data.BILLNO,
    MODULEID: "MU230811295013",
    PAGEID: "PG230823695527"
  }).then(res => {
    if (!res.RESULT) {
      mapData.value = []
      proxy.$modal.msgError("未查询到轨迹数据");
      return false
    }
    let { LINEPOINTS } = res.RESULT
    if (!LINEPOINTS) {
      proxy.$modal.msgError("未查询到轨迹数据");
      return false
    }
    let arr = JSON.parse(LINEPOINTS), newMapdata = []
    arr.forEach(el => {
      let [LNG, LAT] = el
      let { lon: newLNG, lat: newLAT } = GPS.gcj_encrypt(Number(LAT), Number(LNG))
      newMapdata.push([newLNG, newLAT]);
    })
    mapData.value = newMapdata
    modalConfig.title = "轨迹"
    modalConfig.type = "maps"
    modalConfig.width = "90%"
    modalConfig.height = "85%"
    modalConfig.open = true;
    nextTick(() => {
      initMap().then(() => {
        addPolyLine(data)
      })
    })
  })
}
const AMap = shallowRef(null)
const MapRef = ref()
const marker = ref(null);
const mapHeight = computed(() => ((window.innerHeight * 0.9)) - 140 + 'px')
const initMap = () => {
  return new Promise(resolve => {
    InitAMap().then(AMapRes => {
      AMap.value = AMapRes
      const map = new AMap.value.Map("container", {
        viewMode: "2D",
        zoom: 10,
        center: [116.397527, 39.90798]
      });
      AMap.value.plugin(["AMap.MoveAnimation"], () => {
        return false
      })
      MapRef.value = map
      resolve()
    })
  })
}

const addPolyLine = (row) => {
  let path = mapData.value
  let { TRANSPORTSTATUS = '0' } = row
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
  const startIcon = new AMap.value.Icon({
    size: new AMap.value.Size(40, 55),    // 图标尺寸
    image: new URL('../../../assets/images/map/qd.png', import.meta.url).href,
    imageSize: new AMap.value.Size(40, 55)
  })
  const startMarker = new AMap.value.Marker({
    icon: startIcon,
    position: startPath,
    anchor: 'bottom-center'
  })
  const endIcon = TRANSPORTSTATUS == '1' ? new AMap.value.Icon({
    size: new AMap.value.Size(60, 45),    // 图标尺寸
    image: new URL('../../../assets/images/map/car.png', import.meta.url).href,
    imageSize: new AMap.value.Size(60, 45)
  }) : new AMap.value.Icon({
    size: new AMap.value.Size(40, 55),    // 图标尺寸
    image: new URL('../../../assets/images/map/zd.png', import.meta.url).href,
    imageSize: new AMap.value.Size(40, 55)
  })
  const endMarker = new AMap.value.Marker({
    icon: endIcon,
    position: endPath,
    anchor: 'bottom-center',
    imageSize: new AMap.value.Size(10, 10)
  })
  if (TRANSPORTSTATUS == '1')
    endMarker.on("click", function (e) {
      e.extData = row;
      openContent(e);
    });

  // 汽车动画
  marker.value = new AMap.value.Marker({
    map: MapRef.value,
    position: startPath,
    icon: "https://webapi.amap.com/images/car.png",
    offset: new AMap.value.Pixel(-26, -13),
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

  MapRef.value.add([polyline, startMarker, endMarker]);
  MapRef.value.setFitView()
}

function openContent(data) {
  let carsNews = data.extData
  let statusName = proxy.selectDictLabel(tmsNodeEnum.value, carsNews.BILLSTATUS);
  var CONTENT = [
    "<div><b class='car-bg'> " + carsNews.CARNO + "</b>",
    "<div><span class='color-999'>派车单：</span>" + carsNews.BILLNO,
    "<div><span class='color-999'>状态：</span>" + statusName,
    "<span class='color-999'>司机：</span>" + carsNews.DRIVERNAME + "-" + carsNews.DRIVERPHONE,
    "<span class='color-999'>货物：</span>" + carsNews.MATERIALNAME,
    "<span class='color-999'>起点：</span>" + carsNews.SENDADDRESS,
    "<span class='color-999'>终点：</span>" + carsNews.RECVADDRESS,
    "<span class='color-999'>派车时间：</span>" + carsNews.CREATIONTIME,
    "<span class='color-999'>运输时间：</span>" + carsNews.STARTTRANSPORTTIME + "</div></div>",
  ];
  let infoWindow = new AMap.value.InfoWindow({
    content: CONTENT.join("<br>"), //使用默认信息窗体框样式，显示信息内容
  });
  infoWindow.open(MapRef.value, data.lnglat);
}

function startAnimation() {
  let path = mapData.value
  marker.value.moveAlong(path, {
    duration: 1,
    circlable: false,
    autoRotation: true
  });
  // marker.value.moveAlong(path, {
  //   // 每一段的时长
  //   duration: 500, //可根据实际采集时间间隔设置
  //   // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
  //   autoRotation: true,
  //   angle: -90,
  // });
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

const SubTableConfig = ref([])
const SubTableRules = ref({})
const infoConfig = ref([])
const orderSignFor = index => {
  PageConfigApi({
    MODULEID: "MU230828973251",
    PAGEID: "PG230925515969"
  }).then(res => {
    const { COLUMNS, SUBTABLE, BUTTON } = res.RESULT;
    formConfig.formColumns = COLUMNS;
    formConfig.buttonList = BUTTON;
    formConfig.formBase = getFormValue(COLUMNS);
    formConfig.formValue = JSON.parse(JSON.stringify(formConfig.formBase));
    formConfig.formRules = getFormRule(COLUMNS);
    SubTableConfig.value = SUBTABLE.map((el) => {
      el._rowConfig = COLUMNS.find((al) => al.FIELD == el.FIELD);
      return el;
    });
    setSubTableData()
    getDetail(index)
  })
}

const setSubTableData = () => {
  let rules = [];
  for (let i = 0; i < SubTableConfig.value.length; i++) {
    const el = SubTableConfig.value[i];
    let { COLUMNS, FIELD, GROUPNO } = el;
    let baseData = getFormValue(COLUMNS),
      baseTSData = getFormValue(COLUMNS, "TS"); // 含 同上 数据
    delete baseData.EnumData;
    formConfig.formValue[FIELD] = GROUPNO === "TAB" ? [] : { ...baseData };
    let rule = getFormRule(COLUMNS);
    rules.push(rule);
  }
  SubTableRules.value = rules;
};

const getDetail = (index) => {
  let row = dataList.value[index]
  request({
    url: "/tms/tmsTransport/getDetail",
    method: "post",
    data: {
      MODULEID: "MU230828973251",
      PAGEID: "PG230925515969",
      BILLNO: row.BILLNO,
      PK_CLASS: row.BILLNO
    }
  }).then(res => {
    formConfig.formValue = Object.assign(formConfig.formValue, res.RESULT);
    modalConfig.title = "签收"
    modalConfig.width = "90%"
    modalConfig.height = "85%"
    modalConfig.type = 'Qs'
    modalConfig.open = true;
  })
}

const modalSubmit = () => {
  MasterFormRef.value.submitForm().then((valid) => {
    if (!valid) return;
    orderSignForApi({
      MODULEID: "MU230828973251",
      PAGEID: "PG230925515969",
      ...formConfig.formValue,
      NODE: "95"
    }).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      closeFormPage()
    })
  });
}

const orderClose = index => {
  let row = dataList.value[index]
  proxy.$modal.confirm("您确定要将该单据关闭吗?").then(res => {
    orderCloseApi({
      BILLNO: row.BILLNO,
      MODULEID: "MU230811295013",
      PAGEID: "PG230823695527",
      NODE: "99"
    }).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      closeFormPage()
    })
  })
}

getPageConfig()
</script>
<style lang="scss" scoped>
.app-table-box {
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
  background: #fff;
  .query-wrap {
    padding: 8px;
    margin: 6px 0 !important;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .query-form {
      width: 100%;
    }
  }
  .tool-wrap {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .tree-name {
      font-size: 14px;
      color: var(--el-color-primary);
      float: right;
      max-width: 260px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-right: 20px;
    }
    &-right {
      display: flex;
    }
  }
  .block-list {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    &-item {
      width: calc(25% - 16px);
      box-sizing: border-box;
      margin: 8px;
      border-radius: 10px;
      border: 1px solid var(--el-border-color);
      background: #fff;
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 10px;
        background: #f8f8fb;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        font-size: 16px;
        .label {
          white-space: nowrap;
          &::after {
            content: ":";
            margin-left: 3px;
            margin-right: 5px;
          }
        }
        .value {
          width: 130px;
          text-align: left;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .title {
          width: calc(100% - 60px);
          display: flex;
          align-items: center;
        }
        .btn {
          display: flex;
          align-items: center;
          &-item {
            margin-right: 10px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
      .content {
        padding: 10px 10px 0;
        color: #171717;
        font-size: 14px;
        &-item {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
          .label {
            min-width: 40px;
            text-align: justify;
            text-align-last: justify;
            white-space: nowrap;
            &::after {
              content: ":";
              margin-left: 3px;
              margin-right: 5px;
            }
          }
          .value {
            text-align: left;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .caricon {
            left: 5px;
          }
        }
      }
    }
  }
}

.FROMTO {
  display: block !important;
  font-size: 14px;
  text-align: left;
  padding-left: 30px;
  position: relative;
  .from {
    color: var(--el-color-primary);
    padding: 4px 0 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: default;
    &::after {
      content: "装";
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: var(--el-color-primary);
      border: 1px solid var(--el-color-primary);
      border-radius: 50%;
      background: #fff;
      position: absolute;
      left: 0;
      top: 4px;
    }
  }
  .to {
    padding: 2px 0 4px;
    color: #979797;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &::after {
      content: "卸";
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: var(--el-color-info);
      border: 1px solid var(--el-color-info);
      border-radius: 50%;
      background: #fff;
      position: absolute;
      left: 0;
      bottom: 4px;
    }
  }
}
.LinePlan {
  .line {
    width: 100%;
    display: flex;
    align-items: center;
    .percent {
      width: calc(100% - 40px);
    }
    .num {
      width: 40px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      position: relative;
      right: -12px;
      color: var(--el-color-primary);
    }
  }
}
.stasus-info {
  display: flex;
  align-items: center;
  &-item {
    flex: 1;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
    &.warn {
      color: var(--el-color-warning);
    }
    &.message {
      color: var(--el-color-primary);
    }
    &.photo {
      color: var(--el-color-success);
    }
  }
}

.foot {
  display: flex;
  align-items: center;
  padding: 10px;
  &.warp {
    flex-wrap: wrap;
    .foot-item {
      width: 30%;
    }
  }
  &-item {
    box-sizing: border-box;
    padding: 2px 10px;
    margin: 2px !important;
    border: 1px solid var(--el-color-primary);
    color: var(--el-color-primary);
    background: #eef3fb;
    font-size: 14px;
    border-radius: 2px;
    cursor: pointer;
    white-space: nowrap;
    &[type="primary"] {
      background: var(--el-color-primary);
      color: #fff;
    }
    &[type="danger"] {
      background: var(--el-color-danger-light-9);
      border-color: var(--el-color-danger);
      color: var(--el-color-danger);
    }
    &[type="info"] {
      background: var(--el-color-info-light-9);
      border-color: var(--el-color-info);
      color: var(--el-color-info);
    }
  }
}
.val_table {
  .content-item {
    display: flex;
    align-items: center;
    margin: 3px 0;
    white-space: nowrap;
  }
  .FROMTO {
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    padding-left: 0;
    .line {
      margin: 2px 10px;
      width: calc(100% - 80px);
    }
    .from {
      color: var(--el-color-primary);
      &::after {
        display: none;
      }
      &-icon::after {
        content: "装";
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: var(--el-color-primary);
        border: 1px solid var(--el-color-primary);
        border-radius: 50%;
        background: #fff;
      }
    }
    .to {
      color: var(--el-color-danger);
      &::after {
        display: none;
      }
      &-icon::after {
        content: "卸";
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: var(--el-color-danger);
        border: 1px solid var(--el-color-danger);
        border-radius: 50%;
        background: #fff;
      }
    }
  }
  .stasus-info {
    display: block;
    &-item {
      text-decoration: none;
    }
  }
  .foot {
    padding: 2px;
    &-item {
      margin: 0 2px;
      text-align: center;
    }
  }
}

.form-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  position: absolute;
  height: 40px;
  width: 100%;
  top: 0;
  background: #fff;
  z-index: 2;
  border-bottom: 1px solid #ddd;
  &-left {
    cursor: pointer;
    line-height: 36px;
    .text-muted:hover {
      color: var(--el-color-primary);
    }
    .el-icon {
      position: relative;
      top: 7px;
    }
  }
}
.form-page-content {
  width: 100%;
  box-sizing: border-box;
  margin-top: 40px;
}
.caricon {
  width: 10px;
  height: 10px;
  position: relative;
  user-select: none;
  img {
    position: absolute;
    width: 30px;
    height: 15px;
    left: 50%;
    top: -8px;
    transform: translateX(-50%);
  }
}
:deep(.el-progress-bar__outer) {
  overflow: visible;
}
.LineTime {
  display: flex;
  align-items: flex-start;
  flex-direction: column-reverse;
  margin: 0;
  padding-left: 40px;
  &-item {
    font-size: 14px;
    margin-bottom: 10px;
    position: relative;
    &:first-child {
      .line {
        display: none;
        opacity: 0;
      }
    }
    .line {
      position: absolute;
      left: -23px;
      top: 26px;
      height: 100%;
      border-left: 2px dotted #969696;
    }
    .no {
      width: 24px;
      height: 24px;
      position: absolute;
      left: -34px;
      top: 2px;
      font-size: 14px;
      border: 1px solid #1964f8;
      color: #1964f8;
      font-weight: bold;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      z-index: 1;
    }
    .title {
      color: #1964f8;
      font-weight: bold;
      margin: 2px 0;
    }
    .desc {
      color: #868686;
      margin: 2px 0;
    }
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
  width: 22rem;
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
  // -webkit-appearance: button;
  cursor: pointer;
}
</style>