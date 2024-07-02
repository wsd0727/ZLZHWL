<!-- 系统-用户 -->
<template>
  <div class="bg-white app-wrap">
    <div class="nopnom">
      <!--部门数据-->
      <div class="tree-box">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable prefix-icon="Search" style="margin-bottom: 8px" size="defalut" />
        </div>
        <div class="head-container">
          <el-scrollbar :height="treeHeight" class="tree-border">
            <el-tree :data="menuOptions" :props="{ label: 'LABEL', children: 'CHILDREN' }" node-key="VALUE" :filter-node-method="filterNode" ref="deptTreeRef" highlight-current :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick" />
          </el-scrollbar>
        </div>
      </div>
      <!--用户数据-->
      <div class="noPadding-right">
        <el-row class="query-box" justify="space-between">
          <el-col :span="20">
            <el-form ref="queryRef" :inline="true" :model="queryParams" class="query-form" label-width="0" size="defalut">
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
                <el-button type="primary" @click="handleSearch" size="defalut">查询</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button @click="resetSearch" size="defalut">重置</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <div class="group">
          <el-row justify="space-between" class="mb6">
            <el-col :span="20">
              <el-button @click="handleAdd" size="defalut" type="primary">新增</el-button>
            </el-col>
          </el-row>
          <Vtable ref="tableRef" :tableCFG="tableConfig" :tableData="dataList" @dbClick="handleDetail" actionBar :actionBarWidth="380" @change="tableChange">
            <template #actionBar="{ rowIndex }">
              <el-row :gutter="16" justify="center" style="margin:0">
                <template v-for="(item,index) in permissBTN">
                  <el-col :span="1.5" :key="item.BILLNO" v-if="setShowBtn(item, rowIndex)">
                    <el-button @click="handleBTN(rowIndex, index)">{{item.VNAME}}</el-button>
                  </el-col>
                </template>
              </el-row>
            </template>
          </Vtable>
          <vxe-pager size="mini" :page-size="queryParams.PAGESIZE" :page-sizes="[10, 20, 30, 50, 100, 1000, 2000]" :current-page="queryParams.PAGENUM" :total="total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange">
          </vxe-pager>
        </div>
      </div>
    </div>

    <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> {{ pageConfig.modelTitle }} </span>
      </template>
      <template #default>
        <el-row :gutter="10">
          <Form ref="formRef" v-model:formData="form" :labelWidth="100" :formConfig="formConfig" :rules="rules" :detail="formType == 'detail'">
            <template #MENULIST>
              <div class="menuSelect">
                <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
                <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
                <el-checkbox v-model="menuFandZ">父子联动</el-checkbox>
                <el-tree class="tree-border" :data="AllMenuTree" show-checkbox ref="menuRef" node-key="VALUE" :check-strictly="!menuFandZ" empty-text="暂无数据" :props="TreeProps"></el-tree>
              </div>
            </template>
            <template #PANELID>
                <div>
                  <el-select v-model.trim="form.PANELID" placeholder="请选择" clearable @change="changePANELID" style="width: 100%;">
                    <el-option v-for="item in PANELIDList" :key="item.BILLNO" :label="item.PANEL_NAME" :value="item.BILLNO"></el-option>
                  </el-select>
                </div>
              </template>
          </Form>
        </el-row>
      </template>
      <template #footer>
        <el-button v-if="formType != 'detail'" type="primary" size="default" @click="formSubmit">保存</el-button>
      </template>
    </vxe-modal>

    <vxe-modal destroy-on-close v-model="OrgScopeModal" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> {{ pageConfig.modelTitle }} </span>
      </template>
      <template #default>

          <ETable ref="TableRef" :tableCFG="tableCFG" v-model:tableData="formData" :validRules="tableRules"
                @select="tableSelect" @blur="tableBlur">
                <template #actionBar="{ row,rowIndex }">
                    <el-button type="primary" link @click="clickAdd">添加</el-button>
                    <el-button link  @click="clickDel(row,rowIndex)" v-if="formData.length > 1">删除</el-button>
                </template>
            </ETable>

      </template>
      <template #footer>
        <el-button type="primary" size="default" @click="saveOrgScope">保存</el-button>
        <el-button size="default" @click="OrgScopeModal = false">关闭</el-button>
      </template>
    </vxe-modal>



  </div>
</template>

<script setup name="User">
import Form from "@/components/Form";
import Vtable from "@/components/Tables";
import { getMENUBENTree, RoleDetail ,getPanelList } from "#/system/role";
import { UserList, UserDetail, addUser, editUser, delUser, statusUser, getAuthRole, updateAuthRole, deptTreeSelect, updateUserPwd, FormConfig, PWDConfig, TableConfig, getMenuBtn ,getDataScope , saveDataScope ,delDataScope} from "#/system/user";
import { getFormValue, getFormRule } from "@/utils";
import { Search, Delete, Edit, Refresh } from "@element-plus/icons-vue";
import ETable from "@/components/Tables/edit";

import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();
const systemConfig = computed(() => settingsStore.systemConfig);


const { proxy } = getCurrentInstance();
const treeHeight = window.innerHeight - 190;
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
    { "LABEL": "正常", "VALUE": "1", "COLOR": "primary" },
    { "LABEL": "停用", "VALUE": "0", "COLOR": "danger" },
    { "LABEL": "锁定", "VALUE": "2", "COLOR": "danger" }
  ],
  rules: {},
  TreeProps: {
    label: "LABEL",
    children: "CHILDREN",
    disabled: (data) => {
      let { VALUE } = data;
      return roleData.value.includes(VALUE)
    },
  },
});
const { queryParams, baseForm, form, formConfig, BILLSTATUS, AllMenuTree, rules, TreeProps } = toRefs(data);
const total = ref(0);
const dataList = ref([]);
const OrgScopeModal = ref(false)
const OrgScopeChooese = ref({})

const tableCFG = ref({
    hasCheck: false,
    hasSeq: false,
    hasTableTools: false,
    height: 370,
    loading: false,
    // tableButtons: ['Add', 'EDIT', 'DELETE'],
    tableButtons: ['Add', 'DELETE'],
    toolsConfig: [],
    tableColumns: [ 
        { FIELD: "PK_RESOUCE", REVERFIELD: "VNAME",WIDTH: "340", LABEL: "组织",  ALIGN: "left", CONTROLS: "ExSelectSearch", ISREQUIRE: 1, EDITTABLE: 1, FIXED: "left", ISSHOW: 1, COL: 8, OTHER: '/sys/organize/queryList???VNAME=LABEL' },
      ]
})
  const formData = ref([])
  const tableRules = ref({
    VNAME: [
          { required: true, message: '请选择组织', trigger: 'change' },
      ],
  })






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
  height: window.innerHeight - 245,
});

// 根据表格高度设置默认的分页大小
function setTableHeight() {
  let mainHeight = null;
  mainHeight = window.innerHeight - 245;
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
  modalW: "50%",
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
  pageConfig.modalW = "800px";
  pageConfig.modalH = "60%";
  if(systemConfig.value?.configWorkBench == '1') queryPANELIDList()

};
// 初始化 重置密码 表单
const initPWDForm = () => {
  formConfig.value = PWDConfig;
  let formData = getFormValue(PWDConfig);
  baseForm.value = formData;
  form.value = formData;
  rules.value = getFormRule(PWDConfig);
  pageConfig.modalW = "400px";
  pageConfig.modalH = "300px";
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


const clickAdd = () => {
    // let newData = JSON.parse(JSON.stringify(addData.value))
    // formData.value.push(newData)
    formData.value.push({
      VTYPE:1,
      PK_USER:OrgScopeChooese.value.BILLNO,
    })
}
const clickDel = (row,index) => {
    if(row.BILLNO){
      delDataScope([row.BILLNO])
      .then((res) => {
        OrgScopeModal.value = false
        formData.value.splice(index, 1)
      })
      .finally(() => {
      });
    }else{
      formData.value.splice(index, 1)
    }

}

const saveOrgScope = ()=>{
  saveDataScope(formData.value)
    .then((res) => {
      OrgScopeModal.value = false
    })
    .finally(() => {
      // OrgScopeModal.value = false
    });

}

const handleOrgScope = (row)=>{
  let portData = {
    VTYPE:1,
    PK_USER:row.BILLNO,
  }
  getDataScope(portData).then((res) => {
    OrgScopeModal.value = true
    OrgScopeChooese.value = row
    if(res.RESULT.length){
      formData.value = res.RESULT
    }else{
      formData.value = [ {
      VTYPE:1,
      PK_USER:OrgScopeChooese.value.BILLNO,
      }]
    }
  });
}



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


const PANELIDList = ref([])
const changePANELID=(e)=>{
  let aa = PANELIDList.value.filter(ele=>ele.BILLNO == e)
  form.value.PANELNAME = aa[0] ?aa[0].PANEL_NAME :''
}
const queryPANELIDList=()=>{
  let data={
    // VDEF20:1,
    PAGENUM:1,
    PAGESIZE: 2000,
  }
  getPanelList(data)
    .then((res) => {
      PANELIDList.value = res.RESULT;
    })
    .finally(() => {
    });
}


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
const roleData = ref([]);
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

const handlePermiss = (row) => {
  formType.value = "permiss";
  let { BILLNO, PK_ROLE } = row;
  getMENUBENTree({
    BILLFROM: '0',
  }).then((res) => {
    AllMenuTree.value = res.RESULT;
    initPERMISSForm();
    form.value = row;
    RoleDetail({
      BILLNO: PK_ROLE,
    }).then((res) => {
      roleData.value = [...res.RESULT.MENU, ...res.RESULT.BTN];
      getAuthRole({ BILLNO }).then((res) => {
        pageConfig.modelTitle = "用户授权";
        let selectMenu = [...roleData.value];
        pageConfig.modalVisible = true;
        if (res.RESULT) {
          selectMenu = [...selectMenu, ...res.RESULT.MENU, ...res.RESULT.BTN]
        }
        nextTick(() => {
          menuExpand.value = true;
          handleCheckedTreeExpand(true);
          selectMenu.forEach((v) => {
            menuRef.value.setChecked(v, true, false);
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
      let data = (formConfig.value.find((el) => el.FIELD == "PASSWORD").ISSHOW = 0);
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

/** 获取权限按钮 */
const permissBTN = ref([])
const getPrimissBTN = () => {
  getMenuBtn({
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
  }).then(res => {
    permissBTN.value = res.RESULT
  })
}
const handleBTN = (rowIndex, index) => {
  let btnConfig = permissBTN.value[index]
  let row = dataList.value[rowIndex]
  let { BTNTITLE } = btnConfig
  // BTNTITLE 调用方法
  switch (BTNTITLE) {
    case "Permiss":
      handlePermiss(row)
      break;
    case "Edit":
      handleEdit(row)
      break;
    case "Stop":
      handleBlack(row, '0')
      break;
    case "Start":
      handleBlack(row, '1')
      break;
    case "Restart":
      handleReset(row)
      break;
    case "OrgScope":
      handleOrgScope(row)  
      break;
    case "Delete":
      handleDelete(row)  
      break;
      
  }
}
function evilFn(row, fn) {
  const Data = JSON.parse(JSON.stringify(row)) || Object.create(null);
  let Fn = new Function("Data", `return ${fn}`);
  const proxy = new Proxy(Data, {
    has(target, key) {
      return true;
    },
  });
  return Fn(proxy);
}
const setShowBtn = (btn, index) => {
  if (btn.ISSHOW == 0) return false
  if (btn.ISSHOW == 2 && btn.OTHER) {
    let Data = dataList.value[index],
      DATA = dataList.value[index];
    return evilFn(Data, btn.OTHER)
  }
  return true
};

getPrimissBTN()
setTableHeight()
getList();
getDeptTree();
</script>

<style lang="scss" scoped>
.app-wrap {
  padding: 10px 10px 0 10px;
  position: relative;
}

:deep(.nopnom) {
  display: flex;
  width: 100%;
}

.tree-box {
  width: 200px;
  padding: 4px 6px 0 6px;
  background: #fff;
}
.group {
  background: #fff;
}
.mb6 {
  margin-bottom: 6px;
}
.noPadding-right {
  width: calc(100% - 200px);
  // padding-right: 0 !important;
}

.mtb-4 {
  margin: 4px 0;
}
.query-box {
  margin: 4px 0 14px 0;
}
</style>
