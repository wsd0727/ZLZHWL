<template>
  <div class="app-wrap">
    <!-- 查询 -->
    <div class="query-wrap" :class="showMoreQuery ? 'show-more-query' : ''">
      <Form ref="formRefTop" class="query-form" v-model:formData="queryJson" :formConfig="showMoreQuery ? QueryConfig : set24col(QueryConfig, 4)" :inline="true" @select="heandleSearch" />
      <div class="flex-row-end">
        <el-button @click="heandleSearch" type="primary" size="default">查找</el-button>
        <el-button @click="showMoreQuery = !showMoreQuery" size="Default">{{ showMoreQuery ? "收起" : "高级" }}</el-button>
      </div>
    </div>

    <div class="bg-white position-r">
      <!-- 按钮栏 -->
      <div class="tool-wrap">
        <div class="tool-wrap-left">
          <el-button type="primary" size="Default" :disabled="currentData.length!=1&&!isNOQK" @click="handleEdit">编辑</el-button>
          <el-button type="primary" size="Default" :disabled="currentData.length==0&&!isNOQK" @click="handleQk">请款</el-button>
          <el-button type="primary" size="Default" :disabled="currentData.length==0&&!isQK" @click="QKBack">请款驳回</el-button>
          <el-button type="primary" size="Default" :disabled="currentData.length==0" @click="handleDz">对账</el-button>
          <el-button type="primary" size="Default" :disabled="currentData.length==0" @click="DZBack">对账驳回</el-button>
          <el-button type="primary" size="Default" :disabled="currentData.length==0" @click="SyncYSRW">同步运输任务</el-button>
          <el-button type="primary" size="Default" @click="exout">导出</el-button>
        </div>
        <div class="tool-wrap-right">
        </div>
      </div>
    </div>

    <div class="table">
      <miniTable ref="tableRef" :data="dataList" :height="windowHeight" :scroll-y="{enabled: true}" :column-config="{'resizable':'true'}" :row-class-name="setRowClass" @cell-click="selectRow" :mergeRowFn="mergeRowMethod" show-footer :footer-method="modelTableFooter" @change="tablechange">
        <vxe-column type="checkbox" title="" width="60" align="center" fixed="left" show-overflow="tooltip"></vxe-column>
        <vxe-column field="PK_SENDCAR" title="派车单号" width="160" fixed="left" show-overflow="tooltip"></vxe-column>
        <vxe-column field="SETTLE" title="发货客户" width="200" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.SETTLE" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="OUT_DATE" title="出库日期" width="160" align="center" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.OUT_DATE" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="DELIVERY_NO" title="交货单号" width="160" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.DELIVERY_NO" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="OUT_NO" title="出库单号" width="180" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.OUT_NO" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="CARNO_TRAN" title="承运车号" width="100" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.CARNO_TRAN" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="AREA" title="片区" width="100" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.AREA" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="PROVINCE" title="省份" width="100" align="center" show-overflow="tooltip"></vxe-column>
        <vxe-column field="RECEIVE_CUSTOMER" title="收货客户" width="200" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.RECEIVE_CUSTOMER" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="WEIGHT" title="出库数量" width="130" align="right" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.WEIGHT" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="DESTINATION" title="到达地" width="100" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.DESTINATION" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="LSZDPSN" title="配载人员" width="100" align="center" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.LSZDPSN" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="CARNO_LOAD" title="配载车号" width="110" align="center" show-overflow="tooltip"></vxe-column>
        <vxe-column field="SHIP" title="车辆管理人" width="200" show-overflow="tooltip"></vxe-column>
        <vxe-column field="INVOIC_COMPANY" title="开票公司" width="200" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.INVOIC_COMPANY" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="DRIVER" title="司机" width="100" align="center" show-overflow="tooltip" />
        <vxe-column field="DRIVERPHONE" title="电话" width="120" align="center" show-overflow="tooltip" />
        <vxe-column field="CARRIER" title="承运商" width="150" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.CARRIER" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="BALATYPE" title="结算方式" width="150" align="center" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.BALATYPE" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
          <template #default="{row}">
            {{selectDictLabel(BALATYPE,row.BALATYPE)}}
          </template>
        </vxe-column>
        <!-- <vxe-column field="DZTIME" title="承运费对账日期" width="160" align="center" show-overflow="tooltip" /> -->
        <vxe-column field="ORDERQUALITY" title="订单质量" width="100" align="center" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.ORDERQUALITY" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
          <template #default="{row}">
            {{ selectDictLabel(ORDERQUALITY,row.ORDERQUALITY) }}
          </template>
        </vxe-column>
        <vxe-column field="FAC_PRICE" title="应收单价" width="130" align="right" show-overflow="tooltip">
          <template #default="{row}">
            {{toThousands(row.FAC_PRICE)}}
          </template>
        </vxe-column>
        <vxe-column field="RECEIVABLE" title="应收运费" width="130" align="right" show-overflow="tooltip">
          <template #default="{row}">
            {{toThousands(row.RECEIVABLE)}}
          </template>
        </vxe-column>
        <vxe-column field="CAR_PRICE" title="支付单价" width="130" align="right" show-overflow="tooltip">
          <template #default="{row}">
            {{toThousands(row.CAR_PRICE)}}
          </template>
        </vxe-column>
        <vxe-column field="PRICELIMIT" title="限价差" width="130" align="right" show-overflow="tooltip">
          <template #default="{row}">
            {{toThousands(row.PRICELIMIT)}}
          </template>
        </vxe-column>
        <vxe-column field="PAYABLE" title="应付承运费" width="130" align="right" show-overflow="tooltip">
          <template #default="{row}">
            {{toThousands(row.PAYABLE)}}
          </template>
        </vxe-column>
        <vxe-column field="SUBSIFDY" title="运营补贴" width="130" align="right" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.SUBSIFDY" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
          <template #default="{row}">
            {{toThousands(row.SUBSIFDY)}}
          </template>
        </vxe-column>
        <vxe-column field="PRICEABLE" title="应付承运费小计" width="200" align="right" show-overflow="tooltip">
          <template #default="{row}">
            {{toThousands(row.PRICEABLE)}}
          </template>
        </vxe-column>
        <vxe-column field="DEDUCTION" title="其他扣款" width="130" align="right" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.DEDUCTION" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
          <template #default="{row}">
            {{toThousands(row.DEDUCTION)}}
          </template>
        </vxe-column>
        <vxe-column field="ISBX" title="保险状态" width="100" align="center" show-overflow="tooltip">
          <template #default="{row}">
            {{ selectDictLabel(istrue,row.ISBX) }}
          </template>
        </vxe-column>
        <vxe-column field="INSURECOST" title="保险费用" width="130" align="right" show-overflow="tooltip">
          <template #default="{row}">
            {{toThousands(row.INSURECOST)}}
          </template>
        </vxe-column>
        <vxe-column field="REALITYINSURECOST" title="实际保险费用" width="130" align="right" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.REALITYINSURECOST" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
          <template #default="{row}">
            {{toThousands(row.REALITYINSURECOST)}}
          </template>
        </vxe-column>
        <vxe-column field="REALITYFRIGHT" title="实际应付总额" width="150" align="right" show-overflow="tooltip">
          <template #default="{row}">
            {{toThousands(row.REALITYFRIGHT)}}
          </template>
        </vxe-column>
        <vxe-column field="OILPAYTIME" title="油费支付日期" width="160" align="center" show-overflow="tooltip" />
        <vxe-column field="OILTYPE" title="油卡类型" width="100" align="center" show-overflow="tooltip">
          <template #default="{row}">
            {{selectDictLabel(OILTYPE,row.OILTYPE)}}
          </template>
        </vxe-column>
        <vxe-column field="OILCARD" title="油卡卡号" width="150" align="left" show-overflow="tooltip" />
        <vxe-column field="OILFEE" title="油费" width="100" align="right">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.OILFEE" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
          <template #default="{row}">
            {{toThousands(row.OILFEE)}}
          </template>
        </vxe-column>
        <vxe-column field="PAYMENTDATE" title="到付支付日期" width="160" align="center" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.PAYMENTDATE" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="PAYMENTFEE" title="到付运费金额" width="130" align="right" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.PAYMENTFEE" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
          <template #default="{row}">
            {{toThousands(row.PAYMENTFEE)}}
          </template>
        </vxe-column>
        <vxe-column field="RECEIPTFEE" title="回单运费金额" width="130" align="right" show-overflow="tooltip">
          <template #default="{row}">
            {{toThousands(row.RECEIPTFEE)}}
          </template>
        </vxe-column>
        <vxe-column field="PAIDPAY" title="已付合计" width="130" align="right" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.PAIDPAY" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
          <template #default="{row}">
            {{toThousands(row.PAIDPAY)}}
          </template>
        </vxe-column>
        <vxe-column field="UNPAIDPAY" title="未付金额" width="150" align="right" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.UNPAIDPAY" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
          <template #default="{row}">
            {{toThousands(row.UNPAIDPAY)}}
          </template>
        </vxe-column>
        <vxe-column field="GROSSPROFIT" title="税前毛利润" width="130" align="right" show-overflow="tooltip">
          <template #default="{row}">
            {{toThousands(row.GROSSPROFIT)}}
          </template>
        </vxe-column>
        <vxe-column field="RECEIVEADDRESS" title="收货地址" width="200" show-overflow="tooltip" />
        <vxe-column field="CARRIER" title="收款人" width="150" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.CARRIER" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="BANKACCOUNT" title="收款账号" width="200" show-overflow="tooltip" />
        <vxe-column field="VMEMO" title="备注" width="150" show-overflow="tooltip" />
        <vxe-column field="ISSIGN" title="签收状态" width="100" align="center" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.ISSIGN" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
          <template #default="{row}">
            {{selectDictLabel(istrue, row.ISSIGN)}}
          </template>
        </vxe-column>
        <vxe-column field="SIGNER" title="签收人" width="120" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.SIGNER" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="SIGNER_DATE" title="签收日期" width="160" align="center" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.SIGNER_DATE" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="ISREQUESTFUNDS" title="请款状态" width="80" align="center" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.ISREQUESTFUNDS" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
          <template #default="{row}">
            {{selectDictLabel(istrue, row.ISREQUESTFUNDS)}}
          </template>
        </vxe-column>
        <vxe-column field="REQUESTFUNDS" title="请款人" width="120" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.REQUESTFUNDS" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="REQUESTFUNDSTIME" title="请款时间" width="160" show-overflow="tooltip">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.REQUESTFUNDSTIME" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
        <vxe-column field="REVIEWER" title="审核人" width="100" align="center" show-overflow="tooltip" />
        <vxe-column field="REVIEWER_DATE" title="审核时间" width="160" align="center" show-overflow="tooltip" />
        <vxe-column field="IS_RELATE" title="回单状态" width="100" align="center" show-overflow="tooltip">
          <template #default="{row}">
            {{selectDictLabel(IS_RELATE,row.IS_RELATE)}}
          </template>
        </vxe-column>
        <!-- <vxe-column field="RECEIPTPSN" title="回单确认人" width="100" show-overflow="tooltip"></vxe-column> -->
        <vxe-column field="LSZDTIME" title="配载日期" width="160" show-overflow="tooltip"></vxe-column>
        <vxe-column field="COMACHINE" title="机台" width="130" show-overflow="tooltip" />
        <vxe-column field="ISDH" title="到达状态" width="100" align="center" show-overflow="tooltip">
          <template #default="{row}">
            {{selectDictLabel(istrue,row.ISDH)}}
          </template>
        </vxe-column>
        <vxe-column field="ISDZ" title="对账状态" width="80" align="center">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.ISDZ" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
          <template #default="{row}">
            {{selectDictLabel(istrue,row.ISDZ)}}
          </template>
        </vxe-column>
        <vxe-column field="DZTIME" title="对账日期" width="160" align="center">
          <template #header="{ column }">
            <Header :column="column" :config="filterConfig.DZTIME" v-model:queryJson="queryJson" @filterEvent="heandleSearch" @handleSortEvent="headerCellClickEvent" />
          </template>
        </vxe-column>
      </miniTable>
      <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="pages" :current-page="pageInfo.currentPage" :total="total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange" />
    </div>

    <vxe-modal className="FormModel" destroy-on-close v-model="modalConfig.open" :width="modalConfig.width" :height="modalConfig.height" id="FormModel" resize storage transfer show-zoom show-footer @zoom="resizeModal">
      <template #title>
        <span> {{ modalConfig.title }} </span>
      </template>
      <template #default>
        <MasterForm ref="MasterFormRef" v-model:formData="form" :formConfig="editConfig" :tableConfig="[]" :formRules="rules" :tableRules="{}" :detail="false" />
      </template>
      <template #footer>
        <el-button v-if="form.ISREQUESTFUNDS == 1" size="default" @click="modalConfig.open = false">关闭</el-button>
        <el-button v-else type="primary" size="default" @click="modalSubmit">保存</el-button>
      </template>
    </vxe-modal>

  </div>
</template>

<script setup>
import miniTable from "@/components/Tables/mini"
import Header from "./header";
import { getHSList, SyncYSRWAPI } from "@/api/JDWL/Finance/HeSuanReport"
import { getFormValue, toThousands, deepClone, getShowCFG, getFormRule, getUrlParams, evilFn, uuid } from "@/utils";
import Form from "@/components/Form";
import request, { download } from "@/utils/request"
import { getPageConfig } from "@/api/system/page"

const windowHeight = computed(() => (window.innerHeight - 246) + 'px')
// const windowHeight = computed(() => (window.innerHeight - 218) + 'px')

const router = useRouter();
const routerParams = router.currentRoute.value.meta;
const { proxy } = getCurrentInstance();
const tableRef = ref(null)
const { ORDERQUALITY, BALATYPE, istrue, OILTYPE, IS_RELATE } = proxy.useDict("ORDERQUALITY", "BALATYPE", "istrue", "OILTYPE", "IS_RELATE")

const pages = [100, 200, 300, 500, 1000, 2000, 3000, 5000]
const pageInfo = reactive({
  currentPage: 1,
  pageSize: 100,
  totalResult: 0,
  sortName: "",
  sortOrder: "desc",
});
const QueryConfig = ref([])
const showMoreQuery = ref(false)
const filterConfig = ref([])

const getConfig = () => {
  getPageConfig({
    MODULEID: routerParams.BILLNO,
    PAGEID: "PG231229597273",
  }).then(res => {
    let { COLUMNS, QUERY } = res.RESULT
    // editConfig.value = COLUMNS
    // rules.value = getFormRule(editConfig.value)
    QueryConfig.value = QUERY
    let newObj = {}
    QUERY.forEach(el => {
      newObj[el.FIELD] = el
    })
    filterConfig.value = newObj
    Init()
  })
}
getConfig()

const queryJson = ref({
  MODULEID: routerParams.BILLNO,
  PAGEID: "PG231229597273",
  PAGENUM: pageInfo.currentPage,
  PAGESIZE: pageInfo.pageSize,
  REVERSE: "desc",
  SORTNAME: "LSZDTIME",
})

const dataList = ref([])
const total = ref(0)
const totalData = ref({})
const getData = () => {
  getHSList(queryJson.value).then(res => {
    dataList.value = res.RESULT.RECORDS
    total.value = res.RESULT.TOTAL
    totalData.value = JSON.parse(res.RESULT.TOTALDATA)
  })
}
const heandleSearch = () => {
  pageInfo.currentPage = 1;
  queryJson.value.PAGENUM = 1
  getData();
}
const currentData = ref([])
const isNOQK = computed(() => currentData.value.length == 1 && currentData.value[0].ISREQUESTFUNDS == '1')
const isQK = computed(() => currentData.value.length == 1 && currentData.value[0].ISREQUESTFUNDS == '0')
const tablechange = res => {
  console.log("🚀 ~ tablechange ~ res:", res)
  let { selectRow } = res
  currentData.value = selectRow
}

const currentRow = ref({})
const setRowClass = ({ row }) => {
  if (row.PK_SENDCAR === currentRow.value.PK_SENDCAR) {
    return 'current-pat';
  }
}
const selectRow = ({ row }) => {
  currentRow.value = dataList.value.find(item => item.PK_SENDCAR === row.PK_SENDCAR);
}

// 行合并
const mergeRow = ['PK_SENDCAR', 'LSZDTIME', 'OUT_NO', 'DELIVERY_NO', 'GROSSPROFIT', 'REALITYFRIGHT', 'INSURECOST', 'PAYMENTDATE', 'REALITYINSURECOST', 'DEDUCTION', 'WAYOILFEE', 'INOILFEE', 'PAYMENTFEE', 'RECEIPTFEE', 'SUBSIFDY', 'PRICEABLE', 'OILFEE', 'PAIDPAY', 'UNPAIDPAY']
const mergeRowMethod = ({ row, _rowIndex, column, visibleData }) => {
  const fields = mergeRow
  const cellValue = row[column.field]
  if (cellValue != undefined && cellValue != null && fields.includes(column.field)) {
    if (column.field == 'PK_SENDCAR') {
      const prevRow = visibleData[_rowIndex - 1]
      let nextRow = visibleData[_rowIndex + 1]
      if (prevRow && prevRow[column.field] === cellValue) {
        return { rowspan: 0, colspan: 0 }
      } else {
        let countRowspan = 1
        while (nextRow && nextRow[column.field] === cellValue) {
          nextRow = visibleData[++countRowspan + _rowIndex]
        }
        if (countRowspan > 1) return { rowspan: countRowspan, colspan: 1 }
      }
    } else {
      const prevRow = visibleData[_rowIndex - 1]
      let nextRow = visibleData[_rowIndex + 1]
      if (prevRow && prevRow[column.field] === cellValue && prevRow.PK_SENDCAR === row.PK_SENDCAR) {
        return { rowspan: 0, colspan: 0 }
      } else {
        let countRowspan = 1
        while (nextRow && nextRow[column.field] === cellValue && nextRow.PK_SENDCAR === row.PK_SENDCAR) {
          nextRow = visibleData[++countRowspan + _rowIndex]
        }
        if (countRowspan > 1) return { rowspan: countRowspan, colspan: 1 }
      }
    }
  }
}

// 合计
const modelTableFooter = computed(() => {
  return ({ columns, data }) => [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) return '合计'
      if (column.field == 'WEIGHT') return totalData.value[column.field]
      return totalData.value[column.field] ? toThousands(totalData.value[column.field]) : null
    })
  ]
})

function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  queryJson.value.PAGENUM = currentPage
  queryJson.value.PAGESIZE = pageSize
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
const MasterFormRef = ref(null)
const form = ref({})
const editConfig = ref([])
const rules = ref([])
const modalConfig = reactive({
  open: false,
  title: "编辑",
  MENUID: "",
  PAGEID: "",
  params: {},
  importantParams: {},
  width: "90%",
  height: "90%",
});

const getEditConfig = () => {
  getPageConfig({
    MODULEID: routerParams.BILLNO,
    PAGEID: "PG231229676727",
  }).then(res => {
    let { COLUMNS } = res.RESULT
    editConfig.value = COLUMNS
    rules.value = getFormRule(editConfig.value)
  })
}
const handleEdit = () => {
  let ids = currentData.value.map(el => el.BILLNO)[0]
  request({
    url: "/bms/receiptShip/getDetail",
    method: "post",
    data: {
      BILLNO: ids,
      MODULEID: routerParams.BILLNO,
      PAGEID: "PG231229676727",
    }
  }).then(res => {
    form.value = res.RESULT
    modalConfig.open = true
  })
}
const modalSubmit = () => {
  MasterFormRef.value.submitForm().then(valid => {
    request({
      url: "/bms/receiptShip/update",
      method: "post",
      data: form.value
    }).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      modalConfig.open = false
      setTimeout(() => {
        getData()
      }, 500)
    })
  })
}

const handleQk = () => {
  proxy.$modal.confirm("您确定要将选中单据请款？").then((res) => {
    let ids = currentData.value.map(el => el.BILLNO)
    request({
      url: "/bms/receiptShip/qk",
      method: "post",
      data: ids
    }).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      setTimeout(() => {
        getData()
      }, 500)
    })
  });
}

const QKBack = () => {
  proxy.$modal.confirm("您确定要将选中单据清款驳回？").then((res) => {
    let ids = currentData.value.map(el => el.BILLNO)
    request({
      url: "/bms/receiptShip/qkbh",
      method: "post",
      data: ids
    }).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      setTimeout(() => {
        getData()
      }, 500)
    })
  });
}

const handleDz = () => {
  proxy.$modal.confirm("您确定要将选中单据对账？").then((res) => {
    let ids = currentData.value.map(el => el.BILLNO)
    request({
      url: "/bms/receiptShip/dz",
      method: "post",
      data: ids
    }).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      setTimeout(() => {
        getData()
      }, 500)
    })
  });
}

const DZBack = () => {
  proxy.$modal.confirm("您确定要将选中单据对账驳回？").then((res) => {
    let ids = currentData.value.map(el => el.BILLNO)
    request({
      url: "/bms/receiptShip/dzbh",
      method: "post",
      data: ids
    }).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      setTimeout(() => {
        getData()
      }, 500)
    })
  });
}

const exout = () => {

  // tableRef.value.xTable.exportData({
  //   type:"csv",
  //   isMerge:true,
  // })

  let data = {
    APPID: "",
    DATA: { ...queryJson.value, PK_CLASS: currentData.value.map(el => el.BILLNO).join(",") },
    KEY: "",
    MODULEID: queryJson.value.MODULEID,
    PAGEID: queryJson.value.PAGEID,
    PARENTPAGE: "",
    VERSION: ""
  }
  download("/bms/receiptShip/exportExcel", data)
}

const Init = () => {
  const initform = getFormValue(QueryConfig.value)
  Object.assign(queryJson.value, initform)
  getData()
}


const SyncYSRW = () => {
  let data = {
    data: currentData.value.map(el => el.BILLNO)
  }
  SyncYSRWAPI(data).then(res => {
    proxy.$modal.msgSuccess("提交成功");
    setTimeout(() => {
      getData()
    }, 500)
  })
}

const headerCellClickEvent = data => {
  console.log(data);
}

getEditConfig()
</script>
<style lang="scss" scoped>
.app-wrap {
  padding: 10px 10px 0 10px;
  position: relative;
  background: #fff;
}
.query-wrap {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .query-form {
    width: 100%;
  }
}

.tool-wrap {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  align-items: center;
}
:deep(.el-form--inline .el-form-item) {
  margin-right: 10px !important;
}
:deep(.show-more-query .el-form--inline .el-form-item) {
  margin-bottom: 10px !important;
}
:deep(.vxe-table) {
  .current-pat {
    background-color: #e9f6fe;
  }
  .current-first {
    // 此处不使用important是为了避免背景与选中效果冲突
    background-color: #f00;
    & > .vxe-body--column:first-child {
      background-color: #f00 !important;
    }
  }
}
</style>