// 车辆应付对账-公司应付汇总历史
<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" :disabled="!selectRow" @click="openModal(index)">查看凭证</el-button>
  </teleport>
  <div class="app-wrap">
    <el-scrollbar :height="scrollHeight">
      <div class="list-item" v-for="(item,index) in DataList" :key="item.BILLNO">
        <div ref="PrintRef" class="list-item-head">
          <div class="title">时间：{{ item.COLLECT_NO }} </div>
          <el-row :gutter="10" class="btn">
            <el-col span="1.5"><el-button size="default" @click="handlePrint(index)">打印</el-button></el-col>
            <el-col span="1.5"><el-button size="default" @click="handleExport(index)">导出</el-button></el-col>
          </el-row>
        </div>
        <miniTable ref="tableRef" :data="item.SUBLIST" show-footer @change="tableChange">
          <vxe-column title=" " type="seq" width="60" fixed="left" align="center"></vxe-column>
          <vxe-column field="INVOIC_COMPANY" title="开票公司" fixed="left" width="220" align="left" show-overflow="tooltip" />
          <vxe-column field="SUB_RECIVE" title="应付张数" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="SUB_PAY" title="应收张数" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="SUB_ADJUST" title="张数差异" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="WEIGHT_PAY" title="应付出库重量" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="WEIGHT_RECIVE" title="应收出库重量" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="WEIGHT_ADJUST" title="重量差异" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="PAYABLE" title="应付承运费" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="TWO_PLACE_SUBSIDY" title="两家卸货补贴" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="TRIP_SUBSIDY" title="趟数补贴" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="DIFF_ADJUST" title="差异调整" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="PAYABLE_TOTAL" title="应付承运费小记" width="130" align="center" show-overflow="tooltip" />
        </miniTable>
      </div>
    </el-scrollbar>
    <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50]" :current-page="pageInfo.currentPage" :total="TOTAL" :layouts="['Total','PrevPage','JumpNumber','NextPage','Sizes',]" @page-change="handleSubPageChange" />

    <vxe-modal destroy-on-close v-model="modelShow" width="80%" height="70%" id="FormModel" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> 凭证详情 </span>
      </template>
      <template #default>
        <Form ref="FormRef" detail v-model:formData="modelForm" :formConfig="formConfig" :rules="formRules"></Form>
        <miniTable ref="modelTableRef" :data="modelForm.SUBLIST" show-footer :footer-method="modelTableFooter">
          <vxe-column title=" " type="seq" width="60" fixed="left" align="center"></vxe-column>
          <vxe-column field="SUBJECTNO" title="科目编码" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="WEIGHT" title="出库重量" width="150" align="right" show-overflow="tooltip" />
          <vxe-column field="DEBITAMOUNT" title="借方金额" width="150" align="right" show-overflow="tooltip" />
          <vxe-column field="CREDITAMOUNT" title="贷方金额" width="150" align="right" show-overflow="tooltip" />
          <vxe-column field="CARRIER" title="开票公司" width="220" align="left" show-overflow="tooltip" />
          <vxe-column field="SETTLE" title="结算客户" width="220" align="left" show-overflow="tooltip" />
        </miniTable>
      </template>
      <template #footer>
        <el-button size="default" @click="modalClose">关闭</el-button>
        <el-button type="primary" size="default" @click="modalSubmit">取消凭证</el-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script setup>
import Form from "@/components/Form";
import miniTable from "@/components/Tables/mini"
import { getFormRule } from "@/utils";
import { axiosSave } from "@/api/system/page";
const props = defineProps({
  config: Object,
})

const QueryConfig = reactive([
  { LABEL: "时间", FIELD: "DATEARR", CONTROLS: "ExDateRange", COL: 6, ISSHOW: 1, SLOT: 1, DEFAULTVAL: "", GROUPID: '1', OTHER: "" },
  { LABEL: "开票公司", FIELD: "INVOIC_COMPANY", CONTROLS: "ExTextBox", COL: 6, ISSHOW: 1, SLOT: 1, DEFAULTVAL: "", GROUPID: '1', OTHER: "" },
])

const { proxy } = getCurrentInstance();
const scrollHeight = ref(window.innerHeight - 195)

const tableRef = ref(null)
const PrintRef = ref(null)
const modelTableRef = ref(null)

const selectRow = ref(null)
const emits = defineEmits("close")

const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
});

const DataList = ref([])
const TOTAL = ref(0)
const getData = () => {
  let url = props.config.ACTIONADDRESS
  let data = {
    PAGENUM: pageInfo.currentPage,
    PAGESIZE: pageInfo.pageSize,
    MODULEID: props.config.PK_MODULE,
    PAGEID: props.config.PK_PARENT
  }
  axiosSave(url, data).then(res => {
    DataList.value = res.RESULT.RECORDS.map(el => {
      el._select = false
      return el
    })
    TOTAL.value = res.RESULT.TOTAL
  })
}
getData()

const handleSubPageChange = (res) => {
  let { currentPage, pageSize } = res
  pageInfo.currentPage = currentPage
  pageInfo.pageSize = pageSize
  getData()
}

const research = () => {
  pageInfo.currentPage = 1
  getData()
}


const footerMethod = ({ columns, data }) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) return '合计'
      if (columnIndex === 1) return null
      return DataList.value.TOTALDATA[column.field + "SUM"]
    })
  ]
}

const handlePrint = index => {
  const topHtml = `<h2>公司应付汇总历史</h2>`
  tableRef.value[index].xTable.print({
    sheetName: '公司应付汇总历史',
    style: `h2{text-align: center;}.title {margin: 10px;}.btn {display: none;`,
    beforePrintMethod: ({ content }) => {
      return topHtml + PrintRef.value[index].innerHTML + content
    }
  })
}

const handleExport = index => {
  proxy.$modal.confirm("是否导出单据？").then((res) => {
    const url = "/bms/meetAccountCar/companyGroupInfoExport"
    const rows = DataList.value[index]
    const data = {
      APPID: "",
      DATA: { COLLECT_NO: rows.COLLECT_NO },
      KEY: "",
      MODULEID: props.config.PK_MODULE,
      PAGEID: props.config.PK_PARENT,
      VERSION: "",
    }
    proxy.download(url, { ...data }, "");
  })
}

</script>
<style lang="scss" scoped>
.app-wrap {
  background: #fff;
}
.title {
  margin: 10px;
}
.list {
  &-item {
    padding: 10px;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
    &-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>