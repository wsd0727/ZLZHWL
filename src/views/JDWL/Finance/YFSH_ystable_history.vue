// 运费审核-历史凭证
<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" :disabled="!(checkData.length > 0)" @click="cancel">取消凭证</el-button>
    <el-button type="primary" size="default" :disabled="!(checkData.length > 0)" @click="delSave">驳回</el-button>
    <el-button type="primary" size="default" :disabled="!(checkData.length > 0)" @click="handleExport">导出</el-button>
  </teleport>
  <div class="app-wrap">
    <div class="query-wrap">
      <el-row class="row-bg" justify="space-between">
        <el-col :span="20">
          <Form ref="formRefTop" class="query-form" v-model:formData="queryJson" :formConfig="set24col(QueryConfig, 4)" :inline="true" @select="research" />
        </el-col>
        <el-col :span="4" class="flex-row-end">
          <el-button @click="research" type="primary" size="default">查找</el-button>
        </el-col>
      </el-row>
    </div>
    <el-scrollbar :height="scrollHeight">
      <template v-if="DataList.length">
        <div class="list-item" v-for="(item,index) in DataList" :key="item.BILLNO">
          <div ref="PrintRef" class="list-item-head">
            <div class="title" @click="setSelect(index)">
              <div class="title-item">
                <el-checkbox v-model="item._select" label="" size="large" />
              </div>
              <div class="title-item">时间：{{ item.DATEARR }} </div>
              <div class="title-item">开票公司：{{ item.COMPANY }} </div>
            </div>
            <el-row :gutter="10" class="btn">
              <el-col span="1.5" v-if="item.IS_VOUCHER == '1'"><el-button type="primary" size="default" @click="openModal(index,'detail')">查看凭证</el-button></el-col>
              <el-col span="1.5" v-else><el-button type="primary" size="default" @click="openModal(index)">生成凭证</el-button></el-col>

              <!-- <el-col span="1.5"><el-button size="default" @click="handlePrint(index)">打印</el-button></el-col> -->
              <!-- <el-col span="1.5"><el-button size="default" @click="handleExport(index)">导出</el-button></el-col> -->
            </el-row>
          </div>
          <miniTable ref="tableRef" :data="item.SUBLIST" show-footer :footer-method="footerMethod" @change="tableChange">
            <vxe-column title=" " type="seq" width="60" fixed="left" align="center"></vxe-column>
            <vxe-column field="INVOIC_COMPANY" title="开票公司" width="220" align="left" show-overflow="tooltip" />
            <vxe-column field="CARRIER_COMPANY" title="承运公司" width="220" align="left" show-overflow="tooltip" />
            <vxe-column field="SETTLE" title="结算客户" width="220" align="left" show-overflow="tooltip" />
            <vxe-column field="SHEETNUM" title="张数" width="150" align="right" show-overflow="tooltip" />
            <vxe-column field="WEIGHT" title="出库重量" width="150" align="right" show-overflow="tooltip" />
            <vxe-column field="RECABLE" title="应收运费合计" width="150" align="right" show-overflow="tooltip">
              <template #default="{row}">
                {{ toThousands(row.RECABLE) }}
              </template>
            </vxe-column>
            <vxe-column field="CREATEDATE" title="审核时间" width="220" align="center" show-overflow="tooltip" />
            <vxe-column field="REVIEWERNO" title="审核批次" width="150" align="left" show-overflow="tooltip" />
          </miniTable>
        </div>
      </template>
      <noData v-else />
    </el-scrollbar>
    <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50]" :current-page="pageInfo.currentPage" :total="TOTAL" :layouts="['Total','PrevPage','JumpNumber','NextPage','Sizes',]" @page-change="handleSubPageChange" />

    <vxe-modal destroy-on-close v-model="modelShow" width="80%" height="70%" id="FormModel" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> {{formType == 'detail'?'凭证详情':'生成凭证'}} </span>
      </template>
      <template #default>
        <Form ref="FormRef" :detail="formType == 'detail'" v-model:formData="modelForm" :formConfig="formConfig" :rules="formRules"></Form>
        <miniTable ref="modelTableRef" :data="modelForm.SUBLIST" show-footer :footer-method="modelTableFooter">
          <vxe-column title=" " type="seq" width="60" fixed="left" align="center"></vxe-column>
          <vxe-column field="CDIGEST" title="摘要" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="CCODE" title="科目编码" width="130" align="center" show-overflow="tooltip" />
          <vxe-column field="WEIGHT" title="出库重量" width="150" align="right" show-overflow="tooltip" />
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
          <vxe-column field="INVOIC_COMPANY" title="开票公司" width="220" align="left" show-overflow="tooltip" />
          <vxe-column field="SETTLE" title="结算客户" width="220" align="left" show-overflow="tooltip" />
        </miniTable>
      </template>
      <template #footer>
        <el-button size="default" @click="modalClose">关闭</el-button>
        <el-button type="primary" v-if="formType!='detail'" size="default" @click="modalSubmit">确认并生成凭证</el-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script setup>
import Form from "@/components/Form";
import miniTable from "@/components/Tables/mini"
import { getFormRule, toThousands, deepClone } from "@/utils";
import { axiosSave } from "@/api/system/page";
import * as math from 'mathjs'

const props = defineProps({
  currentData: String,
  config: Object,
})

const QueryConfig = reactive([
  { LABEL: "时间", FIELD: "DATEARR", CONTROLS: "ExDateRange", COL: 6, ISSHOW: 1, SLOT: 1, DEFAULTVAL: "", GROUPID: '1', OTHER: "" },
  { LABEL: "开票公司", FIELD: "INVOIC_COMPANY", CONTROLS: "ExTextBox", COL: 6, ISSHOW: 1, SLOT: 1, DEFAULTVAL: "", GROUPID: '1', OTHER: "" },
])

const { proxy } = getCurrentInstance();
const scrollHeight = ref(window.innerHeight - 245)
const tableRef = ref(null)
const PrintRef = ref(null)
const modelTableRef = ref(null)
const FormRef = ref(null)
const selectRow = ref(null)

const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
});
const queryJson = ref({
  PAGENUM: pageInfo.currentPage,
  PAGESIZE: pageInfo.pageSize,
  PK_CLASS: props.currentData.map(el => el.BILLNO).join(","),
  MODULEID: props.config.PK_MODULE,
  PAGEID: props.config.PK_PARENT,
  DATEARR: "",
  INVOIC_COMPANY: ""
})

const DataList = ref([])
const TOTAL = ref(0)
const getData = () => {
  let url = props.config.ACTIONADDRESS
  queryJson.value.PAGENUM = pageInfo.currentPage
  queryJson.value.PAGESIZE = pageInfo.pageSize
  axiosSave(url, queryJson.value).then(res => {
    DataList.value = res.RESULT.RECORDS.map(el => {
      el._select = false
      return el
    })
    TOTAL.value = res.RESULT.TOTAL
    // nextTick(() => {
    //   tableRef.value.xTable.updateFooter()
    // })

  })
}

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

const checkData = computed(() => DataList.value.filter(el => el._select))
const setSelect = index => {
  let data = DataList.value[index]
  data._select = !data._select
}

const sumNum = (list, field) => {
  let count = 0
  list.forEach(item => {
    count = math.add(math.bignumber(count), math.bignumber(Number(item[field])))
    // count += Number(item[field])
  })
  if (field == 'RECABLE') return toThousands(Number(count))
  return Number(count)
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
      if (['WEIGHT', 'MD', 'MC'].includes(column.field)) {
        return modelForm.value.TOTALDATA ? modelForm.value.TOTALDATA[column.field + "SUM"] : 0
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
    const url = "/bms/freight-examine/exportExcel"
    let data = {
      APPID: "",
      DATA: {
        COLLECT_NO: checkData.value.map(el => el.COLLECT_NO).join(",")
      },
      KEY: "",
      MODULEID: "",
      PAGEID: "",
      VERSION: "",
    }
    // axiosSave(url, data).then(res => {
    proxy.download(url, { ...data }, "");
    // })
  })
}
const modelShow = ref(false)
const modelForm = ref({})
const formConfig = reactive([
  { FIELD: "INO_ID", LABEL: "凭证编号", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "IYEAR", LABEL: "会计年度", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "IPERIOD", LABEL: "会计月度", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "CSIGN", LABEL: "凭证类别", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "IDOC", LABEL: "附单据数", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "IYPERIOD", LABEL: "年度会计期间", COL: 6, CONTROLS: "read", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "REVIEWERNO", LABEL: "审批批次", COL: 6, CONTROLS: "ExTextBox", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
  { FIELD: "CDIGEST", LABEL: "摘要", COL: 6, CONTROLS: "ExTextBox", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
])
const formRules = getFormRule(formConfig)
const formType = ref('add')
const openModal = (index, type) => {
  let url = type == 'detail' ? '/bms/freight-examine/voucherCat' : "/bms/freight-examine/voucherInfo"
  formType.value = type
  let row = DataList.value[index]
  let data = {
    COLLECT_NO: row.COLLECT_NO,
    MODULEID: props.config.PK_MODULE,
    PAGEID: props.config.PK_PARENT
  }
  axiosSave(url, data).then(res => {
    modelForm.value = res.RESULT
    modelForm.value.COLLECT_NO = row.COLLECT_NO
    modelShow.value = true
    nextTick(() => {
      modelTableRef.value.xTable.updateFooter()
    })
  })
}
const modalSubmit = () => {
  FormRef.value.submitForm().then(res => {
    if (!res) return
    let url = "/bms/freight-examine/voucher"
    axiosSave(url, modelForm.value).then(res => {
      proxy.$modal.msgSuccess("生成成功");
      modelShow.value = false
      research()
    })
  })
}
const delSave = index => {
  let url = "/bms/freight-examine/ysbg/reback"
  proxy.$modal.confirm("是否驳回？").then((res) => {
    let data = checkData.value.map(el => el.COLLECT_NO)
    axiosSave(url, data).then(res => {
      proxy.$modal.msgSuccess("驳回成功");
      research()
    })
  })
}
const cancel = () => {
  let url = "/bms/freight-examine/delVoucher"
  let row = modelForm.value
  proxy.$modal.confirm("是否取消凭证？").then((res) => {
    axiosSave(url, {
      COLLECT_NO: checkData.value.map(el => el.COLLECT_NO).join(",")
    }).then(res => {
      proxy.$modal.msgSuccess("取消成功");
      research()
    })
  })
}
const modalClose = () => {
  modelShow.value = false
}
const tableChange = data => {
  selectRow.value = data.row
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

getData()

</script>
<style lang="scss" scoped>
.app-wrap {
  background: #fff;
}
.query-wrap {
  padding: 10px;
  box-sizing: border-box;
}
.title {
  margin: 10px;
  display: flex;
  align-items: center;
  &-item {
    margin-right: 10px;
  }
}
.list {
  &-item {
    margin-right: 10px;
    padding: 10px;
    border-bottom: 1px solid var(--el-border-color);
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