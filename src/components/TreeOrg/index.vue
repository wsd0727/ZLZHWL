<!--
 * @Author: cc2049
 * @Date: 2024-03-28 17:12:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 16:05:21
 * @Description: 溯源
-->

<template>
  <div>
    <!-- <div style="display: flex; padding: 10px;">
      <div style="margin-right: 10px"><el-switch v-model="horizontal"></el-switch> 横向</div>
      <div style="margin-right: 10px"><el-switch v-model="collapsable"></el-switch> 可收起</div>
      <div style="margin-right: 10px"><el-switch v-model="disaled"></el-switch> 禁止编辑</div>
      <div style="margin-right: 10px"><el-switch v-model="onlyOneNode"></el-switch> 仅拖动当前节点</div>
      <div style="margin-right: 10px"><el-switch v-model="cloneNodeDrag"></el-switch> 拖动节点副本</div>
    </div>
    <div style="padding: 0 10px 10px">
      背景色：<el-color-picker v-model="style.background" size="small"></el-color-picker>&nbsp;
      文字颜色：<el-color-picker v-model="style.color" size="small"></el-color-picker>&nbsp;
    </div> -->

    <div class="color-blue">
      双击节点查看单据详情
    </div>

    <div style="height: 500px;">
      <vue3-tree-org :data="SourceData" :default-expand-level="3" :props="treeOrgProps" center :horizontal="horizontal" :collapsable="collapsable" :label-style="style" :only-one-node="onlyOneNode" :clone-node-drag="cloneNodeDrag" :before-drag-end="beforeDragEnd" @on-node-drag="nodeDragMove" @on-node-drag-end="nodeDragEnd"
        @on-contextmenu="onMenus" @on-expand="onExpand" @on-node-dblclick="onNodeDblclick" >
        <template v-slot="{node}">
          <div class="tree-org-node__text node-label">
            <div class="custom-content">{{ node.label }}</div>
            <div>{{node.id}}</div>
          </div>
        </template>
      </vue3-tree-org>
    </div>

    <!-- 公共弹窗表单模块 -->
    <vxe-modal destroy-on-close v-model="modalVisible" width="80%" height="70%" id="formModal" resize storage transfer show-zoom show-footer @close="closeModal">
      <template #title>
        <span class="modal-title"> {{ activeStep?.VNAME }}：{{ activeStep?.BILLNO }}
        </span>
      </template>
      <template #default>
        <MasterForm ref="MasterFormRef" v-model:formData="formConfig.formValue" :loading="false" :formConfig="formConfig.formColumns" :tableConfig="formConfig.SubTableConfig" :formRules="{}" :tableRules="{}" :detail="true" :othConfig="{}" :infoConfig="[]" />
      </template>
      <template #footer>
        <el-button size="default" @click="closeModal"> 关闭 </el-button>
      </template>
    </vxe-modal>

  </div>
</template>
<script setup>
import { getPageConfig, getTableData, axiosSave } from "@/api/system/page";
import MasterForm from "@/components/MasterForm/index.vue";

import { ElSwitch, ElColorPicker, ElMessage } from "element-plus";
import { reactify } from "@vueuse/core";

const cloneNodeDrag = ref(true);

const style = reactify({
  background: "#fff",
  color: "#5e6d82",
});

const props = defineProps({
  SourceData: {
    type: Object,
  },
});

const treeOrgProps = ref({
  id: "BILLNO",
  pid: "PKBILLNO",
  label: "VNAME",
  expand: "expand",
  children: "CHILDRENS",
});

const horizontal = ref(true);
const collapsable = ref(true);
const onlyOneNode = ref(false);
const expandAll = ref(true);
const disaled = ref(false);

const activeStep = ref(null);

function onMenus({ node, command }) {
  console.log(node, command);
}
function onExpand(e, data) {
  console.log(e, data);
}
function onExpandAll(b) {
  console.log(b);
}
function nodeDragMove(data) {
  console.log(data);
}
function beforeDragEnd(node, targetNode) {
  return new Promise((resolve, reject) => {
    if (!targetNode) reject();
    if (node.id === targetNode.id) {
      reject();
    } else {
      resolve();
    }
  });
}
function nodeDragEnd(data, isSelf) {
  console.log(data, isSelf);
}
function onNodeDblclick(e, data) {
  activeStep.value = data;
  if (!data.PK_MODULE || !data.PK_PAGE) {
    return ElMessage.error("未配置详情节点，请联系管理员");
  }else if(data.VNAME== '上级' || data.VNAME== '下级' ){
    return '';
  }else {
    getAllconfig(data);
  }
}


function toggleExpand(data, val) {
  if (Array.isArray(data)) {
    data.forEach((item) => {
      item.expand = val;
      if (item.children) {
        this.toggleExpand(item.children, val);
      }
    });
  } else {
    data.expand = val;
    if (data.children) {
      this.toggleExpand(data.children, val);
    }
  }
}

const modalVisible = ref(false);
const formConfig = ref({
  formValue: {},
  formColumns: [],
  formRules: {},
  SubTableConfig: [],
});
function getAllconfig(data) {
  let pageID = {
    MODULEID: data.PK_MODULE,
    PAGEID: data.PK_PAGE,
  };
  getPageConfig(pageID).then((res) => {
   
    const { COLUMNS, SUBTABLE } = res.RESULT;
    formConfig.value.formColumns = COLUMNS;
    formConfig.value.SubTableConfig = SUBTABLE;
    getDetail(data);
  });
}

function getDetail(data) {
  let URL = "/oms/component/getOtderDetail";
  let query = {
    MODULEID: data.PK_MODULE,
    PAGEID: data.PK_PAGE,
    ORDERCODE: data.VCODE,
    BILLNO: data.BILLNO,
  };
  getTableData(URL, query).then((res) => {
     if(!res.RESULT){
      return ElMessage.error("未查询到详情数据，请联系管理员");
    }
    formConfig.value.formValue = res.RESULT;
    modalVisible.value = true;
  });
}
</script>


<style lang="scss" scoped>
.color-blue{
  color: var(--el-color-warning);
}
</style>