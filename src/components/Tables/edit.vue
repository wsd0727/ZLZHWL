<template>
  <div class="edit_table">
    <vxe-table ref="xEditTable" size="mini" border show-overflow keep-source width="100%" :loading="tableCFG.loading" :row-config="{ isCurrent: true, isHover: true , height:  26 }" :height="tableCFG.height" :column-config="{ resizable: true }" v-model:data="tableData" :show-footer="tableCFG.mergeCFG && tableCFG.mergeCFG.length" :footer-method="footerMethod" class="mytable-scrollbar mytable-footer" @header-cell-click="headerCellClickEvent" @header-cell-dblclick="headColDbClickEvent" :edit-rules="validRules" :auto-resize="true" :edit-config="{trigger: 'click',mode: 'row',showUpdateStatus: true,showInsertStatus: true}" :sort-config="{ showIcon: false }" :checkbox-config="!tableCFG.SelectType || tableCFG.SelectType != 'radio'? {highlight: true,}: null" @checkbox-all="checkboxChange" @checkbox-change="checkboxChange" @edit-closed="editClose">
      <vxe-column v-if="tableCFG?.hasSeq" title="" width="50" type="seq" align="center" fixed="left"></vxe-column>
      <vxe-column v-if="tableCFG?.hasCheck" type="checkbox" align="center" width="50" fixed="left"></vxe-column>

      <template v-for="(Ci, indexCi) in tableCFG.tableColumns" :key="indexCi">
        <vxe-column :field="Ci.FIELD" :title="Ci.LABEL" :edit-render="{}" :width="Ci.WIDTH*1" v-if="Ci.ISEDIT == '1' || Ci.EDITTABLE == 1" :align="Ci.ALIGN == '' ? 'center' : Ci.ALIGN" :sortable="Ci.ISSORT == 1">
          <template #edit="{ row, rowIndex }">
            <!-- slot 只允许本地配置使用 -->
            <slot v-if="Ci.CONTROLS == 'slot'" :name="`edit_${Ci.FIELD}`" :rowIndex="rowIndex" :row="row"></slot>

            <!--ExModalIcon 图标 -->
            <el-input v-else-if="Ci.CONTROLS == 'ExModalIcon' && Ci.OTHER == 'type:icon'" v-model="row[Ci.FIELD]" type="text" :disabled="calcDISABLED(Ci,rowIndex)" placeholder="请输入" style="width: 100%" @click="openFont">
              <template #append>
                <i class="fa" :class="data.VICON"></i>
              </template>
            </el-input>

            <!-- ExTextBox 输入框  -->
            <el-input v-else-if="Ci.CONTROLS == 'ExTextBox'" v-model="row[Ci.FIELD]" clearable :disabled="calcDISABLED(Ci,rowIndex)" :maxlength="calcNumberMax(Ci)" placeholder="请输入" style="width: 100%"></el-input>

            <!-- ExPassword 密码  -->
            <el-input v-else-if="Ci.CONTROLS == 'ExPassword'" v-model.trim="row[Ci.FIELD]" clearable :disabled="calcDISABLED(Ci,rowIndex)" placeholder="请输入" type="password" style="width: 100%"></el-input>

            <!-- ExTime 时间选择 -->
            <template v-else-if="Ci.CONTROLS == 'ExTime'">
              <el-time-picker v-model="row[Ci.FIELD]" clearable :disabled="calcDISABLED(Ci,rowIndex)" style="width: 100%" value-format="HH:mm:ss" @change="(v)=>DateChange(v,Ci,rowIndex)" />
            </template>

            <!-- ExDate 日期选择 -->
            <el-date-picker v-else-if="Ci.CONTROLS == 'ExDate'" v-model="row[Ci.FIELD]" clearable :disabled="calcDISABLED(Ci,rowIndex)" :type="mapDateType(Ci).type" :value-format="mapDateType(Ci).format" :disabled-date="time => disabledDate(time, Ci, row)" placeholder="请选择" style="width: 100%" @change="(v)=>DateChange(v,Ci,rowIndex)" />

            <!-- ExDateRange 日期区间 -->
            <el-date-picker v-else-if="Ci.CONTROLS == 'ExDateRange'" @change="v => DateChange(v, Ci, rowIndex)" v-model="row[Ci.FIELD+'Arr']" clearable @clear="DateChange(null,Ci,rowIndex)" unlink-panels :disabled="calcDISABLED(Ci,rowIndex)" :disabled-date="time => disabledDate(time, Ci, row)" :type="mapDateType(Ci,true).type" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" :value-format="mapDateType(Ci,true).format" style="width: 100%" />

            <!-- ExDateTime 日期时间选择  -->
            <el-date-picker v-else-if="Ci.CONTROLS == 'ExDateTime'" v-model="row[Ci.FIELD]" clearable :disabled="calcDISABLED(Ci,rowIndex)" type="datetime" placeholder="请选择" :disabled-date="time => disabledDate(time, Ci, row)" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" @change="v=>DateChange(v,Ci,rowIndex)" />

            <!-- ExDateTimeRange 日期时间区间 -->
            <el-date-picker v-else-if="Ci.CONTROLS == 'ExDateTimeRange'" @change="v => DateChange(v, Ci, rowIndex)" v-model="row[Ci.FIELD+'Arr']" clearable @clear="DateChange(null,Ci,rowIndex)" :disabled="calcDISABLED(Ci,rowIndex)" :disabled-date="time => disabledDate(time, Ci, row)" :prefix-icon="9" unlink-panels type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" :default-time="defaultTime" />

            <!-- ExTextarea 文本域  -->
            <el-input v-else-if="Ci.CONTROLS == 'ExTextarea'" v-model="row[Ci.FIELD]" :disabled="calcDISABLED(Ci,rowIndex)" :rows="3" type="textarea" placeholder="请输入" />

            <!-- ExNumber 数字输入框 -->
            <!-- <el-input v-else-if="Ci.CONTROLS == 'ExNumber'" v-model.number="row[Ci.FIELD]" clearable :disabled="calcDISABLED(Ci,rowIndex)" style="width: 100%" type="number" :min="calcNumberMin(Ci)" :max="Number(Ci.MAXLENGTH)" @blur="numberBlur(Ci, row)" @input="calcPoint(Ci, row)">
              <template #append v-if="Ci.SUFFIX && Ci.SUFFIX != ''">{{setSuffix(row, Ci,true)}}</template>
            </el-input> -->
            <div class="mo-input--number" v-else-if="Ci.CONTROLS == 'ExNumber'">
              <el-input-number :controls="false" v-model="row[Ci.FIELD]" clearable type="number" :disabled="calcDISABLED(Ci, rowIndex)" :min="calcNumberMin(Ci)" :max="calcNumberMax(Ci)" @input="calcPoint($event, Ci, row)" @blur="inputBlur(Ci,row)" @clear="inputBlur(Ci,row)" style="width: 100%" @keydown.enter="enterNextEl">
              </el-input-number>
              <!-- <div class="define-append" v-if="Ci.SUFFIX">{{setSuffix(row, Ci,true)}}</div> -->
            </div>

            <!-- ExSelect 选择 -->
            <el-select v-else-if="Ci.CONTROLS == 'ExSelect'" v-model="row[Ci.FIELD]" clearable :disabled="calcDISABLED(Ci,rowIndex)" placeholder="请选择" style="width: 100%" @change="(val) => SelectChange(Ci, val, rowIndex)">
              <el-option v-for="item in EnumData[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
              <!-- <el-option v-if="rowIndex > 0" label="同上" value="DATAVALUETOINDEX-1" /> -->
            </el-select>

            <!-- ExSelectMultiple ??? 下拉枚举多选 -->
            <el-select v-else-if="Ci.CONTROLS == 'ExSelectMultiple'" v-model="row[Ci.FIELD + 'Arr']" clearable multiple :multiple-limit="Ci.MAXLENGTH == '' ? 0 : Ci.MAXLENGTH * 1" :disabled="calcDISABLED(Ci,rowIndex)" automatic-dropdown placeholder="请选择" style="width: 100%" @change="(val) => SelectChange(Ci, val, rowIndex)">
              <el-option v-for="item in EnumData[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
            </el-select>

            <!-- ExSelectSearch 下拉查询 -->
            <el-select v-else-if="Ci.CONTROLS == 'ExSelectSearch'" v-model="row[Ci.FIELD]" clearable filterable remote remote-show-suffix :remote-method="(val) => SelectQuery(val, Ci, rowIndex)" :loading="SelectLoading" :disabled="calcDISABLED(Ci,rowIndex)" :allow-create="selectCreated(Ci.SLOTCFG)" placeholder="请选择" style="width: 100%" @focus="SelectFocus(Ci,rowIndex)" @change="(val) => SelectChange(Ci, val, rowIndex)">
              <el-option v-for="item in SelectOptions[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
              <!-- <el-option v-if="rowIndex > 0" label="同上" value="DATAVALUETOINDEX-1" /> -->
            </el-select>

            <!-- ExSelectMutiple 多项选择 -->
            <template v-else-if="Ci.CONTROLS == 'ExSelectMutiple'">
              <el-select v-model="row[Ci.FIELD + 'Arr']" clearable multiple filterable collapse-tags collapse-tags-tooltip remote remote-show-suffix :remote-method="(val) => SelectQuery(val, Ci, rowIndex)" :loading="SelectLoading" :disabled="calcDISABLED(Ci,rowIndex)" :multiple-limit="Ci.MAXLENGTH == '' ? 0 : Ci.MAXLENGTH * 1" style="width: 100%" @focus="SelectFocus(Ci,rowIndex)" @change="(val) => SelectChange(Ci, val, rowIndex)">
                <el-option v-for="item in SelectOptions?.[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
              </el-select>
            </template>

            <!-- ExRegion 级联选择 -->
            <el-cascader v-else-if="Ci.CONTROLS == 'ExRegion'" v-model="row[Ci.FIELD + 'Arr']" clearable :disabled="calcDISABLED(Ci,rowIndex)" placeholder="" @focus="SelectFocus(Ci,rowIndex)" :options="SelectOptions?.[Ci.FIELD]" style="width: 100%" @change="(val) => SelectChange(Ci, val, rowIndex)" :props="{ label: 'LABEL',value: 'VALUE',children: 'CHILDREN' }" />

            <!-- ExSelectTable 下拉表格 -->
            <template v-else-if="Ci.CONTROLS == 'ExSelectTable'">
              <vxe-pulldown ref="DropdownRef" destroy-on-close :transfer="true">
                <template #default>
                  <el-input v-model="row[Ci.REVERFIELD]" type="text" placeholder="请输入" clearable :disabled="calcDISABLED(Ci,rowIndex)" @clear="SelectChange(Ci, null, rowIndex)" @input="getSelectTableData(Ci, rowIndex)" @blur="resetSelectTableData(Ci, rowIndex)">
                    <template #append>
                      <el-button :icon="ArrowDown" :disabled="calcDISABLED(Ci,rowIndex)" @click="getSelectTableData(Ci, rowIndex)" />
                    </template>
                  </el-input>
                </template>
                <template #dropdown>
                  <div :style="`width:${ExSelectModalConfig.width? ExSelectModalConfig.width: '100%'}`">
                    <VTable :tableCFG="ExSelectModalConfig" :tableData="SelectModalList" @clickRow.self="row => SelectChange(Ci, row, rowIndex)" />
                  </div>
                </template>
              </vxe-pulldown>
            </template>

            <!-- ExSelectModelTab 下拉表格 + 搜索弹窗 -->
            <template v-else-if="Ci.CONTROLS == 'ExSelectModal'">
              <vxe-pulldown ref="DropdownRef" destroy-on-close :transfer="true">
                <template #default>
                  <el-input v-model="row[Ci.REVERFIELD]" type="text" placeholder="请输入" clearable :disabled="calcDISABLED(Ci,rowIndex)" @clear="SelectChange(Ci, null, rowIndex)" @input="getSelectTableData(Ci, rowIndex)" @blur="resetSelectTableData(row[Ci.REVERFIELD],Ci, rowIndex)">
                    <template #append>
                      <el-button :icon="Search" :disabled="calcDISABLED(Ci,rowIndex)" @click="openModal(Ci, rowIndex)" />
                    </template>
                  </el-input>
                </template>
                <template #dropdown>
                  <div :style="`width:${ExSelectModalConfig.width? ExSelectModalConfig.width: '100%'}`">
                    <VTable :tableCFG="ExSelectModalConfig" :tableData="SelectModalList" @clickRow.self="row => SelectChange(Ci, row, rowIndex)" />
                  </div>
                </template>
              </vxe-pulldown>
            </template>

            <!-- ExModalTable 表格弹窗 -->
            <template v-else-if="Ci.CONTROLS == 'ExModalTable'">
              <el-input v-model="row[Ci.REVERFIELD]" type="text" placeholder="请选择" clearable @clear="SelectChange(Ci, '', rowIndex)" readonly style="width: 100%">
                <template #append>
                  <el-button :icon="Search" :disabled="calcDISABLED(Ci,rowIndex)" @click="openModal(Ci, rowIndex)" />
                </template>
              </el-input>
            </template>

            <!-- ExSelectGroup 分组选择  -->
            <template v-else-if="Ci.CONTROLS == 'ExSelectGroup'">
              <el-tree-select v-model="row[Ci.FIELD]" check-strictly clearable filterable remote-show-suffix remote default-expand-all :remote-method="(val) => SelectQuery(val, Ci, rowIndex)" :loading="SelectLoading" :data="SelectOptions[Ci.FIELD]" @focus="SelectFocus(Ci, rowIndex)" :disabled="calcDISABLED(Ci,rowIndex)" @change="(val) => SelectChange(Ci, val, rowIndex)" style="width: 100%" :render-after-expand="false" :placeholder="' '" :props="{ label: 'LABEL', children: 'CHILDREN' }" value-key="VALUE" highlightCurrent />
            </template>

            <!-- ExFileUpload 文件上传 -->
            <TableFileUpload v-else-if="Ci.CONTROLS == 'ExUploadFile'" v-model="row[Ci.FIELD]" :filelist="row[Ci.FIELD+'Arr']" :data="uploadData" :ajaxUrl="Ci.OTHER" :limit="Ci.MAXLENGTH == '' ? 5 : Ci.MAXLENGTH * 1" :fileType="Ci.SLOTCFG" style="width: 100%" @change="val=>setUploadFile(val,row,Ci)" />

            <!-- ExSwitch 开关 -->
            <el-switch v-else-if="Ci.CONTROLS == 'ExSwitch'" v-model="row[Ci.FIELD]" :disabled="calcDISABLED(Ci,rowIndex)" inline-prompt active-text="是" inactive-text="否" active-value="1" inactive-value="0" />

            <div class="content read" v-else>
              <!-- ExShowImage 图片预览 -->
              <ImagePreview v-if="Ci.VTYPE == 'ExImg'" :src="row[Ci.FIELD]" :width="20" :height="20" />
              <template v-else>
                <span v-if="Ci.SUFFIX">{{ setSuffix(row, Ci, true) }}</span>
                <span v-else>{{ row[Ci.FIELD] ? row[Ci.FIELD] : ''}}</span>
              </template>
            </div>
          </template>

          <template #default="{ row }">
            <!-- slot 只允许本地配置使用 -->
            <slot v-if="Ci.CONTROLS == 'slot'" :name="`default_${Ci.FIELD}`" :rowIndex="rowIndex" :row="row"></slot>
            <!-- 多选 -->
            <template v-if="Ci.CONTROLS == 'ExSelect' || Ci.CONTROLS == 'ExRadio'">
              <el-tag class="ml-2" v-if="Ci.SLOT == 'tags' && row[Ci.FIELD]" :type="DictLabel(EnumData[Ci.FIELD], row[Ci.FIELD],'COLOR')" effect="dark">
                {{ DictLabel(EnumData[Ci.FIELD], row[Ci.FIELD]) }}
              </el-tag>
              <template v-else>
                {{ DictLabel(EnumData[Ci.FIELD], row[Ci.FIELD]) }}
              </template>
            </template>
            <template v-else-if="Ci.CONTROLS == 'ExSelectMultiple' || Ci.CONTROLS == 'ExCheckbox'">
              {{ DictLabels(EnumData[Ci.FIELD], row[Ci.FIELD]) }}
            </template>
            <template v-else-if="Ci.CONTROLS == 'ExSwitch'">
              <el-switch v-model="row[Ci.FIELD]" inline-prompt active-text="是" inactive-text="否" active-value="1" inactive-value="0" disabled />
            </template>
            <template v-else-if="Ci.CONTROLS == 'ExSelectSearch' || Ci.CONTROLS == 'ExSelectMutiple' || Ci.CONTROLS == 'ExSelectGroup' || Ci.CONTROLS == 'ExRegion' || Ci.CONTROLS == 'ExSelectTable' || Ci.CONTROLS == 'ExSelectModal'">
              {{ row[Ci.FIELD] == 'DATAVALUETOINDEX-1'?'同上':row[Ci.REVERFIELD] }}
            </template>
            <template v-else-if="Ci.CONTROLS == 'ExUploadFile'">
              <el-link type="primary" v-if="row[Ci.FIELD]" @click.stop="handleFileList(row,Ci)">{{ row[Ci.FIELD+'Arr'].length }}个文件</el-link>
            </template>
            <template v-else-if="Ci.CONTROLS == 'ExNumber'">
              <span class="numbox">
                {{ !row[Ci.FIELD]?"":row[Ci.FIELD] }}
                <div class="define-append" v-if="Ci.SUFFIX">{{setSuffix(row, Ci, false)}}</div>
              </span>
            </template>
            <template v-else>
              <template v-if="Ci.VTYPE == 'exNum'">
                <el-tag class="ml-2" v-if="Ci.SLOT == 'tags'" :type="DictLabels(EnumData[Ci.FIELD], row[Ci.FIELD],',','COLOR')">
                  {{ DictLabels(EnumData[Ci.FIELD], row[Ci.FIELD]) }}
                </el-tag>
                <span v-else>
                  {{ DictLabels(EnumData[Ci.FIELD], row[Ci.FIELD]) }}
                </span>
              </template>
              <ImagePreview v-else-if="Ci.VTYPE == 'ExImg'" :src="row[Ci.FIELD]" :width="20" :height="20" />
              <div class="content" v-else>
                <span v-if="Ci.SUFFIX">{{ setSuffix(row, Ci,true) }}</span>
                <span v-else>{{ row[Ci.FIELD] ? row[Ci.FIELD] : ''}}</span>
              </div>
            </template>
          </template>
        </vxe-column>

        <vxe-column :field="Ci.FIELD" :title="Ci.LABEL" :width="Ci.WIDTH" :align="Ci.ALIGN == '' ? 'center' : Ci.ALIGN" :fixed="Ci.FIXED" :sortable="Ci.ISSORT == 1" v-else>
          <template #default="{ row }">
            <template v-if="Ci.CONTROLS == 'ExSelect' || Ci.CONTROLS == 'ExRadio'">
              {{ DictLabel(EnumData[Ci.FIELD], row[Ci.FIELD]) }}
            </template>
            <template v-else-if="Ci.CONTROLS == 'ExSelectMultiple' || Ci.CONTROLS == 'ExCheckbox'">
              {{ DictLabels(EnumData[Ci.FIELD], row[Ci.FIELD]) }}
            </template>
            <template v-else-if="Ci.CONTROLS == 'ExSwitch'">
              <el-switch v-model="row[Ci.FIELD]" inline-prompt active-text="是" inactive-text="否" active-value="1" inactive-value="0" disabled />
            </template>
            <template v-else-if="Ci.CONTROLS == 'ExSelectSearch' || Ci.CONTROLS == 'ExSelectMutiple' || Ci.CONTROLS == 'ExSelectGroup' || Ci.CONTROLS == 'ExRegion' || Ci.CONTROLS == 'ExSelectTable' || Ci.CONTROLS == 'ExSelectModal' || Ci.CONTROLS == 'ExArea'">
              {{ row[Ci.FIELD] == 'DATAVALUETOINDEX-1'?'同上':row[Ci.REVERFIELD] }}
            </template>
            <template v-else-if="Ci.CONTROLS == 'ExUploadFile'">
              <el-link type="primary" v-if="row[Ci.FIELD]" @click.stop="handleFileList(row,Ci)">{{ row[Ci.FIELD+'Arr'].length }}个文件</el-link>
            </template>
            <template v-else-if="Ci.VTYPE == 'ExEditor'">
              <div>{{ getSimpleText(row[Ci.FIELD])  }}</div>
            </template>
            <template v-else-if="Ci.CONTROLS == 'ExNumber'">{{ !row[Ci.FIELD]?'':row[Ci.FIELD] }} </template>
            <template v-else>
              <template v-if="Ci.VTYPE == 'exNum'">
                <el-tag class="ml-2" v-if="Ci.SLOT == 'tags'" :type="DictLabels(EnumData[Ci.FIELD], row[Ci.FIELD],',','COLOR')">
                  {{ DictLabels(EnumData[Ci.FIELD], row[Ci.FIELD]) }}
                </el-tag>
                <span v-else>
                  {{ DictLabels(EnumData[Ci.FIELD], row[Ci.FIELD]) }}
                </span>
              </template>
              <ImagePreview v-else-if="Ci.VTYPE == 'ExImg'" :src="row[Ci.FIELD]" :width="20" :height="20" />
              <div class="content" v-else>
                <span v-if="Ci.SUFFIX">{{ setSuffix(row, Ci) }}</span>
                <span v-else>{{ row[Ci.FIELD] ? row[Ci.FIELD] :''}}</span>
              </div>
            </template>
          </template>
        </vxe-column>
      </template>

      <vxe-column title="操作" :width="actionBarWidth" fixed="right" v-if="tableCFG?.tableButtons.length > 0" align="center">
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
      <vxe-modal destroy-on-close v-model="modalConfig.open" :width="modalConfig.width" :height="modalConfig.height" id="formModal" resize storage transfer show-zoom show-footer @zoom="resizeModal">
        <template #title>
          <span> {{ modalConfig.title }} </span>
        </template>
        <template #default>
          <FileUploadList v-if="modalConfig.type=='Filelist'" v-model="FileRow[FileConfig.FIELD]" :filelist="FileRow[FileConfig.FIELD+'Arr']" @change="val=>setUploadFile(val,FileRow,FileConfig)" :detail="FileConfig.ISEDIT == '1' || FileConfig.EDITTABLE == 1" />
          <ModalTable v-else ref="modalRef" :MODULE="modalConfig.MENUID" :PAGE="modalConfig.PAGEID" :ImportantParams="ImportantParams" @submit="(data) => SelectChange(openModalConfig, data, openModalIndex)" />
        </template>
        <template #footer>
          <el-button v-if="modalConfig.type=='Modal'" type="primary" size="default" @click="modalSubmit">保存</el-button>
        </template>
      </vxe-modal>
    </template>

    <!-- 批量修改数据 -->
    <template>
      <vxe-modal destroy-on-close v-model="modalEditConfig.open" :width="modalEditConfig.width" :height="modalEditConfig.height" id="editTabModal" resize storage transfer show-zoom show-footer>
        <template #title>
          <span> 批量修改 </span>
        </template>
        <template #default>
        </template>
        <template #footer>
          <el-button type="primary" size="default" @click="EditmodalSubmit">保存</el-button>
        </template>
      </vxe-modal>
    </template>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>

<script setup name="">
import { Search, ArrowDown } from "@element-plus/icons-vue";
import VTable from "@/components/Tables";
import ModalTable from "@/components/Form/modal.vue";
import { getPageConfig, getTableData } from "@/api/system/page";
import { getFormValue, GetDateAfter, evilFn, formatDate, deepClone } from "@/utils";
import TableFileUpload from "@/components/FileUpload/table"
import FileUploadList from "@/components/FileUpload/detail"
import { dict2name, setSuffix, getUrlParams } from "@/utils";
import * as math from 'mathjs'

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
    default: 150,
  },
  mainFormData: {
    type: Object,
    default: {}
  },
  totalData: {
    type: Object,
    default: {}
  },
});
const { tableCFG, tableData, validRules, loading, actionBarWidth } = toRefs(props);

const emit = defineEmits(["change", "select", "headerClick"]);
const { proxy } = getCurrentInstance();
const xEditTable = ref();
const router = useRouter();
const MENUID = router.currentRoute.value.meta.BILLNO;

const checkboxChange = ({ records }) => emit("change", records)

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
];

const DropdownRefIndex = ref([]);
const DropdownRef = ref();

const BaseRowData = ref({})
// 枚举数据
const EnumData = ref({});
const mapEnumData = () => {
  let data = getFormValue(props.tableCFG.tableColumns);
  EnumData.value = data.EnumData;
  BaseRowData.value = JSON.parse(JSON.stringify(data));
};

const ImportantParams = ref({})

// 给需要Arr数组的 控件 赋值
const setDataArrs = () => {
  if (props.tableCFG.tableColumns.length == 0) return;
  const data = props.tableCFG.tableColumns.filter(el => el.CONTROLS == "ExSelectMultiple" || el.CONTROLS == "ExSelectMutiple" || el.CONTROLS == "ExCheckbox" || el.CONTROLS == "ExRegion");
  if (data.length == 0) return;
  for (let i = 0; i < props.tableData.length; i++) {
    const el = props.tableData[i];
    for (let j = 0; j < data.length; j++) {
      let { FIELD } = data[j];
      el[FIELD + "Arr"] = el[FIELD] == "" || el[FIELD] == undefined || el[FIELD] == null ? [] : el[FIELD].split(",");
    }
  }
};

watch(
  () => props.tableCFG.tableColumns,
  (val) => {
    // LoadInitSelectData();
    // setDataArrs();
    mapEnumData();
  },
  {
    immediate: true,
  }
);

watch(() => props.tableData, () => {
  setTimeout(() => {
    LoadInitSelectData();
    setDataArrs();
  }, 1);
}, {
  // deep:true,
  immediate: true
});


// 动态控制 diabled
const calcDISABLED = computed((config, rowIndex) => {
  return (config, rowIndex) => {
    let { ISDISABLED, SLOTCFG, LINKAGE } = config
    if (!SLOTCFG || (SLOTCFG && !SLOTCFG.includes("ISDISABLED"))) return ISDISABLED == '1'
    try {
      let slotConfig = JSON.parse(SLOTCFG)
      let Data = props.tableData[rowIndex]
      if (LINKAGE) cleanEvent(config, rowIndex);
      return evilFn(Data, slotConfig.ISDISABLED)
    } catch (err) {
      console.error("动态DISABLED失败", err);
    }
  }
})

const optionsFont = ref([]);
const getAreaData = import("@/utils/font-awesome").then((res) => {
  optionsFont.value = res.default;
});

const SelectLoading = ref(false);
// 是否启用 selectSearch 的自新建功能
const selectCreated = computed(config => {
  return config => {
    try {
      if (!config) return false;
      return config.includes('CREATED')
    } catch (error) {
      return false
    }
  }
})
const SelectOptions = ref({});
const SelectFocus = (config, rowIndex) => {
  SelectQuery("", config, rowIndex);
};
const SelectQuery = (keyword = undefined, config, rowIndex = 0) => {
  let { FIELD, OTHER } = config;
  if (OTHER == "") return;
  let { url, data } = ParseOtherConfig(OTHER, rowIndex);
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
      repeatSubmit: false,
    },
  }).then(({ RESULT }) => {
    SelectOptions.value[FIELD] = RESULT;
  }).catch(() => {
    SelectOptions.value[FIELD] = [];
  }).finally(() => {
    SelectLoading.value = false;
  });
};

// 初始化 ExSelectMutiple
const initExSelectMutiple = (el) => {
  if (!props.tableData.length) return;
  const dataArr = props.tableData.reduce((acc, cur) => {
    if (el.REVERFIELD && cur[el.REVERFIELD]) {
      const valueArr = cur[el.FIELD].split(",");
      const nameArr = cur[el.REVERFIELD].split(",");
      if (valueArr.length == nameArr.length) {
        for (let i = 0; i < valueArr.length; i++) {
          const value = valueArr[i];
          const label = nameArr[i];
          acc.push({ LABEL: label, VALUE: value });
        }
      }
    }
    return acc;
  }, []);
  const uniqueData = Object.values(dataArr.reduce((acc, cur) => {
    acc[cur.VALUE] = cur;
    return acc;
  }, {}));
  SelectOptions.value[el.FIELD] = uniqueData;
};
// 初始化其他类型的表格列
const initOtherCONTROLS = (el) => {
  if (!props.tableData?.length) return;
  const dataArr = props.tableData.reduce((acc, cur) => {
    if (el.REVERFIELD && cur[el.REVERFIELD]) acc.push({ LABEL: cur[el.REVERFIELD], VALUE: cur[el.FIELD] });
    return acc;
  }, []);
  SelectOptions.value[el.FIELD] = removalArray(dataArr, 'VALUE');
};

// 数组去参
function removalArray(arr, uniId) {
  const res = new Map();
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
}

const LoadInitSelectData = () => {
  const indexArr = props.tableCFG.tableColumns.reduce((acc, el) => {
    switch (el.CONTROLS) {
      case "ExSelectModal":
      case "ExSelectTable":
        acc.push(el.FIELD);
        break;
      case "ExRegion":
        SelectQuery(el);
        break;
      case "ExSelectMutiple":
        initExSelectMutiple(el);
        break;
      default:
        initOtherCONTROLS(el);
        break;
    }
    return acc;
  }, []);
  DropdownRefIndex.value = indexArr;
};

function tableEvent(row, Ci) {
  proxy.$emit("tableBtnchange", { row: row, btn: Ci });
}

const SelectValueTo = ref([]);
const SelectChange = (config, val, rowIndex) => {
  const { FIELD, CONTROLS, SLOT, OTHER } = config;
  if (val == undefined) return
  ParseOtherConfig(OTHER, rowIndex);
  let data = Array.isArray(val) ? [] : null;
  let setValueToNext = false // 是否批量回填多行
  if (val != "" || val.length > 0)
    switch (CONTROLS) {
      case "ExSelect":
        data = val == 'DATAVALUETOINDEX-1' ? { LABEL: "同上", VALUE: "" } : EnumData.value?.[FIELD].find((el) => el.VALUE == val);
        break;
      case "ExSelectMultiple":
        var arr = [];
        for (let i = 0; i < val.length; i++) {
          const ele = val[i];
          let Di = EnumData.value?.[FIELD].find((el) => el.VALUE == ele);
          arr.push(Di);
        }
        data = arr;
        setSelectMutipleValue(FIELD, val, rowIndex);
        break;
      case "ExSelectSearch":
        if (config.SLOTCFG && config.SLOTCFG.includes('CREATED')) {
          data = SelectOptions.value[FIELD].find((el) => el.VALUE == val) == null ? { LABEL: val, VALUE: val } : SelectOptions.value[FIELD].find((el) => el.VALUE == val);
        } else {
          data = val == 'DATAVALUETOINDEX-1' ? { LABEL: "同上", VALUE: "" } : SelectOptions.value[FIELD].find((el) => el.VALUE == val);
        }
        break;
      case "ExSelectMutiple":
        var arr = [];
        for (let i = 0; i < val.length; i++) {
          const ele = val[i];
          let Di = SelectOptions.value[FIELD].find((el) => el.VALUE == ele);
          arr.push(Di);
        }
        data = arr;
        setSelectMutipleValue(FIELD, val, rowIndex);
        break;
      case "ExSelectGroup":
        data = treeFind(SelectOptions.value[FIELD], (el) => el.VALUE == val);
        break;
      case "ExRegion":
        var arr = [];
        for (let i = 0; i < val.length; i++) {
          const el = val[i];
          let Di = treeFind(SelectOptions.value[FIELD], (al) => al.VALUE == el);
          arr.push(Di);
        }
        data = arr;
        setSelectMutipleValue(FIELD, val, rowIndex);
        break;
      case "ExSelectTable":
      case "ExSelectModal":
        data = val;
        if (Array.isArray(val)) {
          for (let i = 0; i < val.length; i++) {
            const el = val[i];
            SelectTableSetData.value[FIELD + "_" + (rowIndex + i)] = deepClone(el)
            if (props.tableData[rowIndex + i] == undefined) {
              let newRowData = deepClone(BaseRowData.value)
              newRowData[FIELD] = el?.BILLNO
              props.tableData.push(newRowData)
            } else {
              props.tableData[rowIndex + i][FIELD] = el?.BILLNO
            }
          }
          setValueToNext = true
        } else {
          SelectTableSetData.value[FIELD + "_" + rowIndex] = deepClone(val)
          props.tableData[rowIndex][FIELD] = val == null ? '' : val?.BILLNO
        }
        setTimeout(() => {
          let index = DropdownRefIndex.value.findIndex((el) => el == FIELD);
          DropdownRef?.value[index]?.hidePanel();
          modalConfig.open = false;
        }, 100);
        break;
      case "ExModalTable":
        data = val;
        props.tableData[rowIndex][FIELD] = val == null ? '' : val.BILLNO
        setTimeout(() => {
          modalConfig.open = false;
        }, 200);
        break;
    }
  config.LINKAGE && cleanEvent(config, rowIndex);
  setSelectValue(data, rowIndex, setValueToNext);
  emit("select", {
    id: FIELD,
    rowIndex,
    query: SLOT == 1 ? true : false,
    config,
    value: val,
    data,
    valueTo: SelectValueTo.value,
  });
};

// 查找树结构中的数据
function treeFind(tree, func) {
  for (const data of tree) {
    if (func(data)) return data;
    if (data.CHILDREN) {
      const res = treeFind(data.CHILDREN, func);
      if (res) return res;
    } else if (data.children) {
      const res = treeFind(data.children, func);
      if (res) return res;
    }
  }
  return null;
}

// 多选组件 回写值
const setSelectMutipleValue = (id, val, rowIndex) => {
  props.tableData[rowIndex][id] = val.join(",");
};

/** 根据OTHER赋值
 *  @param {array,object} data  数据
 *  @param {number} rowIndex 行标
 *  @param {boolean} BatchNext 是否批量回填
 */
const setSelectValue = (data, rowIndex, BatchNext = false) => {
  if (!SelectValueTo.value || SelectValueTo.value.length === 0) return;
  SelectValueTo.value.forEach((item) => {
    const { k: key, v: value } = item;
    if (Array.isArray(data)) {
      BatchNext ? setSelectValueArray(item, data, rowIndex) : props.tableData[rowIndex][key] = data.length > 0 ? data.map((el) => el[value]).join(",") : "";
    } else {
      data?.[value] != null ? props.tableData[rowIndex][key] = data[value] : props.tableData[rowIndex][key] = ""
    }
    // if (data?.[value] != null) {
    //   if (Array.isArray(data)) {
    //     setSelectValueArray(item, data, rowIndex)
    //     props.tableData[rowIndex][key] = data.length > 0 ? data.map((el) => el[value]).join(",") : "";
    //   } else {
    //     props.tableData[rowIndex][key] = data[value];
    //   }
    // } else {
    //   props.tableData[rowIndex][key] = "";
    // }
  });
  SelectValueTo.value = [];
};
const setSelectValueArray = (config, data, rowIndex) => {
  const { k: key, v: value } = config;
  for (let i = 0; i < data.length; i++) {
    const el = data[i];
    props.tableData[rowIndex + i][key] = el[value] != null ? el[value] : '';
  }
}

// 重新计算
const SUMConfig = computed(() => props.tableCFG.tableColumns.filter(el => el.LINKAGE && el.LINKAGE.includes('"SUM":')))
const resetSUM = (arr = SUMConfig.value, row = props.tableData[0]) => {
  if (arr.length == 0) return;
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    numberBlur(el, row);
  }
};
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
            emit("change", { [res.slice(2, res.length)]: Math.round(num * 10 ** point) / 10 ** point });
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
          num = math.add(math.bignumber(num), math.bignumber(Number(el[equ])))
          // num += el[equ];
        }
        if (res.includes("M$")) {
          emit("change", { [res.slice(2, res.length)]: Math.round(num * 10 ** point) / 10 ** point });
        } else {
          row[res] = Math.round(num * 10 ** point) / 10 ** point;
        }
      }
    } catch (err) {
      console.error("Error:SUM解析", err);
    }
  }
};

const calcPoint = (e, config, row) => {
  let { FIELD, LINKAGE, MAXLENGTH, SLOTCFG } = config,
    point = 2;
  if (MAXLENGTH && (Number(row[FIELD]) > Number(MAXLENGTH))) row[FIELD] = Number((row[FIELD] + '').slice(0, MAXLENGTH.length))
  if (SLOTCFG && SLOTCFG.includes("MIN")) {
    try {
      let slotConfig = JSON.parse(SLOTCFG)
      if (Number(row[FIELD]) < Number(slotConfig.MIN)) row[FIELD] = Number(slotConfig.MIN)
    } catch (err) {
      console.error("Error:number-MIN解析", err);
    }
  }
  // 小数点控制
  if (LINKAGE && LINKAGE.includes("POINT")) {
    try {
      let Linkage = JSON.parse(LINKAGE);
      point = Linkage?.POINT || 2;
      if (row[FIELD] != null) row[FIELD] = row[FIELD].toFixed(point) * 1;
    } catch (err) {
      console.error("Error:POINT解析", err);
    }
  }
}
const calcNumberMin = computed(config => {
  return config => {
    let { SLOTCFG } = config
    if (SLOTCFG && SLOTCFG.includes("MIN")) {
      try {
        let slotConfig = JSON.parse(SLOTCFG)
        return Number(slotConfig.MIN)
      } catch (err) {
        console.error("Error:number-MIN解析", err);
      }
    } else {
      return -Infinity
    }
  }
})

const calcNumberMax = computed(() => {
  return config => {
    let { MAXLENGTH = undefined, SLOTCFG = undefined, CONTROLS } = config
    try {
      const slotConfig = SLOTCFG && JSON.parse(SLOTCFG);
      const MAX = MAXLENGTH || slotConfig?.MAX
      if (!MAX) return CONTROLS == 'ExNumber' ? Infinity : "";
      return Number(MAX);
    } catch (err) {
      console.error("Error:number-MAX解析", err);
      return CONTROLS == 'ExNumber' ? Infinity : "";
    }
  }
})

// 文本输入框失焦
const inputBlur = (config, row) => {
  let { LINKAGE } = config
  if (!LINKAGE) return;
  /** 计算平均数 */
  if (/AVE/.test(LINKAGE)) {
    try {
      const { AVE, POINT = 2 } = JSON.parse(LINKAGE);
      let [equ, res] = AVE.split("=")
      let newEqu = equ.split(",")
      if (newEqu.length) {
        let numArr = []
        for (let i = 0; i < newEqu.length; i++) {
          const el = newEqu[i];
          let value = row[el]
          if (el.includes("M$")) value = props.mainFormData[el.slice(2, el.length)]
          value = String(value)
          if (value.includes("-")) {
            numArr = [...numArr, ...getAveNum(value)]
          } else {
            numArr.push(Number(value))
          }
        }
        row[res] = Math.round(Number_Ave(numArr) * 10 ** POINT) / 10 ** POINT;
      }
    } catch (err) {
      console.error("Error:AVE解析", err);
    }
  }
  if (/CALC|POINT|SUM/.test(LINKAGE)) numberBlur(config, row)
}

function calcNUM(row, equ) {
  try {
    const Data = row;
    return evilFn(Data, equ);
  } catch (err) {
    console.warn("Err:运算错误", err);
  }
}

// 级联清空
const cleanEvent = (config, rowIndex) => {
  // 判断是否有需要控制的级联     {"CLEAN":"OUTERPHONE,MANAGER"}
  if (config.LINKAGE.includes("CLEAN")) {
    try {
      let newObjLinkage = JSON.parse(config.LINKAGE),
        cleanArr = newObjLinkage.CLEAN.split(",");
      if (cleanArr.length) {
        cleanArr.forEach((item) => {
          props.tableData[rowIndex][item] = "";
        });
      }
    } catch (err) {
      console.error("Error:级联控制是否必填异常了", err);
    }
  }
};

// other 回显
const DictLabel = (arr, data, label = "LABEL", value = "VALUE") => {
  arr = arr == undefined ? [] : arr;
  return proxy.selectDictLabel(arr, data, label, value);
};
const DictLabels = (arr, data, jg = ",", label = "LABEL", value = "VALUE") => {
  arr = arr == undefined ? [] : arr;
  return proxy.selectDictLabels(arr, data, jg, label, value);
};

// 解析 Other 配置
function ParseOtherConfig(config, rowIndex) {
  if (!config) {
    SelectValueTo.value = []
    return { url: "", data: {}, importantData: {} };
  }
  try {
    let newConfig = JSON.parse(config)[0]
    if (newConfig.setvalue && JSON.stringify(newConfig.setvalue) != '{}') {
      let arr = []
      for (const key in newConfig.setvalue) {
        arr.push({ k: key, v: newConfig.setvalue[key] })
      }
      SelectValueTo.value = arr
    }
    return { url: newConfig.url, data: newConfig?.params, importantData: newConfig?.importantData }
  } catch (error) {
    if (config.indexOf("/") == '0') {
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
          queryJson = GetUrlParams("/a?" + paramsArr[1], "obj");
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[1], "obj");
          queryJson = obj
          importantData = importantObj
        }
        if (paramsArr.length > 2) {
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[2], "obj");
          setQueryParam = obj
          setImportantParam = importantObj
          queryJson = { ...queryJson, ...ConvertData(setQueryParam, rowIndex) }
          importantData = { ...importantData, ...ConvertData(setImportantParam, rowIndex) }
          // for (let ii in setQueryParam) {
          //   let valueKey = setQueryParam[ii]
          //   if (valueKey.includes("M$")) {
          //     valueKey = calcHasMSKey(valueKey)
          //     queryJson[ii] = props.mainFormData[valueKey] || "";
          //   } else if (valueKey.includes("S$")) {
          //     valueKey = calcHasMSKey(valueKey)
          //     queryJson[ii] = props.tableData[rowIndex][valueKey] || "";
          //   } else {
          //     queryJson[ii] = props.tableData[rowIndex][valueKey] || "";
          //   }
          // }
        }
        SelectValueTo.value = paramsArr[3] ? GetUrlParams("a?" + paramsArr[3], "arr") : []
      }
      return { url, data: queryJson, importantData };
    } else {
      console.error("配置解析错误!", error);
    }
  }
}

/** 转换数据 */
function ConvertData(obj, rowIndex) {
  let data = {}
  for (let ii in obj) {
    let valueKey = obj[ii]
    if (valueKey.includes("M$")) {
      valueKey = calcHasMSKey(valueKey)
      data[ii] = props.mainFormData[valueKey] || "";
    } else if (valueKey.includes("S$")) {
      valueKey = calcHasMSKey(valueKey)
      data[ii] = props.tableData[rowIndex][valueKey] || "";
    } else {
      data[ii] = props.tableData[rowIndex][valueKey] || "";
    }
  }
  return data
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

// 下拉表格
const SelectTableKey = ref();
const SelectTableConfig = ref({});
const SelectModalList = ref([]);
const ExSelectModalConfig = reactive({
  tableColumns: [],
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  width: "500px",
  height: "auto",
});
const getSelectTableConfig = (config, rowIndex) => {
  nextTick(() => {
    let { FIELD, OTHER, SLOTCFG } = config;
    if (SLOTCFG == "" || OTHER == "") return console.error("Error:配置错误");
    if (SelectTableKey.value != FIELD) {
      SelectTableKey.value = FIELD;
      let ids = SLOTCFG.split(",");
      if (ids.length < 2) return console.error("Error: 配置错误");
      let [MODULEID, PAGEID, downCss] = ids;
      let downCssArr = downCss ? downCss.split("*") : ["500px", "300px"];
      ExSelectModalConfig.width = downCssArr[0];
      getPageConfig({ MODULEID, PAGEID }).then(({ RESULT }) => {
        SelectTableConfig.value = RESULT;
        ExSelectModalConfig.tableColumns = RESULT.COLUMNS.filter(el => el.ISSHOW == "1");
        getSelectTableData(config, rowIndex);
      }).catch((err) => {
        ExSelectModalConfig.height = parseInt(downCssArr[1]);
        SelectTableKey.value = "";
      });
    } else {
      getSelectTableData(config, rowIndex);
    }
  });
};
const SelectTableSetData = ref({})
const getSelectTableData = (config, rowIndex) => {
  let { FIELD, OTHER, SLOTCFG, REVERFIELD } = config;
  if (SelectTableKey.value != FIELD) return getSelectTableConfig(config, rowIndex);
  let { url, data: queryParams, importantData } = ParseOtherConfig(OTHER, rowIndex);
  let { PK_MODULE, BILLNO } = SelectTableConfig.value;
  let ids = SLOTCFG.split(",");
  if (ids.length < 2) return console.error("Error: 配置错误");
  let [MODULEID, PAGEID, downCss] = ids;
  let downCssArr = downCss ? downCss.split("*") : ["500px", "300px"];

  let data = {
    KEYWORD: props.tableData[rowIndex][REVERFIELD],
    PAGENUM: 1,
    PAGESIZE: 10000,
    SORTNAME: "",
    SORTORDER: "",
    MODULEID: PK_MODULE,
    PAGEID: BILLNO,
    ...queryParams,
    ...importantData
  };
  getTableData(url, data)
    .then((res) => {
      SelectModalList.value = res.RESULT.RECORDS;
      ExSelectModalConfig.height = res.RESULT.RECORDS.length >= 10 || res.RESULT.RECORDS.length == 0 ? parseInt(downCssArr[1]) : (res.RESULT.RECORDS.length + 1) * 26 + 30;
    }).catch(err => {
      ExSelectModalConfig.height = parseInt(downCssArr[1]);
    }).finally(() => {
      let index = DropdownRefIndex.value.findIndex((el) => el == FIELD);
      DropdownRef?.value[index]?.showPanel();
    });
};
const resetSelectTableData = (keyword, config, rowIndex) => {
  const { FIELD, OTHER } = config;
  ParseOtherConfig(OTHER, rowIndex);
  if (!SelectTableSetData.value[FIELD + "_" + rowIndex]) return;
  setTimeout(() => {
    if (keyword != SelectTableSetData.value[FIELD + "_" + rowIndex][config.FIELD]) {
      SelectChange(config, SelectTableSetData.value[FIELD + "_" + rowIndex], rowIndex)
    }
  }, 500)

  // SelectChange(config, SelectTableSetData.value[FIELD + "_" + rowIndex], rowIndex)
}

// 弹窗
const modalRef = ref(null);
const modalConfig = reactive({
  type: "",
  open: false,
  title: "",
  MENUID: "",
  PAGEID: "",
  width: "40%",
  height: "40%",
});
const modalEditConfig = reactive({
  open: false,
  title: "",
  MENUID: "",
  PAGEID: "",
  width: "70%",
  height: "60%",
});
const openModalIndex = ref("");
const openModalConfig = ref({});
const openModal = (config, rowIndex) => {
  openModalConfig.value = config;
  let { LABEL, SLOTCFG, OTHER } = config;
  modalConfig.type = "Modal"
  modalConfig.title = LABEL;
  if (SLOTCFG == "") return console.error("Error: 配置错误");
  let ids = SLOTCFG.split(",");
  if (ids.length < 2) return console.error("Error: 配置错误");
  modalConfig.MENUID = ids[0];
  modalConfig.PAGEID = ids[1];
  let { data: queryParams, importantData } = ParseOtherConfig(OTHER, rowIndex);
  ImportantParams.value = { ...queryParams, ...importantData }
  openModalIndex.value = rowIndex;
  if (ids.length == 3) {
    let wh = ids[2].split('*');
    if (wh.length < 2) return console.error("SLOTCFG: 配置错误,表格宽高错误");
    modalConfig.width = wh[0];
    modalConfig.height = wh[1];
  }
  modalConfig.open = true;
};
const resizeModal = (type, e) => {
  modalRef.value?.setTableHeight()
}
const modalSubmit = () => {
  const data = modalRef.value.rows;
  if (data.length > 0) {
    SelectChange(openModalConfig.value, data, openModalIndex.value);
  }
  modalConfig.open = false;
};


// 推断日期组件类型
const mapDateType = computed((config, isRange = false) => {
  return (config, isRange) => {
    let { SLOTCFG, SUFFIX } = config, Ctype = SLOTCFG || SUFFIX, type = "", format = "";
    switch (Ctype) {
      case "year":
        isRange && console.error("不支持年份区间选择")
        type = isRange ? 'daterange' : 'year'
        format = "YYYY"
        break;
      case "month":
        type = isRange ? 'monthrange' : 'month'
        format = "YYYY-MM"
        break;
      default:
        type = isRange ? 'daterange' : 'date'
        format = "YYYY-MM-DD"
        break;
    }
    return { type, format };
  }
})

// 日期的禁用条件判断
const disabledDate = (time, config, row) => {
  let { OTHER } = config;
  if (!OTHER) return false;
  try {
    let cf = JSON.parse(OTHER);
    const date = new Date();
    // 判断是否需要设置区间的禁用
    if (cf?.minVar && cf?.minVar.includes('Fixed')) {
      let minValue = cf.minVar.replace('Fixed=', '');
      if (cf?.maxVar && cf.maxVar.includes('Fixed')) {
        let maxValue = cf.maxVar.replace('Fixed=', '');
        return time.getTime() < new Date(minValue).getTime() || time.getTime() > new Date(maxValue).getTime()
      }
      return time.getTime() < new Date(minValue).getTime()
    }
    if (cf?.minVar && cf?.minVar.includes('Var')) {
      let minVarID = cf.minVar.replace('Var=', ''), minVarIDVal = minVarID ? row[minVarID] : GetDateAfter(0);
      if (cf.maxVar && cf.maxVar.includes('Var')) {
        let maxVarID = cf.maxVar.replace('Var=', ''), maxVarIDVal = maxVarID ? row[maxVarID] : GetDateAfter(0);
        return time.getTime() < new Date(minVarIDVal).getTime() || time.getTime() > new Date(maxVarIDVal).getTime()
      }
      return time.getTime() < new Date(minValue).getTime()
    }
    if (cf.hasOwnProperty('minVar') && cf.hasOwnProperty('maxVar')) {
      let minVal = Number.isNaN(parseInt(cf.minVar)) ? row[cf.minVar] : GetDateAfter(parseInt(cf.minVar * 1 - 1));
      let maxVal = Number.isNaN(parseInt(cf.maxVar)) ? row[cf.maxVar] : GetDateAfter(parseInt(cf.maxVar * 1 + 1));
      if (Number.isNaN(parseInt(cf.minVar))) {
        let ccminVal = new Date(row[cf.minVar])
        let minVarIDVal = ccminVal.setDate(ccminVal.getDate() - 1)
        minVal = minVarIDVal
      }
      return time.getTime() < new Date(minVal).getTime() || time.getTime() > new Date(maxVal).getTime()
    } else if (cf.hasOwnProperty('minVar')) { // 有最小日期限制
      // 判断是否是变量，还是数字 如果是NaN  说明是变量值
      let minVal = null
      if (Number.isNaN(parseInt(cf.minVar))) {
        let ccminVal = new Date(row[cf.minVar])
        let minVarIDVal = ccminVal.setDate(ccminVal.getDate() - 1)
        minVal = minVarIDVal
      } else {
        minVal = GetDateAfter(parseInt(cf.minVar * 1 - 1))
      }
      if (minVal) return time.getTime() < new Date(minVal).getTime();
    } else if (cf.hasOwnProperty('maxVar')) { // 只限制最大日期
      let maxVal = Number.isNaN(parseInt(cf.maxVar)) ? row[cf.maxVar] : GetDateAfter(parseInt(cf.maxVar * 1 + 1));
      if (maxVal) return time.getTime() > new Date(maxVal).getTime()
    }
  } catch (err) {
    console.error("日期的禁用条件判断", err);
    return true;
  }
};

// 时间确认事件
function DateChange(val, config, rowIndex) {
  let { FIELD, CONTROLS, LINKAGE } = config
  if (CONTROLS == 'ExDateRange' || CONTROLS == 'ExDateTimeRange') {
    props.tableData[rowIndex][FIELD] = val.join(",");
    return false
  }
  if (LINKAGE) {
    cleanEvent(config);
    if (CONTROLS == 'ExDate') DateCalc(config, rowIndex)
  }
}

// 根据配置的日期后缀类型转换格式  year/month/date/dates/datetime/
function getValFormat(t) {
  let a = {
    year: 'YYYY',
    month: 'YYYY-MM',
    date: 'YYYY-MM-DD'
  }
  return a[t] || 'YYYY-MM-DD'
}


const DateCalc = (config, rowIndex) => {
  let { LINKAGE } = config
  // 日期计算
  if (LINKAGE.includes("DAYCALC")) {
    try {
      let Linkage = JSON.parse(LINKAGE),
        calcArr = Linkage.DAYCALC.split("&");
      for (let i = 0; i < calcArr.length; i++) {
        const el = calcArr[i].split("=");
        let [equ, res] = el;
        if (el.length) {
          let num,
            [resType, resKey] = res.split("|").length == 1 ? ['num', res.split("|")[0]] : res.split("|");
          if (equ.includes("-")) {
            let [d1, d2] = equ.split("-"),
              [d1Type, d1Key] = d1.split("|").length == 1 ? ["day", d1.split("|")[0]] : d1.split("|"),
              [d2Type, d2Key] = d2.split("|").length == 1 ? ["day", d2.split("|")[0]] : d2.split("|");
            let day1 = d1Key.includes("M$") ? props.mainFormData[calcHasMSKey(d1Key)] : d1Key.includes("S$") ? props.tableData[rowIndex][calcHasMSKey(d1Key)] : props.tableData[rowIndex][calcHasMSKey(d1Key)],
              day2 = d2Key.includes("M$") ? props.mainFormData[calcHasMSKey(d2Key)] : d2Key.includes("S$") ? props.tableData[rowIndex][calcHasMSKey(d2Key)] : props.tableData[rowIndex][calcHasMSKey(d2Key)];
            num = getDaysBetween({ type: d1Type, value: day1 }, { type: d2Type, value: day2 });
          } else {
            let [d1, d2] = equ.split("+"),
              [d1Type, d1Key] = d1.split("|").length == 1 ? ["day", d1.split("|")[0]] : d1.split("|"),
              [d2Type, d2Key] = d2.split("|").length == 1 ? ["day", d2.split("|")[0]] : d2.split("|");
            let day1 = d1Key.includes("M$") ? props.mainFormData[calcHasMSKey(d1Key)] : d1Key.includes("S$") ? props.tableData[rowIndex][calcHasMSKey(d1Key)] : props.tableData[rowIndex][calcHasMSKey(d1Key)],
              day2 = d2Key.includes("M$") ? props.mainFormData[calcHasMSKey(d2Key)] : d2Key.includes("S$") ? props.tableData[rowIndex][calcHasMSKey(d2Key)] : props.tableData[rowIndex][calcHasMSKey(d2Key)];
            num = getDaysAdd({ type: d1Type, value: day1 }, { type: d2Type, value: day2 });
          }
          if (resKey.includes("M$")) {
            props.mainFormData[calcHasMSKey(resKey)] = num[resType]
          } else {
            props.tableData[rowIndex][calcHasMSKey(resKey)] = num[resType]
          }
        }
      }
    } catch (err) {
      console.error("Error:DAYCALC解析", err);
    }
  }
}
//  日期 相减
function getDaysBetween(day1, day2) {
  let { type: d1Type, value: d1Value } = day1,
    { type: d2Type, value: d2Value } = day2;
  if (!d1Value || !d2Value) return { num: 0, date: "" }
  let sD, eD, dateObj, num = 0, date = "";
  const Type = `${d1Type}|${d2Type}`;
  switch (Type) {
    case "day|day":
      sD = Date.parse(d1Value)
      eD = Date.parse(d2Value)
      if (sD < eD) { num = -1 }
      else if (sD == eD) { num = 0; }
      else { num = (sD - eD) / (1 * 24 * 60 * 60 * 1000); }
      break;
  }
  return { num: num + 1, date }
}
//  日期 相加
function getDaysAdd(day1, day2) {
  let { type: d1Type, value: d1Value } = day1,
    { type: d2Type, value: d2Value } = day2;
  if (!d1Value || !d2Value) return { num: 0, date: "" }
  let sD, eD, dateObj, num = 0, date = "";
  const Type = `${d1Type}|${d2Type}`;
  switch (Type) {
    case "day|year":
      sD = new Date(Date.parse(d1Value))
      eD = Number(d2Value)
      dateObj = new Date(sD.setFullYear(sD.getFullYear() + eD))
      date = formatDate(dateObj.toLocaleDateString(), 'date')
      break;
  }
  return { num, date }
}

// 表头点击事件
function headerCellClickEvent(val) {
  let { column } = val
  emit("headerClick", column.field)
}
function headColDbClickEvent(val) {
  let { column } = val
  emit("headerDbClick", column.field)
}


// 判断是否存在M$,S$
function calcHasMSKey(key) {
  return (key.includes("M$") || key.includes("S$")) ? key.slice(2, key.length) : key
}

function getSimpleText(html) {
  var re1 = new RegExp("<.+?>", "g");//匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
  var msg = html ? html.replace(re1, '') : ''; //执行替换成空字符
  return msg;
}

// 文件上传相关
const uploadData = computed(() => {
  return {
    MODULEID: MENUID,
    PAGEID: "",
  }
})
const setUploadFile = (val, row, config) => {
  let { FIELD } = config
  row[FIELD + 'Arr'] = val
  emit("upload", {
    id: FIELD,
    config,
    value: val,
    row
  });
}
const FileRow = ref({})
const FileConfig = ref({})
const handleFileList = (row, config) => {
  FileRow.value = row
  FileConfig.value = config
  let { FIELD, LABEL } = config
  modalConfig.type = "Filelist"
  modalConfig.title = LABEL
  modalConfig.width = "40%"
  modalConfig.height = "50%"
  modalConfig.open = true;
}

/** 编辑行结束 */
const editClose = res => {
  emit("editClose", res)
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

defineExpose({ type: "table", xEditTable, resetSUM });
</script>

<style lang="scss" scoped>
:deep(.vxe-header--column .vxe-cell--edit-icon) {
  display: none !important;
}
.content.read {
  overflow: hidden;
  white-space: nowrap;
}

.numbox {
  display: flex;
  align-items: center;
}
:deep(.vxe-body--column.col--right) {
  .numbox {
    justify-content: flex-end;
  }
}
</style>
