<!-- 系统设置 -->
<template>
  <div class="global-app">
    <el-row>
      <el-col :span="3">
        <el-menu class="el-menu-vertical-demo" @select="menuSelect" :default-active="menuList[0].PK_CLASS"
          text-color="#041122" active-color="#1964F8">
          <template v-for="(item, index) in menuList" :key="index">
            <el-sub-menu :index="item.PK_CLASS" v-if="item.children">
              <template #title>
                <span>{{ item.label }}</span>
              </template>
              <el-menu-item-group v-for="childItem in item.children">
                <el-menu-item :index="childItem.PK_CLASS">{{ childItem.label }}</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-menu-item :index="item.PK_CLASS" v-else>
              <span>{{ item.label }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
      <el-col :span="21">
        <div class="systemContent">
          <div class="systemContent-btn">
            <el-button @click="restoreDefault" size="default">恢复默认配置</el-button>
            <el-button type="primary" @click="saveData" size="default">保存</el-button>
          </div>
          <div v-for="(item, index) in contentList" :key="index" class="systemContent-alone">
            <div class="systemContent-title">
              <img src="@/assets/images/order.png" alt="" class="systemContent-title-img">
              {{ item.title }}
            </div>
            <el-row align="middle">
              <template v-for="(childItem, childIndex) in item.children" :key="childIndex">

                <!-- <el-col :span="childItem.col || 8" v-for="childItem in item.children"> -->
                <el-col :span="childItem.col || 8" v-if="!childItem.isShow || submitData[childItem.isShow] == 1">
                  <div class="disflex systemContent-rowLine">
                    <div class="systemContent-leftLabel">{{ childItem.leftLabel }}</div>
                    <div>
                      <template v-if="childItem.type == 'radio'">
                        <el-radio-group v-model="submitData[childItem.id]" class="ml-4">
                          <el-radio :label="radioItem.value" size="large"
                            v-for="(radioItem, radioIndex) in childItem.radioList">{{ radioItem.label }}</el-radio>
                        </el-radio-group>
                      </template>
                      <template v-else-if="childItem.type == 'checkbox'">
                        <el-checkbox v-model="submitData[childItem.id]" true-label="1" false-label="0" size="large"
                          @change="changeBox"></el-checkbox>
                      </template>
                      <template v-else-if="childItem.type == 'empty'">
                        <!-- {{ childItem.leftLabel }} -->
                      </template>
                      <template v-else-if="childItem.type == 'imgToStr'">
                        <!-- <ImagePreview v-if="submitData[childItem.id]" :src="submitData[childItem.id]" /> -->
                        <ImageUpload  v-model="submitData[childItem.id]" :limit="1" style="width: 100%" />
                      </template>
                      <template v-else>
                        <el-input v-model="submitData[childItem.id]" :style="{ width: childItem.controlWidth }">
                        </el-input>
                      </template>
                    </div>
                    <div v-if="childItem.rightLabel" class="systemContent-rightLabel">{{ childItem.rightLabel }}</div>
                  </div>
                </el-col>
              </template>
            </el-row>

          </div>


        </div>
      </el-col>
    </el-row>



    <!-- <el-row class="tac" :gutter="0">
      <el-col :span="2" :xs="24">
        <el-tree-v2
          :data="data"
          class="global-left"
          node-key="id"
          :props="defaultProps"
          :default-checked-keys="['4']"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="22">
        <div v-if="isSystem">
          <system />
        </div>
        <div v-if="ishost" style="height: 84.8vh">
          <hardware />
        </div>
        <div v-if="isglobal" class="global-tabs">
          <global />
        </div>
        <div v-if="isInterface" style="height: 84.8vh">
          <interfacePage />
        </div>
        <div v-if="isProcurement" class="global-tabs">
          <procurement />
        </div>
        <div v-if="issales" class="global-tabs">
          <sales />
        </div>
        <div v-if="istransfer" class="global-tabs">
          <transfer />
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
// import { getPageConfig } from "@/api/system/page";
// import system from "./system";
// import hardware from "./hardware";
// import global from "./global";
// import interfacePage from "./interface";
// import procurement from "./procurement";
// import sales from "./sales";
// import transfer from "./transfer";

import { getConfigList, systemSettings, saveConfigListData, replyDefaultValue } from "@/api/system/global";
import { onMounted, onUnmounted, ref } from "vue";



const { proxy } = getCurrentInstance();
// const { systemConfig } = proxy.useDict("systemConfig");
// const router = useRouter();
const treeValue = ref("1");
// const formConfig = reactive({
//   formBase: {}, // 表单源数据
//   formValue: {}, // form数据
//   formColumns: [], // form配置(已过滤显示)
//   formRules: {}, // form验证
//   buttonList: [], // 表单中的按钮
// });
// const isSystem = ref(false);
// const ishost = ref(false);
// const isglobal = ref(false);
// const isInterface = ref(false);
// const isProcurement = ref(false);
// const issales = ref(false);
// const istransfer = ref(true);

// const handleNodeClick = (node) => {
//   treeValue.value = node.VALUE;
//   if (node.id == "1") {
//     isSystem.value = true;
//     ishost.value = false;
//     isglobal.value = false;
//     isInterface.value = false;
//   } else if (node.id == "2") {
//     isSystem.value = false;
//     isglobal.value = false;
//     ishost.value = true;
//     isInterface.value = false;
//   } else if (node.id == "3") {
//     isSystem.value = false;
//     ishost.value = false;
//     isglobal.value = true;
//     isInterface.value = false;
//   } else if (node.id == "4") {
//     isSystem.value = false;
//     ishost.value = false;
//     isglobal.value = false;
//     isInterface.value = true;
//   } else if (node.id == "5-1") {
//     isSystem.value = false;
//     ishost.value = false;
//     isglobal.value = false;
//     isInterface.value = false;
//     isProcurement.value = true;
//   } else if (node.id == "5-2") {
//     isSystem.value = false;
//     ishost.value = false;
//     isglobal.value = false;
//     isInterface.value = false;
//     isProcurement.value = false;
//     issales.value = true;
//   } else if (node.id == "5-3") {
//     isSystem.value = false;
//     ishost.value = false;
//     isglobal.value = false;
//     isInterface.value = false;
//     isProcurement.value = false;
//     issales.value = false;
//     istransfer.value = true;
//   }
// };
// const formSelect = (res) => {
//   // console.log("表单选择事件", res);
// };
const currPK_CLASS = ref('')
onMounted(() => {
  // contentList.value = systemSettings
  contentList.value = systemSettings.filter(ele => ele.PK_CLASS == menuList[0].PK_CLASS)
  GetConfigList(menuList[0].PK_CLASS)
  currPK_CLASS.value = menuList[0].PK_CLASS

});

const menuList = reactive([
  {
    label: '系统设置',
    PK_CLASS: 'SYSCONFIG'
  },
  {
    label: '全局设置',
    PK_CLASS: 'SYSPARAM'
  },
  {
    label: '业务规则',
    children: [
      {
        label: '采购',
        PK_CLASS: 'BUY'
      },
      {
        label: '销售',
        PK_CLASS: 'SALE'
      },
      {
        label: '其它',
        PK_CLASS: 'OTHER'
      },
      {
        label: '资质',
        PK_CLASS: 'QUALIFICATION'
      },
    ]
  },
])

const submitData = ref({

})


// const data = [
//   {
//     id: "1",
//     label: "系统设置",
//   },
//   {
//     id: "2",
//     label: "硬件设置",
//     // children: [
//     //   {
//     //     id: "2-1",
//     //     label: "主机设置",
//     //   },
//     // ],
//   },
//   {
//     id: "3",
//     label: "全局设置",
//   },
//   {
//     id: "4",
//     label: "接口设置",
//   },
//   {
//     id: "5",
//     label: "业务规则",
//     children: [
//       {
//         id: "5-1",
//         label: "采购",
//       },
//       {
//         id: "5-2",
//         label: "销售",
//       },
//       {
//         id: "5-3",
//         label: "调拨",
//       },
//       {
//         id: "5-4",
//         label: "其他",
//       },
//       {
//         id: "5-5",
//         label: "资质",
//       },
//     ],
//   },
// ];
// const defaultProps = {
//   children: "children",
//   label: "label",
//   value: "id",
// };
// function getTree() {
//   let data = {};
//   getTreeData(data).then((res) => {
//   });
// }
const changeBox = (e) => {
  console.log("🚀 ~ file: index.vue:303 ~ changeBox ~ e:", e)
}
const menuSelect = (index, indexPath, item, routeResult) => {

  // contentList.value = systemSettings.value
  contentList.value = systemSettings.filter(ele => ele.PK_CLASS == index)
  GetConfigList(index)
  currPK_CLASS.value = index
}
const contentList = ref([])
const GetConfigList = (PK_CLASS) => {
  let portData = {
    PK_CLASS: PK_CLASS,
    MODULEID: '333',
  }
  getConfigList(portData).then((res) => {
    submitData.value = res.RESULT
  });
}
const restoreDefault = () => {

  replyDefaultValue({
    PK_CLASS: currPK_CLASS.value
  }).then((res) => {
    ElMessage({
      message: "恢复默认成功",
      type: "success",
    });
    GetConfigList(currPK_CLASS.value)
  });
}
const saveData = () => {
  saveConfigListData(submitData.value).then((res) => {
    ElMessage({
      message: "保存成功",
      type: "success",
    });
    GetConfigList(currPK_CLASS.value)

  });
}

</script>

<style lang="scss" scoped>
// .disflex{
//   display: flex;
//   align-items: center;
// }
.global-app {
  padding-top: 5px;

  .systemContent {
    background-color: #fff;
    padding: 10px;
    margin-left: 6px;

    height: calc(100vh - 120px);
    overflow-y: auto;
    // font-size: 15px;
    // font-weight: bold;
    // color: rgba(51, 51, 51, 0.9);

    
    color: #666;
      font-size: 14px;

    &-btn {
      text-align: right;
    }

    &-alone {
      margin-bottom: 20px;
    }

    &-title {
      display: flex;
      align-items: center;
      // font-size: 18px;
      // font-weight: 500;
      // color: rgba(42, 43, 45, 0.82);
      padding: 6px;
      border-bottom: 1px solid rgba(209, 209, 209, 0.53);


      color: #000;
      font-size: 16px;

      &-img {
        width: 15px;
        margin-right: 10px;
      }
    }

    &-rowLine {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }

    &-leftLabel {
      margin-right: 10px;
    }

    &-rightLabel {
      margin-left: 10px;

    }
  }

  .el-menu {
    height: 100%;
  }

  .el-menu-item {
    font-size: 16px;
    font-weight: 400;
    color: #041122;
    height: 34px;
  }

  :deep(.el-sub-menu__title) {

    font-size: 16px;
    font-weight: 400;
    color: #041122;
    height: 34px !important;

  }

  .el-menu-item-group {

    :deep(.el-menu-item) {

      font-size: 14px;
      font-weight: 400;
      color: #292929;
      opacity: 0.8;
    }
  }

  .el-menu-item.is-active {

    font-size: 16px;
    font-weight: 400;
    color: #1964F8;
    background: #ECF1FF;
    border-radius: 3px;
  }


}
</style>
<!-- 
<style lang="scss">
.global-app {
  // padding-top: 12px;
  padding-top: 5px;

  .tac {
    background: #fff;
    height: 86.5vh;

    .global-left {
      height: 83vh;
      position: relative;
      top: 25px;
      border-right: 1px solid #ddd;
      // box-sizing: border-box;
    }

    .global-right {
      position: relative;
      top: 10px;
      height: 86.5vh;
      overflow: hidden;
      border-right: 1px solid #ddd;
      overflow: scroll;

      div {
        height: 100%;
      }
    }

    .form-Page {
      padding: 10px;
    }

    .global-tabs {
      height: 83vh;
      overflow-y: scroll;
      margin-left: 1%;

      .el-select .el-input__inner:focus {
        box-shadow: none !important;
      }

      .minInput {
        width: 70px !important;
        border: none !important;
        border-bottom: 1px solid #ddd !important;
      }
    }

    .demo-form-host {
      margin-left: 6%;
      margin-top: 10px;

      .el-input__inner:hover {
        box-shadow: none;
      }

      .el-input__inner {
        box-shadow: none;
      }
    }

    .demo-form-inline {
      width: 100%;
      margin: 0 0px 0px 10px;

      // margin: 0 auto;
      .el-form-item {
        width: 465px;
      }

      .el-input__inner:hover {
        box-shadow: none;
      }

      .el-input__inner {
        box-shadow: none;
      }

      .bottomSelect {
        margin-left: 0px;

        .el-form-item {
          width: 255px;
        }

        .m-2 {
          margin-left: 20px;
        }
      }
    }

    .bg-blue {
      background-color: #f2f5fc;
    }
  }
}

.global-app .tac .global-tabs .minInput {
  border-bottom: none !important;
}

::-webkit-scrollbar {
  width: 8px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #eff1f4;
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}

::-webkit-scrollbar-thumb:window-inactive {
  background: #eff1f4;
}</style>
<style scoped>:v-deep(.el-input) {
  border: none;
  border-bottom: 0px solid #ddd !important;
}

:v-deep(.el-vl__wrapper) {
  height: 100% !important;
}</style> -->
