<template>
  <div class="">
    <el-row>
      <el-col :span="4" class="bg-white" style="padding-top: 6px; padding-left: 20px">
        <div class="head-container">
          <el-input v-model="keyword" placeholder="请输入功能名称" clearable prefix-icon="Search" style="margin-bottom: 5px" />
        </div>
        <div class="head-container">
          <el-scrollbar :height="treeHeight" class="tree-border">
            <el-tree :data="menuOptions" :props="{ label: 'VNAME', children: 'CHILDREN' }" node-key="BILLNO" :filter-node-method="filterNode" ref="treeRef" highlight-current @node-click="handleNodeClick" />
          </el-scrollbar>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" class="bg-white" style="padding:6px 10px">
        <div class="bg-white padding-8">
          <div class="top-btn mb5">
            <el-button @click="menuBtnEvent(1)" type="primary"> 新增 </el-button>
            <el-button plain @click="menuBtnEvent(2)" :disabled="!selectTree" type="primary">
              编辑
            </el-button>
            <el-button plain @click="deleteEvent" :disabled="!selectTree" type="danger">
              删除
            </el-button>
            <el-button plain @click="Importclick" :disabled="!((selectTree && selectTree.CHILDREN.length == 0) || currentData.length > 0)" type="primary">
              导入
            </el-button>
            <el-button plain @click="ExportClick" :disabled="!selectTree" type="primary">
              导出
            </el-button>
          </div>
          <Vtable :tableCFG="tableCFG" :tableData="tableData" @change="tableChange" />
        </div>
      </el-col>
    </el-row>

    <vxe-modal destroy-on-close v-model="modalConfig.modalVisible" width="80%" height="70%" id="formModal" resize storage transfer show-zoom show-footer @close="closeModal">
      <template #title>
        <span> {{ modalConfig.modelTitle }} </span>
      </template>
      <template #default>
        <!-- <el-steps
          :space="200"
          :active="activeSteps"
          finish-status="success"
          simple
          style="margin-bottom: 10px"
        >
          <el-step title="模块设置"> </el-step>
          <el-step title="系统按钮" />
          <el-step title="完成" />
        </el-steps> -->

        <!-- v-show="activeSteps == 1" -->

        <Form ref="formRef" v-model:formData="modalConfig.formValue" :formConfig="modalConfig.formColumns" :rules="modalConfig.formRules">
          <template #VICON="{ data }">
            <el-input v-model="data.VICON" type="text" readonly style="width: 100%" @click="openFont(data)">
              <template #append>
                <i class="fa" :class="data.VICON"></i>
              </template>
            </el-input>
          </template>

          <template #dashboard="{ data }" v-if="modalConfig.formValue.COMPONENT == 'dashboard'">
            <el-select v-model="data.VURL" clearable style="width: 100%">
              <el-option v-for="item in dashboardList" :key="item.BILLNO" :label="item.PANEL_NAME" :value="item.BILLNO" />
            </el-select>
          </template>
        </Form>

        <Etable ref="ETableRef" v-show="activeSteps == 2" :tableCFG="ETableCFG" v-model:tableData="ETableData" @change="editTableChange">
          <template #actionBar="{ rowIndex }">
            <el-row class="row-bg" justify="center" :gutter="4">
              <el-col :span="1.5">
                <el-button type="primary" plain :icon="Plus" @click="plusConfig"></el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="danger" plain :icon="Delete" @click="delConfig(rowIndex)"></el-button>
              </el-col>
            </el-row>
          </template>
        </Etable>
      </template>

      <template #footer>
        <!-- <el-button
          size="default"
          @click="stepsEvent('up')"
          :disabled="activeSteps == 1"
        >
          上一步
        </el-button>
        <el-button
          size="default"
          @click="stepsEvent('down')"
          :disabled="activeSteps == 3"
        >
          下一步
        </el-button> -->
        <el-button type="primary" size="default" @click="stepsEvent('over')">
          完成
        </el-button>
      </template>
    </vxe-modal>

    <vxe-modal v-model="fontModel" id="myModal6" width="670" height="500" min-width="450" min-height="260" resize storage transfer show-footer show-zoom title="图标集" @close="cancelModel" @confirm="eventOK">
      <div class="icon-wrap">
        <span class="Icon-div" :class="modalConfig.formValue.VICON == item ? 'active' : ''" v-for="(item, key) in optionsFont" @click="SendIconString(item)" :key="key">
          <i :class="'fa ' + item"></i>
        </span>
      </div>
    </vxe-modal>
    <!-- 导入弹窗 -->
    <vxe-modal v-model="importModel" width="670" height="350" min-width="450" min-height="260" resize storage transfer show-footer show-zoom title="导入" @close="cancelModel">
      <template #default>
        <el-upload class="upload-demo" drag :action="uploadUrl" :file-list="fileList" multiple :headers="headers" :data="uploadData" :before-upload="handleBeforeUpload">
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">
            将要上传的文件拖拽至此区域或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">zip格式最大不超过50M</div>
          </template>
        </el-upload>
      </template>
    </vxe-modal>
  </div>
</template>

<script setup name="menu">
import { getToken } from "@/utils/auth";
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import PinyinMatch from "pinyin-match";
import Vtable from "@/components/Tables";
import Etable from "@/components/Tables/edit";

import {
  listMenu,
  getBtnPages,
  addMenu,
  updateMenu,
  delMenu,
  delBtn,
} from "@/api/system/menu";
import config from "./table";
import Form from "@/components/Form";
import { fileUploadApi } from "#/common";
import { getDashboard } from "#/dashboard";

import { getFormRule, getFormValue, deepClone } from "@/utils";
import {
  Delete,
  Edit,
  Message,
  Search,
  Star,
  Filter,
  Plus,
} from "@element-plus/icons-vue";
import { watch } from "vue";
const headers = ref({ Authorization: "Bearer " + getToken() });
const uploadUrl = ref(
  import.meta.env.VITE_APP_BASE_API + "/sys/module/importPageConfig"
); // 上传的图片服务器地址
const baseUrl = "http://116.63.138.118:8072";
const { proxy } = getCurrentInstance();
const keyword = ref("");
const ETableRef = ref(null);
const menuOptions = ref(undefined);
const currentData = ref([]); // 表格选中的数据
const selectTree = ref(null); // 左侧树选中的数据
const tableData = ref([]);
const ETableData = ref([]);
const modalVisible = ref(false);
const activeSteps = ref(1);
const formRef = ref(null);
const fontModel = ref(false);
const importModel = ref(false);
const fileList = ref([]);
const dashboardList = ref([]);
const selectRow = ref(null)

const tableCFG = reactive({
  tableColumns: config.tableConfig,
  hasTableTools: false, // 是否有操作栏
  hasSeq: false, // 是否显示序号
  toolsConfig: [],
  loading: false,
  hasFill: true, // 表格补位
  height: window.innerHeight - 154,
  // SelectType: 'checkbox',
});

const treeHeight = window.innerHeight - 160

const ETableCFG = reactive({
  tableColumns: config.tableBtnConfig,
  hasTableTools: false, // 是否有操作栏
  hasSeq: false, // 是否显示序号
  toolsConfig: [],
  tableButtons: ["ADD", "EDIT", "DELETE"],
  loading: false,
  height: 300,
});

const modalConfig = reactive({
  modelTitle: "",
  modalVisible: false,
  formValue: {},
  formColumns: [],
  formRules: undefined,
});

const optionsFont = ref([]);

const getAreaData = import("@/utils/font-awesome").then((res) => {
  optionsFont.value = res.default;
});

// const optionsFont = require("@/utils/font-awesome.js").default;

const menuRules = getFormRule(config.menuForm);
const initBtnValue = getFormValue(config.tableBtnConfig);
let menuValue = getFormValue(config.menuForm),
  initMenuValue = deepClone(getFormValue(config.menuForm));
function getMenuList() {
  let query = { keyword: "" };
  listMenu(query).then((res) => {
    menuOptions.value = res.RESULT;
    setTimeout(() => {
      if (keyword.value.length) {
        let copy = keyword.value;
        proxy.$refs["treeRef"].filter(copy);
      }
    }, 10);
  });
}

/** 根据名称筛选菜单树 */
watch(
  keyword,
  (val) => {
    if (!val) {
      proxy.$refs["treeRef"]?.filter();
    } else {
      proxy.$refs["treeRef"].filter(val);
    }
  },
  {
    immediate: true,
  }
);


watch(
  modalConfig,
  (val) => {
    if (modalConfig.formValue.COMPONENT == 'dashboard') {
      getDashboardList()
    }
  }
)

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return PinyinMatch.match(data.VNAME, keyword.value);
};

function handleNodeClick(data) {
  if (data.CHILDREN.length) {
    tableData.value = data.CHILDREN;
  } else {
    tableData.value = [data];
  }
  selectTree.value = data;
  currentData.value = [];
}

function openFont(a) {
  fontModel.value = true;
}

// 表格内部的多选事件，顶部筛选排序事件
function tableChange(data) {
  if (data.clicktype == "sort") {
    pageInfo.sortName = data.data.sortBy;
    pageInfo.sortOrder = data.data.sort;
    getTBData();
  } else {
    currentData.value = data.data;
  }
}

function getBtnData(id) {
  let query = { PK_MODULE: id };
  getBtnPages(query).then((res) => {
    res = res.RESULT.map((i) => {
      i.EnumData = initBtnValue.EnumData;
      return i;
    });
    ETableData.value = res.RESULT;
  });
}

// 可编辑表格内的按钮事件
function editTableChange() { }

function menuBtnEvent(type) {
  let menuValueNew = null;
  activeSteps.value = 1;
  if (type == 2) {
    modalConfig.modelTitle = "编辑菜单";
    if (currentData.value.length) {
      menuValueNew = {
        ...menuValue,
        ...currentData.value[currentData.value.length - 1],
      };
    } else {
      menuValueNew = Object.assign(menuValue, selectTree.value);
    }
    getBtnData(menuValueNew.BILLNO);
  } else {
    modalConfig.modelTitle = "新增菜单";
    menuValueNew = deepClone(initMenuValue);
    ETableData.value = [];
    if (selectTree.value) {
      menuValueNew.PK_PARENT = selectTree.value.PK_PARENT;
      menuValueNew.PARENTNAME = selectTree.value.PARENTNAME;
    }
  }
  modalConfig.formValue = deepClone(menuValueNew);
  modalConfig.formColumns = config.menuForm;
  modalConfig.formRules = menuRules;
  modalConfig.modalVisible = true;
}

function saveSubmit() {
  let saveData = {
    ...modalConfig.formValue,
    BUTTONS: ETableData.value,
  };
  addMenu(saveData).then((res) => {
    ElMessage({
      message: res.MESSAGE,
      type: "success",
    });
    ETableData.value = [];
    tableData.value = [];
    setTimeout(() => {
      closeModal();
      getMenuList();
      getTableList();
    }, 520);
  });
}

function deleteEvent() {
  let idArr = null;
  if (currentData.value.length) {
    idArr = currentData.value.map((i) => {
      return i.BILLNO;
    });
  } else if (selectTree.value) {
    idArr = [selectTree.value.BILLNO];
  }
  ElMessageBox.confirm(`您确定要删除单据【${idArr}】?`, "Warning", {
    type: "warning",
  }).then(() => {
    delMenu(idArr).then((res) => {
      ElMessage({
        message: res.MESSAGE,
        type: "success",
      });

      setTimeout(() => {
        getMenuList();
        getTableList();
      }, 1000);
    });
  });
}

function getTableList() {
  let id = selectTree.value.CHILDREN.length
    ? selectTree.value.BILLNO
    : selectTree.value.PK_PARENT;
  let query = { PK_PARENT: id };
  listMenu(query).then((res) => {
    tableData.value = res.RESULT;
  });
}

// 下一步和完成
function stepsEvent(t) {
  if (t == "up") {
    activeSteps.value = activeSteps.value - 1;
  } else if (t == "down") {
    if (activeSteps.value == 1) {
      formRef.value.submitForm().then((valid) => {
        if (!valid) return;
        activeSteps.value = activeSteps.value + 1;
        if (!ETableData.value.length) {
          let BaseRowData = deepClone(initBtnValue);
          ETableData.value = [BaseRowData];
        }
      });
    }

    if (activeSteps.value == 2) {
      activeSteps.value = activeSteps.value + 1;
      SubmitConfig();
    }
  } else {
    saveSubmit();
  }
}

// 关闭弹窗
function closeModal() {
  if (activeSteps.value == 1) {
    formRef.value.resetForm();
  }
  modalConfig.modalVisible = false;
}

// 新增按钮
const plusConfig = () => {
  let BaseRowData = deepClone(initBtnValue);
  ETableRef.value.xEditTable.insertAt(BaseRowData, -1);
};

//删除按钮配置
const delConfig = (index) => {
  let idArr = [ETableData.value[index].BILLNO];
  ElMessageBox.confirm(`您确定要删除单据【${idArr}】?`, "确认提示", {
    type: "warning",
  }).then(() => {
    delBtn(idArr).then((res) => {
      ElMessage({
        message: res.MESSAGE,
        type: "success",
      });
      setTimeout(() => {
        getBtnData(modalConfig.formValue.BILLNO);
      }, 1000);
    });
  });
};

// 获取按钮的表格数据
const SubmitConfig = () => {
  let { tableData } = ETableRef.value.xEditTable.getTableData();
  if (tableData.length == 1 && tableData[0].VNAME == "") {
    ETableData.value = [];
  } else {
    ETableData.value = tableData;
  }
};

function SendIconString(i) {
  modalConfig.formValue.VICON = i;
}
//导入
function Importclick() {
  importModel.value = true;
}
function handleSuccess(response, file, fileList) {
  console.log(response);
}
function handleBeforeUpload(file) {
  const isZip =
    file.type === "application/zip" ||
    file.type === "application/x-zip-compressed";
  if (!isZip) {
    proxy.$modal.msgError(`文件格式不正确, 请上传.zip/.sql格式文件!`);
  }
  return isZip;
}
function cancelModel() {
  fileList.value = [];
}

// 获取仪表列表
const getDashboardList = () => {
  // 获取左侧仪表数据
  let query = {
    PAGENUM: 1,
    PAGESIZE: 2000,
    SORTNAME: "",
    REVERSE: "",
  };
  getDashboard(query).then((res) => {
    dashboardList.value = res.RESULT;
  });
};

//导出
function ExportClick() {
  let idArr = null;
  if (currentData.value.length) {
    idArr = currentData.value.map((i) => {
      return i.BILLNO;
    });
  } else if (selectTree.value) {
    idArr = [selectTree.value.BILLNO];
  }
  let saveData = {
    APPID: "",
    DATA: { BILLNO: idArr[0] },
    KEY: "",
    MODULEID: "",
    PAGEID: "",
    PARENTPAGE: "",
    VERSION: "",
  };
  proxy.download(
    "/sys/module/exportPageConfig",
    {
      ...saveData,
    },
    `job_${new Date().getTime()}.zip`
  );
}

const uploadData = computed(() => {
  if (currentData.value.length > 0) {
    return { BILLNO: currentData.value[0]?.BILLNO, BILLFORM: "0" }
  } else {
    return { BILLNO: selectTree.value?.BILLNO, BILLFORM: "0" }
  }
})

getMenuList();
</script>

<style lang="scss" scoped>
.app-wrap {
  /* background-color: #fff;
  box-sizing: border-box;
  padding: 6px;
  width: 100%;
  overflow: hidden; */

  height: calc(100vh - 100px);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  margin-top: 8px;
  .bg-white {
    border-radius: 4px;
  }
  .padding-8 {
    padding: 8px;
  }
}

.icon-item {
  font-size: 16px;
  cursor: pointer;
  padding: 10px;
}
.icon-item:hover {
  color: #176fff;
}
.ant-popover-inner {
  z-index: 9999;
  position: relative;
  top: 220px;
  left: 30px;
}

.icon-wrap {
  display: flex;
  flex-wrap: wrap;
  .Icon-div {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin: 4px;
    text-align: center;
    box-shadow: 0 0 0 1px #eee;
    cursor: pointer;
  }
  .active {
    box-shadow: 0 0 0 2px #409eff;
    color: #409eff;
    border-radius: 2 px;
  }
  .Icon-div:hover {
    box-shadow: 0 0 0 2px #409eff;
    color: #409eff;
    border-radius: 2 px;
  }
}
</style>
