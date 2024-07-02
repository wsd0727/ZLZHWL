<template>
  <div class="app-wrap">
    <div class="form-page-wrap position-r">
      <el-scrollbar class="">
        <div class="form-title">
          <div class="form-title-left">
            {{ pageConfig.pageTitle }}
          </div>

          <div class="">
            <el-button type="primary" size="default" @click="formBtnEvent(itemB)" v-for="itemB in pageConfig.buttonList" :key="itemB.BILLNO">
              {{ itemB.VNAME }}
            </el-button>
          </div>
        </div>

        <div class="form-page-content mt20 99">
          <!-- 左侧树形结构模板 -->
          <div v-if="pageConfig.hasTree" class="tree-left bg-white position-r">
            <div class="head-container">
              <el-input v-model="treeKeyword" placeholder="请输入关键字" clearable style="margin-bottom: 5px; margin-top: 2px">
              </el-input>
            </div>
            <div class="head-container" v-if="treeOptions.length">
              <el-scrollbar :height="pageConfig.treeHeight" class="tree-border">
                <el-tree :data="treeOptions" :props="{
                    label: 'LABEL',
                    children: 'CHILDREN',
                    disabled: 'disabled',
                  }" node-key="VALUE" :filter-node-method="filterNode" :current-node-key="
                    pageConfig.defaultExpandedKeys.length
                      ? pageConfig.defaultExpandedKeys[0]
                      : null
                  " :default-expanded-keys="pageConfig.defaultExpandedKeys" ref="treeRef" highlight-current @node-click="handleNodeClick">
                </el-tree>
              </el-scrollbar>
            </div>
          </div>

          <MasterForm ref="MasterFormRef" v-model:formData="formConfig.formValue" :formConfig="formConfig.formColumns" :tableConfig="SubTableConfig" :formRules="formConfig.formRules" :othConfig="otherCFG" :tableRules="SubTableRules" :detail="formConfig.formType == 'DTL'" :othTabCFG="ETableCFG"
            :infoConfig="[]" @select="formSelect" />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup name="formPage">
import MasterForm from "@/components/MasterForm";
import { getPageConfig, getTableData, axiosSave } from "@/api/system/page";
import { ElMessage, ElMessageBox } from "element-plus";
import PinyinMatch from "pinyin-match";

import {
  getFormValue,
  deepClone,
  getShowCFG,
  getFormRule,
  getUrlParams,
} from "@/utils/index";
import { reactive } from "vue";
const { proxy } = getCurrentInstance();
const router = useRouter();

const routerParams = router.currentRoute.value.meta;

const pageConfig = reactive({
  hasTree: false, // 是否存在左侧树型结构
  tableData: [],
  totalData: null,
  topButton: [],
  initButton: [],
  queryUrl: null,
  hasSubTable: false,
  activeBtn: {},
  modalVisible: false,
  modalBtn: [],
  modalW: "60%",
  modalH: "40%",
  pageTitle: "",
  treeHeight: window.innerHeight - 215,
  mainTable: [], // 多主表原始配置数据
  mainActive: 0,
  mainTableCFG: [], // 多主表处理后的配置
  buttonList: [],
  defaultExpandedKeys: null,
});

const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
  formType: "", // DTL ADD
  buttonList: [], // 表单中的按钮
  showDetail: false, // 是否显示表单 ， 初始时不显示，详情数据查询后显示
});
const SubTableConfig = ref([]);
const SubTableRules = ref([]);
pageConfig.pageTitle = routerParams.title;

const MasterFormRef = ref(null);

const activeBtn = ref(null);

const ETableCFG = reactive({
  height: 500,
});

// 当前表单其它配置 全局的label 宽
const otherCFG = ref({
  labelWidth: "60px",
});

// 左侧树
const treeOptions = ref([]);
const treeKeyword = ref("");
const treeQueryUrl = ref("");
const treeNode = ref(null);
const detailURL = ref("");

/** 根据名称筛选菜单树 */
watch(treeKeyword, (val) => {
  proxy.$refs["treeRef"]?.filter(val);
});
/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return (
    PinyinMatch.match(data.LABEL, treeKeyword.value) ||
    PinyinMatch.match(data.VALUE, treeKeyword.value) ||
    PinyinMatch.match(data.CODE, treeKeyword.value)
  );
};

getPageCFG()
/*
 *  获取当前页面的动态配置
 */
function getPageCFG() {
  let pageID = {
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
  };
  getPageConfig(pageID).then((res) => {
    const { QUERY, COLUMNS, SUBTABLE, BUTTON, SLOTCFG, MAINTABLE, VDEF2 } =
      res.RESULT;
    pageConfig.buttonList = BUTTON.filter((i) => i.ISSHOW == 1);
    formConfig.formColumns = COLUMNS;
    formConfig.formBase = getFormValue(COLUMNS);
    formConfig.formValue = JSON.parse(JSON.stringify(formConfig.formBase));
    formConfig.formRules = getFormRule(COLUMNS);
    SubTableConfig.value = SUBTABLE;
    otherCFG.value.labelWidth = VDEF2 ? VDEF2 + "px" : null;
    resetTableHeight(COLUMNS);

    treeQueryUrl.value = getQueryUrl(BUTTON, "tree");
    console.log('获取页面配置');
    if (treeQueryUrl.value) {
      getTreeData();
      detailURL.value = SLOTCFG;
      pageConfig.hasTree = true;
    }

    if (SUBTABLE.length > 0) setSubTableData();
    if (formConfig.formType == "DTL" || formConfig.formType == "EDIT") {
      formConfig.showDetail = false;
      getDetail(SLOTCFG);
    } else {
      formConfig.showDetail = true;
    }
  });
}

const resetTableHeight = (COLUMNS) => {
  let showCol = getShowCFG(COLUMNS);
  // console.log(89, showCol);
  ETableCFG.height = 450;
};

const setSubTableData = () => {
  let rules = [];
  for (let i = 0; i < SubTableConfig.value.length; i++) {
    const el = SubTableConfig.value[i];
    let { COLUMNS, FIELD, SLOTCFG } = el;
    SLOTCFG ? getDataByUrl(SLOTCFG, FIELD) : null;
    let baseData = getFormValue(COLUMNS);
    delete baseData.EnumData;
    formConfig.formValue[FIELD] = [
      { ...baseData },
      { ...baseData },
      { ...baseData },
      { ...baseData },
      { ...baseData },
    ];
    let rule = getFormRule(COLUMNS);
    rules.push(rule);
  }
  SubTableRules.value = rules;
};

const getDataByUrl = (url, id) => {
  let pageID = {
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
  };
  axiosSave(url, pageID).then((res) => {
    let { RESULT } = res;
    let copyData = formConfig.formValue[id][0];
    let ABC = RESULT.map((i) => {
      let newData = JSON.parse(JSON.stringify(copyData));
      return { ...newData, ...i };
    });
    if (id) {
      formConfig.formValue[id] = ABC;
    }
  });
};

// 按钮事件
const formBtnEvent = (e) => {
  activeBtn.value = e;
  pageConfig.activeBtn = e;
  formSubmit();
};

//  表单验证事件
const formSubmit = () => {
  MasterFormRef.value.submitForm().then((valid) => {
    if (!valid) return;
    let newData = null;
    submitEvent(pageConfig.activeBtn.ACTIONADDRESS, formConfig.formValue);
  });
};

// 数据提交事件
function submitEvent(URL, sdata) {
  let saveData = {
    ...sdata,
    TREENODE: treeNode.value,
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
  };
  axiosSave(URL, saveData).then((res) => {
    ElMessage({
      message: res.MESSAGE,
      type: "success",
    });
    if (activeBtn.value.ACTION == "CALC") {
      formConfig.formValue = res.RESULT;
      // console.log(123, res ,formConfig.formValue  );
    }
  });
}

function getTreeData() {
  let params = getUrlParams(treeQueryUrl.value);
  let data = {
    KEYWORD: "",
    ...params,
    PAGENUM: 1,
    TYPE: "1",
    PAGESIZE: 10000,
    SORTNAME: "",
    SORTORDER: "",
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
  };
  getTableData(treeQueryUrl.value, data).then((res) => {
    let { TOTAL, RECORDS } = res.RESULT;
    treeOptions.value = res.RESULT;
    pageConfig.defaultExpandedKeys = [res.RESULT[0].VALUE];
  });
}

//  树节点点击事件
function handleNodeClick(data) {
  // MBConfig.MODULEID = data.MODULEID;
  // MBConfig.PAGEID = data.PAGEID;
  // queryJson.value.PK_CLASS = data.VALUE;
  treeNode.value = data; //
  getFormDetail();
  // currentData.value = [];
  // pageConfig.defaultExpandedKeys = [data.VALUE];
  // if (!data.ISDISABLED) {
  //   pageInfo.currentPage = 1;
  //   getTBData();
  //   emit("treeClick");
  // }
}

function getFormDetail() {
  let params = getUrlParams(treeQueryUrl.value);
  if (!treeNode.value) return;
  let data = {
    KEYWORD: "",
    ...params,
    PK_CLASS: treeNode.value,
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
  };
  getTableData(detailURL.value, data).then((res) => {
    if (res.RESULT) {
      formConfig.formValue = { ...formConfig.formValue, ...res.RESULT };
    }
  });
}

function getQueryUrl(data, t) {
  if (Array.isArray(data)) {
    let a = [];
    if (t == "tree") {
      a = data.filter((i) => {
        return i.ACTION == "QRY" && i.VTYPE == 20;
      });
    } else {
      a = data.filter((i) => {
        return i.ACTION == "QRY" && i.VTYPE != 20;
      });
    }
    return a.length ? a[0].ACTIONADDRESS : "";
  }
}
</script>

<style lang="scss" scoped>
.form-page-wrap {
  width: 100%;
  height: calc(100vh - 110px);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background: #fff;
  padding: 4px;
  .form-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    position: absolute;
    height: 40px;
    width: 100%;
    top: 0;
    background: #fff;
    z-index: 2;
    border-bottom: 1px solid #ddd;
    &-left {
      cursor: pointer;
      line-height: 36px;
      .text-muted:hover {
        color: var(--el-color-primary);
      }
      .el-icon {
        position: relative;
        top: 7px;
      }
    }
  }
  .el-divider--horizontal {
    margin: 6px 0;
  }

  .form-page-content {
    width: 99%;
    box-sizing: border-box;
    margin-top: 40px;
    display: flex;
    .MasterForm{
      width: 100%;
      padding: 10px 20px;
    }
  }
}

.tree-left {
  width: 210px;
  padding: 10px;
  border-right: 10px solid #e7e9f1;
}


</style>
