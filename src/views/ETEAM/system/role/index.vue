<template>
  <div class="app-wrap">
    <div class="group mb6">
      <el-row class="row-bg" justify="space-between">
        <el-col :span="20">
          <el-form ref="queryRef" :inline="true" :model="queryParams" class="query-form" label-width="60px">
            <el-form-item prop="VNAME" label="名称">
              <el-input v-model.trim="queryParams.VNAME" placeholder="请输入" clearable style="width: 150px" />
            </el-form-item>
            <el-form-item prop="VTYPE" label="类型">
              <el-select v-model.trim="queryParams.VTYPE" placeholder="请选择" clearable style="width: 150px">
                <el-option v-for="item in VTYPE" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="BILLFROM"  label="终端">
              <el-select v-model.trim="queryParams.BILLFROM" placeholder="请选择" clearable>
                <el-option v-for="item in DEVICE" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="ENABLESTATE" style="width: 150px" label="状态">
              <el-select v-model.trim="queryParams.ENABLESTATE" placeholder="请选择" clearable>
                <el-option v-for="item in ENABLESTATE" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" class="flex-row-end">
          <el-row :gutter="5">
            <el-col :span="1.5">
              <el-button type="primary" @click="handleSearch">查找</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button @click="resetSearch">重置</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="group">
      <el-row justify="space-between" class="mb6">
        <el-col :span="20">
          <el-button plain @click="handlePlus">新增</el-button>
        </el-col>
        <el-col :span="4" class="flex-row-end">
          <el-icon :size="14" @click="colDrawer = true" title="列配置">
            <Setting />
          </el-icon>
        </el-col>
      </el-row>
      <Vtable ref="tableRef" :tableCFG="tableConfig" :tableData="dataList" actionBar :actionBarWidth="140" @change="tableChange">
        <template #actionBar="{ row }">
          <el-row :gutter="5" justify="center" style="margin:0">
            <el-col :span="1.5">
              <el-link :underline="false" @click="handleEdit(row)">编辑</el-link>
            </el-col>
            <el-col :span="1.5">
              <el-link :underline="false" @click="handleEditBBS(row)">知识库</el-link>
            </el-col>
            <el-col :span="1.5" v-if="row.ISDELETE == '1'">
              <el-link :underline="false" @click="handleDelete(row)">删除</el-link>
            </el-col>
          </el-row>
        </template>
      </Vtable>
      <vxe-pager size="mini" :page-size="queryParams.PAGESIZE" :page-sizes="[10, 20, 30, 50, 100, 1000, 2000]" :current-page="queryParams.PAGENUM" :total="total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange">
      </vxe-pager>
    </div>

    <el-drawer v-model="colDrawer" title="列配置" :size="500">
      <div class="col-wrap">
        <p>已显示字段</p>
        <draggable :list="tableConfig.tableColumns" ghost-class="ghost" :force-fallback="true" chosen-class="chosenClass" animation="300" @start="onStart" @end="onEnd">
          <template #item="{ element, index }">
            <el-tag closable effect="plain" class="col-tab" size="large" @close="closeTab(index)" v-if="element.SELECTEDFLAG == 1">
              {{ element.LABEL }}
            </el-tag>
          </template>
        </draggable>
        <p style="margin-top: 20px">可选字段</p>
        <template v-for="(itemCol, index) in tableConfig.tableColumns" :key="itemCol.BILLNO">
          <el-tag effect="plain" class="col-tab" size="large" @close="closeTab(index)" v-if="itemCol.SELECTEDFLAG != 1">
            {{ itemCol.LABEL }}
            <el-icon @click="closeTab(index, 1)">
              <Plus />
            </el-icon>
          </el-tag>
        </template>
      </div>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="colDrawer = false" size="default">关闭</el-button>
          <el-button type="primary" @click="saveColConfig" size="default">保存</el-button>
        </div>
      </template>
    </el-drawer>

    <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> {{ pageConfig.modelTitle }} </span>
      </template>
      <template #default>
        <el-row :gutter="10">
          <el-col :span="!rformConfig?24:12">
            <Form ref="formRef" v-model:formData="form" :formConfig="formConfig" :rules="rules" :detail="formType == 'detail'" @select="formSelect">
              <template #CLASSLIST>
                <div class="menuSelect">
                  <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
                  <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
                  <el-checkbox v-model="menuFandZ">父子联动</el-checkbox>
                  <el-tree class="tree-border" :data="AllMenuTree" show-checkbox ref="menuRef" node-key="VALUE" :check-strictly="!menuFandZ" empty-text="暂无数据" :props="{ label: 'LABEL', children: 'CHILDREN' }"></el-tree>
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
          </el-col>
          <el-col :span="12" v-if="rformConfig">
            <Form ref="formRef" v-model:formData="form" :formConfig="rformConfig" :rules="rules" :detail="formType == 'detail'">
              <template #MENULIST>
                <div class="menuSelect">
                  <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
                  <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
                  <el-checkbox v-model="menuFandZ">父子联动</el-checkbox>
                  <el-tree class="tree-border" :data="AllMenuTree" show-checkbox ref="menuRef" node-key="VALUE" :check-strictly="!menuFandZ" empty-text="暂无数据" :props="{ label: 'LABEL', children: 'CHILDREN' }"></el-tree>
                </div>
              </template>
            </Form>
          </el-col>
        </el-row>
      </template>
      <template #footer>
        <el-button v-if="formType != 'detail'" type="primary" size="default" @click="formSubmit">保存</el-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script setup name="">
import Form from "@/components/Form";
import Vtable from "@/components/Tables";
import { getMENUBENTree, RoleList, RoleDetail, addRole, editRole, delRole, FormConfig, RFormConfig, TableConfig,getPanelList } from "#/system/role";
import { DEVICE, ENABLESTATE } from "@/config";
const VTYPE = reactive([
  { LABEL: "平台", VALUE: "0" },
  { LABEL: "司机", VALUE: "1" },
  { LABEL: "承运商", VALUE: "2" },
  { LABEL: "供应商", VALUE: "3" },
  { LABEL: "客户", VALUE: "4" },
]);
import { getFormValue, getFormRule } from "@/utils";
import { Search, Delete, Edit, Refresh } from "@element-plus/icons-vue";
import { getDictsTree } from "#/system/dict"
import { editRoleBBS, RoleBBSFormConfig } from "#/ETEAM/bbsPromiss"

const { proxy } = getCurrentInstance();
const route = useRoute();

const queryRef = ref();
const tableRef = ref();
const formRef = ref();
const formType = ref();

// 列表
const data = reactive({
  baseForm: {},
  form: {},
  formConfig: [],
  rformConfig: [],
  AllMenuTree: [],
  queryParams: {
    PAGENUM: 1,
    PAGESIZE: 10,
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
    VNAME: undefined,
    VTYPE: undefined,
    BILLFROM: undefined,
    ENABLESTATE: undefined,
  },
  rules: {},
});

const { queryParams, baseForm, form, formConfig, rformConfig, AllMenuTree, rules } = toRefs(data);
const total = ref(0);
const dataList = ref([]);

const tableConfig = reactive({
  tableColumns: TableConfig,
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  hasFill: true,
  height: window.innerHeight - 230,
});

const getList = () => {
  tableConfig.loading = true;
  RoleList(queryParams.value)
    .then((res) => {
      dataList.value = res.RESULT.RECORDS;
      total.value = res.RESULT.TOTAL;
      queryPANELIDList()

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
    VDEF20:1,
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

const handlePageChange = ({ currentPage, pageSize }) => {
  queryParams.value.PAGENUM = currentPage;
  queryParams.value.PAGESIZE = pageSize;
  getList()
}

const tableChange = data => {
  if (data.clicktype == 'sort') {
    queryParams.value.SORTNAME = data.data.sortBy;
    queryParams.value.REVERSE = data.data.sort;
    handleSearch();
  }
}

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
  modalW: "900px",
  modalH: "70%",
  modelTitle: "",
});

const initForm = () => {
  formConfig.value = FormConfig;
  rformConfig.value = RFormConfig;
  let formData = getFormValue(FormConfig);
  baseForm.value = formData;
  form.value = formData;
  rules.value = getFormRule(FormConfig);
  pageConfig.modalW = "900px"
};
const initBBSForm = () => {
  formConfig.value = RoleBBSFormConfig;
  rformConfig.value = null;
  let formData = getFormValue(RoleBBSFormConfig);
  baseForm.value = formData;
  form.value = formData;
  rules.value = getFormRule(RoleBBSFormConfig);
  pageConfig.modalW = "600px"
}
initForm();

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

const handleSearch = () => {
  queryParams.value.PAGENUM = 1;
  getList();
};
const resetSearch = () => {
  if (!queryRef) return;
  queryRef.value.resetFields();
  handleSearch();
};

const handlePlus = () => {
  initForm();
  form.value = baseForm.value;
  formType.value = "add";
  pageConfig.modelTitle = "新增角色";
  if (formRef.value) formRef.value.resetForm();
  getMENUBENTree({
    BILLFROM: form.value.BILLFROM,
  }).then((res) => {
    AllMenuTree.value = res.RESULT;
    pageConfig.modalVisible = true;
    nextTick(() => {
      menuExpand.value = true;
      handleCheckedTreeExpand(true);
      menuFandZ.value = false;
    });
  });
};

const handleEdit = (row) => {
  initForm();
  RoleDetail({
    BILLNO: row.BILLNO,
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
  }).then((res) => {
    formType.value = "edit";
    if (formRef.value) formRef.value.resetForm();
    form.value = { ...baseForm.value, ...res.RESULT };
    let selectMenu = [...res.RESULT.MENU, ...res.RESULT.BTN];
    pageConfig.modelTitle = "编辑角色";
    nextTick(() => {
      getMENUBENTree({
        BILLFROM: form.value.BILLFROM,
      }).then((res) => {
        AllMenuTree.value = res.RESULT;
        pageConfig.modalVisible = true;
        nextTick(() => {
          menuExpand.value = true;
          handleCheckedTreeExpand(true);
          menuFandZ.value = false;
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

const handleEditBBS = (row) => {
  initBBSForm();
  RoleDetail({
    BILLNO: row.BILLNO,
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
  }).then((res) => {
    formType.value = "editBBS";
    if (formRef.value) formRef.value.resetForm();
    form.value = { ...baseForm.value, ...res.RESULT };
    let selectMenu = [...res.RESULT.CLASSLIST];
    pageConfig.modelTitle = "编辑角色知识库权限";
    nextTick(() => {
      getDictsTree("knowledgeBase").then(res => {
        AllMenuTree.value = res.RESULT
        pageConfig.modalVisible = true;
        nextTick(() => {
          menuExpand.value = true;
          handleCheckedTreeExpand(true);
          menuFandZ.value = false;
          selectMenu.forEach((v) => {
            nextTick(() => {
              menuRef.value.setChecked(v, true, false);
            });
          });
        });
      })
    });
  });
}

const handleDelete = (row) => {
  proxy.$modal.confirm(`是否确定删除 ${row.VNAME} ？`).then((res) => {
    let id = row.BILLNO;
    delRole({ data: [id] }).then((res) => {
      handleSearch();
    });
  });
};

const formSubmit = () => {
  formRef.value.submitForm().then((valid) => {
    if (!valid) return;
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
    if (formType.value == "edit") {
      editRole({
        ...form.value,
        MENU: menu,
        BTN: btn,
      }).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        pageConfig.modalVisible = false;
        handleSearch();
      });
    } else if (formType.value == 'editBBS') {
      editRoleBBS({
        ROLEID: form.value.BILLNO,
        CLASSLIST: selectTreeKey
      }).then(res => {
        proxy.$modal.msgSuccess("提交成功");
        pageConfig.modalVisible = false;
        handleSearch();
      })
    } else {
      addRole({
        ...form.value,
        MENU: menu,
        BTN: btn,
      }).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        pageConfig.modalVisible = false;
        handleSearch();
      });
    }
  });
};

const formSelect = (val) => {
  let { id, value } = val;
  if (id == "BILLFROM") {
    getMENUBENTree({
      BILLFROM: value,
    }).then((res) => {
      AllMenuTree.value = res.RESULT;
    });
  }
};

// 列隐藏
const colDrawer = ref(false);
const { tableColumns } = toRefs(tableConfig);
const closeTab = (i, t) => {
  if (t == 1) {
    tableColumns.value[i].SELECTEDFLAG = 1;
  } else {
    tableColumns.value[i].SELECTEDFLAG = 0;
  }
};
const saveColConfig = () => {
  let ArrList = tableConfig.tableColumns.filter((i) => {
    return i.SELECTEDFLAG == 1;
  });

  let newData = ArrList.map((i) => {
    return i.FIELD;
  }).join(",");

  let data = { ENGNAMESINFO: newData };
  submitEvent("/sys/selectConfig/insert", data);
};

setTableHeight()
getList();
</script>

<style lang="scss" scoped>
.app-wrap {
  // height: calc(100vh - 90px);
  padding-top: 6px;
  position: relative;
  .page-fixe-bottom {
    position: fixed !important;
    z-index: 10;
    bottom: 10px;
    right: 30px !important;
    height: 34px !important;
  }
}
.group {
  padding: 8px;
  background: #fff;
  border-radius: 4px;
}
.mb6 {
  margin-bottom: 6px;
}
</style>
