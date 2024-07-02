<template>
  <div class="dashboard-wrap">
    <div class="header bg-white pd5">
      <div class="project-title">
        <el-dropdown @command="handleCommand" trigger="click" placement="bottom-start">
          <span class="el-dropdown-link">
            {{ pageConfig.activeDash.PANEL_NAME }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                :command="item.BILLNO"
                v-for="item in dashboardList"
                :key="item.BI"
              >
                <el-icon><Stopwatch /></el-icon>
                {{ item.PANEL_NAME }}
              </el-dropdown-item>
              <el-dropdown-item divided command="add">
                <el-icon><CirclePlus /></el-icon>
                新建仪表盘
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="toobar">
        <div class="add-btn">
          <!-- <div class="btn-custom" @click="addCard">
            <el-icon :size="15" :color="color">
              <Edit />
            </el-icon>
            添加仪表
          </div> -->
        </div>
        <div class="right-btn">
          <div
            class="btn-custom"
            @click="!isConfig ? (isConfig = true) : addCard()"
          >
            <el-icon :size="15" :color="color">
              <Edit />
            </el-icon>
            {{ !isConfig ? "管理卡片" : "添加卡片" }}
          </div>

          <div
            class="btn-custom mr10"
            @click="isConfig = false"
            v-if="isConfig"
          >
            取消
          </div>
          <el-button
            size="default"
            type="primary"
            @click="SubmitEvent"
            v-if="isConfig"
          >
            确定
          </el-button>
          <el-divider direction="vertical" />

          <el-dropdown>
            <div class="more-btn">
              <i class="vxe-icon-menu"></i>
            </div>
            <template #dropdown>
              <el-dropdown-menu style="width: 160px">
                <el-dropdown-item  @click="editDash"
                  >编辑</el-dropdown-item
                >
                <el-dropdown-item  @click="deleteDash"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <el-scrollbar :height="bodyHeight">
      <!-- <div class="layoutJSON">
        显示为
        <code>[x, y, w, h]</code>
        :
        <div class="columns">
          <div v-for="(item, indexVar) in layout" :key="indexVar">
            <b>{{ item.i }}</b>
            : [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
          </div>
        </div>
      </div> -->

      <div class="content">
        <grid-layout
          v-model:layout="layout"
          :col-num="12"
          :row-height="100"
          :is-draggable="isConfig"
          :is-resizable="isConfig"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="[10, 10]"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="item in layout"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
            class="custom-grid"
          >
            <div class="title">
              <span>
                {{ item.VNAME }}
              </span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <div class="more-btn">
                    <el-icon><MoreFilled /></el-icon>
                  </div>
                </span>
                <template #dropdown>
                  <el-dropdown-menu style="width: 160px">
                    <el-dropdown-item
                      @click="setCard(item)"
                      >编辑</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="deletCard(item)"
                      >删除</el-dropdown-item
                    >
                    <el-dropdown-item disabled style="height: 32px"
                      >复制</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <img :src="item.SAMPLE_IMAGE" alt="" srcset="" class="example" />
          </grid-item>
        </grid-layout>
      </div>
    </el-scrollbar>

    <modal-card
      ref="mycard"
      :visible="visibleModal"
      @closeModal="closeModal"
      :treeData="cardLeftTreeData"
      @saveCard="saveCard"
    ></modal-card>

    <vxe-modal
      destroy-on-close
      v-model="pageConfig.modalVisible"
      :width="pageConfig.modalW"
      :height="pageConfig.modalH"
      id="formModal"
      resize
      storage
      transfer
      show-zoom
      show-footer
    >
      <template #title>
        <span> {{ pageConfig.modelTitle }} </span>
      </template>
      <template #default>
        <Form
          ref="formRef"
          v-model:formData="formConfig.formValue"
          :formConfig="formConfig.formColumns"
          :rules="formConfig.formRules"
        >
        </Form>
      </template>
      <template #footer>
        <el-button size="default" type="primary" @click="formSubmit">
          确定
        </el-button>
      </template>
    </vxe-modal>

    <ComModal
      :modalVisible="comVisible"
      :modalConfig="modalConfig"
      @modalSubmit="modalSubmit"
      @closeModal="closeModal"
    />
  </div>
</template>

<script setup name="Dashboard">
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
  MoreFilled,
} from "@element-plus/icons-vue";
import {
  getFormValue,
  deepClone,
  getShowCFG,
  getFormRule,
  getUrlParams,
} from "@/utils/index";
import modalCard from "./modal-card.vue";

import ComModal from "@/components/Modal";

// import { GridLayout, GridItem } from 'vue-grid-layout'


import {
  getCardType,
  getCardList,
  getDashboard,
  cardConfig,
  dashboardConfig,
  addDashboard,
  deleteDashboard,
  saveCard2Dashboard,
  getCard2Dashboard,
  deletCard2Dashboard,
  getCardDetail,
  saveAllCard2Dashboard,
} from "@/api/dashboard/index";

const { proxy } = getCurrentInstance();
const isConfig = ref(false);
const visibleModal = ref(false);
const comVisible = ref(false);
const cardLeftTreeData = ref([]);
const dashboardList = ref([]);
const card2Dashboard = ref([]);

const layout = ref([]);
const bodyHeight = window.innerHeight - 180;
const pageConfig = reactive({
  modalVisible: false,
  modalW: "70%",
  modalH: "60%",
  modelTitle: "卡片配置",
  activeDash: {}, // 当前激活的仪表
});

const modalConfig = reactive({
  modalW: "40%",
  modalH: "50%",
  modelTitle: "新增仪表",
  formValue: {},
  formColumns: {},
  formRules: {},
});

const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
});

const layoutCFG = ref({
  draggable: true,
  resizable: true,
  index: 0,
});

const addCard = () => {
  visibleModal.value = true;
  proxy.$refs.mycard.getCardData(1);
};
const closeModal = () => {
  visibleModal.value = false;
  comVisible.value = false;
};

// 获取左侧树
const getLeftTree = () => {
  getCardType().then((res) => {
    cardLeftTreeData.value = res.RESULT;
  });

  // 获取左侧仪表数据
  let query = {
    PAGENUM: 1,
    PAGESIZE: 2000,
    SORTNAME: "",
    REVERSE: "",
  };
  getDashboard(query).then((res) => {
    dashboardList.value = res.RESULT;
    pageConfig.activeDash = res.RESULT.length ? res.RESULT[0] : {};
    getCardList2Dash();
  });
};

const saveCard = (data) => {
  let oneCard = {};
  if (layout.value.length) {
    let lastCard = layout.value[layout.value.length - 1];
    oneCard = {
      x: lastCard.x + lastCard.w,
      y: lastCard.y,
      w: 3,
      h: 2,
      i: layout.value.length + 1,
      isLocal: true,
      ...data,
    };
    if (lastCard.x + lastCard.w > 9) {
      oneCard.x = 0;
      oneCard.y = lastCard.y + 2;
    }
  } else {
    oneCard = {
      x: 0,
      y: 0,
      w: 3,
      h: 2,
      i: layout.value.length,
      isLocal: true,
      ...data,
    };
  }

  layout.value.push(oneCard);
  visibleModal.value = false;
};

const SubmitEvent = () => {
  let layoutLength = layout.value.length;
  for (var i = 0; i < layoutLength; i++) {
    if (layout.value[i].isLocal) {
      let msg = `第${i + 1}个卡片未配置基础信息，请配置基础信息。`;
      return proxy.$modal.msgError(msg);
    } else {
      let item = layout.value[i],
        tnt = card2Dashboard.value[i];
      if (tnt) {
        tnt.CARD_COORD_X = item.x;
        tnt.CARD_COORD_Y = item.y;
        tnt.CARD_COORD_W = item.w;
        tnt.CARD_COORD_H = item.h;
        tnt.CARD_COORD_I = item.i;
      } else {
        let newCard = {};
        newCard.CARD_COORD_X = item.x;
        newCard.CARD_COORD_Y = item.y;
        newCard.CARD_COORD_W = item.w;
        newCard.CARD_COORD_H = item.h;
        newCard.CARD_COORD_I = item.i;
        newCard.BILLNO = item.BILLNO;
        card2Dashboard.value.push(newCard);
      }
    }
  }

  saveAllCard2Dashboard(card2Dashboard.value).then((res) => {
    proxy.$modal.msgSuccess("保存成功");
    isConfig.value = false;
    getCardList2Dash();
    
  });
};

// 编辑仪表下的卡片
const setCard = (item) => {
  console.log("编辑仪表下的卡片", item.isLocal );

  pageConfig.formValue = {};
  pageConfig.modelTitle =
    pageConfig.activeDash.PANEL_NAME + "/" + item.VNAME + "配置";

  if (!item.isLocal) {
    // 非本地数据
    getCardDetail({ BILLNO: item.BILLNO }).then((res) => {
      formConfig.formValue = res.RESULT;
      pageConfig.modalVisible = true;

  console.log("编辑仪表下的卡片", formConfig.formValue );

    });
  } else {

    formConfig.formValue = {}
    formConfig.formValue.PK_PANEL = pageConfig.activeDash.BILLNO;
    formConfig.formValue.PANEL_NAME = pageConfig.activeDash.PANEL_NAME;
    formConfig.formValue.PK_CARD = item.BILLNO;
    formConfig.formValue.CARD_NAME = item.CARD_NAME;
    formConfig.formValue.VNAME = item.CARD_NAME;
    formConfig.formValue.BILLNO = item.BILLNO;
    formConfig.formValue.IS_HREF = "";
    formConfig.formValue.BILLNO = "";
    formConfig.formValue.CARD_COORD_X = item.x;
    formConfig.formValue.CARD_COORD_Y = item.y;
    formConfig.formValue.CARD_COORD_W = item.w;
    formConfig.formValue.CARD_COORD_H = item.h;
    formConfig.formValue.CARD_COORD_I = item.i;
    pageConfig.modalVisible = true;
  }


};

// 删除卡片
const deletCard = (i) => {
  proxy.$modal.confirm("您确定要删除该卡片？").then((res) => {
    if (i.isLocal) {
      layout.value.splice(i.i, 1);
      proxy.$modal.msgSuccess("删除成功");
    } else {
      let data = [i.BILLNO];
      deletCard2Dashboard(data).then((res) => {
        proxy.$modal.msgSuccess("删除成功");
        getCardList2Dash();
      });
    }
  });
};

function getPageCFG() {
  let COLUMNS = cardConfig;
  formConfig.formColumns = COLUMNS;
  formConfig.formBase = getFormValue(COLUMNS);
  formConfig.formValue = JSON.parse(JSON.stringify(formConfig.formBase));
  formConfig.formRules = getFormRule(COLUMNS);
}

const formRef = ref();
const formSubmit = () => {
  formRef.value.submitForm().then((valid) => {
    if (!valid) return;
    saveCard2Dashboard(formConfig.formValue).then((res) => {
      proxy.$modal.msgSuccess("保存成功");
      let index = layout.value.length - 1 ;
      if(formConfig.formValue.BILLNO && formConfig.formValue.BILLNO.includes('SPC') ){
        index = layout.value.findIndex(i =>{ return i.BILLNO == formConfig.formValue.BILLNO })
      }
      console.log(666, index);
      layout.value[index].BILLNO = res.RESULT;
      layout.value[index].isLocal = false;
      layout.value[index].VNAME = formConfig.formValue.VNAME;
      pageConfig.modalVisible = false;
    });
  });
};

// 公共弹窗模板的保存
const modalSubmit = () => {
  let data = {
    PANEL_NAME: "",
    PANEL_CODE: "",
    PAGE_LAYOUT: "",
    TREE_URL: "",
    DEFAULT_FLAG: "",
    ENABLESTATE: "1",
    VMEMO: "",
  };
  data = Object.assign(data, modalConfig.formValue);
  addDashboard(data).then((res) => {
    proxy.$modal.msgSuccess("保存成功");
    closeModal();
    getLeftTree();
  });
};

const deleteDash = () => {
  deleteDashboard([pageConfig.activeDash.BILLNO]).then((res) => {
    proxy.$modal.msgSuccess("删除成功");
    getLeftTree();
  });
};

const editDash = () => {
  let COLUMNS = dashboardConfig;
  modalConfig.modelTitle = '编辑仪表'
  modalConfig.formColumns = COLUMNS;
  modalConfig.formRules = getFormRule(COLUMNS);
  modalConfig.formValue = JSON.parse(JSON.stringify(pageConfig.activeDash));
  comVisible.value = true;
};

// 仪表 下拉选择事件
const handleCommand = (data) => {
  if (data == "add") {
    // 新增仪表
    let COLUMNS = dashboardConfig;
    modalConfig.formColumns = COLUMNS;
    modalConfig.formBase = getFormValue(COLUMNS);
    modalConfig.formValue = JSON.parse(JSON.stringify(modalConfig.formBase));
    modalConfig.formRules = getFormRule(COLUMNS);
    comVisible.value = true;
    return;
  }
  let a = dashboardList.value.filter((i) => {
    return i.BILLNO == data;
  });
  pageConfig.activeDash = a[0];
  getCardList2Dash();
};
// 获取仪表下的卡片配置
const getCardList2Dash = () => {
  let query = { PK_PANEL: pageConfig.activeDash.BILLNO };
  getCard2Dashboard(query).then((res) => {
    card2Dashboard.value = res.RESULT;
    let newArr = res.RESULT.map((i) => {
      let newItem = {
        x: i.CARD_COORD_X * 1,
        y: i.CARD_COORD_Y * 1,
        w: i.CARD_COORD_W * 1,
        h: i.CARD_COORD_H * 1,
        i: i.CARD_COORD_I * 1,
        BILLNO: i.BILLNO,
        SAMPLE_IMAGE: i.CARD_SAMPLE_IMAGE,
        VNAME: i.VNAME || i.CARD_NAME,
      };
      return newItem;
    });
    layout.value = newArr;
  });
};

getLeftTree();
getPageCFG();
</script>

<style>

.el-dropdown-menu--small .el-dropdown-menu__item{
  line-height:32px!important;
}

</style>

<style scoped lang="scss">

.el-dropdown__popper .el-dropdown-menu{
  width: 200px;
}

.el-dropdown-link{
  cursor: pointer;
}

.dashboard-wrap {
  .header {
    height: 60px;
    padding: 6px 10px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    border-radius: 4px;
    .project-title {
      max-width: 40%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .toobar {
      flex: 3;
      display: flex;
      justify-content: space-between;
      .right-btn {
        display: flex;
        align-items: center;
      }
      .btn-custom {
        font-size: 14px;
        color: #8c95a8;
        margin-left: 15px;
        cursor: pointer;
        .el-icon {
          position: relative;
          top: 3px;
        }
      }
      .btn-custom:hover {
        color: var(--el-color-primary);
      }
    }
  }

  .content {
    width: 100%;
    // background-color: #fff;
    .card-item {
      width: calc(50% - 5px);
      height: 500px;
      margin-right: 5px;
      background-color: #fff;
      margin-bottom: 5px;
    }
  }
}
.vue-grid-item {
  border: 1px solid #eee;
  background-color: #fff;
  border-radius: 4px;
}

.custom-grid {
  // text-align: center;
  // display: flex;
  // justify-content: center;
  // align-items: center;

  position: relative;
  padding: 10px;
  .title {
    text-align: left;
    display: flex;
    justify-content: space-between;
    .more-btn {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 2px;
      &:hover {
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);
      }
    }
    .el-icon {
      transform: rotate(90deg);
      color: #aaa;
    }
  }
  .example {
    width: 90%;
    height: 80%;
  }
}

// .vue-grid-item.vue-grid-placeholder {
//   background: red;
//   opacity: 0.2;
//   transition-duration: 100ms;
//   z-index: 2;
//   -webkit-user-select: none;
//   -moz-user-select: none;
//   -ms-user-select: none;
//   -o-user-select: none;
//   user-select: none;
// }
</style>
