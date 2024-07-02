<template>
  <div class="app-TJ">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
      <el-tab-pane label="周报统计" name="first">
        <vxe-table border :data="tableData" size="mini" :row-config="{isCurrent: true, isHover: true}">
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column field="DATESCOPE" type="html" title="日期区间" align="center" :formatter="formatRole">
            <template #default="{ row }">
              <el-link type="primary" @click.stop="openLink( row)">{{row.DATESCOPE}}</el-link>
            </template>
          </vxe-column>
          <vxe-column field="NORMALCOUNT" title="按时提交" align="center"></vxe-column>
          <vxe-column field="LATECOUNT" title="迟交" align="center">
          </vxe-column>
          <vxe-column field="NONECOUNT" title="未提交" align="center">
          </vxe-column>
        </vxe-table>
        <vxe-pager size="mini" class="TjPage" :page-size="pageInfo.pageSize" :page-sizes="[10, 20,  50, 100]" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange">
        </vxe-pager>
        <el-drawer v-model="visible" :show-close="false">
          <template #header="{ titleId, titleClass }">
            <span :id="titleId" :class="titleClass">周报统计</span>
            <p class="DateClass">{{DateString}}</p>
          </template>
          <el-radio-group v-model="mod" size="small" style="width:100%" @change="SET_DATA">
            <el-radio-button label="a">按时提交 {{detailData.NORMALLIST.length}}</el-radio-button>
            <el-radio-button label="b">迟交 {{detailData.LATELIST.length}}</el-radio-button>
            <el-radio-button label="c">未提交 {{detailData.NONELIST.length}}</el-radio-button>
          </el-radio-group>
          <div class="list">
            <el-scrollbar>
              <ul v-if="detailList.length != 0">
                <li v-for="item in detailList" :key="item.billNo" @click="item.ACCESSTAG == '1'?detail(item.DEPTID):''">
                  <avatar class="avatar" :avatar="item.AVATAR?'/'+item.AVATAR:''" :name="item.REALNAME" />
                  <div class="info">
                    <h3>{{item.REALNAME}}</h3>
                    <p>{{item.DEPTNAME}}</p>
                    <span class="time">
                      {{item.SUBMITTIME}}
                      <template v-if="mod == 'a' || mod == 'b'">
                        <i v-if="item.SUBMITTIME == 1" class="el-icon-arrow-right" style="margin-left:5px;font-size:14px"></i>
                        <i v-else class="el-icon-error" style="margin-left:5px;font-size:14px"></i>
                      </template>
                    </span>
                  </div>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-drawer>
      </el-tab-pane>
      <!-- <el-tab-pane label="Config" name="second">Config</el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script setup>
import { getTJList, getTJDetail } from "#/ETEAM/weekReport";
const router = useRouter();
const baseUrl = "http://116.63.138.118:8080/";
const activeName = ref('first');
const mod = ref('a')
const visible = ref(false)
const tableData = ref([])
const detailList = ref([])
const DateString = ref('')
const detailData = ref({
  normallist: [],
  latelist: [],
  nonelist: []
})
const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
});
function handleClick(val) {
  // console.log(val)
}
function SET_DATA(val) {
  mod.value = val;
  // console.log(detailData.value.NORMALLIST);
  switch (val) {
    case "a":
      detailList.value = detailData.value.NORMALLIST || []
      break;
    case "b":
      detailList.value = detailData.value.LATELIST || []
      break;
    case "c":
      detailList.value = detailData.value.NONELIST || []
      break;
  }
}
function formatRole({ cellValue }) {
  // console.log(cellValue);
  return `<a href="https://github.com/x-extends/vxe-table" class="link" target="_black" style="color: orange">链接 ${cellValue}</a>`
}
function filterDescribeMethod({ value, row, column }) {
  return XEUtils.toValueString(row.html1).indexOf(value) > -1
}
function openLink(val) {
  DateString.value = val.DATESCOPE
  // console.log(router.currentRoute.value.query.billno);
  let data = {
    APPID: "",
    VNAME: "",
    DR: "0",
    SORTNAME: "",
    BILLNO: val.BILLNO,
    REVERSE: "",
    KEY: "",
    MODULEID: "",
    PAGEID: "",
    VERSION: "",
  };
  getTJDetail(data).then((res) => {
    // console.log(res);
    detailData.value = res.RESULT;
    detailList.value = res.RESULT.NORMALLIST;
    visible.value = true;
    mod.value = 'a'
  });

}
function getPageList() {
  let data = {
    APPID: "",
    VNAME: "",
    DR: "0",
    PAGENUM: pageInfo.currentPage,
    PAGESIZE: pageInfo.pageSize,
    STATETYPE: "2",
    SORTNAME: "",
    REVERSE: "",
    KEY: "",
    MODULEID: "",
    PAGEID: "",
    VERSION: "",
  };
  getTJList(data).then((res) => {
    tableData.value = res.RESULT.RECORDS;
    pageInfo.totalResult = res.RESULT.TOTAL;
  });
}
// 分页点击
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  getPageList();
}
function detail(id = '') {
  if (this.mod == "c") return
  this.BILLNO = id
  this.open = true
}
getPageList();
</script>

<style lang="scss" scoped>
.app-TJ {
  padding: 10px;
  background: #fff;
  height: calc(100vh - 35px - 51px);
  .demo-tabs {
    .el-drawer__title {
      font-weight: 700;
      color: #000;
    }
  }
}
.DateClass {
  color: #000;
  display: block;
}
.demo-tabsLast {
  .el-tabs--card > .el-tabs__header {
    border-bottom: none !important;
  }
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    display: flex;
    &:hover {
      background: #f2f4f5;
    }
    .avatar {
      margin: 5px 10px 5px 5px !important;
      text-align: center;
      display: block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      background: #1677ff;
      color: #fff;
      overflow: hidden;
      font-size: 12px;
      border-radius: 8px;
    }
    .info {
      flex-grow: 1;
      border-bottom: 1px solid #d8dce5;
      position: relative;
      padding-top: 5px;
      h3 {
        margin: 0 0 5px 0;
        font-size: 14px;
        font-weight: normal;
      }
      p {
        font-size: 13px;
        color: #868a8e;
        margin: 0 0 5px 0;
      }
      .time {
        font-size: 13px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
        color: #868a8e;
      }
    }
  }
}
.list {
  height: calc(100% - 30px);
}
</style>
<style scoped>
.TjPage {
  position: relative;
  z-index: 1000;
}
:v-deep .vxe-select-option {
  position: relative;
  z-index: 1000;
}
:v-deep .el-drawer__header {
  height: 100px;
}
:v-deep .el-drawer__body {
  overflow: inherit;
}
</style>