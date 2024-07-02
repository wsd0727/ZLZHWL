<template>
  <div class="app-wrap">
    <!-- 主子表界面 -->
    <div class="app-table-box" v-if="!visibleFormPage">
      <!-- 左侧树形结构模板 -->
      <div v-if="hasTree && pageConfig.treeExpand" class="app-table-box-left bg-white position-r">
        <div class="head-container">
          <el-input v-model="treeKeyword" placeholder="请输入关键字" clearable style="margin-bottom: 5px; margin-top: 2px">
          </el-input>
          <div class="menu-btn mb5">
            <el-button plain :icon="Plus" @click="treeBtnEvent(1)" v-if="treeButtonAuth.includes('ADD')"></el-button>
            <el-button plain :disabled="!treeNode" :icon="Edit" v-if="treeButtonAuth.includes('EDIT')" @click="treeBtnEvent(2)"></el-button>
            <el-button plain :icon="Delete" :disabled="!treeNode" v-if="treeButtonAuth.includes('DELETE')" @click="treeBtnEvent(3)"></el-button>
          </div>
        </div>
        <div class="head-container">
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

      <!-- 右侧表格主体模板 -->
      <div class="app-table-box-right" style="width: 100px">
        <!-- <div
          class="tree-expand-btn"
          @click="treeExpand"
          :style="{ left: pageConfig.treeExpand ? 0 : '9px' }"
          v-if="hasTree"
        >
          <el-icon :size="16">
            <ArrowLeft v-if="pageConfig.treeExpand" />
            <ArrowRight v-else />
          </el-icon>
        </div> -->

        <div class="query-wrap" v-if="queryConfig.length">
          <Form class="query-form" ref="formRefTop" v-model:formData="queryJson" :formConfig="set24col(queryConfig, 4)" :inline="true" @select="formSelect" @enter="enterEvent" />
          <div class="flex-row-end">
            <el-button @click="queryEvent" type="primary" size="Default">
              查找
            </el-button>
            <el-button @click="openQuery" size="Default"> 高级 </el-button>
          </div>
        </div>
        <div class="bg-white position-r">
          <div class="tool-wrap">
            <div class="tool-wrap-left">
              <Button :topButton="topButton" :currentData="currentData" @handelEvent="handelEvent" />
            </div>

            <div class="tool-wrap-right">
              <el-tooltip :content="treeNode?.LABEL">
                <span class="tree-name" v-if="hasTree && treeNode">
                  已选：{{ treeNode?.LABEL }}
                </span>
              </el-tooltip>
              <slot name="toolbar"></slot>
              <el-icon :size="14" style="margin-top: 2px" @click="openDrawer" class="mr10">
                <Setting />
              </el-icon>
            </div>
          </div>

          <!-- 主子表模板 -->
          <slot name="default" :data="pageConfig.tableData" :config="pageConfig">
            <template v-if="pageConfig.mainTable.length">
              <div class="main-tabs-wrap">
                <el-tabs :tab-position="tabPosition" class="demo-tabs" v-model="pageConfig.mainActive" @tab-click="handleMainTabsClick">
                  <el-tab-pane :label="item.VNAME" v-for="(item, index) in pageConfig.mainTable" :key="index" :name="index">
                  </el-tab-pane>
                </el-tabs>
                <div class="tabs-content">
                  <Vtable ref="VTableRef" :tableCFG="pageConfig.mainTableCFG[pageConfig.mainActive]" :tableData="pageConfig.tableData" :totalData="pageConfig.totalData" @change="tableChange">
                  </Vtable>
                </div>
              </div>
            </template>

            <template v-else>
              <Vtable ref="VTableRef" v-if="!pageConfig.batchTable" :tableCFG="tableCFG" :tableData="pageConfig.tableData" :totalData="pageConfig.totalData" @change="tableChange" @dragRow="dragTableRow">
                <template #expand>
                  <div v-if="expandCFG?.SLOT == 'expandTB'" class="expand-wrapper">
                    <Vtable :tableCFG="subTableList.subTableCol[0]" :tableData="subTableList.subTableData" :totalData="subTableList.totalData" :actionBar="
                        subTableList.subTableCol[0].buttons.length > 0
                      " @change="tableChangeExpand">
                      <template #actionBar="{ row }">
                        <el-row :gutter="5" justify="center">
                          <el-col :span="2.5" v-for="(itemB, indexB) in subTableList.subTableCol[0].buttons" :key="indexB">
                            <el-link :underline="false" :disabled="getButtonStatus(itemB, row)" @click.stop="
                                handelEvent({ data: itemB, row: row })
                              ">{{ itemB.VNAME }}</el-link>
                          </el-col>
                        </el-row>
                      </template>
                    </Vtable>
                  </div>
                  <div v-else>
                    <Form ref="formRefDetail" class="mt10" :formData="formConfig.formValue" :formConfig="formConfig.formColumns" :rules="formConfig.formRules" :detail="false" @select="formSelect" />
                    <div class="table-form-btn flex-row-cen">
                      <el-button type="primary" size="default" @click="formBtnEventByTable(itemB)" v-for="itemB in formConfig.buttonList" :key="itemB.BILLNO">
                        {{ itemB.VNAME }}
                      </el-button>
                    </div>
                  </div>
                </template>
              </Vtable>

              <Etable ref="ETableRef" v-model:tableData="tableData" v-else :tableCFG="tableCFG" :validRules="tableCFG.EtableRules" :actionBarWidth="90" @change="eTableChange" @headerClick="headerClick">
                <template #actionBar="{ row }">
                  <el-row :gutter="10" justify="center">
                    <el-col :span="1.5">
                      <el-link :icon="Plus" @click="plusRowData" />
                    </el-col>
                    <el-col :span="1.5">
                      <el-link :icon="Delete" @click="delConfig(row)" />
                    </el-col>
                    <!-- <el-col :span="1.5">
                    <el-link :icon="Notification" @click="editConfig(row)" />
                  </el-col> -->
                  </el-row>
                </template>
              </Etable>
            </template>

            <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50, 100]" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="[
                'Total',
                'PrevPage',
                'JumpNumber',
                'NextPage',
                'Sizes',
              ]" v-if="subTableList.subTableCol.length > 1 " @page-change="handlePageChange" />

            <div class="subtable-title" v-else>
              <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50, 100]" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="[
                  'Total',
                  'PrevPage',
                  'JumpNumber',
                  'NextPage',
                  'Sizes',
                ]" @page-change="handlePageChange" />
            </div>

            <!-- 子表模板 -->
            <template v-if="pageConfig.hasSubTable">
              <template v-if="subTableList.subTableCol.length == 1">
                <Vtable :tableCFG="subTableList.subTableCol[0]" :tableData="subTableList.subTableData" :totalData="subTableList.totalData" />
              </template>

              <div class="tabs-wrap" v-else>
                <el-tabs :tab-position="tabPosition" class="demo-tabs" v-model="subTableList.active" @tab-click="handleTabsClick">
                  <el-tab-pane :label="item.VNAME" v-for="(item, index) in subTableList.subTableCol" :key="index" :name="index" />
                </el-tabs>
                <div class="tabs-content" v-loading="loading">
                  <template v-if="
                      subTableList.subTableCol[subTableList.active].VCODE ==
                      'timeline'
                    ">
                    <InfoTimeLine :height="subTableList.height" :data="subTableList.subTableData" :config="subTableList.subTableCol[subTableList.active]" />
                  </template>
                  <template v-else>
                    <Vtable :tableCFG="subTableList.subTableCol[subTableList.active]" :tableData="subTableList.subTableData" :totalData="subTableList.totalData">
                    </Vtable>
                  </template>
                </div>
              </div>
              <!-- 子表分页 -->
              <vxe-pager size="mini" class-name="vxe-page-wrap" v-if="subPageInfo.isShow" :page-size="subPageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50]" :current-page="subPageInfo.currentPage" :total="subPageInfo.totalResult" :layouts="[
                  'Total',
                  'PrevPage',
                  'JumpNumber',
                  'NextPage',
                  'Sizes',
                ]" @page-change="handleSubPageChange">
              </vxe-pager>
            </template>
          </slot>
          <!-- <vxe-pager size="mini" class-name="vxe-page-wrap" v-if="pageConfig.pageShow && !subTableList.subTableCol.length" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50, 100]" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange" /> -->
        </div>
      </div>
    </div>

    <!-- 在当前页面中打开表单 -->
    <div :class="[
        'form-page-wrap',
        'position-r',
        formModalTableCFG.PAGE == 'slot' ? '' : 'formPage',
      ]" v-else>
      <el-scrollbar class="" v-loading="pageLoading">
        <div class="form-title">
          <div class="form-title-left">
            <span class="text-muted" @click="backEvent">
              <el-icon :size="24">
                <Back />
              </el-icon>
              <el-divider direction="vertical" />
            </span>
            {{ pageConfig.pageTitle
            }}{{
              pageConfig.modelTitle == pageConfig.pageTitle
                ? ""
                : pageConfig.modelTitle
            }}
          </div>
          <div class="form-title-btn">
            <div id="custemPageBtn" v-if="
                formModalTableCFG.PAGE == 'slot' ||
                formModalTableCFG.TYPE == 'STEP'
              "></div>
            <template v-else>
              <template v-for="itemB in formConfig.buttonList" :key="itemB.BILLNO">
                <el-button type="primary" size="default" @click="formBtnEvent(itemB)" v-if="setShowBtn(itemB)">
                  {{ itemB.VNAME }}
                </el-button>
              </template>
            </template>
          </div>
        </div>
        <!-- v-if="formConfig.showDetail" -->
        <div class="form-page-content mt20">
          <template v-if="formModalTableCFG.PAGE == 'slot'">
            <slotCustemPage :currentData="currentData" @close="closeCustemPage" />
          </template>
          <template v-else-if="formModalTableCFG.TYPE == 'STEP'">
            <StepForm :config="pageConfig.activeBtn" :currentData="currentData" @close="closeCustemPage" />
          </template>
          <template v-else>
            <MasterForm ref="MasterFormRef" :loading="!formConfig.showDetail" v-model:formData="formConfig.formValue" :formConfig="formConfig.formColumns" :tableConfig="SubTableConfig" :formRules="formConfig.formRules" :tableRules="SubTableRules" :detail="formConfig.formType == 'DTL'" @select="formSelect" :MODULE="formModalTableCFG.MODULE" :PAGE="formModalTableCFG.PAGE" :othTabCFG="ETableCFG" :othConfig="otherCFG" :infoConfig="infoConfig" :tableBillNo="formModalTableCFG.tableBillNo" />
          </template>
        </div>
      </el-scrollbar>
    </div>

    <!-- 公共弹窗表单模块 -->
    <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer @close="closeModal">
      <template #title>
        <span class="modal-title">{{ pageConfig.pageTitle }}{{ pageConfig.modelTitle }}</span>
      </template>
      <template #default>
        <template v-if="formModalTableCFG.PAGE == 'slot'">
          <slotCustemPage :currentData="currentData" @close="closeCustemPage" />
        </template>
        <template v-else>
          <MasterForm v-if="formConfig.showDetail" ref="MasterFormRef" v-model:formData="formConfig.formValue" :formConfig="formConfig.formColumns" :tableConfig="SubTableConfig" :formRules="formConfig.formRules" :tableRules="SubTableRules" :detail="formConfig.formType == 'DTL'" @select="formSelect" :MODULE="formModalTableCFG.MODULE" :PAGE="formModalTableCFG.PAGE" :othConfig="otherCFG" :infoConfig="infoConfig" :tableBillNo="formModalTableCFG.tableBillNo" />
        </template>
      </template>
      <template #footer>
        <div id="custemPageBtn" v-if="
            formModalTableCFG.PAGE == 'slot' ||
            formModalTableCFG.TYPE == 'STEP'
          "></div>
        <template v-else>
          <el-space>
            <el-button size="default" @click="closeModal"> 关闭 </el-button>
            <template v-if="formConfig.buttonList.length && formConfig.formType != 'DTL'">
              <el-button type="primary" size="default" @click="formBtnEvent(itemB)" v-for="itemB in formConfig.buttonList" :key="itemB.BILLNO">
                {{ itemB.VNAME }}
              </el-button>
            </template>
          </el-space>
        </template>

        <!-- <el-space>
          <el-button size="default" @click="closeModal"> 关闭 </el-button>
          <template v-if="formConfig.buttonList.length && formConfig.formType != 'DTL'">
            <el-button type="primary" size="default" @click="formBtnEvent(itemB)" v-for="itemB in formConfig.buttonList" :key="itemB.BILLNO">
              {{ itemB.VNAME }}
            </el-button>
          </template>
        </el-space> -->
      </template>
    </vxe-modal>

    <!-- 高级查询条件 -->
    <el-drawer v-model="queryDrawer" title="高级筛选">
      <Form v-model:formData="queryJson" :formConfig="queryConfig24Col" @select="formSelect" @enter="enterEvent" />
      <template #footer>
        <div style="flex: auto">
          <el-button @click="resetQuery" size="default">重置</el-button>
          <el-button type="primary" @click="queryEvent" size="default">查找</el-button>
        </div>
      </template>
    </el-drawer>

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

        <p v-if="hasTemplate">模板设置</p>
        <template v-for="(item, index) in templateList" :key="index">
          <el-tag effect="plain" class="col-tab" size="large" :type="
              item.VALUE == selectTemp  ? '' : 'info'
            " @click="selectTemplate(item)">
            {{ item.LABEL }}
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

    <!-- 报表模板 -->
    <vxe-modal destroy-on-close v-model="reportCGF" :width="pageConfig.modalW" :height="pageConfig.modalH" id="reportModal" resize storage transfer show-zoom show-footer @close="closeModal">
      <template #title>
        <span class="modal-title">{{ pageConfig.pageTitle }}</span>
      </template>
      <template #default>
        <ReportFrom ref="RTableRef" :detail="formConfig.formType == 'DTL'" :reportFromData="reportFromData" />
      </template>
      <template #footer>
        <el-button size="default" @click="closeModal"> 关闭</el-button>
        <el-button type="primary" v-if="ReportType == 1 || reportFromData.examine == true" size="default" @click="reportSubmit">
          保存
        </el-button>
      </template>
    </vxe-modal>

    <!-- 表格弹窗 -->
    <vxe-modal destroy-on-close v-model="tableShowCGF" :width="pageConfig.modalW" :height="pageConfig.modalH" id="tableModal" resize storage transfer show-zoom @close="closeModal">
      <template #title>
        <span class="modal-title">{{ pageConfig.modelTitle }}</span>
      </template>
      <template #default>
        <!-- <div class="tabModer">
          <el-button size="small" v-if="!TabModelConfig.buttonList.length" @click="closeModal">
            关闭
          </el-button>
          <span v-if="TabModelConfig.buttonList.length">
            <el-button type="primary" size="small" @click="TabtnEvent(itemB)" v-for="itemB in TabModelConfig.buttonList" :key="itemB.BILLNO">
              {{ itemB.VNAME }}
            </el-button>
          </span>
        </div> -->
        <ModalTable ref="modalRef" :MODULE="formModalTableCFG.MODULE" :ListTableData="formModalTableCFG.ListtableData" :PAGE="formModalTableCFG.PAGE" :tableBillNo="formModalTableCFG.tableBillNo" @TbaBtnData="TbaBtnData" @btnModelSelectData="btnModelSelectData" @getTBData="getTBData" @closeModal="closeModal">
        </ModalTable>
      </template>
    </vxe-modal>

    <!-- 审批节点 -->
    <vxe-modal destroy-on-close v-model="workModal" :width="pageConfig.modalW" :height="pageConfig.modalH" id="workModal" resize storage transfer show-zoom show-footer @close="closeModal">
      <template #title>
        <span class="modal-title">{{ pageConfig.pageTitle + "审批节点" }}</span>
      </template>
      <template #default>
        <WorkflowTimeLine :data="workDoData" />
      </template>
    </vxe-modal>
  </div>
</template>

<script setup name="">
import Vtable from "@/components/Tables";
import Button from "@/components/Tables/button.vue";
import Form from "@/components/Form";
import MasterForm from "@/components/MasterForm";
import StepForm from "@/components/StepForm";
import draggable from "vuedraggable";
import ReportFrom from "@/views/reportForm/index.vue";
import ModalTable from "./modal";
import Etable from "@/components/Tables/edit";
import WorkflowTimeLine from "@/components/Workflow/timeLine.vue";
import pageAutoComponent from "@/pageToComponents";
import InfoTimeLine from "@/components/TimeLine"; // 单据进度条

import Query from "@/components/Query/index.vue";
import { getPageConfig, getTableData, axiosSave } from "@/api/system/page";
import useSettingsStore from "@/store/modules/settings";
import useUserStore from "@/store/modules/user";

const settingsStore = useSettingsStore();
const storeSettings = computed(() => settingsStore);
const userStore = useUserStore();
import {
  outDoList,
  detailDo,
  outDoTableConfig,
  doStatusDict,
} from "#/workflow/do";

import {
  getFormValue,
  deepClone,
  getShowCFG,
  getFormRule,
  getUrlParams,
  evilFn,
  uuid,
} from "@/utils/index";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
  Plus,
  Filter,
  ArrowLeft,
  ArrowRight,
} from "@element-plus/icons-vue";

import { updetaReportPost, updetaReportexamine } from "@/api/system/reportForm";
import { restClick } from "@/api/system/page";
import PinyinMatch from "pinyin-match";
import json from "../../components/FileIcon/config";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["treeClick"]);
const router = useRouter();
const route = useRoute();
let tableBillNo = route.query.billno;
const formRef = ref(null);
const MasterFormRef = ref(null);
const formRefDetail = ref(null);
const mbType = ref(false);
const VTableRef = ref(null);
const RTableRef = ref(null);
const ReportType = ref(null);
const modalRef = ref(null);
const visibleFormPage = ref(false);
const tableShowCGF = ref(false);
const workModal = ref(false);
const workDoData = ref(null); // 审批流节点数据
const MBTableData = ref({});
const MBTableBillNo = ref("");

const pageLoading = ref(false)


const scaleValue = inject("scaleValue"); // 缩放比例

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
  pageShow: true,
  modalVisible: false,
  modalBtn: [],
  modalW: "60%",
  modalH: "40%",
  pageTitle: "",
  treeHeight: window.innerHeight - 200,
  mainTable: [], // 多主表原始配置数据
  mainActive: 0,
  mainTableCFG: [], // 多主表处理后的配置
  batchTable: false, // 是否批量操作表格
  EtableCFG: {}, // 批量操作时主表的验证规则
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

const infoConfig = ref([]);

// 单主表使用该配置
const tableCFG = reactive({
  tableColumns: [],
  allColumns: [],
  hasTableTools: false, // 是否有操作栏
  hasSeq: false, // 是否显示序号
  hasCheck: false, // 是否需要多选图标
  hasDragRow: false, // 是否支持 拖拽
  toolsConfig: [],
  expandID: "",
  loading: false,
  hasFill: false, // 表格补位
  hasEmpty: false,
  height: 500,
  rowClassEval: "", // 行加背景色的条件
  mergeCFG: null, // 表尾合计的配置  字段
  mergeRowField: [], // 需要合并的字段
  treeID: null, // 树形表格 的可展开的节点id
  SelectType: null,
  tableButtons: ["ADD", "EDIT", "DELETE"],
  EtableRules: {},
  cellHeight: storeSettings.value.rowHeight, // 单元格的行高
});
const formModalTableCFG = ref({
  MODULE: "",
  PAGE: "",
  TYPE: "",
  tableBillNo: "",
  ListtableData: {},
});
const { tableColumns, allColumns } = toRefs(tableCFG);

const queryDetailParams = ref({});

const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
});

const subPageInfo = reactive({
  currentPage: 1,
  pageSize: 5,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
  isShow: false,
});

const subTableList = reactive({
  subTableCol: [],
  subTableData: [],
  totalData: null,
  height: 300,
  active: 0,
  isShowPage: false,
});

const subTableCFGByMain = ref([]); // 来源于多个主表对应的子表配置
const ETableRef = ref(null);
const subTableActive = reactive({});

const expandCFG = ref(null);
const expandTBSelect = ref(null);

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
const SubTableConfig = ref([]);
const SubTableRules = ref([]);

const detailBtnCFG = ref(null);
const detailTreeBtn = ref(null);
const reportCGF = ref(false);
const queryJson = ref({});
const queryConfig = ref([]);
const queryConfig24Col = ref([]);
const currentData = ref([]);
const queryDrawer = ref(false);
const colDrawer = ref(false);
const reportFromData = ref({});
const hasTemplate = ref(false); // 页面是否关联多模板
const templateList = ref([]); // 模板列表
const selectTemp = ref(""); // 选中的模板
const setShowCol = ref(""); // 选中的模板中的列配置

const { hasTree, tableData, topButton, queryUrl, totalData, mainTable } =
  toRefs(pageConfig);
let initQueryJson = null;
const routerParams = router.currentRoute.value.meta;
hasTemplate.value = routerParams.ISTEMPLATE == "1";
hasTree.value = routerParams.COMP == "VTableZtree";

pageConfig.pageTitle = routerParams.title;
getPageCFG();

// 当前表单其它配置 全局的label 宽
const otherCFG = ref({
  labelWidth: "60px",
  GRID: "",
});

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

function handleNodeClick(data) {
  MBConfig.MODULEID = data.MODULEID;
  MBConfig.PAGEID = data.PAGEID;
  queryJson.value.PK_CLASS = data.VALUE;
  treeNode.value = data; //
  currentData.value = [];

  pageConfig.defaultExpandedKeys = [data.VALUE];
  if (!data.ISDISABLED) {
    pageInfo.currentPage = 1
    getTBData();
    emit("treeClick");
  }
}

// 展开表格中的操作按钮
const getButtonStatus = (item, row) => {
  //计算属性传递参数
  let { SCRNCONDITION } = item;
  let DATA = row;
  if (SCRNCONDITION && eval(SCRNCONDITION)) {
    return true;
  }
  return false;
};

onActivated(() => {
  tableBillNo = route.query.billno;
});

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
    const { QUERY, SUBTABLE, BUTTON, SLOTCFG, MAINTABLE, ISTREE } = res.RESULT;
    pageConfig.initButton = BUTTON;
    pageConfig.pageShow = res.RESULT.VDEF1 == '1' // 控制列表是否展示分页功能
    resetTableBtn(BUTTON); // 设置表格中的按钮
    queryUrl.value = SLOTCFG ? SLOTCFG : getQueryUrl(BUTTON);
    queryConfig.value = getShowCFG(QUERY);
    queryConfig24Col.value = set24col(QUERY, 24);
    treeQueryUrl.value = getQueryUrl(treeButton.value, "tree");

    let getDetailBtn = BUTTON.filter((i) => {
      return i.ACTION == "DTL" && i.VTYPE != 20;
    });
    detailBtnCFG.value = getDetailBtn.length ? getDetailBtn[0] : null;

    let COLUMNS = res.RESULT.COLUMNS;

    allColumns.value = JSON.parse(JSON.stringify(COLUMNS));

    //  是否存在树形表格
    if (ISTREE) {
      try {
        let treeConfig = JSON.parse(ISTREE);
        tableCFG.treeID = treeConfig;
      } catch (error) {
        console.error("ISTREE配置异常无法解析", error);
      }
    }

    // 判断是否存在多主表配置，合并主表
    if (MAINTABLE?.length) {
      // MAINTABLE.unshift(res.RESULT);
      // delete MAINTABLE[0].MAINTABLE;
      COLUMNS = MAINTABLE[0].COLUMNS;
      let newButtons = MAINTABLE[0].BUTTON;
      pageConfig.initButton = newButtons;
      resetTableBtn(newButtons);
      queryUrl.value = MAINTABLE[0].SLOTCFG
        ? MAINTABLE[0].SLOTCFG
        : getQueryUrl(newButtons);
      let getDetailBtn = newButtons.filter((i) => {
        return i.ACTION == "DTL";
      });
      detailBtnCFG.value = getDetailBtn.length ? getDetailBtn[0] : null;

      mainTable.value = MAINTABLE;
      resetMainTableCFG(MAINTABLE);
      pageConfig.mainActive = 0;
    }

    // 重新整理列表配置
    let showColumns = [],
      mergeCFG = [],
      mergeRowField = [],
      rowBgEval = "",
      columnWidth = 0;
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
        expandCFG.value = el;
      }

      if (el.VTYPE == "ExJoint" && el.OTHER) {
        try {
          let obgArr = JSON.parse(el.OTHER);
          let brNum = obgArr.filter((i) => {
            return i.row == 1;
          });
          let rowNum = brNum.length;
          if (obgArr.length > rowNum) {
            rowNum += 1;
          }
          let h = rowNum * 22 + 2;
          tableCFG.cellHeight = h > tableCFG.cellHeight ? h : tableCFG.cellHeight;
        } catch (error) {
          console.error("拼接配置错误", error, el);
        }
      }

      // 处理多选框和单选框的列头 为空
      if (el.VTYPE == "checkbox" || el.VTYPE == "radio") {
        el.title = "";
        tableCFG.SelectType = el.VTYPE;
        tableCFG.hasCheck = el.VTYPE == "checkbox";
      }
      // 是否存在拖拽
      if (el.VTYPE == "drag") {
        tableCFG.hasDragRow = true;
        dragRowConfig.value = el
      }
      // 是否存在操作栏
      if (el.CONTROLS == "ExTableTools") {
        tableCFG.hasTableTools = true;
      }
      if (
        el.ISSHOW == 1 &&
        el.VTYPE != "seq" &&
        el.VTYPE != "checkbox" &&
        el.CONTROLS != "ExTableTools"
      ) {
        showColumns.push(el);
      }

      if (el.SLOT == "rowBg" && el.SLOTCFG) {
        rowBgEval = rowBgEval ? rowBgEval + " && " + el.SLOTCFG : el.SLOTCFG;
      }

      if (el.ISSHOW == 1 && el.SELECTEDFLAG == 1) {
        columnWidth += el.WIDTH * 1;
        if (el.TOTALTYPE && el.TOTALTYPE != "-") {
          mergeCFG.push(el.FIELD);
        }
      }

      if (el.ISMERGE == 1) {
        mergeRowField.push(el.FIELD);
      }

      // 如果配置了唯一，说明是要进行合并的 字段
      tableCFG.mergeRowField = mergeRowField;

      tableCFG.mergeCFG = mergeCFG;
    });

    tableCFG.rowClassEval = rowBgEval;
    tableCFG.tableColumns = showColumns;
    // tableCFG.SelectType = tableCFG.SelectType
    //   ? tableCFG.SelectType
    //   : "checkbox";

    tableCFG.EtableRules = getFormRule(showColumns);
    // 判断表格宽度是否  需要补位
    setTbaleFill(columnWidth);
    initQueryJson = getFormValue(QUERY);
    queryJson.value = deepClone(initQueryJson);
    if (tableBillNo) {
      Object.assign(queryJson.value, { PK_CLASS: tableBillNo });
    }

    if (SUBTABLE.length) {
      pageConfig.hasSubTable = true;

      setTableHeight();
      let newSUBTABLE = SUBTABLE.map((item) => {
        let i = {};
        i.hasTableTools = false;
        i.hasSeq = false;
        i.toolsConfig = [];
        i.expandID = "";
        i.BILLNO = item.BILLNO;
        i.VCODE = item.VCODE;
        i.loading = false;
        i.VNAME = item.VNAME;
        i.height = 200;
        i.queryUrl = item.SLOTCFG ? item.SLOTCFG : getQueryUrl(item.BUTTON);
        i.tableColumns = getShowCFG(item.COLUMNS);
        i.allColumns = item.COLUMNS;
        i.buttons = item.BUTTON;
        i.hasFill = true;
        i.tableData = [];
        i.mergeCFG = getmergeCFGID(i.tableColumns);
        let hasCheckRadio = item.COLUMNS.filter((itc) => {
          return itc.VTYPE == "checkbox" || itc.VTYPE == "radio";
        });
        if (hasCheckRadio.length) {
          i.SelectType = hasCheckRadio[0].VTYPE; // 'checkbox' : '';
        }
        return i;
      });
      if (SUBTABLE.length == 1 && expandCFG.value) {
        pageConfig.hasSubTable =
          expandCFG.value?.SLOTCFG == SUBTABLE[0].BILLNO ? false : true;
        newSUBTABLE.height = null;
      }

      let isShowSubPage = SUBTABLE.filter((i) => {
        return i.VDEF1 == 1;
      });
      subPageInfo.isShow = isShowSubPage.length ? true : false;
      subTableList.subTableCol = newSUBTABLE;
    }
    setTableHeight();

    if (hasTree.value && treeQueryUrl.value != "") {
      getTreeData();
    } else if (queryUrl.value) {
      getTBData();
    }
  });
}

// 多主表时重置多主表配置
function resetMainTableCFG(data) {
  let mainCFG = {
    tableColumns: [],
    allColumns: [],
    hasTableTools: false, // 是否有操作栏
    hasSeq: false, // 是否显示序号
    toolsConfig: [],
    expandID: "",
    loading: false,
    hasFill: false, // 表格补位
    hasEmpty: false,
    height: 500,
    rowClassEval: "", // 行加背景色的条件
    mergeCFG: null, // 表尾合计的配置  字段
    mergeRowField: [], // 需要合并的字段
    SelectType: null,
    cellHeight: 26,
  };
  let mainCFGArr = [],
    subCFGArr = [];

  data.forEach((i) => {
    let copyMainCFG = JSON.parse(JSON.stringify(mainCFG));
    copyMainCFG.allColumns = i.COLUMNS;
    // 重新整理列表配置
    let showColumns = [],
      mergeCFG = [],
      mergeRowField = [],
      rowBgEval = "",
      columnWidth = 0;
    i.COLUMNS.forEach((el) => {
      el.title = el.LABEL;
      if (el.VTYPE == 0) {
        el.VTYPE = "";
      }
      // 是否需要显示序号，默认显示
      if (el.VTYPE == "seq") {
        copyMainCFG.hasSeq = el.ISSHOW == 1 ? true : false;
      }
      // 是否需要展开详情
      if (el.VTYPE == "expand") {
        copyMainCFG.expandID = el.FIELD;
      }

      if (el.VTYPE == "ExJoint" && el.OTHER) {
        try {
          let obgArr = JSON.parse(el.OTHER);
          let brNum = obgArr.filter((i) => {
            return i.row == 1;
          });
          let rowNum = brNum.length;
          if (obgArr.length > rowNum) {
            rowNum += 1;
          }
          let h = rowNum * 22 + 2;
          copyMainCFG.cellHeight =
            h > copyMainCFG.cellHeight ? h : copyMainCFG.cellHeight;
        } catch (error) {
          console.error("拼接配置错误", error, el);
        }
      }
      // 处理多选框和单选框的列头 为空
      if (el.VTYPE == "checkbox" || el.VTYPE == "radio") {
        el.title = "";
        copyMainCFG.SelectType = el.VTYPE;
      }
      // 是否存在操作栏
      if (el.CONTROLS == "ExTableTools") {
        copyMainCFG.hasTableTools = true;
      }
      if (
        el.ISSHOW == 1 &&
        el.VTYPE != "seq" &&
        el.VTYPE != "checkbox" &&
        el.CONTROLS != "ExTableTools"
      ) {
        showColumns.push(el);
      }

      if (el.SLOT == "rowBg" && el.SLOTCFG) {
        rowBgEval = rowBgEval ? rowBgEval + " && " + el.SLOTCFG : el.SLOTCFG;
      }

      if (el.ISSHOW == 1 && el.SELECTEDFLAG == 1) {
        columnWidth += el.WIDTH * 1;
        if (el.TOTALTYPE && el.TOTALTYPE != "-") {
          mergeCFG.push(el.FIELD);
        }
      }

      if (el.ISMERGE == 1) {
        mergeRowField.push(el.FIELD);
      }

      // 如果配置了唯一，说明是要进行合并的 字段
      copyMainCFG.mergeRowField = mergeRowField;

      copyMainCFG.mergeCFG = mergeCFG;
    });

    copyMainCFG.tableColumns = showColumns;
    copyMainCFG.mergeCFG = mergeCFG;
    copyMainCFG.mergeRowField = mergeRowField;
    copyMainCFG.rowClassEval = rowBgEval;
    mainCFGArr.push(copyMainCFG);

    // 判断是否存在子表
    let { SUBTABLE } = i;
    if (SUBTABLE?.length) {
      let newSUBTABLE = SUBTABLE.map((item) => {
        let i = {};
        i.hasTableTools = false;
        i.hasSeq = false;
        i.toolsConfig = [];
        i.expandID = "";
        i.BILLNO = item.BILLNO;
        i.loading = false;
        i.VNAME = item.VNAME;
        i.height = 200;
        i.queryUrl = item.SLOTCFG ? item.SLOTCFG : getQueryUrl(item.BUTTON);
        i.tableColumns = getShowCFG(item.COLUMNS);
        i.allColumns = item.COLUMNS;
        i.hasFill = true;
        i.tableData = [];
        i.buttons = item.BUTTON;
        i.mergeCFG = getmergeCFGID(i.tableColumns);
        return i;
      });
      subCFGArr.push({ subtable: newSUBTABLE });
    }
  });
  pageConfig.mainTableCFG = mainCFGArr;
  subTableCFGByMain.value = subCFGArr;
}

function getmergeCFGID(data) {
  let a = [];
  data.forEach((el) => {
    if (el.TOTALTYPE && el.TOTALTYPE != "-") {
      a.push(el.FIELD);
    }
  });
  return a;
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
    getTBData();

    // 暂时移除默认选中第一条的功能
    // if (res.RESULT.length) {
    //   let data = {};
    //   if (!res.RESULT[0].CHILDREN.length) {
    //     data = res.RESULT[0];
    //   } else if (!res.RESULT[0].CHILDREN[0].length) {
    //     data = res.RESULT[0].CHILDREN[0];
    //   } else if (!res.RESULT[0].CHILDREN[0].CHILDREN[0].length) {
    //     data = res.RESULT[0].CHILDREN[0].CHILDREN[0].CHILDREN[0];
    //   }
    //   queryJson.value.PK_CLASS = data.VALUE;
    //   treeNode.value = data; // ||  !data.ISDISABLED
    //   getTBData();
    // }
  });
}

// 加载表格数据
function getTBData() {
  tableCFG.loading = true;
  queryDrawer.value = false;
  subTableList.subTableData = [];
  let newPageID = pageConfig.mainTable.length
    ? pageConfig.mainTable[pageConfig.mainActive].BILLNO
    : routerParams.ACTION,
    PARENTPAGE = pageConfig.mainTable.length ? routerParams.ACTION : "";

  let urlParams = getUrlParams(pageConfig.queryUrl);
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
  // console.log('getTBData', data);
  getTableData(pageConfig.queryUrl, data)
    .then((res) => {
      let { TOTAL, RECORDS, TOTALDATA } = res.RESULT;
      tableData.value = RECORDS;
      totalData.value = TOTALDATA ? JSON.parse(TOTALDATA) : null;
      pageInfo.totalResult = TOTAL;
      tableCFG.loading = false;
      tableCFG.hasEmpty = RECORDS.length ? false : true;
      // console.log(tableCFG);
      // 包含子表请求子表的第一个数据
      if (
        routerParams.COMP == "VTableSub" &&
        RECORDS.length &&
        pageConfig.mainTableCFG.length == 0
      ) {
        let ff = subTableList.subTableCol[0];
        getSUBTBData(tableData.value[0].BILLNO);
      }
    })
    .catch((errr) => {
      tableCFG.loading = false;
      tableCFG.hasEmpty = true;
    });
}

// 设置表格是否需要占位列
function setTbaleFill(columnWidth) {
  columnWidth += 40;
  if (columnWidth < window.innerWidth - 100) {
    tableCFG.hasFill = true;
  }
}

// 加载子表格数据
function getSUBTBData(BILLNO) {
  let URL = subTableList.subTableCol[subTableList.active]?.queryUrl;
  let pageID = subTableList.subTableCol[subTableList.active].BILLNO;
  if (URL.includes("batch")) {
    URL = URL.replace("batch=", "");
    if (currentData.value.length && Array.isArray(currentData.value)) {
      BILLNO = currentData.value
        .map((i) => {
          return i.BILLNO;
        })
        .join(",");
    }
  }
  if (!URL) return;
  let urlParams = getUrlParams(URL);
  let data = {
    ...urlParams,
    ...queryJson.value,
    PK_CLASS: BILLNO,
    PK_ORG: BILLNO,
    PK_BILLNO: BILLNO,
    MODULEID: routerParams.BILLNO,
    PAGEID: pageID,
  };

  if (subPageInfo.isShow) {
    let PAGEDATA = {
      PAGENUM: subPageInfo.currentPage,
      PAGESIZE: subPageInfo.pageSize,
      SORTNAME: subPageInfo.sortName,
      REVERSE: subPageInfo.sortOrder,
    };
    data = { ...data, ...PAGEDATA, ...urlParams };
  }

  getTableData(URL, data)
    .then((res) => {
      if (!res.RESULT) {
        subTableList.subTableData = [];
      }
      let { RECORDS, TOTAL, TOTALDATA } = res.RESULT;
      if (Array.isArray(res.RESULT)) {
        subTableList.subTableData = res.RESULT;
      } else {
        subTableList.subTableData = RECORDS;
        subPageInfo.totalResult = TOTAL;
        subTableList.totalData = TOTALDATA ? JSON.parse(TOTALDATA) : null;
      }
    })
    .catch((errr) => {
      tableCFG.loading = false;
    });
}

// 多主表页签点击切换
function handleMainTabsClick(e) {
  pageConfig.mainActive = e.index * 1;
  let activeMain = pageConfig.mainTable[pageConfig.mainActive];
  const { BUTTON, SLOTCFG } = activeMain;
  pageConfig.initButton = BUTTON;
  resetTableBtn(BUTTON); // 设置表格中的按钮
  queryUrl.value = SLOTCFG ? SLOTCFG : getQueryUrl(BUTTON);
  let getDetailBtn = BUTTON.filter((i) => {
    return i.ACTION == "DTL";
  });
  detailBtnCFG.value = getDetailBtn.length ? getDetailBtn[0] : null;
  getTBData();
  // 同时切换子表
  if (subTableList.subTableCol.length) {
    subTableList.subTableCol =
      subTableCFGByMain.value[pageConfig.mainActive].subtable;
  }
}

// 子表页签点击时切换
function handleTabsClick(e) {
  subTableList.active = e.index * 1;
  subTableActive.value = subTableList.subTableCol[subTableList.active];
  if (currentData.value.length) {
    getSUBTBData(currentData.value[0].BILLNO);
  } else {
    getSUBTBData(tableData.value[0].BILLNO);
  }
}

// 表格内部的多选事件，顶部筛选排序事件, 超链接事件

function tableChange(data) {
  console.log('tableChange', data);
  MBTableData.value = data.data[0];
  // console.log(777 ,data );
  // mbType.value = true;
  if (data.clicktype == "sort") {
    pageInfo.sortName = data.data.sortBy;
    pageInfo.sortOrder = data.data.sort;
    getTBData();
  } else if (data.clicktype == "detail") {
    formModalTableCFG.value.tableBillNo = data.data.BILLNO;
    currentData.value = data.data;
    //承运商评价模板详情
    if (
      detailBtnCFG.value.VTYPE == 21 &&
      detailBtnCFG.value.PAGEPATH == "type:cyspjmb"
    ) {
      reportFromData.value.moduleid = detailBtnCFG.value.PK_MODULE;
      reportFromData.value.pageid = detailBtnCFG.value.PK_PAGE;
      reportFromData.value.type = 2;
      reportFromData.value.billno = data.data.BILLNO;
    }
    handelEvent({ data: detailBtnCFG.value, row: data.data });
  } else if (data.clicktype == "checkbox") {
    currentData.value = data.data;
    // let expandRow = getRowExpandRecords()
  }
  if (data.clicktype == "openLink") {
    // 超链接点击事件
    formModalTableCFG.value.tableBillNo = data.data.BILLNO;
    let getLinkBtn = pageConfig.initButton.filter((i) => {
      return i.BILLNO == data.linkCFG;
    });
    currentData.value = data.data;
    getLinkBtn.length ? handelEvent({ data: getLinkBtn[0], row: data.data }) : null;
  }
  if (data.clicktype == "openDrawer") {
    colDrawer.value = true;
  } else {
    currentData.value = data.data;
  }
  if (
    routerParams.COMP == "VTableSub" ||
    pageConfig.hasSubTable ||
    tableCFG.expandID
  ) {
    if (data.checked) {
      getSUBTBData(tableData.value[data.rowIndex].BILLNO);
    }
  }
}

// 展开子表后，子表的单选按钮事件
function tableChangeExpand(data) {
  // console.log("展开子表后按钮事件", data);
  currentData.value = data.data;
  if (data.clicktype == "openLink") {
    // 超链接点击事件
    formModalTableCFG.value.tableBillNo = data.data.BILLNO;
    let getLinkBtn = pageConfig.initButton.filter((i) => {
      return i.BILLNO == data.linkCFG;
    });
    currentData.value = data.data;
    getLinkBtn.length ? handelEvent({ data: getLinkBtn[0], row: null }) : null;
  }

  if (data.clicktype == "detail") {
    formModalTableCFG.value.tableBillNo = data.data.BILLNO;
    currentData.value = data.data;
    let EDetailBtn = subTableList.subTableCol[0].buttons.find((i) => {
      return i.ACTION == "DTL";
    });
    if (!EDetailBtn) {
      ElMessage({
        message: "详情按钮未配置，无法进行查看",
        type: "error",
      });
      return;
    }
    handelEvent({ data: EDetailBtn, row: data.data });
  }
}

// 分页点击
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  getTBData();
}

// 子表分页
function handleSubPageChange({ currentPage, pageSize }) {
  subPageInfo.currentPage = currentPage;
  subPageInfo.pageSize = pageSize;
  getSUBTBData(currentData.value[0].BILLNO);
}

// 根据表格高度设置默认的分页大小
function setTableHeight() {
  // 顶部导航 60 + 边距 10 + 页签38 + 查询条件 60 + 按钮42 + 分页 36 = 246
  let otherHeight = 250;
  let mainHeight = null,
    hasQuery = queryConfig.value.length ? true : false;
  if (!pageConfig.hasSubTable) {
    mainHeight = window.innerHeight - otherHeight;
    if (mainHeight > 750) {
      pageInfo.pageSize = 30;
    } else if (mainHeight > 400) {
      pageInfo.pageSize = 20;
    } else {
      pageInfo.pageSize = 10;
    }
  } else {
    // tableCFG.height = (window.innerHeight - 180) * 0.5;  子表高度默认160
    mainHeight = window.innerHeight - otherHeight - 210;
    subTableList.height = 200;
    if (tableCFG.height > 400) {
      pageInfo.pageSize = 20;
    }
  }
  // tableCFG.height = mainHeight + (hasQuery ? 0 : 50) ;
  tableCFG.height = mainHeight;
  pageConfig.mainTableCFG.forEach((i) => {
    i.height = mainHeight - 30;
  });
}

// 设置表格内的按钮状态
function setTableBtnStatus(condition, row) {
  let DATA = row;
  if (DATA && evilFn2(DATA, condition)) {
    return true;
  }
  return false;
}

function evilFn2(row, fn) {
  const DATA = JSON.parse(JSON.stringify(row)) || Object.create(null);
  let Fn = new Function("DATA", `return ${fn}`);
  const proxy = new Proxy(DATA, {
    has(target, key) {
      return true;
    },
  });
  return Fn(proxy);
}

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

    if (i.VTYPE == "20") {
      hasTree.value = true;
      ztreeBtn.push(i);
    }
  });
  treeButton.value = ztreeBtn;
  topButton.value = [...CYBTN, ...showData];
  treeButtonAuth.value = ztreeBtn.map((i) => {
    return i.ACTION;
  });
}

function resetQuery() {
  queryJson.value = deepClone(initQueryJson);
  queryJson.value.PK_CLASS = tableBillNo;
  if (hasTree.value) {
    queryJson.value.PK_CLASS = treeNode.value?.VALUE;
  }
}

// 查询按钮执行事件
function queryEvent() {
  queryDrawer.value = false;
  pageInfo.currentPage = 1;
  getTBData();
}

// 表格的功能按钮点击事件 表格内的按钮点击和顶部菜单栏点击
function handelEvent({ data, row }) {
  console.log("handelEvent", data, row, data.VTYPE);
  let selectRecords = [];
  pageConfig.activeBtn = data;
  // 表格内的按钮事件,先清空已选中的数据
  if (row) {
    selectRecords = [row];
    currentData.value = row;
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

  // 打开弹窗
  if (data.VTYPE == 2 || data.VTYPE == 20 || data.VTYPE == 1) {
    pageConfig.modelTitle = data.VNAME || "提示";
    formConfig.formType = data.ACTION || "";
    formModalTableCFG.value.TYPE = data.ACTION;
    formModalTableCFG.value.MODULE = data?.PK_MODULE;
    formModalTableCFG.value.PAGE = data?.PK_PAGE;
    formModalTableCFG.value.tableBillNo = row?.BILLNO;
    if (data.PK_PAGE && data?.PK_PAGE == "slot") {
      openCustemPage(data.VTYPE, data.PAGEPATH); // 打开自定义页面
    } else if (data.ACTION == "STEP") {
      // 打开 步骤 表单页面
      if (data.VTYPE == 1) {
        visibleFormPage.value = true;
      } else {
        pageConfig.modalVisible = true;
      }
    } else {
      getOnlyPageConfig(data.CHOOSE2SUB).then(() => {
        if (data.VTYPE == 1) {
          visibleFormPage.value = true;
        } else {
          pageConfig.modalVisible = true;
        }
        if (MasterFormRef.value) MasterFormRef.value.resetForm();
      }); // 获取独立的配置
    }
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
  //表格弹窗
  if (data.VTYPE == 7 && data.ACTION == "QRY") {
    const [val1, val2] = data.ACTIONADDRESS.split(",");
    formModalTableCFG.value.PAGE = val2;
    formModalTableCFG.value.MODULE = val1;
    // formModalTableCFG.value.tableBillNo = currentData.value[currentData.value.length - 1].billno;
    formModalTableCFG.value.ListtableData = selectRecords[selectRecords.length - 1]
      // currentData.value[currentData.value.length - 1];
    pageConfig.modelTitle = data.VNAME || "提示";
    tableShowCGF.value = true;
  }
  //  文件流下载 导出
  if (data.VTYPE == 13) {
    let chooseData = currentData.value
      ? currentData.value.map((i) => i.BILLNO).join(",")
      : "";
    let aaDown = {
      APPID: "",
      // DATA: data.ISTWOSURE == 1 ? { BILLNO: currentData.value[0].BILLNO , ...queryJson.value } : {},
      DATA: { CHOOSEBILLNO: chooseData, ...queryJson.value },
      KEY: "",
      MODULEID: routerParams.BILLNO,
      PAGEID: pageConfig.activeBtn.PK_PAGE,
      VERSION: "",
    };
    handleExport(data.ACTIONADDRESS, aaDown);
  }
  // 文件路径下载
  if (data.VTYPE == 15) {
    downFilesByUrl(data);
  }
  //模板新增
  if (data.VTYPE == 17) {
    pageConfig.modelTitle = data.VNAME || "提示";
    formConfig.formType = data.ACTION || "";
    mbType.value = true;
    if (MBConfig.MODULEID == "" && MBConfig.PAGEID == "") {
      MBConfig.MODULEID = MBTableData.value.PK_MODULE;
      MBConfig.PAGEID = MBTableData.value.PK_PAGE;
    } else {
      formModalTableCFG.MODULE = MBConfig.MODULEID;
      formModalTableCFG.PAGEID = MBConfig.PAGEID;
    }
    pageConfig.modalVisible = true;
    getOnlyPageConfig(data.CHOOSE2SUB, 17); // 获取独立的配置
  }
  //打开菜单
  if (data.VTYPE == 16) {
    if (formModalTableCFG.value.tableBillNo != "") {
      router.push({
        path: data.ACTIONADDRESS,
        query: { billno: formModalTableCFG.value.tableBillNo },
      });
    } else if (data.OTHER == "fenceMap") {
      router.push({
        path: data.ACTIONADDRESS,
        query: { billno: currentData.value[0].BILLNO },
      });
    } else if (data.OTHER == "formBillNo") {
      const orderNos = currentData.value.map((order) => order.BILLNO).join(",");
      router.push({
        path: data.ACTIONADDRESS,
        query: { billno: orderNos },
      });
    } else {
      router.push({
        path: data.ACTIONADDRESS,
      });
    }
  }

  if (data.VTYPE == 21 && data.PAGEPATH == "type:cyspjmb") {
    reportCGF.value = true;
    let arr = currentData.value[currentData.value.length - 1].BILLNO;
    // 打开弹窗
    ReportType.value = "";
    ReportType.value = 1;
    pageConfig.modelTitle = data.VNAME || "提示";
    reportFromData.value.moduleid = data.PK_MODULE;
    reportFromData.value.pageid = data.PK_PAGE;
    reportFromData.value.type = ReportType.value;
    reportFromData.value.billno = arr;
    pageConfig.modalVisible = true;
  }
  //承运商评价模板审核按钮
  if (
    data.VTYPE == 21 &&
    data.ACTION == "EDIT" &&
    data.PAGEPATH == "type:cyspjmb"
  ) {
    ReportType.value = "";
    ReportType.value = 2;
    let arr = currentData.value[currentData.value.length - 1].BILLNO;
    // 打开弹窗
    reportFromData.value.moduleid = data.PK_MODULE;
    reportFromData.value.pageid = data.PK_PAGE;
    reportFromData.value.type = ReportType.value;
    reportFromData.value.billno = arr;
    reportFromData.value.examine = true;
    pageConfig.modelTitle = data.VNAME || "提示";
    pageConfig.modalVisible = true;
  }
  // 启用批量操作  ACTION: "BATCHEDIT"
  if (data.VTYPE == 22 && data.ACTION == "BATCHEDIT") {
    pageConfig.batchTable = !pageConfig.batchTable;
    data.VNAME = pageConfig.batchTable ? "取消编辑" : "批量编辑";
  }

  // 启用了批量编辑时的数据提交功能   { LABEL: "保存并重置", VALUE: "14" },
  if (pageConfig.batchTable && data.VTYPE == 14) {
    batchTableSubmit(data);
  }

  // 查看审批流节点
  if (data.VTYPE == 23) {
    let workBillNo = Array.isArray(currentData.value)
      ? currentData.value[0].PROCESSINSTANCEID
      : currentData.value.PROCESSINSTANCEID;
    // ElMessage({
    //   message: "未获取到单据的审批流主键PROCESSINSTANCEID无法查看审批节点！",
    //   type: "error",
    // });
    if (!workBillNo) return;
    detailDo(workBillNo).then((res) => {
      workDoData.value = res.RESULT;
      pageConfig.modalW = "40vw";
      pageConfig.modalH = "60%";
      workModal.value = true;
    });
  }

  // 分享 ，复制到粘贴板
  if (data.VTYPE == 24) {
    let arr = [];
    //获取客户端
    let newArr = tableCFG.tableColumns.filter((ele) => ele.FIELD == "CTYPENO");
    let newArr1 = JSON.parse(newArr[0].OTHER);
    currentData.value.forEach((item, index) => {
      let terminalTypArr = newArr1.filter((ele) => ele.VALUE == item.CTYPENO);
      arr.push(
        // `客户：${item.CUSTOMERNAME}\n客户端：${item.CTYPENO}\n机器码：${item.MACCODE}\n注册码：${item.REGCODE} \n有效期：${item.EXPIREDATE} \n************************`
        `客户：${item.CUSTOMERNAME}\n客户端：${terminalTypArr[0].LABEL}\n机器码：${item.MACCODE}\n注册码：${item.REGCODE} \n有效期：${item.EXPIREDATE} \n************************`
      );
    });
    let str = arr.join("\n");
    copyTextSuccess(str);
  }

  // 文件预览
  if (data.VTYPE == 25) {
    previewFilesByUrl(data);
  }
}
// 复制
function copyTextSuccess(innerText) {
  const textarea = document.createElement("textarea");
  textarea.textContent = innerText;
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  proxy.$modal.msgSuccess("复制成功，请打开QQ/微信分享至好友~");
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

  if (URL.includes("?")) {
    let queryParams = getUrlParams(URL);
    data = Object.assign(queryParams, data);
  }

  queryDetailParams.value = data;
  axiosSave(URL, data).then((newRes) => {
    let res = newRes.RESULT;
    // if (SubTableConfig.value.length > 0) {
    //   for (let i = 0; i < SubTableConfig.value.length; i++) {
    //     const el = SubTableConfig.value[i];
    //     let { FIELD, COLUMNS } = el;
    //     if (res[FIELD] && res[FIELD].length > 0) continue;
    //     let isEdit = formConfig.formColumns.find((el) => el.FIELD == FIELD).ISDISABLED != 1;
    //     if (!isEdit) continue;
    //     // let rowData = getFormValue(COLUMNS);
    //     // delete rowData.EnumData;
    //     // res[FIELD] = [{ ...rowData }];
    //   }
    // }
    formConfig.formValue = Object.assign(formConfig.formValue, res);
    formConfig.showDetail = true;
  });
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
          LABEL: "模板名称",
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

const setShowBtn = (b) => {
  const PAGEACTION = pageConfig.activeBtn.ACTION;
  if (b.ISSHOW == 1 && !b.OTHER) return true;
  if (b.ISSHOW == 2 && b.OTHER) {
    try {
      if (
        b.OTHER.includes("PAGEACTION") &&
        evilFn({ PAGEACTION: PAGEACTION }, b.OTHER)
      ) {
        return true;
      }
    } catch (error) {
      console.error(error);
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
          // { ...baseData },
          // { ...baseData },
          // { ...baseData },
          // { ...baseData },
          // { ...baseData },
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

function submitEvent(URL, sdata) {
  // mbType
  let saveData;
  if (mbType.value) {
    delete sdata.EnumData;
    saveData = {
      ...sdata,
      // DEFAULTVALUE: sdata,
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
  let urlParams = getUrlParams(pageConfig.activeBtn.ACTIONADDRESS);
  saveData = Object.assign(saveData, urlParams);
  axiosSave(URL, saveData)
    .then((res) => {
      pageLoading.value = false
      ElMessage({
        message: res.MESSAGE,
        type: "success",
      });
      setTimeout(() => {
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
      pageLoading.value = false
      modalRef.value != null && modalRef.value.getTBData();
    });
}

function submitByBtn(btn, data) {
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
  submitEvent(btn.ACTIONADDRESS, sdata);
}

// 批量操作编辑时的保存提交
function batchTableSubmit(btn) {
  let URL = btn.ACTIONADDRESS;
  ETableRef.value.xEditTable.validate(true).then((valid) => {
    if (valid != undefined) return;
    let { insertRecords, updateRecords } =
      ETableRef.value.xEditTable.getRecordset();
    let saveData = [...insertRecords, ...updateRecords];
    saveData = saveData.map((el) => {
      delete el.EnumData;
      return el;
    });
    let newData = {
      MODULEID: routerParams.BILLNO,
      PAGEID: btn.PK_PAGE || routerParams.ACTION,
      data: saveData,
    };
    axiosSave(URL, newData).then((res) => {
      proxy.$modal.msgSuccess("提交成功");
      pageConfig.batchTable = false;
      queryEvent();
    });
  });
}

// 批量操作表格的多选事件
const eTableChange = (data) => {
  currentData.value = data;
};

// 批量表格操作 内部的按钮
const plusRowData = () => {
  let BaseRowData = getFormValue(tableCFG.tableColumns);
  ETableRef.value.xEditTable.insertAt({ ...BaseRowData }, -1);
};

const delConfig = (row) => {
  if (currentData.value.length > 0) {
    proxy.$modal.confirm("是否删除选中的配置？").then((res) => {
      let newRows = currentData.value.filter((el) => el.BILLNO == undefined);
      if (newRows.length > 0) {
        for (let i = 0; i < newRows.length; i++) {
          const el = newRows[i];
          ETableRef.value.xEditTable.remove(el);
        }
      }
      let ids = tableCheck.value.filter((el) => el.BILLNO != undefined);
      if (ids.length > 0) console.warn("批量操作中的删除");
    });
  } else {
    let { BILLNO } = row;
    proxy.$modal.confirm("是否删除？").then((res) => {
      if (BILLNO == undefined) {
        ETableRef.value.xEditTable.remove(row);
      } else {
        proxy.$modal.msgSuccess("模拟删除成功");
        ETableRef.value.xEditTable.remove(row);
      }
    });
  }
};

// 查询条件中的下拉触发查询
const formSelect = (res) => {
  if (res.query) {
    queryEvent();
  }
};
// 回车时触发查询功能
const enterEvent = () => {
  queryEvent();
};

//  弹窗表单提交事件
const formSubmit = () => {
  MasterFormRef.value.submitForm().then((valid) => {
    if (!valid) return;
    pageLoading.value = true
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

// 表格中的展开表单的提交事件

const formBtnEventByTable = (e) => {
  formRefDetail.value.submitForm().then((valid) => {
    if (!valid) return;
    submitEvent(e.ACTIONADDRESS, formConfig.formValue);
  });
};

function handleExport(url, data) {
  proxy.download(
    url,
    {
      ...data,
    },
    ""
  );
}

//报表模板按钮
function reportSubmit() {
  RTableRef.value.submit().then((res) => {
    if (!res) return;
    if (reportFromData.value.examine == true && ReportType.value == 2) {
      updetaReportexamine({
        BILLST: RTableRef.value.FormModel.radio,
        CERTIFICATIONDESC: RTableRef.value.FormModel.desc,
        PKBILLNO: reportFromData.value.billno,
        MODULEID: reportFromData.value.moduleid,
        PAGEID: reportFromData.value.pageid,
      }).then(() => {
        ElMessage({
          message: "保存成功",
          type: "success",
        });
        pageConfig.modalVisible = false;
        reportCGF.value = false;
        getTBData();
      });
    } else {
      updetaReportPost({
        ...RTableRef.value.reportForm,
      }).then(() => {
        ElMessage({
          message: "保存成功",
          type: "success",
        });
        pageConfig.modalVisible = false;
        reportCGF.value = false;
        getTBData();
      });
    }
  });
}

// 关闭弹窗
function closeModal() {
  if (formRef.value) formRef.value.resetForm();
  if (MasterFormRef.value) MasterFormRef.value.resetForm();
  pageConfig.modalVisible = false;
  reportCGF.value = false;
  tableShowCGF.value = false;
  currentData.value = [];
  VTableRef.value.clearCheckRow();
}

function openQuery() {
  queryDrawer.value = true;
}

function treeBtnEvent(t) {
  let detailBtn = null,
    delBtn = null,
    addBtn = null,
    updata = null;
  treeButton.value.forEach((i) => {
    switch (i.ACTION) {
      case "DTL":
        detailTreeBtn.value = i;
        detailBtn = i;
        break;
      case "ADD":
        addBtn = i;
        break;
      case "EDIT":
        updata = i;
        break;
      case "DELETE":
        delBtn = i;
        break;
    }
  });

  if (t == 3) {
    if (!delBtn) {
      return ElMessage({
        message: "未配置删除按钮，请检查配置！",
        type: "warning",
      });
    }
    ElMessageBox.confirm(`您确定要执行该操作吗?`, "确认提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      pageConfig.activeBtn = delBtn
      submitByBtn(delBtn, treeNode.value);
    });
  }

  if (t == 1) {
    if (!addBtn) {
      return ElMessage({
        message: "未配置新增按钮，请检查配置！",
        type: "warning",
      });
    }
    handelEvent({ data: addBtn, row: null });
  }

  if (t == 2) {
    if (!updata || !detailBtn) {
      return ElMessage({
        message: "未配置编辑和详情按钮，请检查配置！",
        type: "warning",
      });
    }

    handelEvent({ data: updata, row: null });
  }
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

//开始拖拽事件
function onStart() { }
//结束拖拽事件
function onEnd() { }

function closeTab(i, t) {
  if (t == 1) {
    tableColumns.value[i].SELECTEDFLAG = "1";
  } else {
    tableColumns.value[i].SELECTEDFLAG = "0";
  }
}

function saveColConfig() {
  // 判断是否包含模板
  let data = {
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
    BILLNO: '0',
    ENGNAMESINFO: setShowCol.value,
    NOTSHOWINFO: "",
  };
  if (hasTemplate.value) {
    data.BILLNO = selectTemp.value
  } else {
    let ArrList = tableCFG.tableColumns.filter((i) => {
      return i.SELECTEDFLAG == 1;
    });

    let ArrList2 = tableCFG.tableColumns.filter((i) => {
      return i.SELECTEDFLAG == 0;
    });

    let newData = ArrList.map((i) => {
      return i.FIELD;
    }).join(",");

    let newData2 = ArrList2.map((i) => {
      return i.FIELD;
    }).join(",");
    data.ENGNAMESINFO = newData
    data.NOTSHOWINFO = newData2
    let colWidth = ArrList.reduce((sum, e) => sum + Number(e.WIDTH || 0), 0);
    setTbaleFill(colWidth);
    VTableRef.value.refreshColumn();
    // submitEvent("/sys/selectConfig/insert", data);
  }

  axiosSave("/sys/selectConfig/insert", data).then((res) => {
    proxy.$modal.msgSuccess("提交成功");
    pageConfig.batchTable = false;
    colDrawer.value = false;
    queryEvent();
  });
}

function restBtn() {
  let data = {
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
  };
  restClick(data)
    .then((res) => {
      colDrawer.value = false;
      ElMessage({
        message: "重置成功",
        type: "success",
      });
    })
    .catch((err) => {
      ElMessage({
        message: "重置失败",
        type: "success",
      });
    });
}
//表格弹窗的常用按钮
function TbaBtnData(data) {
  TabModelConfig.buttonList = data;
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
function btnModelSelectData(data) {
  TabModelConfig.tabValue = data;
}
// 通过地址下载文件
function downFilesByUrl(data) {
  let BILLNO = "",
    PK_PARENT_MENU_ID = "",
    PROJECTID = "",
    FILEID = "";

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

  axiosSave(data.ACTIONADDRESS, newdata).then((res) => {
    let url = res.RESULT.URL,
      filename = res.RESULT.VNAME,
      regex = /\.(jpg|jpeg|png|gif)$/i;
    if (url.includes(".pdf") || regex.test(url)) {
      const x = new XMLHttpRequest();
      x.open("GET", url, true);
      x.responseType = "blob";
      x.onload = (e) => {
        // 会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
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
  let ffid = `FILEID=FD${uuid()}${FILEID}&PK_PARENT_MENU_ID=${PK_PARENT_MENU_ID}&PROJECTID=${PROJECTID}&NAMEID=${NAMEID}&NAME=${userStore.userInfo.VNAME
    }`;
  let filePath = data.ACTIONADDRESS + "?" + ffid;
  window.open(filePath, "_blank");
}

function backEvent() {
  treeKeyword.value = "";
  visibleFormPage.value = false;
  formConfig.showDetail = false;
  formConfig.formValue = {};
  currentData.value = [];
}

function closeCustemPage() {
  backEvent();
  queryEvent();
}

const pickerOptions = {
  selectableRange: "9:00-18:00",
  disabledDate(time) {
    return time.getTime() < Date.now() - 8.64e7;
  },
  shortcuts: [
    {
      text: "上午",
      onClick(picker) {
        const now = new Date();
        picker.$emit(
          "pick",
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0)
        );
      },
    },
    {
      text: "下午",
      onClick(picker) {
        const now = new Date();
        picker.$emit(
          "pick",
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0, 0)
        );
      },
    },
  ],
};

// 左侧树折叠事件
const treeExpand = () => {
  pageConfig.treeExpand = !pageConfig.treeExpand;
};
/** 动态自定义组件 */
const slotCustemPage = ref();
const openCustemPage = (type, path) => {
  try {
    // visibleFormPage.value = true;
    type == 1 ? visibleFormPage.value = true : pageConfig.modalVisible = true;
    slotCustemPage.value = pageAutoComponent(path);
    // slotCustemPage.value = defineAsyncComponent(() => import(`./page.js`))
  } catch (err) {
    console.error("打开自定义页面", err);
  }


};

// 打开列配置 查询 多模板
const openDrawer = () => {
  let data = {
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
  };
  if (hasTemplate.value) {
    axiosSave("/sys/selectConfig/getList", data).then((res) => {
      let { TEMPLIST, ENGNAMESINFO } = res.RESULT;
      templateList.value = TEMPLIST;
      setShowCol.value = ENGNAMESINFO;
      // 设置已选模板的状态
      let idArr = TEMPLIST.filter(i => i.ISDETAULT == 1)
      selectTemp.value = idArr.length ? idArr[0].VALUE : null

    });
  }
  colDrawer.value = true;
};
// 模板选中后
const selectTemplate = (temp) => {
  selectTemp.value = temp.VALUE;
  let data = {
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
    BILLNO: temp.VALUE,
  };
  axiosSave("/sys/selectConfig/getColumnById", data).then((res) => {
    let { TEMPLIST, ENGNAMESINFO } = res.RESULT;
    setShowCol.value = ENGNAMESINFO;
  });
};

/** 拖拽表格 */
const dragRowConfig = ref({})
const dragTableRow = data => {
  let { OTHER: Url } = dragRowConfig.value
  let { row, newIndex } = data
  let newData = {
    LIST: [{ BILLNO: row.BILLNO, SORT: newIndex + 1 }]
  }
  console.log(newData);
  axiosSave(Url, newData).then(res => {
    getTBData();
  })
}

// // 页面离开后
// onDeactivated(() => {
//   console.log(123, '页面离开' , currentData.value);
//   backEvent();
// });

// // 页面进入后
// onActivated(()=>{
//   console.log(456, '页面进入' , currentData.value);

// })

// onMounted(() => {
//   window.addEventListener("resize", setTableHeight);
// });

// onBeforeUnmount(() => {
//   window.removeEventListener("resize", setTableHeight);
// });

// onMounted(() => {
//   setTableHeight();
// });
// 主动暴露方法
defineExpose({
  pageData: pageInfo, // 页码数据
  pageChange: handlePageChange, // 页面Change方法
});
</script>
<style lang="scss" scoped>
.app-wrap {
  .app-table-box {
    display: flex;
    width: 100%;
    background-color: #fff;
    &-left {
      width: 210px;
      padding: 10px;
      border-right: 10px solid #e7e9f1;
    }
    &-right {
      flex: 1;
      padding: 0 10px;
    }
  }

  .padding-8 {
    padding: 8px;
  }
  .query-wrap {
    // padding: 8px;
    background-color: #fff;
    margin: 10px 0 !important;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .query-form {
      width: 100%;
    }
  }
  .tool-wrap {
    // padding-bottom: 8px;
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
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

  .tabs-wrap {
    // margin-top: -30px;
  }
}

.modal-title {
  font-weight: 100 !important;
}

.vxe-page-wrap {
  width: 50%;
  position: absolute;
  right: 0;
  z-index: 99;
}
// :deep(.el-tabs__header) {
//   padding: 10px 0 !important;
// margin-bottom: 6px !important;
// }

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
.form-page-wrap {
  width: 100%;
  height: calc(100vh - 110px);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  &.formPage {
    background: #fff;
    padding: 4px;
    .form-page-content {
      width: 99%;
      margin-top: 50px;
    }
  }
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
    width: 100%;
    box-sizing: border-box;
    margin-top: 40px;
  }
}

.table-form-btn {
  margin: 15px;
}

.expand-wrapper {
  padding: 10px 0;
  padding-left: 40px;
}

.tree-expand-btn {
  position: absolute;
  top: calc(50% - 30px);
  left: 0;
  z-index: 100;
  background-color: #8c95a8;
  width: 9px;
  height: 60px;
  line-height: 60px;
  text-align: left;
  border-radius: 0 10px 10px 0;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: var(--el-color-primary);
  }
  .el-icon {
    position: relative;
    left: -3px;
  }
}

// 新版新增的 含有子表时，子表的顶部标题
.subtable-title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: flex-end;
}
</style>
<style scoped>
:v-deep
  .vxe-table--render-default.size--mini
  .vxe-body--column:not(.col--ellipsis) {
  padding: 4px 0 !important;
}
</style>
