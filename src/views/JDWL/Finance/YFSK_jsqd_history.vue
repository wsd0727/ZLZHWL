// 运费收款-历史凭证
<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" :disabled="!selectRow" @click="openModal(index)">查看凭证</el-button>
  </teleport>
  <div class="app-wrap">
    <el-scrollbar :height="scrollHeight">
      <div class="list-item" v-for="(item,index) in DataList" :key="item.BILLNO">
        <div ref="PrintRef" class="list-item-head">
          <div class="title">时间：{{ item.CREATEDATE }} </div>
          <el-row :gutter="10" class="btn">
            <el-col span="1.5"><el-button size="default" @click="handlePrint(index)">打印</el-button></el-col>
            <el-col span="1.5"><el-button size="default" @click="handleExport(index)">导出</el-button></el-col>
          </el-row>
        </div>
        <miniTable ref="tableRef" :data="item.SUBLIST" show-footer :footer-method="footerMethod" @change="tableChange">
          <vxe-column title=" " type="seq" width="60" fixed="left" align="center"></vxe-column>
          <vxe-column field="INVOIC_COMPANY" title="开票公司" width="220" align="left" show-overflow="tooltip" />
          <vxe-column field="SETTLE" title="结算客户" width="220" align="left" show-overflow="tooltip" />
          <vxe-column field="PROJECT_NAME" title="项目名称" width="200" align="left" show-overflow="tooltip">
            <template #default="{row}">
              {{ selectDictLabel(PAYPROJECT, row.PROJECT_NAME) }}
            </template>
          </vxe-column>
          <vxe-column field="CHEQUE" title="电汇/支票" width="110" align="left" show-overflow="tooltip" />
          <vxe-column field="BANK" title="银行承兑" width="100" align="left" show-overflow="tooltip" />
          <vxe-column field="PAID_IN_AMOUNT" title="实收金额" width="200" align="right" show-overflow="tooltip" />
          <vxe-column field="CREATEDATE" title="审核时间" width="220" align="center" show-overflow="tooltip" />
          <vxe-column field="REVIEWERNO" title="审核批次" width="150" align="left" show-overflow="tooltip" />
        </miniTable>
      </div>
    </el-scrollbar>

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
          <vxe-column field="INVOIC_COMPANY" title="开票公司" width="220" align="left" show-overflow="tooltip" />
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
  currentData: String,
  config: Object,
})

const { proxy } = getCurrentInstance();
const { PAYPROJECT } = proxy.useDict("PAYPROJECT")
const scrollHeight = ref(window.innerHeight - 150)
const tableRef = ref(null)
const PrintRef = ref(null)
const modelTableRef = ref(null)

const selectRow = ref(null)

const DataList = ref({})
const getData = () => {
  let url = props.config.ACTIONADDRESS
  let data = {
    PK_CLASS: props.currentData.map(el => el.BILLNO).join(","),
    MODULEID: props.config.PK_MODULE,
    PAGEID: props.config.PK_PARENT
  }
  axiosSave(url, data).then(res => {
    DataList.value = res.RESULT.RECORDS
    // nextTick(() => {
    //   tableRef.value.xTable.updateFooter()
    // })

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

const handlePrint = index => {
  const topHtml = `<h2>运费审核历史凭证</h2>`
  tableRef.value[index].xTable.print({
    sheetName: '运费审核应收表格',
    style: `h2{text-align: center;}.title {margin: 10px;}.btn {display: none;`,
    beforePrintMethod: ({ content }) => {
      return topHtml + PrintRef.value[index].innerHTML + content
    }
  })
}
const handleExport = index => {
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
  { FIELD: "REVIEWERNO", LABEL: "审批批次", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
  { FIELD: "ABSTRACT", LABEL: "摘要", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
])
const formRules = getFormRule(formConfig)
const openModal = () => {
  let url = "/bms/receivFreightVoucher/historyVoucherInfo"
  let row = selectRow.value
  let data = {
    CREATEDATE: row.CREATEDATE,
    REVIEWERNO: row.REVIEWERNO,
    MODULEID: props.config.PK_MODULE,
    PAGEID: props.config.PK_PARENT
  }
  axiosSave(url, data).then(res => {
    modelForm.value = res.RESULT
    modelForm.value.PK_CLASS = props.currentData.map(el => el.BILLNO).join(",")
    modelShow.value = true
    // nextTick(() => {
    //   modelTableRef.value.xTable.updateFooter()
    // })
  })
}
const modalSubmit = () => {
  let url = "/bms/receivFreightCollection/delVoucher"
  let row = modelForm.value
  proxy.$modal.confirm("是否取消凭证？").then((res) => {
    axiosSave(url, {
      CREATEDATE: row.CREATEDATE,
      REVIEWERNO: row.REVIEWERNO,
    }).then(res => {
      proxy.$modal.msgSuccess("取消成功");
      modelShow.value = false
      emits("close")
    })
  })
}
const modalClose = () => {
  modelShow.value = false
}
const tableChange = data => {
  selectRow.value = data.row
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