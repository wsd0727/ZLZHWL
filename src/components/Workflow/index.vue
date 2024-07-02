<template>
  <div :class="['workflow',detail ? 'workflow-detail' : '']">
    <el-form ref="ruleFormRef" :inline="true" :rules="rules" size="default" :model="workFlowDef">
      <div class="workflow-nav">
        <div class="workflow-nav-item" v-if="bindMenu == 'VCODE'">
          <template v-if="detail">{{workFlowDef.VCODE}}</template>
          <el-form-item v-else prop="VCODE">
            <el-input v-model="workFlowDef.VCODE" placeholder="编码"></el-input>
          </el-form-item>
        </div>
        <template v-else>
          <div class="workflow-nav-item">
            <template v-if="detail">{{workFlowDef.menuName}}</template>
            <el-form-item v-else prop="menuId">
              <el-tree-select v-model="workFlowDef.menuId" clearable accordion filterable remote-show-suffix remote :remote-method="(val) => getMenuData(val)" :data="menuData" @change="setMenuName" style="width: 100%" :render-after-expand="false" placeholder="关联菜单" :props="{ label: 'LABEL', children: 'CHILDREN' }" value-key="VALUE" highlightCurrent />
            </el-form-item>
          </div>
          <div class="workflow-nav-item" v-if="!detail && workFlowDef.menuId != ''">
            <el-form-item prop="pageId">
              <el-select v-model="workFlowDef.pageId" placeholder="关联页面">
                <el-option v-for="item in pageData" :key="item.BILLNO" :value="item.BILLNO" :label="item.VNAME"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </template>
        <div class="workflow-nav-item">
          <template v-if="detail">{{workFlowDef.name}}</template>
          <el-form-item v-else prop="name">
            <el-input v-model="workFlowDef.name" placeholder="审批流名称"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="workflow-content">
      <section class="design">
        <div class="zoom">
          <div class="zoom-out" :class="nowVal == 50 && 'disabled'" @click="zoomSize(1)"></div>
          <span>{{ nowVal }}%</span>
          <div class="zoom-in" :class="nowVal == 300 && 'disabled'" @click="zoomSize(2)"></div>
        </div>
        <div class="design-scale" :style="`transform: scale(${ nowVal / 100});`">
          <nodeWrap :detail="detail" v-model:nodeConfig="nodeConfig" v-model:flowPermission="flowPermission" />
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
    <template v-if="!detail">
      <errorDialog v-model:visible="tipVisible" :list="tipList" />
      <promoterDrawer />
      <approverDrawer :directorMaxLevel="directorMaxLevel" />
      <copyerDrawer />
      <conditionDrawer />
    </template>
  </div>
</template>

<script setup>
import errorDialog from "@/components/Workflow/dialog/errorDialog.vue";
import promoterDrawer from "@/components/Workflow/drawer/promoterDrawer.vue";
import approverDrawer from "@/components/Workflow/drawer/approverDrawer.vue";
import copyerDrawer from "@/components/Workflow/drawer/copyerDrawer.vue";
import conditionDrawer from "@/components/Workflow/drawer/conditionDrawer.vue";
// import { getWorkFlowData, setWorkFlowData } from "@/components/Workflow/plugins/api.js";

import { TreeMenu, MenuTabs } from "#/system/config"
import { BaseWorkFlowData } from "#/workflow"

import useworkflowStore from "@/store/modules/workflow"
import { reactive, watch } from "@vue/runtime-core";
const workflowStore = useworkflowStore();
let { setTableId, setIsTried } = workflowStore

const props = defineProps({
  // 审批流数据
  data: Object,
  // 详情
  detail: Boolean,
  // 关联菜单方式
  bindMenu: {
    type: String,
    default: "MENU"
  }
})


let tipList = ref([]);
let tipVisible = ref(false);
let nowVal = ref(100);
let processConfig = ref({});
let nodeConfig = ref({});
let workFlowDef = ref({});
let flowPermission = ref([]);
let directorMaxLevel = ref(0);

const ruleFormRef = ref(null);
const rules = reactive({
  menuId: [{ required: true, message: '请选择关联菜单', trigger: 'blur' },],
  pageId: [{ required: true, message: '请选择关联页面', trigger: 'blur' },],
  VCODE: [{ required: true, message: '请输入编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入审批流名称', trigger: 'blur' },]
})

const InitData = (row) => {
  let data = JSON.parse(JSON.stringify(BaseWorkFlowData))
  if (row && Object.keys(row).length > 0) data = row;
  processConfig.value = data;
  let { nodeConfig: nodes, flowPermission: flows, directorMaxLevel: directors, workFlowDef: works, tableId } = data;
  nodeConfig.value = nodes;
  flowPermission.value = flows;
  directorMaxLevel.value = 1;
  workFlowDef.value = works;
  setTableId(tableId);
  if (props.bindMenu == 'MENU') {
    getMenuData()
    if (workFlowDef.value.menuId != '') getPageData(workFlowDef.value.menuId)
  }
}

const menuData = ref([])
const pageData = ref([])
const getMenuData = (keyword = '') => {
  TreeMenu({
    KEYWORD: keyword
  }).then(res => {
    menuData.value = res.RESULT
  })
}
const getPageData = (id = '') => {
  if (id == '') return
  MenuTabs(id).then(res => {
    pageData.value = res.RESULT
  })
}
const setMenuName = val => {
  workFlowDef.value.pageId = ''
  pageData.value = []
  workFlowDef.value.menuName = treeFind(menuData.value, el => el.VALUE == val).LABEL
  getPageData(val)
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

const reErr = value => {
  let { childNode } = value
  let strNode = JSON.stringify(childNode)
  if (value.type == '0' && strNode == "{}") {
    tipList.value.push({
      name: "节点不可为空",
      type: "流程"
    });
  }
  if (childNode) {
    let { type, error, nodeName, conditionNodes } = childNode;
    if (type == 1 || type == 2) {
      if (error) {
        tipList.value.push({
          name: nodeName,
          type: ["", "审核人", "抄送人"][type],
        });
      }
      reErr(childNode);
    } else if (type == 3) {
      reErr(childNode);
    } else if (type == 4) {
      reErr(childNode);
      for (var i = 0; i < conditionNodes.length; i++) {
        if (conditionNodes[i].error) {
          tipList.value.push({ name: conditionNodes[i].nodeName, type: "条件" });
        }
        reErr(conditionNodes[i]);
      }
    }
  } else {
    childNode = null;
    tipList.value.push({
      name: nodeName,
      type: ["", "审核人", "抄送人"][type],
    });
  }
};
const submit = async () => {
  return new Promise((resolve, reject) => {
    ruleFormRef.value.validate(valid => {
      if (!valid) return false
      setIsTried(true);
      tipList.value = [];
      reErr(nodeConfig.value);
      if (tipList.value.length != 0) {
        tipVisible.value = true;
        reject("请完善流程设计")
      } else {
        processConfig.value.flowPermission = flowPermission.value;
        // processConfig.value.flowPermission = flowPermission.value;
        resolve(processConfig)
      }
    })
  })
};
const zoomSize = (type) => {
  if (type == 1) {
    if (nowVal.value == 50) return;
    nowVal.value -= 10;
  } else {
    if (nowVal.value == 300) return;
    nowVal.value += 10;
  }
};

InitData()

watch(() => props.data, val => {
  if (Object.keys(val).length > 0) InitData(val)
}, {
  immediate: true,
})

// 主动暴露方法
defineExpose({ type: "workflow", submit });
</script>

<style lang="scss">
@import "./css/override-element-ui.scss";
@import "./css/workflow.scss";
.error-modal-list {
  width: 500px;
}
</style>