// 机油
<template>
  <teleport to="#custemPageBtn">
    <el-button size="default" @click="handlePrint">打印</el-button>
    <!-- <el-button size="default" @click="handleExport">导出</el-button> -->
    <el-button type="primary" size="default" @click="modalSubmit">确认并生成凭证</el-button>
  </teleport>
  <div class="app-wrap">
    <el-scrollbar :height="scrollHeight">
      <div ref="PrintRef" class="list">
        <Form ref="FormRef" :detail="detail" v-model:formData="modelForm" :formConfig="formConfig" :rules="formRules"></Form>
        <miniTable ref="modelTableRef" :data="modelForm.SUBLIST" show-footer :footer-method="modelTableFooter">
          <vxe-column title=" " type="seq" width="60" fixed="left" align="center"></vxe-column>
          <vxe-column field="CDIGEST" title="摘要" width="200" align="center" show-overflow="tooltip" />
          <vxe-column field="CCODE" title="科目编码" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="MD" title="借方金额" width="150" align="right" show-overflow="tooltip">
            <template #default="{row}">
              {{ toThousands(row.MD) }}
            </template>
          </vxe-column>
          <vxe-column field="MC" title="贷方金额" width="150" align="right" show-overflow="tooltip">
            <template #default="{row}">
              {{ toThousands(row.MC) }}
            </template>
          </vxe-column>
          <vxe-column field="CARRIER" title="承运商" width="130" align="center" show-overflow="tooltip" />
        </miniTable>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import Form from "@/components/Form";
import miniTable from "@/components/Tables/mini"
import { getFormRule, toThousands } from "@/utils";
import { axiosSave } from "@/api/system/page";
const props = defineProps({
  currentData: String,
  config: Object,
})
const emits = defineEmits("close")

const { proxy } = getCurrentInstance();
const scrollHeight = ref(window.innerHeight - 150)
const tableRef = ref(null)
const PrintRef = ref(null)
const FormRef = ref(null)
const modelTableRef = ref(null)

const modelForm = ref({})
const getData = () => {
  let url = props.config.ACTIONADDRESS
  let data = {
    PK_CLASS: props.currentData.map(el => el.BILLNO).join(","),
    MODULEID: props.config.PK_MODULE,
    PAGEID: props.config.PK_PARENT
  }
  axiosSave(url, data).then(res => {
    modelForm.value = res.RESULT
    nextTick(() => {
      modelTableRef.value.xTable.updateFooter()
    })
  })
}

const modelTableFooter = ({ columns, data }) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return '合计'
      }
      if (['MC', 'MD'].includes(column.field)) {
        return modelForm.value.TOTALDATA ? toThousands(modelForm.value.TOTALDATA[column.field + "SUM"]) : 0
      }
      return null
    })
  ]
}

const handlePrint = () => {
  const topHtml = `<h2>机油充值凭证</h2>`
  tableRef.value.xTable.print({
    sheetName: '机油充值凭证',
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
const formConfig = reactive([
  { FIELD: "INO_ID", LABEL: "凭证编号", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "IYEAR", LABEL: "会计年度", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "IPERIOD", LABEL: "会计月度", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "CSIGN", LABEL: "凭证类别", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "IDOC", LABEL: "附单据数", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "IYPERIOD", LABEL: "年度会计期间", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  // { FIELD: "REVIEWERNO", LABEL: "审批批次", COL: 6, CONTROLS: "ExTextBox", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
  { FIELD: "CDIGEST", LABEL: "摘要", COL: 6, CONTROLS: "ExTextBox", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "MONTH_DATE", LABEL: "跨月时间", COL: 6, CONTROLS: "ExDateTime", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },

])
const formRules = getFormRule(formConfig)
const modalSubmit = () => {
  FormRef.value.submitForm().then(res => {
    if (!res) return
    let url = "/bms/oilCardOut/scVoucher"
    modelForm.value.PK_CLASS = props.currentData.map(el => el.BILLNO).join(",")
    axiosSave(url, modelForm.value).then(res => {
      proxy.$modal.msgSuccess("生成成功");
      modelShow.value = false
      emits("close")
    })
  })
}

getData()
</script>
<style lang="scss" scoped>
.app-wrap {
  background: #fff;
}
.title {
  margin: 10px;
}
.list {
  padding: 10px;
  margin-right: 10px;
}
</style>