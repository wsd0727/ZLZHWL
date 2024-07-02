<template>
  <div class="app-wrap">
    <div class="app-table-box">
      <div class="app-table-box-right" style="width: 100px">
        <div class="query-wrap">
          <Form class="query-form" ref="formRefTop" v-model:formData="queryParams" :formConfig="set24col(queryConfig, 4)" :inline="true" @select="formSelect" @enter="queryData" />
          <div class="flex-row-end">
            <el-button @click="queryData" type="primary" size="Default">查找</el-button>
            <el-button @click="queryDrawer = true;" size="Default">高级</el-button>
          </div>
        </div>
        <div class="bg-white position-r">
          <div class="tool-wrap">
            <div class="tool-wrap-left">
              <Button :topButton="buttonConfig" :currentData="currentData" @handelEvent="handelEvent" />
            </div>
          </div>
          <Vtable ref="VTableRef" :tableCFG="tableCFG" :tableData="dataList" :totalData="totalData" @change="tableChange">
          </Vtable>
          <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50, 100]" :current-page="pageInfo.currentPage" :total="total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange" />
        </div>

        <!-- 高级查询条件 -->
        <el-drawer v-model="queryDrawer" title="高级筛选">
          <Form ref="formRefRight" v-model:formData="queryParams" :formConfig="set24col(queryConfig, 24)" @select="formSelect" />
          <template #footer>
            <div style="flex: auto">
              <el-button @click="resetQuery" size="default">重置</el-button>
              <el-button type="primary" @click="queryData" size="default">查找</el-button>
            </div>
          </template>
        </el-drawer>

        <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="tableModal" resize storage transfer show-zoom show-footer @close="closeModal">
          <template #title>
            <span class="modal-title">{{ pageConfig.modelTitle }}</span>
          </template>
          <template #default>
            <Form ref="FormRef" :detail="formConfig.formType == 'DTL'" v-model:formData="formConfig.formValue" :formConfig="formConfig.formColumns" :rules="formConfig.formRules" :othConfig="{labelWidth:'80px'}">
              <template #TJSITEINFO="{data}">
                <div class="menuSelect" style="width:100%">
                  <el-input v-model="data.TJSITEINFO" disabled>
                    <template #append>
                      <el-button :icon="EditPen" @click="openMapModel(data.TJSITECODEINFO)" />
                    </template>
                  </el-input>
                </div>
              </template>
            </Form>
          </template>
          <template #footer>
            <el-space>
              <!-- <el-button  size="default" @click="closeModal"> 关闭 </el-button> -->
              <el-button v-if="formConfig.formType != 'DTL'" size="default" type="primary" @click="saveModal"> 保存 </el-button>
            </el-space>
          </template>
        </vxe-modal>

        <vxe-modal destroy-on-close v-model="pointShow" :width="pageConfig.modalW" :height="pageConfig.modalH" id="tableModal" resize storage transfer show-zoom show-footer @close="pointShow = false">
          <template #title>
            <span class="modal-title"> 途径点 </span>
          </template>
          <template #default>
            <ol class="pointForm">
              <li v-for="(item,index) in pointData" :key="index">
                <el-cascader v-model="item.code" placeholder="" size="default" :options="optionsRegion" style="width: 70%;margin-right:5px" @change="(val) => pointChange(index, val)" />
                <el-icon v-if="index>0" @click="delPoint(index)" :size="18" style="margin-right:5px">
                  <Delete />
                </el-icon>
                <el-icon v-if="index == pointData.length - 1" @click="addPoint" :size="18">
                  <Plus />
                </el-icon>
              </li>
            </ol>
          </template>
          <template #footer>
            <el-button size="default" type="primary" @click="savePoint"> 添加 </el-button>
          </template>
        </vxe-modal>

        <!-- 列配置 -->
        <el-drawer v-model="colDrawer" title="列配置" :size="500">
          <div class="col-wrap">
            <p>已显示字段</p>
            <draggable :list="tableCFG.tableColumns" ghost-class="ghost" :force-fallback="true" chosen-class="chosenClass" animation="300" @start="onStart" @end="onEnd">
              <template #item="{ element, index }">
                <el-tag closable effect="plain" class="col-tab" size="large" @close="closeTab(index)" v-if="element.SELECTEDFLAG == 1">
                  {{ element.LABEL }}
                </el-tag>
              </template>
            </draggable>
            <p style="margin-top: 20px">可选字段</p>
            <template v-for="(itemCol, index) in tableCFG.tableColumns" :key="itemCol.BILLNO">
              <el-tag effect="plain" class="col-tab" size="large" @close="closeTab(index)" v-if="itemCol.SELECTEDFLAG != 1">
                {{ itemCol.LABEL }}
                <el-icon @click="closeTab(index, 1)">
                  <Plus />
                </el-icon>
              </el-tag>
            </template>
          </div>

          <template #footer>
            <div style="flex: auto">
              <el-button @click="restBtn" size="default">重置</el-button>
              <el-button type="primary" @click="saveColConfig" size="default">保存</el-button>
            </div>
          </template>
        </el-drawer>

      </div>
    </div>
  </div>
</template>

<script setup>
import Vtable from "@/components/Tables";
import Button from "@/components/Tables/button.vue";
import Form from "@/components/Form";
import { EditPen } from "@element-plus/icons-vue";
import { getFormValue, deepClone, getShowCFG, getFormRule, getUrlParams, evilFn, uuid } from "@/utils";
import { getList, getDetail, saveAdd, saveEdit, updateStatus, setDel, Config_Btn, Config_Form, Config_Query, Config_Table,Config_TableZLZHWL } from "#/WZC/record"
import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();
const storeSettings = computed(() => settingsStore);

const systemConfig = computed(() => settingsStore.systemConfig);

const router = useRouter();
const routerParams = router.currentRoute.value.meta;

const queryConfig = Config_Query
const buttonConfig = Config_Btn

const FormRef = ref(null)

const pageConfig = reactive({
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

const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
});

const queryParams = ref({
  MODULEID: routerParams.BILLNO,
  PAGEID: "PG221024274156",
  PAGENUM: pageInfo.currentPage,
  PAGESIZE: pageInfo.pageSize,
  ...getFormValue(Config_Query)
})

function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  queryParams.value.PAGENUM = currentPage
  queryParams.value.PAGESIZE = pageSize
  getData();
}


const tableCFG = reactive({
  // tableColumns: getShowCFG(systemConfig.value?.systemCode == 'ZLZHWL'?Config_TableZLZHWL:Config_Table),
  tableColumns: getShowCFG(Config_Table),
  allColumns: [],
  hasTableTools: false, // 是否有操作栏
  hasSeq: false, // 是否显示序号
  hasCheck: true, // 是否需要多选图标
  toolsConfig: [],
  expandID: "",
  loading: false,
  hasFill: false, // 表格补位
  hasEmpty: false,
  height: window.innerHeight - 250,
  rowClassEval: "", // 行加背景色的条件
  mergeCFG: null, // 表尾合计的配置  字段
  mergeRowField: [], // 需要合并的字段
  treeID: null, // 树形表格 的可展开的节点id
  SelectType: "checkbox",
  tableButtons: ["ADD", "EDIT", "DELETE"],
  EtableRules: {},
  cellHeight: storeSettings.value.rowHeight, // 单元格的行高
});

const currentData = ref([])
const MBTableData = ref(null)
function tableChange(data) {
  MBTableData.value = data.data[0];
  if (data.clicktype == "checkbox") {
    currentData.value = data.data;
  } else if (data.clicktype == 'detail') {
    getDetail({
      BILLNO: data.data.BILLNO,
      MODULEID: routerParams.BILLNO,
      PAGEID: "PG221024545799"
    }).then(res => {
      pageConfig.modelTitle = "详情"
      formConfig.formColumns = Config_Form
      formConfig.formType = "DTL"
      formConfig.formBase = getFormValue(Config_Form);
      formConfig.formValue = { ...deepClone(formConfig.formBase), ...res.RESULT }
      formConfig.formValue.systemCode = systemConfig.value?.systemCode,

      pageConfig.modalVisible = true;
    })
  }
}

const formModalTableCFG = ref({
  MODULE: "",
  PAGE: "",
  tableBillNo: "",
  ListtableData: {},
});

function handelEvent({ data, row }) {
  let selectRecords = [];
  if (row) {
    selectRecords = [row];
    currentData.value = row;
  } else {
    selectRecords = currentData.value;
  }
  if (data.RATIO) {
    let WWHH = data.RATIO != 1 ? data.RATIO.split("*") : data.PAGEPATH.split("*");
    pageConfig.modalW = WWHH[0];
    pageConfig.modalH = WWHH[1];
  } else {
    pageConfig.modalW = "70%";
    pageConfig.modalH = "60%";
  }
  if (data.VTYPE == 2 || data.VTYPE == 20 || data.VTYPE == 1) {
    pageConfig.modelTitle = data.VNAME || "提示";
    formConfig.formType = data.ACTION || "";
    formModalTableCFG.value.MODULE = data?.PK_MODULE;
    formModalTableCFG.value.PAGE = data?.PK_PAGE;
    formModalTableCFG.value.tableBillNo = row?.BILLNO;
    formConfig.formColumns = Config_Form
    formConfig.formBase = getFormValue(Config_Form);
    formConfig.formValue = deepClone(formConfig.formBase)
    formConfig.formValue.systemCode = systemConfig.value?.systemCode,


    
    formConfig.formRules = getFormRule(Config_Form)
    if (data.ACTION == 'EDIT') {
      getDetail({
        BILLNO: selectRecords[0].BILLNO,
        MODULEID: routerParams.BILLNO,
        PAGEID: "PG221024545799"
      }).then(res => {
        formConfig.formValue = { ...deepClone(formConfig.formBase), ...res.RESULT }
        formConfig.formValue.systemCode = systemConfig.value?.systemCode,
        pageConfig.modalVisible = true;
      })
    } else {
      pageConfig.modalVisible = true;
    }
    if (FormRef.value) FormRef.value.resetForm();
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
      submitByBtn(data, dataChoose);
    }
  }
}

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
  data.MODULEID = routerParams.BILLNO
  data.PAGEID = "PG221024545799"
  if (btn.VNAME == '停用') {
    data.BILLSTATUS = "0"
    updateStatus("/base/bd-line/updateStatus?BILLSTATUS=0", data).then(res => {
      ElMessage({
        message: res.MESSAGE,
        type: "success",
      });
      queryData()
    })
  } else if (btn.VNAME == '删除') {
    let arr = currentData.value.map((i) => {
      return i.BILLNO;
    });
    setDel({
      MODULEID: routerParams.BILLNO,
      PAGEID: "PG221024274156",
      data: arr
    }).then(res => {
      ElMessage({
        message: res.MESSAGE,
        type: "success",
      });
      queryData()
    })
  } else {
    data.BILLSTATUS = "1"
    updateStatus("/base/bd-line/updateStatus?BILLSTATUS=1", data).then(res => {
      ElMessage({
        message: res.MESSAGE,
        type: "success",
      });
      queryData()
    })
  }
}

const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
  formType: "", // DTL ADD
  buttonList: [], // 表单中的按钮
  showDetail: false, // 是否显示表单 ， 初始时不显示，详情数据查询后显示
});

const queryDrawer = ref(false)
const resetQuery = () => {
  queryParams.value = deepClone(getFormValue(Config_Query));
  queryParams.value.PAGENUM = 1
  queryParams.value.MODULEID = routerParams.BILLNO
  queryParams.value.PAGEID = "PG221024274156"
}
const queryData = () => {
  queryParams.value.PAGENUM = 1
  getData()
}

const total = ref(0)
const totalData = ref(null)
const dataList = ref([])

const getData = () => {
  tableCFG.loading = true;
  queryDrawer.value = false;
  getList(queryParams.value).then(res => {
    let { TOTAL, RECORDS, TOTALDATA } = res.RESULT;
    dataList.value = RECORDS;
    totalData.value = TOTALDATA ? JSON.parse(TOTALDATA) : null;
    total.value = TOTAL;
    tableCFG.loading = false;
    tableCFG.hasEmpty = RECORDS.length ? false : true;
  }).catch(err => {
    tableCFG.loading = false;
    tableCFG.hasEmpty = true;
  });
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


const closeModal = () => {
  pageConfig.modalVisible = false
}

const saveModal = () => {
  FormRef.value.submitForm().then(valid => {
    if (!valid) return
    formConfig.formValue.MODULEID = routerParams.BILLNO
    formConfig.formValue.PAGEID = "PG221024781861"
    if (formConfig.formType == 'EDIT') {
      saveEdit(formConfig.formValue).then(res => {
        pageConfig.modalVisible = false
        ElMessage({
          message: res.MESSAGE,
          type: "success",
        });
        queryData()
      })
    } else {
      saveAdd(formConfig.formValue).then(res => {
        pageConfig.modalVisible = false
        ElMessage({
          message: res.MESSAGE,
          type: "success",
        });
        queryData()
      })
    }
  })
}

const formSelect = (res) => {
  if (res.query) {
    queryData();
  }
};

const pointShow = ref(false)
const pointData = ref([])
const optionsRegion = ref([]);
const getAreaData = import("/public/areadata.js").then(res => {
  optionsRegion.value = res.default;
});
const pointChange = (index, data) => {
  let [province, city, county] = data;
  let areaData = {
    data: data.join(","),
    province,
    provinceName: treeFind(optionsRegion.value, (al) => al.value == province).label,
    city,
    cityName: treeFind(optionsRegion.value, (al) => al.value == city).label,
    county,
    countyName: county != undefined ? treeFind(optionsRegion.value, (al) => al.value == county).label : undefined,
  };
  areaData.dataName = [areaData.provinceName, areaData.cityName == '市辖区' ? '' : areaData.cityName, areaData.countyName].join("")
  pointData.value[index].name = areaData.dataName
}
const addPoint = () => pointData.value.push({ name: "", code: [] })
const delPoint = index => pointData.value.splice(index, 1)
const savePoint = () => {
  let newArr = []
  for (let i = 0; i < pointData.value.length; i++) {
    const el = pointData.value[i];
    if (el.name && el.code) newArr.push(el)
  }
  if (newArr.length) {
    formConfig.formValue.TJSITECODEINFO = JSON.stringify(newArr)
    formConfig.formValue.TJSITEINFO = newArr.map(el => el.name).join("-")
    pointShow.value = false
  }
}
const openMapModel = (data) => {
  if (!data) {
    data = [{ name: "", code: [] }]
  } else {
    data = JSON.parse(data)
  }
  pointData.value = data
  pointShow.value = true
}
// 查找树结构中的数据
function treeFind(tree, func, found = { value: false }) {
  for (const data of tree) {
    if (func(data)) {
      found.value = true;
      return data;
    }
    if (data.CHILDREN || data.children) {
      const res = treeFind(data.CHILDREN || data.children, func, found);
      if (res) return res;
      if (found.value) found.value = false;
    }
  }
  return null;
}

queryData()
</script>
<style lang="scss" scoped>
:deep(.el-form--inline .el-form-item) {
  margin-bottom: 0px !important;
  width: 100%;
}

.app-table-box {
  display: flex;
  width: 100%;
  background-color: #fff;
  &-left {
    width: 200px;
    padding: 10px;
  }
  &-right {
    flex: 1;
    padding: 0 10px;
  }

  .query-wrap {
    padding: 8px;
    background-color: #fff;
    margin: 6px 0 !important;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .query-form {
      width: 100%;
    }
  }
  .bg-white {
    border-radius: 4px;
  }
  .tool-wrap {
    // padding-bottom: 8px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .tree-name {
      font-size: 14px;
      color: var(--el-color-primary);
      float: right;
      max-width: 260px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-right: 20px;
    }
    &-right {
      display: flex;
      padding-top: 10px;
    }
  }
  .page-fixe-bottom {
    position: fixed !important;
    z-index: 10;
    bottom: 10px;
    right: 30px !important;
    height: 34px !important;
  }
}
.pointForm li {
  display: flex;
  align-items: center;
  flex-basis: 10px;
  margin-bottom: 10px;
  &::marker {
    unicode-bidi: isolate !important;
    font-variant-numeric: tabular-nums !important;
    text-transform: none !important;
    text-indent: 0px !important;
    text-align: start !important;
    text-align-last: start !important;
  }
  :last-child {
    margin-bottom: 0;
  }
}
</style>