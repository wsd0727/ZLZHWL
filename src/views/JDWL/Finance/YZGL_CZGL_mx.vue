// 运费审核-应收表格
<template>
  <teleport to="#custemPageBtn">
    <el-button size="default" @click="handlePrint">打印</el-button>
    <el-button size="default" @click="handleExport">导出</el-button>
    <el-button type="primary" size="default" @click="openModal">生成凭证</el-button>
  </teleport>
  <div class="app-wrap">
    <el-scrollbar :height="scrollHeight">
      <div ref="PrintRef">
        <div class="title">时间：{{ formData.CREATEDATE }} </div>
      </div>
      <miniTable ref="tableRef" :data="formData.SUBLIST" show-footer :footer-method="footerMethod">
        <vxe-column title=" " type="seq" width="60" fixed="left" align="center"></vxe-column>
        <vxe-column field="CARRIER" title="油卡卡号" width="220" align="left" show-overflow="tooltip" />
        <vxe-column field="SETTLE" title="路线" width="220" align="left" show-overflow="tooltip" />
        <vxe-column field="SHEETNUM" title="承运商" width="150" align="right" show-overflow="tooltip" />
        <vxe-column field="WEIGHT" title="充值金额" width="150" align="right" show-overflow="tooltip" />
      </miniTable>
    </el-scrollbar>

    <vxe-modal destroy-on-close v-model="modelShow" width="80%" height="70%" id="FormModel" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> 生成凭证 </span>
      </template>
      <template #default>
        <Form ref="FormRef" :detail="detail" v-model:formData="modelForm" :formConfig="formConfig" :rules="formRules"></Form>
        <miniTable ref="modelTableRef" :data="modelForm.SUBLIST" show-footer :footer-method="modelTableFooter">
          <vxe-column title=" " type="seq" width="60" fixed="left" align="center"></vxe-column>
          <vxe-column field="SUBJECTNO" title="科目编码" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="DEBITAMOUNT" title="借方金额" width="150" align="right" show-overflow="tooltip" />
          <vxe-column field="CREDITAMOUNT" title="贷方金额" width="150" align="right" show-overflow="tooltip" />
          <vxe-column field="CARRIER" title="承运商" width="220" align="left" show-overflow="tooltip" />
        </miniTable>
      </template>
      <template #footer>
        <el-button size="default" @click="modalClose">取消</el-button>
        <el-button type="primary" size="default" @click="modalSubmit">确认并生成凭证</el-button>
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
  currentData: String,
  config: Object,
})

const { proxy } = getCurrentInstance();
const scrollHeight = ref(window.innerHeight - 150)
const tableRef = ref(null)
const PrintRef = ref(null)
const modelTableRef = ref(null)

const formData = ref({})
const getData = () => {
  let url = props.config.ACTIONADDRESS
  let data = {
    PK_CLASS: props.currentData.map(el => el.BILLNO).join(","),
    MODULEID: props.config.PK_MODULE,
    PAGEID: props.config.PK_PARENT
  }
  axiosSave(url, data).then(res => {
    formData.value = res.RESULT
    nextTick(() => {
      tableRef.value.xTable.updateFooter()
    })
  })
}
getData()

const sumNum = (list, field) => {
  let count = 0
  list.forEach(item => {
    count += Number(item[field])
  })
  return Number(count.toFixed(3))
}

const footerMethod = ({ columns, data }) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return '合计'
      }
      if (['SHEETNUM', 'WEIGHT', 'RECABLE'].includes(column.field)) {
        return sumNum(data, column.field)
      }
      return null
    })
  ]
}

const modelTableFooter = ({ columns, data }) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return '合计'
      }
      if (['WEIGHT', 'DEBITAMOUNT', 'CREDITAMOUNT'].includes(column.field)) {
        return modelForm.value.TOTALDATA[column.field + "SUM"]
      }
      return null
    })
  ]
}

const handlePrint = () => {
  const topHtml = `<h2>运费审核应收表格</h2>`
  tableRef.value.xTable.print({
    sheetName: '运费审核应收表格',
    style: `h2{text-align: center;}.title {margin: 10px;}`,
    beforePrintMethod: ({ content }) => {
      return topHtml + PrintRef.value.innerHTML + content
    }
  })
}
const handleExport = () => {
  proxy.$modal.confirm("是否导出单据？").then((res) => {
    axiosSave(url, data).then(res => {
      proxy.download(url, { ...data }, "");
    })
  })
}
const modelShow = ref(false)
const modelForm = ref({})
const formConfig = reactive([
  { FIELD: "VOUCHERNO", LABEL: "凭证编号", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "ACCOUNTYEAR", LABEL: "会计年度", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "ACCOUNTMONTH", LABEL: "会计月度", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "VOUCHERTYPE", LABEL: "凭证类别", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "VOUCHERNUM", LABEL: "附单据数", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "ACCOUNTDATE", LABEL: "年度会计期间", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  // { FIELD: "REVIEWERNO", LABEL: "审批批次", COL: 6, CONTROLS: "ExTextBox", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
  { FIELD: "ABSTRACT", LABEL: "摘要", COL: 6, CONTROLS: "ExTextBox", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
])
const formRules = getFormRule(formConfig)
const openModal = () => {
  let url = "/bms/freight-examine/voucherInfo"
  let data = {
    PK_CLASS: props.currentData.map(el => el.BILLNO).join(","),
    MODULEID: props.config.PK_MODULE,
    PAGEID: props.config.PK_PARENT
  }
  axiosSave(url, data).then(res => {
    modelForm.value = res.RESULT
    modelForm.value.PK_CLASS = props.currentData.map(el => el.BILLNO).join(",")
    modelShow.value = true
    nextTick(() => {
      modelTableRef.value.xTable.updateFooter()
    })
  })
}
const modalSubmit = () => {
  let url = "/bms/freight-examine/voucher"
  axiosSave(url, modelForm.value).then(res => {
    proxy.$modal.msgSuccess("生成成功");
    modelShow.value = false
    emits("close")
  })
}
const modalClose = () => {
  modelShow.value = false
}

</script>
<style lang="scss" scoped>
.app-wrap {
  background: #fff;
}
.title {
  margin: 10px;
}
</style>