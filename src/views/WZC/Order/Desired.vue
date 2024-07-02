<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" :disabled="dataListIds.length == 1" @click="submit">提交</el-button>
  </teleport>
  <div class="app-main">
    <formGroup ref="formGroupRef" class="group selectBox" title="已选需求" :fold="false">
      <template #right>
        <el-row :gutter="10" class="btnBox">
          <el-col :span="1.5">
            合单规则：
            <el-select v-model="selectRules" size="default" @change="reSearch">
              <el-option v-for="item in rulesList" :key="item.VALUE" :value="item.VALUE" :label="item.LABEL"></el-option>
            </el-select>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="default" @click="reSearch">搜索</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" size="default" :disabled="dataListIds.length == 1" @click="removeSelect">删除</el-button>
          </el-col>
        </el-row>
      </template>
      <div class="group-content">
        <miniTable ref="selectTableRef" rowId="BILLNO" :data="dataList" :checkbox-config="checkboxConfig" :height="selectTableHeight" show-overflow="tooltip" @change="AddPZ">
          <vxe-column type="checkbox" width="60" fixed="left" align="center"></vxe-column>
          <vxe-column field="BILLNO" title="需求单号" align="center" min-width="150" fixed="left"></vxe-column>
          <vxe-column field="CONTRACTCODE" title="合同单号" align="center" width="150"></vxe-column>
          <vxe-column field="SENDCOMPANY" title="发货方" align="left" min-width="200"></vxe-column>
          <vxe-column field="RECVCOMPANY" title="收货方" align="left" min-width="200"></vxe-column>
          <vxe-column field="LINENAME" title="运输路线" align="center" min-width="100"></vxe-column>
          <vxe-column field="BILLDATE" title="业务日期" align="center" min-width="100"></vxe-column>
          <vxe-column field="CERTIFICATIONSTATUS" title="审核状态" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(audit,row.CERTIFICATIONSTATUS)}}</template>
          </vxe-column>
          <vxe-column field="BILLSTATUS" title="需求状态" align="center" min-width="165">
            <template #default="{row}">{{selectDictLabel(poOrderStatus,row.BILLSTATUS)}}</template>
          </vxe-column>
          <vxe-column field="DEALSTATUS" title="处理标识" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(demandDealStatus,row.DEALSTATUS)}}</template>
          </vxe-column>
          <vxe-column field="THIRDBILLCODE" title="原单号" align="center" min-width="80"></vxe-column>
          <vxe-column field="COMPANYNAME" title="委托单位" align="left" min-width="200"></vxe-column>
          <vxe-column field="SENDADDRESS" title="发货地址" align="left" min-width="200"></vxe-column>
          <vxe-column field="RECVADDRESS" title="收货地址" align="left" min-width="200"></vxe-column>
          <vxe-column field="CHANNEL" title="来源" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(demandChannel,row.CHANNEL)}}</template>
          </vxe-column>
          <vxe-column field="BUSSTYPE" title="业务" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(businessType,row.BUSSTYPE)}}</template>
          </vxe-column>
          <vxe-column field="INFLAG" title="内部交易" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(isTrue,row.INFLAG)}}</template>
          </vxe-column>
          <vxe-column field="TRANSTYPE" title="运输方式" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(transportType,row.TRANSTYPE)}}</template>
          </vxe-column>
          <vxe-column field="TRANSMODEL" title="运输模式" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(transportModel,row.TRANSMODEL)}}</template>
          </vxe-column>
          <vxe-column field="SENDTYPE" title="配送方式" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(psType,row.SENDTYPE)}}</template>
          </vxe-column>
          <vxe-column field="CAROTHER" title="车辆要求" align="left" min-width="100"></vxe-column>
          <vxe-column field="CARMINLENGTH" title="车长" align="center" min-width="100"></vxe-column>
          <vxe-column field="CARMINWIDTH" title="车宽" align="center" min-width="100"></vxe-column>
          <vxe-column field="CARMINHEIGHT" title="车高" align="center" min-width="100"></vxe-column>
        </miniTable>
      </div>
    </formGroup>
    <formGroup ref="formGroupRef" class="group" title="合单需求" :fold="false">
      <template #title-after>
        <span class="tips">说明：根据所选合单规则，筛选出可以合单的需求</span>
      </template>
      <template #right>
        <div class="btnBox">
          <el-button type="primary" size="default" @click="addSelect">添加</el-button>
        </div>
      </template>
      <div class="group-content">
        <miniTable ref="tableRef" rowId="BILLNO" :data="orderList" :height="tableHeight" show-overflow="tooltip" @change="AddPZ">
          <vxe-column type="checkbox" width="60" fixed="left" align="center"></vxe-column>
          <vxe-column field="BILLNO" title="需求单号" align="center" min-width="150" fixed="left"></vxe-column>
          <vxe-column field="CONTRACTCODE" title="合同单号" align="center" width="150"></vxe-column>
          <vxe-column field="SENDCOMPANY" title="发货方" align="left" min-width="200"></vxe-column>
          <vxe-column field="RECVCOMPANY" title="收货方" align="left" min-width="200"></vxe-column>
          <vxe-column field="LINENAME" title="运输路线" align="center" min-width="100"></vxe-column>
          <vxe-column field="BILLDATE" title="业务日期" align="center" min-width="100"></vxe-column>
          <vxe-column field="CERTIFICATIONSTATUS" title="审核状态" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(audit,row.CERTIFICATIONSTATUS)}}</template>
          </vxe-column>
          <vxe-column field="BILLSTATUS" title="需求状态" align="center" min-width="165">
            <template #default="{row}">{{selectDictLabel(poOrderStatus,row.BILLSTATUS)}}</template>
          </vxe-column>
          <vxe-column field="DEALSTATUS" title="处理标识" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(demandDealStatus,row.DEALSTATUS)}}</template>
          </vxe-column>
          <vxe-column field="THIRDBILLCODE" title="原单号" align="center" min-width="80"></vxe-column>
          <vxe-column field="COMPANYNAME" title="委托单位" align="left" min-width="200"></vxe-column>
          <vxe-column field="SENDADDRESS" title="发货地址" align="left" min-width="200"></vxe-column>
          <vxe-column field="RECVADDRESS" title="收货地址" align="left" min-width="200"></vxe-column>
          <vxe-column field="CHANNEL" title="来源" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(demandChannel,row.CHANNEL)}}</template>
          </vxe-column>
          <vxe-column field="BUSSTYPE" title="业务" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(businessType,row.BUSSTYPE)}}</template>
          </vxe-column>
          <vxe-column field="INFLAG" title="内部交易" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(isTrue,row.INFLAG)}}</template>
          </vxe-column>
          <vxe-column field="TRANSTYPE" title="运输方式" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(transportType,row.TRANSTYPE)}}</template>
          </vxe-column>
          <vxe-column field="TRANSMODEL" title="运输模式" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(transportModel,row.TRANSMODEL)}}</template>
          </vxe-column>
          <vxe-column field="SENDTYPE" title="配送方式" align="center" min-width="100">
            <template #default="{row}">{{selectDictLabel(psType,row.SENDTYPE)}}</template>
          </vxe-column>
          <vxe-column field="CAROTHER" title="车辆要求" align="left" min-width="100"></vxe-column>
          <vxe-column field="CARMINLENGTH" title="车长" align="center" min-width="100"></vxe-column>
          <vxe-column field="CARMINWIDTH" title="车宽" align="center" min-width="100"></vxe-column>
          <vxe-column field="CARMINHEIGHT" title="车高" align="center" min-width="100"></vxe-column>
        </miniTable>
        <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50, 100]" :current-page="pageInfo.currentPage" :total="Total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange" />
      </div>
    </formGroup>
  </div>
</template>

<script setup>
import miniTable from "@/components/Tables/mini"
import { getHasRulesOrder, getRules, saveHasRulesOrder } from "@/api/WZC/Order/Desired"

const props = defineProps({
  currentData: Array
})
const emits = defineEmits(['close'])
const BILLNO = computed(() => props.currentData[0].BILLNO || "")
const windowHeight = computed(() => (window.innerHeight - 160) + 'px')
const selectTableHeight = computed(() => ((window.innerHeight / 2) - 135) + 'px')
const tableHeight = computed(() => ((window.innerHeight / 2) - 180) + 'px')

const { proxy } = getCurrentInstance();
const checkboxConfig = reactive({
  checkMethod: ({ row }) => {
    return row.BILLNO != BILLNO.value
  },
})

const { audit, poOrderStatus, demandDealStatus, demandChannel, businessType, isTrue, transportType, transportModel, psType } = proxy.useDict("audit", "poOrderStatus", "demandDealStatus", "demandChannel", "businessType", "isTrue", "transportType", "transportModel", "psType")

const selectTableRef = ref(null)
const tableRef = ref(null)

const selectRules = ref("")
const rulesList = ref([])
const getRulesData = (keywork = "") => {
  getRules({
    KEYWORD: "",
    TYPE: "104"
  }).then(res => {
    rulesList.value = res.RESULT
    if (selectRules.value == '') {
      selectRules.value = rulesList.value[0].VALUE
      getOrderData()
    }
  })
}
getRulesData()
const dataList = ref([
  ...props.currentData
])
const dataListIds = computed(() => dataList.value.map(el => el.BILLNO))
const orderList = ref([])
const Total = ref(0)
const pageInfo = reactive({
  pageSize: 10,
  currentPage: 1,
})
const reSearch = () => {
  pageInfo.currentPage = 1
  getOrderData()
}
const getOrderData = () => {
  getHasRulesOrder({
    RULEID: selectRules.value,
    DEMANDID: BILLNO.value,
    PAGENUM: pageInfo.currentPage,
    PAGESIZE: pageInfo.pageSize
  }).then(res => {
    orderList.value = res.RESULT.RECORDS
    Total.value = res.RESULT.TOTAL
    nextTick(() => {
      tableRef.value.xTable.setCheckboxRow(dataList.value, true)
    })
  })
}
const handlePageChange = ({ currentPage, pageSize }) => {
  pageInfo.pageSize = pageSize
  pageInfo.currentPage = currentPage
  getOrderData()
}

const addSelect = () => {
  let selectData = tableRef.value.xTable.getCheckboxRecords(true)
  if (!selectData.length) return
  selectData = selectData.filter(el => !dataListIds.value.includes(el.BILLNO))
  if (!selectData.length) return
  dataList.value = [...dataList.value, ...selectData]
}
const removeSelect = () => {
  selectTableRef.value.xTable.removeCheckboxRow().then(({ rows }) => {
    tableRef.value.xTable.setCheckboxRow(rows, false)
    nextTick(() => {
      let { fullData } = selectTableRef.value.xTable.getTableData()
      dataList.value = fullData
    })
  })
}

const submit = () => {
  saveHasRulesOrder({
    BILLNO: BILLNO.value,
    MODE: "MERGE",
    BILLNOS: dataListIds.value,
    RULEID: selectRules.value
  }).then(res => {
    proxy.$modal.msgSuccess("提交成功");
    emits("close")
  })
}

</script>
<style lang="scss" scoped>
.app-main {
  height: v-bind(windowHeight);
}
.btnBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.group {
  height: calc(50% - 5px);
  background: #fff;
}
.selectBox {
  margin-bottom: 10px;
}
.tips {
  font-size: 12px;
  color: red;
}
:deep(.group .form-group-title .title) {
  max-height: 30px;
}
</style>