<template>
  <div class="app-wrap">
    <div class="group">
      <el-row class="row-bg" justify="space-between">
        <el-col :span="20">
          <el-form ref="queryRef" :inline="true" :model="queryParams" class="query-form" size="default" label-width="70px">
            <el-form-item prop="NAME" label="名称">
              <el-input v-model.trim="queryParams.NAME" placeholder="请输入" clearable style="width: 150px" />
            </el-form-item>
            <el-form-item prop="MENUNAME" label="关联菜单">
              <el-input v-model.trim="queryParams.MENUNAME" placeholder="请输入" clearable style="width: 150px" />
            </el-form-item>
            <!-- <el-form-item prop="ENABLESTATE" style="width: 150px" label="状态">
                <el-select v-model.trim="queryParams.ENABLESTATE" placeholder="请选择" clearable>
                  <el-option v-for="item in ENABLESTATE" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE"></el-option>
                </el-select>
              </el-form-item> -->
          </el-form>
        </el-col>
        <el-col :span="4" class="flex-row-end">
          <el-row :gutter="5">
            <el-col :span="1.5">
              <el-button type="primary" @click="handleSearch" size="default">查找</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button @click="resetSearch" size="default">重置</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="group">
      <el-row justify="space-between" class="mb6">
        <el-col :span="24">
          <el-button plain @click="handlePlus" size="default" type="primary">新增</el-button>
          <el-button plain @click="handleEdit" :disabled="idsData.length == 0" size="default" type="primary">编辑</el-button>
          <el-button plain @click="handleDelete" :disabled="idsData.length == 0" size="default" type="danger">删除</el-button>
        </el-col>
      </el-row>
      <Vtable ref="tableRef" :tableCFG="tableConfig" :tableData="dataList" @dbClick="handleDetail" @change="tableChange">
        <template #actionBar="{ row }">
          <el-row :gutter="5" justify="center">
            <el-col :span="8">
              <el-link :icon="Edit" :underline="false" @click="handleEdit(row)" />
            </el-col>
            <el-col :span="8" v-if="row.ISDELETE == '1'">
              <el-link :icon="Delete" :underline="false" @click="handleDelete(row)" />
            </el-col>
          </el-row>
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
        <Workflow ref="WorkflowRef" bindMenu="MENU" :detail="formType == 'detail'" :data="form" />
      </template>
      <template #footer>
        <el-button v-if="formType != 'detail'" type="primary" size="default" @click="formSubmit">保存</el-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script setup name='workflow'>
import Workflow from "@/components/Workflow";
import Form from "@/components/Form";
import Vtable from "@/components/Tables";
import { getFormValue, getFormRule } from "@/utils";
import { WFList, WFAdd, WFDetail, WFDelete, TableConfig } from "#/workflow";
const { proxy } = getCurrentInstance();
const route = useRoute();
const WorkflowRef = ref(null);
const queryRef = ref(null)
const data = reactive({
  baseForm: {},
  form: {},
  formType: "",
  queryParams: {
    PAGENUM: 1,
    PAGESIZE: 10,
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
    MENUNAME: "",
    NAME: "",
    ENABLESTATE: ""
  },
  idsData: [],
});
const { queryParams, formType, form, idsData } = toRefs(data);
const total = ref(0);
const dataList = ref([]);

const tableConfig = reactive({
  tableColumns: TableConfig,
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  hasFill: true,
  hasEmpty: false,
  height: window.innerHeight - 255,
});

const getList = () => {
  tableConfig.loading = true;
  WFList(queryParams.value)
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
  } else if (data.clicktype == "checkbox") {
    idsData.value = data.data;
  }
};
const handleSearch = () => {
  queryParams.value.PAGENUM = 1
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

const handlePlus = () => {
  form.value = {};
  pageConfig.modelTitle = "新增";
  formType.value = "add";
  pageConfig.modalVisible = true;
};

const handleDetail = (row) => {
  WFDetail(row.DEPLOYMENTID).then((res) => {
    form.value = JSON.parse(res.RESULT.JSON);
    pageConfig.modelTitle = "详情";
    formType.value = "detail";
    pageConfig.modalVisible = true;
  });
};

const handleEdit = () => {
  if (idsData.value.length == 0) return;
  const id = idsData.value[0].DEPLOYMENTID;
  WFDetail(id).then((res) => {
    form.value = JSON.parse(res.RESULT.JSON);
    pageConfig.modelTitle = "编辑";
    formType.value = "edit";
    pageConfig.modalVisible = true;
  });
};

const handleDelete = () => {
  if (idsData.value.length == 0) return;
  let name = idsData.value[0].NAME;
  proxy.$modal.confirm(`是否确定删除 ${name} ？`).then((res) => {
    const id = idsData.value[0].DEPLOYMENTID;
    WFDelete(id).then((res) => {
      handleSearch();
    });
  });
};

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

getList();
</script>

<style lang="scss" scoped>
.app-wrap {
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
