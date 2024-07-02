<template>
  <div class="app-wrap">
    <div class="group mb6">
      <el-row class="row-bg" justify="space-between">
        <el-col :span="20">
          <el-form ref="queryRef" :inline="true" :model="queryParams" class="query-form" label-width="70px">
            <el-form-item prop="BUSINESSKEY" label="单据编码">
              <el-input v-model.trim="queryParams.BUSINESSKEY" placeholder="请输入" clearable style="width: 150px" />
            </el-form-item>
            <el-form-item prop="MENUNAME" label="类型">
              <el-input v-model.trim="queryParams.MENUNAME" placeholder="请输入" clearable style="width: 150px" />
            </el-form-item>
            <!-- <el-form-item prop="PROCESSDEFINITIONNAME" label="名称">
              <el-input v-model.trim="queryParams.PROCESSDEFINITIONNAME" placeholder="请输入" clearable style="width: 150px" />
            </el-form-item> -->
            <!-- <el-form-item prop="BUSINESSSTATUS" style="width: 200px" label="状态">
              <el-select v-model.trim="queryParams.BUSINESSSTATUS" placeholder="请选择" clearable>
                <el-option v-for="item in doStatusDict" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE"></el-option>
              </el-select>
            </el-form-item> -->
          </el-form>
        </el-col>
        <el-col :span="4" class="flex-row-end">
          <el-row :gutter="5">
            <el-col :span="1.5">
              <el-button type="primary" @click="handleSearch">查找</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button @click="resetSearch">重置</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="group">
      <!-- <el-row justify="space-between" class="mb6">
        <el-col :span="24">
          <el-button plain @click="handlePlus">新增</el-button>
          <el-button plain @click="handleEdit" :disabled="idsData.length == 0">编辑</el-button>
          <el-button plain @click="handleDelete" :disabled="idsData.length == 0">删除</el-button>
        </el-col>
      </el-row> -->
      <Vtable ref="tableRef" :tableCFG="tableConfig" :tableData="dataList" @dbClick="handleDetail" @change="tableChange" actionBar :actionBarWidth="80">
        <template #actionBar="{ row }">
          <!-- <el-link :underline="false" @click="handleAudit(row)">审批</el-link> -->
          <el-button type="primary" @click="handleAudit(row)">审批</el-button>
        </template>
      </Vtable>
      <vxe-pager size="mini" :page-size="queryParams.PAGESIZE" :page-sizes="[10, 20, 30, 50, 100, 1000, 2000]" :current-page="queryParams.PAGENUM" :total="total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange">
      </vxe-pager>
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
        <!-- <el-button v-if="formConfig.formType != 'detail'" type="primary" size="default" @click="formSubmit">保存</el-button> -->
      </template>
    </vxe-modal>
  </div>
</template>

<script setup name='waitDo'>
import MasterForm from "@/components/MasterForm";
import WorkflowTimeLine from "@/components/Workflow/timeLine.vue";
import Vtable from "@/components/Tables";
import useWorkflowStore from "@/store/modules/workflow";
const WorkflowStore = useWorkflowStore()
import request from "@/utils/request";
import { Search, Delete, Edit, Refresh } from "@element-plus/icons-vue";
import { waitDoList, detailDo, enterDo, cancelDo, waitDoTableConfig, doStatusDict } from "#/workflow/do";
import { getPageConfig } from "@/api/system/page";

const { proxy } = getCurrentInstance();
const route = useRoute();

const WorkflowRef = ref(null);
const queryRef = ref(null)
const auditRef = ref(null)

const data = reactive({
  form: {},
  workDoData: {},
  queryParams: {
    PAGENUM: 1,
    PAGESIZE: 10,
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
    BUSINESSKEY: "",
    MENUNAME: "",
    PROCESSDEFINITIONNAME: "",
    BUSINESSSTATUS: ""
  },
});
const { queryParams, workDoData, form } = toRefs(data);
const total = ref(0);
const dataList = ref([]);

const tableConfig = reactive({
  tableColumns: waitDoTableConfig,
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  hasFill: true,
  hasEmpty: false,
  height: window.innerHeight - 205,
});
const setQuerySize = () => {
  let mainHeight = null;
  mainHeight = window.innerHeight - 205;
  if (mainHeight > 750) {
    queryParams.value.PAGESIZE = 30;
  } else if (mainHeight > 400) {
    queryParams.value.PAGESIZE = 20;
  } else {
    queryParams.value.PAGESIZE = 10;
  }
}
const SubTableConfig = ref([]);
const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
  formType: "", // DTL ADD
  buttonList: [], // 表单中的按钮
  showDetail: false, // 是否显示表单 ， 初始时不显示，详情数据查询后显示
});

const getList = () => {
  tableConfig.loading = true;
  waitDoList(queryParams.value)
    .then((res) => {
      dataList.value = res.RESULT.RECORDS;
      total.value = res.RESULT.TOTAL;
    })
    .finally(() => {
      tableConfig.hasEmpty = dataList.value.length == 0
      tableConfig.loading = false;
    });
};
const handlePageChange = ({ currentPage, pageSize }) => {
  queryParams.value.PAGENUM = currentPage;
  queryParams.value.PAGESIZE = pageSize;
  getList();
};
const tableChange = (data) => {
  if (data.clicktype == "sort") {
    queryParams.value.SORTNAME = data.data.sortBy;
    queryParams.value.REVERSE = data.data.sort;
    handleSearch();
  } else if (data.clicktype == "openLink") {
    workDetail(data.data)
  }
};
const handleSearch = () => {
  queryParams.PAGENUM = 1;
  getList();
};
const resetSearch = () => {
  if (!queryRef) return;
  queryRef.value.resetFields();
  handleSearch();
};

// 弹窗
const pageConfig = reactive({
  modalVisible: false,
  modalW: "80vw",
  modalH: "80%",
  modelTitle: "",
});


// 当前表单其它配置 全局的label 宽
const otherCFG = ref({
  labelWidth: "60px",
  GRID: "",
});

const handleDetail = (row) => {
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
      pageConfig.modalW = "80vw"
      pageConfig.modalH = "80%"
      pageConfig.modalVisible = true
    })
  });
};

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
    let { SLOTCFG, COLUMNS, BUTTON, SUBTABLE, VDEF2 } = res.RESULT
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
      pageConfig.modalW = "80vw"
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

const formSubmit = () => {
  WorkflowRef.value.submit().then((res) => {
    if (res != false) {
      WFAdd(res.value).then((res) => {
        pageConfig.modalVisible = false;
        handleSearch();
      });
    }
  })
};

setQuerySize();
getList();
</script>

<style lang="scss" scoped>
.app-wrap {
  padding-top: 6px;
  position: relative;
  .page-fixe-bottom {
    position: fixed !important;
    z-index: 10;
    bottom: 10px;
    right: 30px !important;
    height: 34px !important;
  }
}
.group {
  padding: 8px;
  background: #fff;
  border-radius: 4px;
}
.mb6 {
  margin-bottom: 6px;
}
</style>
