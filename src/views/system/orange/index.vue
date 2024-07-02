<template>
  <div class="app-wrap">
    <div class="tool-wrap">
      <el-row class="row-bg" justify="space-between">
        <el-col :span="6">
          <el-button type="primary" plain @click="getPageCFG(1)">
            新增
          </el-button>
          <el-button type="primary" plain @click="getPageCFG(2)">
            编辑
          </el-button>
          <el-button type="danger" plain @click="handRemove"> 删除 </el-button>
        </el-col>
        <el-col :span="18" class="flex-row-end">
          <div class="header-right">
            <el-input v-model="Query.keyword" placeholder="请输入名称" clearable />
            <el-select v-model="Query.value" clearable placeholder="Select" size="small">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <el-button type="primary" :icon="Search" @click="QuerySearch">
          </el-button>
          <el-button type="danger" :icon="Search" @click="getPageCFG()"></el-button>
        </el-col>
      </el-row>
    </div>
    <div class="header-content">
      <vxe-table border stripe resizable size="mini" show-overflow ref="xTable" highlight-hover-row header-row-class-name="bg-blue" width="100%" class="mytable-scrollbar mytable-footer" :column-config="{ isCurrent: true, isHover: true }" :row-config="{ isCurrent: true, isHover: true }" :data="tableData" :tree-config="{
          transform: true,
          rowField: 'BILLNO',
          parentField: 'PARENTID',
          accordion: true,
        }" :checkbox-config="{
          checkStrictly: true,
          checkField: 'checked',
          trigger: 'row',
          highlight: true,
          range: true,
        }" @checkbox-change="checkboxChange" @checkbox-all="checkboxChange">
        <vxe-column type="checkbox" align="center" width="100"></vxe-column>
        <vxe-column title="ID" width="400" tree-node field="BILLNO"></vxe-column>

        <vxe-column field="VNAME" title="公司名称"></vxe-column>
        <vxe-column field="MANAGER" title="负责人"></vxe-column>
        <vxe-column field="OUTERPHONE" title="联系方式"></vxe-column>
        <vxe-column field="SHORTNAME" title="简称"></vxe-column>
      </vxe-table>
    </div>
    <div>
      <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" show-footer show-zoom resize remember>
        <template #title>
          <span style="color: red"> {{ pageConfig.modelTitle }} </span>
        </template>
        <template #default>
          <Form ref="ruleFormRef" v-model:formData="configForm.formValue" :formConfig="configForm.formColumns" :rules="configForm.formRules" />
        </template>
        <template #footer>
          <el-button type="primary" size="default" @click="submitForm">
            保存
          </el-button>
        </template>
      </vxe-modal>
    </div>
  </div>
</template>
<script setup>
import {
  orangeList,
  orangeListAdd,
  orangeFormDetail,
  orangeFormUpdate,
  orangeFormDelete,
  FormConfig,
} from "@/api/system/orange";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { reactive } from "@vue/reactivity";
import Form from "@/components/Form";
const { proxy } = getCurrentInstance();
const keyword = ref("");
const keyword1 = ref("");
const value = ref("");
const xTable = ref();
const EditId = ref({});
const DeleteId = ref({});
const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];

const configForm = reactive({
  formBase: {},
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
});
import { getFormValue, getFormRule } from "@/utils/index";
const ruleFormRef = ref();
const tableData = ref([]);
const router = useRouter();
const FormValue = ref([]);
const FormCode = ref("");
const addForm = reactive({
  value8: false,
});
const Query = reactive({
  keyword: "",
  value: "",
});
const form = reactive({
  fullName: "",
  shortName: "",
  parentId: "",
  isPurOrg: "",
  isSaleOrg: "",
  isStorOrg: "",
  manager: "",
  outerPhone: "",
  enableState: "",
  vmemo: "",
});
const rules = {
  fullName: [{ required: true, trigger: "blur", message: "请输入公司名称" }],
};
// isPurOrg: [{ required: true, trigger: "blur", message: "请选择采购标识" }],

// isSaleOrg: [{ required: true, trigger: "change", message: "请选择销售标识" }],
//   isStorOrg: [{ required: true, trigger: "change", message: "请选择库存组织" }],
// const { form, rules } = toRefs(data);
function addItem() {
  //   this.selectSearch();
  if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
  let copyForm = JSON.parse(JSON.stringify(initFormValue));
  this.form = copyForm;
  this.addForm.value8 = true;
  this.actionType = "add";
  this.getDepart();
}
const pageConfig = reactive({
  modalVisible: false,
  modalW: "50%",
  modalH: "60%",
  modelTitle: "",
});
const getPageCFG = (type) => {
  let formData = getFormValue(FormConfig);
  configForm.formColumns = FormConfig;
  configForm.formBase = formData;
  configForm.formValue = JSON.parse(JSON.stringify(formData));
  configForm.formRules = getFormRule(FormConfig);
  if (type == 2) {
    // addForm.value8 = true;
    DetailData();
    pageConfig.modalVisible = true;
    FormCode.value = "2";
  } else {
    // addForm.value8 = true;
    pageConfig.modalVisible = true;
    FormCode.value = "1";
  }
};

const departmentOptions = ref([]);
//列表数据
const ListData = () => {
  let data = {
    MODULEID: "0",
    KEYWORD: Query.keyword,
  };
  orangeList(data).then((res) => {
    tableData.value = res;
    xTable.value.reloadData(tableData.value);
  });
};
ListData();
//多选事件
function checkboxChange({ checked, row }) {
  let selectRecords = proxy.$refs.xTable.getCheckboxRecords();
  EditId.value = selectRecords[0].BILLNO;
  let arr = [];
  for (let index = 0; index < selectRecords.length; index++) {
    const element = selectRecords[index].BILLNO;
    arr.push(element);
  }
  DeleteId.value = arr;
}
//获取页面id
const routerParams = router.currentRoute.value.meta;
//详情数据
const DetailData = () => {
  let data = {
    KEYWORD: "",
    MODULEID: "0",
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.PBILLNO,
    BILLNO: EditId.value,
  };
  orangeFormDetail(data).then((res) => {
    configForm.formValue = { ...configForm.formBase, ...res };
  });
};
//删除事件
const handRemove = () => {
  ElMessageBox.confirm(`您确定要删除单据`, "Warning", {
    type: "warning",
  }).then(() => {
    let DATA = [];
    DATA = DeleteId.value;
    orangeFormDelete(DATA).then((res) => {
      ElMessage({
        message: "删除成功",
        type: "success",
      });
      setTimeout(() => {
        ListData();
      }, 1000);
    });
  });
};
const FormUpdate = () => {
  let data = {
    KEYWORD: "",
    MODULEID: "0",
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.PBILLNO,
    BILLNO: EditId.value,
    ...configForm.formValue,
  };
  orangeFormUpdate(data).then((res) => {
    pageConfig.modalVisible = false;
  });
};
const submitForm = () => {
  if (FormCode.value == "1") {
    ruleFormRef.value.submitForm().then((valid) => {
      if (!valid) return;
      FormAdd();
    });
  } else if (FormCode.value == "2") {
    ruleFormRef.value.submitForm().then((valid) => {
      if (!valid) return;
      FormUpdate();
    });
  }
};
const QuerySearch = () => {
  ListData();
};
const FormAdd = () => {
  let data = {
    KEYWORD: "",
    MODULEID: "3",
    ...configForm.formValue,
  };
  orangeListAdd(data).then((res) => {
    pageConfig.modalVisible = false;
    ListData();
  });
};
</script>

<style lang="scss" scoped>
.app-wrap {
  height: calc(100vh - 680px);
  padding-top: 6px;
  background-color: #fff;
  position: relative;
  .tool-wrap {
    padding: 0 6px 6px;
  }
  .page-fixe-bottom {
    position: fixed !important;
    z-index: 10;
    bottom: 10px;
    right: 30px !important;
    height: 34px !important;
  }
  .header-right {
    float: right;
    width: 450px;
    div {
      width: 220px;
    }
    :v-deep(.el-input) {
      width: 220px;
    }
  }
  .header-content {
    position: relative;
    top: 15px;
  }
}
.form-label[data-v-528672b9] {
  margin-bottom: 6px;
}
.ant-col-8 {
  margin-bottom: 6px;
}
.ant-select-selection-selected-value {
  font-size: 12px !important;
}
.tree-node-icon {
  width: 24px;
  text-align: center;
}
.orange-form {
  padding: 5px 55px 0px 55px;
}
.ant-form-item {
  margin-bottom: 0px;
}
.ant-form-explain {
  top: 35px;
}
.vxe-pager {
  position: fixed;
  right: 15px;
  bottom: 10px;
}
.form-label {
  text-align: right;
  padding-right: 10px;
  margin-top: -15px;
  .text-red {
    color: red;
  }
}
.mytable-scrollbar ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
/*滚动条的轨道*/
.mytable-scrollbar ::-webkit-scrollbar-track {
  background-color: #ffffff;
}
/*滚动条里面的小方块，能向上向下移动*/
.mytable-scrollbar ::-webkit-scrollbar-thumb {
  background-color: #bfbfbf;
  border-radius: 5px;
  border: 1px solid #f1f1f1;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.mytable-scrollbar ::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}
.mytable-scrollbar ::-webkit-scrollbar-thumb:active {
  background-color: #787878;
}
/*边角，即两个滚动条的交汇处*/
.mytable-scrollbar ::-webkit-scrollbar-corner {
  background-color: #ffffff;
}
</style>
<style scoped>
:deep(.el-input) {
  min-width: 180px !important;
  width: 100%;
  padding: 2px;
}
:deep(.el-select .el-select--small) {
  margin: 0px !important;
  padding: 0px !important;
}
:deep(.vxe-table--render-default .vxe-body--column) {
  line-height: 12px;
  padding: 10px;
  font-size: 14px;
}
:deep(.vxe-table--render-default .vxe-cell--checkbox .vxe-checkbox--icon) {
  font-size: 1rem;
}
:deep(.el-col-4) {
  flex: 0 0 5% !important;
  margin-top: 5px;
}
</style>
