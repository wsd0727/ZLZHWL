<template>
  <div class="gantt-warp" v-loading="pageLoading" element-loading-text="加载中...">
    <div class="query-wrap bg-white" v-if="queryConfig.length">
      <el-row class="row-bg" justify="space-between">
        <el-col :span="22">
          <Form class="query-form" ref="formRefTop" v-model:formData="queryJson" :formConfig="showMoreQuery ? queryConfig : set24col(queryConfig, 4)" :inline="true" @select="queryEvent" @enter="queryEvent" />
        </el-col>
        <el-col :span="2" class="flex-row-end">
          <el-button @click="queryEvent" type="primary" size="Default"> 查找 </el-button>
          <el-button @click="collapseEvent" size="Default">
            {{ showMoreQuery ? "收起" : "高级" }}
          </el-button>
        </el-col>
      </el-row>
    </div>

    <div class="sontable-wrap">
      <div class="sontable-btn" v-if="topButton.length">
        <Button :topButton="topButton" :currentData="currentData" @handelEvent="handelEvent" />
      </div>

      <div class="son-table" v-if="showHottable">
        <HotTable ref="hotTableComponent" :settings="hotSettings" class="mytable-scrollbar" @getSelected="getSelected" />
      </div>

      <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50, 100, 300]" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange" />
    </div>

    <!-- 公共弹窗表单模块 -->
    <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer @close="closeModal">
      <template #title>
        <span class="modal-title">{{ pageConfig.pageTitle }}{{ pageConfig.modelTitle }}</span>
      </template>
      <template #default>
        <MasterForm v-if="formConfig.showDetail" ref="MasterFormRef" v-model:formData="formConfig.formValue" :formConfig="formConfig.formColumns" :tableConfig="SubTableConfig" :formRules="formConfig.formRules" :tableRules="SubTableRules" :detail="formConfig.formType == 'DTL'" @select="formSelect"
          :MODULE="formModalTableCFG.MODULE" :PAGE="formModalTableCFG.PAGE" :othConfig="otherCFG" :infoConfig="infoConfig" :tableBillNo="formModalTableCFG.tableBillNo" />
      </template>
      <template #footer>
        <el-space>
          <el-button size="default" @click="closeModal"> 关闭 </el-button>
          <template v-if="formConfig.buttonList.length && formConfig.formType != 'DTL'">
            <el-button type="primary" size="default" @click="formBtnEvent(itemB)" v-for="itemB in formConfig.buttonList" :key="itemB.BILLNO">
              {{ itemB.VNAME }}
            </el-button>
          </template>
        </el-space>
      </template>
    </vxe-modal>

    <!-- 表格弹窗 -->
    <vxe-modal destroy-on-close v-model="tableShowCGF" :width="pageConfig.modalW" :height="pageConfig.modalH" id="tableModal" resize storage transfer show-zoom @close="closeModal">
      <template #title>
        <span class="modal-title">{{ pageConfig.modelTitle }}</span>
      </template>
      <template #default>
        <ModalTable ref="modalRef" :MODULE="formModalTableCFG.MODULE" :ListTableData="formModalTableCFG.ListtableData" :PAGE="formModalTableCFG.PAGE" :tableBillNo="formModalTableCFG.tableBillNo" @TbaBtnData="TbaBtnData" @btnModelSelectData="btnModelSelectData" @getTBData="getTBData"
          @closeModal="closeModal">
        </ModalTable>
      </template>
    </vxe-modal>
  </div>
</template>

<script setup name="sontable">
import { HotTable } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import "handsontable/languages"; // 语言设置
import Button from "@/components/Tables/button.vue";
import ModalTable from "@/views/table/modal";
import { ElMessage, ElMessageBox } from "element-plus";
import Vtable from "@/components/Tables";
import Form from "@/components/Form";
import MasterForm from "@/components/MasterForm";
import {
  getFormValue,
  deepClone,
  getShowCFG,
  getFormRule,
  getUrlParams,
  evilFn,
  uuid,
} from "@/utils";
import { detailForm, tableConfig, queryForm } from "@/config/location";
import { getLocationData, getLocationDetail } from "@/api/mes/location";
import { getPageConfig, getTableData, axiosSave } from "@/api/system/page";
import json from "../../components/FileIcon/config";

import useUserStore from "@/store/modules/user";

const MasterFormRef = ref(null);
const tableShowCGF = ref(false);
const showMoreQuery = ref(false);
const formModalTableCFG = ref({
  MODULE: "",
  PAGE: "",
  tableBillNo: "",
  ListtableData: {},
});

const { proxy } = getCurrentInstance();

const queryJson = ref({});
const queryConfig = ref([]);
const detailConfig = ref(null);
const detailJson = ref({});
const showHottable = ref(false);

const hotTableComponent = ref(null);

const wareHeight = ref(window.innerHeight - 265);

const topButton = ref([]);
const currentData = ref([]);

const pageInfo = reactive({
  currentPage: 1,
  pageSize: 300,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
});

const tableCFG = reactive({
  tableColumns: tableConfig,
  hasTableTools: false, // 是否有操作栏
  hasSeq: false, // 是否显示序号
  toolsConfig: [],
  expandID: "",
  loading: false,
  hasFill: false, // 表格补位
  hasEmpty: false,
  height: 300,
  rowClassEval: "", // 行加背景色的条件
  mergeCFG: null, // 表尾合计的配置  字段
  mergeRowField: [], // 需要合并的字段
  SelectType: null,
});

const pageConfig = reactive({
  hasTree: false, // 是否存在左侧树型结构
  treeExpand: true, // 是否展开树
  defaultExpandedKeys: [], // 默认展开的树节点
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
  treeHeight: window.innerHeight - 175,
  mainTable: [], // 多主表原始配置数据
  mainActive: 0,
  mainTableCFG: [], // 多主表处理后的配置
  batchTable: false, // 是否批量操作表格
  EtableCFG: {}, // 批量操作时主表的验证规则
});
const { hasTree, totalData, mainTable } = toRefs(pageConfig);

const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
  formType: "", // DTL ADD
  buttonList: [], // 表单中的按钮
  showDetail: false, // 是否显示表单 ， 初始时不显示，详情数据查询后显示
});
const TabModelConfig = reactive({
  tabBase: {}, // 表单源数据
  tabValue: {}, // 表格数据
  tabColumns: [], // form配置(已过滤显示)
  tabRules: {}, // form验证
  tabType: "", // DTL ADD
  // buttonList: [], // 表单中的按钮
});
const subTableList = reactive({
  subTableCol: [],
  subTableData: [],
  totalData: null,
  height: 300,
  active: 0,
  isShowPage: false,
});

const SubTableConfig = ref([]);
const SubTableRules = ref([]);
const infoConfig = ref([]);
const colDrawer = ref(false);
const pageLoading = ref(false);

const router = useRouter();
const routerParams = router.currentRoute.value.meta;

// sontable start

const tableData = ref([]);

const hotSettings = ref({
  language: "zh-CN", // 语言设置
  licenseKey: "non-commercial-and-evaluation", // 隐藏版权文字
  // width: "auto", // 表格宽度
  width: '100%',
  colWidths: [50, 100, 200, 400],
  height: wareHeight, // 表格高度、设置以后才会出现scroll
  // data: Handsontable.helper.createSpreadsheetData(10, 26), // 列表初始化数据
  data: [], // 表格数据也可根据实际项目需要进行设置
  startRows: 0, // 初始化行数,无data属性时生效(该值小于minRows时,以minRows为准)
  startCols: 3, // 初始化列数,无data属性时生效(该值小于minCols时,以minCols为准)
  minRows: 0, // 最少行数(当初始化数据小于该值时,以该值为准)
  minCols: 3, // 最少列数(当初始化数据小于该值时,以该值为准)
  minSpareCols: 0, // 列的最小留白数
  minSpareRows: 0, // 行的最小留白数
  colHeaders: ["只读", "文本", "密码", "日期", "时间", "多选", "下拉", ""], // 自定义表格的表头
  rowHeaders: true, // 是否展示行表头,默认是1,2,3等数据,可以['行1','行2']进行自定义展示
  // colWidths: 150, // 列宽度
  dropdownMenu: false, // 表头展示下拉菜单,可以自定义展示
  className: "htCenter", // 单元格文字对齐方式(htLeft,htRight,htCenter)
  currentRowClassName: "my-selectRow", // 给选中行添加自定义class类名
  currentColClassName: "my-selectCol", // 给选中列添加自定义class类名
  autoWrapRow: true, // 文字是否自动换行(当没有设置colWidths时生效)
  fixedRowsTop: 0, // 列表内容从上面开始,固定定位的行数(不包含行表头)
  fixedColumnsLeft: 1, // 列表内容从左面开始,固定定位的列数(不包含列表头)
  fillHandle: true, // 是否开启拖拽复制操作(true,false,'horizontal'水平复制,'vertical'垂直复制)
  manualColumnResize: true, // 拖拽列宽
  columnSorting: true, // 启用排序
  autoColumnSize: {syncLimit: 300},
  autoRowSize: {syncLimit: '40%'},
  contextMenu: {
    // 单元格右击展示菜单
    items: {
      row_above: {
        name: "上面插入一行",
      },
      row_below: {
        name: "下面插入一行",
      },
      // col_left: {
      //   name: "左侧插入一列",
      // },
      // col_right: {
      //   name: "右侧插入一列",
      // },
      remove_row: {
        name: "删除行",
        // callback: function () {
        //   console.log('删除本行');
        // },
      },

      // remove_col: {
      //   name: "移除本列",
      // },
      // alignment: {
      //   name: "对齐方式",
      // },
      // make_read_only: {
      //   name: "只读",
      // },
      // 'borders':{
      //   name: '边框'
      // },
      // copy: {
      //   name: "复制",
      // },
      // cut: {
      //   name: "剪切",
      // },
      // separator: Handsontable.plugins.ContextMenu.SEPARATOR,
      // clear_custom: {
      //   name: "清空所有单元格数据",
      //   callback: function () {
      //     this.clear();
      //   },
      // },
    },
  },
  autofill: {
    autoInsertRow: false,
  },
  columns: [],
  beforeRenderer: addClassesToRows,

  afterOnCellMouseDown: (e, changes) => {
    let { row } = changes;
    currentData.value = [tableData.value[row]];
  },

  afterChange: (changes) => {
    changes?.forEach(([row, prop, oldValue, newValue]) => {
      // 单元格点击编辑后新的值和原来的值如果没有变化的话不触发此方法
      // let BILLNO = hotTableComponent.value.hotInstance.getDataAtRow(row)[0];
      console.log(999, row , editUrl.value);
      if (!editUrl.value) return;
      let BILLNO = tableData.value[row].BILLNO;
      if (oldValue !== newValue) {
        let save = { BILLNO: BILLNO };
        save[prop] = newValue || "";
        submitData(save);
      }
    });
  },

  // afterOnCellMouseDown: eventClick, //鼠标点击

  // 新增行  index下标 , amount 行数
  afterCreateRow: function (index, amount, source) {
    addRow(index);
  },

  // 删除行
  beforeRemoveRow: function (index, amount) {
    let endIndex = index + amount;
    let newData = hotSettings.value.data.slice(index, endIndex);
    let BI = newData.map((i) => {
      return i.BILLNO;
    });
    deleteRow(BI, index, amount, "删除", deleteUrl.value);
    return false;
  },
  //
  afterSelection: function (row, column, row2, column2) {
    if (row != row2 || column == -1) {
      let selectRows = hotSettings.value.data.slice(row, row2 + 1);
      currentData.value = selectRows;
    } else {
      currentData.value = [];
    }
  },
  afterDeselect: function (row, column, row2, column2) {
    // currentData.value = []
  },
  afterColumnSort: function (a, b) {
    let { column, sortOrder } = b[0];
    let columnsID = hotSettings.value.columns[column].data;
    if (pageInfo.sortName && columnsID == pageInfo.sortName) {
      pageInfo.sortOrder = pageInfo.sortOrder == "asc" ? "desc" : "asc";
    } else {
      pageInfo.sortName = columnsID;
      pageInfo.sortOrder = "asc";
    }
    queryEvent();
  },
});
const userStore = useUserStore();
const queryUrl = ref(null);
const detailBtnCFG = ref(null);
const addUrl = ref(null);
const editUrl = ref(null);
const deleteUrl = ref(null);
const modalRef = ref(null);
const visibleFormPage = ref(false);
const queryDetailParams = ref({});

const EnumData = reactive({});
// sontable end
const mbType = ref(false);

function queryEvent() {
  pageInfo.currentPage = 1;
  getTBData();
}

// 当前表单其它配置 全局的label 宽
const otherCFG = ref({
  labelWidth: "60px",
  GRID: "",
});

const treeConfig = reactive({
  treeOptions: [],
  treeButton: [],
  treeButtonAuth: [],
  treeKeyword: "",
  treeQueryUrl: "",
  treeNode: null, // 当前激活的节点
});
const MBConfig = reactive({
  MODULEID: "",
  PAGEID: "",
});
const {
  treeOptions,
  treeButton,
  treeButtonAuth,
  treeKeyword,
  treeQueryUrl,
  treeNode,
} = toRefs(treeConfig);

// 获取页面动态配置
function getPageCFG() {
  let pageID = {
    APPID: "",
    DATA: {},
    KEY: "",
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
    VERSION: "",
  };
  getPageConfig(pageID).then((res) => {
    const { QUERY, COLUMNS, SUBTABLE, FLOATCOM, BUTTON, SLOTCFG, VDEF2 } =
      res.RESULT;
    let showColumns = [];
    // ACTION: "ADD"
    queryUrl.value = SLOTCFG ? SLOTCFG : getQueryUrl(BUTTON);
    addUrl.value = getUrl2type(BUTTON, "ADD"); //"/zfmes/zm-rs-rc002/add";
    editUrl.value = getUrl2type(BUTTON, "EDIT");
    deleteUrl.value = getUrl2type(BUTTON, "DELETE");
    detailBtnCFG.value = getUrl2type(BUTTON, "DTL");

    queryConfig.value = getShowCFG(QUERY);
    queryJson.value = getFormValue(QUERY);
    resetTableBtn(BUTTON);

    if(!queryConfig.value.length){
      wareHeight.value = window.innerHeight - 210
    }

    let hotColWidths = [],
      colHeaders = [],
      fixedColumnsLeft = 0;

    // allColumns.value = JSON.parse(JSON.stringify(COLUMNS));
    COLUMNS.forEach((el) => {
      el.title = el.LABEL;
      if (el.VTYPE == 0) {
        el.VTYPE = "";
      }

      if (el.ISFIXED == "left") {
        fixedColumnsLeft++;
      }
      // 是否需要显示序号，默认显示
      if (el.VTYPE == "seq") {
        tableCFG.hasSeq = el.ISSHOW == 1 ? true : false;
      }
      // 是否需要展开详情
      if (el.VTYPE == "expand") {
        tableCFG.expandID = el.FIELD;
        expandCFG.value = el;
      }

      // 处理多选框和单选框的列头 为空
      if (el.VTYPE == "checkbox" || el.VTYPE == "radio") {
        el.title = "";
        tableCFG.SelectType = el.VTYPE;
        tableCFG.hasCheck = el.VTYPE == "checkbox";
      }
      if (el.VTYPE == "exNum") {
        try {
          EnumData[el.FIELD] = JSON.parse(el.OTHER);
        } catch (error) {
          EnumData[el.FIELD] = el.FIELD + "=配置异常";
        }
      }

      if (
        el.ISSHOW == 1 &&
        el.VTYPE != "seq" &&
        el.VTYPE != "checkbox" &&
        el.CONTROLS != "ExTableTools"
      ) {
        showColumns.push(el);
        hotColWidths.push(el.WIDTH*1);
        colHeaders.push(el.LABEL);
      }
    });
    hotSettings.value.fixedColumnsLeft = fixedColumnsLeft;
    hotSettings.value.colHeaders = colHeaders;
    hotSettings.value.columns = sethotColumns(showColumns);
    getTableRatio(hotColWidths)
    let newHotColWidths = hotColWidths.map(i=> {return i*tableRatio.value })
    hotSettings.value.colWidths = hotColWidths.length<10?  newHotColWidths :hotColWidths;
    getTBData();
  });
}

function calculateSum(arr) {
  return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}


//计算表格总宽度 的比例
const tableRatio = ref(0);
function getTableRatio(data) {
  try {
    let tableWidthOffsetSum = window.innerWidth - 170;
    let sum = calculateSum(data)
    tableRatio.value = (tableWidthOffsetSum / sum).toFixed(2);
  } catch (error) {
    console.log("tableRatio", tableRatio.value);
  }
}

// filter hotColumns
function sethotColumns(showColumns) {
  let ALIGN = { center: "htCenter", left: "htLeft", right: "htRight" };
  let newShowColumns = showColumns.map((i) => {
    let ac = {
      readOnly: i.ISEDIT != 1,
      type: "text",
      data: i.FIELD,
      className: ALIGN[i.ALIGN] || "htRight", // htLeft,htCenter,htRight,htJustify
    };

    switch (i.CONTROLS) {
      case "ExTextBox":
        ac.type = "text";
        break;
      case "ExNumber":
        ac.type = "numeric";
        break;
      case "ExSelect":
        ac.renderer = getDictByCell;
        ac.editor = "select";
        ac.selectOptions = getDictOption(i.FIELD);
        break;
      case "ExTime":
        ac.type = "time";
        ac.timeFormat = "HH:mm:ss";
        ac.correctFormat = true;
        break;
      case "ExDateTime":
        ac.type = "date";
        ac.dateFormat = "YYYY-MM-DD hh:mm:ss";
        ac.datePickerConfig = {
          firstDay: 0,
          showWeekNumber: false,
          i18n: {
            previousMonth: "Previous Month",
            nextMonth: "Next Month",
            months: [
              "一月",
              "二月",
              "三月",
              "四月",
              "五月",
              "六月",
              "七月",
              "八月",
              "九月",
              "十月",
              "十一月",
              "十二月",
            ],
            weekdays: ["日", "一", "二", "三", "四", "五", "六"],
            weekdaysShort: ["日", "一", "二", "三", "四", "五", "六"],
          },
        };
        break;

      // ExDateTime ExNumber date  ExTime

      default:
        break;
    }

    return ac;
  });

  return newShowColumns;
}

function collapseEvent() {
  showMoreQuery.value = !showMoreQuery.value;
  wareHeight.value = window.innerHeight - (showMoreQuery.value ? 300 : 270);
}

// 表格中的字典解析
function getDictByCell(instance, td, row, col, prop, value, cellProperties) {
  let newVal = EnumData[prop]
    ? proxy.selectDictLabel(EnumData[prop], value)
    : "异常";
  td.classList.add("htCenter");
  td.innerHTML = newVal;
}

// 列表中下拉选择的数据

function getDictOption(prop) {
  let newVal = EnumData[prop];
  let emptyObj = {};
  newVal.forEach((i) => {
    emptyObj[i.VALUE] = i.LABEL;
  });
  return emptyObj;
}

// 获取查询接口
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

// 获取新增接口

function getUrl2type(data, t) {
  let btn = data.filter((i) => {
    return i.ACTION == t;
  });
  return btn.length ? btn[0].ACTIONADDRESS : "";
}

// 右键新增行时 生成主键
function addRow(e) {
  let data = {};
  data.MODULEID = routerParams.BILLNO;
  data.PAGEID = routerParams.ACTION;
  axiosSave(addUrl.value, data).then((newRes) => {
    hotSettings.value.data[e] = newRes.RESULT;
  });
}
// 删除行
function deleteRow(BI, i, n, type = "删除", url) {
  ElMessageBox.confirm(`您确定要${type}已选中的${n}数据吗?`, "确认提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    let data = { data: BI };
    data.MODULEID = routerParams.BILLNO;
    data.PAGEID = routerParams.ACTION;
    axiosSave(url, data).then((newRes) => {
      getTBData();
    });
  });
}

// 加载表格数据
function getTBData() {
  let newPageID = routerParams.ACTION,
    PARENTPAGE = routerParams.ACTION;

  pageLoading.value = true;

  let urlParams = getUrlParams(queryUrl.value);
  let data = {
    ...queryJson.value,
    ...urlParams,
    PAGENUM: pageInfo.currentPage,
    PAGESIZE: pageInfo.pageSize,
    SORTNAME: pageInfo.sortName,
    REVERSE: pageInfo.sortOrder,
    MODULEID: routerParams.BILLNO,
    PAGEID: newPageID,
    PARENTPAGE: PARENTPAGE,
  };
  delete data.createTime;
  showHottable.value = false;
  getTableData(queryUrl.value, data)
    .then((res) => {
      let { TOTAL, RECORDS, TOTALDATA } = res.RESULT;
      tableData.value = RECORDS;
      hotSettings.value.data = RECORDS;
      showHottable.value = true;
      pageInfo.totalResult = TOTAL;
      currentData.value = [];
      // hotSettings.value.maxRows = RECORDS.length;

      pageLoading.value = false;
    })
    .catch((errr) => {
      tableCFG.loading = false;
      tableCFG.hasEmpty = true;
    });
}

// 保存修改后的数据数据
function submitData(data) {
  data.MODULEID = routerParams.BILLNO;
  data.PAGEID = routerParams.ACTION;
  axiosSave(editUrl.value, data).then((newRes) => {
    console.log("success", newRes);
  });
}

// 处理表格常用按钮
function resetTableBtn(data) {
  if (!Array.isArray(data)) return [];
  let showData = [],
    CYBTN = [];
  data.forEach((i) => {
    if (i.ISSHOW > 0 && i.VTYPE != "20") {
      if (i.ISOFTEN == 1) {
        CYBTN.push(i);
      } else {
        showData.push(i);
      }
    }
    // 如果属于分组
    if (i.CHILDREN.length) {
      CYBTN.push(i);
    }
  });
  topButton.value = [...CYBTN, ...showData];
}

function handelEvent({ data, row }) {
  // let newSelect = hotTableComponent.value.getSelected();
  console.log(999, data);
  let btn = data;
  let selectRecords = [];
  pageConfig.activeBtn = data;
  // 表格内的按钮事件,先清空已选中的数据
  if (row) {
    selectRecords = [row];
    currentData.value = row;
  } else {
    selectRecords = currentData.value;
  }
  // console.log(data);
  if (data.RATIO) {
    let WWHH =
      data.RATIO != 1 ? data.RATIO.split("*") : data.PAGEPATH.split("*");
    pageConfig.modalW = WWHH[0];
    pageConfig.modalH = WWHH[1];
  } else {
    pageConfig.modalW = "70%";
    pageConfig.modalH = "60%";
  }

  // 打开弹窗
  if (data.VTYPE == 2 || data.VTYPE == 20 || data.VTYPE == 1) {
    pageConfig.modelTitle = data.VNAME || "提示";
    formConfig.formType = data.ACTION || "";
    formModalTableCFG.value.MODULE = data?.PK_MODULE;
    formModalTableCFG.value.PAGE = data?.PK_PAGE;
    formModalTableCFG.value.tableBillNo = row?.BILLNO;
    getOnlyPageConfig(data.CHOOSE2SUB).then(() => {
      if (data.VTYPE == 1) {
        visibleFormPage.value = true;
      } else {
        pageConfig.modalVisible = true;
      }
      if (MasterFormRef.value) MasterFormRef.value.resetForm();
    }); // 获取独立的配置
  }

  if (btn.VTYPE == 3) {
    let BI = currentData.value.map((i) => {
      return i.BILLNO;
    });
    // deleteRow(BI, 0, currentData.value.length, btn.NMAE, btn.ACTIONADDRESS);
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
      submitByBtn(data, dataChoose);
    }
  } else if (data.VTYPE == 13) {
    let chooseData = currentData.value
      ? currentData.value.map((i) => i.BILLNO).join(",")
      : "";
    let aaDown = {
      APPID: "",
      // DATA: data.ISTWOSURE == 1 ? { BILLNO: currentData.value[0].BILLNO , ...queryJson.value } : {},
      DATA: { CHOOSEBILLNO: chooseData, ...queryJson.value },
      KEY: "",
      MODULEID: routerParams.BILLNO,
      PAGEID: data.PK_PAGE,
      VERSION: "",
    };
    handleExport(data.ACTIONADDRESS, aaDown);
  }
  //表格弹窗
  if (data.VTYPE == 7 && data.ACTION == "QRY") {
    const [val1, val2] = data.ACTIONADDRESS.split(",");
    formModalTableCFG.value.PAGE = val2;
    formModalTableCFG.value.MODULE = val1;
    // formModalTableCFG.value.tableBillNo = currentData.value[currentData.value.length - 1].billno;
    formModalTableCFG.value.ListtableData =
      data.ISCHOOSE == 0 ? [] : currentData.value[currentData.value.length - 1];
    pageConfig.modelTitle = data.VNAME || "提示";
    tableShowCGF.value = true;
  }
  // 文件路径下载
  if (data.VTYPE == 15) {
    downFilesByUrl(data);
  }

  // 文件预览
  if (data.VTYPE == 25) {
    previewFilesByUrl(data);
  }
}

function TbaBtnData(data) {
  TabModelConfig.buttonList = data;
}
function btnModelSelectData(data) {
  TabModelConfig.tabValue = data;
}

function handleExport(url, data) {
  proxy.download(url, { ...data }, "");
}

// 分页点击
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  getTBData();
}

//表格弹窗中底部按钮
function TabtnEvent(data) {
  if (data.VTYPE == 3) {
    let dataChoose = null;
    //  选中数据并提交
    if (data.ISCHOOSE == 1) {
      // 需要选中数据，如果需要选中数据
      dataChoose = TabModelConfig.tabValue;
    } else if (data.ISCHOOSE == 2) {
      dataChoose = TabModelConfig.tabValue;
    }
    if (data.ISTWOSURE == 1) {
      needConfirm(data, dataChoose);
    } else {
      submitByBtn(data, dataChoose);
    }
  }
}

// 通过地址下载文件
function downFilesByUrl(data) {
  let BILLNO = "",
    PK_PARENT_MENU_ID = "",
    PROJECTID = "",
    FILEID = "";

  // console.log("currentData", currentData.value);
  if (currentData.value.length && Array.isArray(currentData.value)) {
    BILLNO = currentData.value
      .map((i) => {
        return i.BILLNO;
      })
      .join(",");

    if (data.OTHER && data.OTHER.includes("FILEID")) {
      try {
        let pp = JSON.parse(data.OTHER);
        FILEID = currentData.value
          .map((i) => {
            return i[pp.FILEID];
          })
          .join(",");
        PK_PARENT_MENU_ID = pp.PK_PARENT_MENU_ID || "";
        PROJECTID = currentData.value[0][pp.PROJECTID] || "";
      } catch (error) {
        console.error("获取文件id失败");
      }
    }
  } else {
    BILLNO = currentData.value.BILLNO;
    if (data.OTHER && data.OTHER.includes("FILEID")) {
      try {
        let pp = JSON.parse(data.OTHER);
        FILEID = currentData.value[pp.FILEID];
        PROJECTID = currentData.value[pp.PROJECTID] || "";
        PK_PARENT_MENU_ID = pp.PK_PARENT_MENU_ID || "";
      } catch (error) {
        console.error("获取文件id失败");
      }
    }
  }

  let newdata = {
    FILEID,
    PROJECTID,
    PK_PARENT_MENU_ID,
    PK_CLASS: BILLNO,
    PK_ORG: BILLNO,
    PK_BILLNO: BILLNO,
    BILLNO: BILLNO,
    MODULEID: routerParams.BILLNO,
    PAGEID: pageConfig.activeBtn.PK_PAGE,
  };

  let getFileParmas = {
    APPID: "",
    DATA: newdata,
    KEY: "",
    MODULEID: routerParams.BILLNO,
    PAGEID: pageConfig.activeBtn.PK_PAGE,
    VERSION: "",
  };

  if (data.OTHER && data.OTHER.includes("FILEID")) {
    handleExport(data.ACTIONADDRESS, getFileParmas);
    return;
  }

  // console.log(888, newdata);
  axiosSave(data.ACTIONADDRESS, newdata).then((res) => {
    let url = res.RESULT.URL,
      filename = res.RESULT.VNAME,
      regex = /\.(jpg|jpeg|png|gif)$/i;
    if (url.includes(".pdf") || regex.test(url)) {
      const x = new XMLHttpRequest();
      x.open("GET", url, true);
      x.responseType = "blob";
      x.onload = (e) => {
        const url = window.URL.createObjectURL(x.response);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      };
      x.send();
    } else {
      let a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "");
      a.setAttribute("target", "_blank");
      let clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent("click", true, true);
      a.dispatchEvent(clickEvent);
    }
  });
}

// 处理表单里面的按钮
function resetFormBtn(BUTTON) {
  const PAGEACTION = pageConfig.activeBtn.ACTION;
  if (BUTTON.length) {
    return BUTTON;
  }
  return [
    {
      ...pageConfig.activeBtn,
      ACTIONADDRESS: pageConfig.activeBtn.ACTIONADDRESS,
      VNAME: "保存",
      BILLNO: "999",
      ACTION: "ADD",
    },
  ];
}

function getDetail(formurl) {
  if (!detailBtnCFG && !URL) {
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
    try {
      URL = formurl || detailBtnCFG.value.ACTIONADDRESS;
      Bid = Array.isArray(currentData.value)
        ? currentData.value[0].BILLNO
        : currentData.value.BILLNO;
      // 如果选择的是多条数据，而且按钮是多选类型时
      if (Array.isArray(currentData.value)) {
        Bid =
          pageConfig.activeBtn.ISCHOOSE == 2
            ? currentData.value
                .map((i) => {
                  return i.BILLNO;
                })
                .join(",")
            : currentData.value[0].BILLNO;
      } else {
        Bid = currentData.value.BILLNO;
      }
    } catch (error) {
      // console.log(treeNode.value);
      Bid = treeNode.value ? treeNode.value?.VALUE : "";
    }
  }
  if (URL == "BYCOLUMN") {
    let newFormValue = Array.isArray(currentData.value)
      ? currentData.value[0]
      : currentData.value;
    formConfig.formValue = Object.assign(formConfig.formValue, newFormValue);
    formConfig.showDetail = true;
    return;
  }
  PK_PAGE = pageConfig.activeBtn.PK_PAGE;
  let data = {
    BILLNO: Bid,
    PK_CLASS: Bid,
    TREE_BILLNO: treeNode.value?.VALUE || "",
    MODULEID: routerParams.BILLNO,
    PAGEID: PK_PAGE,
  };
  if (URL && URL.includes("?")) {
    let queryParams = getUrlParams(URL);
    data = Object.assign(queryParams, data);
  }

  queryDetailParams.value = data;
  axiosSave(URL, data).then((newRes) => {
    let res = newRes.RESULT;
    if (SubTableConfig.value.length > 0) {
      for (let i = 0; i < SubTableConfig.value.length; i++) {
        const el = SubTableConfig.value[i];
        let { FIELD, COLUMNS } = el;
        if (res[FIELD] && res[FIELD].length > 0) continue;
        let isEdit =
          formConfig.formColumns.find((el) => el.FIELD == FIELD).ISDISABLED !=
          1;
        if (!isEdit) continue;
        let rowData = getFormValue(COLUMNS);
        delete rowData.EnumData;
        res[FIELD] = [{ ...rowData }];
      }
    }

    formConfig.formValue = Object.assign(formConfig.formValue, res);
    formConfig.showDetail = true;
    pageConfig.modalVisible = true;
  });
}

const handleFileDown = (file) => {
  downFile({
    APPID: "",
    DATA: {
      FILEID: file.BILLNO,
      PK_PARENT_MENU_ID: "",
      PROJECTID: formConfig.formValue?.VBILLCODE || currentData.value?.YBILLNO,
      FILENAME: file.FILENAME,
    },
    KEY: "",
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
    VERSION: "",
  });
};

function previewFilesByUrl(data) {
  let FILEID,
    PK_PARENT_MENU_ID,
    PROJECTID,
    NAMEID = userStore.userInfo.BILLNO;
  if (data.OTHER && data.OTHER.includes("FILEID")) {
    try {
      let pp = JSON.parse(data.OTHER);
      if (currentData.value.length && Array.isArray(currentData.value)) {
        FILEID = currentData.value[0][pp.FILEID];
        PROJECTID = currentData.value[0][pp.PROJECTID] || "";
      } else {
        FILEID = currentData.value[pp.FILEID];
        PROJECTID = currentData.value[pp.PROJECTID] || "";
      }
      PK_PARENT_MENU_ID = pp.PK_PARENT_MENU_ID || "";
    } catch (error) {
      console.error("获取文件id失败");
    }
  }
  let ffid = `FILEID=FD${uuid()}${FILEID}&PK_PARENT_MENU_ID=${PK_PARENT_MENU_ID}&PROJECTID=${PROJECTID}&NAMEID=${NAMEID}&NAME=${
    userStore.userInfo.VNAME
  }`;
  let filePath = data.ACTIONADDRESS + "?" + ffid;
  window.open(filePath, "_blank");

  // let FILEID,
  //   PK_PARENT_MENU_ID,
  //   PROJECTID,
  //   NAMEID = userStore.userInfo.BILLNO;
  // if (data.OTHER && data.OTHER.includes("FILEID")) {
  //   try {
  //     let pp = JSON.parse(data.OTHER);
  //     if (currentData.value.length && Array.isArray(currentData.value)) {
  //       FILEID = currentData.value[0][pp.FILEID];
  //       PROJECTID = currentData.value[0][pp.PROJECTID] || "";
  //     } else {
  //       FILEID = currentData.value[pp.FILEID];
  //       PROJECTID = currentData.value[pp.PROJECTID] || "";
  //     }
  //     PK_PARENT_MENU_ID = pp.PK_PARENT_MENU_ID || "";
  //   } catch (error) {
  //     console.error("获取文件id失败");
  //   }
  //   let ffid = `FILEID=FD${uuid()}${FILEID}&PK_PARENT_MENU_ID=${PK_PARENT_MENU_ID}&PROJECTID=${PROJECTID}&NAMEID=${NAMEID}&NAME=${
  //     userStore.userInfo.VNAME
  //   }`;
  //   let filePath = data.ACTIONADDRESS + "?" + ffid;
  //   window.open(filePath, "_blank");
  // } else if (data.OTHER && data.OTHER.includes("FILEURLID")) {
  //   try {
  //     let pp = JSON.parse(data.OTHER);
  //     if (currentData.value.length && Array.isArray(currentData.value)) {
  //       FILEID = currentData.value[0][pp.FILEURLID];
  //     } else {
  //       FILEID = currentData.value[pp.FILEURLID];
  //     }
  //   } catch (error) {
  //     console.error("获取文件id失败");
  //   }

  //   let filePath = FILEID;
  //   window.open(filePath, "_blank");
  // }
}

function openLinkByUrl(data) {
  let BILLNO = "";
  if (currentData.value.length && Array.isArray(currentData.value)) {
    BILLNO = currentData.value
      .map((i) => {
        return i.BILLNO;
      })
      .join(",");
  } else {
    BILLNO = currentData.value.BILLNO;
  }

  let newdata = {
    PK_CLASS: BILLNO,
    PK_ORG: BILLNO,
    PK_BILLNO: BILLNO,
    BILLNO: BILLNO,
    MODULEID: routerParams.BILLNO,
    PAGEID: pageConfig.activeBtn.PK_PAGE,
  };
  axiosSave(data.ACTIONADDRESS, newdata).then((res) => {
    let { RESULT } = res;
    let filePath = RESULT.URL;
    filePath = filePath.includes("http")
      ? filePath
      : "http://121.37.86.183:8002/" + filePath;
    window.open(filePath, "_blank");
  });
}

function backEvent() {
  treeKeyword.value = "";
  visibleFormPage.value = false;
  formConfig.showDetail = false;
  formConfig.formValue = {};
  currentData.value = [];
}

// 获取独立的配置  比如弹窗中的表单
function getOnlyPageConfig(CHOOSE2SUB = "", btnType) {
  return new Promise((resolve) => {
    let pageID = {};
    if (btnType == 17) {
      pageID = {
        MODULEID: MBConfig.MODULEID,
        PAGEID: MBConfig.PAGEID,
      };
    } else {
      pageID = {
        MODULEID: routerParams.BILLNO,
        PAGEID: pageConfig.activeBtn.PK_PAGE,
      };
    }
    formModalTableCFG.value.MODULE = routerParams.BILLNO;
    formModalTableCFG.value.PAGE = pageConfig.activeBtn.PK_PAGE;
    formConfig.showDetail = false;
    getPageConfig(pageID).then((res) => {
      const { QUERY, COLUMNS, SUBTABLE, FLOATCOM, BUTTON, SLOTCFG, VDEF2 } =
        res.RESULT;
      if (btnType == 17)
        COLUMNS.unshift({
          SORTCODE: 1,
          FIELD: "TEMPVNAME",
          LABEL: "配置模板",
          COL: 6,
          CONTROLS: "ExTextBox",
          ISREQUIRE: 1,
          ISSHOW: 1,
        });
      formConfig.formColumns = COLUMNS;
      formConfig.buttonList = resetFormBtn(BUTTON);
      formConfig.formBase = getFormValue(COLUMNS);
      otherCFG.value.labelWidth = VDEF2 ? VDEF2 + "px" : null;
      otherCFG.value.GRID = res.RESULT.GRID;
      if (CHOOSE2SUB) {
        formConfig.formBase[CHOOSE2SUB] = currentData.value;
      }
      formConfig.formValue = JSON.parse(JSON.stringify(formConfig.formBase));
      formConfig.formRules = getFormRule(COLUMNS);
      SubTableConfig.value = SUBTABLE.map((el) => {
        el._rowConfig = COLUMNS.find((al) => al.FIELD == el.FIELD);
        return el;
      });
      infoConfig.value = !FLOATCOM
        ? []
        : FLOATCOM.map((el) => {
            el._rowConfig = COLUMNS.find((al) => al.FIELD == el.FIELD);
            return el;
          });

      // 特殊处理地区赋值问题，
      let areaCFG = COLUMNS.filter((i) => {
        return i.CONTROLS == "ExArea";
      });

      let setValByZtree = COLUMNS.filter((i) =>
        i.DEFAULTVAL?.includes("TREE|")
      );
      if (setValByZtree.length && treeNode.value) {
        setValByZtree.forEach((i) => {
          let setParams = getUrlParams(i.DEFAULTVAL.replace("TREE|", "?"));
          for (let i in setParams) {
            formConfig.formValue[i] = treeNode.value[setParams[i]];
          }
        });
      }
      // 把选中的左侧树如果是区域，且不符合格式时删除
      if (areaCFG.length) {
        let areaID = areaCFG[0].FIELD;
        if (formConfig.formValue[areaID].split(",").length < 3) {
          formConfig.formValue[areaID] = "";
        }
      }
      // console.log('treeNode.value', treeNode.value , formConfig.formValue);

      if (SUBTABLE.length > 0 && !CHOOSE2SUB) setSubTableData();
      if (formConfig.formType == "DTL" || formConfig.formType == "EDIT") {
        formConfig.showDetail = false;
        getDetail(SLOTCFG);
      } else {
        formConfig.showDetail = true;
      }
    });

    resolve();
  });
}

function set24col(data, n) {
  let newdata = deepClone(data);
  let data2 = newdata.filter((i) => {
    // i.COL = n == 24 ? n : i.COL || 4;
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
    data2 = newdata.slice(4);
  }
  return data2;
}

// 关闭弹窗
function closeModal() {
  if (MasterFormRef.value) MasterFormRef.value.resetForm();
  pageConfig.modalVisible = false;
  // reportCGF.value = false;
  tableShowCGF.value = false;
  currentData.value = [];

  tableData.value = [];
  subTableList.subTableData = [];
  getTBData();
  // VTableRef.value.clearCheckRow();
}

//  弹窗表单提交事件
const formSubmit = () => {
  MasterFormRef.value.submitForm().then((valid) => {
    if (!valid) return;
    let newData = null;
    if (treeNode.value && treeNode.value.VALUE) {
      formConfig.formValue.PK_CLASS = treeNode.value.VALUE;
    }
    submitEvent(pageConfig.activeBtn.ACTIONADDRESS, formConfig.formValue);
  });
};

// 页面中表单的顶部按钮事件
const formBtnEvent = (e) => {
  if (e.ACTION == "ADD" || e.ACTION == "EDIT") {
    pageConfig.activeBtn = e;
    formSubmit();
  } else if (e.ACTION == "PRINT") {
    let aa = {
      APPID: "",
      DATA: { BILLNO: formConfig.formValue.BILLNO },
      KEY: "",
      MODULEID: queryDetailParams.value.MODULEID,
      PAGEID: queryDetailParams.value.PAGEID,
      VERSION: "",
    };
    //  文件流下载
    if (e.VTYPE == 13) {
      handleExport(e.ACTIONADDRESS, aa);
    }
    if (e.VTYPE == 15) {
      downFilesByUrl(e);
    }
  }
};

const setSubTableData = () => {
  let rules = [];
  for (let i = 0; i < SubTableConfig.value.length; i++) {
    const el = SubTableConfig.value[i];
    let { COLUMNS, FIELD, GROUPNO } = el;
    let baseData = getFormValue(COLUMNS),
      baseTSData = getFormValue(COLUMNS, "TS"); // 含 同上 数据
    delete baseData.EnumData;
    formConfig.formValue[FIELD] =
      GROUPNO === "TAB"
        ? [
            { ...baseData },
            { ...baseData },
            { ...baseData },
            { ...baseData },
            { ...baseData },
          ]
        : { ...baseData };
    let rule = getFormRule(COLUMNS);
    rules.push(rule);
  }
  SubTableRules.value = rules;
};

function needConfirm(data, selectRecords) {
  ElMessageBox.confirm(`您确定要将该单据${data.VNAME}吗?`, "确认提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    submitByBtn(data, selectRecords);
  });
}

function submitByBtn(btn, data) {
  pageLoading.value = true; // 进入加载中

  let params = btn.ACTIONADDRESS.includes("?")
      ? getUrlParams(btn.ACTIONADDRESS)
      : {},
    sdata = null;
  if (btn.ACTION == "DELETE" || btn.ISCHOOSE == 2) {
    let arr = [];
    if (btn.VTYPE == 20) {
      arr.push(treeNode.value.VALUE);
    } else {
      arr = currentData.value.map((i) => {
        return i.BILLNO;
      });
    }
    sdata = { data: arr };
  } else {
    sdata = { ...data, ...params };
  }

  if (btn.ACTION == "ALLSUBMIT") {
    sdata = { DATA: hotSettings.value.data, QUERY: queryJson.value };
  }

  submitEvent(btn.ACTIONADDRESS, sdata);
}

function submitEvent(URL, sdata) {
  // mbType
  let saveData;
  if (mbType.value) {
    delete sdata.EnumData;
    saveData = {
      DEFAULTVALUE: sdata,
      BILLNO: MBTableBillNo.value,
      PKBILLNO: queryJson.value.PK_CLASS,
      MODULEID: formModalTableCFG.MODULE,
      PAGEID: formModalTableCFG.PAGEID,
    };
  } else {
    saveData = {
      ...sdata,
      MODULEID: routerParams.BILLNO,
      PAGEID: pageConfig.activeBtn.PK_PAGE || routerParams.ACTION,
    };
  }
  axiosSave(URL, saveData)
    .then((res) => {
      pageLoading.value = false; // 进入加载中

      ElMessage({
        message: res.MESSAGE,
        type: "success",
      });
      setTimeout(() => {
        // 保存后不关闭
        if (pageConfig.activeBtn.VTYPE == 28) {
          return "";
        }

        if (pageConfig.modalVisible) {
          closeModal();
        }
        if (visibleFormPage.value) {
          visibleFormPage.value = false;
        }
        if (hasTree.value && treeQueryUrl) {
          getTreeData();
        }
        if (res.STATUS == 200 && pageConfig.activeBtn.PAGEPATH?.includes("$")) {
          let Url = pageConfig.activeBtn.PAGEPATH.replace("$", "");
          router.push({
            path: Url,
          });
        }
        currentData.value = [];
        colDrawer.value = false;
        tableData.value = [];
        subTableList.subTableData = [];
        getTBData();
      }, 1000);
    })
    .finally(() => {
      pageLoading.value = false; // 进入加载中
      modalRef.value != null && modalRef.value.getTBData();
    });
}

const SELECTED_CLASS = "selected";
const ODD_ROW_CLASS = "odd";

// 给表格追加行类名
function addClassesToRows(TD, row, column, prop, value, cellProperties) {
  // Adding classes to `TR` just while rendering first visible `TD` element

  // if (column !== 0) {
  //   return;
  // }

  const parentElement = TD.parentElement;

  // if (parentElement === null) {
  //   return;
  // }

  // // Add class to selected rows
  // if (cellProperties.instance.getDataAtRowProp(row, "0")) {
  //   Handsontable.dom.addClass(parentElement, SELECTED_CLASS);
  // } else {
  //   Handsontable.dom.removeClass(parentElement, SELECTED_CLASS);
  // }

  // Add class to odd TRs

  if (row % 2 === 0) {
    Handsontable.dom.addClass(parentElement, ODD_ROW_CLASS);
  } else {
    Handsontable.dom.removeClass(parentElement, ODD_ROW_CLASS);
  }
}

getPageCFG();
</script>

<style lang="scss" scoped>
.gantt-warp {
  width: 100%;
  .query-wrap {
    padding: 8px;
    background-color: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    :deep(.el-form--inline .el-form-item) {
      margin-bottom: 6px !important;
    }
  }
}

.gantt-warp {
  :deep(.el-form-item.el-form-item--small) {
    margin-bottom: 6px !important;
  }
}

.grid-wrap {
  display: grid;
  grid-template-columns: repeat(5, 50px);
  grid-template-rows: repeat(5, 50px);
  grid-gap: 10px;
  .grid-item {
    text-align: center;
    line-height: 50px;
    cursor: pointer;
    font-size: 8px;
  }
}

.sontable-wrap {
  background: white;
  padding: 10px;
  border-radius: 4px;
  .sontable-btn {
    margin-bottom: 10px;
  }
}

.color-desc-wrap {
  line-height: 40px;
  margin-top: 20px;
  justify-content: space-around;
  .color-box {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
}

:deep(.handsontable .odd td) {
  background: #edf3fd !important;
}
</style>
