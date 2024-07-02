<template>
  <div class="edit_table">
    <vxe-table ref="xEditTable" size="mini" border show-overflow keep-source width="100%" :loading="tableCFG.loading" :height="tableCFG.height" :column-config="{ resizable: true }" v-model:data="tableData" class="mytable-scrollbar mytable-footer" :edit-rules="validRules" :edit-config="{
      trigger: 'click',
      mode: 'row',
      showUpdateStatus: true,
      showInsertStatus: true,
    }" :sort-config="{ showIcon: false }">
      <vxe-column v-if="tableCFG?.hasSeq" title="" width="50" type="seq" align="center" fixed="left"></vxe-column>

      <template v-for="(Ci, indexCi) in tableCFG.tableColumns" :key="indexCi">
        <vxe-column :field="Ci.FIELD" :title="Ci.LABEL" :edit-render="{}" :width="Ci.WIDTH" v-if="Ci.ISEDIT == '1' || Ci.EDITTABLE == 1" :fixed="Ci.FIXED" :sortable="Ci.ISSORT == 1 ">
          <template #edit="{ row, rowIndex }">
            <!-- slot 只允许本地配置使用 -->
            <slot v-if="Ci.CONTROLS == 'slot'" :name="`edit_${Ci.FIELD}`" :rowIndex="rowIndex" :row="row"></slot>

            <!-- ExTextBox 输入框  -->
            <el-input v-else-if="Ci.CONTROLS == 'ExTextBox'" v-model.trim="row[Ci.FIELD]" clearable :disabled="Ci.DISABLED == 1" placeholder="请输入" style="width: 100%"></el-input>

            <!-- ExPassword 密码  -->
            <el-input v-else-if="Ci.CONTROLS == 'ExPassword'" v-model.trim="row[Ci.FIELD]" clearable :disabled="Ci.DISABLED == 1" placeholder="请输入" type="password" style="width: 100%"></el-input>

            <!-- ExDate 日期选择 -->
            <el-date-picker v-else-if="Ci.CONTROLS == 'ExDate'" v-model="row[Ci.FIELD]" clearable :disabled="Ci.ISDISABLED == 1" type="date" value-format="YYYY-MM-DD" :disabled-date=" time => disabledDate(time,Ci,row)" placeholder="请选择" style="width: 100%" />

            <!-- ExDateRange 日期区间 -->
            <!-- <el-date-picker v-else-if="Ci.CONTROLS == 'ExDateRange'" @change="(v) => DateChange(v, Ci.FIELD, rowIndex)" v-model="row.EnumData?.[Ci.FIELD]" clearable :disabled="Ci.ISDISABLED == 1" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD" style="width: 100%" /> -->

            <!-- ExDateTime 日期时间选择  -->
            <el-date-picker v-else-if="Ci.CONTROLS == 'ExDateTime'" v-model="row[Ci.FIELD]" clearable :disabled="Ci.ISDISABLED == 1" type="datetime" placeholder="请选择" :disabled-date=" time => disabledDate(time,Ci,row)" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />

            <!-- ExDateTimeRange 日期时间区间 -->
            <!-- <el-date-picker v-else-if="Ci.CONTROLS == 'ExDateTimeRange'" @change="(v) => DateChange(v, Ci.FIELD, rowIndex)" v-model="row.EnumData?.[Ci.FIELD]" clearable :disabled="Ci.ISDISABLED == 1" :prefix-icon="9" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" :default-time="defaultTime" /> -->

            <!-- ExTextarea 文本域  -->
            <el-input v-else-if="Ci.CONTROLS == 'ExTextarea'" v-model.trim="row[Ci.FIELD]" :disabled="Ci.DISABLED == 1" :rows="3" type="textarea" placeholder="请输入" />

            <!-- ExNumber 数字输入框 -->
            <el-input v-else-if="Ci.CONTROLS == 'ExNumber'" v-model.number="row[Ci.FIELD]" clearable :disabled="Ci.DISABLED == 1" style="width: 100%" type="number" @blur="numberBlur(Ci, row)">
              <template #append v-if="Ci.SUFFIX && Ci.SUFFIX != ''">{{Ci.SUFFIX}}</template>
            </el-input>

            <!-- ExSelect 选择 -->
            <el-select v-else-if="Ci.CONTROLS == 'ExSelect'" v-model="row[Ci.FIELD]" clearable :disabled="Ci.DISABLED == 1" :popper-append-to-body="false" placeholder="请选择" style="width: 100%" @change="(val) => SelectChange(Ci, val, rowIndex)">
              <el-option v-for="item in row.EnumData?.[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
            </el-select>

            <!-- ExSelectMultiple ??? 下拉枚举多选 -->
            <el-select v-else-if="Ci.CONTROLS == 'ExSelectMultiple'" v-model="row[Ci.FIELD + 'Arr']" clearable multiple :disabled="Ci.DISABLED == 1" placeholder="请选择" style="width: 100%" @change="(val) => SelectChange(Ci, val, rowIndex)">
              <el-option v-for="item in row.EnumData?.[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
            </el-select>

            <!-- ExSelectSearch 下拉查询 -->
            <el-select v-else-if="Ci.CONTROLS == 'ExSelectSearch'" v-model="row[Ci.FIELD]" clearable filterable remote :remote-method="(val) => SelectQuery(val, Ci)" :loading="SelectLoading" :disabled="Ci.DISABLED == 1" placeholder="请选择" style="width: 100%" @focus="SelectFocus(Ci)" @change="(val) => SelectChange(Ci, val, rowIndex)">
              <el-option v-for="item in SelectOptions[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
            </el-select>

            <!-- ExSelectTable 下拉表格 -->
            <template v-else-if="Ci.CONTROLS == 'ExSelectTable'">
              <vxe-pulldown ref="DropdownRef" destroy-on-close :transfer="true">
                <template #default>
                  <el-input v-model="row[Ci.FIELD]" type="text" placeholder="请输入" clearable @clear="SelectChange(Ci,null,rowIndex)" @input="getSelectTableData(Ci,rowIndex)">
                    <template #append>
                      <el-button :icon="ArrowDown" @click.stop="getSelectTableData(Ci,rowIndex)" />
                    </template>
                  </el-input>
                </template>
                <template #dropdown>
                  <div :style="`width:${ExSelectModalConfig.width?ExSelectModalConfig.width:'100%'}`">
                    <VTable :tableCFG="ExSelectModalConfig" :tableData="SelectModalList" @dbClick="row=>SelectChange(Ci,row, rowIndex)" />
                  </div>
                </template>
              </vxe-pulldown>
            </template>

            <!-- ExSelectModelTab 下拉表格 + 搜索弹窗 -->
            <template v-else-if="Ci.CONTROLS == 'ExSelectModal'">
              <vxe-pulldown ref="DropdownRef" destroy-on-close :transfer="true">
                <template #default>
                  <el-input v-model="row[Ci.FIELD]" type="text" placeholder="请输入" clearable @clear="SelectChange(Ci,null,rowIndex)" @input="getSelectTableData(Ci,rowIndex)">
                    <template #append>
                      <el-button :icon="Search" @click.stop="openModal(Ci,rowIndex)" />
                    </template>
                  </el-input>
                </template>
                <template #dropdown>
                  <div :style="`width:${ExSelectModalConfig.width?ExSelectModalConfig.width:'100%'}`">
                    <VTable :tableCFG="ExSelectModalConfig" :tableData="SelectModalList" @dbClick="row=>SelectChange(Ci,row, rowIndex)" />
                  </div>
                </template>
              </vxe-pulldown>
            </template>

            <!-- ExModalTable 表格弹窗 -->
            <template v-else-if="Ci.CONTROLS == 'ExModalTable'">
              <el-input v-model="row[Ci.FIELD]" type="text" placeholder="请选择" clearable @clear="SelectChange(Ci,'',rowIndex)" readonly style="width: 100%">
                <template #append>
                  <el-button :icon="Search" @click="openModal(Ci,rowIndex)" />
                </template>
              </el-input>
            </template>

            <!-- ExSwitch 开关 -->
            <el-switch v-else-if="Ci.CONTROLS == 'ExSwitch'" v-model="row[Ci.FIELD]" :disabled="Ci.DISABLED == 1" inline-prompt active-text="是" inactive-text="否" active-value="1" inactive-value="0" />
          </template>

          <template #default="{ row }">
            <!-- slot 只允许本地配置使用 -->
            <slot v-if="Ci.CONTROLS == 'slot'" :name="`default_${Ci.FIELD}`" :rowIndex="rowIndex" :row="row"></slot>
            <!-- <span v-else-if="Ci.CONTROLS == 'ExSelect' &&  row[Ci.FIELD]">
              <el-tag class="ml-2">
                {{ dict2name(Ci.OTHER, row[Ci.FIELD]).name }}
              </el-tag>
            </span> -->
            <template v-else-if="Ci.CONTROLS == 'ExSelect' || Ci.CONTROLS == 'ExRadio'">
              {{ DictLabel(row?.EnumData?.[Ci.FIELD], row[Ci.FIELD]) }}
            </template>
            <template v-else-if="Ci.CONTROLS == 'ExSelectMultiple' || Ci.CONTROLS == 'ExCheckbox'">
              {{ DictLabels(row.EnumData?.[Ci.FIELD], row[Ci.FIELD]) }}
            </template>
            <span v-else-if="Ci.CONTROLS == 'ExSwitch'">
              <el-switch v-model="row[Ci.FIELD]" inline-prompt active-text="是" inactive-text="否" active-value="1" inactive-value="0" disabled />
            </span>
            <span v-else-if="Ci.CONTROLS == 'ExSelectSearch' || Ci.CONTROLS == 'ExSelectMutiple' || Ci.CONTROLS == 'ExSelectGroup' || Ci.CONTROLS == 'ExRegion'">
              {{ row[Ci.REVERFIELD] }}
            </span>
            <template v-else>
              <div class="content">
                {{ row[Ci.FIELD]}}
                <template v-if="Ci.SUFFIX && Ci.SUFFIX != ''">{{Ci.SUFFIX}}</template>
              </div>
            </template>
          </template>
        </vxe-column>

        <vxe-column :field="Ci.FIELD" :title="Ci.LABEL" :width="Ci.WIDTH" :align="Ci.ALIGN == '' ? 'center' : Ci.ALIGN" v-else>
        </vxe-column>
      </template>

      <vxe-column title="操作" :width="actionBarWidth" fixed="right" v-if="tableCFG?.tableButtons.length > 0">
        <template #default="{ row, rowIndex }">
          <slot name="actionBar" :rowIndex="rowIndex" :row="row"></slot>
        </template>
      </vxe-column>

      <template #empty>
        <el-empty description="没有更多数据了！" :image-size="100" />
      </template>
    </vxe-table>

    <!-- 弹窗 -->
    <template>
      <vxe-modal destroy-on-close v-model="modalConfig.open" :width="modalConfig.width" :height="modalConfig.height" id="formModal" resize storage transfer show-zoom show-footer>
        <template #title>
          <span> {{ modalConfig.title }} </span>
        </template>
        <template #default>
          <ModalTable ref="modalRef" :MODULE="modalConfig.MENUID" :PAGE="modalConfig.PAGEID" @submit="data=>SelectChange(openModalConfig,data,openModalIndex)" />
        </template>
        <template #footer>
          <el-button type="primary" size="default" @click="modalSubmit">保存</el-button>
        </template>
      </vxe-modal>
    </template>
  </div>
</template>

<script setup name="">
import { Search, ArrowDown } from "@element-plus/icons-vue";
import { dict2name, setSuffix } from "@/utils"
import VTable from "@/components/Tables"
import ModalTable from "@/components/Form/modal.vue"
import { getPageConfig, getTableData } from "@/api/system/page";
import { GetDateAfter } from "@/utils/index";
const props = defineProps({
  // 配置
  tableCFG: {
    type: Object,
    default: undefined,
  },
  tableData: {
    type: Array,
  },
  validRules: {
    typeo: Object,
  },
  loading: {
    type: Boolean,
  },
  actionBarWidth: {
    type: Number,
    default: 150
  }
});
const emit = defineEmits(["change"])
const { proxy } = getCurrentInstance();
const xEditTable = ref();
const router = useRouter();
const MENUID = router.currentRoute.value.meta.BILLNO;

watch(() => props.tableCFG, () => {
  LoadInitSelectData();
});

const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]

const LoadInitSelectData = () => {
  let arr = props.tableCFG.tableColumns.filter((el) => (el.CONTROLS == 'ExSelectModal' || el.CONTROLS == 'ExSelectTable'));
  if (arr.length == 0) return
  let indexArr = []
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    indexArr.push(el.FIELD)
  }
  DropdownRefIndex.value = indexArr
};
const SelectLoading = ref(false);
const SelectOptions = ref({});
const SelectFocus = (config) => {
  SelectQuery("", config);
};
const SelectQuery = (keyword = undefined, config) => {
  let { FIELD, OTHER } = config;
  if (OTHER == "") return;
  let { url, data } = ParseOtherConfig(OTHER);
  SelectLoading.value = true;
  proxy.request({
    url: url,
    method: "post",
    data: {
      KEYWORD: keyword,
      MODULEID: MENUID,
      ...data,
    },
    headers: {
      repeatSubmit: false
    }
  }).then((res) => {
    SelectOptions.value[FIELD] = res.RESULT;
  }).catch(() => {
    SelectOptions.value[FIELD] = [];
  }).finally(() => {
    SelectLoading.value = false;
  });
};

function tableEvent(row, Ci) {
  proxy.$emit("tableBtnchange", { row: row, btn: Ci });
}

const SelectValueTo = ref([]);
const SelectChange = (config, val, rowIndex) => {
  const { FIELD, CONTROLS, OTHER } = config;
  ParseOtherConfig(OTHER, rowIndex);
  let data = Array.isArray(val) ? [] : null;
  if (val != "" || val.length > 0)
    switch (CONTROLS) {
      case "ExSelect":
        data = props.tableData[rowIndex].EnumData[FIELD].find(el => el.VALUE == val)
        break;
      case "ExSelectMultiple":
        var arr = []
        for (let i = 0; i < val.length; i++) {
          const ele = val[i]
          let Di = props.tableData[rowIndex].EnumData[FIELD].find(el => el.VALUE == ele)
          arr.push(Di)
        }
        data = arr
        setSelectMutipleValue(FIELD, val, rowIndex);
        break;
      case "ExSelectSearch":
        data = SelectOptions.value[FIELD].find((el) => el.VALUE == val);
        break;
      case "ExSelectMutiple":
        var arr = []
        for (let i = 0; i < val.length; i++) {
          const ele = val[i]
          let Di = SelectOptions.value[FIELD].find(el => el.VALUE == ele)
          arr.push(Di)
        }
        data = arr
        setSelectMutipleValue(FIELD, val, rowIndex);
        break;
      case "ExSelectGroup":
        data = treeFind(SelectOptions.value[FIELD], el => el.VALUE == val)
        break;
      case "ExSelectTable":
      case "ExSelectModal":
        data = val
        setTimeout(() => {
          let index = DropdownRefIndex.value.findIndex(el => el == FIELD)
          DropdownRef?.value[index]?.togglePanel()
          modalConfig.open = false
        }, 200)
        break;
      case "ExModalTable":
        data = val
        setTimeout(() => {
          modalConfig.open = false
        }, 200)
        break;
    }
  config.LINKAGE && cleanEvent(config, rowIndex)
  setSelectValue(data, rowIndex);
};

// 多选组件 回写值
const setSelectMutipleValue = (id, val, rowIndex) => {
  props.tableData[rowIndex][id] = val.join(",");
};
// 根据OTHER赋值
const setSelectValue = (data, rowIndex) => {
  if (SelectValueTo.value.length == 0) return;
  for (let i = 0; i < SelectValueTo.value.length; i++) {
    const { k: key, v: value } = SelectValueTo.value[i];
    if (data != null) {
      if (Array.isArray(data)) {
        if (data.length == "0") {
          props.tableData[rowIndex][key] = "";
        } else {
          let arr = [];
          for (let i = 0; i < data.length; i++) {
            const el = data[i];
            arr.push(el[value]);
          }
          props.tableData[rowIndex][key] = arr.join(",");
        }
      } else {
        props.tableData[rowIndex][key] = data?.[value];
      }
    } else {
      props.tableData[rowIndex][key] = '';
    }
  }
  SelectValueTo.value = [];
};

// 重新计算
const resetSUM = arr => {
  if (arr.length == 0) return
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    numberBlur(el, props.tableData[0])
  }
}
// 级联计算
const numberBlur = (config, row) => {
  let { FIELD, LINKAGE } = config, point = 2;
  if (!LINKAGE) return;
  // 小数点控制
  if (LINKAGE.includes('POINT')) {
    try {
      let Linkage = JSON.parse(LINKAGE);
      point = Linkage.POINT;
      props.formData[FIELD] = props.formData[FIELD].toFixed(point) * 1
    } catch (err) {
      console.error('Error:POINT解析', err);
    }
  }
  // 计算
  if (LINKAGE.includes('CALC')) {
    try {
      let Linkage = JSON.parse(LINKAGE),
        calcArr = Linkage.CALC.split('='),
        [equ, res] = calcArr;
      if (calcArr.length) {
        let num = calcNUM(row, equ)
        if (res.includes("M$")) {
          emit("change", { [res.slice(2, res.length)]: Math.round(num * (10 ** point)) / (10 ** point) })
        } else {
          row[res] = Math.round(num * (10 ** point)) / (10 ** point);
        }
      }
    } catch (err) {
      console.error('Error:CALC解析', err);
    }
  }
  // 统计
  if (LINKAGE.includes('SUM')) {
    try {
      let Linkage = JSON.parse(LINKAGE),
        sumArr = Linkage.SUM.split('='),
        [equ, res] = sumArr;
      if (sumArr.length) {
        let num = 0
        for (let i = 0; i < props.tableData.length; i++) {
          const el = props.tableData[i];
          num += el[equ]
        }
        if (res.includes("M$")) {
          emit("change", { [res.slice(2, res.length)]: Math.round(num * (10 ** point)) / (10 ** point) })
        } else {
          row[res] = Math.round(num * (10 ** point)) / (10 ** point);
        }
      }
    } catch (err) {
      console.error('Error:SUM解析', err);
    }
  }
}
function calcNUM(row, equ) {
  try {
    const Data = row
    return eval(equ)
  } catch (err) {
    console.warn("Err:运算错误", err);
  }
}

// 级联清空
const cleanEvent = (config, rowIndex) => {
  // 判断是否有需要控制的级联     {"CLEAN":"OUTERPHONE,MANAGER"}
  if (config.LINKAGE.includes('CLEAN')) {
    try {
      let newObjLinkage = JSON.parse(config.LINKAGE), cleanArr = newObjLinkage.CLEAN.split(',');
      if (cleanArr.length) {
        cleanArr.forEach(item => {
          props.tableData[rowIndex][item] = ''
        });
      }
    } catch (err) {
      console.error('Error:级联控制是否必填异常了', err);
    }
  }
}


// other 回显
const DictLabel = (arr, data) => {
  arr = arr == undefined ? [] : arr
  return proxy.selectDictLabel(arr, data);
};
const DictLabels = (arr, data, jg = ",", label = "LABEL", value = "VALUE") => {
  arr = arr == undefined ? [] : arr
  return proxy.selectDictLabels(arr, data, jg, label, value);
};

// 解析 Other 配置
function ParseOtherConfig(config, rowIndex) {
  let paramsArr = config.split("?"),
    url = "",
    setQueryParam = {},
    queryJson = {};
  if (paramsArr.length == 0) {
    url = config;
    SelectValueTo.value = [];
  } else if (paramsArr.length > 0) {
    url = paramsArr[0];
    if (paramsArr.length > 1) queryJson = GetUrlParams("a?" + paramsArr[1], "obj");
    if (paramsArr.length > 2) {
      setQueryParam = GetUrlParams("a?" + paramsArr[2], "obj");
      for (let ii in setQueryParam) {
        queryJson[ii] = props.tableData[rowIndex][setQueryParam[ii]] || "";
      }
    }
    SelectValueTo.value = paramsArr[3] ? GetUrlParams("a?" + paramsArr[3], "arr") : [];
  }
  return { url, data: queryJson };
}

// 获取url 后面的参数
function GetUrlParams(url, backType) {
  let reg = /([^&?=]+)=([^&?=]+)/g,
    obj = {},
    arr = [];
  url.replace(reg, function () {
    obj[arguments[1]] = arguments[2];
    let objs = {};
    objs.k = arguments[1];
    objs.v = arguments[2];
    arr.push(objs);
  });
  return backType == "obj" ? obj : arr;
}

// 下拉表格
const DropdownRefIndex = ref([])
const DropdownRef = ref()
const SelectTableKey = ref()
const SelectTableConfig = ref({})
const SelectModalList = ref([])
const ExSelectModalConfig = reactive({
  tableColumns: [],
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  width: '500px',
  height: '300',
});
const getSelectTableConfig = (config, rowIndex) => {
  nextTick(() => {
    let { FIELD, OTHER, SLOTCFG } = config
    if (SLOTCFG == '' || OTHER == '') return console.error("Error:配置错误")
    if (SelectTableKey.value != FIELD) {
      SelectTableKey.value = FIELD
      let ids = SLOTCFG.split(",")
      if (ids.length < 2) return console.error("Error: 配置错误")
      let [MODULEID, PAGEID, downCss] = ids
      let downCssArr = downCss ? downCss.split("*") : ['500px', '300px']
      ExSelectModalConfig.width = downCssArr[0]
      ExSelectModalConfig.height = parseInt(downCssArr[1])
      getPageConfig({
        MODULEID,
        PAGEID,
      }).then(res => {
        SelectTableConfig.value = res
        ExSelectModalConfig.tableColumns = res.COLUMNS.filter(el => el.ISSHOW == '1')
        getSelectTableData(config, rowIndex)
      }).catch(err => {
        SelectTableKey.value = ''
      })
    } else {
      getSelectTableData(config, rowIndex)
    }
  })
}
const getSelectTableData = (config, rowIndex) => {
  let { FIELD, OTHER } = config
  if (props.tableData[rowIndex][FIELD] == '') return
  if (SelectTableKey.value != FIELD) return getSelectTableConfig(config, rowIndex)
  let { url, data: queryParams } = ParseOtherConfig(OTHER, rowIndex);
  let { PK_MODULE, BILLNO } = SelectTableConfig.value
  let data = {
    KEYWORD: props.tableData[rowIndex][FIELD],
    PAGENUM: 1,
    PAGESIZE: 10000,
    SORTNAME: "",
    SORTORDER: "",
    MODULEID: PK_MODULE,
    PAGEID: BILLNO,
    ...queryParams
  };
  getTableData(url, data).then(res => {
    SelectModalList.value = res.RECORDS
  }).finally(() => {
    let index = DropdownRefIndex.value.findIndex(el => el == FIELD)
    DropdownRef?.value[index]?.togglePanel()
  })
}

// 弹窗
const modalRef = ref(null)
const modalConfig = reactive({
  open: false,
  title: "",
  MENUID: "",
  PAGEID: "",
  width: '90%',
  height: '90%'
})
const openModalIndex = ref("")
const openModalConfig = ref({})
const openModal = (config, rowIndex) => {
  openModalConfig.value = config
  let { LABEL, SLOTCFG } = config
  modalConfig.title = LABEL
  if (SLOTCFG == '') return console.error("Error: 配置错误")
  let ids = SLOTCFG.split(",")
  if (ids.length != 2) return console.error("Error: 配置错误")
  modalConfig.MENUID = ids[0]
  modalConfig.PAGEID = ids[1]
  openModalIndex.value = rowIndex
  modalConfig.open = true
}
const modalSubmit = () => {
  const data = modalRef.value.rows
  if (data.length > 0) {
    SelectChange(openModalConfig.value, data.slice(-1)[0], openModalIndex.value)
  }
  modalConfig.open = false
}

// 日期的禁用条件判断
const disabledDate = (time, config, row) => {
  let { CONTROLS, OTHER } = config
  if (CONTROLS != 'ExDate' || CONTROLS != 'ExDateTime') return
  if (!OTHER) return false
  try {
    let cf = JSON.parse(OTHER);
    const date = new Date();
    if (cf.minVar && Number.isNaN(parseInt(cf.minVar))) { // 判断是否是变量，还是数字 如果是NaN  说明是变量值
      let minVal = row[cf.minVar]
      if (minVal) return time.getTime() < new Date(minVal).getTime()
    } else {
      let dnum = parseInt((cf.minVar * 1) - 1), minTime = GetDateAfter(dnum);
      return time.getTime() < new Date(minTime).getTime()
    }
  } catch (err) {
    console.error('日期的禁用条件判断', err);
    return true
  }
}

// 时间确认事件
function DateChange(val, id, i) {
  props.tableData[i][id] = val.join(",");

}

LoadInitSelectData();
defineExpose({ xEditTable, resetSUM });
</script>

<style lang="scss" scoped>
:deep(.vxe-header--column .vxe-cell--edit-icon) {
  display: none !important;
}
</style>
