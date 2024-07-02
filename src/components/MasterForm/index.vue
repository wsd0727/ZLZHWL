<template>
  <div class="MasterForm">
    <el-skeleton :rows="15" :loading="loading" :throttle="20" animated>
      <div class="form-body" :style="InfoGridStyle.main" v-if="!loading">
        <Form ref="FormRef" :detail="detail" v-model:formData="formData" :formConfig="formConfigFilter" :rules="formRules" :othConfig="othConfig" @select="handleSelect" @enter="handleEnter" @loadData="ChangeAfter" @upload="handleUpload" @filedown="handleDownFile" @clickLink="clickLink" @desEyeClick="desEyeClick">
          <template #subTable="{config,labelWidth}" v-if="tableConfig.length > 0">
            <div class="formTable" :style="`margin-left:-${labelWidth()}`">
              <SubTableCom :ref="config.FIELD+'Ref'" :key="config.FIELD" :detail="detail || config.ISDISABLED == '1'" :title="config.LABEL" :config="comConfig(config)" v-model:data="formData[config.FIELD]" v-model:mainFormData="formData" :othConfig="othConfig" @EtbaleLinkChange="EtbaleLinkChange" @updateTableData="updateTableData">
                <template #modalBtnAfter>
                  <slot name="modalBtnAfter" />
                </template>
              </SubTableCom>
            </div>
          </template>
          <template #ExSteps="{ config }">
            <EosSteps v-model:formData="formData" :config="config" :detail="detail || config.ISDISABLED == '1'" />
          </template>
          <template #ExWarning="{ config }">
            <EosWarning :config="config" />
          </template>
          <template #TransferTree="{ config, detail }">
            <TransferTree class="formTable" :style="`margin-left:-${othConfig.labelWidth}`" :config="config" :detail="detail || config.ISDISABLED == '1'" v-model="formData[config.FIELD]" />
          </template>
        </Form>
        <!-- <FormTimeLine v-if="detail && showHistory" :data="{MODULE, PAGE, tableBillNo}" />  -->
      </div>
      <div class="form-info" :style="InfoGridStyle.info" v-if="InfoConfigList.length > 0">
        <GroupCom class="form-info-item" v-for="(item, index) in InfoConfigList" :key="item.BILLNO" :reload="item.CONTROLS == 'WorkFlowTimeLine'" @reload="item.CONTROLS == 'WorkFlowTimeLine' ? InfoReload(index) : undefined" v-model:visable="item._open" :title="item.LABEL">
          <component :ref="item.FIELD+'Ref'" :class="item.CONTROLS" :is="mapCONTROLS(item.CONTROLS, item.ISEDIT)" :detail="detail" v-model:formData="formData" :formConfig="item._config" :rules="item.RULES" :tableCFG="item._config" v-model:tableData="formData[item.FIELD]" :validRules="item.RULES" :data="workDoData" @refresh="workDetail" @upload="handleUpload" @filedown="handleDownFile" />
        </GroupCom>
      </div>
    </el-skeleton>

    <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> {{ pageConfig.modelTitle }} </span>
      </template>
      <template #default>
        <Form ref="editFormRef" mod="subform" v-model:formData="form" v-model:mainFormData="formData" :formConfig="tableCFG.tableColumns" :rules="Rules" />
      </template>
      <template #footer>
        <el-button type="primary" size="default" @click="formSubmit">保存</el-button>
      </template>
    </vxe-modal>

    <!-- <LinkModal v-if="showLinkModal" ref="LinkModalRef" @saveData="linkModalSaveData" /> -->
    <template v-if="showLinkModal?.length">
      <LinkModal ref="LinkModalRef" @saveData="linkModalSaveData" :pageNo="showLinkModal[0]" />
    </template>
  </div>
</template>

<script setup name="MasterForm">
import SubTableCom from "./SubTableCom"
import Form from "@/components/Form";
import ETable from "@/components/Tables/edit";
import VTable from "@/components/Tables";
import { getFormValue, getFormRule, deepClone } from "@/utils";
import { Plus, Delete, Edit, Notification } from "@element-plus/icons-vue";
import FormTimeLine from "./timeLine.vue"
import { detailDo, } from "#/workflow/do";
import WorkFlowTimeLine from "@/components/Workflow/timeLine.vue";
import GroupCom from "@/components/Form/group.vue"
import request from '@/utils/request'
import EosSteps from "./steps.vue"
import EosWarning from "./warning.vue"
import LinkModal from "./linkModal.vue";
import TransferTree from "@/components/ShuttleFrame/tree"
import { getDesInfo } from "@/api/common"

const props = defineProps({
  loading: Boolean,
  // 数据
  formData: Object,
  // 主表配置
  formConfig: Array,
  // 表格配置
  tableConfig: Array,
  // 右侧浮动组件配置
  infoConfig: {
    type: Array,
    default: []
  },
  // 表单校验规则
  formRules: {
    type: Object,
    default: {},
  },
  // 表格校验规则
  tableRules: {
    type: Array,
    default: [],
  },
  // 详情模式
  detail: {
    type: Boolean,
    default: false,
  },
  MODULE: {
    type: String,
    default: ""
  },
  PAGE: {
    type: String,
    default: ""
  },
  tableBillNo: {
    type: String,
    default: ""
  },
  othConfig: {
    type: Object,
    default: {}
  },
  othTabCFG: {
    type: Object,
    default: {}
  },
  totalData: {
    type: Object,
    default: {}
  },
  isWorkFlow: {
    type: Boolean,
    defaultL: false
  },
  showHistory: { // 展示单据历史
    type: Boolean,
    default: true
  },
  allButton: {
    type: Array,
    default: []
  }
});
const emit = defineEmits(["select", "enter", "upload", "btnClick", "filedown", "EtbaleChange", "EtbaleLinkChange", "updateTableData"]);
const { proxy } = getCurrentInstance();

const { formData, formConfig, tableConfig, tableRules, formRules, detail, othTabCFG } = toRefs(props)

const formConfigFilter = computed(() => formConfig.value.filter(el => el.CONTROLS != 'WorkFlowTimeLine' && el.CONTROLS != 'FLOATCOM'))
const InfoConfig = computed(() => [...props.infoConfig, ...formConfig.value.filter(el => el.CONTROLS == 'WorkFlowTimeLine')]);

const allButtons = computed(() => props.allButton)

const InfoConfigList = computed(() => {
  return InfoConfig.value.map(el => {
    return {
      _open: true,
      LABEL: el.LABEL || el.VNAME,
      FIELD: el.FIELD,
      _config: el.GROUPNO == 'FM' ? el.COLUMNS : {
        tableColumns: el.COLUMNS.filter(al => al.ISSHOW == '1'),
        tableButtons: el.BUTTON,
        hasTableTools: false,
        hasSeq: false,
        toolsConfig: [],
        loading: false,
        height: props.othTabCFG.value?.height ? props.othTabCFG.value?.height : (el._rowConfig?.SLOTCFG && el._rowConfig.SLOTCFG.includes("height")) ? JSON.parse(el._rowConfig.SLOTCFG).height : 200,
        // height: setSubTableHeight(el) ,
        cellHeight: 26,
        hasFill: false, // 表格补位
      },
      CONTROLS: el.CONTROLS || el.GROUPNO,
      ISDISABLED: el.ISDISABLED || "0",
      RULES: getFormRule(el.COLUMNS || [])
    }
  })
})

const updateTableData = (data) => {
  proxy.$emit("updateTableData", data);
}

const setSubTableHeight = (val) => {
  return false;
  // console.log(333, val);
}

const InfoConMap = ref(InfoConfigList.value.map(el => el.CONTROLS) || [])
const InfoGridStyle = computed(() => {
  if (!InfoConfig.value.length) return { main: {}, info: {} }
  if (props.othConfig.GRID) {
    let [mainWidth, infoWidth] = props.othConfig.GRID.split(":")
    return {
      main: {
        width: Number(mainWidth) * 10 + "%"
      },
      info: {
        width: Number(infoWidth) * 10 + "%"
      }
    }
  } else {
    return {
      main: {
        width: "70%"
      },
      info: {
        width: "30%"
      }
    }
  }
})
const EtbaleLinkChange = val => emit("EtbaleLinkChange", val)

const editTableButton = ref([])   // 用来判断列表内的编辑是否展示

const FormRef = ref();
const subFormRef = ref();
const InfoRef = ref(null);
const editFormRef = ref();
const tableButton = ref([]);
const tableCFG = reactive({
  tableStyle: "0",
  tableColumns: [],
  tableButtons: tableButton,
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  mergeCFG: null,
  mergeRowField: null,
  loading: false,
  height: othTabCFG.value?.height || 200,
  hasFill: true, // 表格补位
  SelectType: null
});
const subTableType = ref("Button")
const pageConfig = reactive({
  modalVisible: false,
  modalW: "60%",
  modalH: "70%",
  modelTitle: "编辑行",
});

// tabs
const activeTab = ref(0);
watch(activeTab, (val) => setTableConfig(val));
const beforeTabsChange = (val, oldval) => {
  return true;
  // return new Promise((resolve, reject) => {
  //   if (EditTableData(oldval)) {
  //     setTableValue().then(() => {
  //       resolve();
  //     });
  //   } else {
  //     resolve();
  //   }
  // });
};


const linkModalSaveData = (val) => {
  const { fileId, data } = val
  props.formData[fileId] = data
}

const evalEditBtn = (SUBLIST) => {
  try {
    return eval(editTableButton.value[0].OTHER)
  } catch (error) {
    console.error("evalEditBtn:错误！", error)
    return false
  }
}

const EditTableData = (index) => {
  let { insertRecords, updateRecords, removeRecords } = Array.isArray(subFormRef.value) ? subFormRef.value[index].xEditTable.getRecordset() : subFormRef.value.xEditTable.getRecordset();
  return insertRecords.length + updateRecords.length + removeRecords.length > 0;
};

const BaseRowData = ref(); // 表格默认行数据
const Rules = ref({});

const setTableValue = (data = {}, clear = false, FIELD) => {
  return new Promise((resolve) => {
    let { tableData } = Array.isArray(subFormRef.value) ? subFormRef.value[activeTab.value].xEditTable.getTableData() : subFormRef.value.xEditTable.getTableData();
    if (clear) {
      let newData = Array.isArray(data) ? [...data] : [data];
      props.formData[FIELD] = newData
      subFormRef.value.xEditTable.loadData(newData)
    } else {
      let newTableData = [];
      if (data && data?._X_ROW_KEY) {
        let index = tableData.findIndex(el => el._X_ROW_KEY == data._X_ROW_KEY)
        let rowData = tableData[index]
        Object.assign(rowData, data)
        newTableData = tableData
      } else {
        newTableData = !data ? tableData : Array.isArray(data) ? [...tableData, ...data] : [...tableData, data]
      }
      props.formData[FIELD] = newTableData
      subFormRef.value.xEditTable.loadData(newTableData)
    }
    setTimeout(() => {
      resolve();
    }, 1);
  });
};

// 引入数据功能
const ChangeAfter = (res) => {
  // TODO 多子表情况 如何赋值数据？
  let { url, data, config, confirm, value, type } = res
  if (value == '') return false;
  let refEl = proxy.$.refs.SUBLISTRef;
  if (confirm) {
    proxy.$modal.confirm("是否引入数据？").then(() => {
      try {
        request({
          url,
          method: "post",
          data: {
            BILLNO: value,
            MODULEID: props.MODULE,
            PAGEID: props.PAGE,
            ...data
          }
        }).then(res => {
          // if (res.RESULT.length == 0) return proxy.$modal.msgError("引入失败:引入数据为空")
          // setTableValue(res.RESULT, true);
          // subFormRef.value.updateTable(res.RESULT, true);
          refEl.updateTable(res.RESULT, true);
        })
      } catch (error) {
        console.error("COPYTO:配置错误！", error)
      }
    });
  } else {
    try {
      request({
        url,
        method: "post",
        data: {
          BILLNO: value,
          MODULEID: props.MODULE,
          PAGEID: props.PAGE,
          ...data
        }
      }).then(res => {
        // if (res.RESULT.length == 0) return proxy.$modal.msgError("请求失败:数据为空")
        if (type == 'form') {
          Object.assign(props.formData, res.RESULT)
          // props.formData = res.RESULT
        } else {
          // subFormRef.value.updateTable(res.RESULT, true);
          // setTableValue(res.RESULT, true);
          refEl.updateTable(res.RESULT, true);
        }
      })
    } catch (error) {
      console.error("COPYTO:配置错误！", error)
    }
  }
}

// 表格操作
const form = ref({ ...BaseRowData.value });

// form
const formSubmit = () => {
  editFormRef.value.submitForm().then((valid) => {
    if (!valid) return;
    let newRowData = deepClone(form.value)
    setTableValue(newRowData);
    pageConfig.modalVisible = false;
    form.value = deepClone(BaseRowData.value)
  });
};
const handleSelect = val => emit("select", val)
const handleEnter = val => emit("enter")
const handleUpload = val => emit("upload", val)
const handleDownFile = val => emit("filedown", val)
// const clickLink = val => emit("clickLink", val)


// const formModalTableCFG = ref({
//   MODULE: "",
//   PAGE: "",
//   TYPE: "",
//   tableBillNo: "",
//   ListtableData: {},
// });
// const showLinkModal = ref(
//   tableCFG.tableColumns.filter(ele=>ele.CONTROLS == 'link').length >0 ?true:false
// )

const showLinkModal = computed(() => {
  // return formConfigFilter.value.filter(ele => ele.CONTROLS == 'link').length > 0 ? true : false;
  return formConfigFilter.value.filter(ele => ele.CONTROLS == 'link');
});

const LinkModalRef = ref(null)
const clickLink = (data) => {
  // 超链接点击事件
  //  formModalTableCFG.value.tableBillNo = data.data.BILLNO;
  // let getLinkBtn = tableConfig.value[activeTab.value].BUTTON.filter((i) => {
  let getLinkBtn = allButtons.value.filter((i) => {
    return i.BILLNO == data.linkCFG;
  });
  // currentData.value = data.data;
  // getLinkBtn.length ? handelEvent({ data: getLinkBtn[0], row: data.data }) : null;

  if (getLinkBtn.length) {  // 如果有按钮 就走这个 没有就从组件里找（为了适配审批流）
    LinkModalRef.value.handelEvent({ data: getLinkBtn[0], row: data.data })
  } else {
    if (LinkModalRef.value) LinkModalRef.value.filterBtn({ data })
  }
}

// 右侧信息块
const mapCONTROLS = (Ctrl, DISABLED) => {
  switch (Ctrl) {
    case "WorkFlowTimeLine": return WorkFlowTimeLine
    case "TAB": return props.detail ? VTable : DISABLED == '1' ? VTable : ETable
    case "FM": return Form
  }
}
const InfoReload = Index => {
  return
  InfoRef.value[Index]?.getData()
}
// 右侧信息块 End

// 审批流信息块
const hasWorkFlow = computed(() => InfoConMap.value.length ? InfoConMap.value.includes("WorkFlowTimeLine") : false)
const workDoData = ref(undefined)
const workDetail = () => {
  if (!formData.value) return
  let { PROCESSINSTANCEID } = formData?.value
  if (!PROCESSINSTANCEID) return;
  detailDo(PROCESSINSTANCEID).then((res) => workDoData.value = res.RESULT);
};
watch(() => hasWorkFlow, (val) => {
  val && workDetail()
}, {
  immediate: true
})
// 审批流信息块 End

const resetForm = () => {
  activeTab.value = 0;
  FormRef.value.resetForm();
};

const submitForm = () => {
  return new Promise((resolve) => {
    FormRef.value.submitForm().then((valid) => {
      if (!valid) return resolve(false);
      // 需要验证的子表 和 需要验证的信息块 合并
      let SubHasValid = props.tableConfig.filter(el => el.ISDISABLED != '1').map(el => {
        return {
          TYPE: "subRef",
          FIELD: el.FIELD,
          GROUPNO: el.GROUPNO,
          HASONLY: el.GROUPNO === 'TAB' ? el.COLUMNS.filter(al => al.ISONLY == '1') : []
        }
      })
      let InfoHasValid = InfoConfigList.value.filter(el => el.CONTROLS != 'WorkFlowTimeLine' && el.ISDISABLED != '1').map(el => {
        return {
          TYPE: "infoRef",
          FIELD: el.FIELD,
          GROUPNO: el.CONTROLS,
          HASONLY: el.CONTROLS === 'TAB' ? el._config.tableColumns.filter(al => al.ISONLY == '1') : []
        }
      })
      const HasValid = [...SubHasValid, ...InfoHasValid]
      if (HasValid.length == 0) {
        resolve(true);
      } else {
        let validateArr = [],
          RefArr = [...subFormRef.value ? Array.isArray(subFormRef.value) ? subFormRef.value : [subFormRef.value] : [], ...InfoRef.value ? InfoRef.value : []];
        for (let i = 0; i < HasValid.length; i++) {
          let { FIELD, GROUPNO, TYPE } = HasValid[i],
            refEl = proxy.$.refs[FIELD + 'Ref'];
          if (!refEl) {
            validateArr.push(true)
            continue
          }
          if (GROUPNO == 'FM') {
            validateArr.push(refEl?.submitForm().then(sValid => sValid))
          } else {
            validateArr.push(refEl.submitForm())
          }
        }
        Promise.all(validateArr).then((res) => {
          let valids = res.filter((el) => el == undefined || el == true);
          resolve(valids.length == HasValid.length);
        })
      }
    });
  });
};

/** table 转换配置 */
const comConfig = config => {
  if (!config) return {}
  let { OTHER } = config
  let subTableConfig
  if (tableConfig.value.length == 1) {
    subTableConfig = tableConfig.value[0]
  } else {
    subTableConfig = tableConfig.value.find(el => el.BILLNO == OTHER)
  }
  return subTableConfig
}

/** 脱敏信息数据 */
const desEyeClick = config => {
  let { id, data, target } = config
  getDesInfo(data).then(res => {
    const newValue = res.RESULT
    props.formData[id] = newValue
    target()
  })
}

// 主动暴露方法
defineExpose({ resetForm, submitForm });
</script>

<style lang="scss" scoped>
:deep(.el-tabs__header) {
  padding: 0 !important;
  margin: 0 !important;
}

.MasterForm {
  max-width: 100%;
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;

  .group-title {
    font-size: 16px;
    box-sizing: border-box;
    line-height: 1.5;
    background: #fff;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        padding-left: 10px;
      }
    }
  }

  .form {
    &-body {
      width: 100%;
      // margin: 0 10px;
    }

    &-info {
      width: 30%;
      padding-left: 20px;

      &-item {
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        margin-bottom: 10px;

        .title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px;
          background: var(--el-color-info-light-9);
          font-size: 14px;

          .icon {
            margin-left: 10px;
          }
        }

        .content {
          .Form,
          .WorkFlowTimeLine {
            padding: 10px 10px 0;
          }

          :deep(.el-timeline) {
            padding-left: 10px;
          }
        }
      }
    }
  }
}

:deep(.el-tabs__content) {
  padding: 0 !important;
}

:deep(.el-tabs--border-card) {
  border-bottom: none;
}

:deep(.el-tabs__new-tab) {
  margin-right: 10px;
  font-size: 18px;
}

.formTable {
  width: calc(100% + 100px);
  margin-left: -80px;
  background: #fff;
}

.subForm {
  :deep(.el-form-item) {
    margin-bottom: 14px;
  }
}

.btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &-item {
    padding: 4px 6px;
    font-size: 14px;
    cursor: pointer;

    &:disabled,
    &[disabled="true"] {
      cursor: not-allowed;
      color: #939393 !important;
    }

    &[type="primary"] {
      color: var(--el-color-primary);
    }

    &[type="danger"] {
      color: var(--el-color-danger);
    }
  }
}

.btn-button {
  margin-bottom: 10px;
}

.saveAndAdd {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
