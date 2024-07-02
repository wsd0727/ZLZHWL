<template>
    <teleport to="#custemPageBtn">
      <!-- <el-button type="primary" size="default" @click="submitPZ">保存</el-button> -->
      <!-- <el-button type="primary" size="default" @click="submitPZ">保存</el-button> -->

    </teleport>
    <div class="app-wrap">
        <div class="group-content">
            <el-row>
                <el-col :span="12" class="content-item">
                    <div class="label">运输单号：</div>
                    <div class="value">{{currentDatas.PK_ORDER}}</div>
                </el-col>
                <el-col :span="12" class="content-item">
                    <div class="label">剩余委托量：</div>
                    <div class="value">{{currentDatas.transurplus}}</div>
                </el-col>
            </el-row>
            <div class="query">
                <Form class="query-form" ref="formRefTop" label-width="50px" v-model:formData="queryForm" :formConfig="QueryConfig" inline @select="formSelect" @enter="queryEvent" />
                <el-button @click="queryEvent" type="primary" size="Default">查找</el-button>
              </div>
        </div>
        <div class="mt20">
            <miniTable height="186" :data="goodsList" :radio-config="{highlight: true}"
                @cell-click="cellClickEvent"
                @radio-change="radioChangeEvent">   >
              <vxe-column field="MATERIALNAME" title="车牌号" align="left" show-overflow="tooltip" />
              <vxe-column field="MATSPEC" title="核载量（吨）" align="left" show-overflow="tooltip" />
              <vxe-column field="RIGTAXPRICE" title="车型" align="right">
                <template #default="{row}">
                  <div>{{row.RIGTAXPRICE}}元/{{row.NSUMUNIT}}</div>
                </template>
              </vxe-column>
              <vxe-column field="ENTRUSTNUM" title="车辆规格" align="right" v-if="orderData.ASSIGNMENTUNIT != '4'">
                <template #default="{row}">
                  <div>{{row.ENTRUSTNUM}}{{row.NSUMUNIT}}</div>
                </template>
              </vxe-column>
              <vxe-column field="TRANSURPLUS" title="最后一次派车时间" align="right" v-if="orderData.ASSIGNMENTUNIT != '4'">
                <template #default="{row}">
                  <div>{{row.TRANSURPLUS}}{{row.NSUMUNIT}}</div>
                </template>
              </vxe-column>
              <vxe-column field="name" title="拉运记录" align="left">
                <template #default={row}>
                    <el-button type="primary" link size="default" @click="">查看</el-button>
                </template>
              </vxe-column>
            </miniTable>
        </div>
        <div class="disflex mt20 flex-row-cen text-danger text-blod text-ll">
            <div class="mr20">当前订单剩余委托量不满一车，是否确认进行尾差合单</div>
            <el-button type="primary" size="default" @click="submitPZ">配载司机</el-button>
            <el-button type="primary" size="default" @click="submitPZ">尾差合单</el-button>
        </div>
        <div class="disflex mt20 flex-row-cen text-danger text-blod text-ll">
            <div class="mr20">当前订单大于该车核载量，无需尾差合单，请进行配载司机操作</div>
            <el-button type="primary" size="default" @click="submitPZ">配载司机</el-button>
        </div>

        

      <!-- <formGroup ref="formGroupRef" class="group" title="订单信息" v-model:visable="formOpen">
        <div class="group-content">
          <el-row class="content">
            <el-col :span="6" class="content-item">
              <div class="label">发货企业</div>
              <div class="value">{{orderData.SENDCOMPANY}}</div>
            </el-col>
            <el-col :span="6" class="content-item">
              <div class="label">发货地址</div>
              <div class="value">{{orderData.SENDADDRESS}}</div>
            </el-col>
            <el-col :span="6" class="content-item">
              <div class="label">收货企业</div>
              <div class="value">{{orderData.RECVCOMPANY}}</div>
            </el-col>
            <el-col :span="6" class="content-item">
              <div class="label">收货地址</div>
              <div class="value">{{orderData.RECVADDRESS}}</div>
            </el-col>
            <el-col :span="6" class="content-item">
              <div class="label">承运商</div>
              <div class="value">{{orderData.SHIPPERNAME}}</div>
            </el-col>
            <el-col :span="6" class="content-item">
              <div class="label">要求发货时间</div>
              <div class="value">{{orderData.STARTTIME}}</div>
            </el-col>
            <el-col :span="6" class="content-item">
              <div class="label">要求送达时间</div>
              <div class="value">{{orderData.ENDTIME}}</div>
            </el-col>
            <el-col :span="6" class="content-item" v-if="orderData.ASSIGNMENTUNIT == '4'">
              <div class="label">拉运次数</div>
              <div class="value">{{goodsList[0].TRANSURPLUS}}次</div>
            </el-col>
          </el-row>
          <template v-if="goodsList.length > 3">
            <miniTable height="186" :data="goodsList">
              <vxe-column field="MATERIALNAME" title="货物" min-width="200" align="left" fixed="left" show-overflow="tooltip" />
              <vxe-column field="MATSPEC" title="规格" min-width="150" align="left" show-overflow="tooltip" />
              <vxe-column field="RIGTAXPRICE" title="单价" align="right" width="120">
                <template #default="{row}">
                  <div>{{row.RIGTAXPRICE}}元/{{row.NSUMUNIT}}</div>
                </template>
              </vxe-column>
              <vxe-column field=" ENTRUSTNUM" title="委托量" align="right" width="120" v-if="orderData.ASSIGNMENTUNIT != '4'">
                <template #default="{row}">
                  <div>{{row.ENTRUSTNUM}}{{row.NSUMUNIT}}</div>
                </template>
              </vxe-column>
              <vxe-column field="TRANSURPLUS" title="拉运剩余量" align="right" width="120" v-if="orderData.ASSIGNMENTUNIT != '4'">
                <template #default="{row}">
                  <div>{{row.TRANSURPLUS}}{{row.NSUMUNIT}}</div>
                </template>
              </vxe-column>
              <vxe-column field="name" title="委托进度" align="left" width="420">
                <template #default={row}>
                  <el-progress :percentage="50" :format="()=>`订单量 ${row.NNUM}${row.NSUMUNIT}`" />
                </template>
              </vxe-column>
            </miniTable>
          </template>
          <template v-else>
            <ul class="goodsList">
              <li class="goodsList-item" v-for="(item, index) in goodsList" :key="index">
                <div class="head">
                  <div class="title">
                    <span class="materiel">{{item.MATERIALNAME}}</span>
                    <div class="desc">{{item.MATSPEC}}</div>
                  </div>
                  <div class="price">{{item.RIGTAXPRICE}}元/{{item.NSUMUNIT}}</div>
                </div>
                <div class="line">
                  <el-progress :percentage="(item.TRANSNUM / item.TRANSURPLUS)*100" :format="()=>orderData.ASSIGNMENTUNIT != '4'?`委托量 ${item.ENTRUSTNUM}${item.NSUMUNIT}`:''" />
                </div>
                <div class="surplus" v-if="orderData.ASSIGNMENTUNIT != '4'">拉运剩余量 {{item.TRANSURPLUS}}{{item.NSUMUNIT}}</div>
              </li>
            </ul>
          </template>
        </div>
      </formGroup>
  
      <div class="group-form" :style="{height: `${listHeight}px`}">
        <div class="group-form-item">
          <div class="group">
            <div class="group-title">
              <div class="title">
                <el-radio-group v-model="selectType" :disabled="PZList.length > 0" size="default" @change="queryEvent">
                  <el-radio-button label="car">选车</el-radio-button>
                  <el-radio-button label="driver">选司机</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="group-content">
              <div class="query">
                <Form class="query-form" ref="formRefTop" label-width="50px" v-model:formData="queryForm" :formConfig="mapQueryConfig" inline @select="formSelect" @enter="queryEvent" />
                <el-button @click="queryEvent" type="primary" size="Default">查找</el-button>
              </div>
              <div class="query query-quick">
                <div class="title">快捷筛选</div>
                <div class="info">
                  <template v-if="selectType == 'car'">
                    <el-checkbox-group v-model="queryForm.DATETYPEArr" @change="statusChange" size="default">
                      <el-checkbox label="0">最近一周派车</el-checkbox>
                      <el-checkbox label="1">最近一月派车</el-checkbox>
                      <el-checkbox label="2">最近三月派车</el-checkbox>
                    </el-checkbox-group>
                  </template>
                  <template v-else>
                    <el-checkbox v-model="queryForm.ISFREE" true-label="1" false-label="0" label="只看空闲" size="default" @change="queryEvent" />
                  </template>
                </div>
              </div>
              <div class="table">
                <template v-if="selectType == 'car'">
                  <miniTable ref="tableRef" row-id="PK_CAR" :data="dataList" :height="miniTableHeight" show-overflow="tooltip" @change="AddPZ">
                    <vxe-column type="checkbox" width="60" fixed="left" align="center"></vxe-column>
                    <vxe-column field="CARNO" title="车牌号" align="center" min-width="100" fixed="left"></vxe-column>
                    <vxe-column field="DRIVERNAME" title="司机" align="center" min- width="80"></vxe-column>
                    <vxe-column field="DRIVERPHONE" title="电话" align="center" min-width="110"></vxe-column>
                    <vxe-column field="LOADWEIGHT" title="核载量(吨)" align="right" min-width="80"></vxe-column>
                    <vxe-column field="DISPATCHTIME" title="最后一次派车时间" align="left" width="160"></vxe-column>
                    <vxe-column field="name" title="拉运记录" align="center" width="90">
                      <template #default="{ rowIndex }">
                        <el-link type="primary" @click="handleHistory(rowIndex)">查看</el-link>
                      </template>
                    </vxe-column>
                  </miniTable>
                </template>
                <template v-else>
                  <miniTable ref="tableRef" row-id="PK_DRIVER" :data="dataList" :height="miniTableHeight" show-overflow="tooltip" @change="AddPZ">
                    <vxe-column type="checkbox" width="60" fixed="left" align="center"></vxe-column>
                    <vxe-column field="DRIVERNAME" title="司机" align="center" min-width="100" fixed="left"></vxe-column>
                    <vxe-column field="DRIVERPHONE" title="电话" align="center" width="110"></vxe-column>
                    <vxe-column field="CARNO" title="绑定车辆" align="center" min-width="100"></vxe-column>
                    <vxe-column field="STATUS" title="状态" align="center" width="100">
                      <template #default="{row}">{{row.STATUS == '0'?'空闲':'运输中'}}</template>
                    </vxe-column>
                    <vxe-column field="TSNUM" title="待运输单数" align="center" width="100"></vxe-column>
                    <vxe-column field="name" title="拉运记录" align="center" width="90">
                      <template #default="{ rowIndex }">
                        <el-link type="primary" @click="handleHistory(rowIndex)">查看</el-link>
                      </template>
                    </vxe-column>
                  </miniTable>
                </template>
              </div>
              <div class="page">
                <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50, 100]" :current-page="pageInfo.currentPage" :total="Total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange" />
              </div>
            </div>
          </div>
        </div>
        <div class="group-form-item">
          <div class="group">
            <div class="group-title">
              <div class="title">配载信息</div>
              <div class="pzinfo">已配载
                <p class="desc">
                  <span class="number">{{PZList.length}}</span>车
                  <span class="number">{{calcPZListNum}}</span>趟
                </p>
              </div>
            </div>
            <div class="group-content">
              <el-scrollbar :height="PZHeight" v-if="PZList.length > 0">
                <ul class="list">
                  <li class="list-item" v-for="(item, index) in PZList" :key="index">
                    <div class="head">
                      <div class="title">
                        <template v-if="selectType == 'car'">
                          {{item.CARNO}}
                        </template>
                        <template v-else>
                          {{item.DRIVERNAME}}
                        </template>
                        <div class="hzINfo">
                          核载 <span v-if="item.LOADWEIGHT">{{item.LOADWEIGHT}}吨</span>
                        </div>
                      </div>
                      <div class="info del-icon" @click="PZDel(index)">
                        <el-icon>
                          <Close />
                        </el-icon>
                      </div>
                    </div>
                    <div class="content">
                      <Form ref="PZRef" v-model:formData="PZList[index]" label-width="72px" :formConfig="PZConfig" :rules="PZFormRules">
                        <template #PK_CAR>
                          <el-select v-model="PZList[index].PK_CAR" filterable remote :remote-method="SearchBase" @change="val=>setSearch(val,index)" :loading="loading" @focus="SearchBase('')">
                            <el-option v-for="citem in CarList" :key="citem.BILLNO" :disabled="hasSelectCar.includes(citem.BILLNO)" :value="citem.BILLNO" :label="citem.VNAME">{{citem.VNAME}}</el-option>
                          </el-select>
                        </template>
                        <template #PK_DRIVER>
                          <el-select v-model="PZList[index].PK_DRIVER" filterable remote :remote-method="SearchBase" :loading="loading" @change="val=>setSearch(val,index)" @focus="SearchBase('')">
                            <el-option-group v-for="group in DriverList" :key="group.BILLNO" :label="group.GROUPNAME">
                              <el-option v-for="ditem in group.DRIVERLIST" :key="ditem.BILLNO" :disabled="hasSelectDriver.includes(ditem.BILLNO)" :value="ditem.BILLNO" :label="ditem.DRIVERNAME">{{ditem.DRIVERNAME}}</el-option>
                            </el-option-group>
                          </el-select>
                        </template>
                      </Form>
                      <div class="total">
                        <div class="info"></div>
                        <div class="btn"></div>
                      </div>
                      <miniTable ref="PZTableRef" :min-height="40" :data="item.MATINFOS" :rules="PZTableRules">
                        <vxe-column field="MATERIALNAME" title="货物" min-width="30%" align="left" fixed="left" show-overflow="tooltip" />
                        <vxe-column field="MATSPEC" title="规格" min-width="30%" align="left" show-overflow="tooltip" />
                        <vxe-column field="ENTRUSTNUM" title="委托量" align="center" width="150" v-if="orderData.ASSIGNMENTUNIT != '4'">
                          <template #default="{row}">
                            <el-input v-model="row.ENTRUSTNUM" type="number">
                              <template #append>{{row.NSUMUNIT}}</template>
                            </el-input>
                          </template>
                        </vxe-column>
                        <vxe-column field="menu" title="操作" width="80" align="center">
                          <template #default="{rowIndex}">
                            <el-link v-if="item.MATINFOS && item.MATINFOS.length > 1" type="danger" @click="PZDelRow(index,rowIndex)">删除</el-link>
                          </template>
                        </vxe-column>
                      </miniTable>
                    </div>
                  </li>
                </ul>
              </el-scrollbar>
              <div class="nodata" v-else>
                <img src="/src/assets/images/WZC/pz_nodata.png" />
                <p>您还未配载，请选择左侧列表数据添加配载</p>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </template>
  
  <script setup>
  import Form from "@/components/Form";
  import formGroup from "@/components/Form/formGroup"
  import miniTable from "@/components/Tables/mini"
  import { Search } from "@element-plus/icons-vue";
//   import { getWTOrderDetail, QueryConfig, getPZCars, getPZDrivers, getBaseCar, getDriverGroup, getOrderHistory, PZConfig, savePZ } from "#/WZC/Carrier/Stowage"
  import {  QueryConfig} from "#/WZC/Carrier/TailDifference"

  import { getFormRule } from "@/utils"
  
  const props = defineProps({
    currentData: String
  })
  const emits = defineEmits(['close'])
  
  const BILLNO = computed(() => props.currentData[0].BILLNO || "")
const currentDatas = computed(() => props.currentData[0] || {})
console.log(currentDatas)
  
  const { proxy } = getCurrentInstance();
  const { orderServerType } = proxy.useDict("orderServerType")
  const formGroupRef = ref(null)
  const tableRef = ref(null)
  const listHeight = ref(0)
  const miniTableHeight = ref(200)
  const PZHeight = ref(300)
  
//   const formOpen = ref(true)
//   watch(formOpen, () => {
//     nextTick(() => {
//       listHeight.value = window.innerHeight - 170 - formGroupRef.value.$el.clientHeight
//       miniTableHeight.value = window.innerHeight - 350 - formGroupRef.value.$el.clientHeight
//       PZHeight.value = listHeight.value - 60
//     })
//   })
  
//   /** 订单信息 */
  const orderData = ref({})
  const goodsList = ref([{}])
//   const getOrderData = () => {
//     if (!BILLNO.value) return
//     getWTOrderDetail({
//       BILLNO: BILLNO.value,
//     }).then(res => {
//       orderData.value = res.RESULT
//       goodsList.value = res.RESULT.SUBLIST
//     }).finally(() => {
//     //   nextTick(() => {
//     //     listHeight.value = window.innerHeight - 170 - formGroupRef.value.$el.clientHeight
//     //     miniTableHeight.value = (window.innerHeight - 350 - formGroupRef.value.$el.clientHeight)
//     //     PZHeight.value = listHeight.value - 60
//     //   })
//     })
//   }
//   getOrderData()
  
//   const selectType = ref("car")
//   const mapQueryConfig = computed(() => QueryConfig.filter(el => el.type == selectType.value || !el.type))
  
//   /** 选择数据列表 */
  const queryForm = ref({
    // KEYWORD: "",
    CARNO: "",
    DRIVERNAME: "",
    DATETYPE: "",
    DATETYPEArr: [],
  })

  const selectRow = ref(null)
  const cellClickEvent = () => {
  console.log('单元格点击事件')
}
const radioChangeEvent = ({ row }) => {
  selectRow.value = row
  console.log('单选事件',row)
}
const clearRadioRowEevnt = () => {
  const $table = xTable.value
  if ($table) {
    selectRow.value = null
    $table.clearRadioRow()
  }
}
//   const pageInfo = reactive({
//     pageSize: 10,
//     currentPage: 1
//   })
//   const tableKey = ref("PK_CAR")
//   const dataList = ref([])
//   const Total = ref(0)
//   const getListFn = computed(() => selectType.value == 'driver' ? getPZDrivers : getPZCars)
//   const getData = (marge = false) => {
//     getListFn.value({
//       PAGENUM: pageInfo.currentPage,
//       PAGESIZE: pageInfo.pageSize,
//       ...queryForm.value
//     }).then(res => {
//       dataList.value = res.RESULT.RECORDS
//       Total.value = res.RESULT.TOTAL
//       nextTick(() => {
//         if (PZList.value.length) {
//           let rows = PZList.value.map(el => {
//             tableKey.value = selectType.value == 'car' ? 'PK_CAR' : 'PK_DRIVER'
//             if (selectType.value == 'car') {
//               return { PK_CAR: el.PK_CAR }
//             } else {
//               return { PK_DRIVER: el.PK_DRIVER }
//             }
//           })
//           tableRef.value.xTable.setCheckboxRow(rows, true)
//         }
//       })
//     })
//   }
//   getData();
  
//   const statusChange = () => {
//     if (queryForm.value.DATETYPEArr.length > 1) {
//       queryForm.value.DATETYPEArr.splice(0, 1)
//     }
//     queryForm.value.DATETYPE = queryForm.value.DATETYPEArr[0]
//     queryEvent()
//   }
  
//   // 查询条件中的下拉触发查询
//   const formSelect = (res) => {
//     if (res.query) queryEvent();
//   };
//   const queryEvent = () => {
//     pageInfo.currentPage = 1;
//     tableKey.value = selectType.value == 'car' ? 'PK_CAR' : 'PK_DRIVER'
//     getData();
//   }
//   function handlePageChange({ currentPage, pageSize }) {
//     pageInfo.currentPage = currentPage;
//     pageInfo.pageSize = pageSize;
//     getData();
//   }
  
//   /** 配载相关 */
//   const PZRef = ref(null)
//   const PZTableRef = ref(null)
//   const PZList = ref([])
//   const PZFormRules = getFormRule(PZConfig)
//   const PZTableRules = reactive({
//     ENTRUSTNUM: [{ required: true, min: 0.1, type: 'number', message: "委托量不可为空" }],
//   })
//   const calcPZListNum = computed(() => PZList.value.reduce((pre, cur) => pre += cur.ROUND, 0))
  
//   const CarList = ref([])
//   const DriverList = ref([])
  
//   const loading = ref(false)
//   const SearchFn = computed(() => selectType.value == 'car' ? getDriverGroup : getBaseCar)
//   const SearchBase = keyword => {
//     loading.value = true
//     SearchFn.value({
//       KEYWORD: keyword,
//       PAGENUM: 1,
//       PAGESIZE: 100
//     }).then(res => {
//       selectType.value == 'car' ? DriverList.value = res.RESULT : CarList.value = res.RESULT
//     }).finally(() => {
//       loading.value = false
//     })
//   }
//   const setSearch = (val, index) => {
//     if (selectType.value == 'driver') {
//       let data = CarList.value.find(el => el.BILLNO == val)
//       PZList.value[index].CARNO = data.VNAME
//       PZList.value[index].LOADWEIGHT = data.LOADWEIGHT
//     } else {
//       let data = treeFind(DriverList.value, (el) => el.BILLNO == val)
//       PZList.value[index].DRIVERNAME = data.DRIVERNAME
//       PZList.value[index].DRIVERPHONE = data.DRTEL
//     }
//   }
//   // 查找树结构中的数据
//   function treeFind(tree, func, found = { value: false }) {
//     for (const data of tree) {
//       if (func(data)) {
//         found.value = true;
//         return data;
//       }
//       if (data.DRIVERLIST || data.children) {
//         const res = treeFind(data.DRIVERLIST || data.children, func, found);
//         if (res) return res;
//         if (found.value) found.value = false;
//       }
//     }
//     return null;
//   }
//   const hasSelectCar = computed(() => PZList.value.map(el => el.PK_CAR))
//   const hasSelectDriver = computed(() => PZList.value.map(el => el.PK_DRIVER))
//   const AddPZ = ({ checked, isFull, row, selectRow }) => {
//     if (checked) {
//       let goods = orderData.value.ASSIGNMENTUNIT != '4' ? [...goodsList.value.filter(el => el.TRANSURPLUS > 0).map(al => {
//         return {
//           PK_MATERIAL: al.PK_MATERIAL,
//           MATERIALNAME: al.MATERIALNAME,
//           MATSPEC: al.MATSPEC,
//           ENTRUSTNUM: 0,
//           NSUMUNIT: al.NSUMUNIT,
//           BILLNO: al.DTLBILLNO
//         }
//       })] : [...goodsList.value.map(al => {
//         return {
//           PK_MATERIAL: al.PK_MATERIAL,
//           MATERIALNAME: al.MATERIALNAME,
//           MATSPEC: al.MATSPEC,
//           ENTRUSTNUM: 0,
//           NSUMUNIT: al.NSUMUNIT,
//           BILLNO: al.DTLBILLNO
//         }
//       })]
//       if (!goods.length) return proxy.$modal.notifyWarning("物料拉运剩余量不足！")
//       if (isFull) {
//         PZList.value = selectRow.map(el => {
//           return {
//             assignMentUnit: orderData.value.ASSIGNMENTUNIT,
//             selectType: selectType.value,
//             PK_DRIVER: el.PK_DRIVER,
//             DRIVERNAME: el.DRIVERNAME,
//             DRIVERPHONE: el.DRIVERPHONE,
//             PK_CAR: el.PK_CAR,
//             CARNO: el.CARNO,
//             LOADWEIGHT: el.LOADWEIGHT,
//             ROUND: orderData.value.ASSIGNMENTUNIT != '4' ? 1 : 0,
//             TRAINNUMBER: orderData.value.ASSIGNMENTUNIT == '4' ? 1 : 0,
//             ETADATE: "",
//             STARTDATE: "",
//             ISONLINE: "0",
//             PROVIDER: "",
//             MATINFOS: goods
//             // [...goodsList.value.map(al => {
//             //   return {
//             //     PK_MATERIAL: al.PK_MATERIAL,
//             //     MATERIALNAME: al.MATERIALNAME,
//             //     MATSPEC: al.MATSPEC,
//             //     ENTRUSTNUM: 0,
//             //     UNIT: al.WTUNIT,
//             //     DTLBILLNO: al.DTLBILLNO
//             //   }
//             // })]
//           }
//         })
//       } else {
//         let form = {
//           assignMentUnit: orderData.value.ASSIGNMENTUNIT,
//           selectType: selectType.value,
//           PK_DRIVER: row.PK_DRIVER,
//           DRIVERNAME: row.DRIVERNAME,
//           DRIVERPHONE: row.DRIVERPHONE,
//           PK_CAR: row.PK_CAR,
//           CARNO: row.CARNO,
//           LOADWEIGHT: row.LOADWEIGHT,
//           ROUND: orderData.value.ASSIGNMENTUNIT != '4' ? 1 : 0,
//           TRAINNUMBER: orderData.value.ASSIGNMENTUNIT == '4' ? 1 : 0,
//           ETADATE: "",
//           STARTDATE: "",
//           ISONLINE: "0",
//           PROVIDER: "",
//           MATINFOS: goods
//           // [...goodsList.value.map(el => {
//           //   return {
//           //     PK_MATERIAL: el.PK_MATERIAL,
//           //     MATERIALNAME: el.MATERIALNAME,
//           //     MATSPEC: el.MATSPEC,
//           //     ENTRUSTNUM: 0,
//           //     NSUMUNIT: el.NSUMUNIT,
//           //     BILLNO: el.DTLBILLNO
//           //   }
//           // })]
//         }
//         PZList.value.push(form)
//       }
//       nextTick(() => {
//         SearchBase()
//       })
//     } else {
//       if (isFull) {
//         PZList.value = []
//       } else {
//         let index = PZList.value.findIndex(el => selectType.value == 'car' ? el.PK_CAR == row.PK_CAR : el.PK_DRIVER == row.PK_DRIVER)
//         PZList.value.splice(index, 1)
//       }
//     }
//   }
//   const PZDel = index => {
//     let delRow = PZList.value[index]
//     proxy.$modal.confirm("是否删除当前配载数据？").then(() => {
//       let row = dataList.value.find(el => selectType.value == 'car' ? el.PK_CAR == delRow.PK_CAR : el.PK_DRIVER == delRow.PK_DRIVER)
//       if (row) tableRef.value.xTable.setCheckboxRow(row, false)
//       PZList.value.splice(index, 1)
//     });
//   }
//   const PZDelRow = (index, rowIndex) => {
//     proxy.$modal.confirm("是否删除当前货物？").then(() => {
//       PZList.value[index].MATINFOS.splice(rowIndex, 1)
//     });
//   }
  
//   function sum(arr) {
//     return arr.reduce((prev, cur) => prev + cur)
//   }
  
//   const validatePZList = () => {
//     return new Promise(resolve => {
//       let PZRefArr = []
//       for (let i = 0; i < PZRef.value.length; i++) {
//         const form = PZRef.value[i]
//         const table = PZTableRef.value[i]
//         PZRefArr.push(form.submitForm())
//         PZRefArr.push(table.xTable.validate(true))
//       }
//       Promise.all(PZRefArr).then((res) => {
//         let valids = res.filter((el) => el == undefined || el == true);
//         let PZok = true
//         if (orderData.value.ASSIGNMENTUNIT == '1') {
//           for (let i = 0; i < PZList.value.length; i++) {
//             const { LOADWEIGHT, MATINFOS, CARNO } = PZList.value[i];
//             let GOODSLOAD = sum(MATINFOS.map(el => Number(el.ENTRUSTNUM)))
//             if (GOODSLOAD > LOADWEIGHT) {
//               PZok = false
//               return proxy.$modal.notifyWarning(`${CARNO} 委托量超出核载`)
//             }
//           }
//         }
//         resolve(PZok && (valids.length == PZRefArr.length));
//       })
//     })
//   }
  
//   const submitPZ = () => {
//     validatePZList().then(valid => {
//       if (!valid) return
//       savePZ({
//         BILLNO: BILLNO.value,
//         MODE: "1",
//         CARINFOS: [...PZList.value]
//       }).then(res => {
//         proxy.$modal.msgSuccess("提交成功");
//         emits("close")
//       })
//     })
//   }
  
//   /** 获取拉运记录 */
//   const orderHistory = ref([])
//   const handleHistory = index => {
//     let row = dataList.value[index]
//     getOrderHistory({
//       PAGENUM: 1,
//       PAGESIZE: 10,
//     }).then(res => {
//       orderHistory.value = res.RESULT
//     })
//   }
  
  </script>
  <style lang="scss" scoped>
  .app-wrap {
    // background: #e7e9f1;
  }
  .page-outbtn {
    position: absolute;
    top: 4px;
    right: 10px;
    z-index: 5;
    display: flex;
    align-items: center;
  }
  .group {
    display: block;
    height: 100%;
    background: #fff;
    padding: 10px 20px;
    &-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--el-border-color);
      margin-bottom: 10px;
      .title {
        font-weight: bold;
        font-size: 16px;
      }
      .pzinfo {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #8b8b8b;
        .desc {
          margin-left: 5px;
          font-size: 15px;
          color: var(--el-color-primary);
        }
        p {
          margin: 0;
          padding: 0;
        }
      }
    }
    &-content {
      height: calc(100% - 33px);
    }
  }
  .content {
    margin-bottom: 10px;
    &-item {
      margin: 5px 0;
      display: flex;
      align-items: center;
      font-size: 16px;
      .label {
        color: #1a1a1a;
        white-space: nowrap;
        &::after {
          content: "：";
        }
      }
      .value {
        color: #1a1a1a;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  .goodsList {
    list-style: none;
    margin: 0 0 10px;
    padding: 0;
    display: flex;
    align-items: stretch;
    &-item {
      width: calc((100% - 20px) / 3);
      margin-right: 10px;
      padding: 15px;
      background: #f3f7ff;
      border-radius: 10px;
      &:last-child {
        margin-right: 0;
      }
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          display: flex;
          align-items: center;
          .materiel {
            font-size: 16px;
            color: #1a1a1a;
            font-weight: bold;
            margin-right: 10px;
          }
          .desc {
            font-size: 14px;
            color: #444;
          }
        }
      }
      .line {
        margin: 5px 0;
      }
      .surplus {
        color: #0b0b0b;
        font-size: 14px;
      }
    }
  }
  .group-form {
    display: flex;
    align-items: stretch;
    &-item {
      flex: 1;
      width: calc((100% - 10px) / 2);
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .query {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    margin: 5px 0;
    &-quick {
      color: #606266;
    }
  }
  .nodata {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 14px;
    overflow: hidden;
  }
  .list {
    list-style: none;
    margin: 0;
    padding: 10px;
    &-item {
      border: 1px solid var(--el-border-color);
      border-radius: 3px;
      margin-bottom: 10px;
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background: #e8effe;
        overflow: hidden;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        .title {
          width: calc(100% - 25px);
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .hzINfo {
            font-size: 14px;
            color: #707070;
            font-weight: normal;
            span {
              color: var(--el-color-primary);
              font-weight: bold;
            }
          }
        }
        .del-icon {
          cursor: pointer;
        }
      }
      .content {
        padding: 10px;
        margin: 0;
      }
    }
  }
  </style>