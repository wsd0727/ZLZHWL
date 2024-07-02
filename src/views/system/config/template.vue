<template>
  <div class="bg-white">
    <div class="tool-wrap">
      <el-row class="row-bg" justify="space-between">
        <el-col :span="18">
          <el-form ref="queryRef" :inline="true" :model="queryParams" class="query-form" label-width="60px" size="defalut">
            <el-form-item prop="LABEL" label="名称">
              <el-input v-model.trim="queryParams.LABEL" placeholder="请输入" clearable style="width:150px" />
            </el-form-item>
            <el-form-item prop="FIELD" label="主键">
              <el-input v-model.trim="queryParams.FIELD" placeholder="请输入" clearable style="width:150px" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" class="flex-row-end">
          <el-row :gutter="5">
            <el-col :span="1.5">
              <el-button  @click="handleSearch" type="primary" size="defalut"> 查找 </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button plain @click="resetSearch" size="defalut"> 重置 </el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="group">
      <el-row justify="space-between" class="mb6">
        <el-col :span="20">
          <el-button  @click="handlePluss" size="defalut" type="primary">批量新增</el-button>
        </el-col>
        <el-col :span="4" class="flex-row-end">
          <el-icon :size="14" @click="colDrawer = true" title="列配置" style="margin-top: 10px;">
            <Setting />
          </el-icon>
        </el-col>
      </el-row>

      <el-tabs v-model="activeTab" type="border-card" size="mini">
        <el-tab-pane v-for="item in TabsList" :key="item.VALUE" :label="item.LABEL" :name="item.VALUE" />
      </el-tabs>
      <Vtable ref="tableRef" :tableCFG="tableConfig" :tableData="dataList" actionBar :actionBarWidth="80" @change="tableChange">
        <template #actionBar="{row}">
          <el-row :gutter="10">
            <el-col :span="1.5">
              <el-link :icon="Edit" @click="handleEdit(row)" />
            </el-col>
            <el-col :span="1.5">
              <el-link :icon="Delete" @click="handleDelete(row)" />
            </el-col>
          </el-row>
        </template>
      </Vtable>
      <vxe-pager size="mini" :page-size="queryParams.PAGESIZE" :page-sizes="[ 10, 20, 30, 50, 100, 1000, 2000]" :current-page="queryParams.PAGENUM" :total="total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange">
      </vxe-pager>
    </div>

    <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> {{ pageConfig.modelTitle }} </span>
      </template>
      <template #default>
        <div>
          <Etable v-if="formType == 'adds'" ref="tableFormRef" :tableCFG="tableFormConfig" v-model:tableData="form" :validRules="tableRules" :actionBarWidth="80">
            <template #actionBar="{row, rowIndex}">
              <el-row :gutter="5">
                <el-col :span="8">
                  <el-link :icon="Plus" @click="tablePlus" />
                </el-col>
                <el-col :span="8" v-if="rowIndex != 0">
                  <el-link :icon="Delete" @click="tableDelete(row)" />
                </el-col>
              </el-row>
            </template>
          </Etable>
          <Form v-else ref="formRef" v-model:formData="form" :formConfig="formConfig" :rules="formRules" :detail="formType == 'detail'" @select="formSelect" />
        </div>
      </template>
      <template #footer>
        <el-button v-if="formType != 'detail'" size="default" @click="formSubmit">保存</el-button>
      </template>
    </vxe-modal>

  </div>
</template>

<script setup name='configTemplate'>
import QueryForm from "@/components/Query"
import Vtable from "@/components/Tables"
import Etable from "@/components/Tables/edit"
import { templateList, addTemplate, templateDetail, delTemplate, QueryConfig, TableConfig_Form, TableConfig_Qty, TableConfig_Table } from "#/system/configTemplate"
import { getFormValue, getFormRule } from "@/utils";
import { Search, Edit, Delete, Plus, Refresh } from "@element-plus/icons-vue";

const { proxy } = getCurrentInstance();
const route = useRoute();

const queryRef = ref()
const tableRef = ref()
const tableFormRef = ref()
const formRef = ref()
const formType = ref()

// 列表
const queryConfig = reactive(QueryConfig)
const data = reactive({
  baseForm: {},
  activeTab: "FM",
  TabsList: [
    { LABEL: "表单", VALUE: "FM" },
    { LABEL: "表格", VALUE: "TAB" },
    { LABEL: "查询", VALUE: "QRY" },
  ],
  form: {},
  formConfig: [],
  queryParams: {
    PAGENUM: 1,
    PAGESIZE: 10,
    GROUPNO: "FM",
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
    LABEL: undefined,
    FIELD: undefined,
  },
  formRules: {},
  tableRules: {}
});

const { queryParams, baseForm, activeTab, TabsList, form, formConfig, formRules, tableRules } = toRefs(data);
const total = ref(0)
const dataList = ref([])

const tableConfig = reactive({
  tableColumns: TableConfig_Form,
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  height: window.innerHeight - 280,
});

const tableFormConfig = reactive({
  tableColumns: TableConfig_Form,
  tableButtons: ['ADD', 'EDIT', 'DELETE'],
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  height: window.innerHeight * 0.55
});

// tabs
watch(activeTab, val => {
  queryParams.value.GROUPNO = val
  setConfig(val)
  handleSearch()
})
const initConfig = () => {
  activeTab.value = 'FM'
  tableConfig.tableColumns = TableConfig_Form
  tableFormConfig.tableColumns = TableConfig_Form
  baseForm.value = JSON.parse(JSON.stringify(getFormValue(TableConfig_Form)))
  baseForm.value.GROUPNO = "FM"
  baseForm.value.BILLFROM = "0"
  tableRules.value = getFormRule(TableConfig_Form)
  formConfig.value = TableConfig_Form
  formRules.value = getFormRule(TableConfig_Form)
}
initConfig()
const setConfig = type => {
  switch (type) {
    case "FM":
      tableConfig.tableColumns = TableConfig_Form
      tableFormConfig.tableColumns = TableConfig_Form
      baseForm.value = JSON.parse(JSON.stringify(getFormValue(TableConfig_Form)))
      tableRules.value = getFormRule(TableConfig_Form)
      formConfig.value = TableConfig_Form
      formRules.value = getFormRule(TableConfig_Form)
      break;
    case "QRY":
      tableConfig.tableColumns = TableConfig_Qty
      tableFormConfig.tableColumns = TableConfig_Qty
      baseForm.value = JSON.parse(JSON.stringify(getFormValue(TableConfig_Qty)))
      tableRules.value = getFormRule(TableConfig_Qty)
      formConfig.value = TableConfig_Qty
      formRules.value = getFormRule(TableConfig_Qty)
      break;
    case "TAB":
      tableConfig.tableColumns = TableConfig_Table
      tableFormConfig.tableColumns = TableConfig_Table
      baseForm.value = JSON.parse(JSON.stringify(getFormValue(TableConfig_Table)))
      tableRules.value = getFormRule(TableConfig_Table)
      formConfig.value = TableConfig_Table
      formRules.value = getFormRule(TableConfig_Table)
      break;
  }
  baseForm.value.GROUPNO = type
  baseForm.value.BILLFROM = "0"
}

const pageConfig = reactive({
  modalVisible: false,
  modalW: "90%",
  modalH: "70%",
  modelTitle: ""
})

const getList = () => {
  tableConfig.loading = true
  templateList(queryParams.value).then(res => {
    total.value = res.RESULT.TOTAL
    dataList.value = res.RESULT.RECORDS
  }).finally(() => {
    tableConfig.loading = false
  })
}

const handleSearch = () => {
  queryParams.value.PAGENUM = 1
  getList()
}
const resetSearch = () => {
  if (!queryRef) return
  queryRef.value.resetFields()
  handleSearch()
}

const handlePageChange = ({ currentPage, pageSize }) => {
  queryParams.value.PAGENUM = currentPage;
  queryParams.value.PAGESIZE = pageSize;
  getList()
}

const tableChange = data => {
  if (data.clicktype == 'sort') {
    queryParams.value.SORTNAME = data.data.sortBy;
    queryParams.value.REVERSE = data.data.sort;
    handleSearch();
  }
}

const handlePluss = () => {
  formType.value = 'adds'
  form.value = [{ ...baseForm.value }]
  pageConfig.modelTitle = '批量新增'
  pageConfig.modalVisible = true
}

const handleEdit = row => {
  let { BILLNO } = row
  formType.value = 'edit'
  // let data = getFormValue(TableConfig)
  // formConfig.value = TableConfig
  // baseForm.value = JSON.parse(JSON.stringify(data))
  // form.value = { ...baseForm.value }
  // formRules.value = getFormRule(TableConfig)
  templateDetail({
    BILLNO
  }).then(res => {
    form.value = { ...baseForm.value, ...res }
    pageConfig.modelTitle = '编辑字段模板'
    pageConfig.modalVisible = true
  })
}

const handleDelete = row => {
  let { BILLNO } = row
  proxy.$modal.confirm(`是否确定删除 ${row.VNAME} ？`).then((res) => {
    delTemplate({ data: [BILLNO] }).then(res => {
      proxy.$modal.msgSuccess("删除成功")
      handleSearch()
    })
  });
}

// table 操作
const tablePlus = () => {
  tableFormRef.value.xEditTable.insertAt({ ...baseForm.value }, -1);
  setTableValue()
}
const tableDelete = row => {
  tableFormRef.value.xEditTable.remove(row);
  setTableValue()
}
const setTableValue = () => {
  return new Promise(resolve => {
    let { tableData } = tableFormRef.value.xEditTable.getTableData();
    form.value = tableData
    setTimeout(() => {
      resolve()
    }, 1)
  })
}

const formSubmit = () => {
  if (formType.value == 'edit') {
    addTemplate([form.value]).then(res => {
      proxy.$modal.msgSuccess("提交成功")
      handleSearch()
      pageConfig.modalVisible = false
    })
  } else {
    tableFormRef.value.xEditTable.validate(true).then(valid => {
      if (valid != undefined) return
      addTemplate(form.value).then(res => {
        proxy.$modal.msgSuccess("提交成功")
        handleSearch()
        pageConfig.modalVisible = false
      })
    })
  }
}

getList()
</script>

<style lang="scss" scoped>


.tool-wrap{
  padding: 14px 10px;
}
.app-wrap {
  height: calc(100vh - 90px);
  padding-top: 6px;
  // background-color: #fff;
  position: relative;
  .page-fixe-bottom {
    position: fixed !important;
    z-index: 10;
    bottom: 10px;
    right: 30px !important;
    height: 34px !important;
  }
}
:deep(.el-tabs__content) {
  padding: 0;
}
:deep(.el-tabs--border-card) {
  border-bottom: none;
}
:deep(.el-tabs__new-tab) {
  margin-right: 10px;
  font-size: 18px;
}

.group {
  padding: 0 10px 0 10px;
  background: #fff;
  border-radius: 4px;
}
.mb6 {
  margin-bottom: 6px;
}
.noPadding-right {
  padding-right: 0 !important;
}
</style>