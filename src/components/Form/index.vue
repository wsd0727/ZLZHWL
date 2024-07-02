<template>
  <div class="Form">
    <el-form :class="['Form', detail ? 'detail-form' : '']" ref="ruleFormRef" :model="formData" :inline="inline" :label-position="detail ? 'left' :labelPosition" :rules="detail ? null : rules" :size="size" :disabled="detail" :validate-on-rule-change="false" @submit.prevent>
      <template v-for="Gi in groupConfig">
        <formGroup :key="Gi.BILLNO" :title="Gi.LABEL" v-model:visable="Gi.VALUE" :fold="!Gi.ISDISABLED" v-if="isShowJudge(Gi)">
          <el-row :gutter="inline || detail ? 0 : 10">
            <template v-for="Ci in Gi.CHILDREN" :key="Ci.BILLNO">
              <el-col :span="getSPAN(Ci)" v-if="isShowJudge(Ci)">
                <el-form-item :prop="Ci.FIELD" :label-width="labelWidth? Number(labelWidth) : inline ? '70px' : calclabelWidth()">
                  <template #label>
                    <span class="cus-form-label" :style="setLabeTop(Ci)" v-if="(Ci.CONTROLS != 'subTable' && Ci.CONTROLS != 'TransferTree') || Ci.hideLabel"> {{  Ci.LABEL  }}
                      <el-tooltip effect="light" v-if="Ci.LABELDESC">
                        <template #content>
                          <span>{{ Ci.LABELDESC }}</span>
                        </template>
                        <el-icon v-if="Ci.LABELDESC" class="tooltipIcon">
                          <QuestionFilled />
                        </el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <template v-if="!detail">
                    <!-- ExTextBox 输入框  -->
                    <el-input v-if="Ci.CONTROLS == 'ExTextBox'" v-model="formData[Ci.FIELD]" clearable autocomplete="off" @blur="InputChange(Ci)" :disabled="calcDISABLED(Ci)" :maxlength="calcNumberMax(Ci)" style="width: 100%" @keydown.enter="enterNextEl">
                      <template #append v-if="showContentBefore(Ci)">
                        <template v-if="Ci.SUFFIX && Ci.SUFFIX != ''">{{setSuffix(formData, Ci, false)}}</template>
                        <template v-if="Ci.ISAES == '3' || Ci.ISAES == '4' || Ci.ISAES == '5'">
                          <desEye :value="formData[Ci.FIELD]" :config="Ci" @click="desEyeClick" />
                        </template>
                      </template>
                    </el-input>

                    <!-- ExPassword 密码  -->
                    <template v-else-if="Ci.CONTROLS == 'ExPassword'">
                      <passAutoComplate />
                      <el-input v-model.trim="formData[Ci.FIELD]" @blur="InputChange(Ci)" @clear="InputChange(Ci)" show-password clearable autocomplete="off" :disabled="calcDISABLED(Ci)" type="password" style="width: 100%" @keydown.enter="enterNextEl"></el-input>
                    </template>

                    <!-- ExTextarea 文本域  -->
                    <el-input v-else-if="Ci.CONTROLS == 'ExTextarea'" v-model="formData[Ci.FIELD]" :disabled="calcDISABLED(Ci)" :rows="3" :maxlength="Ci.MAXLENGTH || 100" type="textarea" @keydown.enter="enterNextEl" />

                    <!-- ExNumber 数字输入框  @input="calcPoint($event, Ci)" -->
                    <div class="mo-input--number" v-else-if="Ci.CONTROLS == 'ExNumber'">
                      <el-input-number :controls="false" v-model="formData[Ci.FIELD]" clearable :precision="calcPoint.point" :disabled="calcDISABLED(Ci)" :min="calcNumberMin(Ci)" :max="calcNumberMax(Ci)" @clear="numberBlur(Ci)" @blur="numberBlur(Ci)" style="width: 100%" @keydown.enter="enterNextEl">
                      </el-input-number>
                      <div class="define-append" v-if="Ci.SUFFIX">{{setSuffix(formData, Ci, false)}}</div>
                    </div>

                    <!-- ExSelect 选择 -->
                    <template v-else-if="Ci.CONTROLS == 'ExSelect'">
                      <el-select placeholder=" " v-model="formData[Ci.FIELD]" clearable :disabled="calcDISABLED(Ci)" style="width: 100%" @change="(val) => SelectChange(Ci, val)" @clear="SelectChange(Ci, null)" @keydown.enter="enterNextEl">
                        <el-option v-for="item in EnumData[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
                      </el-select>
                    </template>

                    <!-- ExSelectMultiple ??? 下拉枚举多选 -->
                    <el-select v-else-if="Ci.CONTROLS == 'ExSelectMultiple'" v-model="formData[Ci.FIELD + 'Arr']" clearable multiple collapse-tags collapse-tags-tooltip :disabled="calcDISABLED(Ci)" :multiple-limit="Ci.MAXLENGTH == '' ? 0 : Ci.MAXLENGTH * 1" style="width: 100%" :teleported="false" @change="(val) => SelectChange(Ci, val)" @clear="SelectChange(Ci, null)" @keydown.enter="enterNextEl" placeholder=" ">
                      <el-option v-for="item in EnumData?.[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
                    </el-select>

                    <!-- ExSelectSearch 下拉查询 -->
                    <template v-else-if="Ci.CONTROLS == 'ExSelectSearch'">
                      <el-select v-model="formData[Ci.FIELD]" clearable filterable remote remote-show-suffix :remote-method="(val) => SelectQuery(val, Ci)" :loading="SelectLoading" :allow-create="selectCreated(Ci.SLOTCFG)" placeholder=" " :disabled="calcDISABLED(Ci)" style="width: 100%" @focus="SelectFocus(Ci)" @change="(val) => SelectChange(Ci, val)" @clear="SelectChange(Ci, null)" @keydown.enter="enterNextEl">
                        <el-option v-for="item in SelectOptions?.[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" style="width:100%" />
                      </el-select>
                    </template>

                    <!-- ExSelectMutiple 多项选择 -->
                    <template v-else-if="Ci.CONTROLS == 'ExSelectMutiple'">
                      <el-select v-model="formData[Ci.FIELD + 'Arr']" clearable multiple filterable collapse-tags collapse-tags-tooltip remote remote-show-suffix :remote-method="val => SelectQuery(val, Ci)" :loading="SelectLoading" :disabled="calcDISABLED(Ci)" :teleported="false" :multiple-limit="Ci.MAXLENGTH == '' ? 0 : Ci.MAXLENGTH * 1" style="width: 100%" @focus="SelectFocus(Ci)" @change="(val) => SelectChange(Ci, val)" @clear="SelectChange(Ci, null)" @keydown.enter="enterNextEl">
                        <el-option v-for="item in SelectOptions?.[Ci.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" style="width:100%" />
                      </el-select>
                    </template>

                    <!-- ExSelectGroup 分组选择  -->
                    <template v-else-if="Ci.CONTROLS == 'ExSelectGroup'">
                      <el-tree-select v-model="formData[Ci.FIELD]" :check-strictly="selectGroupStage(Ci)" :show-checkbox="selectGroupCheckBox(Ci)" clearable filterable remote-show-suffix remote :remote-method="val => SelectQuery(val, Ci)" :disabled="calcDISABLED(Ci)" :loading="SelectLoading" :data="SelectOptions[Ci.FIELD]" @focus="SelectFocus(Ci)" @change="(val) => SelectChange(Ci, val)" @clear="SelectChange(Ci, null)" style="width: 100%" popper-class="popMaxWidth" :render-after-expand="false" :placeholder="' '" :props="{ label: 'LABEL', children: 'CHILDREN' , disabled: 'ISDISABLED', }" value-key="VALUE" highlightCurrent @keydown.enter="enterNextEl" />
                    </template>

                    <!-- ExTreeSelect 权限树多选 -->
                    <template v-else-if="Ci.CONTROLS == 'ExTreeSelect'">
                      <ExTreeSelect v-model="formData[Ci.FIELD]" :config="Ci" :detail="calcDISABLED(Ci)" />
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

                    <el-radio-group v-model="formData[Ci.FIELD]" v-else-if="Ci.CONTROLS == 'ExRadioButton'" @change="SelectChangeRadio">
                      <el-radio-button v-for="item in EnumData[Ci.FIELD]" :key="item.VALUE" :label="item.VALUE">
                        {{ item.LABEL }}
                      </el-radio-button>
                    </el-radio-group>

                    <!-- ExCheckbox 多选  -->
                    <el-checkbox-group v-else-if="Ci.CONTROLS == 'ExCheckbox'" v-model="formData[Ci.FIELD + 'Arr']" :disabled="calcDISABLED(Ci)" @change="(val) => CheckChange(val, Ci.FIELD)" @keydown.enter="enterNextEl">
                      <el-checkbox v-for="item in EnumData[Ci.FIELD]" :key="item.VALUE" :label="item.VALUE">{{ item.LABEL }}</el-checkbox>
                    </el-checkbox-group>

                    <!-- ExArea 省市区选择 -->
                    <el-cascader v-else-if="Ci.CONTROLS == 'ExArea'" :props="setExAreaProps(Ci)" v-model="formData[Ci.FIELD + 'Arr']" clearable :disabled="calcDISABLED(Ci)" placeholder=" " filterable :options="optionsRegion" style="width: 100%" @change="(val) => SelectChange(Ci, val)" @clear="SelectChange(Ci, null)" @keydown.enter="enterNextEl" />

                    <!-- ExSwitch 开关 -->
                    <el-switch v-else-if="Ci.CONTROLS == 'ExSwitch'" v-model="formData[Ci.FIELD]" :disabled="calcDISABLED(Ci)" inline-prompt active-text="是" inactive-text="否" active-value="1" inactive-value="0" @change="val=>SwitchChange(val,Ci)" @keydown.enter="enterNextEl" />

                    <!-- ExCarNum 车牌号组件 -->
                    <ExPlate v-else-if="Ci.CONTROLS == 'ExCarNum'" v-model.trim="formData[Ci.FIELD]" :config="Ci" :disabled="calcDISABLED(Ci)" @keydown.enter="enterNextEl" />

                    <!-- ExUpload 图片上传 -->
                    <template v-else-if="Ci.CONTROLS == 'ExUpload'">
                      <ImagePreview v-if="calcDISABLED(Ci)" :src="formData[Ci.FIELD]" />
                      <ImageUpload v-else v-model="formData[Ci.FIELD]" :limit="Ci.MAXLENGTH == '' ? 1 : Ci.MAXLENGTH * 1" style="width: 100%" @keydown.enter="enterNextEl" />
                    </template>

                    <!-- ExPhoto 拍照  -->
                    <template v-else-if="Ci.CONTROLS == 'ExPhoto'">
                      <ImagePreview v-if="calcDISABLED(Ci)" :src="formData[Ci.FIELD]" />
                      <PhotoUpload v-else v-model="formData[Ci.FIELD]" />
                    </template>

                    <!-- ExShowImage 图片预览 -->
                    <ImagePreview v-else-if="Ci.CONTROLS == 'ExShowImage'" :src="formData[Ci.FIELD]" />

                    <!-- ExUploadFile 文件上传 -->
                    <template v-else-if="Ci.CONTROLS == 'ExUploadFile'">
                      <FilePreview v-if="calcDISABLED(Ci)" v-model="formData[Ci.FIELD]" :filelist="formData[Ci.FIELD+'Arr']" />
                      <FileUpload v-else v-model="formData[Ci.FIELD]" :filelist="formData[Ci.FIELD+'Arr']" :data="uploadData" :ajaxUrl="Ci.OTHER" :limit="Ci.MAXLENGTH == '' ? 5 : Ci.MAXLENGTH * 1" :fileType="Ci.SLOTCFG" style="width: 100%" @change="val=>setUploadFile(val,Ci)" />
                    </template>

                    <!-- ExEditor 富文本 -->
                    <!-- <Editor v-else-if="Ci.CONTROLS == 'ExEditor'" ref="editorRef" v-model="formData[Ci.FIELD]" :disabled="calcDISABLED(Ci)" :width="editorStyleConfig(Ci).width" :height="editorStyleConfig(Ci).height" :style="editorStyleConfig(Ci).style" /> -->

                    <Editor v-else-if="Ci.CONTROLS == 'ExEditor'" ref="editorRef" v-model="formData[Ci.FIELD]" :disabled="calcDISABLED(Ci)" :width="editorStyleConfig(Ci).width" :height="editorStyleConfig(Ci).height" :style="editorStyleConfig(Ci).style" style="height: 600px" />

                    <!-- ExSelectModal 下拉表格 -->
                    <template v-else-if="Ci.CONTROLS == 'ExSelectTable'">
                      <vxe-pulldown ref="DropdownRef" transfer>
                        <el-input v-model="formData[Ci.FIELD]" type="text" clearable @clear="SelectChange(Ci, null)" @keydown.stop="debounceGetSelectTableData(Ci)" @blur="resetSelectTableData(Ci)" :disabled="calcDISABLED(Ci)" @keydown.enter="enterNextEl">
                          <template #append>
                            <el-button :icon="ArrowDown" :disabled="calcDISABLED(Ci)" @click.stop="getSelectTableData(Ci)" />
                          </template>
                        </el-input>
                        <template #dropdown>
                          <div :style="`width:${ExSelectModalConfig.width? ExSelectModalConfig.width: '100%'}`">
                            <VTable :tableCFG="ExSelectModalConfig" :tableData="SelectModalList" @clickRow="(row) => SelectChange(Ci, row)" />
                          </div>
                        </template>
                      </vxe-pulldown>
                    </template>

                    <!-- ExSelectModal 下拉表格 + 搜索弹窗   @blur="resetSelectTableData(Ci)"  -->
                    <template v-else-if="Ci.CONTROLS == 'ExSelectModal'">
                      <vxe-pulldown ref="DropdownRef" transfer>
                        <template #default>
                          <el-input v-model="formData[Ci.FIELD]" type="text" clearable @clear="SelectChange(Ci, null)" @blur="resetSelectTableData(Ci)" @keydown.stop="debounceGetSelectTableData(Ci)" :disabled="calcDISABLED(Ci)" @keydown.enter="enterNextEl">
                            <template #append>
                              <el-button :icon="Search" :disabled="calcDISABLED(Ci)" @click.stop="openModal(Ci)" />
                            </template>
                          </el-input>
                        </template>
                        <template #dropdown>
                          <div class="my-dropdown" style="width: 400px;">
                            <VTable :tableCFG="ExSelectModalConfig" :tableData="SelectModalList" @clickRow="(row) => SelectChange(Ci, row)  " />
                          </div>
                        </template>
                      </vxe-pulldown>
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
                    <template v-else-if="Ci.CONTROLS == 'ExReadCard'">{{formData[Ci.FIELD] || Ci.DEFAULTVAL}}</template>

                    <!-- 子表 -->
                    <template v-else-if="Ci.CONTROLS == 'subTable' && isShowJudge(Ci)">
                      <slot name="subTable" :config="Ci" :data="formData" :labelWidth="calclabelWidth"></slot>
                    </template>

                    <!-- 评分 -->
                    <template v-else-if="Ci.CONTROLS == 'grade'">
                      <el-button type="primary" link @click="clickGrade(formData,Ci)">{{ formData[Ci.FIELD] || '评分' }}</el-button>
                    </template>

                    <!-- 超链接 -->
                    <template v-else-if="Ci.CONTROLS == 'link'">
                      <el-link type="primary" @click.stop="openLink(Ci, formData)">{{formData[Ci.FIELD] || Ci.DEFAULTVAL}}</el-link>
                    </template>

                    <!-- ExSteps 运输规则节点 -->
                    <template v-else-if="Ci.CONTROLS == 'ExSteps'">
                      <slot name="ExSteps" :config="Ci"></slot>
                    </template>

                    <!-- ExWarning 预警标题 -->
                    <template v-else-if="Ci.CONTROLS == 'ExWarning'">
                      <slot name="ExWarning" :config="Ci"></slot>
                    </template>

                    <!-- TransferTree 穿梭树 -->
                    <template v-else-if="Ci.CONTROLS == 'TransferTree'">
                      <slot name="TransferTree" :config="Ci" :detail="calcDISABLED(Ci)"></slot>
                    </template>

                    <!-- 其他组件 -->
                    <el-input v-else v-model="formData[Ci.FIELD]" readonly disabled style="width: 100%" @keydown.enter="enterNextEl"></el-input>
                  </template>
                  <!--  详情界面样式  -->
                  <template v-else>
                    <template v-if="Ci.CONTROLS == 'ExSelect' || Ci.CONTROLS == 'ExRadio'">
                      {{ formData[Ci.FIELD]?DictLabel(EnumData?.[Ci.FIELD], formData[Ci.FIELD]):'--' }}
                    </template>
                    <template v-else-if="Ci.CONTROLS == 'ExSelectMultiple' || Ci.CONTROLS == 'ExCheckbox'">
                      {{ formData[Ci.FIELD]?DictLabels(EnumData?.[Ci.FIELD], formData[Ci.FIELD]):'--' }}
                    </template>
                    <template v-else-if="Ci.CONTROLS == 'ExSwitch'">
                      {{ DictLabel(SWITCHDICT, formData[Ci.FIELD]) }}
                    </template>
                    <!-- ExSelectSearch, ExSelectMutiple, ExSelectGroup, ExRegion,ExArea 展示映射字段  -->
                    <template v-else-if="Ci.CONTROLS == 'ExSelectSearch' ||Ci.CONTROLS == 'ExSelectMutiple' ||Ci.CONTROLS == 'ExSelectGroup' ||Ci.CONTROLS == 'ExRegion' ||Ci.CONTROLS == 'ExArea'">
                      <div class="content">{{ formData[Ci.FIELD]?formData[Ci.REVERFIELD]:'--' }}</div>
                    </template>

                    <!-- ExTreeSelect 权限树多选 -->
                    <template v-else-if="Ci.CONTROLS == 'ExTreeSelect'">
                      <ExTreeSelect v-model="formData[Ci.FIELD]" :config="Ci" detail />
                    </template>

                    <!-- ExModalIcon 图标 -->
                    <template v-else-if="Ci.CONROL == 'ExModalIcon'">
                      <i :class="['fa', formData[Ci.FIELD]]"></i>
                    </template>

                    <!-- ExShowImage 图片预览 -->
                    <ImagePreview v-else-if="Ci.CONTROLS == 'ExShowImage' || Ci.CONTROLS == 'ExUpload' || Ci.CONTROLS == 'ExPhoto'" :src="formData[Ci.FIELD]" />

                    <!-- ExUploadFile  文件上传 -->
                    <FilePreview v-else-if="Ci.CONTROLS == 'ExUploadFile'" v-model="formData[Ci.FIELD]" :filelist="formData[Ci.FIELD+'Arr']" />

                    <!-- ExEditor ExEditorPreviw 富文本 -->
                    <div v-else-if="Ci.CONTROLS == 'ExEditor'" class="mce-content-body" v-html="formData[Ci.FIELD]" />

                    <!-- ExJsonViewer JSON 预览 -->
                    <template v-else-if="Ci.CONTROLS == 'ExJsonViewer'">
                      <JsonViewer v-model="formData[Ci.FIELD]" />
                    </template>

                    <!-- 超链接 -->
                    <template v-else-if="Ci.CONTROLS == 'link'">
                      <el-link type="primary" @click.stop="openLink(Ci, formData)">{{formData[Ci.FIELD] || Ci.DEFAULTVAL}}</el-link>
                    </template>

                    <!-- slot 只允许本地配置使用 -->
                    <template v-else-if="Ci.CONTROLS == 'slot'">
                      <slot :name="Ci.FIELD" :config="Ci" :data="formData"></slot>
                    </template>

                    <template v-else-if="Ci.CONTROLS == 'subTable' && isShowJudge(Ci)">
                      <slot name="subTable" :config="Ci" :data="formData" :labelWidth="calclabelWidth"></slot>
                    </template>

                    <template v-else-if="Ci.CONTROLS == 'ExNumber'">
                      {{ formData[Ci.FIELD]!==formData[Ci.FIELD]?'--':String(formData[Ci.FIELD])}}
                      <template v-if="Ci.SUFFIX && Ci.SUFFIX != ''">{{setSuffix(formData, Ci, false)}}</template>
                    </template>

                    <!-- ExSteps 运输规则节点 -->
                    <template v-else-if="Ci.CONTROLS == 'ExSteps'">
                      <slot name="ExSteps" :config="Ci"></slot>
                    </template>

                    <!-- ExWarning 预警标题 -->
                    <template v-else-if="Ci.CONTROLS == 'ExWarning'">
                      <slot name="ExWarning" :config="Ci"></slot>
                    </template>

                    <!-- SmsCode 验证码 -->
                    <template v-else-if="Ci.CONTROLS == 'SmsCode'">
                      <SmsCode v-model="formData[Ci.FIELD]" :config="Ci" />
                    </template>

                    <!-- 其他情况 -->
                    <template v-else>
                      <div class="content">
                        {{ formData[Ci.FIELD]!=''?formData[Ci.FIELD]:'--' }}
                        <template v-if="Ci.SUFFIX && Ci.SUFFIX != ''">{{setSuffix(formData, Ci, false)}}</template>
                        <template v-if="Ci.ISAES == '3' || Ci.ISAES == '4' || Ci.ISAES == '5'">
                          <desEye :value="formData[Ci.FIELD]" :config="Ci" @click="desEyeClick" />
                        </template>
                      </div>
                    </template>
                  </template>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </formGroup>
      </template>
    </el-form>

    <!-- 弹窗 -->
    <template>
      <vxe-modal className="FormModel" destroy-on-close v-model="modalConfig.open" :width="modalConfig.width" :height="modalConfig.height" id="FormModel" resize storage transfer show-zoom show-footer @zoom="resizeModal">
        <template #title>
          <span> {{ modalConfig.title }} </span>
        </template>
        <template #default>
          <ModalTable ref="modalRef" :MODULE="modalConfig.MENUID" :PAGE="modalConfig.PAGEID" :params="modalConfig.params" :ImportantParams="modalConfig.importantParams" @submit="(data) => SelectChange(openModalConfig, data)" />
        </template>
        <template #footer>
          <el-button type="primary" size="default" @click="modalSubmit">保存</el-button>
        </template>
      </vxe-modal>
    </template>

    <!-- map -->
    <vxe-modal destroy-on-close v-model="mapOpen" width="80%" id="MapModal" height="80%" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> 地图 </span>
      </template>
      <template #default>
        <mapComponent :detail="detail" :height="mapHeight" :search="mapKeyWord" v-model:type="mapData.type" v-model:adcode="mapData.adcode" v-model:center="mapData.center" v-model:path="mapData.path" v-model:radius="mapData.radius" @change="mapChange" />
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

    <!-- 评分弹窗 -->
    <vxe-modal destroy-on-close v-model="gradeModal" :width="modalConfig.width" :height="modalConfig.height" id="formModal" resize storage transfer show-zoom>
      <template #title>
        商务评分细则
      </template>
      <template #default>
        <Invitation :currentData="gradeModalRowData" @close="invitationClose" :detail="detail" />
      </template>
    </vxe-modal>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>

<script setup name="Form">
import { debounce } from 'lodash-es'
import { Search, Position, CircleClose, ArrowDown, Setting, Link } from "@element-plus/icons-vue";
import { SWITCH } from "@/config";
import FilePreview from "@/components/FileUpload/detail";
import Editor from '@/components/WangEditor/index.vue';
import VTable from "@/components/Tables";
import ModalTable from "./modal";
import mapComponent from "@/components/Map";
import PhotoUpload from "@/components/ImageUpload/photograph"
import formGroup from "@/components/Form/formGroup"
import ExPlate from "@/components/Plate"
import JsonViewer from "@/components/JsonViewer"
import { getPageConfig, getTableData } from "@/api/system/page";
import md5 from "@/utils/md5";
import { getFormValue, setSuffix, GetDateAfter, evilFn, formatDate, deepClone, trimAll, aesJmEncrypt } from "@/utils";
import useUserStore from '@/store/modules/user'
import { config } from '@fullcalendar/core/internal';
import json from '../FileIcon/config';
import Invitation from '@/views/WZC/Invitation'
import SmsCode from "@/components/SmsCode"
import ExTreeSelect from "@/components/TreeSelect"
import desEye from "./desEye.vue"

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
  mod: {
    type: String,
    default: "main"
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
  labelWidth: {
    type: [Number, String],
    default: ""
  },
  size: {
    type: String,
    default: "default"
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
const emit = defineEmits(["update:formData", "select", "enter", "copyto", "upload", "clickLink"]);
const encryData = ref({});
const { proxy } = getCurrentInstance();
const ruleFormRef = ref();
const router = useRouter();
const MENUID = router.currentRoute.value.meta.BILLNO;
const SWITCHDICT = reactive(SWITCH);

// 计算 col span
const getSPAN = computed(config => {
  return config => config.CONTROLS == 'ExTabs' || config.CONTROLS == 'subTable' ? 24 : config.COL * 1
})

const gradeModal = ref(false)
const gradeModalRowData = ref('')
const gradeModalConfig = ref(null)
const clickGrade = (row, config) => {
  gradeModal.value = true
  gradeModalRowData.value = row
  gradeModalConfig.value = config
}

const invitationClose = (data) => {
  gradeModal.value = false
  if (!gradeModalConfig.value.OTHER) return
  let obj = JSON.parse(gradeModalConfig.value.OTHER)
  for (let i in obj) {
    gradeModalRowData.value[i] = data[obj[i]]
  }
}

const groupConfig = ref([])
const mapGroupConfig = () => {
  let arr = []
  for (let i = 0; i < props.formConfig.length; i++) {
    const el = props.formConfig[i];
    if (el.CONTROLS == 'ExTabs') {
      arr.push({ BILLNO: el.BILLNO, LABEL: el.LABEL, VALUE: el.DEFAULTVAL == 'open', ISSHOW: el.ISSHOW, ISDISABLED: el.ISDISABLED, CHILDREN: [], LINKAGE: el.LINKAGE, OTHER: el.OTHER })
    } else {
      if (arr.length == 0) arr.push({ BILLNO: "0", LABEL: "", VALUE: true, ISDISABLED: 1, ISSHOW: 1, CHILDREN: [], LINKAGE: "", OTHER: "" })
      arr[arr.length - 1].CHILDREN.push(el)
    }
  }
  groupConfig.value = arr
}

const optionsRegion = ref([]);

const getAreaData = import("/public/areadata.js").then(res => {
  optionsRegion.value = res.default;
});
// 点击超链接事件
function openLink(cf, row) {
  if (cf.OTHER) {
    let giveParentData = {
      clicktype: "openLink",
      linkCFG: cf.VTYPE == "exNumLink" ? cf.REVERFIELD : cf.OTHER,
      data: row,
    };
    emit("clickLink", giveParentData);
  } else {
    openDetail(row);
  }
}
function openDetail(row) {
  let giveParentData = {
    clicktype: "detail",
    data: row,
  };
  emit("clickLink", giveParentData);
  // proxy.$emit("dbClickLink", row);
}
const newLabelWidth = ref('');
// 计算label的宽度
const calclabelWidth = () => {
  if (props.othConfig?.labelWidth) {
    newLabelWidth.value = props.othConfig?.labelWidth
    return props.othConfig?.labelWidth;
  }
  let w = '80px', l = props.formConfig.length;
  for (let i = 0; i < l; i++) {
    const el = props.formConfig[i]
    if (el.ISSHOW != '1') continue
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
// 计算是否展示 后缀
const showContentBefore = config => {
  let show = 0
  /* 检测后缀 */
  if (config.SUFFIX && config.SUFFIX != '') show++
  /* 检测字段是否加解密脱敏 */
  if (config.ISAES == '3' || config.ISAES == '4' || config.ISAES == '5') show++
  return show > 0
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
  EnumData.value = { ...rowData.EnumData, ...rowData._getDICT };
};

// 动态控制 diabled
const calcDISABLED = computed(config => {
  return config => {
    let { ISEDIT, ISDISABLED, SLOTCFG, LINKAGE } = config
    if (!SLOTCFG || (SLOTCFG && !SLOTCFG.includes("ISDISABLED"))) return props.mod != 'main' ? ISEDIT == '0' : ISDISABLED == '1'
    try {
      let slotConfig = JSON.parse(SLOTCFG)
      let Data = props.formData
      if (LINKAGE) cleanEvent(config);
      return evilFn(Data, slotConfig.ISDISABLED)
    } catch (err) {
      console.error("动态DISABLED失败", err);
      return false;
    }
  }
})

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
    if (!el.LINKAGE || !props.rules || props.detail) return;
    let contj = JSON.parse(el.LINKAGE);
    let Data = props.formData;
    if (evilFn(Data, contj.ISREQUIRE)) {
      props.rules[el.FIELD][0].required = true;
    } else {
      props.rules[el.FIELD][0].required = false;
    }
  } catch (err) {
    console.error("级联控制是否必填异常了", err);
  }
};

// 给需要Arr数组的 控件 赋值
const setDataArrs = () => {
  if (showFormConfig.value.length == 0) return;
  let { formConfig, formData } = props;
  const validControls = ["ExSelectMultiple", "ExSelectMutiple", "ExCheckbox", "ExRegion", "ExArea", "ExDateRange", "ExDateTimeRange"];
  const data = showFormConfig.value.filter(el => validControls.includes(el.CONTROLS));
  selectIconConfig.value = formConfig.filter(el => el.CONTROLS == "ExModalIcon");
  selectIconConfig.value.length > 0 && setIconConfig();
  mapConfig.value = formConfig.filter((el) => el.CONTROLS === "ExMap");
  mapConfig.value.length > 0 && setMapConfig();
  if (data.length === 0) return;
  const processedData = {};
  for (let i = 0; i < data.length; i++) {
    const { FIELD } = data[i];
    processedData[FIELD + "Arr"] = formData[FIELD] == "" || formData[FIELD] == undefined || formData[FIELD] == null ? [] : formData[FIELD].split(",");
  }
  Object.assign(formData, processedData);
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
      if (!valid) return resolve(false);
      Object.assign(props.formData, encryData.value);
      resolve(valid);
    });
  });
};

// 输入框 相关
const InputChange = (config) => {
  let { FIELD, ISAES, OTHER, LINKAGE } = config;
  if (LINKAGE) {
    if (/TRIM/.test(LINKAGE)) inputTrimAll(FIELD)
  }
  if (OTHER) {
    try {
      let cc = JSON.parse(OTHER);
      if (cc.setvalue) {
        for (let i in cc.setvalue) {
          props.formData[i] = props.formData[cc.setvalue[i]]
        }
      }
    } catch (error) {
      console.error('输入框赋值逻辑配置错误');
    }
  }
  if (ISAES || (LINKAGE && LINKAGE.includes('AESENCRYSYNC'))) EncryData(config)
};

// ENCRY
const EncryData = (config) => {
  try {
    let { FIELD, ISAES, LINKAGE } = config;
    if (ISAES && ISAES != "-") {
      switch (ISAES) {
        case "4": // md5加密
          if (props.formData[FIELD] != "") {
            encryData.value[FIELD] = md5.hex_md5(props.formData[FIELD]);
          } else {
            delete encryData.value[FIELD];
          }
          break;
      }
    }
    if (LINKAGE && LINKAGE.includes('"AESENCRYSYNC":')) { // AES
      let { AESENCRYSYNC, AESENCRYKEY = "" } = JSON.parse(LINKAGE)
      if (props.formData[FIELD] != "") {
        encryData.value[AESENCRYSYNC] = aesJmEncrypt(props.formData[FIELD], AESENCRYKEY)
      } else {
        delete encryData.value[AESENCRYSYNC];
      }
    }
  } catch (err) {
    console.error("ENCRY:失败", err)
  }
}

/** 过滤前后空字符 */
function inputTrimAll(FIELD) {
  props.formData[FIELD] = trimAll(props.formData[FIELD])
}

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

// 省市区选择是否需要级联
const setExAreaProps = (citem) => {
  let { LINKAGE } = citem
  return {
    checkStrictly: LINKAGE && LINKAGE.includes('checkStrictly')
  }
}

// Select组件 相关
const SelectLoading = ref(false);
// selectGroup 节点是否可选
const selectGroupStage = computed(config => {
  return config => {
    try {
      let { SLOTCFG } = config
      return !SLOTCFG.includes('"selectStage":false')
    } catch (err) {
      return true
    }
  }
})
// selectGroup 是否允许多选
const selectGroupCheckBox = computed(config => {
  return config => {
    try {
      let { SLOTCFG } = config
      return SLOTCFG.includes('"selectCheckBox":true')
    } catch (err) {
      return false
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
/** 自动查询 匹配  */
const autoSearchCTRL = ["ExSelectSearch", "ExSelect", "ExSelectGroup"]

const LoadInitSelectData = () => {
  const indexArr = showFormConfig.value.reduce((acc, el) => {
    if (el.CONTROLS == "ExSelectModal" || el.CONTROLS == "ExSelectTable") {
      acc.push(el.FIELD);
    } else if (el.CONTROLS == 'ExRegion' || (autoSearchCTRL.includes(el.CONTROLS) && el.DEFAULTVAL == 'auto')) {
      SelectQuery("", el);
    } else if (el.CONTROLS == 'ExSelectMutiple') {
      if (!props.formData[el.FIELD] || props.formData[el.FIELD] == '' || !el.REVERFIELD || props.formData[el.REVERFIELD] == '') {
        SelectOptions.value[el.FIELD] = [];
        return acc;
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
    } else if (el.CONTROLS == 'ExCheckbox') {
      props.formData[el.FIELD + 'Arr'] = props.formData[el.FIELD] ? props.formData[el.FIELD].split(',') : [];
    } else {
      SelectOptions.value[el.FIELD] = el.REVERFIELD && props.formData[el.REVERFIELD] ? [{ LABEL: props.formData[el.REVERFIELD], VALUE: props.formData[el.FIELD] }] : [];
      if (el.LINKAGE && el.LINKAGE.includes("LOADDATA") && props.formData[el.FIELD]) SelectChangeAfter(el, props.formData[el.FIELD])
    }
    return acc;
  }, []);
  DropdownRefIndex.value = Array.from(new Set([...indexArr]));
};
const SelectFocus = (config) => {
  let { FIELD } = config;
  // if (!SelectOptions.value[FIELD] || SelectOptions.value[FIELD].length) return
  SelectQuery("", config);
}
const SelectQuery = (keyword = undefined, config) => {
  if (keyword == undefined) return
  let { FIELD, DEFAULTVAL, CONTROLS, OTHER } = config;
  if (OTHER == "") return;
  let { url, data } = ParseOtherConfig(OTHER);
  if (url == "") return;
  SelectLoading.value = true; ``
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
    nextTick(() => {
      /** 自动查询 */
      if (autoSearchCTRL.includes(CONTROLS) && props.formData[FIELD] == 'auto' && DEFAULTVAL == 'auto' && RESULT.length > 0) {
        SelectChange(config, RESULT[0].VALUE)
      }
    })
  }).catch(() => {
    SelectOptions.value[FIELD] = [];
  }).finally(() => {
    SelectLoading.value = false;
  });
};
const SelectValueTo = ref([]);
const SelectChange = (config, val) => {
  const { FIELD, CONTROLS, OTHER, SLOT, REVERFIELD } = config;
  if (CONTROLS != 'ExSelect' && CONTROLS != 'ExSelectMultiple') {
    ParseOtherConfig(OTHER)
  } else {
    SelectValueTo.value = []
  }
  /** 表格弹窗 清空历史选择数据 */
  if (CONTROLS == 'ExSelectModal' || CONTROLS == 'ExSelectTable' && val == null) delete SelectTableSetData.value[FIELD]

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
        city = city ? city : ''
        county = county ? county : ''
        let areaData = {
          data: val.join(","),
          province,
          provinceName: province ? treeFind(optionsRegion.value, (al) => al.value == province).label : '',
          city,
          cityName: city ? treeFind(optionsRegion.value, (al) => al.value == city).label : '',
          county,
          countyName: county ? treeFind(optionsRegion.value, (al) => al.value == county).label : '',
        };
        areaData.dataName = [areaData.provinceName, areaData.cityName, areaData.countyName].join("")
        areaData.dataNameSplit = [areaData.provinceName, areaData.cityName, areaData.countyName].join(",")
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
          DropdownRef.value[index]?.hidePanel();
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
  } else {
    setSelectMutipleValue(FIELD, []);
  }
  /* 
  * 暂时注释字段名称回填功能 
  *if (REVERFIELD && (CONTROLS == 'ExSelect' || CONTROLS == 'ExSelectMultiple')) props.formData[REVERFIELD] = DictLabels(EnumData.value?.[FIELD], val) || ""; // 给字典回填名称
  */

  // if (REVERFIELD && (CONTROLS == 'ExSelect' || CONTROLS == 'ExSelectMultiple')) props.formData[REVERFIELD] = DictLabels(EnumData.value?.[FIELD], val) || ""; // 给字典回填名称


  setSelectValue(data);
  if (config.LINKAGE) {
    config.LINKAGE.includes("CLEAN") && cleanEvent(config);
    numberBlur(config)
    DateCalc(config);
    SelectChangeAfter(config, val)
    config.LINKAGE.includes("SYNC") && SetSYNCValue(config)
  }
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
  if (!LINKAGE.includes("COPYTO") && !LINKAGE.includes("LOADDATA") && !LINKAGE.includes("LOADFORM")) return;
  try {
    let Linkage = JSON.parse(LINKAGE),
      value = val instanceof Object ? val.BILLNO : val;
    if (Linkage.hasOwnProperty("LOADDATA")) {
      let { url, data } = ParseOtherConfig(Linkage.LOADDATA);
      emit("loadData", { url, data, config: Linkage, confirm: false, value, type: 'sTable' })
    }
    if (Linkage.hasOwnProperty("LOADFORM")) {
      let { url, data } = ParseOtherConfig(Linkage.LOADFORM);
      emit("loadData", { url, data, config: Linkage, confirm: false, value, type: 'form' })
    }
    if (Linkage.hasOwnProperty("COPYTO")) {
      let { url, data } = ParseOtherConfig(Linkage.COPYTO);
      emit("loadData", { url, data, config: Linkage, confirm: true, value, type: 'sTable' })
    }
  } catch (err) {
    console.error("Error:SelectChangeAfter解析错误", err);
  }
}
const SetSYNCValue = (config) => {
  let { FIELD, LINKAGE } = config;
  if (!LINKAGE.includes("SYNC")) return;
  /**
   * mod1  SYNC: A,B,C=1 同时将当前字段值赋值给其他组件 ,C=1 代表 1赋值给C
   * mod2  SYNC: {a:A=0,b:c},
   */
  try {
    let Linkage = JSON.parse(LINKAGE),
      SyncConfig = Linkage.SYNC;
    function _setValue(config) {
      let syncArr = config.split(",")
      let value = props.formData[FIELD]
      syncArr.map(el => {
        if (el.includes("=")) {
          let [keys, newValue] = el.split("=")
          props.formData[keys] = newValue
        } else {
          props.formData[el] = value
        }
      })
    }
    if (typeof SyncConfig == 'object') { // json,走 mod2
      let value = props.formData[FIELD]
      if (SyncConfig.hasOwnProperty(value)) {
        let syncObj = SyncConfig[value]
        _setValue(syncObj)
      }
    } else { // mod1
      _setValue(SyncConfig)
    }
  } catch (error) {
    console.error("Error:SYNC解析错误", error);
  }
}

// 多选组件 回写值
const setSelectMutipleValue = (id, val) => {
  let obj = {}
  obj[id] = val.join(",")
  Object.assign(props.formData, obj)
};

// 根据OTHER赋值
const setSelectValue = (data) => {
  if (!SelectValueTo.value || SelectValueTo.value.length === 0) return SelectValueTo.value = [];
  SelectValueTo.value.forEach((item) => {
    const { k: key, v: value } = item;
    if (data != null) {
      if (Array.isArray(data)) {
        props.formData[key] = data.length > 0 ? data.map((el) => el[value]).join(",") : "";
      } else {
        props.formData[key] = data[value];
      }
    } else {
      props.formData[key] = "";
    }
  });
  SelectValueTo.value = [];
};

const calcPoint = (ev, config) => {
  let { FIELD, LINKAGE, MAXLENGTH, SLOTCFG } = config,
    point = 0, min = 0;
  props.formData[FIELD] = Number(ev)

  let fieldNum = Number(props.formData[FIELD]);

  if (MAXLENGTH && (fieldNum > Number(MAXLENGTH))) props.formData[FIELD] = Number(fieldNum.toString().slice(0, MAXLENGTH.length))
  if (SLOTCFG && SLOTCFG.includes("MIN")) {
    try {
      let slotConfig = JSON.parse(SLOTCFG)
      min = slotConfig.MIN ? slotConfig.MIN : null
      // if (Number(props.formData[FIELD]) < Number(slotConfig.MIN)) props.formData[FIELD] = Number(slotConfig.MIN)
    } catch (err) {
      console.error("Error:number-MIN解析", err);
    }
  }
  // 小数点控制
  if (LINKAGE && LINKAGE.includes("POINT")) {
    try {
      let Linkage = JSON.parse(LINKAGE);
      point = Linkage?.POINT || 2;
      // if (props.formData[FIELD]) props.formData[FIELD] = props.formData[FIELD].toFixed(point) * 1;
    } catch (err) {
      console.error("Error:POINT解析", err);
    }
  }

  return { point, min }
}

const calcNumberMin = computed(() => {
  return config => {
    const slotConfig = config.SLOTCFG && JSON.parse(config.SLOTCFG);
    if (slotConfig?.MIN === undefined) return -Infinity;
    try {
      return Number(slotConfig.MIN);
    } catch (err) {
      console.error("Error:number-MIN解析", err);
      return -Infinity;
    }
  }
})

const calcNumberMax = computed(() => {
  return config => {
    let { MAXLENGTH = undefined, SLOTCFG = undefined, CONTROLS } = config
    try {
      if (!MAXLENGTH && MAXLENGTH != 0) return Infinity;
      if (!SLOTCFG || !(SLOTCFG && SLOTCFG.includes("MAX"))) return MAXLENGTH && MAXLENGTH != 0 ? MAXLENGTH : Infinity;
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

// 级联计算
const numberBlur = ({ FIELD, LINKAGE }) => {
  if (!LINKAGE || /DAYCALC|DAYSTAGE/.test(LINKAGE)) return;
  // 计算
  if (/CALC/.test(LINKAGE)) {
    try {
      const { CALC, POINT = 2 } = JSON.parse(LINKAGE);
      const calcArr = CALC.split("&");
      for (let i = 0; i < calcArr.length; i++) {
        const [equ, res] = calcArr[i].split("=");
        const num = calcNUM(equ);
        props.formData[res] = Math.round(num * 10 ** POINT) / 10 ** POINT;
      }
    } catch (err) {
      console.error("Error:CALC解析", err);
    }
  }
  // 小数点控制
  if (/POINT/.test(LINKAGE)) {
    try {
      const { POINT = 2 } = JSON.parse(LINKAGE);
      props.formData[FIELD] = !props.formData[FIELD] ? 0 : Number(Number(props.formData[FIELD]).toFixed(POINT));
    } catch (err) {
      console.error("Error:POINT解析", err);
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
      let newObjLinkage = JSON.parse(LINKAGE);
      if (typeof SyncConfig == 'object') {
        // TODO 

      } else {
        let cleanArr = newObjLinkage.CLEAN.split(",");
        if (!cleanArr.length) return false;
        cleanArr.forEach((item) => {
          if (Array.isArray(props.formData[item])) {
            props.formData[item] = []
          } else {
            props.formData[item] = "";
          }
        });
      }
    } catch (err) {
      console.error("Error:级联控制是否必填异常了", err);
    }
  }
};

// Switch组件 Change
const SwitchChange = (val, config) => {
  const { FIELD, SLOT, LINKAGE } = config;
  if (LINKAGE) {
    cleanEvent(config);
    numberBlur(config)
    DateCalc(config);
  }
  SLOT && emit("select", {
    id: FIELD,
    query: SLOT == 1 ? true : false,
    config,
    value: val,
    data: null,
    valueTo: null,
  });
};

// CheckBox组件 Change
const CheckChange = (val, ID) => {
  props.formData[ID] = val.join(",");
  nextTick(() => {
    ruleFormRef.value.clearValidate([ID]);
  })
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
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[1], "obj");
          queryJson = obj
          importantData = importantObj
        }
        if (paramsArr.length > 2) {
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[2], "obj");
          setQueryParam = obj
          setImportantParam = importantObj
          queryJson = { ...queryJson, ...ConvertData(setQueryParam) }
          importantData = { ...importantData, ...ConvertData(setImportantParam) }
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
function ConvertData(obj) {
  let data = {}
  for (let ii in obj) {
    let valueKey = obj[ii]
    if (valueKey.includes("M$")) {
      valueKey = calcHasMSKey(valueKey)
      data[ii] = props.mainFormData[valueKey] || "";
    } else if (valueKey.includes("S$")) {
      valueKey = calcHasMSKey(valueKey)
      data[ii] = props.formData[valueKey] || "";
    } else {
      data[ii] = props.formData[valueKey] || "";
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
      let Linkage = JSON.parse(LINKAGE)
      const calcArr = Linkage.DAYCALC.split("&");
      for (let i = 0; i < calcArr.length; i++) {
        const el = calcArr[i].split("=");
        if (!el.length) continue;
        let [equ, res] = el;
        let num, resType, resKey,
          [d1, d2] = equ.includes("-") ? equ.split("-") : equ.split("+"),
          [d1Type, d1Key] = d1.split("|").length === 1 ? ["day", d1.split("|")[0]] : d1.split("|"),
          [d2Type, d2Key] = d2.split("|").length === 1 ? ["day", d2.split("|")[0]] : d2.split("|"),
          day1 = props.formData[d1Key], day2 = props.formData[d2Key];
        if (equ.includes("-")) {
          num = getDaysBetween({ type: d1Type, value: day1 }, { type: d2Type, value: day2 });
        } else if (equ.includes("+")) {
          num = getDaysAdd({ type: d1Type, value: day1 }, { type: d2Type, value: day2 });
        } else {
          continue;
        }
        [resType, resKey] = res.split("|").length === 1 ? ["num", res.split("|")[0]] : res.split("|");
        props.formData[resKey] = num[resType];
      }
    } catch (err) {
      console.error("Error:DAYCALC解析", err);
    }
  } else if (LINKAGE.includes('DAYSTAGE')) {
    try {
      // {"DAYSTAGE":"日期@节点-日期@节点=赋值"}
      let Linkage = JSON.parse(LINKAGE);
      const calcArr = Linkage.DAYSTAGE.split("&");
      for (let i = 0; i < calcArr.length; i++) {
        const el = calcArr[i].split("=");
        if (!el.length) continue;
        let [equ, res] = el;
        let num = 0, d1K, d1SK, d2K, d2SK,
          [d1, d2] = equ.split("-");
        if (d1.includes("@") && d2.includes("@")) {
          [d1K, d1SK] = d1.split("@"), [d2K, d2SK] = d2.split("@");
        } else {
          continue;
        }
        let day1 = props.formData[d1K], day1S = props.formData[d1SK] === '1' ? '12:00:00' : '00:00:00',
          day2 = props.formData[d2K], day2S = props.formData[d2SK] === '1' ? '12:00:00' : '00:00:00';
        if (day1 && day2) {
          let timeA = Date.parse(`${day1} ${day1S}`),
            timeB = Date.parse(`${day2} ${day2S}`);
          if (timeA >= timeB) {
            let difftime = (timeA - timeB) / 1000,
              days = parseInt(difftime / 86400),
              hour = parseInt(difftime / 3600) - 24 * days;
            num = days + (hour === 12 ? 1 : 0.5);
          }
        }
        props.formData[res] = num
      }
    } catch (err) {
      console.error("Error:DAYSTAGE解析", err);
    }
  }
}
//  日期 相减
function getDaysBetween(startDateObj, endDateObj) {
  const { type: startDateType, value: startDateValue } = startDateObj;
  const { type: endDateType, value: endDateValue } = endDateObj;
  if (!startDateValue || !endDateValue) return { num: 0, date: "" };
  let startDate, endDate;
  if (startDateType === "day" && endDateType === "day") {
    startDate = new Date(startDateValue).getTime();
    endDate = new Date(endDateValue).getTime();
    if (startDate < endDate) return { num: 0, date: "" }
    else if (startDate === endDate) return { num: 1, date: "" }
    else {
      const timeDiff = startDate - endDate;
      const num = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
      return { num: num + 1, date: "" };
    }
  }
  return { num: 0, date: "" };
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
  height: "250px",
});
const SelectTableSetData = ref({})
const getSelectTableConfig = (config) => {
  // nextTick(() => {
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
  // });
};
const closeOtherDropdown = id => {
  if (DropdownRefIndex.value.length == 0) return
  let index = DropdownRefIndex.value.findIndex((el) => el == id);
  for (let i = 0; i < DropdownRefIndex.value.length; i++) {
    if (i != index) DropdownRef.value[i]?.hidePanel()
  }
}
const getSelectTableData = config => {
  let { FIELD, OTHER, SLOTCFG } = config;
  if (SelectTableKey.value != FIELD) {
    // closeOtherDropdown()
    return getSelectTableConfig(config);
  }
  let { url, data: queryParams, importantData } = ParseOtherConfig(OTHER);
  let { PK_MODULE, BILLNO } = SelectTableConfig.value;

  let ids = SLOTCFG.split(",");
  if (ids.length < 2) return console.error("Error: 配置错误");
  let [MODULEID, PAGEID, downCss] = ids;
  let downCssArr = downCss ? downCss.split("*") : ["500px", "300px"];
  ExSelectModalConfig.width = downCssArr[0];
  let data = {
    KEYWORD: !props.formData[FIELD] ? '' : props.formData[FIELD],
    PAGENUM: 1,
    PAGESIZE: 100,
    SORTNAME: "",
    SORTORDER: "",
    MODULEID: PK_MODULE,
    PAGEID: BILLNO,
    ...queryParams,
    ...importantData
  };
  getTableData(url, data).then((res) => {
    SelectModalList.value = res.RESULT.RECORDS;
    // ExSelectModalConfig.height = res.RESULT.RECORDS.length >= 10 || res.RESULT.RECORDS.length == 0 ? parseInt(downCssArr[1]) : res.RESULT.RECORDS.length * 26 + 30;
  }).catch(err => {
    // ExSelectModalConfig.height = parseInt(downCssArr[1]);
  }).finally(() => {
    // closeOtherDropdown()
    let index = DropdownRefIndex.value.findIndex((el) => el == FIELD);
    DropdownRef.value[index]?.showPanel();
  });
};

// 函数防抖
const debounceGetSelectTableData = debounce(config => {
  getSelectTableData(config)
}, 300)

const resetSelectTableData = config => {
  const { FIELD, OTHER } = config;
  let otherArr = OTHER.split('?');
  try {
    if (SelectTableSetData.value[FIELD]) {
      // 如果只存在一个赋值条件，允许修改 该值
      if (otherArr.length > 3 && otherArr[3].replace(/[^=]/g, "").length == 1) {
        return;
      }
      ParseOtherConfig(OTHER);
      SelectChange(config, SelectTableSetData.value[FIELD])
    } else {
      SelectChange(config, null)
    }
  } catch (error) {
    console.error('resetSelectTableData函数解析异常');
  }
}

// 弹窗
const modalRef = ref(null);
const modalConfig = reactive({
  open: false,
  title: "",
  MENUID: "",
  PAGEID: "",
  params: {},
  importantParams: {},
  width: "70%",
  height: "60%",
});
const openModalConfig = ref({});
const openModal = (config) => {
  openModalConfig.value = config;
  let { LABEL, SLOTCFG, OTHER } = config;
  modalConfig.title = LABEL;
  if (SLOTCFG == "") return console.error("Error: 配置错误");
  let ids = SLOTCFG.split(",");
  if (ids.length < 2) return console.error("Error: 配置错误");
  let { data, importantData } = ParseOtherConfig(OTHER);
  modalConfig.MENUID = ids[0];
  modalConfig.PAGEID = ids[1];
  modalConfig.params = data;
  modalConfig.importantParams = importantData;
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
  if (data.length > 0) SelectChange(openModalConfig.value, data.slice(-1)[0]);
  modalConfig.open = false;
};

// Map 相关
const mapHeight = (window.innerHeight * 0.8 - 120) + 'px';
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
    if (cf?.minVar.includes('Fixed')) {
      let minValue = cf.minVar.replace('Fixed=', '');
      if (cf?.maxVar && cf.maxVar.includes('Fixed')) {
        let maxValue = cf.maxVar.replace('Fixed=', '');
        return time.getTime() < new Date(minValue).getTime() || time.getTime() > new Date(maxValue).getTime()
      }
      return time.getTime() < new Date(minValue).getTime()
    }

    if (cf?.minVar.includes('Var')) {
      let row = props.formData;
      let minVarID = cf.minVar.replace('Var=', ''), minVarIDVal = minVarID ? row[minVarID] : GetDateAfter(0);
      if (cf.maxVar && cf.maxVar.includes('Var')) {
        let maxVarID = cf.maxVar.replace('Var=', ''), maxVarIDVal = maxVarID ? row[maxVarID] : GetDateAfter(0);
        return time.getTime() < new Date(minVarIDVal).getTime() || time.getTime() > new Date(maxVarIDVal).getTime()
      }
      return time.getTime() < new Date(minVarIDVal).getTime()
    }

    if (cf.hasOwnProperty('minVar') && cf.hasOwnProperty('maxVar')) {
      let minVal = Number.isNaN(parseInt(cf.minVar)) ? props.formData[cf.minVar] : GetDateAfter(parseInt(cf.minVar * 1 - 1));
      let maxVal = Number.isNaN(parseInt(cf.maxVar)) ? props.formData[cf.maxVar] : GetDateAfter(parseInt(cf.maxVar * 1 + 1));
      if (Number.isNaN(parseInt(cf.minVar))) {
        let ccminVal = new Date(props.formData[cf.minVar])
        let minVarIDVal = ccminVal.setDate(ccminVal.getDate() - 1)
        minVal = minVarIDVal
      }
      return time.getTime() < new Date(minVal).getTime() || time.getTime() > new Date(maxVal).getTime()
    } else if (cf.hasOwnProperty('minVar')) { // 有最小日期限制
      // 判断是否是变量，还是数字 如果是NaN  说明是变量值
      let minVal = null
      if (Number.isNaN(parseInt(cf.minVar))) {
        let ccminVal = new Date(props.formData[cf.minVar])
        let minVarIDVal = ccminVal.setDate(ccminVal.getDate() - 1)
        minVal = minVarIDVal
      } else {
        minVal = GetDateAfter(parseInt(cf.minVar * 1 - 1))
      }
      // Number.isNaN(parseInt(cf.minVar)) ? props.formData[cf.minVar] : GetDateAfter(parseInt(cf.minVar * 1 - 1));
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

const SelectChangeRadio = () => {
  emit("enter")
}

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
      findInput(container) && findInput(container)?.focus();
    }
  }
};

// 上传文件赋值
const setUploadFile = (val, config) => {
  let { FIELD } = config
  props.formData[FIELD + 'Arr'] = val
  emit("upload", {
    id: FIELD,
    config,
    value: val,
  });
}

// 获取解密脱敏信息
const desEyeClick = res => {
  res.data.BILLNO = props.formData.BILLNO || ""
  emit("desEyeClick", res)
}

// 加载 下拉选择数据
// LoadInitSelectData();
// watch(showFormConfig, () => {
//   if (props.detail) return;
//   LoadInitSelectData();
// });
watch(() => props.formConfig, () => {
  mapGroupConfig()
  mapEnumData();
  setDataArrs();
}, {
  immediate: true,
});

watch(() => props.formData, () => {
  setTimeout(() => {
    // setDataArrs();
    LoadInitSelectData();
  }, 1);
}, {
  immediate: true,
});

// 主动暴露方法
defineExpose({ type: "form", resetForm, submitForm });
</script>

<style lang="scss" scoped>
.Form {
  width: 100%;
  box-sizing: border-box;
}
.detail-form {
  :deep(.el-form-item) {
    margin-bottom: 0px;
    // border: 1px solid #e9e9e9;
  }
  :deep(.el-form-item__label) {
    // color: #393939;
    color: #737373;
    font-size: var(--font-size);
    // background-color: #f3f3f3;
    // text-align: left !important;
    padding-left: 5px !important;
  }
  .cus-form-label {
    top: 10px !important;
  }

  :deep(.el-form-item--small .el-form-item__content) {
    font-size: var(--font-size);
    word-wrap: break-all !important;
  }

  :deep(.el-form-item__content) {
    color: #0f0f0f;
  }
  .form-group {
    margin-bottom: 10px;
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
  line-height: 1.5;
  word-wrap: break-word;
  word-break: normal;
  overflow: hidden;
  color: #0f0f0f;
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
  top: 10px;
}
:deep(
    .el-form-item.is-required:not(.is-no-asterisk).asterisk-left
      > .el-form-item__label:before
  ) {
  position: relative;
  top: 12px;
}
.el-dropdown-link {
  color: var(--el-color-primary);
}
:deep(.vxe-body-row) {
  cursor: pointer;
}

.vxe-pulldown {
  width: 100%;
}

/* 自定义数字输入框append  */
.mo-input--number {
  border: 1px solid #dcdfe6;
  width: 100%;
  display: flex;
  border-radius: 4px;

  .el-input--small {
    flex: 1;
  }
  :deep(.el-input__wrapper) {
    border-radius: 0;
    border: 0 !important;
    padding-left: 0;
    padding-right: 0;
    box-shadow: none !important;
  }
}

.define-append {
  min-width: 48px;
  display: inline-block;
  background: #f5f7fa;
  padding: 0px 2px;
  border-left: none;
  height: 32px;
  line-height: 32px;
  color: #909399;
  font-size: 12px;
  text-align: center;
}
.tooltipIcon {
  color: #666;
  transform: translateY(1px);
}

:deep(.el-input__wrapper) {
  width: 100%;
}
</style>
