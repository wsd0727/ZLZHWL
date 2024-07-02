<template>
  <div class="line-up-card">
    <div class="cart-top">
      <div class="title">{{ cardTitle || "排队" }}
        <slot name="fullscreen"> </slot>
      </div>
      <div class="action-wrap">
        <div class="query">
          <el-input placeholder="请输入车号" v-model="keyword" @change="Search"></el-input>
        </div>
        <div class="btn-wrap">
          <template v-if="cardTitle == '排队队列'">
            <el-button type="primary" @click="handelEvent(1)"> 叫号 </el-button>
            <el-button @click="handelEvent(2)"> 置顶 </el-button>
            <el-button @click="handelEvent(3)"> 置底 </el-button>
            <el-button @click="handelEvent(4)"> 上移 </el-button>
            <el-button @click="handelEvent(5)"> 下移 </el-button>
          </template>
          <!-- <template v-if="cardTitle == '叫号队列'">
          </template> -->
          <template v-if="cardTitle == '过号队列'">
            <el-button type="primary" @click="handelEvent(6)"> 移除 </el-button>
            <el-button type="danger" @click="handelEvent(7)"> 恢复 </el-button>
            <el-button type="primary" @click="handelEvent(8)"> 插队 </el-button>
          </template>
        </div>
      </div>
    </div>

    <Vtable ref="tableRef" :tableCFG="tableConfig" :tableData="dataList" @change="tableChange">
    </Vtable>

    <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 50, 100]" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange" />
  </div>
</template>

<script setup name="">
import Vtable from "@/components/Tables";
import { getTableData } from "@/api/system/page";

const { proxy } = getCurrentInstance();

const emit = defineEmits(["reloadPage"]);



const props = defineProps({
  height: Number,
  PK_CLASS: String,
  cardTitle: "",
});

console.log(999, props.height  );
// 状态
const ENABLESTATE = [
  { LABEL: "未启用", VALUE: "0", COLOR: "info" },
  { LABEL: "启用", VALUE: "1", COLOR: "" },
  { LABEL: "停用", VALUE: "2", COLOR: "danger" },
];

const TableConfig = ref([
  {
    FIELD: "PKBILLNO",
    LABEL: "单号",
    WIDTH: 150,
    ALIGN: "center",
    ISSHOW: 1,
    SELECTEDFLAG: 1,
  },
  {
    FIELD: "CARNAME",
    LABEL: "车辆",
    WIDTH: 100,
    ALIGN: "center",
    ISSHOW: 1,
    SELECTEDFLAG: 1,
  },
  {
    FIELD: "FACTORYNAME",
    LABEL: "厂区",
    WIDTH: 150,
    ALIGN: "left",
    VTYPE: "ExTextBox",
    ISSHOW: 1,
    SELECTEDFLAG: 1,
  },

  {
    FIELD: "COMPANYNAME",
    LABEL: "企业",
    WIDTH: 150,
    ALIGN: "left",
    VTYPE: "ExTextBox",
    ISSHOW: 1,
    SELECTEDFLAG: 1,
  },

  // {
  //   FIELD: "ENABLESTATE",
  //   LABEL: "状态",
  //   WIDTH: 100,
  //   ALIGN: "center",
  //   VTYPE: "exNum",
  //   OTHER: JSON.stringify(ENABLESTATE),
  //   ISSHOW: 1,
  //   SELECTEDFLAG: 1,
  // },
  {
    FIELD: "SUPPLIERNAME",
    LABEL: "客商",
    WIDTH: 150,
    ALIGN: "center",
    VTYPE: "ExTextBox",
    ISSHOW: 1,
    SELECTEDFLAG: 1,
  },

  {
    FIELD: "MATERIAL",
    LABEL: "物料",
    WIDTH: 100,
    ALIGN: "left",
    VTYPE: "ExTextBox",
    OTHER: "",
    ISSHOW: 1,
    SELECTEDFLAG: 1,
  },
  {
    FIELD: "MATSPEC",
    LABEL: "规格",
    WIDTH: 100,
    ALIGN: "left",
    VTYPE: "ExTextBox",
    OTHER: "",
    ISSHOW: 1,
    SELECTEDFLAG: 1,
  },
]);

const dataList = ref([]);
const tableConfig = reactive({
  tableColumns: TableConfig,
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  hasFill: false,
  height: props.height ,
});

const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
});

const keyword = ref("");
const selectBillno = ref("");
function tableChange(e) {
  if (e.checked) {
    selectBillno.value = e.data[0].BILLNO;
  }
}

function Search(e) {
  getLineUpData();
}

function setTime() {
  let TimeItem = {
    FIELD: "PKBILLNO",
    LABEL: "",
    WIDTH: 150,
    ALIGN: "center",
    ISSHOW: 1,
    SELECTEDFLAG: 1,
  };
  if (props.cardTitle.includes("叫号")) {
    TimeItem.FIELD = "CALLDATE";
    TimeItem.LABEL = "叫号时间";
    TableConfig.value.push(TimeItem);
  }
  if (props.cardTitle.includes("过号")) {
    TimeItem.FIELD = "GHDATE";
    TimeItem.LABEL = "过号时间";
    TableConfig.value.push(TimeItem);
  }
  if (props.cardTitle.includes("排队")) {
    TimeItem.FIELD = "CREATIONTIME";
    TimeItem.LABEL = "排队时间";
    TableConfig.value.push(TimeItem);
  }
}

setTime();
function getLineUpData() {
  let QueryUrl = "/tms/tmsFactoryQueue/getPageList/";
  let T = 0;
  if (props.cardTitle.includes("过号")) {
    T = 1;
  }
  QueryUrl += T;
  let data = {
    KEYWORD: "",
    PAGENUM: 1,
    TYPE: "1",
    CARNAME: keyword.value,
    PK_CLASS: props.PK_CLASS,
    PAGESIZE: 10000,
    SORTNAME: "",
    SORTORDER: "",
    MODULEID: "MU230925502924",
    PAGEID: "PG230925349356",
    JHSTATUS: "0",
  };
  if (props.cardTitle.includes("叫号")) {
    data.JHSTATUS = "1";
  }

  getTableData(QueryUrl, data).then((res) => {
    let { TOTAL, RECORDS } = res.RESULT;
    dataList.value = RECORDS;
    pageInfo.totalResult = TOTAL;
  });
}

function handelEvent(t) {
  let QueryUrl = "/tms//tmsFactoryQueue/queueOpera";
  if (!selectBillno.value && t != 1) {
    return proxy.$modal.msgError("请选择一条车辆数据");
  }

  if (t == 4 && selectBillno.value == dataList.value[0].BILLNO) {
    return proxy.$modal.msgError("第一条数据不可上移");
  }

  if (
    t == 5 &&
    selectBillno.value == dataList.value[dataList.value.length - 1].BILLNO
  ) {
    return proxy.$modal.msgError("第一条最后一条条数据不可下移数据不可上移");
  }

  let data = {
    TYPE: t + "",
    PK_CLASS: props.PK_CLASS,
    BILLNO: selectBillno.value,
    SORTNAME: "",
    SORTORDER: "",
    MODULEID: "MU230925502924",
    PAGEID: "PG230925349356",
  };
  if (props.cardTitle.includes("叫号")) {
    data.JHSTATUS = "1";
  }
  getTableData(QueryUrl, data).then((res) => {
    proxy.$modal.msgSuccess('操作成功')
    emit("reloadPage");
  });
}

watch(
  () => props.PK_CLASS,
  (newVal, oldVal) => {
    getLineUpData();
  }
);

watch(
  () => props.height,
  (newVal, oldVal) => {
    tableConfig.height = newVal;
    // console.log(77, newVal, oldVal);
  }
);
</script>

<style scoped lang="scss">
.line-up-card {
  //   width: 100%;
  .cart-top {
    display: flex;
    justify-content: space-between;
    .title {
      font-weight: 600;
    }
    .action-wrap {
      display: flex;
      .query {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
