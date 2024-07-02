// 审批流 待办/已办/已发起 合并
<template>
  <div class="app-wrap">
    <div class="query-wrap">
      <Form class="query-form" ref="formRefTop" v-model:formData="queryJson" :formConfig="set24col(queryConfig, 4)" inline @select="formSelect" @enter="enterEvent" />
      <div class="flex-row-end">
        <el-button @click="queryEvent" type="primary" size="Default">查找</el-button>
        <el-button @click="queryDrawer=true" size="Default">高级</el-button>
      </div>
    </div>
    <div class="table-wrap">
      <el-tabs tab-position="top" class="demo-tabs" v-model="TabsAction">
        <el-tab-pane :label="item.VNAME" v-for="(item, index) in TabDict" :key="index" :name="index" />
      </el-tabs>
      <VTable ref="tableRef" :tableCFG="tableConfig" :tableData="dataList" @dbClick="handleDetail" @change="tableChange" :actionBar="TabsAction == '0'" :actionBarWidth="80">
        <template #actionBar="{ row }">
          <el-button type="primary" @click="handleAudit(row)">审批</el-button>
        </template>
      </VTable>
      <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="queryParams.PAGESIZE" :page-sizes="[5, 10, 20, 30, 50, 100]" :current-page="queryParams.PAGENUM" :total="total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange" />
    </div>

    <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> {{ pageConfig.modelTitle }} </span>
      </template>
      <template #default>
        <MasterForm v-if="formConfig.formType == 'detail'" ref="MasterFormRef" v-model:formData="formConfig.formValue" :othConfig="otherCFG" :formConfig="formConfig.formColumns" :tableConfig="SubTableConfig" detail :infoConfig="[]" :showHistory="false" />
        <WorkflowTimeLine v-else-if="formConfig.formType == 'timeline'" :data="workDoData" />
        <template v-else>
          <MasterForm ref="MasterFormRef" v-model:formData="formConfig.formValue" :formConfig="formConfig.formColumns" :othConfig="otherCFG" :tableConfig="SubTableConfig" detail :infoConfig="[]" :showHistory="false" isWorkFlow @btnClick="btnClick" />
          <h3>审批意见</h3>
          <el-form ref="auditRef" :model="form">
            <el-form-item required prop="COMMENTS" :rules="[{ required: true, message: '审批意见不可为空' }]">
              <el-input type="textarea" v-model="form.COMMENTS" :rows="3" placeholder="审批意见"></el-input>
            </el-form-item>
            <el-form-item>
              <el-row>
                <el-col :span="1.5" style="margin-right:20px">
                  <el-button type="primary" @click="submitAudit('1')">同意</el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button @click="submitAudit('0')">驳回</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </template>
      </template>
      <template #footer>
      </template>
    </vxe-modal>

  </div>
</template>

<script setup>
import Form from "@/components/Form"
import VTable from "@/components/Tables";
import MasterForm from "@/components/MasterForm";
import WorkflowTimeLine from "@/components/Workflow/timeLine.vue";
import { getFormValue, deepClone, getShowCFG, getFormRule } from "@/utils";
import { waitDoList, outDoList, applyDoList, detailDo, enterDo, cancelDo, queryConfig, TabDict } from "#/workflow/marge"
import { getPageConfig } from "@/api/system/page";
import useWorkflowStore from "@/store/modules/workflow";
const WorkflowStore = useWorkflowStore()
import request from "@/utils/request";

const { proxy } = getCurrentInstance();
const route = useRoute();

const WorkflowRef = ref(null);
const queryRef = ref(null)
const auditRef = ref(null)

const tableConfig = reactive({
  tableColumns: [],
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  hasFill: true,
  hasEmpty: false,
  height: window.innerHeight - 265,
});
const TabsAction = ref(0)
const otherCFG = ref({
  labelWidth: "60px",
  GRID: "",
});
const workDoData = ref({})
const form = ref({})
const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
  formType: "", // DTL ADD
  buttonList: [], // 表单中的按钮
  showDetail: false, // 是否显示表单 ， 初始时不显示，详情数据查询后显示
});
const pageConfig = reactive({
  modalVisible: false,
  modalW: "80vw",
  modalH: "80%",
  modelTitle: "",
});
const SubTableConfig = ref([]);

const queryJson = ref({})
const queryParams = ref({
  PAGENUM: 1,
  PAGESIZE: 20,
  MODULEID: route.meta.BILLNO,
  PAGEID: route.meta.PBILLNO,
})
const queryDrawer = ref(false)
const getDataFn = ref(null)

const formSelect = () => { }
const enterEvent = () => { }
const pageInfo = reactive({
  pageSize: 10,
  currentPage: 1,
})
const dataList = ref([])
const total = ref(0)
const queryEvent = () => {
  queryParams.value.PAGENUM = 1
  getList()
}

const getList = () => {
  tableConfig.loading = true;
  let queryData = { ...queryParams.value, ...queryJson.value }
  getDataFn.value(queryData).then((res) => {
    dataList.value = res.RESULT.RECORDS;
    total.value = res.RESULT.TOTAL;
  }).finally(() => {
    tableConfig.hasEmpty = dataList.value.length == 0
    tableConfig.loading = false;
  });
};
const handleDetail = row => {
  formConfig.formType = "detail";
  getPageConfig({
    MODULEID: row.MENUID,
    PAGEID: row.PAGEID
  }).then((res) => {
    let { SLOTCFG, COLUMNS, BUTTON, SUBTABLE, VDEF2 } = res.RESULT
    if (SLOTCFG == '') return proxy.$modal.msgError("请检查页面配置")
    formConfig.formColumns = COLUMNS;
    SubTableConfig.value = SUBTABLE;
    pageConfig.modelTitle = row.MENUNAME + "详情"
    otherCFG.value.labelWidth = VDEF2 ? VDEF2 + "px" : null;
    request({
      url: SLOTCFG,
      method: "post",
      data: {
        BILLNO: row.BUSINESSKEY,
        MODULEID: row.MENUID,
        PAGEID: row.PAGEID,
        PK_CLASS: row.BUSINESSKEY
      }
    }).then(res => {
      formConfig.formValue = res.RESULT
      pageConfig.modalW = "90vw"
      pageConfig.modalH = "80%"
      pageConfig.modalVisible = true
    })
  });
}

const selectRow = ref({})
const handleAudit = row => {
  selectRow.value = row
  formConfig.formType = "form";
  form.value = {
    TASKID: row.TASKID,
    COMMENTS: "",
  }
  getPageConfig({
    MODULEID: row.MENUID,
    PAGEID: row.PAGEID
  }).then((res) => {
    let { SLOTCFG, COLUMNS, SUBTABLE, VDEF2 } = res.RESULT
    if (!SLOTCFG) return proxy.$modal.msgError("请检查页面配置")
    formConfig.formColumns = COLUMNS;
    SubTableConfig.value = SUBTABLE;
    pageConfig.modelTitle = row.MENUNAME + "详情"
    otherCFG.value.labelWidth = VDEF2 ? VDEF2 + "px" : null;
    request({
      url: SLOTCFG,
      method: "post",
      data: {
        BILLNO: row.BUSINESSKEY,
        MODULEID: row.MENUID,
        PAGEID: row.PAGEID,
        PK_CLASS: row.BUSINESSKEY
      }
    }).then(res => {
      formConfig.formValue = res.RESULT
      pageConfig.modalW = "90vw"
      pageConfig.modalH = "80%"
      pageConfig.modelTitle = row.PROCESSDEFINITIONNAME
      pageConfig.modalVisible = true
    })
  });
}
const btnClick = () => {
  handleAudit(selectRow.vale)
}

const submitAudit = val => {
  auditRef.value.validate(valid => {
    if (!valid) return
    if (val == '1') {
      enterDo(form.value).then(res => {
        proxy.$modal.msgSuccess("审批成功")
        pageConfig.modalVisible = false
        WorkflowStore.getWaitDo()
        getList()
      })
    } else {
      cancelDo(form.value).then(res => {
        proxy.$modal.msgSuccess("审批成功")
        pageConfig.modalVisible = false
        WorkflowStore.getWaitDo()
        getList()
      })
    }
  })
}

const workDetail = (row) => {
  formConfig.formType = "timeline";
  detailDo(row.PROCESSINSTANCEID).then((res) => {
    workDoData.value = res.RESULT
    pageConfig.modalW = "40vw"
    pageConfig.modalH = '60%'
    pageConfig.modelTitle = "审批进度"
    pageConfig.modalVisible = true;
  });
};

const handlePageChange = ({ currentPage, pageSize }) => {
  queryParams.value.PAGENUM = currentPage;
  queryParams.value.PAGESIZE = pageSize;
  getList();
};

const tableChange = data => {
  if (data.clicktype == "sort") {
    queryParams.value.SORTNAME = data.data.sortBy;
    queryParams.value.REVERSE = data.data.sort;
    queryEvent();
  } else if (data.clicktype == "openLink") {
    workDetail(data.data)
  }
}

const Init = () => {
  queryJson.value = getFormValue(queryConfig)
  tableConfig.tableColumns = TabDict[TabsAction.value].Config
  getDataFn.value = TabsAction.value == '0' ? waitDoList : TabsAction.value == '1' ? outDoList : applyDoList
  queryEvent()
}
Init()
watch(TabsAction, val => {
  Init()
}, {
  immediate: true
})

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
      if (sumCol < 25) data3.push(i);
    });
    data2 = data3;
  } else {
    data2 = newdata;
  }
  return data2;
}

</script>
<style lang="scss" scoped>
.app-wrap {
  .query-wrap {
    padding: 10px;
    background-color: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .query-form {
      width: 100%;
    }
    .flex-row-end {
      padding-left: 6px;
    }
  }
  .table-wrap {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    background: #fff;
  }
}
</style>