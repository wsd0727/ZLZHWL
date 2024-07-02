<template>
  <div class="app-wrap2" ref="wrapRef">
    <el-row :gutter="20">
      <el-col :span="4" v-if="treeButton.length > 0" class="bg-white" style="padding-top: 6px; padding-left: 20px">
        <div class="head-container">
          <el-input v-model="treeKeyword" placeholder="请输入关键字" clearable prefix-icon="Search" style="margin-bottom: 5px; margin-top: 2px" />
        </div>
        <div class="head-container">
          <el-scrollbar :height="`${tableCFG.height}px`" class="tree-border">
            <el-tree :data="treeOptions" :props="{ label: 'LABEL', children: 'CHILDREN' }" node-key="VALUE" :filter-node-method="filterNode" ref="treeRef" highlight-current default-expand-all @node-click="handleNodeClick" />
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="treeButton.length > 0 ? 20 : 24">
        <div class="query-wrap modal-query-wrap" v-if="queryConfig.length">
          <el-row class="row-bg" justify="space-between">
            <el-col :span="20">
              <Form ref="formRefTop" class="query-form" v-model:formData="queryJson" :formConfig="set24col(queryConfig, 4)" :inline="true" @enter="queryEvent" @select="formSelect" />
            </el-col>
            <el-col :span="4" class="flex-row-end">
              <el-button @click="getTBData" type="primary" size="defalut">查找 </el-button>
            </el-col>
          </el-row>
        </div>

        <div class="bg-white padding-8">
          <div class="list-wrap" v-if="acountData.length">
            <div class="list-item" v-for="(item,index) in acountData" :key="index">
              <div class="title-label">
                {{ item.label }}
              </div>
              <div class="title-value">
                {{ item.value }}
              </div>
            </div>
          </div>

          <Vtable :tableCFG="tableCFG" ref="VtableRef" :tableData="pageConfig.tableData" @dbClick="ModalSubmit" @change="setSelectData" @checkbox-change="checkboxChange">
            <template #expand>
              <Form ref="formRefDetail" :formData="formConfig.formValue" :formConfig="formConfig.formColumns" :rules="{}" :detail="true" />
            </template>
          </Vtable>
        </div>

        <template v-if="pageConfig.hasSubTable">
          <template v-if="subTableList.subTableCol.length == 1">
            <Vtable :tableCFG="subTableList.subTableCol[0]" :tableData="subTableList.subTableData" @change="tableChange" />
          </template>
          <el-tabs :tab-position="tabPosition" class="demo-tabs" v-model="subTableList.active" v-else @tab-click="handleTabsClick">
            <el-tab-pane :label="item.VNAME" v-for="(item, index) in subTableList.subTableCol" :key="index" :name="index">
              <Vtable :tableCFG="item" :tableData="subTableList.subTableData" @change="tableChange"></Vtable>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="modalTab">
import Vtable from "@/components/Tables";
import Form from "@/components/Form";
import PinyinMatch from "pinyin-match";
import { getPageConfig, getTableData, axiosSave } from "@/api/system/page";
import {
  getFormValue,
  deepClone,
  getShowCFG,
  getFormRule,
  getUrlParams,
} from "@/utils/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";

const radio2 = ref('New York')

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const wrapRef = ref(null);
const props = defineProps({
  MODULE: String,
  PAGE: String,
  tableBillNo: String,
  ListTableData: Object,
  customTitle: String,
  selectData: Array
});
const VtableRef = ref(null)
const emit = defineEmits(["submit", "setCustomTitle", "setParentData"]);
const pageConfig = reactive({
  tableData: [],
  topButton: [],
  queryUrl: null,
  hasSubTable: false,
  activeBtn: {},
  modalVisible: false,
  modalW: "60%",
  modalH: "40%",
  pageTitle: "",
});

const treeConfig = reactive({
  treeOptions: [],
  treeButton: [],
  treeKeyword: "",
  treeQueryUrl: "",
  treeNode: null, // 当前激活的节点
});
const { treeOptions, treeButton, treeKeyword, treeQueryUrl, treeNode } =
  toRefs(treeConfig);

const subTableList = reactive({
  subTableCol: [],
  subTableData: [],
  height: 300,
  active: 0,
});
const { subTableCol } = toRefs(subTableList);
const tableCFG = reactive({
  tableColumns: [],
  hasTableTools: false, // 是否有操作栏
  hasSeq: false, // 是否显示序号
  toolsConfig: [],
  expandID: "",
  loading: false,
  height: subTableCol.value.length > 0 ? 350 : 600,
  SelectType: null,
});

const { tableColumns } = toRefs(tableCFG);

const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
});

const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
  formType: "", // DTL ADD
});

const SubTableConfig = ref([]);
const SubTableRules = ref([]);
const BtnCFGconfight = ref([]);
const detailBtnCFG = ref(null);
const detailTreeBtn = ref(null);
const SelectValue = ref(null);
const queryJson = ref({});
const queryConfig = ref([]);
const currentData = ref([]);
const colDrawer = ref(false);

const { tableData, topButton, queryUrl } = toRefs(pageConfig);

let initQueryJson = null;
const routerParams = router.currentRoute.value.meta;
pageConfig.pageTitle = routerParams.title;
getPageCFG();

const getAcountUrl = ref(null); // 获取统计数据的接口

/** 根据名称筛选菜单树 */
watch(treeKeyword, (val) => {
  proxy.$refs["treeRef"].filter(val);
});
/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return PinyinMatch.match(data.LABEL, treeKeyword.value);
};

function handleNodeClick(data) {
  queryJson.value.PK_CLASS = data.VALUE;
  treeNode.value = data;
  getTBData();
}

function getPageCFG() {
  let pageID = {
    MODULEID: props.MODULE,
    PAGEID: props.PAGE,
  };
  getPageConfig(pageID).then((res) => {
    const { QUERY, COLUMNS, SUBTABLE, BUTTON, SLOTCFG, PAGETITLE } = res.RESULT;
    resetTableBtn(BUTTON); // 设置表格中的按钮
    BtnCFGconfight.value = BUTTON.filter(
      (item) => item.ISSHOW == "1" && item.VTYPE == "3"
    );
    queryUrl.value = SLOTCFG ? SLOTCFG : getQueryUrl(BUTTON);
    getAcountUrl.value = getActionUrl(BUTTON, "GETCOUNT");
    queryConfig.value = getShowCFG(QUERY);
    treeQueryUrl.value = getQueryUrl(treeButton.value, "tree");
    PAGETITLE ? emit("setCustomTitle", PAGETITLE) : null;
    BtnCFGconfight.value.length
      ? emit("setParentData", { type: "btn", data: BtnCFGconfight.value })
      : null;

    // 重新整理列表配置
    let showColumns = [];
    COLUMNS.forEach((el) => {
      el.title = el.LABEL;
      if (el.VTYPE == 0) {
        el.VTYPE = "";
      }
      // 是否需要显示序号，默认显示
      if (el.VTYPE == "seq") {
        tableCFG.hasSeq = el.ISSHOW == 1 ? true : false;
      }
      // 是否需要展开详情
      if (el.VTYPE == "expand") {
        tableCFG.expandID = el.FIELD;
      }
     
      // 是否存在操作栏
      if (el.CONTROLS == "ExTableTools") {
        tableCFG.hasTableTools = true;
      }
      // 处理多选框和单选框的列头 为空
      if (el.VTYPE == "checkbox" || el.VTYPE == "radio") {
        el.title = "";
        tableCFG.SelectType = el.VTYPE;
      }
      if (
        el.ISSHOW == 1 &&
        el.VTYPE != "seq" &&
         el.VTYPE != "checkbox" &&
        el.CONTROLS != "ExTableTools"
      ) {
        showColumns.push(el);
      }
    });
 
    tableCFG.tableColumns = showColumns;
    initQueryJson = getFormValue(QUERY);
    queryJson.value = deepClone(initQueryJson);
    // props.ListTableData
    if (props.ListTableData != undefined) {
      Object.keys(props.ListTableData).forEach(function (key) {
        if (queryJson.value.hasOwnProperty(key)) {
          queryJson.value[key] = props.ListTableData[key];
        }
      });
    } else {
      getTBData();
    }
    let getDetailBtn = BUTTON.filter((i) => i.ACTION == "DTL");
    detailBtnCFG.value = getDetailBtn.length ? getDetailBtn[0] : null;
    if (routerParams.COMP == "VTableSub" && SUBTABLE.length) {
      pageConfig.hasSubTable = true;
      let newSUBTABLE = SUBTABLE.map((item) => {
        let i = {};
        i.hasTableTools = false;
        i.hasSeq = false;
        i.toolsConfig = [];
        i.expandID = "";
        i.loading = false;
        i.BILLNO = item.BILLNO;
        i.VNAME = item.VNAME;
        i.height = subTableList.height;
        i.queryUrl = item.SLOTCFG ? item.SLOTCFG : getQueryUrl(item.BUTTON);
        i.tableColumns = item.COLUMNS;
        i.tableData = [];
        return i;
      });
      subTableList.subTableCol = newSUBTABLE;
    }
    getAcountUrl.value ? getTabCount() : null;
    if (treeButton.value.length > 0 && treeQueryUrl) getTreeData();
    if (queryUrl.value) getTBData();

    console.table(tableCFG.tableColumns);
  });
}
function getQueryUrl(data, t) {
  if (Array.isArray(data)) {
    let a = [];
    if (t == "tree") {
      a = data.filter((i) => i.ACTION == "QRY" && i.VTYPE == 20);
    } else {
      a = data.filter((i) => i.ACTION == "QRY" && i.VTYPE != 20);
    }
    return a.length ? a[0].ACTIONADDRESS : "";
  }
}

// 查询条件中的下拉触发查询
const formSelect = (res) => {
  if (res.query) {
    queryEvent();
  }
};

// 获取指定的按钮
function getActionUrl(data, t) {
  if (Array.isArray(data) && t) {
    let a = data.filter((i) => i.ACTION == t);
    return a.length ? a[0].ACTIONADDRESS : "";
  }
}

function getTreeData() {
  let data = {
    KEYWORD: treeKeyword.value,
    PAGENUM: 1,
    PAGESIZE: 10000,
    SORTNAME: "",
    SORTORDER: "",
    MODULEID: props.MODULE,
    PAGEID: props.PAGE,
  };
  getTableData(treeQueryUrl.value, data).then((res) => {
    treeOptions.value = res;
  });
}
//表格弹窗中底部按钮
function TabtnEvent(data) {
  if (data.VTYPE == 3) {
    let dataChoose = null;
    //  选中数据并提交
    if (data.ISCHOOSE == 1) {
      // 需要选中数据，如果需要选中数据
      dataChoose = currentData.value.BILLNO;
    } else if (data.ISCHOOSE == 2) {
      dataChoose = SelectValue.value;
    }
    if (data.ISTWOSURE == 1) {
      needConfirm(data, dataChoose);
    } else {
      submitByBtn(data, dataChoose);
    }
  }
}

// 查询按钮执行事件
function queryEvent() {
  tableData.value = []
  pageInfo.currentPage = 1;
  getTBData();
}

// 加载表格数据
function getTBData() {
  tableCFG.loading = true;
  let data = {
    ...queryJson.value,
    PAGENUM: pageInfo.currentPage,
    PAGESIZE: pageInfo.pageSize,
    SORTNAME: pageInfo.sortName,
    SORTORDER: pageInfo.sortOrder,
    MODULEID: props.MODULE,
    PAGEID: props.PAGE,
    PK_CLASS: props.tableBillNo || props.ListTableData?.BILLNO || '',
    ...props.ListTableData
  };
  delete data.createTime;
  getTableData(pageConfig.queryUrl, data)
    .then((res) => {
      let { TOTAL, RECORDS } = res.RESULT;
      tableData.value = RECORDS;
      emit("setParentData", { type: "totalResult", data: TOTAL });
      tableCFG.loading = false;
      // 包含子表请求子表的第一个数据
      if (routerParams.COMP == "VTableSub") {
        let ff = subTableList.subTableCol[0];
        getSUBTBData(tableData.value[0].BILLNO);
      }
      // 是否需要设置默认选中
      if(queryUrl.value.includes('isCheck')){
        let checkID = getUrlParams(queryUrl.value).isCheck ;
        let dataChoose = tableData.value.filter(item => item[checkID] == 1);
        VtableRef.value.setDefaultChecked( dataChoose )
      }
    })
    .catch((errr) => {
      tableCFG.loading = false;
    });
}

// 加载子表格数据
function getSUBTBData(BILLNO) {
  let URL = subTableList.subTableCol[subTableList.active].queryUrl;
  let pageID = subTableList.subTableCol[subTableList.active].BILLNO;
  let data = {
    PK_ORG: BILLNO,
    PK_BILLNO: BILLNO,
    MODULEID: props.MODULE,
    PAGEID: pageID,
  };
  getTableData(URL, data)
    .then((res) => {
      let { RECORDS } = res;
      if (Array.isArray(res)) {
        subTableList.subTableData = res;
        SelectData.value[SelectData.value.length - 1].SUBTABLE = res;
      } else {
        subTableList.subTableData = RECORDS;
        SelectData.value[SelectData.value.length - 1].SUBTABLE = RECORDS;
      }
    })
    .catch((errr) => {
      tableCFG.loading = false;
    });
}

function handleTabsClick(e) {
  subTableList.active = e.index * 1;
  if (currentData.value.length) {
    getSUBTBData(currentData.value[0].BILLNO);
  } else {
    getSUBTBData(tableData.value[0].BILLNO);
  }
}

// 表格内部的多选事件，顶部筛选排序事件
function tableChange(data) {
  if (data.clicktype == "sort") {
    pageInfo.sortName = data.data.sortBy;
    pageInfo.sortOrder = data.data.sort;
    getTBData();
  } else if (data.clicktype == "detail") {
    currentData.value = data.data;
    handelEvent({ data: detailBtnCFG.value, row: null });
  } else if (data.clicktype == "expand" && data.data.expanded) {
    pageConfig.activeBtn = detailBtnCFG.value;
    currentData.value = data.data;
    formConfig.formType = "DTL";
    getOnlyPageConfig(); // 获取独立的配置
  }
  if (data.clicktype == "openDrawer") {
    colDrawer.value = true;
  } else {
    currentData.value = data.data;
  }
  if (routerParams.COMP == "VTableSub") {
    if (data.checked) {
      getSUBTBData(tableData.value[data.rowIndex].BILLNO);
    }
  }
}

// 分页点击
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  getTBData();
}



//  /zf-st-cp003/getScanMap  获取统计

// 处理表格常用按钮
function resetTableBtn(data) {
  if (!Array.isArray(data)) return [];
  let showData = [],
    CYBTN = [],
    ztreeBtn = [],
    ISCHOOSE1 = [], // 单选数据的按钮集合 主要用在表格操作栏
    ISCHOOSE2 = []; // 支持多选按钮集合
  data.forEach((i) => {
    if (tableCFG.hasTableTools) {
      if (i.ISSHOW == 1 && i.ISCHOOSE == 1) {
        ISCHOOSE1.push(i);
      }
    }
    if (i.ISSHOW == 1 && i.VTYPE != "20") {
      if (i.ISOFTEN == 1) {
        CYBTN.push(i);
      } else {
        showData.push(i);
      }
    }

    if (i.VTYPE == "20") {
      ztreeBtn.push(i);
    }
  });
  treeButton.value = ztreeBtn;
  topButton.value = [...CYBTN, ...showData];
  TbaBtnData(topButton.value);
}
let TbaBtnData = (data) => {
  proxy.$emit("TbaBtnData", data);
};

// 表格的功能按钮点击事件 表格内的按钮点击和顶部菜单栏点击
function handelEvent({ data, row }) {
  let selectRecords = [];
  pageConfig.activeBtn = data;
  // 表格内的按钮事件,先清空已选中的数据
  if (row) {
    selectRecords = [row];
  } else {
    selectRecords = currentData.value;
  }

  // 如果弹窗大小的值存在就进行设置弹窗大小  VTYPE =2  7  是开弹窗
  if (data.RATIO) {
    let WWHH =
      data.RATIO != 1 ? data.RATIO.split("*") : data.PAGEPATH.split("*");
    pageConfig.modalW = WWHH[0];
    pageConfig.modalH = WWHH[1];
  } else {
    pageConfig.modalW = "70%";
    pageConfig.modalH = "60%";
  }
  if (data.VTYPE == 2 || data.VTYPE == 20) {
    // 打开弹窗
    pageConfig.modelTitle = data.VNAME || "提示";
    formConfig.formType = data.ACTION || "";
    getOnlyPageConfig(); // 获取独立的配置
    pageConfig.modalVisible = true;
  }
  if (data.VTYPE == 3) {
    let dataChoose = null;
    //  选中数据并提交
    if (data.ISCHOOSE == 1) {
      // 需要选中数据，如果需要选中数据
      dataChoose = currentData.value[0];
    } else if (data.ISCHOOSE == 2) {
      dataChoose = currentData.value;
    }
    if (data.ISTWOSURE == 1) {
      needConfirm(data, dataChoose);
    } else {
      submitBtn(data, dataChoose);
    }
  }
}

function getDetail() {
  if (!detailBtnCFG) {
    ElMessage({
      message: "详情按钮未配置，无法进行查看详情和编辑",
      type: "error",
    });
    return;
  }

  let URL = null,
    Bid = null,
    PK_PAGE = null;
  // 如果是点击的左侧树进行编辑分类
  if (
    pageConfig.activeBtn.VTYPE == 20 &&
    pageConfig.activeBtn.ACTION == "EDIT"
  ) {
    URL = detailTreeBtn.value.ACTIONADDRESS;
    Bid = treeNode.value.VALUE;
    PK_PAGE = pageConfig.activeBtn.PK_PAGE;
  } else {
    URL = detailBtnCFG.value.ACTIONADDRESS;
    Bid = Array.isArray(currentData.value)
      ? currentData.value[0].BILLNO
      : currentData.value.BILLNO;
    PK_PAGE = pageConfig.activeBtn.PK_PAGE;
  }

  if (URL == "BYCOLUMN") {
    let newFormValue = Array.isArray(currentData.value)
      ? currentData.value[0]
      : currentData.value;
    formConfig.formValue = Object.assign(formConfig.formValue, newFormValue);
    return;
  }

  let data = {
    BILLNO: Bid,
    MODULEID: props.MODULE,
    PAGEID: PK_PAGE,
  };
  axiosSave(URL, data).then((res) => {
    formConfig.formValue = Object.assign(formConfig.formValue, res);
  });
}

// 获取独立的配置  比如弹窗中的表单
function getOnlyPageConfig() {
  let pageID = {
    data: {},
    MODULEID: props.MODULE,
    PAGEID: pageConfig.activeBtn.PK_PAGE,
  };
  getPageConfig(pageID).then((res) => {
    const { QUERY, COLUMNS, SUBTABLE, BUTTON } = res;
    formConfig.formColumns = COLUMNS;
    formConfig.formBase = getFormValue(COLUMNS);
    formConfig.formValue = JSON.parse(JSON.stringify(formConfig.formBase));
    formConfig.formRules = getFormRule(COLUMNS);
    SubTableConfig.value = SUBTABLE;
    if (SUBTABLE.length > 0) setSubTableData();
    // if (formConfig.formType == "DTL" || formConfig.formType == "EDIT") getDetail();
  });
}

const setSubTableData = () => {
  let rules = [];
  for (let i = 0; i < SubTableConfig.value.length; i++) {
    const el = SubTableConfig.value[i];
    let { COLUMNS, FIELD } = el;
    let baseData = getFormValue(COLUMNS);
    formConfig.formValue[FIELD] = [{ ...baseData }];
    let rule = getFormRule(COLUMNS);
    rules.push(rule);
  }
  SubTableRules.value = rules;
};

function needConfirm(data, selectRecords) {
  ElMessageBox.confirm(`您确定要执行该操作吗?`, "确认提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    submitByBtn(data, selectRecords);
  });
}

function submitEvent(URL, sdata) {
  let saveData = {
    SUBLIST: SelectValue.value,
    QUERY: queryJson.value ,
    // OBJ: [...props.ListTableData],
    OBJ: props.selectData,
    MODULEID: props.MODULE,
    PAGEID: pageConfig.activeBtn.PK_PAGE || props.PAGE,
    ...props.ListTableData
  };
  axiosSave(URL, saveData).then((res) => {
    proxy.$emit("closeModal");
    proxy.$emit("getTBData");
    ElMessage({
      message: "保存成功",
      type: "success",
    });
    setTimeout(() => {
      if (pageConfig.modalVisible) closeModal();
      if (treeButton.value.length > 0 && treeQueryUrl) getTreeData();
      colDrawer.value = false;
      getTBData();
    }, 1000);
  });
}

function submitByBtn(btn, data) {
  let params = btn.ACTIONADDRESS.includes("?")
      ? getUrlParams(btn.ACTIONADDRESS)
      : {},
    sdata = null;
  if (btn.ACTION == "DELETE") {
    let arr = [];
    if (btn.VTYPE == 20) {
      arr.push(treeNode.value.VALUE);
    } else {
      arr = SelectValue.value.map((i) => {
        return i.BILLNO;
      });
    }
    sdata = { data: arr };
  } else {
    sdata = { ...data, ...params };
  }
  submitEvent(btn.ACTIONADDRESS, sdata);
}

// 关闭弹窗
function closeModal() {
  if (MasterFormRef.value) MasterFormRef.value.resetForm();
  pageConfig.modalVisible = false;
}

function set24col(data, n) {
  let newdata = deepClone(data);
  let data2 = newdata.filter((i) => {
    i.COL = n == 24 ? n : i.COL || 4;
    return i.GROUPID == 1;
  });
  if (n != 24) {
    data2 = data2.slice(0, 6);
  }
  return data2;
}

// 弹窗保存
const SelectData = ref([]);
const setSelectData = (res) => {
  if (res.clicktype == "openLink") {
    proxy.$emit("btnModelSelectData", res);
  } else {
    SelectValue.value = res.data;
    proxy.$emit("btnModelSelectData", res.data[0]);
    SelectData.value = res.data;
    // console.log("setSelectData", SelectData.value);
    getAcountUrl.value ? getTabCount() : null;
    if (subTableList.subTableCol.length > 0 && res.data.length > 0)
      getSUBTBData(res.data[0]?.BILLNO);
  }
};

const acountData = ref([]); // 统计数据
// 点料获取统计
const getTabCount = () => {
  let saveData = {  ...props.ListTableData , SUBLIST: SelectData.value,};
  let URL = getAcountUrl.value;
  axiosSave(URL, saveData).then((res) => {
    acountData.value = res.RESULT;
  });
};
const checkboxChange = (res) => {
  proxy.$emit("btnModelSelectData", res.records);
};

const ModalSubmit = (data) => {
  if (subTableList.subTableCol.length > 0)
    Object.assign(data, { SUBTABLE: subTableList.subTableData });
  emit("submit", data);
};

defineExpose({
  rows: SelectData,
  getTBData,
  getSUBTBData,
  handlePageChange,
  TabtnEvent,
});
</script>
<style lang="scss" scoped>
.app-wrap2 {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  .bg-white {
    border-radius: 4px;
  }
  .padding-8 {
    padding: 8px;
  }
  .query-wrap {
    padding: 8px;
    background-color: #fff;
    // margin-bottom: 6px !important;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .tool-wrap {
    padding-bottom: 8px;
  }
  .page-fixe-bottom {
    position: fixed !important;
    z-index: 10;
    bottom: 10px;
    right: 30px !important;
    height: 34px !important;
  }
}
:deep(.el-tabs__header) {
  margin-bottom: 6px !important;
}

.modal-title {
  font-weight: 500 !important;
  font-size: 18px;
  color: #000;
}

.btnClass {
  display: flex;
  justify-content: end;
}
:deep(.el-form--inline .el-form-item) {
  margin-bottom: 0px !important;
}
// 拖拽事件样式

.col-tab {
  width: 100px;
  margin: 10px 5px;
}

.itxst {
  width: 600px;
  display: flex;
}

.itxst > div:nth-of-type(1) {
  flex: 1;
}

.itxst > div:nth-of-type(2) {
  width: 270px;
  padding-left: 20px;
}

.item {
  border: solid 1px #eee;
  padding: 6px 10px;
  text-align: left;
}

.item:hover {
  cursor: move;
}

.item + .item {
  margin-top: 10px;
}

.ghost {
  border: solid 1px rgb(19, 41, 239) !important;
}

.chosenClass {
  background-color: #eee;
  opacity: 1;
  border: solid 1px red;
}

.fallbackClass {
  background-color: aquamarine;
}
.menu-btn {
  display: flex;
  justify-content: end;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 10px !important;
}

.query-form {
  :deep(.el-range__icon) {
    width: 0;
    display: none;
  }
  :deep(.el-date-editor) {
    width: 180px !important;
  }
}

.list-wrap {
  display: flex;
  .list-item {
    display: flex;
    padding: 0 4px;
    font-size: 14px;
    .title-value {
      color: red;
      font-weight: 600;
    }
  }
}

:deep(.modal-query-wrap .el-form-item){
  margin-bottom: 10px!important;
}
</style>
