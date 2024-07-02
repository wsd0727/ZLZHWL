<template>
  <div class="val_table">
    <!-- checkStrictly:  !tableCFG.treeID?true:false  控制多选框是否级联 -->
    <!-- @header-cell-click="headerCellClickEvent" @header-cell-dblclick="headerCellClickEvent" -->
    <vxe-table resizable round show-overflow="title" ref="xTable" :edit-rules="validRules" size="mini" highlight-hover-row header-row-class-name="bg-blue" width="100%" :show-footer="tableCFG.mergeCFG && tableCFG.mergeCFG.length" :border="tableCFG.mergeRowField?.length ? true : false" stripe
      :loading="tableCFG.loading" :height="showMoreQuery && tableCFG.height ?  tableCFG.height-50 : (tableCFG.height || 300 ) " class="mytable-scrollbar mytable-footer" :column-config="{ isCurrent: false, isHover: true }" :row-config="{
        isCurrent: true,
        isHover: true,
        height:  resetRowHeight(tableStyle) ,
      }" :data="tableData" :span-method="mergeRowMethod" :area-config="{multiple: true, selectCellByHeader: true}" :radio-config="
        tableCFG.SelectType == 'radio'
          ? { highlight: true, trigger: 'row' }
          : null
      " :checkbox-config="
        !tableCFG.SelectType || tableCFG.SelectType != 'radio'
          ? { highlight: true   }
          : null
      " :sort-config="{ showIcon: false }" :footer-method="footerMethod" :expand-config="{ labelField: tableCFG.expandID }" :tree-config="{transform: tableCFG.treeID?.transform ==1 ? true :false , rowField: tableCFG.treeID?.rowField , parentField: tableCFG.treeID?.parentField }"
      :row-class-name="rowClassName" :cell-class-name="cellClassName" @toggle-row-expand="toggleExpandChangeEvent" @sort-change="sortChange" @radio-change="radioChangeEvent" @checkbox-change="checkboxChange" @checkbox-all="checkboxChange" @custom="toolbarCustomEvent" @cell-click="rowClick"
      @cell-dblclick="
        (e) => {
          openDetail(e.row);
        }
      " :scroll-y="{enabled: true}">

      {{ tableCFG.tableColumns.length ? getTableRatio() : null }}

      <vxe-column v-if="tableCFG?.SelectType == 'checkbox'" type="checkbox" align="center" width="40" fixed="left"></vxe-column>

      <vxe-column field="name" title=" " width="40" type="seq" align="center" v-if="tableCFG.hasSeq" fixed="left">
      </vxe-column>

      <vxe-column width="50" field="drag" align="center" v-if="tableCFG.hasDragRow" fixed="left">
        <template #default>
          <div class="drag-btn">
            <i class="vxe-icon-sort"></i>
          </div>
        </template>
      </vxe-column>
      <template v-for="(config, indexC) in tableCFG.tableColumns" :key="indexC">
        <template v-if="config.VTYPE == 'radio'">
          <vxe-column type="radio" align="center" width="40"></vxe-column>
        </template>

        <template v-else-if="config.VTYPE == 'expand'">
          <vxe-column type="expand" align="left" :width="config.WIDTH" :title="config.LABEL">
            <template #content="{ row }">
              <slot name="expand" :row="row"></slot>
            </template>
          </vxe-column>
        </template>

        <!-- :filters="nameOptions" :filter-render="{name: 'FilterInput'}" -->

        <template v-else>

          <vxe-column :field="config.FIELD" :align="config.ALIGN" :width="setColWidth(config)" :title=" setColTitle(config)  " :fixed="config.ISFIXED=='left'?'left':null" :height="30" :resizable="true" :key="indexC" :tree-node=" tableCFG.treeID?.treenodeId == config.FIELD "
            :visible="setTableColShow(config)" :sortable="config.ISSORT == 1">
            <template #header="{ column }">
              <Header :column="column" :config="config" :tableCFG="tableCFG" @filterEvent="filterEvent" @handleSortEvent="headerCellClickEvent" />
            </template>

            <template #default="{ row }">
              <template v-if="tableStyle == 1 ">
                <!-- 线性风格 -->
                <div class="line-style-wrap">
                  <template v-if="!config.LINESTYLE">
                    {{ row[config.FIELD] }}
                  </template>
                  <template v-else>
                    <el-row>
                      <el-col class="line-style-cell" :span="itemHtml.col*1 " v-for="(itemHtml, htminIn) in lineStyleCFG(config).list " :key="htminIn">
                        <span class="cell-label">{{ itemHtml.label  }}： </span>

                        <template v-if="itemHtml.isImg==1 ">
                          <ImagePreview class="line-style-img" :src="row[itemHtml.id]" :width="20" :height="20" />
                        </template>

                        <template v-else-if="itemHtml.isLink">
                          <el-link type="primary" @click.stop="linkEvent(itemHtml, row)">
                            {{  resetCellVal( row, itemHtml ).name }}
                          </el-link>
                        </template>

                        <template v-else-if="resetCellVal( row, itemHtml ).color">
                          <el-tag :type="resetCellVal( row, itemHtml ).color" effect="light" round>
                            {{  resetCellVal( row, itemHtml ).name }}
                          </el-tag>
                        </template>
                        <span class="cell-value" v-else> {{ resetCellVal( row, itemHtml ).name   }} </span>
                      </el-col>
                    </el-row>
                  </template>
                </div>
              </template>

              <template v-else-if="config.CONTROLS == 'ExUploadFile'">
                <el-link type="primary" v-if="row[config.FIELD]" @click.stop="handleFileList(row, config)">{{ getFileLength(row,[config.FIELD]) }}个文件</el-link>
              </template>

              <template v-else-if="tableCFG.treeID?.treenodeId == config.FIELD">
                <template v-if="tableCFG.treeID.groupName">
                  {{ row[tableCFG.treeID.groupName] || '' }}
                </template>
                <template v-else-if="tableCFG.treeID.treenodeId">
                  {{ row[tableCFG.treeID.treenodeId] || '' }}
                </template>
              </template>

              <!-- 超链接 -->
              <template v-else-if="config.VTYPE == 'link'">
                <el-link type="primary" @click.stop="openLink(config, row)">{{row[config.FIELD]}}</el-link>
              </template>

              <!-- 插槽 -->
              <template v-else-if="config.VTYPE == 'ExNumberTh'">
                {{  toThousands(row[config.FIELD])  }}
              </template>

              <!-- 插槽 -->
              <template v-else-if="config.VTYPE == 'slot'">
                <slot :name="config.FIELD" :row="row"></slot>
              </template>

              <!-- 单元格拼接 -->

              <div v-else-if="config.VTYPE == 'ExJoint'" class="ExJoint-wrap">
                <template v-for="(itemHtml, htminIn) in formatHTML(row, config)" :key="htminIn">
                  <div v-if="itemHtml.row == 1">
                    <span v-html="itemHtml.label" v-if="itemHtml.label"> </span>
                    <span :style="{
                      color: htmlColor(row[itemHtml.value], itemHtml.color),
                    }" @click.stop="
                      itemHtml.isLink
                        ? openLinkByHtml(row, itemHtml.isLink)
                        : null
                    ">
                      {{
                      itemHtml.isDict == 1
                        ? htmlDictName(row[itemHtml.value], itemHtml.value)
                        : row[itemHtml.value]
                    }}
                    </span>
                  </div>
                  <template v-else>
                    <span v-html="itemHtml.label" v-if="itemHtml.label"> </span>
                    <template v-if="itemHtml.isTag == 1">
                      <el-tag class="ml-2" :type="htmlDictColor(row[itemHtml.value], itemHtml.value)" effect="dark" round v-if="htmlDictName(row[itemHtml.value], itemHtml.value) != '-'">
                        {{
                        itemHtml.isDict == 1
                        ? htmlDictName(row[itemHtml.value], itemHtml.value)
                        : row[itemHtml.value]
                      }}
                      </el-tag>
                    </template>

                    <text v-else :style="{
                      color: htmlColor(row[itemHtml.value], itemHtml.color)? '#fff' : '#333',
                      background: htmlColor(row[itemHtml.value], itemHtml.color) ,
                    }" @click.stop="
                      itemHtml.isLink
                        ? openLinkByHtml(row, itemHtml.isLink)
                        : null
                    ">
                      {{
                      itemHtml.isDict == 1
                        ? htmlDictName(row[itemHtml.value], itemHtml.value)
                        : row[itemHtml.value]
                    }}
                    </text>
                  </template>
                </template>
              </div>

              <!-- 富文本内容提取 -->
              <template v-else-if="config.VTYPE == 'ExEditor'">
                {{ getSimpleText(row[config.FIELD]) }}
              </template>

              <!-- 图片预览 -->
              <template v-else-if="config.VTYPE == 'ExImg'">
                <div class="img-box" v-if="row[config.FIELD]">
                  <ImagePreview :src="row[config.FIELD]" :width="20" :height="20" />
                </div>
                <div></div>
              </template>
              <template v-else-if="config.VTYPE == 'exNumLink'">
                <el-link :type="dict2name(config.OTHER, row[config.FIELD]).color" @click.stop="openLink(config, row)">
                  {{ setArrToDictLabel(config.OTHER, row[config.FIELD]) }}
                </el-link>
              </template>

              <!-- 枚举转译 -->
              <template v-else-if="config.VTYPE == 'exNum'">
                <el-tag class="ml-2" v-if="config.SLOT == 'tags' && row[config.FIELD]" :type="dict2name(config.OTHER, row[config.FIELD]).color" effect="dark">
                  {{ setArrToDictLabel(config.OTHER, row[config.FIELD]) }}
                </el-tag>
                <el-switch v-else-if="config.SLOT == 'switch'" v-model="row[config.FIELD]" disabled inline-prompt active-value="1" inactive-value="0" active-text="是" inactive-text="否" />
                <!-- 插槽内的状态节点 -->
                <div class="disflex" v-else-if="config.SLOT == 'statusNode'">
                  <div class="img-circle mr5 dots" :style="{
                    backgroundColor: setStatusNodes(
                      config.OTHER,
                      row[config.FIELD]
                    ).color,
                  }"></div>
                  <span :style="{
                    color: setStatusNodes(config.OTHER, row[config.FIELD])
                      .color,
                  }">{{
                    setStatusNodes(config.OTHER, row[config.FIELD]).LABEL
                  }}</span>
                </div>
                <span v-else>
                  {{ setArrToDictLabel(config.OTHER, row[config.FIELD]) }}
                </span>
              </template>

              <template v-else-if="config.VTYPE == 'ExSelectIcon'">
                <img :src="  getNumIcon( setArrToDictLabel(config.OTHER, row[config.FIELD]) )" alt="" srcset="" class="exnum-icon">
              </template>
              <template v-else-if="
                config.CONTROLS == 'ExSelectSearch' ||
                config.CONTROLS == 'ExSelectMutiple' ||
                config.CONTROLS == 'ExSelectGroup' ||
                config.CONTROLS == 'ExRegion' || 
                config.CONTROLS == 'ExArea'
              ">
                {{ row[config.REVERFIELD] }}
              </template>

              <span v-else-if="config.SUFFIX && config.SUFFIX != ''">
                <span :class=" config.SLOT  == 'EosColBg'? ' text-blod text-danger' : '' ">
                  {{ setSuffix(row, config) }}
                </span>
              </span>
              <!-- 进度条 -->
              <template v-else-if="config.VTYPE == 'progressBar'">
                <el-progress :percentage="row[config.FIELD] || 0" :color="settimgProgress(config).colors" :stroke-width="settimgProgress(config).height" />
              </template>
              <template v-else-if="config.VTYPE == 'grade'">

                <!-- <div>{{ row[config.FIELD] || '评分' }}</div> -->
                <el-button type="primary" link @click="clickGrade(row,config)">{{ row[config.FIELD] || '评分' }}</el-button>
              </template>
              <!-- 类型内状态节点 -->
              <!-- <template v-else-if="config.VTYPE == 'statusNode'">
              <div class="disflex">
                <div class="img-circle mr5 dots" :style="{backgroundColor:setStatusNode(config,row[config.FIELD]).bgColor}"></div>
                <span :style="{color:setStatusNode(config,row[config.FIELD]).color}" >{{setStatusNode(config,row[config.FIELD]).label}}</span>
              </div>
            </template> -->

              <span v-else :class=" config.SLOT  == 'EosColBg'? ' text-blod text-danger' : '' ">
                {{ row[config.FIELD] }}
              </span>
            </template>
          </vxe-column>

        </template>

      </template>

      <vxe-column title="" min-width="10px" v-if="tableCFG.hasFill  && (tableCFG.autoWidth=='0' || !tableCFG.autoWidth) ">
      </vxe-column>

      <vxe-column title="操作" :width="actionBarWidth" fixed="right" v-if="actionBar">
        <template #default="{ row, rowIndex }">
          <slot name="actionBar" :rowIndex="rowIndex" :row="row"></slot>
        </template>
      </vxe-column>
      <vxe-column title="操作" :width="setActionWidth()" fixed="right" v-if="tableToolsBTN.length">
        <template #default="{ row }">
          <el-row justify="center" :gutter="10">
            <template v-for="(itemB, indexB) in tableToolsBTN" :key="indexB">
              <el-col :span="2.5" v-if="setShowBtn(itemB, row)">
                <el-button :type="itemB.COLOR" plain :disabled="getButtonStatus(itemB, row)" @click.stop="handelEvent(itemB, row)">
                  {{ itemB.VNAME }}
                </el-button>
              </el-col>
            </template>

          </el-row>
        </template>
      </vxe-column>

      <template #empty>
        <el-empty description="没有更多数据了！" :image-size="100" v-if="tableCFG.hasEmpty" />
      </template>
    </vxe-table>

    <!-- 弹窗 -->
    <template>
      <vxe-modal destroy-on-close v-model="modalConfig.open" :width="modalConfig.width" :height="modalConfig.height" id="formModal" resize storage transfer show-zoom show-footer>
        <template #title>
          <span> {{ modalConfig.title }} </span>
        </template>
        <template #default>
          <FileUploadList v-if="modalConfig.type == 'Filelist'" v-model="FileRow[FileConfig.FIELD]" :filelist="FileRow[FileConfig.FIELD + 'Arr']" @change="(val) => setUploadFile(val, FileRow, FileConfig)" :detail="FileConfig.ISEDIT == '0' || FileConfig.EDITTABLE == '0'" />
        </template>
        <template #footer>
          <el-button v-if="modalConfig.type == 'Modal'" type="primary" size="default" @click="modalSubmit">保存</el-button>
        </template>
      </vxe-modal>
    </template>

    <!-- 生成二维码 -->
    <template>
      <vxe-modal destroy-on-close v-model="qrcodrOpen" :width="400" :height="450" id="formModalcode" resize storage transfer show-zoom show-footer>
        <template #title>
          <!-- <span> 二维码 </span> -->
          <span> {{ qrcodeData.COMPANYNAME }} </span>
        </template>
        <template #default>

          <div class="text-blod text-ll mb5">{{ qrcodeData.LINENAME }}</div>
          <div class="disflex">
            <div class="redDot"></div>
            <div class="">{{ qrcodeData.SENDCOMPANY || SENDCOMPANY }}</div>
          </div>
          <div class="disflex mb10">
            <div class="greenDot"></div>
            <div class="">{{ qrcodeData.RECVCOMPANY }}</div>
          </div>
          <el-tag v-if="qrcodeData.CARTYPEREQUIE">{{ qrcodeData.CARTYPEREQUIE }}</el-tag>
          <el-tag class="mr5 ml5" v-if="qrcodeData.MATERIALNAME">{{qrcodeData.MATERIALNAME}}</el-tag>
          <!-- <el-tag>{{qrcodeData.NORIGTAXPRICE}}吨</el-tag> -->

          <div class="qrcode-wrap mt10">
            <qrcode-vue id="canvasDom" :value="qrcodeText" :margin="1" :size="200" :foreground=" '#000000' " level="H" />
          </div>
          <div class="text-c mt10">
            APP扫码，快速接单
          </div>
          <div>

          </div>
        </template>
        <template #footer>
          <el-button @click="downLoadQRcode">保存二维码</el-button>
        </template>
      </vxe-modal>
    </template>

    <vxe-modal destroy-on-close v-model="gradeModal" :width="modalConfig.width" :height="modalConfig.height" id="formModal" resize storage transfer show-zoom>
      <template #title>
        商务评分细则
      </template>
      <template #default>
        <Invitation :currentData="gradeModalRowData" @close="invitationClose" />
      </template>
    </vxe-modal>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>
<script setup name="">
import Sortable from "sortablejs";
import FileUploadList from "@/components/FileUpload/detail";
import { selectDictLabel } from "@/utils/ruoyi";
import {
  dict2name,
  setSuffix,
  getUrlParams,
  toThousands,
  evalFun,
} from "@/utils";
import { computed } from "@vue/reactivity";
import useSettingsStore from "@/store/modules/settings";
import VueQr from "vue-qr/src/packages/vue-qr.vue";
import Invitation from "@/views/WZC/Invitation/index.vue";
import QrcodeVue from "qrcode.vue";
import Header from "./header.vue";
import { axiosSave } from "@/api/system/page";

const { proxy } = getCurrentInstance();
const settingsStore = useSettingsStore();
const storeSettings = computed(() => settingsStore);

const nameOptions = ref([{ data: null }]);
const qrcodrOpen = ref(false);
const rowHeight = ref(40);
const emit = defineEmits(["dragRow", "queryEvent", "updateTableData"]);
const props = defineProps({
  // 配置
  tableCFG: {
    type: Object,
    default: {
      height: "300px",
    },
  },
  // 数据
  tableData: {
    type: Array,
    default: [],
  },
  validRules: {
    typeo: Object,
    default: {},
  },
  // 当前的值
  value: [Number, String, Array],
  // 操作栏是否展示
  actionBar: {
    type: Boolean,
    default: false,
  },
  // 操作栏宽度
  actionBarWidth: {
    type: Number,
    default: 150,
  },
  // 分页总数据数
  totalData: {
    type: Object,
  },
  // 列表风格
  tableStyle: {
    type: Number,
    default: 0,
  },
  showMoreQuery: {
    type: Boolean,
    default: false,
  },
  tableToolsBTN: {
    type: Array,
    default: [],
  },
  // 是否展示表头筛选
  isHeaderFilter: {
    type: Boolean,
    default: false,
  },
  // 表头赛选时控件配置
  headerConfig: {
    type: Array,
    default: [],
  },
  // queryJson: {
  //   type: Object,
  //   default: {},
  // },
});
const gradeModal = ref(false);
const gradeModalRowData = ref("");
const clickGrade = (row, config) => {
  gradeModal.value = true;
  gradeModalRowData.value = row;
};

const invitationClose = (data) => {
  gradeModal.value = false;
  if (!data) return;
  proxy.$emit("updateTableData", data);
};

const xTable = ref(null);
const settimgProgress = computed((config) => {
  return (config) => {
    try {
      let { OTHER } = config;
      if (!OTHER)
        return {
          height: 8,
          colors: [
            { color: "#f56c6c", percentage: 20 },
            { color: "#e6a23c", percentage: 40 },
            { color: "#5cb87a", percentage: 60 },
            { color: "#1989fa", percentage: 80 },
            { color: "#6f7ad3", percentage: 100 },
          ],
        };
      let { height, colors } = JSON.parse(OTHER);
      return { height, colors };
    } catch (error) {
      console.error("进度条修改失败");
    }
  };
});
const setStatusNodes = computed((config, val) => {
  return (config, val) => {
    try {
      let arr = JSON.parse(config);
      let newArr = arr.filter((ele) => ele.VALUE == val);
      if (newArr.length > 0) {
        let color =
          newArr[0].COLOR == "info"
            ? "#909399"
            : newArr[0].COLOR == "primary"
            ? "#409EFF"
            : newArr[0].COLOR == "success"
            ? "#67C23A"
            : newArr[0].COLOR == "danger"
            ? "#F56C6C"
            : "#E6A23C";
        let LABEL = newArr[0].LABEL;
        let VALUE = newArr[0].VALUE;
        return { color, LABEL, VALUE };
      } else {
        return { color: "#909399", LABEL: "暂无数据", VALUE: null };
      }
    } catch (error) {
      console.error("状态节点修改失败");
    }
  };
});

const setTableColShow = computed((config) => {
  return (config) => {
    if (props.tableStyle == 1) {
      return config.LINESTYLE ? true : false;
    } else {
      return config.SELECTEDFLAG == 0 ? false : true;
    }
  };
});

const sortCFG = reactive({
  sortBy: "",
  sort: "",
});

const setDefaultChecked = (data) => {
  const $table = xTable.value;
  if ($table && Array.isArray(data)) {
    $table.setCheckboxRow(data, true);
  }
};

function refreshColumn() {
  proxy.$refs.xTable.refreshColumn();
}
// 刷新表格数据
function reloadTableData(data) {
  proxy.$refs.xTable.loadData(data);
}

const setActionWidth = computed(() => {
  return () => {
    let width = 0;
    props.tableToolsBTN.forEach((i) => {
      if (i.VNAME.length < 3) {
        width += 70;
      } else {
        width += 100;
      }
    });
    return width;
  };
});

// 线性表格的相关配置
const setColTitle = computed((config) => {
  return (config) => {
    try {
      if (props.tableStyle == 1) {
        let html = config.LINESTYLE;
        let obgJson = JSON.parse(html);
        if (!html) return config.LABEL;
        return obgJson.title || config.LABEL;
      }
      return config.LABEL;
    } catch (error) {
      return config.LABEL;
    }
  };
});

//计算表格总宽度 的比例
const tableRatio = ref(0);
function getTableRatio() {
  try {
    let data = props.tableCFG.tableColumns;
    let tableWidthOffsetSum = window.innerWidth - 190;
    let sum = data.reduce(function (acc, obj) {
      return (acc += Number(obj.WIDTH));
    }, 0);
    sum -= 40;
    tableRatio.value = (tableWidthOffsetSum / sum).toFixed(2);
  } catch (error) {
    console.log("tableRatio", tableRatio.value);
  }
}

const setColWidth = computed((config) => {
  return (config) => {
    try {
      if (props.tableStyle == 1) {
        let html = config.LINESTYLE;
        let obgJson = html ? JSON.parse(html) : {};
        if (!html) return obgJson.width;
        return obgJson.width || config.WIDTH;
      }
      if (props.tableCFG.autoWidth == 1) {
        return config.WIDTH * tableRatio.value + "";
      }
      return config.WIDTH;
    } catch (error) {
      console.log(444, error);
      return config.WIDTH;
    }
  };
});

const linkEvent = (data, row) => {
  if (!data.isLink) return null;
  let giveParentData = {
    clicktype: "openLink",
    linkCFG: data.isLink,
    data: row,
    getBtn: "1",
  };
  proxy.$emit("change", giveParentData);
};

// tableStyle>0? rowHeight : 42
const resetRowHeight = computed(() => {
  return () => {
    try {
      if (props.tableStyle == 1) {
        let hasLineStyle = props.tableCFG.tableColumns.filter(
          (i) => i.LINESTYLE
        );
        let maxRow = 1,
          height = 42;
        hasLineStyle.forEach((i) => {
          let Item = JSON.parse(i.LINESTYLE);
          if (Item.maxRow && Item.maxRow > maxRow * 1) {
            maxRow = Item.maxRow;
          }
        });
        return maxRow > 1 ? maxRow * 30 : height;
      }
      return 42;
    } catch (error) {
      return 42;
    }
  };
});

// 设置是否显示按钮
const setShowBtn = computed((btn, row) => {
  return (btn, row) => {
    if (btn.ISSHOW == 0) return false;
    if (btn.ISSHOW == 1) return true;
    if (btn.ISSHOW == 2 && btn.OTHER) {
      try {
        return evalFun(row, btn.OTHER) || false;
      } catch (error) {
        console.error("setShowBtn", error);
      }
      return true;
    } else {
      return false;
    }
  };
});

// 操作栏按钮
const getButtonStatus = (item, row) => {
  let { SCRNCONDITION } = item;
  if (SCRNCONDITION && evalFun(row, SCRNCONDITION)) {
    return true;
  }
  return false;
};

// 列表中的操作按钮
function handelEvent(btn, row) {
  if (btn.VTYPE == 28) {
    return openQrCode(btn, row);
  }
  let giveParentData = {
    clicktype: "clinkBTN",
    linkCFG: btn,
    data: row,
  };
  proxy.$emit("change", giveParentData);
}

// 生成二维码
const qrcodeText = ref(null);
const qrcodeData = ref({});
function openQrCode(btn, row) {
  let params = getUrlParams(btn.ACTIONADDRESS);
  let saveData = {
    BILLNO: row.BILLNO,
    MODULEID: "11",
    PAGEID: btn.ACTION,
    ...params,
  };
  axiosSave(btn.ACTIONADDRESS, saveData).then((res) => {
    let { DATA, ISTIMSE, TIMSE } = res.RESULT;
    qrcodeText.value = DATA;
    qrcodrOpen.value = true;
    qrcodeData.value = res.RESULT;
  });
}

const downLoadQRcode = () => {
  const canvas = document.getElementById("canvasDom");
  const url = canvas.toDataURL("image/png"); // 通过 toDataURL 返回一个包含图片展示的 data URI
  const aDom = document.createElement("a");
  aDom.download = "二维码"; // 设置下载的文件名
  aDom.href = url;
  document.body.appendChild(aDom);
  aDom.click();
  aDom.remove();
};

function rowClassName({ row }) {
  let DATA = row;
  if (
    DATA &&
    proxy.tableCFG.rowClassEval &&
    eval(proxy.tableCFG.rowClassEval)
  ) {
    return "row-red";
  }
  return null;
}

function cellClassName({ row, column }) {
  const hasCellClass = proxy.tableCFG.tableColumns.filter(
    (el) => el.FIELD == column.field && el.SLOT && el.SLOT == "cellBg"
  );
  if (hasCellClass.length == 0) return "";
  let DATA = row;
  if (DATA && eval(hasCellClass[0].SLOTCFG)) return "cell-red";
}

// 表格单选按钮
function radioChangeEvent({ row, rowIndex }) {
  let giveParentData = {
    clicktype: "radio",
    data: [row],
    checked: true,
    rowIndex,
  };
  proxy.$emit("change", giveParentData);
}

// 处理枚举数据转换的校验
function setArrToDictLabel(Arr, value) {
  try {
    if (!value) return "";
    let newArr = JSON.parse(Arr);
    value = String(value);
    if (value.includes(",")) {
      let a = [],
        valueArr = value.split(",");
      valueArr.forEach((i) => {
        a.push(selectDictLabel(newArr, i));
      });
      return a.join(",");
    } else {
      return selectDictLabel(newArr, value);
    }
  } catch (error) {
    return "";
  }
}

function checkboxChange({ checked, row, rowIndex }) {
  let newAllColumns = props.tableCFG.allColumns || props.tableCFG.tableColumns;
  let checkboxCFG = newAllColumns?.filter((i) => {
    return i.VTYPE == "checkbox";
  })[0];
  if (
    checkboxCFG &&
    checkboxCFG.LINKAGE &&
    checkboxCFG.LINKAGE.includes("url")
  ) {
    checkboxResetValue(checkboxCFG.LINKAGE, rowIndex, checked);
  }
  let selectRecords = proxy.$refs.xTable.getCheckboxRecords();
  let giveParentData = {
    clicktype: "checkbox",
    data: selectRecords,
    checked,
    rowIndex,
  };

  proxy.$emit("change", giveParentData);
  if (checked && selectRecords.length && checkboxCFG && checkboxCFG.OTHER) {
    // 判断是否进行关联自动选中
    let autoSelectID = checkboxCFG.OTHER,
      autoSelectVal = selectRecords[0][autoSelectID];
    let autoSelectArr = this.tableData.filter((i) => {
      return i[autoSelectID] == autoSelectVal;
    });
    proxy.$refs.xTable.setCheckboxRow(autoSelectArr, true);
  }

  if (
    checked &&
    selectRecords.length != 1 &&
    checkboxCFG &&
    checkboxCFG.scrnCondition
  ) {
    if (eval(checkboxCFG.scrnCondition)) {
      proxy.$refs.xTable.setCheckboxRow(row, false);
      ElMessage({
        message: "该单据不可与其它单据一起执行业务",
        type: "warning",
      });
      return;
    }
  }
}

// 多选事件的数据回填
function checkboxResetValue(config, index, checked) {
  try {
    let newConfig = JSON.parse(config);
    let newRow = props.tableData[index];
    axiosSave(newConfig.url, { BILLNO: newRow.BILLNO, CHECKED: checked }).then(
      (res) => {
        let newRes = res.RESULT;
        for (const key in newConfig.setvalue) {
          let keyID = newConfig.setvalue[key];
          newRow[key] = checked ? newRes[keyID] : "";
        }
      }
    );
  } catch (error) {}
}

// 表尾的合计数据显示功能
function footerMethod({ columns }) {
  const footerData = [
    columns.map((column, _columnIndex) => {
      if (_columnIndex === 0) {
        return "合计";
      }
      if (props.tableCFG.mergeCFG.includes(column.field)) {
        try {
          return props.totalData[column.field];
        } catch (er) {
          return "";
        }
      }
      return null;
    }),
  ];
  return footerData;
}

// 打开列控制
function openDrawer() {
  let giveParentData = {
    clicktype: "openDrawer",
    data: {},
  };
  proxy.$emit("change", giveParentData);
}

//  行点击事件触发单选功能
const rowClickIndex = ref(null);

function rowClick({ row, triggerCheckbox, rowIndex }) {
  // if (props.tableCFG.treeID?.transform && row.PK_PARENT == "0") {
  //   return;
  // }
  proxy.$emit("clickRow", row);

  if (proxy.tableCFG.SelectType == "radio") return;
  let selectRecords = proxy.$refs.xTable.getCheckboxRecords(),
    checked = false;
  if (selectRecords.length == 0) {
    rowClickIndex.value = null;
  }
  if (!triggerCheckbox) {
    proxy.$refs.xTable?.clearCheckboxRow();
    if (rowClickIndex.value != rowIndex) {
      rowClickIndex.value = rowIndex;
      checked = true;
      proxy.$refs.xTable.toggleCheckboxRow(row);
    }
    let giveParentData = {
      clicktype: "checkbox",
      data: checked ? [row] : [],
      checked: checked,
      rowIndex,
    };

    // 判断当前展开的是否是选中的数据，否则关闭所有展开
    let expandRow = proxy.$refs.xTable.getRowExpandRecords();
    if (expandRow.length) {
      if (expandRow[0].BILLNO != row.BILLNO) {
        proxy.$refs.xTable.clearRowExpand();
      }
    }
    proxy.$emit("change", giveParentData);
  }
}
// 点击超链接事件
function openLink(cf, row) {
  if (cf.OTHER) {
    let giveParentData = {
      clicktype: "openLink",
      linkCFG: cf.VTYPE == "exNumLink" ? cf.REVERFIELD : cf.OTHER,
      data: row,
    };
    proxy.$emit("change", giveParentData);
  } else {
    openDetail(row);
  }
}

function toolbarCustomEvent() {
  return false;
}

function openDetail(row) {
  let giveParentData = {
    clicktype: "detail",
    data: row,
  };
  proxy.$emit("change", giveParentData);
  proxy.$emit("dbClick", row);
}

let expandBillNo = null;
function toggleExpandChangeEvent({ expanded, row, columnIndex }) {
  let expandCFG = {};
  if (!expandBillNo) {
    proxy.$refs.xTable.toggleRowExpand();
  } else if (expandBillNo == row.BILLNO) {
    proxy.$refs.xTable.toggleRowExpand();
  } else {
    proxy.$refs.xTable.clearRowExpand(row);
    proxy.$refs.xTable.setRowExpand([row], true);
  }
  expandBillNo = row.BILLNO;
  let giveParentData = {
    clicktype: "expand",
    data: { expanded, ...row },
    expandCFG: expandCFG,
  };
  proxy.$emit("change", giveParentData);
}

// 服务端排序
function sortChange({ property, order }) {
  let giveParentData = {
    clicktype: "sort",
    data: { sortBy: property, sort: order },
  };
  if (order != null) {
    proxy.$emit("change", giveParentData);
    proxy.$emit("sort", row);
  }
}

// 获取枚举的图标
function getNumIcon(url) {
  return proxy.getAssetsFile(url);
}

// 自定义服务端排序
function headerCellClickEvent(val) {
  let column = val;
  // let { column } = val;
  // let isHeaderFilter = props.tableCFG.isHeaderFilter;
  // if (isHeaderFilter) return;
  if (
    column.type == "seq" ||
    column.type == "checkbox" ||
    column.type == "seq"
  ) {
    return;
  }

  let property = column.field,
    order = "asc";
  if (sortCFG.sortBy && sortCFG.sortBy == column.field) {
    sortCFG.sort = sortCFG.sort == "asc" ? "desc" : "asc";
  } else {
    sortCFG.sortBy = property;
    sortCFG.sort = "asc";
  }
  let giveParentData = {
    clicktype: "sort",
    data: { sortBy: sortCFG.sortBy, sort: sortCFG.sort },
  };
  if (order != null) {
    proxy.$emit("change", giveParentData);
  }
}

// 支持列头筛选的查询条件 ID

const inputCtrl = ref("ExTextBox,ExSelectGroup,ExSelectMutiple,");
const selectCtrl = ref("ExSelect");
const searchCtrl = ref("ExSelectSearch");
const DateCtrl = ref("ExDate,ExDateTime,ExTime");

// 过滤事件
const filterNameMethod = ({ value, row }) => {
  proxy.$emit("queryEvent");
  return row;
};

const filterEvent = () => {
  proxy.$emit("queryEvent");
};

// 时间确认事件
function DateChange(val, config) {
  let { FIELD, CONTROLS, LINKAGE } = config;
  if (CONTROLS == "ExDateRange" || CONTROLS == "ExDateTimeRange") {
    props.tableCFG.queryJson[FIELD] = !val ? "" : val.join(",");
  } else {
    props.tableCFG.queryJson[FIELD] = !val ? "" : val;
  }
  if (LINKAGE) {
    cleanEvent(config);
    if (CONTROLS == "ExDate") DateCalc(config);
  }
  filterEvent();
}

// 推断日期组件类型
const mapDateType = computed((config, isRange = false) => {
  return (config, isRange) => {
    let { SLOTCFG, SUFFIX } = config,
      Ctype = SLOTCFG || SUFFIX,
      type = "",
      format = "";
    switch (Ctype) {
      case "year":
        type = isRange ? "daterange" : "year";
        format = "YYYY";
        break;
      case "month":
        type = isRange ? "monthrange" : "month";
        format = "YYYY-MM";
        break;
      default:
        type = isRange ? "daterange" : "date";
        format = "YYYY-MM-DD";
        break;
    }
    return { type, format };
  };
});

function mergeRowMethod({ row, _rowIndex, column, visibleData }) {
  const fields = props.tableCFG.mergeRowField || [];
  const cellValue = row[column.field];

  // 分组的合并 父级节点合并
  if (props.tableCFG.treeID) {
    let colspanNum = props.tableCFG.tableColumns.length - 3;
    if (row.PARENTID == 0 && props.tableCFG.treeID.treenodeId == column.field) {
      return { rowspan: 1, colspan: colspanNum };
    }
  }

  if (cellValue && fields.includes(column.field)) {
    const prevRow = visibleData[_rowIndex - 1];
    let nextRow = visibleData[_rowIndex + 1];
    if (prevRow && prevRow[column.field] === cellValue) {
      return { rowspan: 0, colspan: 0 };
    } else {
      let countRowspan = 1;
      while (nextRow && nextRow[column.field] === cellValue) {
        nextRow = visibleData[++countRowspan + _rowIndex];
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 };
      }
    }
  }
}

function clearCheckRow() {
  proxy.$refs.xTable?.clearCheckboxRow();
  proxy.$refs.xTable?.clearRadioRow(); // 清除点选选中效果
}

// 拼接单元格时字体颜色的提取
const htmlColor = (val, cf) => {
  if (!cf || !val) return "";
  let objColor = cf.includes("=") ? getUrlParams("?" + cf)[val] : cf;
  return objColor;
};

// 拼接单元格时字体枚举的提取
const htmlDictName = (val, id) => {
  let otherParams = props.tableCFG.allColumns.filter((i) => {
    return i.FIELD == id;
  });
  val = otherParams.length ? setArrToDictLabel(otherParams[0].OTHER, val) : "";
  return val;
};
// 拼接的字典颜色
const htmlDictColor = (val, id) => {
  if (!val) return "";
  let otherParams = props.tableCFG.allColumns.filter((i) => {
    return i.FIELD == id;
  });
  try {
    let dictConifg = JSON.parse(otherParams[0].OTHER);
    let color = dictConifg.filter((i) => i.VALUE == val)[0].COLOR;
    return color;
  } catch (error) {
    return "";
  }
};

//
const openLinkByHtml = (row, bid) => {
  let cf = { OTHER: bid, VTYPE: "", REVERFIELD: "" };
  openLink(cf, row);
};

// 单元格拼接方法
const formatHTML = (row, config) => {
  let html = config.OTHER;
  try {
    let obgArr = JSON.parse(html);
    return obgArr;
  } catch (error) {
    return [];
  }
};

// 线性表格
const lineStyleCFG = (config) => {
  let html = config.LINESTYLE;
  if (!html) return [];
  try {
    let obgArr = JSON.parse(html);
    return obgArr;
  } catch (error) {
    console.error("lineStyleCFG异常", error);
    return [];
  }
};

// 提前富文本的文字
function getSimpleText(html) {
  var re1 = new RegExp("<.+?>", "g"); //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
  var msg = html ? html.replace(re1, "") : ""; //执行替换成空字符
  return msg;
}

// 提取线性表格的 value
function resetCellVal(row, config) {
  try {
    const { id, color } = config;

    if (!id.includes(",") && !id.includes("#")) {
      let newID = id.includes("$") ? id.replace("$", "") : id;
      return {
        name: row[newID],
        color: color,
      };
    }

    let newarr = id.split(","),
      newStr = "",
      colors = "";
    newarr.forEach((item) => {
      if (item.includes("$")) {
        //拼接变量
        let fileid = item.replace("$", "");
        newStr = newStr.concat(row[fileid]);
      } else if (item.includes("#")) {
        //拼接字典
        let fileid = item.replace("#", "");
        let arr = props.tableCFG.allColumns.filter(
          (ele) => ele.FIELD == fileid
        );
        if (arr.length == 0 || !arr[0].OTHER) return;

        if (row[fileid]) {
          let newOther = JSON.parse(arr[0].OTHER);
          newStr = newStr.concat(DictLabels(newOther, row[fileid]));
        }
        colors = dict2name(arr[0].OTHER, row[fileid]).color || "";
      } else {
        newStr = newStr.concat(item);
      }
    });
    return {
      name: newStr,
      color: colors,
    };
  } catch (error) {
    console.error("resetCellVal异常", error);
  }
}

// 多个字典拼接
const DictLabels = (arr, data, jg = ",", label = "LABEL", value = "VALUE") => {
  arr = arr == undefined ? [] : arr;
  return proxy.selectDictLabels(arr, data, jg, label, value);
};

// 弹窗
const modalRef = ref(null);
const modalConfig = reactive({
  type: "",
  open: false,
  title: "",
  MENUID: "",
  PAGEID: "",
  width: "90%",
  height: "90%",
});
const FileRow = ref({});
const FileConfig = ref({});
const handleFileList = (row, config) => {
  FileRow.value = row;
  FileConfig.value = config;
  console.log("🚀 ~ handleFileList ~ config:", config);
  let { FIELD, LABEL } = config;
  modalConfig.type = "Filelist";
  modalConfig.title = LABEL;
  modalConfig.width = "40%";
  modalConfig.height = "50%";
  modalConfig.open = true;
};

// 重新计算
const SUMConfig = computed(() =>
  props.tableCFG.tableColumns.filter(
    (el) => el.LINKAGE && el.LINKAGE.includes('"SUM":')
  )
);
const resetSUM = (arr = SUMConfig.value, row = props.tableData[0]) => {
  if (arr.length == 0) return;
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    numberBlur(el, row);
  }
};
function calcNUM(row, equ) {
  try {
    const Data = row;
    return evilFn(Data, equ);
  } catch (err) {
    console.warn("Err:运算错误", err);
  }
}
// 级联计算
const numberBlur = (config, row) => {
  let { FIELD, LINKAGE } = config,
    point = 2;
  if (!LINKAGE) return;
  // 小数点控制
  if (LINKAGE.includes("POINT")) {
    try {
      let Linkage = JSON.parse(LINKAGE);
      point = Linkage.POINT;
      row[FIELD] = row[FIELD].toFixed(point) * 1;
    } catch (err) {
      console.error("Error:POINT解析", err);
    }
  }
  // 计算
  if (LINKAGE.includes("CALC")) {
    try {
      let Linkage = JSON.parse(LINKAGE),
        calcArr = Linkage.CALC.split("&");
      for (let i = 0; i < calcArr.length; i++) {
        const el = calcArr[i].split("=");
        let [equ, res] = el;
        if (el.length) {
          let num = calcNUM(row, equ);
          if (res.includes("M$")) {
            emit("change", {
              [res.slice(2, res.length)]:
                Math.round(num * 10 ** point) / 10 ** point,
            });
          } else {
            row[res] = Math.round(num * 10 ** point) / 10 ** point;
          }
        }
      }
    } catch (err) {
      console.error("Error:CALC解析", err);
    }
  }
  // 统计
  if (LINKAGE.includes("SUM")) {
    try {
      let Linkage = JSON.parse(LINKAGE),
        sumArr = Linkage.SUM.split("="),
        [equ, res] = sumArr;
      if (sumArr.length) {
        let num = 0;
        for (let i = 0; i < props.tableData.length; i++) {
          const el = props.tableData[i];
          const addnum = el[equ] ? Number(el[equ]) : 0;
          num += addnum;
        }
        if (res.includes("M$")) {
          emit("change", {
            type: "SUM",
            data: {
              [res.slice(2, res.length)]:
                Math.round(num * 10 ** point) / 10 ** point,
            },
          });
        } else {
          row[res] = Math.round(num * 10 ** point) / 10 ** point;
        }
      }
    } catch (err) {
      console.error("Error:SUM解析", err);
    }
  }
};

/** 拖拽功能 */
let sortable1;
const rowDrop = () => {
  if (!props.tableCFG.hasDragRow) return;
  const $table = xTable.value;
  sortable1 = new Sortable.create(
    $table.$el.querySelector(".body--wrapper>.vxe-table--body tbody"),
    {
      handle: ".drag-btn",
      onEnd: (sortableEvent) => {
        const newIndex = sortableEvent.newIndex;
        const oldIndex = sortableEvent.oldIndex;
        const currRow = props.tableData.splice(oldIndex, 1)[0];
        props.tableData.splice(newIndex, 0, currRow);
        emit("dragRow", {
          row: currRow,
          oldIndex,
          newIndex,
        });
      },
    }
  );
};

// 下拉查询事件
const SelectLoading = ref(false);
const SelectValueTo = ref(null);
const SelectFocus = (config) => {
  SelectQuery("", config);
};

const router = useRouter();
const MENUID = router.currentRoute.value.meta.BILLNO;

const SelectQuery = (keyword = undefined, config) => {
  if (keyword == undefined) return;
  let { FIELD, DEFAULTVAL, CONTROLS, OTHER } = config;
  if (OTHER == "") return;
  let { url, data } = ParseOtherConfig(OTHER);
  if (url == "") return;
  SelectLoading.value = true;
  proxy
    .request({
      url: url,
      method: "post",
      data: {
        KEYWORD: keyword,
        MODULEID: MENUID,
        ...data,
      },
      headers: {
        repeatSubmit: false,
      },
    })
    .then(({ RESULT }) => {
      props.tableCFG.queryJson.EnumData[FIELD] = RESULT;
    })
    .catch(() => {
      props.tableCFG.queryJson.EnumData[FIELD] = [];
    })
    .finally(() => {
      SelectLoading.value = false;
    });
};

const SelectChange = () => {
  filterEvent();
};

// 解析 Other 配置
function ParseOtherConfig(config) {
  if (!config) {
    SelectValueTo.value = [];
    return { url: "", data: {}, importantData: {} };
  }
  try {
    let newConfig = JSON.parse(config)[0];
    if (newConfig.setvalue && JSON.stringify(newConfig.setvalue) != "{}") {
      let arr = [];
      for (const key in newConfig.setvalue) {
        arr.push({ k: key, v: newConfig.setvalue[key] });
      }
      SelectValueTo.value = arr;
    }
    return {
      url: newConfig.url,
      data: newConfig?.params,
      importantData: newConfig?.importantData,
    };
  } catch (error) {
    if (config.indexOf("/") == "0") {
      let paramsArr = config.split("?"),
        url = "",
        setQueryParam = {},
        queryJson = {},
        setImportantParam = {},
        importantData = {};
      if (paramsArr.length == 0) {
        url = config;
        SelectValueTo.value = [];
      } else if (paramsArr.length > 0) {
        url = paramsArr[0];
        if (paramsArr.length > 1) {
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[1], "obj");
          queryJson = obj;
          importantData = importantObj;
        }
        if (paramsArr.length > 2) {
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[2], "obj");
          setQueryParam = obj;
          setImportantParam = importantObj;
          queryJson = { ...queryJson, ...ConvertData(setQueryParam) };
          importantData = {
            ...importantData,
            ...ConvertData(setImportantParam),
          };
        }
        paramsArr[3]
          ? (SelectValueTo.value = GetUrlParams("a?" + paramsArr[3], "arr"))
          : [];
      }
      return { url, data: queryJson, importantData };
    } else {
      console.error("配置解析错误!", error);
    }
  }
}

// 获取url 后面的参数
function GetUrlParams(url, backType) {
  let reg = /([^&?=]+)=([^&?=]+)/g,
    obj = {},
    importantObj = {},
    arr = [];
  url.replace(reg, function () {
    if (arguments[1].includes("!")) {
      let key = arguments[1].substr(1); //删除第一个字符
      importantObj[key] = arguments[2];
    } else {
      obj[arguments[1]] = arguments[2];
    }
    let objs = {};
    objs.k = arguments[1];
    objs.v = arguments[2];
    arr.push(objs);
  });
  return backType == "obj" ? { obj, importantObj } : arr;
}

/** 获取附件数量 */
const getFileLength = computed((row, FIELD) => {
  return (row, FIELD) => {
    return row[FIELD] ? row[FIELD].split(",").length : 0;
  };
});

/** 转换数据 */
function ConvertData(obj) {
  let data = {};
  for (let ii in obj) {
    let valueKey = obj[ii];
    if (valueKey.includes("M$")) {
      valueKey = calcHasMSKey(valueKey);
      data[ii] = props.mainFormData[valueKey] || "";
    } else if (valueKey.includes("S$")) {
      valueKey = calcHasMSKey(valueKey);
      data[ii] = props.formData[valueKey] || "";
    } else {
      data[ii] = props.formData[valueKey] || "";
    }
  }
  return data;
}

let initTime;
nextTick(() => {
  // 加载完成之后在绑定拖动事件
  initTime = setTimeout(() => {
    rowDrop();
  }, 300);
});
onUnmounted(() => {
  clearTimeout(initTime);
  if (sortable1) {
    sortable1.destroy();
  }
});

// 页面离开后
onDeactivated(() => {
  clearCheckRow();
});

// 页面进入后
onActivated(() => {
  // console.log(456, '页面进入' );
});
// 主动暴露方法
defineExpose({
  refreshColumn,
  reloadTableData,
  xEditTable: xTable,
  clearCheckRow,
  resetSUM,
  setDefaultChecked,
});
</script>

<style lang="scss" scoped>
/* // 移除vxtable  可编辑表格的 编辑图标 */
.vxe-header--column .vxe-cell--edit-icon {
  display: none;
}
:deep(.vxe-header--column) {
  font-weight: normal !important;
  color: #000;
}

:deep(.vxe-cell) {
  margin-top: -2px;
}

.row-red {
  background-color: #187;
  color: #fff;
}
:deep(.vxe-body--column.cell-red) {
  background: red !important;
  color: #fff !important;
}
.img-box {
  display: flex;
  align-items: center;
  overflow: hidden;
}
.dots {
  width: 6px;
  height: 6px;
}

.vxe-header--row {
  height: 42px !important;
}

.line-style-wrap {
  .cell-label {
    color: #8a8e99;
  }
  .cell-value {
    color: #333;
    font-weight: 400;
  }
  .line-style-cell {
    display: flex;
    align-items: center;
  }
}

.qrcode-wrap {
  display: flex;
  justify-content: center;
}

.redDot,
.greenDot {
  background-color: #f56c6c;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}
.greenDot {
  background-color: #67c23a;
}

:deep(
    .vxe-table--render-default
      .vxe-body--column.col--ellipsis
      > .vxe-cell
      .vxe-tree-cell
  ) {
  text-align: left;
}

.exnum-icon {
  height: 20px;
  margin-top: 4px;
}
</style>
