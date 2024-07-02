<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" :disabled="(residueLoadedNum < 0 && residueLoadedNum < 0.00) || !formData.PK_CAR" @click="submitPZ">提交</el-button>
  </teleport>
  <div class="app-wrap">
    <div class="box-card" style="background-color: #fff;padding: 20px;">
      <Form ref="PZRef" v-model:formData="formData" label-width="72px" :formConfig="PZConfig" :rules="PZFormRules">
        <template #PK_CAR>
          <el-select filterable remote :remote-method="val => SearchBase(val, 'car')" v-model="formData.PK_CAR" style="width: 100%;" @change="val => setSearch(val, index)" :loading="loading" @focus="SearchBase('', 'car')">
            <el-option v-for="citem in CarList" :key="citem.BILLNO" :value="citem.BILLNO" :label="citem.VNAME">{{ citem.VNAME }}</el-option>
          </el-select>
        </template>
        <template #PK_DRIVER>
          <el-select filterable remote v-model="formData.PK_DRIVER" style="width: 100%;" :remote-method="val => SearchBase(val, 'driver')" :loading="loading" @change="val => setSearch(val, index)" @focus="SearchBase('', 'driver')">
            <el-option-group v-for="group in DriverList" :key="group.BILLNO" :label="group.GROUPNAME">
              <el-option v-for="ditem in group.DRIVERLIST" :key="ditem.BILLNO" :value="ditem.BILLNO" :label="ditem.DRIVERNAME">{{ ditem.DRIVERNAME }}</el-option>
            </el-option-group>
          </el-select>
        </template>
        <template #LOADWEIGHT>
          <span class="text-danger text-xl text-blod">{{ formData.LOADWEIGHT }} </span>吨
        </template>
      </Form>
    </div>
    <formGroup ref="formGroupRef" class="group mt10" title="合单信息" :fold="false">
      <div class="group-content">
        <div class="group-form">
          <div class="group-form-item">
            <Form class="query-form" ref="formRefTop" label-width="80px" v-model:formData="queryForm" :formConfig="QueryConfig" inline @select="formSelect" @enter="queryEvent" />
            <template v-if="dataList && dataList.length > 0">
              <miniTable ref="tableRef" row-id="PK_CAR" :data="dataList" :height="miniTableHeight" class="mt20" show-overflow="tooltip" @change="AddPZ">
                <vxe-column type="checkbox" width="50" fixed="left" align="center"></vxe-column>
                <vxe-column field="BILLNO" title="订单号" align="center" min-width="170" fixed="left"></vxe-column>
                <vxe-column field="BUSSTYPE" title="业务类型" align="center" min-width="70">
                  <template #default="{ row }">{{ selectDictLabel(businessType, row.BUSSTYPE)}}</template>
                </vxe-column>
                <vxe-column field="MATERIALNAME" title="物料" align="center" min-width="110"></vxe-column>
                <vxe-column field="TRANSURPLUS" title="委托剩余量" align="left" min-width="80"></vxe-column>
                <vxe-column field="SENDCOMPANY" title="发货方" align="left" width="220"></vxe-column>
                <vxe-column field="RECVCOMPANY" title="收货方" align="left" width="220"></vxe-column>
                <vxe-column field="TRANSTYPE" title="运输方式" align="left" width="80">
                  <template #default="{ row }">{{ selectDictLabel(transportType, row.TRANSTYPE)}}</template>
                </vxe-column>
                <vxe-column field="TRANSMODEL" title="运输模式" align="left" width="80">
                  <template #default="{ row }">{{ selectDictLabel(transportModel, row.TRANSMODEL)}}</template>
                </vxe-column>
                <vxe-column field="SENDTYPE" title="配送方式" align="left" width="80">
                  <template #default="{ row }">{{ selectDictLabel(psType, row.SENDTYPE) }}</template>
                </vxe-column>
                <vxe-column field="ENTRUST" title="委托方式" align="left" width="80">
                  <template #default="{ row }">{{ selectDictLabel(entrustType, row.ENTRUST) }}</template>
                </vxe-column>
                <!-- <vxe-column field="SENDADDRESS" title="发货地址" align="left" width="200"></vxe-column> -->
                <!-- <vxe-column field="RECVADDRESS" title="收货地址" align="left" width="200"></vxe-column> -->
                <!-- <vxe-column field="name" title="拉运记录" align="center" width="90">
                                <template #default="{ rowIndex }">
                                    <el-link type="primary" @click="handleHistory(rowIndex)">查看</el-link>
                                </template>
                            </vxe-column> -->
              </miniTable>
              <div class="page">
                <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50, 100]" :current-page="pageInfo.currentPage" :total="Total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange" />
              </div>
            </template>
            <div class="nodata" v-else>
              <img src="/src/assets/images/WZC/pz_nodata.png" />
              <p>请选择合单规则</p>
            </div>

          </div>
          <div class="group-form-item">
            <div class="group">
              <div class="group-title">
                <!-- <div class="title">配载信息</div> -->
                <div class="pzinfo">已配载
                  <p class="desc">
                    {{ loadedNum }} 吨
                  </p>
                </div>
                <div class="pzinfo">剩余可配载
                  <p class="desc">
                    {{ residueLoadedNum }} 吨
                  </p>
                </div>
              </div>
              <template v-if="rightDataList && rightDataList.length > 0">
                <miniTable ref="PZTableRef" :min-height="40" :data="rightDataList" :rules="PZTableRules">
                  <vxe-column field="BILLNO" title="订单号" align="center" min-width="180" fixed="left"></vxe-column>
                  <vxe-column field="MATERIALNAME" title="物料" align="center" min-width="110"></vxe-column>
                  <vxe-column field="TRANSURPLUS" title="委托剩余量" align="left" min-width="80">
                    <template #default="{ row }">
                      <span>{{ row.TRANSURPLUS }}{{ row.NSUMUNIT }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="ENTRUSTNUM" title="委托量" align="center" width="150">
                    <template #default="{ row }">
                      <el-input v-model="row.ENTRUSTNUM" type="number" :maxlength="row.TRANSURPLUS">
                        <template #append>{{ row.NSUMUNIT }}</template>
                      </el-input>
                    </template>
                  </vxe-column>
                  <!-- <vxe-column field="menu" title="操作" width="80" align="center">
                                        <template #default="{ rowIndex }">
                                            <el-link v-if="item.MATINFOS && item.MATINFOS.length > 1"
                                            type="danger"
                                            @click="PZDelRow(index, rowIndex)">删除</el-link>
                                        </template>
                                    </vxe-column> -->
                </miniTable>
              </template>
              <div class="nodata" v-else>
                <img src="/src/assets/images/WZC/pz_nodata.png" />
                <p>您还未配载，请选择左侧列表数据添加配载</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </formGroup>
  </div>
</template>
  
<script setup>
import Form from "@/components/Form";
import formGroup from "@/components/Form/formGroup"
import miniTable from "@/components/Tables/mini"
import { Search } from "@element-plus/icons-vue";
import { PZConfig, QueryConfig, getLeftList, getDriverGroup, getBaseCar, getPZCars, savePZ } from "#/WZC/OwnerCargo/JoinOrders"

import { getFormRule } from "@/utils"
import { computed } from "vue";
import json from "../../../components/FileIcon/config";

const props = defineProps({
  currentData: String
})
const emits = defineEmits(['close'])

const PKBILLNO = computed(() => props.currentData[0].PKBILLNO || "")
const BILLNO = computed(() => props.currentData[0].BILLNO || "")

const currentDatas = computed(() => props.currentData[0] || {})


const { proxy } = getCurrentInstance();
const { businessType, transportType, transportModel, psType, entrustType } = proxy.useDict("businessType", "transportType", "transportModel", "psType", "entrustType")
const PZHeight = ref(300)

const formOpen = ref(true)

const selectType = ref("car")

/** 选择数据列表 */
const queryForm = ref({
  POLICYBILLNO: '',
  BILLNO: BILLNO,
})
const formData = ref({
  ROUND: 1
})
const rightDataList = ref([])

onMounted(() => {
  rightDataList.value[0] = {
    BILLNO: currentDatas.value.BILLNO,
    PK_TSORDER: currentDatas.value.PK_TSORDER,
    MATERIALNAME: currentDatas.value.MATERIALNAME,
    TRANSURPLUS: currentDatas.value.TRANSURPLUS,
    ENTRUSTNUM: currentDatas.value.TRANSURPLUS,
    NSUMUNIT: currentDatas.value.FIXENTRUSTNUMUNIT,
  }
});

const loadedNum = computed(() => rightDataList.value.reduce((pre, cur) => pre += Number(cur.ENTRUSTNUM), 0))
const residueLoadedNum = computed(() => formData.value.LOADWEIGHT && loadedNum ? (formData.value.LOADWEIGHT - loadedNum.value).toFixed(2) : 0)
const pageInfo = reactive({
  pageSize: 10,
  currentPage: 1
})

const dataList = ref([])
const Total = ref(0)
const getData = (marge = false) => {
  getLeftList({ ...queryForm.value, PAGENUM: 1, PAGESIZE: 20, BILLNO: currentDatas.value.BILLNO }).then(res => {
    dataList.value = res.RESULT.RECORDS
    Total.value = res.RESULT.TOTAL
  })
}
getData()

// 查询条件中的下拉触发查询
const formSelect = (res) => {
  // getData()
};
const queryEvent = () => {
  pageInfo.currentPage = 1;
  getData();
}

/** 配载相关 */
const PZRef = ref(null)
const PZFormRules = getFormRule(PZConfig)
const PZTableRules = reactive({
  ENTRUSTNUM: [{ required: true, min: 0.1, type: 'number', message: "委托量不可为空" }],
})

const CarList = ref([])
const DriverList = ref([])

const loading = ref(false)
const SearchFn = computed(() => selectType.value == 'car' ? getBaseCar : getDriverGroup)
const SearchBase = (keyword, flag) => {
  selectType.value = flag
  loading.value = true
  SearchFn.value({
    KEYWORD: keyword,
    PAGENUM: 1,
    PAGESIZE: 100
  }).then(res => {
    selectType.value == 'driver' ? DriverList.value = res.RESULT : CarList.value = res.RESULT
  }).finally(() => {
    loading.value = false
  })
}

function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  getData();
}

const setSearch = (val, index) => {
  if (selectType.value == 'car') {
    let data = CarList.value.find(el => el.BILLNO == val)
    formData.value.CARNO = data.VNAME
    formData.value.LOADWEIGHT = data.LOADWEIGHT
  } else {
    let data = treeFind(DriverList.value, (el) => el.BILLNO == val)
    formData.value.DRIVERNAME = data.DRIVERNAME
    formData.value.DRIVERPHONE = data.DRTEL
  }
}

// 查找树结构中的数据
function treeFind(tree, func, found = { value: false }) {
  for (const data of tree) {
    if (func(data)) {
      found.value = true;
      return data;
    }
    if (data.DRIVERLIST || data.children) {
      const res = treeFind(data.DRIVERLIST || data.children, func, found);
      if (res) return res;
      if (found.value) found.value = false;
    }
  }
  return null;
}


const AddPZ = ({ checked, isFull, row, selectRow }) => {
  if (checked) {
    let data = []
    data = selectRow.map(ele => {
      return {
        BILLNO: ele.BILLNO,
        PK_TSORDER: ele.PK_TSORDER,
        MATERIALNAME: ele.MATERIALNAME,
        TRANSURPLUS: ele.SURPLUS,
        ENTRUSTNUM: JSON.parse(JSON.stringify(ele.SURPLUS)),
        NSUMUNIT: ele.FIXENTRUSTNUMUNIT,
      }
    })
    rightDataList.value.push(...data)
  }
}

const submitPZ = () => {
  PZRef.value.submitForm().then((valid) => {
    if (!valid) return;
    formData.value.MATINFOS = JSON.parse(JSON.stringify(rightDataList.value))
    let data = {
      BILLNO: currentDatas.value.PKBILLNO,
      ISLEFTOVER: "1",
      CARINFOS: [formData.value]
    }
    savePZ(data).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      emits("close")
    })
  });

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
    // border-bottom: 1px solid var(--el-border-color);
    margin-bottom: 10px;

    .title {
      font-weight: bold;
      font-size: 16px;
    }

    .pzinfo {
      display: flex;
      align-items: center;
      font-size: 14px;
      // color: #8b8b8b;

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