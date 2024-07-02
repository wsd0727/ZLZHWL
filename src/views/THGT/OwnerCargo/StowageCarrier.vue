<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" @click="submitPZ" :loading="pageLoading">提交</el-button>
  </teleport>
  <div class="app-wrap">
    <formGroup ref="formGroupRef" class="group" title="订单信息" v-model:visable="formOpen">
      <div class="group-content">
        <el-row class="content">
          <el-col :span="6" class="content-item">
            <div class="label">委托单位</div>
            <TextOverflow :content="orderData.COMPANYNAME" class="value" />
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">托运单位</div>
            <TextOverflow :content="orderData.TRANORGNAME" class="value" />
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">线路</div>
            <TextOverflow :content="`${orderData.LINENAME} (${orderData.MILEAGE}KM) `" class="value" />
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">要求发货时间</div>
            <TextOverflow :content="orderData.STARTTIME" class="value" />
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">要求送达时间</div>
            <TextOverflow :content="orderData.ENDTIME" class="value" />
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">车型</div>
            <div class="value">{{selectDictLabel(brandModel,orderData.CARTYPEREQUIE)}}</div>
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">车辆规格(mm)</div>
            <div class="value">{{orderData.CARMINLENGTH}}*{{orderData.CARMINWIDTH}}*{{orderData.CARMINHEIGHT}}</div>
          </el-col>
          <el-col :span="6" class="content-item" v-if="orderData.ASSIGNMENTUNIT == '4'">
            <div class="label">拉运次数</div>
            <div class="value">{{orderData.ENTRUSTNUM}}次</div>
          </el-col>
        </el-row>
        <miniTable height="186" :data="goodsList" :mergeRow="['MATERIALNAME','SENDCOMPANY','RECVCOMPANY']">
          <vxe-column field="MATERIALNAME" title="货物" min-width="200" align="left" fixed="left" show-overflow="tooltip" />
          <vxe-column field="MATSPEC" title="规格" min-width="150" align="left" show-overflow="tooltip" />
          <vxe-column field="NORIGTAXPRICE" title="单价" align="right" width="120">
            <template #default="{row}">
              {{row.NORIGTAXPRICE}}元/{{row.TRANSUNIT}}
            </template>
          </vxe-column>
          <vxe-column field="DTLNUM" title="订单量" align="right" width="120" v-if="orderData.ASSIGNMENTUNIT != '4'">
            <template #default="{row}">
              {{row.DTLNUM}}{{row.TRANSUNIT}}
            </template>
          </vxe-column>
          <vxe-column field="ENTRUSTNUM" title="委托剩余量" align="right" width="120" v-if="orderData.ASSIGNMENTUNIT != '4'">
            <template #default="{row}">
              {{row.ENTRUSTNUM}}{{row.TRANSUNIT}}
            </template>
          </vxe-column>
          <vxe-column field="SENDCOMPANY" title="发货方" align="left" min-width="150" />
          <vxe-column field="RECVCOMPANY" title="收货方" align="left" min-width="150" />
        </miniTable>
      </div>
    </formGroup>

    <div class="group-form" :style="{height: `${listHeight}px`}">
      <div class="group-form-item">
        <div class="group">
          <div class="group-title">
            <div class="title">选择承运商</div>
          </div>
          <div class="group-content">
            <div class="query">
              <Form class="query-form" ref="formRefTop" label-width="50px" v-model:formData="queryForm" :formConfig="mapQueryConfig" inline @select="formSelect" @enter="queryEvent" />
              <el-button @click="queryEvent" type="primary" size="Default">查找</el-button>
            </div>
            <div class="table">
              <miniTable ref="tableRef" row-id="BILLNO" :data="dataList" :height="miniTableHeight" show-overflow="tooltip" @change="AddPZ">
                <vxe-column type="checkbox" width="60" fixed="left" align="center"></vxe-column>
                <vxe-column field="VNAME" title="名称" align="left" min-width="100" fixed="left" show-overflow="tooltip"></vxe-column>
                <vxe-column field="ISQUALIFIED" title="类型" align="center" width="100" show-overflow="tooltip">
                  <template #default="{row}">{{ row.ISQUALIFIED == '1'?'一般纳税人':'个人' }}</template>
                </vxe-column>
                <vxe-column field="AREANAME" title="区域" align="left" min-width="110" show-overflow="tooltip"></vxe-column>
                <vxe-column field="GROUPNAME" title="分组" align="center" min-width="100" show-overflow="tooltip"></vxe-column>
              </miniTable>
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
                <span class="number">{{PZList.length}}</span>家
              </p>
            </div>
          </div>
          <div class="group-content">
            <el-scrollbar :height="PZHeight" v-if="PZList.length > 0">
              <ul class="list">
                <li class="list-item" v-for="(item, index) in PZList" :key="index">
                  <div class="head">
                    <div class="title">{{item.CARRIERNAME}}</div>
                    <div class="info del-icon" @click="PZDel(index)">
                      <el-icon>
                        <Close />
                      </el-icon>
                    </div>
                  </div>
                  <div class="content">
                    <Form ref="PZRef" v-if="orderData.ASSIGNMENTUNIT == '4'" v-model:formData="PZList[index]" label-width="72px" :formConfig="PZConfig" :rules="PZFormRules" />
                    <div class="total">
                      <div class="info"></div>
                      <div class="btn"></div>
                    </div>
                    <miniTable ref="PZTableRef" :min-height="40" :data="item.MATERIALPARAMLIST" :rules="PZTableRules">
                      <vxe-column field="MATERIALNAME" title="货物" min-width="30%" align="left" fixed="left" show-overflow="tooltip" />
                      <vxe-column field="MATSPEC" title="规格" min-width="30%" align="left" show-overflow="tooltip" />
                      <vxe-column field="ENTRUSTNUM" title="委托量" align="center" min-width="25%" v-if="orderData.ASSIGNMENTUNIT != '4'">
                        <!-- <template #default="{row}">
                          <el-input-number :controls="false" v-model="row.ENTRUSTNUM" clearable type="number" :min="0" @input="calcPoint($event, row)" @blur="blurPoint(row)" style="width: 100%">
                          </el-input-number>
                        </template> -->
                        <template #default="{row}">
                          <el-input v-model="row.ENTRUSTNUM" type="number">
                            <template #append>{{row.TRANSUNIT}}</template>
                          </el-input>
                        </template>
                      </vxe-column>
                      <vxe-column field="menu" title="操作" width="80" align="center">
                        <template #default="{rowIndex}">
                          <el-link v-if="item.MATERIALPARAMLIST.length > 1" type="danger" @click="PZDelRow(index,rowIndex)">删除</el-link>
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
    </div>
  </div>
</template>

<script setup>
import Form from "@/components/Form";
import formGroup from "@/components/Form/formGroup"
import miniTable from "@/components/Tables/mini"
import { Search } from "@element-plus/icons-vue";
import { getOrderDetail, QueryConfig, getCarrierGroup, savePZCarrier } from "#/WZC/OwnerCargo/Stowage"
import { getFormRule } from "@/utils"
import TextOverflow from "@/components/TextOverflow"

const props = defineProps({
  currentData: String
})
const emits = defineEmits(['close'])

const BILLNO = computed(() => props.currentData[0].BILLNO || "")

const { proxy } = getCurrentInstance();
const { brandModel } = proxy.useDict("brandModel")
const formGroupRef = ref(null)
const tableRef = ref(null)
const listHeight = ref(0)
const miniTableHeight = ref(200)
const PZHeight = ref(300)

const pageLoading = ref(false)

const formOpen = ref(true)
watch(formOpen, () => {
  nextTick(() => {
    listHeight.value = window.innerHeight - 170 - formGroupRef.value.$el.clientHeight
    miniTableHeight.value = window.innerHeight - 300 - formGroupRef.value.$el.clientHeight
    PZHeight.value = listHeight.value - 60
  })
})

/** 订单信息 */
const orderData = ref({})
const goodsList = ref([])
const getOrderData = () => {
  if (!BILLNO.value) return
  getOrderDetail({
    BILLNO: BILLNO.value,
  }).then(res => {
    orderData.value = res.RESULT
    goodsList.value = res.RESULT.SUBLIST
  }).finally(() => {
    nextTick(() => {
      listHeight.value = window.innerHeight - 170 - formGroupRef.value.$el.clientHeight
      miniTableHeight.value = (window.innerHeight - 300 - formGroupRef.value.$el.clientHeight)
      PZHeight.value = listHeight.value - 60
    })
  })
}
getOrderData()

const selectType = ref("car")
const mapQueryConfig = computed(() => QueryConfig.filter(el => el.type == selectType.value || !el.type))

/** 选择数据列表 */
const queryForm = ref({
  // KEYWORD: "",
  CARNO: "",
  DRIVERNAME: "",
  DATETYPE: "0"
})
const pageInfo = reactive({
  pageSize: 10,
  currentPage: 1
})
const dataList = ref([])
const Total = ref(0)
const getData = (marge = false) => {
  getCarrierGroup({
    PAGENUM: pageInfo.currentPage,
    PAGESIZE: pageInfo.pageSize,
    ...queryForm.value
  }).then(res => {
    dataList.value = res.RESULT.RECORDS
    Total.value = res.RESULT.TOTAL
    nextTick(() => {
      if (PZList.value.length) {
        let rows = PZList.value.map(el => {
          return { BILLNO: el.PK_CARRIER }
        })
        tableRef.value.xTable.setCheckboxRow(rows, true)
      }
    })
  })
}
getData();

// 查询条件中的下拉触发查询
const formSelect = (res) => {
  if (res.query) queryEvent();
};
const queryEvent = () => {
  pageInfo.currentPage = 1;
  getData();
}
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  getData();
}

/** 配载相关 */
const PZTableRef = ref(null)
const PZList = ref([])
const PZConfig = reactive([
  { FIELD: "TRAINNUMBER", LABEL: "次数", COL: 8, CONTROLS: "ExNumber", DEFAULTVAL: "1", ISSHOW: 1, SUFFIX: "次", MAXLENGTH: "9999", ISREQUIRE: 1, OTHER: "", SLOTCFG: '{"MIN":"1"}', LINKAGE: '{"POINT":"0"}' },
])
const PZFormRules = getFormRule(PZConfig)
const PZTableRules = reactive({
  ENTRUSTNUM: [{ required: true, min: 0.1, type: 'number', message: "委托量不可为空" }],
})
const calcPZListNum = computed(() => PZList.value.reduce((pre, cur) => pre += cur.ROUND, 0))
const calcPoint = (ev, row) => {
  let num = Number(ev)
  row.ENTRUSTNUM = Number(num.toFixed(2))
}
const blurPoint = row => {
  let num = Number(row.ENTRUSTNUM)
  row.ENTRUSTNUM = Number(num.toFixed(2))
}
const AddPZ = ({ checked, isFull, row, selectRow }) => {
  if (checked) {
    let goods = orderData.value.ASSIGNMENTUNIT == '4' ? goodsList.value.map(al => {
      return {
        BILLNO: al.BILLNO,
        PK_MATERIAL: al.PK_MATERIAL,
        MATERIALNAME: al.MATERIALNAME,
        MATSPEC: al.MATSPEC,
        TRANSUNIT: al.TRANSUNIT,
        ENTRUSTNUM: 0,
      }
    }) : [...goodsList.value.filter(el => el.ENTRUSTNUM > 0).map(al => {
      return {
        BILLNO: al.BILLNO,
        PK_MATERIAL: al.PK_MATERIAL,
        MATERIALNAME: al.MATERIALNAME,
        MATSPEC: al.MATSPEC,
        TRANSUNIT: al.TRANSUNIT,
        ENTRUSTNUM: 0,
      }
    })]
    if (!orderData.value.ENTRUSTNUM) return proxy.$modal.notifyWarning("拉运次数不足！")
    if (!goods.length) return proxy.$modal.notifyWarning("物料剩余委托量不足！")
    if (isFull) {
      PZList.value = selectRow.map(el => {
        return {
          BILLNO: BILLNO.value,
          PK_CARRIER: el.BILLNO,
          CARRIERNAME: el.VNAME,
          CONTACTS: el.CONTACTS,
          CARRIERPHONE: el.CONTACTTEL,
          MATERIALPARAMLIST: goods,
          TRAINNUMBER: 0,
        }
      })
    } else {
      let form = {
        BILLNO: BILLNO.value,
        PK_CARRIER: row.BILLNO,
        CARRIERNAME: row.VNAME,
        CONTACTS: row.CONTACTS,
        CARRIERPHONE: row.CONTACTTEL,
        MATERIALPARAMLIST: goods,
        TRAINNUMBER: 0,
      }
      PZList.value.push(form)
    }
  } else {
    if (isFull) {
      PZList.value = []
    } else {
      let index = PZList.value.findIndex(el => el.PK_CARRIER == row.PK_CARRIER)
      PZList.value.splice(index, 1)
    }
  }
}
const PZDel = index => {
  let delRow = PZList.value[index]
  proxy.$modal.confirm("是否删除当前配载数据？").then(() => {
    let row = dataList.value.find(el => el.BILLNO == delRow.PK_CARRIER)
    if (row) tableRef.value.xTable.setCheckboxRow(row, false)
    PZList.value.splice(index, 1)
  });
}
const PZDelRow = (index, rowIndex) => {
  proxy.$modal.confirm("是否删除当前货物？").then(() => {
    PZList.value[index].MATERIALPARAMLIST.splice(rowIndex, 1)
  });
}

const validatePZList = () => {
  return new Promise(resolve => {
    if (!PZTableRef.value || !PZTableRef.value.length) {
      return proxy.$modal.msgError("请选择承运商");
    }
    let PZRefArr = []
    for (let i = 0; i < PZTableRef.value.length; i++) {
      const table = PZTableRef.value[i]
      PZRefArr.push(table.xTable.validate(true))
    }
    Promise.all(PZRefArr).then((res) => {
      let valids = res.filter((el) => el == undefined || el == true);
      resolve(valids.length == PZRefArr.length);
    })
  })
}

const submitPZ = () => {
  validatePZList().then(valid => {
    if (!valid) return
    pageLoading.value = true
    savePZCarrier({ data: PZList.value }).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      pageLoading.value = false
      emits("close")
    }).catch(err => {
      pageLoading.value = false
    })
  })
}

/** 获取拉运记录 */
const orderHistory = ref([])
const handleHistory = index => {
  let row = dataList.value[index]
  getOrderHistory({
    PAGENUM: 1,
    PAGESIZE: 10,
  }).then(res => {
    orderHistory.value = res.RESULT
  })
}

</script>
<style lang="scss" scoped>
.app-wrap {
  background: #e7e9f1;
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
      cursor: default;
      .title {
        font-size: 16px;
        font-weight: bold;
        max-width: 80%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
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