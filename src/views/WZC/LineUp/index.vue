<template>
  <div class="app-wrap" id="FullScreen">
    <div class="form-page-wrap position-r">
      <div class="form-page-content mt20">
        <!-- 左侧树形结构模板 -->
        <div v-if="pageConfig.hasTree" class="tree-left bg-white position-r">
          <div class="head-container">
            <el-input v-model="treeKeyword" placeholder="请输入关键字" clearable style="margin-bottom: 5px; margin-top: 2px">
            </el-input>
          </div>
          <div class="head-container" v-if="treeOptions.length">
            <el-scrollbar :height="pageConfig.treeHeight" class="tree-border">
              <el-tree :data="treeOptions" :props="{
                    label: 'LABEL',
                    children: 'CHILDREN',
                    disabled: 'disabled',
                  }" node-key="VALUE" :filter-node-method="filterNode" :default-expanded-keys="pageConfig.defaultExpandedKeys" ref="treeRef" highlight-current @node-click="handleNodeClick">
              </el-tree>
            </el-scrollbar>
          </div>
        </div>

        <div class="table-wrap">
          <div class="lineup-top">
            <LineUpCard cardTitle="排队队列" :PK_CLASS="treeNode" :lineType="0" :height="tableHeight" @reloadPage="reloadPage" @fullScreen="fullScreenEvent">
              <template #fullscreen>
                <span @click="fullScreenEvent" title="全屏" class="vxe-icon-fullscreen full-icon" v-if="!isFullscreen"></span>
                <span @click="fullScreenEvent" title="退出全屏" class="vxe-icon-minimize full-icon" v-else></span>
              </template>
            </LineUpCard>
          </div>

          <div class="center">
            <LineUpCard cardTitle="叫号队列" :PK_CLASS="treeNode" :lineType="0" :height="tableHeight" class="lineup lp-left" @reloadPage="reloadPage"></LineUpCard>
            <LineUpCard cardTitle="过号队列" :PK_CLASS="treeNode" :lineType="0" :height="tableHeight" class="lineup lp-right" @reloadPage="reloadPage"></LineUpCard>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup name="formPage">
import LineUpCard from "./card.vue";
import { getTableData } from "@/api/system/page";
import PinyinMatch from "pinyin-match";
import { reactive } from "vue";
import screenfull from "screenfull";

const { proxy } = getCurrentInstance();
const router = useRouter();

const routerParams = router.currentRoute.value.meta;

const pageConfig = reactive({
  hasTree: true, // 是否存在左侧树型结构
  tableData: [],
  totalData: null,
  topButton: [],
  initButton: [],
  queryUrl: null,
  hasSubTable: false,
  activeBtn: {},
  modalVisible: false,
  modalBtn: [],
  modalW: "60%",
  modalH: "40%",
  pageTitle: "",
  treeHeight: window.innerHeight - 180,
  mainTable: [], // 多主表原始配置数据
  mainActive: 0,
  mainTableCFG: [], // 多主表处理后的配置
  buttonList: [],
  defaultExpandedKeys: null,
});

const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
  formType: "", // DTL ADD
  buttonList: [], // 表单中的按钮
  showDetail: false, // 是否显示表单 ， 初始时不显示，详情数据查询后显示
});

pageConfig.pageTitle = routerParams.title;

// 左侧树
const treeOptions = ref([]);
const treeKeyword = ref("");
const treeNode = ref(null);
const tableHeight = ref((window.innerHeight - 300) / 2); // 表格高度


/** 根据名称筛选菜单树 */
watch(treeKeyword, (val) => {
  proxy.$refs["treeRef"]?.filter(val);
});
/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return (
    PinyinMatch.match(data.LABEL, treeKeyword.value) ||
    PinyinMatch.match(data.VALUE, treeKeyword.value) ||
    PinyinMatch.match(data.CODE, treeKeyword.value)
  );
};

const isFullscreen = ref(false);

function fullScreenEvent() {
  const ele = document.getElementById("FullScreen"); //指定全屏区域元素
  screenfull.on("change", () => {
    if (screenfull.isFullscreen) {
      pageConfig.treeHeight = window.screen.height;
      isFullscreen.value = true;
      tableHeight.value = (window.screen.height - 160) / 2; // 表格高度
    } else {
      isFullscreen.value = false;
      tableHeight.value = (window.innerHeight - 300) / 2; // 表格高度
      pageConfig.treeHeight = window.innerHeight - 180;
    }
  });
  if (screenfull.isEnabled) {
    screenfull.toggle(ele);
  }
}

getTreeData();

function getTreeData() {
  let treeQueryUrl = "/base/factory/getOrgFactoryTreeListWithBusi";
  let data = {
    KEYWORD: "",
    PAGENUM: 1,
    TYPE: "1",
    PAGESIZE: 10000,
    SORTNAME: "",
    SORTORDER: "",
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
  };
  getTableData(treeQueryUrl, data).then((res) => {
    treeOptions.value = res.RESULT;
    pageConfig.defaultExpandedKeys = [res.RESULT[0].VALUE];
    treeNode.value = res.RESULT[0].VALUE;
  });
}

//  树节点点击事件
function handleNodeClick(data) {
  if (!data.ISDISABLED) {
    treeNode.value = data.VALUE;
  }
}

function reloadPage() {
  let TNT = treeNode.value;
  treeNode.value = null;
  setTimeout((res) => {
    treeNode.value = TNT;
  }, 100);
}
</script>

<style lang="scss" scoped>
.form-page-wrap {
  width: 100%;
  // height: calc(100vh - 110px);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background: #fff;
  padding: 4px;
  .form-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    position: absolute;
    height: 40px;
    width: 100%;
    top: 0;
    background: #fff;
    z-index: 2;
    border-bottom: 1px solid #ddd;
    &-left {
      cursor: pointer;
      line-height: 36px;
      .text-muted:hover {
        color: var(--el-color-primary);
      }
      .el-icon {
        position: relative;
        top: 7px;
      }
    }
  }
  .el-divider--horizontal {
    margin: 6px 0;
  }

  .form-page-content {
    width: 100%;
    box-sizing: border-box;
    margin-top: 0px;
    display: flex;
  }
}

.tree-left {
  width: 210px;
  padding: 10px;
  border-right: 10px solid #e7e9f1;
}

.full-icon{
  color: var(--el-color-primary);
  font-weight: bold;
  cursor: pointer;
}

.table-wrap {
  width: calc(100% - 210px);
  padding: 10px;
  .center {
    width: 100%;

    .lineup {
      width: 50%;
      display: inline-block;
    }
    .lp-left {
      margin-right: 1%;
    }
    .lp-right {
      width: 49%;
      margin-right: 0 !important;
    }
  }
}
</style>
