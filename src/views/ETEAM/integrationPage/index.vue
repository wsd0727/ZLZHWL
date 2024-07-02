<template>

  <div class="intefration-app">
    <div class="form-Content">
      <el-form ref="formRef" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户">
          <el-input v-model="formInline.CREATORNAME" size="small" placeholder="用户" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="formInline.OPERATETYPE" clearable @change="selectChange" class="m-2" placeholder="类型" size="small">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="DATE" value-format="YYYY-MM-DD" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" @change="DateChange" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="Content">
      <el-row style="height:100%;">
        <el-col :span="6">
          <div class="left-Content">
            <p class="title">积分排行榜</p>
            <vxe-table border :data="tableData" size="mini" :row-config="{isCurrent: true, isHover: true}" :radio-config=" { highlight: true, trigger: 'row' }
    " :column-config="{ isCurrent: true, isHover: true }" @radio-change="radioChangeEvent" ref="xTable">
              <vxe-column field="SORTNUM" align="center" title="排名" width="50"></vxe-column>
              <vxe-column field="CREATORNAME" align="center" title="用户"></vxe-column>
              <vxe-column field="SCORECOUNT" align="center" title="总积分"></vxe-column>
            </vxe-table>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="right-Content">
            <vxe-table border :data="tableData2" size="mini" :row-config="{isCurrent: true, isHover: true}" ref="xTable2">
              <vxe-column field="CREATORNAME" align="center" title="用户" width="150"></vxe-column>
              <vxe-column field="INTEGRAL" align="center" title="积分" width="100"></vxe-column>
              <vxe-column field="OPERATETYPE" align="center" title="类型" width="100">
                <template #default="{ row }">
                  <span v-if="row.OPERATETYPE">
                    {{row.OPERATETYPE=='0'?'提问':row.OPERATETYPE=='1'?'回答':row.OPERATETYPE=='2'?'最佳答案':'精华'}}
                  </span>
                </template>
              </vxe-column>
              <vxe-column field="VNAME" title="标题"></vxe-column>
              <vxe-column field="CREATIONTIME" align="center" title="时间"></vxe-column>
            </vxe-table>
            <vxe-pager size="mini" class="TjPage" :page-size="pageInfo.pageSize" :page-sizes="[10, 20,  50, 100]" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange"></vxe-pager>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup>
import { getPageList, getRightPageList } from "#/ETEAM/integrationPage";
const formRef = ref("")
const { proxy } = getCurrentInstance();
const formInline = ref({
  CREATORNAME: '',
  OPERATETYPE: '',
  BEGINTIME: '',
  ENDTIME: ''
})
const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
});
const options = ref([
  {
    value: '0',
    label: '提问',
  },
  {
    value: '1',
    label: '回答',
  },
  {
    value: '2',
    label: '最佳答案',
  },
  {
    value: '3',
    label: '精华',
  },
])
const tableData = ref([])
const tableData2 = ref([])
const DATE = ref('')
const CREATORID = ref('')
function submitForm() {
  pageInfo.currentPage = 1;
  getRighrTable();
}
function getLeftTable() {
  let data = {
    APPID: "",
  };
  getPageList(data).then((res) => {
    tableData.value = res.RESULT
  });
}
function getRighrTable() {
  let data = {
    APPID: "",
    CREATORID: CREATORID.value,
    PAGENUM: pageInfo.currentPage,
    PAGESIZE: pageInfo.pageSize,
    ...formInline.value
  };
  getRightPageList(data).then((res) => {
    tableData2.value = res.RESULT.RECORDS
    pageInfo.totalResult = res.RESULT.TOTAL;
  });
}
// 分页点击
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  getRighrTable();
}
function radioChangeEvent({ row }) {
  CREATORID.value = row.CREATORID;
  getRighrTable();
}
function DateChange(val) {
  if (DATE.value == null) {
    formInline.value.BEGINTIME = '';
    formInline.value.ENDTIME = ''
  } else {
    formInline.value.BEGINTIME = val[0];
    formInline.value.ENDTIME = val[1];
  }
}
getLeftTable();
getRighrTable();
</script>

<style lang="scss">
.intefration-app {
  background: #fff;
  height: calc(100vh - 85px);

  .form-Content {
    .demo-form-inline {
      position: relative;
      top: 20px;
    }
  }
  .Content {
    margin-top: 10px;
    .left-Content {
      .title {
        font-size: 16px;
        font-weight: 500;
        margin: 8px;
      }
    }
    .right-Content {
      margin-top: 36px;
      margin-left: 10px;
    }
  }
}
</style>