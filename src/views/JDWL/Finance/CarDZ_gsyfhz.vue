// 车辆应付对账-公司应付汇总
<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" @click="handleSubmit">确认</el-button>
  </teleport>
  <div class="app-wrap">
    <el-scrollbar :height="scrollHeight">
      <div class="box">
        <div ref="PrintRef">
          <div class="title">时间：{{ formData.COLLECT_NO }} </div>
        </div>
        <!-- <Form ref="FormRef" :detail="detail" v-model:formData="formData" :formConfig="formConfig" :rules="formRules"></Form> -->
        <miniTable ref="modelTableRef" :data="formData.SUBLIST" show-footer :footer-method="footerMethod">
          <vxe-column title=" " type="seq" width="60" fixed="left" align="center"></vxe-column>
          <vxe-column field="INVOIC_COMPANY" title="开票公司" width="220" align="left" show-overflow="tooltip" />
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
const emits = defineEmits("close")

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
    formData.value.COLLECT_NO = new Date().toLocaleString()
    formData.value.SUBLIST = res.RESULT
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
      if (columnIndex === 0) return '合计'
      if (columnIndex === 1) return null
      return sumNum(data, column.field)
    })
  ]
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
  { FIELD: "REVIEWERNO", LABEL: "审批批次", COL: 6, CONTROLS: "ExTextBox", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
  { FIELD: "ABSTRACT", LABEL: "摘要", COL: 6, CONTROLS: "ExTextBox", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
])
const formRules = getFormRule(formConfig)

const handleSubmit = () => {
  let url = "/bms/meetAccountCar/companyGroupQr"
  let data = {
    PK_CLASS: props.currentData.map(el => el.BILLNO).join(","),
    MODULEID: props.config.PK_MODULE,
    PAGEID: props.config.PK_PARENT
  }
  axiosSave(url, data).then(res => {
    proxy.$modal.msgSuccess("确认成功");
    emits("close")
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
.box {
  padding: 10px;
}
</style>