<template>
  <div class="Form">
    <el-form :class="['Form', detail ? 'detail-form' : '']" ref="ruleFormRef" :model="formData" :inline="inline" :label-position="labelPosition" :label-width="inline ? '70px' : labelWidth() " :rules="detail ? null : rules" :size="size" :disabled="detail" :validate-on-rule-change="false" @submit.prevent>
      <el-row :gutter="inline ? 0 : 10">
        <template v-for="Ci in formConfig" :key="Ci.BILLNO">
          <el-col :span="Ci.CONTROLS == 'ExTabs' || Ci.CONTROLS == 'subTable'? 24: Ci.COL * 1" v-if="isShowJudge(Ci)">
            <div v-if="Ci.CONTROLS == 'ExTabs'" class="group-title">
              <span style="padding-left: 20px">{{ Ci.LABEL }}</span>
              <el-divider border-style="dashed" />
            </div>
            <el-form-item v-else :prop="Ci.FIELD">
              <template v-slot:label>
                <span class="cus-form-label" :style="setLabeTop(Ci)" v-if="Ci.CONTROLS != 'subTable'"> {{  Ci.LABEL  }} </span>
              </template>

              <template v-if="!detail">
                <!-- ExTextBox 输入框  -->
                <el-input v-if="Ci.CONTROLS == 'ExTextBox'" v-model="formData[Ci.FIELD]" clearable autocomplete="off" @blur="setEncry(Ci)" :disabled="calcDISABLED(Ci)" :maxlength="`${Ci.MAXLENGTH}`" style="width: 100%" @keydown.enter="enterNextEl">
                  <template #append v-if="Ci.SUFFIX && Ci.SUFFIX != ''">{{Ci.SUFFIX}}</template>
                </el-input>

                <!-- ExPassword 密码  -->
                <el-input v-else-if="Ci.CONTROLS == 'ExPassword'" v-model.trim="formData[Ci.FIELD]" @blur="setEncry(Ci)" @clear="setEncry(Ci)" clearable autocomplete="new-password" :disabled="calcDISABLED(Ci)" type="password" style="width: 100%" @keydown.enter="enterNextEl"></el-input>

                <!-- ExTextarea 文本域  -->
                <el-input v-else-if="Ci.CONTROLS == 'ExTextarea'" v-model="formData[Ci.FIELD]" :disabled="calcDISABLED(Ci)" :rows="3" :maxlength="`${Ci.MAXLENGTH}`" type="textarea" @keydown.enter="enterNextEl" />

                <!-- ExNumber 数字输入框 -->
                <el-input v-else-if="Ci.CONTROLS == 'ExNumber'" v-model.number="formData[Ci.FIELD]" clearable type="number" :disabled="calcDISABLED(Ci)" :min="calcNumberMin(Ci)" :max="Number(Ci.MAXLENGTH)" @input="calcPoint(Ci)" @blur="numberBlur(Ci)" @clear="numberBlur(Ci)" style="width: 100%" @keydown.enter="enterNextEl">
                  <template #append v-if="Ci.SUFFIX && Ci.SUFFIX != ''">{{Ci.SUFFIX}}</template>
                </el-input>

                <!-- ExSelect 选择 -->
                <el-select v-else-if="Ci.CONTROLS == 'ExSelect'" placeholder=" " v-model="formData[Ci.FIELD]" clearable :disabled="calcDISABLED(Ci)" style="width: 100%" @change="(val) => SelectChange(Ci, val)" @clear="SelectChange(Ci, null)" @keydown.enter=" enterNextEl">
                  <el-option v-for="item in EnumData[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
                </el-select>

                <!-- ExSelectMultiple ??? 下拉枚举多选 -->
                <el-select v-else-if="Ci.CONTROLS == 'ExSelectMultiple'" v-model="formData[Ci.FIELD + 'Arr']" automatic-dropdown clearable multiple collapse-tags collapse-tags-tooltip :disabled="calcDISABLED(Ci)" :multiple-limit="Ci.MAXLENGTH == '' ? 0 : Ci.MAXLENGTH * 1" style="width: 100%" @change="(val) => SelectChange(Ci, val)" @clear="SelectChange(Ci, null)" @keydown.enter="enterNextEl" placeholder=" ">
                  <el-option v-for="item in EnumData?.[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
                </el-select>

                <!-- ExSelectSearch 下拉查询 -->
                <template v-else-if="Ci.CONTROLS == 'ExSelectSearch'">
                  <el-select v-model="formData[Ci.FIELD]" clearable filterable remote remote-show-suffix :remote-method="(val) => SelectQuery(val, Ci)" :loading="SelectLoading" :allow-create="selectCreated(Ci.SLOTCFG)" placeholder=" " :disabled="calcDISABLED(Ci)" style="width: 100%" @focus="SelectFocus(Ci)" @change="(val) => SelectChange(Ci, val)" @clear="SelectChange(Ci, null)" @keydown.enter="enterNextEl">
                    <el-option v-for="item in SelectOptions?.[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" style="max-width:300px" />
                  </el-select>
                </template>

                <!-- ExSelectMutiple 多项选择 -->
                <template v-else-if="Ci.CONTROLS == 'ExSelectMutiple'">
                  <el-select v-model="formData[Ci.FIELD + 'Arr']" clearable multiple filterable collapse-tags collapse-tags-tooltip remote remote-show-suffix :remote-method="(val) => SelectQuery(val, Ci)" :loading="SelectLoading" :disabled="calcDISABLED(Ci)" :multiple-limit="Ci.MAXLENGTH == '' ? 0 : Ci.MAXLENGTH * 1" style="width: 100%" @focus="SelectFocus(Ci)" @change="(val) => SelectChange(Ci, val)" @clear="SelectChange(Ci, null)" @keydown.enter="enterNextEl">
                    <el-option v-for="item in SelectOptions?.[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" style="max-width:300px" />
                  </el-select>
                </template>

                <!-- ExSelectGroup 分组选择  -->
                <template v-else-if="Ci.CONTROLS == 'ExSelectGroup'">
                  <el-tree-select v-model="formData[Ci.FIELD]" :check-strictly="selectGroupStage(Ci)" clearable filterable remote-show-suffix remote  :remote-method="(val) => SelectQuery(val, Ci)" :disabled="calcDISABLED(Ci)" :loading="SelectLoading" :data="SelectOptions[Ci.FIELD]" @focus="SelectFocus(Ci)" @change="(val) => SelectChange(Ci, val)" @clear="SelectChange(Ci, null)" style="width: 100%" :render-after-expand="false" :placeholder="' '" :props="{ label: 'LABEL', children: 'CHILDREN' }" value-key="VALUE" highlightCurrent @keydown.enter="enterNextEl" />
                </template>

                <!-- ExRegion 级联选择 -->
                <el-cascader v-else-if="Ci.CONTROLS == 'ExRegion'" v-model="formData[Ci.FIELD + 'Arr']" clearable :disabled="calcDISABLED(Ci)" placeholder="" @focus="SelectFocus(Ci)" :options="SelectOptions?.[Ci.FIELD]" style="width: 100%" @change="(val) => SelectChange(Ci, val)" :props="{ label: 'LABEL',value: 'VALUE',children: 'CHILDREN' }" @clear="SelectChange(Ci, null)" @keydown.enter="enterNextEl" />

                <!-- ExTime 时间选择 -->
                <template v-else-if="Ci.CONTROLS == 'ExTime'">
                  <el-time-picker v-model="formData[Ci.FIELD]" clearable @clear="DateChange(null,Ci)" :disabled="calcDISABLED(Ci)" style="width: 100%" value-format="HH:mm:ss" @keydown.enter="enterNextEl" @change="(v)=>DateChange(v,Ci)" />
                </template>

                <!-- ExDate 日期选择 -->
                <el-date-picker v-else-if="Ci.CONTROLS == 'ExDate'" v-model="formData[Ci.FIELD]" clearable :disabled="calcDISABLED(Ci)" :type="mapDateType(Ci).type" :value-format="mapDateType(Ci).format" :disabled-date="(time) => disabledDate(time, Ci)" @change="(v)=>DateChange(v,Ci)" @clear="DateChange(null,Ci)" style="width: 100%" @keydown.enter="enterNextEl" />

                <!-- ExDateRange 日期区间 -->
                <el-date-picker v-else-if="Ci.CONTROLS == 'ExDateRange'" @change="(v) => DateChange(v, Ci)" @clear="DateChange(null,Ci)" v-model="formData[Ci.FIELD+'Arr']" unlink-panels clearable :disabled="calcDISABLED(Ci)" :disabled-date="(time) => disabledDate(time, Ci)" :type="mapDateType(Ci,true).type" range-separator="至" :value-format="mapDateType(Ci,true).format" style="width: 100%" @keydown.enter="enterNextEl" />

                <!-- ExDateTime 日期时间选择  -->
                <el-date-picker v-else-if="Ci.CONTROLS == 'ExDateTime'" v-model="formData[Ci.FIELD]" clearable @clear="DateChange(null,Ci)" :disabled="calcDISABLED(Ci)" type="datetime" :disabled-date="time => disabledDate(time, Ci)" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" @keydown.enter="enterNextEl" @change="(v)=>DateChange(v,Ci)" />

                <!-- ExDateTimeRange 日期时间区间 -->
                <el-date-picker v-else-if="Ci.CONTROLS == 'ExDateTimeRange'" @change="(v) => DateChange(v, Ci)" v-model="formData[Ci.FIELD+'Arr']" clearable @clear="DateChange(null,Ci)" unlink-panels :disabled="calcDISABLED(Ci)" :disabled-date="(time) => disabledDate(time, Ci)" :prefix-icon="9" type="datetimerange" range-separator="至" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" :default-time="defaultTime" @keydown.enter="enterNextEl" />

                <!-- ExRadio 单选  -->
                <el-radio-group v-else-if="Ci.CONTROLS == 'ExRadio'" v-model="formData[Ci.FIELD]" :disabled="calcDISABLED(Ci)" @change="(val) => SelectChange(Ci, val)" @keydown.enter="enterNextEl">
                  <el-radio v-for="item in EnumData[Ci.FIELD]" :key="item.VALUE" :label="item.VALUE">{{ item.LABEL }}</el-radio>
                </el-radio-group>

                <!-- ExCheckbox 多选  -->
                <el-checkbox-group v-else-if="Ci.CONTROLS == 'ExCheckbox'" v-model="formData[Ci.FIELD + 'Arr']" :disabled="calcDISABLED(Ci)" @change="(val) => CheckChange(val, Ci.FIELD)" @keydown.enter="enterNextEl">
                  <el-checkbox v-for="item in EnumData[Ci.FIELD]" :key="item.VALUE" :label="item.VALUE">{{ item.LABEL }}</el-checkbox>
                </el-checkbox-group>

                <!-- ExArea 省市区选择 -->
                <el-cascader v-else-if="Ci.CONTROLS == 'ExArea'" v-model="formData[Ci.FIELD + 'Arr']" clearable :disabled="calcDISABLED(Ci)" placeholder=" " :options="optionsRegion" style="width: 100%" @change="(val) => SelectChange(Ci, val)" @clear="SelectChange(Ci, null)" @keydown.enter="enterNextEl" />

                <!-- ExSwitch 开关 -->
                <el-switch v-else-if="Ci.CONTROLS == 'ExSwitch'" v-model="formData[Ci.FIELD]" :disabled="calcDISABLED(Ci)" inline-prompt active-text="是" inactive-text="否" active-value="1" inactive-value="0" @change="SwitchChange(Ci)" @keydown.enter="enterNextEl" />

                <!-- ExCarNum 车牌号组件 -->
                <el-input v-else-if="Ci.CONTROLS == 'ExCarNum'" v-model.trim="formData[Ci.FIELD + 'Number']" :disabled="calcDISABLED(Ci)" class="carNO" style="width: 100%" @blur="carNoChange(Ci)" @keydown.enter="enterNextEl">
                  <template #prepend>
                    <el-popover trigger="click" v-model:visible="ExCarNumShow" placement="bottom-start" width="200">
                      <template #reference>
                        <span class="el-dropdown-link">{{ carCh }}<el-icon>
                            <ArrowDown />
                          </el-icon>
                        </span>
                      </template>
                      <el-row class="carNoBox">
                        <el-col :span="4" v-for="item in carNo" :key="item.key" @click="setCarCh(Ci.FIELD, item.label)" class="carNoBox-item">{{ item.label }}</el-col>
                      </el-row>
                    </el-popover>
                  </template>
                </el-input>

                <!-- ExUpload 图片上传 -->
                <ImageUpload v-else-if="Ci.CONTROLS == 'ExUpload'" v-model="formData[Ci.FIELD]" :limit="Ci.MAXLENGTH == '' ? 1 : Ci.MAXLENGTH * 1" style="width: 100%" @keydown.enter="enterNextEl" />

                <!-- ExShowImage 图片预览 -->
                <ImagePreview v-else-if="Ci.CONTROLS == 'ExShowImage'" :src="formData[Ci.FIELD]" />

                <!-- ExUploadFile 文件上传 -->
                <FileUpload v-else-if="Ci.CONTROLS == 'ExUploadFile'" v-model="formData[Ci.FIELD]" :filelist="formData[Ci.FIELD+'Arr']" :data="uploadData" :ajaxUrl="Ci.OTHER" :limit="Ci.MAXLENGTH == '' ? 5 : Ci.MAXLENGTH * 1" :fileType="Ci.SLOTCFG" style="width: 100%" @change="val=>setUploadFile(val,Ci)" />

                <!-- ExEditor 富文本 -->
                <Editor v-else-if="Ci.CONTROLS == 'ExEditor'" ref="editorRef" v-model="formData[Ci.FIELD]" :width="editorStyleConfig(Ci).width" :height="editorStyleConfig(Ci).height" :style="editorStyleConfig(Ci).style" />

                <!-- ExSelectModal 下拉表格 -->
                <template v-else-if="Ci.CONTROLS == 'ExSelectTable'">
                  <el-dropdown ref="DropdownRef" size="small" trigger="slot" placement="bottom-start" style="width: 100%">
                    <el-input v-model="formData[Ci.FIELD]" type="text" clearable @clear="SelectChange(Ci, null)" @input="getSelectTableData(Ci)" @blur="resetSelectTableData(Ci)" :disabled="calcDISABLED(Ci)" @keydown.enter="enterNextEl">
                      <template #append>
                        <el-button :icon="ArrowDown" :disabled="calcDISABLED(Ci)" @click.stop="getSelectTableData(Ci)" />
                      </template>
                    </el-input>
                    <template #dropdown>
                      <div :style="`width:${ExSelectModalConfig.width? ExSelectModalConfig.width: '100%'}`">
                        <VTable :tableCFG="ExSelectModalConfig" :tableData="SelectModalList" @click.self="(row) => SelectChange(Ci, row)" />
                      </div>
                    </template>
                  </el-dropdown>
                </template>

                <!-- ExSelectModal 下拉表格 + 搜索弹窗 -->
                <template v-else-if="Ci.CONTROLS == 'ExSelectModal'">
                  <el-dropdown ref="DropdownRef" size="small" trigger="slot" placement="bottom-start" style="width: 100%">
                    <el-input v-model="formData[Ci.FIELD]" type="text" clearable @clear="SelectChange(Ci, null)" @input="getSelectTableData(Ci)" :disabled="calcDISABLED(Ci)" @blur="resetSelectTableData(Ci)" @keydown.enter="enterNextEl">
                      <template #append>
                        <el-button :icon="Search" :disabled="calcDISABLED(Ci)" @click.stop="openModal(Ci)" />
                      </template>
                    </el-input>
                    <template #dropdown>
                      <div :style="`width:${ExSelectModalConfig.width? ExSelectModalConfig.width: '100%'}`">
                        <VTable :tableCFG="ExSelectModalConfig" :tableData="SelectModalList" @click.self="(row) => SelectChange(Ci, row)" />
                      </div>
                    </template>
                  </el-dropdown>
                </template>

                <!-- ExModalTable 表格弹窗 -->
                <template v-else-if="Ci.CONTROLS == 'ExModalTable'">
                  <el-input v-model="formData[Ci.FIELD]" type="text" readonly style="width: 100%" @keydown.enter="enterNextEl">
                    <template #suffix>
                      <el-icon v-show="formData[Ci.FIELD] != ''" @click="SelectChange(Ci, '')" class="el-input__icon mb-r-5">
                        <CircleClose />
                      </el-icon>
                    </template>
                    <template #append>
                      <el-button :icon="Search" :disabled="calcDISABLED(Ci)" @click="openModal(Ci)" />
                    </template>
                  </el-input>
                </template>

                <!-- ExMapAddRess 地图-地址 -->
                <!-- 读取表单值，type无值 默认打开圆 -->
                <template v-else-if="Ci.CONTROLS == 'ExMap'">
                  <el-input v-model="formData[Ci.FIELD]" type="text" readonly style="width: 100%" @keydown.enter="enterNextEl">
                    <template #append>
                      <el-button :icon="Position" @click="openMap(Ci)" />
                    </template>
                  </el-input>
                </template>

                <!-- ExModalIcon 图标 -->
                <template v-else-if="Ci.CONTROLS == 'ExModalIcon'">
                  <el-input v-model="formData[Ci.FIELD]" type="text" readonly style="width: 100%" @keydown.enter="enterNextEl">
                    <template #append>
                      <el-button :icon="Setting" @click="openFont(Ci)" />
                    </template>
                  </el-input>
                </template>

                <!-- slot 只允许本地配置使用 -->
                <template v-else-if="Ci.CONTROLS == 'slot'">
                  <slot :name="Ci.FIELD" :config="Ci" :data="formData"></slot>
                </template>

                <!-- ExReadCard 只读 -->
                <template v-else-if="Ci.CONTROLS == 'ExReadCard'">{{formData[Ci.FIELD]}}</template>

                <!-- 子表 -->
                <template v-else-if="Ci.CONTROLS == 'subTable' && Ci.ISSHOW == '1'">
                  <slot name="subTable" :config="Ci" :data="formData"></slot>
                </template>

                <!-- 其他组件 -->
                <el-input v-else v-model="formData[Ci.FIELD]" readonly disabled style="width: 100%" @keydown.enter="enterNextEl"></el-input>
              </template>

              <!--  -->
              <template v-else>
                <template v-if="Ci.CONTROLS == 'ExSelect' || Ci.CONTROLS == 'ExRadio'">
                  {{ DictLabel(EnumData?.[Ci.FIELD], formData[Ci.FIELD]) }}
                </template>
                <template v-else-if="Ci.CONTROLS == 'ExSelectMultiple' || Ci.CONTROLS == 'ExCheckbox'">
                  {{ DictLabels(EnumData?.[Ci.FIELD], formData[Ci.FIELD]) }}
                </template>
                <template v-else-if="Ci.CONTROLS == 'ExSwitch'">
                  {{ DictLabel(SWITCHDICT, formData[Ci.FIELD]) }}
                </template>
                <!-- ExSelectSearch, ExSelectMutiple, ExSelectGroup, ExRegion,ExArea 展示映射字段  -->
                <template v-else-if="
                    Ci.CONTROLS == 'ExSelectSearch' ||
                    Ci.CONTROLS == 'ExSelectMutiple' ||
                    Ci.CONTROLS == 'ExSelectGroup' ||
                    Ci.CONTROLS == 'ExRegion' ||
                    Ci.CONTROLS == 'ExArea'">
                  {{ formData[Ci.REVERFIELD] }}
                </template>

                <!-- ExModalIcon 图标 -->
                <template v-else-if=" Ci.CONROL">
                  <i :class="['fa', formData[Ci.FIELD]]"></i>
                </template>

                <!-- ExShowImage 图片预览 -->
                <ImagePreview v-else-if="Ci.CONTROLS == 'ExShowImage' || Ci.CONTROLS == 'ExUpload'" :src="formData[Ci.FIELD]" />

                <!-- ExUploadFile  文件上传 -->
                <FilePreview v-else-if="Ci.CONTROLS == 'ExUploadFile'" v-model="formData[Ci.FIELD]" :filelist="formData[Ci.FIELD+'Arr']" />

                <!-- ExEditor ExEditorPreviw 富文本 -->
                <div v-else-if="Ci.CONTROLS == 'ExEditor'" class="mce-content-body" v-html="formData[Ci.FIELD]" />

                <!-- ExJsonViewer JSON 预览 -->
                <template v-else-if="Ci.CONTROLS == 'ExJsonViewer'">
                  <JsonViewer style="width: 100%" :value="mapToJSON(formData[Ci.FIELD])" :copyable="{ copyText: '复制' }" boxed sort theme="jv-light" />
                </template>

                <template v-else-if="Ci.CONTROLS == 'subTable'">
                  <slot name="subTable"></slot>
                </template>

                <template v-else-if="Ci.CONTROLS == 'ExNumber'">
                  {{ formData[Ci.FIELD]!==formData[Ci.FIELD]?'':String(formData[Ci.FIELD])}}
                  <template v-if="Ci.SUFFIX && Ci.SUFFIX != ''">{{Ci.SUFFIX}}</template>
                </template>

                <!-- 其他情况 -->
                <template v-else>
                  <div class="content">
                    {{ formData[Ci.FIELD] }}
                    <template v-if="Ci.SUFFIX && Ci.SUFFIX != ''">{{Ci.SUFFIX}}</template>
                  </div>
                </template>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>

    <!-- 弹窗 -->
    <template>
      <vxe-modal destroy-on-close v-model="modalConfig.open" :width="modalConfig.width" :height="modalConfig.height" id="formModal" resize storage transfer show-zoom show-footer>
        <template #title>
          <span> {{ modalConfig.title }} </span>
        </template>
        <template #default>
          <ModalTable ref="modalRef" :MODULE="modalConfig.MENUID" :PAGE="modalConfig.PAGEID" :params="modalConfig.params" @submit="(data) => SelectChange(openModalConfig, data)" />
        </template>
        <template #footer>
          <el-button type="primary" size="default" @click="modalSubmit">保存</el-button>
        </template>
      </vxe-modal>
    </template>

    <!-- map -->
    <vxe-modal destroy-on-close v-model="mapOpen" width="80%" id="MapModal" height="720px" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> 地图 </span>
      </template>
      <template #default>
        <mapComponent :detail="detail" :search="mapKeyWord" v-model:type="mapData.type" v-model:adcode="mapData.adcode" v-model:center="mapData.center" v-model:path="mapData.path" v-model:radius="mapData.radius" @change="mapChange" />
      </template>
      <template #footer>
        <el-button type="primary" size="default" @click="mapSubmit">保存</el-button>
      </template>
    </vxe-modal>

    <!-- icon -->
    <vxe-modal v-model="iconOpen" id="IconModal" width="670" height="500" min-width="450" min-height="260" resize storage transfer show-footer show-zoom title="图标集">
      <div class="icon-wrap">
        <span class="Icon-div" :class="selectIcon == item ? 'active' : ''" v-for="(item, key) in optionsFont" @click="SendIconString(item)" :key="key">
          <i :class="'fa ' + item"></i>
        </span>
      </div>
      <template #footer>
        <el-button type="primary" size="default" @click="setIcon">保存</el-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script setup name="Form">
import { Search, Position, CircleClose, ArrowDown, Setting } from "@element-plus/icons-vue";
import { SWITCH } from "@/config";
import FilePreview from "@/components/FileUpload/detail";
import Editor from "@/components/Editor";
import VTable from "@/components/Tables";
import ModalTable from "./modal";
import mapComponent from "@/components/Map";
import { JsonViewer } from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";
import { getPageConfig, getTableData } from "@/api/system/page";
import md5 from "@/utils/md5";
import { getFormValue, GetDateAfter, evilFn, formatDate, deepClone } from "@/utils";
import useUserStore from '@/store/modules/user'

const props = defineProps({
  // 数据
  formData: Object,
  // 配置
  formConfig: Array,
  // 规则
  rules: {
    type: Object,
    default: {},
  },
  // 行内模式
  inline: {
    type: Boolean,
    default: false,
  },
  // 详情模式
  detail: {
    type: Boolean,
    default: false,
  },
  // 表单其它配置  表单的label宽度
  othConfig: {
    type: Object,
    default: {}
  },
  size: {
    type: String,
    default: "small"
  },
  labelPosition: {
    type: String,
    default: "right"
  },
  mainFormData: {
    type: Object,
    default: {}
  }
});
const emit = defineEmits(["select", "enter", "copyto"]);
const encryData = ref({});
const { proxy } = getCurrentInstance();
const ruleFormRef = ref();
const router = useRouter();
const MENUID = router.currentRoute.value.meta.BILLNO;
const SWITCHDICT = reactive(SWITCH);

const optionsRegion = ref([]);


// const getAreaData = import("@/utils/areadata").then((res) => {
//   optionsRegion.value = res.default;
// });

const newLabelWidth = ref('');
// 计算label的宽度
const labelWidth = () => {
  if (props.othConfig?.labelWidth) {
    newLabelWidth.value = props.othConfig?.labelWidth
    return props.othConfig?.labelWidth;
  }
  let w = '100px', l = props.formConfig.length;
  for (let i = 0; i < l; i++) {
    if (props.formConfig[i]?.LABEL.length > 8) {
      w = '150px'
      return '150px'
    }
  }
  newLabelWidth.value = w
  return w;
}
// 计算label高度
const setLabeTop = (cf) => {
  let w = newLabelWidth.value.replace('px', '') * 1, length = cf.LABEL.length;
  if (!props.othConfig?.labelWidth) return {};
  if (length * 15 > w) {
    let a = { top: '1px' }
    return a;
  }
}

// 富文本配置
const editorStyleConfig = computed(config => {
  return config => {
    try {
      let { SLOTCFG } = config
      if (!SLOTCFG) return { style: "width:100%", width: "100%", height: '500px' }
      let { width = "100%", height = "500px" } = JSON.parse(SLOTCFG)
      return { style: `width:${width}`, width, height }
    } catch (error) {
      return { style: "width:100%", width: "100%", height: '500px' }
    }
  }
})

const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)];

// 文件上传时传递参数
const uploadData = reactive({
  MODULEID: MENUID,
  PAGEID: "",
});

// 枚举数据
const EnumData = ref({});
const mapEnumData = () => {
  let rowData = getFormValue(props.formConfig);
  EnumData.value = rowData.EnumData;
};

watch(() => props.formConfig, () => {
  mapEnumData();
}, {
  immediate: true,
});

// 动态控制 diabled
const calcDISABLED = computed(config => {
  return config => {
    let { ISDISABLED, SLOTCFG, LINKAGE } = config
    if (!SLOTCFG || (SLOTCFG && !SLOTCFG.includes("ISDISABLED"))) return ISDISABLED == '1'
    try {
      let slotConfig = JSON.parse(SLOTCFG)
      let Data = props.formData
      if (LINKAGE) cleanEvent(config);
      return evilFn(Data, slotConfig.ISDISABLED)
    } catch (err) {
      console.error("动态DISABLED失败", err);
    }
  }
})

// 车牌号组件相关
const carConfig = ref([]);
const carNo = ref([]);
const getCarNo = import("@/utils/carNo").then((res) => {
  carNo.value = res.default;
  if (carCh.value == "") carCh.value = res.default[0].label;
});
const carCh = ref("");
const ExCarNumShow = ref(false)
const setCarConfig = () => {
  let config = carConfig.value[0];
  let { FIELD } = config;
  let data = props.formData[FIELD];
  if (data) {
    carCh.value = data.substring(0, 1);
    props.formData[FIELD + "Number"] = data.substring(1).toUpperCase();
  }
};
const setCarCh = (FIELD, val) => {
  carCh.value = val;
  ExCarNumShow.value = false
  props.formData[FIELD] = props.formData[FIELD + "Number"] == "" ? "" : carCh.value + props.formData[FIELD + "Number"]?.toUpperCase();
};
const carNoChange = (config) => {
  let { FIELD } = config;
  props.formData[FIELD] = props.formData[FIELD + "Number"] == "" ? "" : carCh.value + props.formData[FIELD + "Number"]?.toUpperCase();
};

const showFormConfig = computed(() => {
  return props.formConfig.filter((el) => el.ISSHOW != 0);
});

// 级联控制是否显示
const isShowJudge = (el) => {
  if (el.LINKAGE && el.LINKAGE.includes("ISREQUIRE")) isIsRequire(el);
  if (el.ISSHOW == 1) return true;
  try {
    if (el.ISSHOW == 2) {
      let Data = props.formData;
      if (el.LINKAGE && el.LINKAGE.includes("ISSHOW")) {
        let contj = JSON.parse(el.LINKAGE);
        return evilFn(Data, contj.ISSHOW)
      }
      return false;
    }
  } catch (err) {
    console.error("级联控制是否显示异常了", err);
    return false;
  }
};

// 级联控制是否必填
const isIsRequire = (el) => {
  try {
    let contj = JSON.parse(el.LINKAGE);
    let Data = props.formData;
    if (evilFn(Data, contj.ISREQUIRE)) props.rules[el.FIELD][0].required = true;
  } catch (err) {
    console.error("级联控制是否必填异常了", err);
  }
};

watch(() => props.formData, (val) => {
  setTimeout(() => {
    setDataArrs();
    LoadInitSelectData();
  }, 1);
}, {
  immediate: true
});

// 给需要Arr数组的 控件 赋值
const setDataArrs = () => {
  if (showFormConfig.value.length == 0) return;
  const data = showFormConfig.value.filter(el => el.CONTROLS == "ExSelectMultiple" || el.CONTROLS == "ExSelectMutiple" || el.CONTROLS == "ExCheckbox" || el.CONTROLS == "ExRegion" || el.CONTROLS == "ExArea" || el.CONTROLS == 'ExDateRange' || el.CONTROLS == 'ExDateTimeRange');
  carConfig.value = props.formConfig.filter(el => el.CONTROLS === "ExCarNum");
  if (carConfig.value.length > 0) setCarConfig();
  selectIconConfig.value = props.formConfig.filter(el => el.CONTROLS == "ExModalIcon");
  if (selectIconConfig.value.length > 0) setIconConfig();
  mapConfig.value = props.formConfig.filter((el) => el.CONTROLS === "ExMap");
  if (mapConfig.value.length > 0) setMapConfig();
  if (data.length == 0) return;
  for (let i = 0; i < data.length; i++) {
    let { FIELD } = data[i];
    props.formData[FIELD + "Arr"] = props.formData[FIELD] == "" || props.formData[FIELD] == undefined || props.formData[FIELD] == null ? [] : props.formData[FIELD].split(",");
  }
};

// 重置Form
function resetForm() {
  if (!ruleFormRef) return;
  ruleFormRef.value.resetFields();
}

// 提交Form
const submitForm = () => {
  if (!ruleFormRef) return;
  return new Promise((resolve) => {
    ruleFormRef.value.validate((valid) => {
      if (!valid) return;
      Object.assign(props.formData, encryData.value);
      resolve(valid);
    });
  });
};

// 输入框 相关
const setEncry = (config) => {
  let { FIELD, ISAES } = config;
  if (ISAES == "" || ISAES == "-") return;
  switch (ISAES) {
    case "4": // md5加密
      if (props.formData[FIELD] != "") {
        encryData.value[FIELD] = md5.hex_md5(props.formData[FIELD]);
      } else {
        delete encryData.value[FIELD];
      }
      break;
  }
};

// 赋值用户信息
function setUserinfoData(val = '') {
  if (val == null || val == '' || !val.includes("U$")) return val
  let Id = val.substring(2, val.length)
  // const Ids = ["ORGNAME", "PK_ORG", "GROUOPNAME", "PK_GROUP", "DEPTNAME", "PK_DEPT", "USERNAME", "BILLNO"]
  // if (!Ids.includes(Id)) return ""
  const UserInfo = useUserStore().userInfo
  if (!UserInfo) return ""
  return UserInfo[Id]
}

// Select组件 相关
const SelectLoading = ref(false);
// selectGroup 节点是否可选
const selectGroupStage = computed(config => {
  return config => {
    try {
      let { SLOTCFG } = config
      return !SLOTCFG.includes('"selectStage":false')
    } catch (error) {
      return true
    }
  }
})
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
const LoadInitSelectData = () => {
  let arr = showFormConfig.value.filter(el => el.CONTROLS == "ExSelectSearch" || el.CONTROLS == "ExSelectMutiple" || el.CONTROLS == "ExSelectGroup" || el.CONTROLS == "ExSelectModal" || el.CONTROLS == "ExSelectTable" || el.CONTROLS == "ExRegion");
  if (arr.length == 0) return;
  let indexArr = [];
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    if (el.CONTROLS == "ExSelectModal" || el.CONTROLS == "ExSelectTable") {
      indexArr.push(el.FIELD);
    } else {
      // if (props.inline) return false;
      if (el.CONTROLS == 'ExRegion') { SelectQuery("", el); }
      else if (el.CONTROLS == 'ExSelectMutiple') {
        if (!props.formData[el.FIELD] || props.formData[el.FIELD] == '' || !el.REVERFIELD || props.formData[el.REVERFIELD] == '') {
          SelectOptions.value[el.FIELD] = [];
          continue;
        };
        let valueArr = props.formData[el.FIELD].split(","),
          nameArr = props.formData[el.REVERFIELD].split(","),
          dataArr = [];
        if (valueArr.length != nameArr.length) return false;
        for (let i = 0; i < valueArr.length; i++) {
          const value = valueArr[i],
            label = nameArr[i];
          dataArr.push({ LABEL: label, VALUE: value })
        }
        SelectOptions.value[el.FIELD] = dataArr;
      } else {
        SelectOptions.value[el.FIELD] = el.REVERFIELD && props.formData[el.REVERFIELD] ? [{ LABEL: props.formData[el.REVERFIELD], VALUE: props.formData[el.FIELD] }] : [];
        if (el.LINKAGE && el.LINKAGE.includes("LOADDATA") && props.formData[el.FIELD]) SelectChangeAfter(el, props.formData[el.FIELD])
      }
    }
  }
  DropdownRefIndex.value = indexArr;
};
const SelectFocus = (config) => {
  let { FIELD } = config;
  // if (!SelectOptions.value[FIELD] || SelectOptions.value[FIELD].length) return
  SelectQuery("", config);
}
const SelectQuery = (keyword = undefined, config) => {
  if (keyword == undefined) return
  let { FIELD, OTHER } = config;
  if (OTHER == "") return;
  let { url, data } = ParseOtherConfig(OTHER);
  if (url == "") return;
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
const SelectValueTo = ref([]);
const SelectChange = (config, val) => {
  const { FIELD, CONTROLS, OTHER, SLOT } = config;
  ParseOtherConfig(OTHER);
  let data = Array.isArray(val) ? [] : null;
  if (val != "" && val != null) {
    switch (CONTROLS) {
      case "ExSelect":
        data = EnumData.value?.[FIELD].find((el) => el.VALUE == val);
        break;
      case "ExSelectMultiple":
        var arr = [];
        for (let i = 0; i < val.length; i++) {
          const el = val[i];
          let Di = EnumData.value?.[FIELD].find((al) => al.VALUE == el);
          arr.push(Di);
        }
        data = arr;
        setSelectMutipleValue(FIELD, val);
        break;
      case "ExSelectSearch":
        if (config.SLOTCFG && config.SLOTCFG.includes('CREATED')) {
          data = SelectOptions.value[FIELD].find((el) => el.VALUE == val) == null ? { LABEL: val, VALUE: val } : SelectOptions.value[FIELD].find((el) => el.VALUE == val);
        } else {
          data = SelectOptions.value[FIELD].find((el) => el.VALUE == val);
        }
        break;
      case "ExSelectMutiple":
        var arr = [];
        for (let i = 0; i < val.length; i++) {
          const el = val[i];
          let Di = SelectOptions.value[FIELD].find((al) => al.VALUE == el);
          arr.push(Di);
        }
        data = arr;
        setSelectMutipleValue(FIELD, val);
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
        setSelectMutipleValue(FIELD, val);
        break;
      case "ExArea":
        let [province, city, county] = val;
        let areaData = {
          data: val.join(","),
          province,
          provinceName: treeFind(optionsRegion.value, (al) => al.value == province).label,
          city,
          cityName: treeFind(optionsRegion.value, (al) => al.value == city).label,
          county,
          countyName: county != undefined ? treeFind(optionsRegion.value, (al) => al.value == county).label : undefined,
        };
        areaData.dataName = [areaData.provinceName, areaData.cityName, areaData.countyName].join(",")
        props.formData[FIELD] = areaData.data
        data = areaData;
        break;
      case "ExSelectTable":
      case "ExSelectModal":
        data = val;
        SelectTableSetData.value[FIELD] = deepClone(val)
        props.formData[FIELD] = val == null ? '' : Array.isArray(val) ? val.map(el => el?.BILLNO).join(",") : val?.BILLNO
        setTimeout(() => {
          let index = DropdownRefIndex.value.findIndex((el) => el == FIELD);
          DropdownRef.value[index].handleClose();
          modalConfig.open = false;
        }, 200);
        break;
      case "ExModalTable":
        data = val;
        props.formData[FIELD] = val == null ? '' : val?.BILLNO
        setTimeout(() => {
          modalConfig.open = false;
        }, 200);
        break;
    }
  }
  if (config.LINKAGE) {
    cleanEvent(config);
    numberBlur(config)
    DateCalc(config);
    SelectChangeAfter(config, val)
  }
  setSelectValue(data);
  ruleFormRef.value.clearValidate([FIELD]);
  emit("select", {
    id: FIELD,
    query: SLOT == 1 ? true : false,
    config,
    value: val,
    data,
    valueTo: SelectValueTo.value,
  });
};
const SelectChangeAfter = (config, val) => {
  let { FIELD, LINKAGE } = config;
  if (!LINKAGE.includes("COPYTO") && !LINKAGE.includes("LOADDATA")) return;
  try {
    let Linkage = JSON.parse(LINKAGE),
      value = val instanceof Object ? val.BILLNO : val;
    if (Linkage.hasOwnProperty("LOADDATA")) emit("loadData", { config: Linkage, confirm: false, value })
    if (Linkage.hasOwnProperty("COPYTO")) emit("loadData", { config: Linkage, confirm: true, value, })
  } catch (err) {
    console.error("Error:SelectChangeAfter解析错误", err);
  }
}

// 多选组件 回写值
const setSelectMutipleValue = (id, val) => {
  props.formData[id] = val.join(",");
};

// 根据OTHER赋值
const setSelectValue = (data) => {
  if (SelectValueTo.value.length == 0) return;
  for (let i = 0; i < SelectValueTo.value.length; i++) {
    const { k: key, v: value } = SelectValueTo.value[i];
    if (data != null) {
      if (Array.isArray(data)) {
        if (data.length == "0") {
          props.formData[key] = "";
        } else {
          let arr = [];
          for (let i = 0; i < data.length; i++) {
            const el = data[i];
            arr.push(el[value]);
          }
          props.formData[key] = arr.join(",");
        }
      } else {
        props.formData[key] = data?.[value];
      }
    } else {
      props.formData[key] = "";
    }
  }
  SelectValueTo.value = [];
};

const calcPoint = config => {
  let { FIELD, LINKAGE, MAXLENGTH, SLOTCFG } = config,
    point = 2;
  if (MAXLENGTH && (Number(props.formData[FIELD]) > Number(MAXLENGTH))) props.formData[FIELD] = Number((props.formData[FIELD] + '').slice(0, MAXLENGTH.length))
  if (SLOTCFG && SLOTCFG.includes("MIN")) {
    try {
      let slotConfig = JSON.parse(SLOTCFG)
      if (Number(props.formData[FIELD]) < Number(slotConfig.MIN)) props.formData[FIELD] = Number(slotConfig.MIN)
    } catch (err) {
      console.error("Error:number-MIN解析", err);
    }
  }
  // 小数点控制
  if (LINKAGE && LINKAGE.includes("POINT")) {
    try {
      let Linkage = JSON.parse(LINKAGE);
      point = Linkage?.POINT || 2;
      if (props.formData[FIELD]) props.formData[FIELD] = props.formData[FIELD].toFixed(point) * 1;
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

// 级联计算
const numberBlur = (config) => {
  let { FIELD, LINKAGE, MAXLENGTH } = config,
    point = 2;
  if (!LINKAGE || LINKAGE.includes("DAYCALC") || LINKAGE.includes("DAYSTAGE")) return;
  // 小数点控制
  if (LINKAGE.includes("POINT")) {
    try {
      let Linkage = JSON.parse(LINKAGE);
      point = Linkage.POINT;
      if (!props.formData[FIELD]) {
        props.formData[FIELD] = 0
      } else {
        props.formData[FIELD] = Number(props.formData[FIELD].toFixed(point));
      }
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
          let num = calcNUM(equ);
          props.formData[res] = Math.round(num * 10 ** point) / 10 ** point;
        }
      }
    } catch (err) {
      console.error("Error:CALC解析", err);
    }
  }
};
function calcNUM(equ) {
  try {
    const Data = props.formData;
    return evilFn(Data, equ)
  } catch (err) {
    console.warn("Err:运算错误", err);
  }
}

// 级联清空
const cleanEvent = (config) => {
  // 判断是否有需要控制的级联     {"CLEAN":"OUTERPHONE,MANAGER"}
  let { LINKAGE } = config;
  if (!LINKAGE) return;
  if (LINKAGE.includes("CLEAN")) {
    try {
      let newObjLinkage = JSON.parse(LINKAGE),
        cleanArr = newObjLinkage.CLEAN.split(",");
      if (cleanArr.length) {
        cleanArr.forEach((item) => {
          props.formData[item] = "";
        });
      }
    } catch (err) {
      console.error("Error:级联控制是否必填异常了", err);
    }
  }
};

// Switch组件 Change
const SwitchChange = config => {
  if (config.LINKAGE) {
    cleanEvent(config);
    numberBlur(config)
    DateCalc(config);
  }
};

// CheckBox组件 Change
const CheckChange = (val, ID) => {
  props.formData[ID] = val.join(",");
};

// other 回显
const DictLabel = (arr, data) => {
  arr = arr == undefined ? [] : arr;
  return proxy.selectDictLabel(arr, data);
};
const DictLabels = (arr, data, jg = ",", label = "LABEL", value = "VALUE") => {
  arr = arr == undefined ? [] : arr;
  return proxy.selectDictLabels(arr, data, jg, label, value);
};

// 判断是否存在M$,S$
function calcHasMSKey(key) {
  return (key.includes("M$") || key.includes("S$")) ? key.slice(2, key.length) : key
}

// 解析 Other 配置
function ParseOtherConfig(config) {
  if (!config) return { url: "", data: {} };
  let paramsArr = config.split("?"),
    url = "",
    setQueryParam = {},
    queryJson = {};
  if (paramsArr.length == 0) {
    url = config;
    SelectValueTo.value = [];
  } else if (paramsArr.length > 0) {
    url = paramsArr[0];
    if (paramsArr.length > 1)
      queryJson = GetUrlParams("a?" + paramsArr[1], "obj");
    if (paramsArr.length > 2) {
      setQueryParam = GetUrlParams("a?" + paramsArr[2], "obj");
      for (let ii in setQueryParam) {
        let valueKey = setQueryParam[ii]
        if (valueKey.includes("M$")) {
          valueKey = calcHasMSKey(valueKey)
          queryJson[ii] = props.mainFormData[valueKey] || "";
        } else if (valueKey.includes("S$")) {
          valueKey = calcHasMSKey(valueKey)
          queryJson[ii] = props.formData[valueKey] || "";
        } else {
          queryJson[ii] = props.formData[valueKey] || "";
        }
      }
    }
    SelectValueTo.value = GetUrlParams("a?" + paramsArr[3], "arr");
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

// 时间确认事件
function DateChange(val, config) {
  let { FIELD, CONTROLS, LINKAGE } = config
  if (CONTROLS == 'ExDateRange' || CONTROLS == 'ExDateTimeRange') {
    props.formData[FIELD] = !val ? "" : val.join(",");
  } else {
    props.formData[FIELD] = !val ? "" : val
  }
  if (LINKAGE) {
    cleanEvent(config);
    if (CONTROLS == 'ExDate') DateCalc(config)
  }
}

const DateCalc = config => {
  let { LINKAGE } = config
  // 日期计算
  if (LINKAGE.includes("DAYCALC")) {
    try {
      // {"DAYCALC":"类型|日期[运算]类型|日期=类型|赋值"}
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
            let day1 = props.formData[d1Key], day2 = props.formData[d2Key];
            num = getDaysBetween({ type: d1Type, value: day1 }, { type: d2Type, value: day2 });
          } else {
            let [d1, d2] = equ.split("+"),
              [d1Type, d1Key] = d1.split("|").length == 1 ? ["day", d1.split("|")[0]] : d1.split("|"),
              [d2Type, d2Key] = d2.split("|").length == 1 ? ["day", d2.split("|")[0]] : d2.split("|");
            let day1 = props.formData[d1Key], day2 = props.formData[d2Key];
            num = getDaysAdd({ type: d1Type, value: day1 }, { type: d2Type, value: day2 });
          }
          props.formData[resKey] = num[resType];
        }
      }
    } catch (err) {
      console.error("Error:DAYCALC解析", err);
    }
  } else if (LINKAGE.includes('DAYSTAGE')) {
    try {
      // {"DAYSTAGE":"日期@节点-日期@节点=赋值"}
      let Linkage = JSON.parse(LINKAGE),
        calcArr = Linkage.DAYSTAGE.split("&");
      for (let i = 0; i < calcArr.length; i++) {
        const el = calcArr[i].split("=");
        let [equ, res] = el;
        if (el.length) {
          let num = 0;
          if (equ.includes("-")) {
            let [d1, d2] = equ.split("-"),
              [d1K, d1SK] = d1.split("@"),
              [d2K, d2SK] = d2.split("@");
            let day1 = props.formData[d1K],
              day1S = props.formData[d1SK] == '1' ? '12:00:00' : '00:00:00',
              day2 = props.formData[d2K],
              day2S = props.formData[d2SK] == '1' ? '12:00:00' : '00:00:00';
            if (!day1 || !day2) {
              num = 0
            } else {
              let dateA = Date.parse(`${day1} ${day1S}`),
                dateB = Date.parse(`${day2} ${day2S}`);
              if (dateA < dateB) {
                props.formData[res] = 0
              } else {
                let difftime = (dateA - dateB) / 1000;
                let days = parseInt(difftime / 86400),
                  hour = parseInt(difftime / 3600) - 24 * days;
                num = days + (hour == 12 ? 1 : 0.5)
              }
            }
          }
          props.formData[res] = num
        }
      }
    } catch (err) {
      console.error("Error:DAYSTAGE解析", err);
    }
  }
}
//  日期 相减
function getDaysBetween(day1, day2) {
  let { type: d1Type, value: d1Value } = day1,
    { type: d2Type, value: d2Value } = day2;
  if (!d1Value || !d2Value) return 0
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
  if (!d1Value || !d2Value) return 0
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

// 字符串转JSON
function mapToJSON(data) {
  try {
    return data != "" ? JSON.parse(data) : {};
  } catch (err) {
    console.error("Error: JSON格式错误", err);
    return {};
  }
}

// 下拉弹窗
const DropdownRefIndex = ref([]);
const DropdownRef = ref();
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
const SelectTableSetData = ref({})
const getSelectTableConfig = (config) => {
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
      getPageConfig({ MODULEID, PAGEID, }).then(({ RESULT }) => {
        SelectTableConfig.value = RESULT;
        ExSelectModalConfig.tableColumns = RESULT.COLUMNS.filter(el => el.ISSHOW == "1");
        getSelectTableData(config);
      }).catch((err) => {
        SelectTableKey.value = "";
      });
    } else {
      getSelectTableData(config);
    }
  });
};
const getSelectTableData = (config) => {
  let { FIELD, OTHER, SLOTCFG } = config;
  if (SelectTableKey.value != FIELD) return getSelectTableConfig(config);
  let { url, data: queryParams } = ParseOtherConfig(OTHER);
  let { PK_MODULE, BILLNO } = SelectTableConfig.value;

  let ids = SLOTCFG.split(",");
  if (ids.length < 2) return console.error("Error: 配置错误");
  let [MODULEID, PAGEID, downCss] = ids;
  let downCssArr = downCss ? downCss.split("*") : ["500px", "300px"];

  let data = {
    KEYWORD: props.formData[FIELD],
    PAGENUM: 1,
    PAGESIZE: 10000,
    SORTNAME: "",
    SORTORDER: "",
    MODULEID: PK_MODULE,
    PAGEID: BILLNO,
    ...queryParams,
  };
  getTableData(url, data).then((res) => {
    SelectModalList.value = res.RESULT.RECORDS;
    ExSelectModalConfig.height = res.RESULT.RECORDS.length >= 10 || res.RESULT.RECORDS.length == 0 ? parseInt(downCssArr[1]) : res.RESULT.RECORDS.length * 26 + 30;
  }).catch(err => {
    ExSelectModalConfig.height = parseInt(downCssArr[1]);
  }).finally(() => {
    let index = DropdownRefIndex.value.findIndex((el) => el == FIELD);
    DropdownRef.value[index].handleOpen();
  });
};
const resetSelectTableData = config => {
  const { FIELD, OTHER } = config;
  ParseOtherConfig(OTHER);
  SelectChange(config, SelectTableSetData.value[FIELD])
}

// 弹窗
const modalRef = ref(null);
const modalConfig = reactive({
  open: false,
  title: "",
  MENUID: "",
  PAGEID: "",
  params: {},
  width: "90%",
  height: "90%",
});
const openModalConfig = ref({});
const openModal = (config) => {
  openModalConfig.value = config;
  let { LABEL, SLOTCFG, OTHER } = config;
  modalConfig.title = LABEL;
  if (SLOTCFG == "") return console.error("Error: 配置错误");
  let ids = SLOTCFG.split(",");
  if (ids.length != 2) return console.error("Error: 配置错误");
  let { data } = ParseOtherConfig(OTHER);
  modalConfig.MENUID = ids[0];
  modalConfig.PAGEID = ids[1];
  modalConfig.params = data;
  modalConfig.open = true;
};
const modalSubmit = () => {
  const data = modalRef.value.rows;
  if (data.length > 0) SelectChange(openModalConfig.value, data.slice(-1)[0]);
  modalConfig.open = false;
};

// Map 相关
const mapOpen = ref(false);
const mapKeyWord = ref("");
const mapData = ref({
  type: "point",
  path: [],
  center: [],
  radius: 300,
  adcode: [],
});
const mapConfig = ref([]);
const mapValueTo = ref([]);
const setMapConfig = () => {
  let config = mapConfig.value[0];
  let { OTHER } = config;
  if (OTHER == "") return;
  mapValueTo.value = GetUrlParams("/a?" + OTHER, "arr");
  for (let i = 0; i < mapValueTo.value.length; i++) {
    const { k: key, v: value } = mapValueTo.value[i];
    mapData.value[value] = props.formData[key];
  }
  if (mapData.value.type == '') mapData.value.type = 'point'
};
const openMap = (config) => {
  let { FIELD } = config;
  mapKeyWord.value = props.formData[FIELD]
  setMapConfig();
  setTimeout(() => {
    mapOpen.value = true;
  }, 100);
};
const mapChange = (res) => {
  if (mapValueTo.value.length == 0) return;
  for (let i = 0; i < mapValueTo.value.length; i++) {
    const { k: key, v: value } = mapValueTo.value[i];
    props.formData[key] = res.data[value];
  }
};
const mapSubmit = () => {
  mapOpen.value = false;
};

// 日期的禁用条件判断
const disabledDate = (time, config) => {
  let { OTHER } = config;
  if (!OTHER) return false;
  try {
    let cf = JSON.parse(OTHER);
    const date = new Date();

    // 判断是否需要设置区间的禁用
    if (cf.minVar.includes('Fixed')) {
      let minValue = cf.minVar.replace('Fixed=', '');
      if (cf.maxVar && cf.maxVar.includes('Fixed')) {
        let maxValue = cf.maxVar.replace('Fixed=', '');
        return time.getTime() < new Date(minValue).getTime() || time.getTime() > new Date(maxValue).getTime()
      }
      return time.getTime() < new Date(minValue).getTime()
    }

    if (cf.minVar.includes('Var')) {
      let row = props.formData;
      let minVarID = cf.minVar.replace('Var=', ''), minVarIDVal = minVarID ? row[minVarID] : GetDateAfter(0);
      if (cf.maxVar && cf.maxVar.includes('Var')) {
        let maxVarID = cf.maxVar.replace('Var=', ''), maxVarIDVal = maxVarID ? row[maxVarID] : GetDateAfter(0);
        return time.getTime() < new Date(minVarIDVal).getTime() || time.getTime() > new Date(maxVarIDVal).getTime()
      }
      return time.getTime() < new Date(minValue).getTime()
    }

    if (cf.hasOwnProperty('minVar') && cf.hasOwnProperty('maxVar')) {
      let minVal = Number.isNaN(parseInt(cf.minVar)) ? props.formData[cf.minVar] : GetDateAfter(parseInt(cf.minVar * 1 - 1));
      let maxVal = Number.isNaN(parseInt(cf.maxVar)) ? props.formData[cf.maxVar] : GetDateAfter(parseInt(cf.maxVar * 1 + 1));
      return time.getTime() < new Date(minVal).getTime() || time.getTime() > new Date(maxVal).getTime()
    } else if (cf.hasOwnProperty('minVar')) { // 有最小日期限制
      // 判断是否是变量，还是数字 如果是NaN  说明是变量值
      let minVal = Number.isNaN(parseInt(cf.minVar)) ? props.formData[cf.minVar] : GetDateAfter(parseInt(cf.minVar * 1 - 1));
      if (minVal) return time.getTime() < new Date(minVal).getTime();
    } else if (cf.hasOwnProperty('maxVar')) { // 只限制最大日期
      let maxVal = Number.isNaN(parseInt(cf.maxVar)) ? props.formData[cf.maxVar] : GetDateAfter(parseInt(cf.maxVar * 1 + 1));
      if (maxVal) return time.getTime() > new Date(maxVal).getTime()
    }
  } catch (err) {
    console.error("日期的禁用条件判断", err);
    return true;
  }
};

// 图标相关
const selectIcon = ref("");
const selectIconConfig = ref();
const iconOpen = ref(false);
const optionsFont = ref([]);
const getIconData = import("@/utils/font-awesome").then((res) => {
  optionsFont.value = res.default;
});
const setIconConfig = () => {
  selectIconConfig.value = selectIconConfig.value[0];
  let { FIELD } = selectIconConfig.value;
  selectIcon.value = props.formData[FIELD];
};
const openFont = (config) => {
  selectIconConfig.value = config;
  iconOpen.value = true;
};
function SendIconString(val) {
  selectIcon.value = val;
}
const setIcon = () => {
  let { FIELD } = selectIconConfig.value;
  props.formData[FIELD] = selectIcon.value;
  iconOpen.value = false;
};

// 根据配置的日期后缀类型转换格式  year/month/date/dates/datetime/
function getValFormat(t) {
  let a = {
    year: 'YYYY',
    month: 'YYYY-MM',
    date: 'YYYY-MM-DD'
  }
  return a[t] || 'YYYY-MM-DD'
}

// 推断日期组件类型
const mapDateType = computed((config, isRange = false) => {
  return (config, isRange) => {
    let { SLOTCFG, SUFFIX } = config, Ctype = SLOTCFG || SUFFIX, type = "", format = "";
    switch (Ctype) {
      case "year":
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


// enter切换焦点
const enterNextEl = (e) => {
  if (props.inline) {
    if (e.keyCode === 13) emit("enter")
  } else {
    function findFormItem(el) {
      const parent = el.parentElement;
      if (!parent) return document.body;
      if (parent.className.includes("el-form-item") && parent.className.includes("el-form-item--small")) return parent.parentElement;
      return findFormItem(parent);
    }
    function findInput(container) {
      let nextEl = container.nextElementSibling;
      if (!nextEl) return;
      let input = nextEl.querySelector("input");
      if (!input) return;
      while (input.id === "el-select") {
        nextEl = nextEl.nextElementSibling;
        if (!nextEl) return;
        input = nextEl.querySelector("input");
      }
      if (input.className.includes("el-input__inner")) return input;
    }
    if (e.keyCode === 13) {
      const container = findFormItem(document.activeElement);
      findInput(container) && findInput(container).focus();
    }
  }
};

// 上传文件赋值
const setUploadFile = (val, config) => {
  let { FIELD } = config
  props.formData[FIELD + 'Arr'] = val
}

// 加载 下拉选择数据
// LoadInitSelectData();
// watch(showFormConfig, () => {
//   if (props.detail) return;
//   LoadInitSelectData();
// });

// 主动暴露方法
defineExpose({ type: "form", resetForm, submitForm });
</script>

<style lang="scss" scoped>
.detail-form {
  :deep(.el-form-item) {
    margin-bottom: 5px;
  }
  :deep(.el-form-item__label) {
    padding: 0 10px 0 0;
    color: #999;
    font-size: var(--font-size);
  }
  .cus-form-label {
    top: 6px !important;
  }

  :deep(.el-form-item--small .el-form-item__content) {
    font-size: var(--font-size);
    word-wrap: break-all !important;
  }
}
:deep(.el-form-item) {
  &.el-form-item--small {
    margin-bottom: 15px;
  }
  .el-form-item__label {
    display: block;
    text-align: right;
    padding: 0 10px 0 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 5px;
    width: 40px;
    overflow: hidden;
  }
}
:deep(.el-form-item__label) {
  font-weight: unset;
  color: #666;
}
:deep(.el-dropdown) {
  width: 100%;
  .el-tooltip__trigger {
    width: 100%;
  }
}
:deep(.el-range-editor.el-input__inner) {
  padding: 3px;
}

.content {
  line-height: 1.2;
  word-wrap: break-word;
  word-break: normal;
  overflow: hidden;
}

.carNO {
  :deep(.el-input-group__prepend) {
    padding: 0 7px !important;
  }
}
.carNoBox {
  width: 200px;
  &-item {
    text-align: center;
    padding: 3px;
    font-size: 14px;
    &:hover {
      cursor: pointer;
      color: #fff;
      background: var(--el-color-primary);
    }
  }
}
.line24 {
  line-height: 24px;
}
.mb-r-5 {
  margin-right: 5px;
}
.el-divider--horizontal {
  margin: 10px 0 !important;
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
    box-shadow: 0 0 0 2px var(--el-color-primary);
    color: var(--el-color-primary);
    border-radius: 2 px;
  }
  .Icon-div:hover {
    box-shadow: 0 0 0 2px var(--el-color-primary);
    color: var(--el-color-primary);
    border-radius: 2 px;
  }
}

:deep(.el-form-item__label) {
  white-space: pre-line !important;
  overflow: inherit !important;
  line-height: 13px !important;
  padding-right: 5px !important;
}

// 重置表单的label 高度
.cus-form-label {
  position: relative;
  top: 8px;
}
:deep(
    .el-form-item.is-required:not(.is-no-asterisk).asterisk-left
      > .el-form-item__label:before
  ) {
  position: relative;
  top: 8px;
}
.el-dropdown-link {
  color: var(--el-color-primary);
}
</style>
