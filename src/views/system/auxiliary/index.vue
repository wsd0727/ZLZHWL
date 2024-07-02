<template>
  <div class="app-container">
    <el-row :gutter="6">
      <!--部门数据-->
      <!-- <el-col :span="4" :xs="24">
        <div class="group">
          <div class="head-container">
            <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 8px"
            />
          </div>
          <div class="head-container">
            <el-scrollbar height="78.7vh" class="tree-border">
              <el-tree
                :data="menuOptions"
                :props="{ label: 'LABEL', children: 'CHILDREN' }"
                node-key="VALUE"
                :filter-node-method="filterNode"
                ref="deptTreeRef"
                highlight-current
                :expand-on-click-node="false"
                default-expand-all
                @node-click="handleNodeClick"
              />
            </el-scrollbar>
          </div>
        </div>
      </el-col> -->
      <!--用户数据-->
      <el-col :span="12" :xs="24">
        <el-row class="group mb6" justify="space-between">
          <el-col :span="12">
            <el-form ref="queryRef" :inline="true" :model="queryParams" class="query-form" label-width="0">
              <el-form-item prop="VNAME" style="width: 150px">
                <el-input v-model.trim="queryParams.VNAME" placeholder="姓名" clearable />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" class="flex-row-end">
            <el-row :gutter="2">
              <el-col :span="1.5">
                <el-tooltip content="搜索" placement="top" effect="customized">
                  <el-button type="primary" @click="handleSearch">查询</el-button>
                </el-tooltip>
              </el-col>
              <el-col :span="2">
                <el-tooltip content="重置" placement="top" effect="customized">
                  <el-button @click="resetSearch">重置</el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div class="group">
          <el-row :gutter="8" class="mb6" justify="space-between">
            <el-col :span="24">
              <el-button plain @click.stop="handleAdd">新增</el-button>
            </el-col>
          </el-row>
          <Vtable ref="tableRef" :tableCFG="tableConfig" :tableData="dataList" @dbClick="handleDetail" @click.self="getCenterClickData" actionBar :actionBarWidth="130">
            <template #actionBar="{ row }">
              <el-row :gutter="5">
                <el-col :span="2.5">
                  <el-link :underline="false" @click.stop="handleEdit(row)">编辑</el-link>
                </el-col>
                <el-col :span="2.5">
                  <el-link :underline="false" @click.stop="handleDelete(row)">删除</el-link>
                </el-col>
              </el-row>
            </template>
          </Vtable>
          <vxe-pager size="mini" :page-size="queryParams.PAGESIZE" :page-sizes="[10, 20, 30, 50, 100, 1000, 2000]" :current-page="queryParams.PAGENUM" :total="total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange">
          </vxe-pager>
        </div>
      </el-col>
      <el-col :span="12" :xs="14">
        <el-row class="group mb6" justify="space-between">
          <el-col :span="12">
            <el-form ref="rightqueryRef" :inline="true" :model="rightqueryParams" class="query-form" label-width="0">
              <el-form-item prop="VNAME" style="width: 150px">
                <el-input v-model.trim="rightqueryParams.VNAME" placeholder="名称" clearable />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" class="flex-row-end">
            <el-row :gutter="2">
              <el-col :span="1.5">
                <el-tooltip content="搜索" placement="top" effect="customized">
                  <el-button type="primary" @click="rightGetList">查询</el-button>
                </el-tooltip>
              </el-col>
              <el-col :span="2">
                <el-tooltip content="重置" placement="top" effect="customized">
                  <el-button @click="rightresetSearch">重置</el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div class="group">
          <el-row :gutter="5" class="mb6" justify="space-between">
            <el-col :span="24">
              <el-button plain @click="RightHandleAdd" :disabled="rightqueryParams.PK_BILLNO!=''?false:true">新增</el-button>
            </el-col>
          </el-row>
          <Vtable ref="tableRef" :tableCFG="rightConfig" :tableData="rightDataList" @dbClick="handleDetail2" actionBar :actionBarWidth="130">
            <template #actionBar="{ row }">
              <el-row :gutter="5">
                <el-col :span="2.5">
                  <el-link :underline="false" @click.stop="handlRighteEdit(row)">编辑</el-link>
                </el-col>
                <el-col :span="2.5">
                  <el-link :underline="false" @click.stop="handleRightDelete(row)">删除</el-link>
                </el-col>
              </el-row>
            </template>
          </Vtable>
          <vxe-pager size="mini" :page-size="queryParams.PAGESIZE" :page-sizes="[10, 20, 30, 50, 100, 1000, 2000]" :current-page="queryParams.PAGENUM" :total="rightTotal" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange">
          </vxe-pager>
        </div>
      </el-col>
    </el-row>

    <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> {{ pageConfig.modelTitle }} </span>
      </template>
      <template #default>
        <el-row :gutter="10">
          <Form ref="formRef" v-model:formData="form" :formConfig="formConfig" :rules="rules" :detail="formType == 'detail'">
            <template #MENULIST>
              <div class="menuSelect">
                <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
                <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
                <el-checkbox v-model="menuFandZ">父子联动</el-checkbox>
                <el-tree class="tree-border" :data="AllMenuTree" show-checkbox ref="menuRef" node-key="VALUE" :check-strictly="!menuFandZ" empty-text="暂无数据" :props="TreeProps"></el-tree>
              </div>
            </template>
          </Form>
        </el-row>
      </template>
      <template #footer>
        <el-button v-if="formType != 'detail'" type="primary" size="default" @click="formSubmit">保存</el-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script setup name="User">
import Form from "@/components/Form";
import Vtable from "@/components/Tables";
import { getMENUBENTree, RoleDetail } from "#/system/role";
import {
  mateList,
  rightList,
  mateDetail,
  mateRightDetail,
  addauxli,
  addRightauxli,
  editauxli,
  editrightauxli,
  delauxli,
  delRightauxli,
  statusUser,
  getAuthRole,
  updateAuthRole,
  deptTreeSelect,
  updateUserPwd,
  FormConfig,
  RighrFormConfig,
  PWDConfig,
  TableConfig,
  rightTableConfig,
} from "#/system/auxiliary";
import { getFormValue, getFormRule } from "@/utils";
import { Search, Delete, Edit, Refresh } from "@element-plus/icons-vue";
import { nextTick, reactive } from "@vue/runtime-core";
const router = useRouter();
const routerParams = router.currentRoute.value.meta;
const { proxy } = getCurrentInstance();
const route = useRoute();
const deptTreeRef = ref();
const queryRef = ref();
const rightqueryRef = ref();

const tableRef = ref();
const formRef = ref();
const formType = ref();
const data = reactive({
  baseForm: {},
  form: {},
  formConfig: [],
  AllMenuTree: [],
  queryParams: {
    PAGENUM: 1,
    PAGESIZE: 10,
    VNAME: "",
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
    PK_ORG: undefined,
    MATCLASS: undefined,
  },
  rightqueryParams: {
    PAGENUM: 1,
    VNAME: "",
    PAGESIZE: 10,
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
    PK_BILLNO: '',
  },
  BILLSTATUS: [
    { LABEL: "正常", VALUE: "1", COLOR: "primary" },
    { LABEL: "锁定", VALUE: "2", COLOR: "danger" },
    { LABEL: "黑名单", VALUE: "3", COLOR: "danger" },
  ],
  rules: {},
  TreeProps: {
    label: "LABEL",
    children: "CHILDREN",
    disabled: (data) => {
      let { VALUE } = data;
      return roleData.value.indexOf(VALUE) != -1;
    },
  },
});
const {
  queryParams,
  rightqueryParams,
  baseForm,
  form,
  formConfig,
  BILLSTATUS,
  AllMenuTree,
  rules,
  TreeProps,
} = toRefs(data);
const total = ref(0);
const rightTotal = ref(0);
const dataList = ref([]);
const rightDataList = ref([]);
// tree
const deptName = ref();
watch(deptName, (val) => {
  deptTreeRef.value.filter(val);
});
const menuOptions = ref([]);
const getDeptTree = () => {
  deptTreeSelect().then((res) => {
    menuOptions.value = res;
  });
};
const filterNode = (value, data) => {
  if (!value) return true;
  return data.LABEL.indexOf(value) !== -1;
};
const handleNodeClick = (val) => {
  let { VALUE, TYPE } = val;

  queryParams.value.PK_ORG = "";
  queryParams.value.MATCLASS = VALUE;
  handleSearch();
};

const tableConfig = reactive({
  tableColumns: TableConfig,
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  height: window.innerHeight - 227,
});
const rightConfig = reactive({
  tableColumns: rightTableConfig,
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  height: window.innerHeight - 227,
});
// 弹窗
const pageConfig = reactive({
  modalVisible: false,
  modalW: "40%",
  modalH: "50%",
  modelTitle: "",
});
// 初始化用户表单
const initForm = () => {
  formConfig.value = FormConfig;
  let formData = getFormValue(FormConfig);
  baseForm.value = formData;
  form.value = formData;
  rules.value = getFormRule(FormConfig);
  pageConfig.modalW = "40%";
  pageConfig.modalH = "50%";
};
// 初始化右侧 表单
const RighrConfig = () => {
  formConfig.value = RighrFormConfig;
  let formData = getFormValue(RighrFormConfig);
  baseForm.value = formData;
  form.value = formData;
  rules.value = getFormRule(RighrFormConfig);
  pageConfig.modalW = "60%";
  pageConfig.modalH = "60%";
};
// 初始化 用户授权 表单
const initPERMISSForm = () => {
  let config = [
    {
      FIELD: "MENULIST",
      LABEL: "菜单权限",
      COL: 24,
      CONTROLS: "slot",
      ISSHOW: 1,
    },
  ];
  formConfig.value = config;
  let formData = getFormValue(config);
  baseForm.value = formData;
  form.value = formData;
  rules.value = getFormRule(config);
  pageConfig.modalW = "600px";
  pageConfig.modalH = "70%";
};

const getList = () => {
  tableConfig.loading = true;
  mateList(queryParams.value)
    .then((res) => {
      dataList.value = res.RESULT.RECORDS;
      total.value = res.TOTAL;
    })
    .finally(() => {
      tableConfig.loading = false;
    });
};
const rightGetList = () => {
  rightConfig.loading = true;
  rightList(rightqueryParams.value)
    .then((res) => {
      rightDataList.value = res.RESULT.RECORDS;
      rightTotal.value = res.TOTAL;
    })
    .finally(() => {
      rightConfig.loading = false;
    });
};

const handleSearch = () => {
  queryParams.value.PAGENUM = 1;
  getList();
};
const resetSearch = () => {
  if (!queryRef) return;
  queryParams.value.VNAME = undefined;
  // queryParams.value.MATCLASS = undefined;
  deptTreeRef.value.setCheckedKeys([]);
  queryRef.value.resetFields();
  handleSearch();
};
const rightresetSearch = () => {
  if (!rightqueryRef) return;
  rightqueryParams.value.VNAME = undefined;
  // rightqueryParams.value.MATCLASS = undefined;
  // deptTreeRef.value.setCheckedKeys([]);
  // queryRef.value.resetFields();
  rightGetList();
};

// 菜单权限相关
const menuRef = ref();
const menuExpand = ref(false);
const menuNodeAll = ref(false);
const menuFandZ = ref(true);
/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value) {
  let treeList = AllMenuTree.value;
  for (let i = 0; i < treeList.length; i++) {
    menuRef.value.store.nodesMap[treeList[i].VALUE].expanded = value;
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value) {
  menuRef.value.setCheckedNodes(value ? AllMenuTree.value : []);
}
/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}

const roleData = ref([]);
const handlePermiss = (row) => {
  formType.value = "permiss";
  let { BILLNO, PK_ROLE } = row;
  getMENUBENTree({
    BILLFROM: 0,
  }).then((res) => {
    AllMenuTree.value = res;
    initPERMISSForm();
    form.value = row;
    RoleDetail({
      BILLNO: PK_ROLE,
    }).then((res) => {
      roleData.value = [...res.RESULT.MENU, ...res.RESULT.BTN];
      getAuthRole({ BILLNO }).then((res) => {
        pageConfig.modelTitle = "用户授权";
        let selectMenu = [...roleData.value, ...res.RESULT.MENU, ...res.RESULT.BTN];
        pageConfig.modalVisible = true;
        nextTick(() => {
          menuExpand.value = true;
          handleCheckedTreeExpand(true);
          // menuFandZ.value = false
          selectMenu.forEach((v) => {
            nextTick(() => {
              menuRef.value.setChecked(v, true, false);
            });
          });
        });
      });
    });
  });
};

const handleAdd = () => {
  initForm();
  form.value = baseForm.value;
  formType.value = "add";
  if (formRef.value) formRef.value.resetForm();
  pageConfig.modelTitle = "新增物料";
  nextTick(() => {
    formConfig.value = Object.assign(formConfig.value, data);
    pageConfig.modalVisible = true;
  });
};
const RightHandleAdd = () => {
  RighrConfig();
  form.value = baseForm.value;
  formType.value = "rightadd";
  if (formRef.value) formRef.value.resetForm();
  pageConfig.modelTitle = "新增右侧物料";
  nextTick(() => {
    formConfig.value = Object.assign(formConfig.value, data);
    pageConfig.modalVisible = true;
  });
};

const handleDetail = (row) => {
  initForm();
  let { BILLNO } = row;
  let data = {
    BILLNO: BILLNO,
    MODULEID: routerParams.BILLNO,
  }
  mateDetail(data).then((res) => {
    formType.value = "detail";
    if (formRef.value) formRef.value.resetForm();
    form.value = { ...baseForm.value, ...res.RESULT };
    pageConfig.modelTitle = "辅助详情";
    nextTick(() => {
      formConfig.value = Object.assign(formConfig.value, data);
      pageConfig.modalVisible = true;
    });
  });
};
const handleDetail2 = (row) => {
  RighrConfig();
  let { BILLNO } = row;
  let data = {
    BILLNO: BILLNO,
    MODULEID: routerParams.BILLNO,
  }
  mateRightDetail(data).then((res) => {
    formType.value = "detail";
    if (formRef.value) formRef.value.resetForm();
    form.value = { ...baseForm.value, ...res.RESULT };
    pageConfig.modelTitle = "用户详情";
    nextTick(() => {
      formConfig.value = Object.assign(formConfig.value, data);
      pageConfig.modalVisible = true;
    });
  });
};

//中间表格行点击事件
const getCenterClickData = (res) => {
  let { BILLNO } = res;
  rightqueryParams.value.PK_BILLNO = BILLNO;
  rightqueryParams.value.PAGENUM = 1;
  rightGetList();
};
const handleEdit = (row) => {
  initForm();
  let { BILLNO } = row;
  let data = {
    ...queryParams.value,
    BILLNO,
  };
  mateDetail(data).then((res) => {
    formType.value = "edit";
    if (formRef.value) formRef.value.resetForm();
    form.value = { ...baseForm.value, ...res.RESULT };
    pageConfig.modelTitle = "编辑物料";
    // nextTick(() => {
    //   let data = (formConfig.value.find(
    //     (el) => el.FIELD == "PASSWORD"
    //   ).ISSHOW = 0);
    // });
    formConfig.value = Object.assign(formConfig.value, data);
    pageConfig.modalVisible = true;
  });
};
const handlRighteEdit = (row) => {
  RighrConfig();
  let { BILLNO } = row;
  let data = {
    ...rightqueryParams.value,
    BILLNO,
  };
  mateRightDetail(data).then((res) => {
    formType.value = "rightedit";
    if (formRef.value) formRef.value.resetForm();
    form.value = { ...baseForm.value, ...res.RESULT };
    pageConfig.modelTitle = "编辑右侧物料";
    formConfig.value = Object.assign(formConfig.value, data);
    pageConfig.modalVisible = true;
  });
};

const handleDelete = (row) => {
  let { VNAME, BILLNO } = row;
  proxy.$modal.confirm(`是否删除${VNAME} ？`).then((res) => {
    delauxli({
      BILLNO: BILLNO,
    }).then((res) => {
      handleSearch();
    });
  });
};
const handleRightDelete = (row) => {
  let { VNAME, BILLNO } = row;
  proxy.$modal.confirm(`是否删除${VNAME} ？`).then((res) => {
    delRightauxli({
      BILLNO: BILLNO,
    }).then((res) => {
      rightGetList();
      // handleSearch();
    });
  });
};

const handleBlack = (row, type) => {
  let { VNAME, BILLNO } = row;
  let str = type == "1" ? "拉黑" : "恢复";
  proxy.$modal.confirm(`是否${str}用户 ${VNAME} ？`).then((res) => {
    statusUser({
      BILLNO: BILLNO,
      BILLSTATUS: type == "1" ? "105" : "106",
    }).then((res) => {
      handleSearch();
    });
  });
};

const handleReset = (row) => {
  let { BILLNO, USERNAME } = row;
  initPWDForm();
  formType.value = "resetPWD";
  if (formRef.value) formRef.value.resetForm();
  form.value.BILLNO = BILLNO;
  form.value.USERNAME = USERNAME;
  pageConfig.modelTitle = "重置密码";
  pageConfig.modalVisible = true;
};

const formSubmit = () => {
  formRef.value.submitForm().then((valid) => {
    if (!valid) return;
    if (formType.value == "add") {
      form.value.DR = "0";
      let data = {
        ...queryParams.value,
        ...form.value,
      };
      addauxli(data).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        pageConfig.modalVisible = false;
        handleSearch();
      });
    } else if (formType.value == "rightadd") {
      if (rightqueryParams.value.PK_BILLNO) {
        let data = {
          ...rightqueryParams.value,
          ...form.value,
        };
        addRightauxli(data).then((res) => {
          proxy.$modal.msgSuccess("提交成功");
          pageConfig.modalVisible = false;
          rightGetList();
        });
      } else {
        // console.log("请先点击左侧树再新增");
      }
    } else if (formType.value == "rightedit") {
      editrightauxli(form.value).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        pageConfig.modalVisible = false;
        rightGetList();
      });
    } else {
      editauxli(form.value).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        pageConfig.modalVisible = false;
        handleSearch();
      });
    }
  });
};
getDeptTree();
getList();
rightGetList();
</script>
<style lang="scss" scoped>
.app-container {
  padding: 6px 1px !important;
  box-sizing: border-box;
  overflow: hidden;
}
.group {
  padding: 8px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 4px;
}
.mb6 {
  margin-bottom: 6px;
}
</style>
