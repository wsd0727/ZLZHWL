<template>
  <div class="app-BBS">
    <el-row :gutter="5">
      <el-col :span="4" :xs="24">
        <div class="head-containe">
          <el-scrollbar :height="leftHight">
            <el-tree class="treeClass" :data="BBSTree" :props="BBSProps" :expand-on-click-node="false" node-key="VALUE" :filter-node-method="filterNode" ref="tree" accordion default-expand-all @node-click="handleNodeClick" highlight-current />
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="20" :xs="24" v-if="!isShowDetail" class="rightCol">
        <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true" class="rightForm">
          <el-form-item>
            <el-form-item prop="keyWords">
              <el-input v-model="queryParams.KEYWORD" placeholder="关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="keyWords">
              <!-- <el-input v-model="queryParams.KEYWORD" placeholder="关键字" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" /> -->
              <!-- <el-date-picker v-model="formData[Ci.FIELD+'Arr']" clearable range-separator="至"  style="width: 240px"  /> -->
              <el-date-picker style="width: 240px" v-model="queryParams.DATEARR" type="daterange" range-separator="至" value-format="YYYY-MM-DD" start-placeholder="开始时间" end-placeholder="结束时间" @change="val=>setTime(val)"/>

            </el-form-item>
            <el-form-item prop="essFlag" label="精华">
              <el-switch v-model="queryParams.ESSFLAG" active-value="1" inactive-value='0' @change="setquery(queryParams.ESSFLAG,'ESSFLAG')"></el-switch>
            </el-form-item>
            <el-form-item prop="topFlag" label="置顶">
              <el-switch v-model="queryParams.TOPFLAG" active-value="1" inactive-value='0' @change="setquery(queryParams.TOPFLAG,'TOPFLAG')"></el-switch>
            </el-form-item>
            <el-button type="primary" icon="Search" size="small" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" type="primary" size="small" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button round :plain="askStatus!=0" type="danger" size="small" @click="handleStstus(0)">未解决</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button round :plain="askStatus!=1" type="success" size="small" @click="handleStstus(1)">已解决</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button round :plain="askStatus!=2" type="warning" size="small" @click="handleStstus(2)">我的提问</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button round :plain="askStatus!=3" type="primary" size="small" @click="handleStstus(3)">我的回答</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" round plain icon="Plus" size="small" @click="handleAdd">我要提问</el-button>
          </el-col>
          <!-- <template > -->
          <el-col :span="1.5">
            <el-button type="success" v-if="BillNoid==user.BILLNO" round plain icon="EditPen" size="small" :disabled="single" @click="handleEdit">编辑</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" v-if="BillNoid==user.BILLNO" round plain icon="Delete" size="small" :disabled="multiple" @click="handleDelete">删除</el-button>
          </el-col>
          <!-- </template> -->

          <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>
        <vxe-table header-row-class-name="bg-blue" ref="xTable" size="mini" border :data="tableData" :column-config="{ isCurrent: true, isHover: true }" :row-config="{ isCurrent: true, isHover: true }" :checkbox-config="{
          checkStrictly: true,
          checkField: 'checked',
          trigger: 'row',
          highlight: true,
          range: true,
        }" @checkbox-change="checkboxChange" @checkbox-all="checkboxChange">
          <vxe-column type="checkbox" align="center" width="40"></vxe-column>
          <vxe-column field="FILETITLE" type="html" title="标题" width="300" align="left" :formatter="formatRole">
            <template #default="{ row }">
              <el-link type="primary" @click="opendetail(row)">
                <el-tag v-if="row.TOPFLAG == 1" size="mini" class="mr5">置顶</el-tag>
                <el-tag v-if="row.ESSFLAG == 1" type="success" size="mini" class="mr5">精华</el-tag>
                {{ row.FILETITLE }}
              </el-link>
            </template>
          </vxe-column>
          <vxe-column field="TYPENAME" title="所属类目" align="center"></vxe-column>
          <vxe-column field="ACCESSPSNCOUNT" title="浏览数" width="100" align="center">
          </vxe-column>
          <vxe-column field="HFNUM" title="回复数" width="100" align="center">
          </vxe-column>
          <vxe-column field="STATUS" title="状态" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.STATUS == 1" type="success" size="mini" class="mr5">已解决</el-tag>
              <el-tag v-else size="mini" class="mr5">解决中</el-tag>
            </template>
          </vxe-column>
          <vxe-column field="CREATORNAME" title="发布人" align="center">
          </vxe-column>
          <vxe-column field="CREATIONTIME" title="发布时间" align="center">
          </vxe-column>
        </vxe-table>
        <vxe-pager size="mini" class="TjPage" :page-size="pageInfo.pageSize" :page-sizes="[10, 20,  50, 100]" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange"></vxe-pager>
      </el-col>

      <el-col :span="20" :xs="24" v-if="isShowDetail">
        <Affix :offset="85">
          <div class="leftBack">
            <span class="text-muted" @click="clearPath">
              <el-icon :size="24">
                <Back />
              </el-icon>
              <el-divider direction="vertical" />
            </span>
          </div>
        </Affix>
        <detailConetnt :mainP="mainDetail" :askListP="askList" :detailId="detailId" @detaileMethod='opendetail'></detailConetnt>
      </el-col>
    </el-row>

    <vxe-modal destroy-on-close v-model="showModel" :width="modalConfig.width" :height="modalConfig.height" id="formModal" resize storage transfer show-zoom show-footer>
      <template #title>
        <span class="modal-title">{{ titles }}</span>
      </template>
      <Form ref="formRef" v-model:formData="Addform" :formConfig="formConfig" :rules="rules" :detail="formType == 'detail'">
        <!-- <el-row v-if="formType == 'edit'">
          <el-col :span="12">
            <el-form-item label="精华" prop="essFlag">
              <el-switch v-model="form.essFlag" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="置顶" prop="topFlag">
              <el-switch v-model="form.topFlag" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row> -->
      </Form>
      <template #footer>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script setup>
import Form from "@/components/Form";
import detailConetnt from "./detail"
import { getPageList, FormConfig, editFormConfig, addPageList, getDictsTree, getDetail, getUpdate, getDetele, detailItem, getWDList } from "#/ETEAM/BBS";
import { getFormValue, getFormRule } from "@/utils";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const user = computed(() => userStore.userInfo);
const router = useRouter();
const routerParams = router.currentRoute.value.meta;
const { proxy } = getCurrentInstance();
const xTable = ref();
const queryParams = ref({
  TYPE: undefined,
  KEYWORD: undefined,
  ESSFLAG: "0",
  TOPFLAG: "0",
  STATUS: '',
  DATEARR:[],
  STARTTIME:undefined,
  ENDTIME:undefined,
})
const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
});
const leftHight = window.innerHeight - 93;
const ids = ref(null)
const single = ref(true)
const showSearch = ref(true)
const isShowDetail = ref(false)
const formRef = ref();
const baseForm = ref({})
const Addform = ref({})
const formConfig = ref([])
const rules = ref({})
const detailId = ref('')
const askStatus = ref('')
const modalConfig = reactive({
  title: "",
  MENUID: "",
  PAGEID: "",
  width: "80%",
  height: "90%",
});
const BBSProps = ref({
  label: 'LABEL',
  children: 'CHILDREN',
})
const mainDetail = ref({})
const askList = ref([])
const tableData = ref([])
const titles = ref('')
const showModel = ref(false)
const multiple = ref(true)
const form = ref({
  type: '',
})
const initForm = () => {
  formConfig.value = FormConfig;
  let formData = getFormValue(FormConfig);
  baseForm.value = formData;
  Addform.value = formData;
  rules.value = getFormRule(FormConfig);
};
const editinitForm = () => {
  formConfig.value = editFormConfig;
  let formData = getFormValue(editFormConfig);
  baseForm.value = formData;
  Addform.value = formData;
  rules.value = getFormRule(editFormConfig);
};
const formType = ref('add')

const BBSTree = ref([]);
function selectEvent(data) {
  // this.form.type = data.BILLNO
  // this.form.typeName = data.VNAME
}
const BillNoid = ref('')

function setTime(e){
  if(e){
    queryParams.value.STARTTIME = e[0]
    queryParams.value.ENDTIME = e[1]
  }else{
    queryParams.value.STARTTIME = undefined
    queryParams.value.ENDTIME = undefined
  }
}
function checkboxChange({ checked, row }) {
  let selectRecords = proxy.$refs.xTable.getCheckboxRecords();
  BillNoid.value = row.CREATORID;
  ids.value = selectRecords.map((item) => item.BILLNO || item.VCODE)
  single.value = selectRecords.length != 1;
  multiple.value = !selectRecords.length;
}
function setquery(val, type) {
  queryParams.value[type] = queryParams.value[type] + '';
  getList();
}
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  getList();
}
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除该单据吗?"', '警告',).then(function () {
    return HandDETELE();
  })
}
function HandDETELE() {
  getDetele(ids.value,).then((res) => {
    proxy.$modal.msgSuccess("删除成功");
    getList();
  });
}
function cancel() {
  showModel.value = false;
  Addform.value
}
function handleStstus(t) {
  askStatus.value = t;
  switch (t) {
    case 0:
      queryParams.value.STATUS = '0';
      getList();
      break;
    case 1:
      queryParams.value.STATUS = '1';
      getList();
      break;
    case 2:
      queryParams.value.STATUS = '-1';
      getList();
      break;
    case 3:
      queryParams.value.STATUS = '-2';
      getList();
      break;
  }
}

function clearPath() {
  isShowDetail.value = false;
  Addform.value = {};
  getList();
}
function handleQuery() {
  queryParams.value.PAGENUM = 1
  pageInfo.currentPage = 1
  getList()
}
function getList() {
  let data = {
    ...queryParams.value,
    APPID: "",
    VNAME: "",
    DR: "0",
    SORTNAME: "",
    REVERSE: "",
    PAGENUM: pageInfo.currentPage,
    PAGESIZE: pageInfo.pageSize,
    KEY: "",
    MODULEID: "MU230323113066",
    PAGEID: "PG230323702457",
    VERSION: "",
  };
  getPageList(data).then((res) => {
    pageInfo.totalResult = res.RESULT.TOTAL;
    tableData.value = res.RESULT.RECORDS;
  });
}
function submitForm() {
  formRef.value.submitForm().then((valid) => {
    if (!valid) return;
    if (formType.value == "add") {
      addPageList(Addform.value).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        showModel.value = false
        getList();
      });
    } else if (formType.value == "edit") {
      getUpdate({
        BILLNO: queryParams.value.TYPE,
        ...Addform.value
      }).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        showModel.value = false;
        getList();
      });
    }
    //else if (formType.value == 'BBSpermiss') {
    //   let selectTreeKey = getMenuAllCheckedKeys();
    //   editUserBBS({
    //     USERID: form.value.BILLNO,
    //     CLASSLIST: selectTreeKey
    //   }).then(res => {
    //     proxy.$modal.msgSuccess("提交成功");
    //     pageConfig.modalVisible = false;
    //   })
    // } else if (formType.value == "resetPWD") {
    //   updateUserPwd(form.value).then((res) => {
    //     proxy.$modal.msgSuccess("提交成功");
    //     pageConfig.modalVisible = false;
    //   });
    // } else {
    //   editUser(form.value).then((res) => {
    //     proxy.$modal.msgSuccess("提交成功");
    //     pageConfig.modalVisible = false;
    //     handleSearch();
    //   });
    // }
  });
}
function resetQuery() {
  queryParams.value = {};
  getList();
}
// 新增按钮事件
function handleAdd() {
  initForm();
  formType.value = 'add'
  // reset()
  titles.value = '新增'
  showModel.value = true
  // form.value.type = queryParams.value.type ? queryParams.value.type : BBSTree.value[0].VALUE;
  // if (this.$refs.upload) this.$refs.upload.clear();
}
// 编辑功能
function handleEdit() {
  editinitForm();
  formType.value = 'edit'
  showModel.value = true
  titles.value = '编辑'
  let data = {
    BILLNO: ids.value[0],
    MODULEID: routerParams.BILLNO,
    PAGEID: 'PG230302286731',
  };
  getDetail(data).then(res => {
    // this.reset();
    Addform.value = res.RESULT;
    // this.form.oldfiles = res.data.files || [];
    // this.form.files = [];
  })
}
function getTreeData() {
  getDictsTree('knowledgeBase').then((res) => {
    BBSTree.value = res.RESULT;
    queryParams.value.TYPE = BBSTree.value[0].VALUE
  });
}
function opendetail(row) {
  detailId.value = row != undefined ? row.BILLNO : detailId.value;
  let data = {
    BILLNO: detailId.value,
    MODULEID: routerParams.BILLNO,
    PAGEID: 'PG230302286731',
  };
  detailItem(data).then(res => {
    mainDetail.value = res.RESULT;
    mainDetail.value.ACCESSPSNS = mainDetail.value.ACCESSPSNS.filter(item => { return item.USERNAME });
    mainDetail.value.FAVPSNS =  mainDetail.value.FAVPSNS.filter(item => { return item.CREATORNAME });
    getAskList();
  })
}
function getAskList() {
  let data = {
    KNOWLEDGEHELPID: detailId.value,
    MODULEID: routerParams.BILLNO,
    PAGEID: 'PG230302286731',
  };
  getWDList(data).then(res => {
    let List = []
    res.RESULT.forEach((item) => {
      let listChildren = item.CHILDREN
      item.OPENASK = false;
      item.OPENSHOWLIST = true;
      item.ASKCONTENTS = '';
      item.CHILDREN = listChildren.length > 0 ? resetArr(listChildren, item.CREATORNAME) : []
      List.push(item)
    })
    askList.value = res.RESULT;
    isShowDetail.value = true;
  })
}
function resetArr(Arr, str) {
  let List = []
  const getAllChildren = function (data, str) {
    data.forEach((item) => {
      item.PARENTNAME = str
      List.push(item)
      if (item.CHILDREN.length > 0) {
        getAllChildren(item.CHILDREN, item.CREATORNAME)
      }
    })
  }
  getAllChildren(Arr, str)
  return List
}
function handleNodeClick(obj) {
  queryParams.value.TYPE = obj.VALUE;
  pageInfo.currentPage = 1
  getList();
  isShowDetail.value = false;
}
getTreeData();
getList();
</script>

<style lang="scss" scoped>
.app-BBS {
  width: 100%;
  height: 100%;
  // padding: 10px;
  padding-top: 8px;
  overflow: hidden;
  .head-containe {
    height: 100%;
    .treeClass {
      height: calc(100vh);
    }
  }
  .rightCol {
    background: #fff;
    .rightForm {
      margin-top: 10px;
      padding: 5px;
    }
  }
}
.leftBack {
  cursor: pointer;
  line-height: 36px;
  background: #fff;
  padding: 6px;
  .text-muted:hover {
    color: var(--el-color-primary);
  }
  .el-icon {
    position: relative;
    top: 7px;
  }
}
.TjPage {
  position: absolute;
  right: 5px;
  bottom: 2px;
}
.mb8 {
  padding: 5px;
  padding-top: 0px;
}
</style>
