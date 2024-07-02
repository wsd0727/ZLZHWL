<template>
  <div class="app-container">
    <el-row :gutter="20" class="nopnom">
      <!--部门数据-->
      <el-col :span="4" :xs="24" class="group">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable prefix-icon="Search" style="margin-bottom: 8px" />
        </div>
        <div class="head-container">
          <el-scrollbar :height="treeHeight" class="tree-border">
            <el-tree :data="menuOptions" :props="{ label: 'LABEL', children: 'CHILDREN' }" node-key="VALUE" :filter-node-method="filterNode" ref="deptTreeRef" highlight-current :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick" />
          </el-scrollbar>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24" class="noPadding-right">
        <el-row class="group mb6" justify="space-between">
          <el-col :span="20">
            <el-form ref="queryRef" :inline="true" :model="queryParams" class="query-form" label-width="0">
              <el-form-item prop="VNAME" style="width: 150px">
                <el-input v-model.trim="queryParams.VNAME" placeholder="姓名" clearable />
              </el-form-item>
              <el-form-item prop="MOBILE" style="width: 150px">
                <el-input v-model.trim="queryParams.MOBILE" placeholder="手机号" clearable />
              </el-form-item>
              <el-form-item prop="BILLSTATUS" style="width: 150px">
                <el-select v-model.trim="queryParams.BILLSTATUS" placeholder="状态" clearable>
                  <el-option v-for="item in BILLSTATUS" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" class="flex-row-end">
            <el-row :gutter="5">
              <el-col :span="1.5">
                <el-button type="primary" @click="handleSearch">查询</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button @click="resetSearch">重置</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <div class="group">
          <el-row justify="space-between" class="mb6">
            <el-col :span="20">
              <el-button plain @click="handleAdd">新增</el-button>
            </el-col>
          </el-row>
          <Vtable ref="tableRef" :tableCFG="tableConfig" :tableData="dataList" @dbClick="handleDetail" actionBar :actionBarWidth="310" @change="tableChange">
            <template #actionBar="{ row }">
              <el-row :gutter="16" justify="center" style="margin:0">
                <el-col :span="1.5">
                  <el-link :underline="false" @click="handlePermiss(row)">授权</el-link>
                </el-col>
                <el-col :span="1.5">
                  <el-link :underline="false" @click="handleBBSPermiss(row)">知识库授权</el-link>
                </el-col>
                <el-col :span="1.5">
                  <el-link :underline="false" @click="handleEdit(row)">编辑</el-link>
                </el-col>
                <el-col :span="1.5" v-if="row.BILLSTATUS == '1'">
                  <el-link :underline="false" @click="handleBlack(row, '0')">停用</el-link>
                </el-col>
                <template v-else>
                  <el-col :span="1.5">
                    <el-link :underline="false" @click="handleBlack(row, '1')">启用</el-link>
                  </el-col>
                  <el-col :span="1.5">
                    <el-link :underline="false" @click="handleDelete(row)">删除</el-link>
                  </el-col>
                </template>
                <el-col :span="1.5">
                  <el-link :underline="false" @click="handleReset(row)">重置</el-link>
                </el-col>
              </el-row>
            </template>
          </Vtable>
          <vxe-pager size="mini" :page-size="queryParams.PAGESIZE" :page-sizes="[10, 20, 30, 50, 100, 1000, 2000]" :current-page="queryParams.PAGENUM" :total="total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange">
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
            <template #CLASSLIST>
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
import { UserList, UserDetail, addUser, editUser, delUser, statusUser, getAuthRole, updateAuthRole, deptTreeSelect, updateUserPwd, FormConfig, PWDConfig, TableConfig } from "#/system/user";
import { getFormValue, getFormRule } from "@/utils";
import { Search, Delete, Edit, Refresh } from "@element-plus/icons-vue";
import { getDictsTree } from "#/system/dict"
import { getUserBBS, editUserBBS, UserBBSFormConfig } from "#/ETEAM/bbsPromiss"

const { proxy } = getCurrentInstance();
const treeHeight = window.innerHeight - 165;
const route = useRoute();
const deptTreeRef = ref();
const queryRef = ref();
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
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
    PK_ORG: undefined,
    PK_DEPT: undefined,
  },
  BILLSTATUS: [
    { LABEL: "停用", VALUE: "0", COLOR: "primary" },
    { LABEL: "正常", VALUE: "1", COLOR: "primary" },
    { LABEL: "锁定", VALUE: "2", COLOR: "danger" },
    { LABEL: "黑名单", VALUE: "3", COLOR: "danger" },
    { LABEL: "删除", VALUE: "4", COLOR: "danger" },
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
const { queryParams, baseForm, form, formConfig, BILLSTATUS, AllMenuTree, rules, TreeProps } = toRefs(data);
const total = ref(0);
const dataList = ref([]);

// tree
const deptName = ref();
watch(deptName, (val) => {
  deptTreeRef.value.filter(val);
});
const menuOptions = ref([]);
const getDeptTree = () => {
  deptTreeSelect().then((res) => {
    menuOptions.value = res.RESULT;
  });
};
const filterNode = (value, data) => {
  if (!value) return true;
  return data.LABEL.indexOf(value) !== -1;
};
const handleNodeClick = (val) => {
  let { VALUE, TYPE } = val;
  if (TYPE == "ORG") {
    queryParams.value.PK_ORG = VALUE;
    queryParams.value.PK_DEPT = "";
  } else {
    queryParams.value.PK_ORG = "";
    queryParams.value.PK_DEPT = VALUE;
  }
  handleSearch();
};

const tableConfig = reactive({
  tableColumns: TableConfig,
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  height: window.innerHeight - 235,
});
// 根据表格高度设置默认的分页大小
function setTableHeight() {
  let mainHeight = null;
  mainHeight = window.innerHeight - 235;
  if (mainHeight > 750) {
    queryParams.value.PAGESIZE = 30;
  } else if (mainHeight > 400) {
    queryParams.value.PAGESIZE = 20;
  } else {
    queryParams.value.PAGESIZE = 10;
  }
}
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
// 初始化 重置密码 表单
const initPWDForm = () => {
  formConfig.value = PWDConfig;
  let formData = getFormValue(PWDConfig);
  baseForm.value = formData;
  form.value = formData;
  rules.value = getFormRule(PWDConfig);
  pageConfig.modalW = "30%";
  pageConfig.modalH = "30%";
};
// 初始化 用户授权 表单
const initPERMISSForm = () => {
  let config = [
    { FIELD: "VNAME", LABEL: "用户", COL: 24, CONTROLS: "ExReadCard", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
    { FIELD: "ROLENAME", LABEL: "角色", COL: 24, CONTROLS: "ExReadCard", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
    { FIELD: "MENULIST", LABEL: "菜单权限", COL: 24, CONTROLS: "slot", ISSHOW: 1 }
  ];
  formConfig.value = config;
  let formData = getFormValue(config);
  baseForm.value = formData;
  form.value = formData;
  rules.value = getFormRule(config);
  pageConfig.modalW = "600px";
  pageConfig.modalH = "70%";
};

const initBBSPERMISSForm = () => {
  formConfig.value = UserBBSFormConfig;
  let formData = getFormValue(UserBBSFormConfig);
  baseForm.value = formData;
  form.value = formData;
  rules.value = getFormRule(UserBBSFormConfig);
  pageConfig.modalW = "600px";
  pageConfig.modalH = "70%";
};

const getList = () => {
  tableConfig.loading = true;
  UserList(queryParams.value)
    .then((res) => {
      dataList.value = res.RESULT.RECORDS;
      total.value = res.RESULT.TOTAL;
    })
    .finally(() => {
      tableConfig.loading = false;
    });
};

const handleSearch = () => {
  queryParams.value.PAGENUM = 1;
  getList();
};

const handlePageChange = ({ currentPage, pageSize }) => {
  queryParams.value.PAGENUM = currentPage;
  queryParams.value.PAGESIZE = pageSize;
  getList()
}

const resetSearch = () => {
  if (!queryRef) return;
  queryParams.value.PK_ORG = undefined;
  queryParams.value.PK_DEPT = undefined;
  deptTreeRef.value.setCheckedKeys([]);
  queryRef.value.resetFields();
  handleSearch();
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

const tableChange = data => {
  if (data.clicktype == 'sort') {
    queryParams.value.SORTNAME = data.data.sortBy;
    queryParams.value.REVERSE = data.data.sort;
    handleSearch();
  }
}

const roleData = ref([]);
const handlePermiss = (row) => {
  formType.value = "permiss";
  let { BILLNO, PK_ROLE } = row;
  getMENUBENTree({
    BILLFROM: 0,
  }).then((res) => {
    AllMenuTree.value = res.RESULT;
    initPERMISSForm();
    form.value = row;
    RoleDetail({ BILLNO: PK_ROLE }).then((res) => {
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

const handleBBSPermiss = row => {
  formType.value = "BBSpermiss";
  let { BILLNO, PK_ROLE } = row;
  getDictsTree("knowledgeBase").then(res => {
    AllMenuTree.value = res.RESULT;
    initBBSPERMISSForm();
    form.value = row;
    RoleDetail({
      BILLNO: PK_ROLE,
    }).then((res) => {
      roleData.value = [...res.RESULT.CLASSLIST];
      getUserBBS({ USERID: BILLNO }).then(res => {
        pageConfig.modelTitle = "用户知识库授权";
        let selectMenu = [...roleData.value, ...res.RESULT.CLASSLIST];
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
      })
    });
  })
}

const handleAdd = () => {
  initForm();
  form.value = baseForm.value;
  formType.value = "add";
  if (formRef.value) formRef.value.resetForm();
  pageConfig.modelTitle = "新增用户";
  nextTick(() => {
    let data = (formConfig.value.find(
      (el) => el.FIELD == "PASSWORD"
    ).ISSHOW = 1);
    formConfig.value = Object.assign(formConfig.value, data);
    pageConfig.modalVisible = true;
  });
};

const handleDetail = (row) => {
  initForm();
  let { BILLNO } = row;
  UserDetail({ BILLNO }).then((res) => {
    formType.value = "detail";
    if (formRef.value) formRef.value.resetForm();
    form.value = { ...baseForm.value, ...res.RESULT };
    pageConfig.modelTitle = "用户详情";
    nextTick(() => {
      let data = (formConfig.value.find(
        (el) => el.FIELD == "PASSWORD"
      ).ISSHOW = 0);
      formConfig.value = Object.assign(formConfig.value, data);
      pageConfig.modalVisible = true;
    });
  });
};

const handleEdit = (row) => {
  initForm();
  let { BILLNO } = row;
  UserDetail({ BILLNO }).then((res) => {
    formType.value = "edit";
    if (formRef.value) formRef.value.resetForm();
    form.value = { ...baseForm.value, ...res.RESULT };
    pageConfig.modelTitle = "编辑用户";
    nextTick(() => {
      let data = (formConfig.value.find(
        (el) => el.FIELD == "PASSWORD"
      ).ISSHOW = 0);
      formConfig.value = Object.assign(formConfig.value, data);
      pageConfig.modalVisible = true;
    });
  });
};

const handleDelete = (row) => {
  let { VNAME, BILLNO } = row;
  proxy.$modal.confirm(`是否删除用户 ${VNAME} ？`).then((res) => {
    delUser({
      data: [BILLNO],
    }).then((res) => {
      handleSearch();
    });
  });
};

const handleBlack = (row, type) => {
  let { VNAME, BILLNO } = row;
  let str = type == "1" ? "启用" : "停用";
  proxy.$modal.confirm(`是否${str}用户 ${VNAME} ？`).then((res) => {
    statusUser({
      BILLNO: BILLNO,
      BILLSTATUS: type
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
      addUser(form.value).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        pageConfig.modalVisible = false;
        handleSearch();
      });
    } else if (formType.value == "permiss") {
      let selectTreeKey = getMenuAllCheckedKeys();
      let menu = [],
        btn = [];
      for (let i = 0; i < selectTreeKey.length; i++) {
        const el = selectTreeKey[i];
        if (el.indexOf("BT") != 0) {
          menu.push(el);
        } else {
          btn.push(el);
        }
      }
      updateAuthRole({
        BILLNO: form.value.BILLNO,
        MENU: menu,
        BTN: btn,
      }).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        pageConfig.modalVisible = false;
      });
    } else if (formType.value == 'BBSpermiss') {
      let selectTreeKey = getMenuAllCheckedKeys();
      editUserBBS({
        USERID: form.value.BILLNO,
        CLASSLIST: selectTreeKey
      }).then(res => {
        proxy.$modal.msgSuccess("提交成功");
        pageConfig.modalVisible = false;
      })
    } else if (formType.value == "resetPWD") {
      updateUserPwd(form.value).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        pageConfig.modalVisible = false;
      });
    } else {
      editUser(form.value).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        pageConfig.modalVisible = false;
        handleSearch();
      });
    }
  });
};

setTableHeight()
getList();
getDeptTree();
</script>

<style lang="scss" scoped>
:deep(.nopnom) {
  margin: 0 !important;
}
.group {
  padding: 8px;
  background: #fff;
  border-radius: 4px;
}
.mb6 {
  margin-bottom: 6px;
}
.noPadding-right {
  padding-right: 0 !important;
}
</style>
