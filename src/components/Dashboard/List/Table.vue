<template>
  <el-scrollbar :height="height">
    <div class="card-table">
      <vxe-table
        :align="allAlign"
        :data="tableData"
        :max-height="500"
        :row-config="{
          height: 10,
        }"
      >
        <vxe-column
          :field="item.ID"
          :title="item.TITLE"
          v-for="item in columnCFG"
          :key="item.ID"
          :align="item.ALIGN"
        ></vxe-column>
      </vxe-table>

      <vxe-pager
        size="mini"
        class-name="vxe-page-wrap"
        :page-size="pageInfo.pageSize"
        :page-sizes="[10, 20, 30, 50, 100]"
        :current-page="pageInfo.currentPage"
        :total="pageInfo.totalResult"
        :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']"
        @page-change="handlePageChange"
      />
    </div>
  </el-scrollbar>
</template>

<script setup name="">
import { getVchartData } from "#/dashboard/index";
const props = defineProps({
  height: Number,
  CFG: Object,
});

const allAlign = ref("left");
const tableData = ref([]);
const columnCFG = ref([]);

const teamList = ref([]);
const PK_CLASS = inject("PK_CLASS");
const QueryJson = inject("QueryJson");

const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
});

function getData() {
  let query = {
    ...QueryJson.value,
    PAGENUM: pageInfo.currentPage,
    PAGESIZE: pageInfo.pageSize,
    BEGINDATE: "",
    ENDDATE: "",
  };
  getVchartData(props.CFG.url, query).then((res) => {
    let { RECORDS, TABCONFIG,TOTAL } = res.RESULT;
    tableData.value = RECORDS;
    columnCFG.value = TABCONFIG;
    pageInfo.totalResult = TOTAL;
  });
}

// 分页点击
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  getData();
}



watch(
  PK_CLASS,
  (val) => {
    getData();
  },
  {
    immediate: true,
  }
);

watch(props.CFG, (val) => {
  if (val.refresh > 1) {
    getData();
  }
});
</script>

<style scoped lang="scss">
.team-wrap {
  display: flex;
  flex-wrap: wrap;
  .team-item {
    width: 50%;
    margin-top: 20px;
    font-size: 14px;
    color: #333;
    .el-icon {
      position: relative;
      top: 2px;
      margin-right: 6px;
    }
  }
}

:deep(.vxe-table--render-default .vxe-header--column:not(.col--ellipsis)) {
  padding: 6px 0 !important;
}

:deep(.vxe-table--render-default .vxe-body--column:not(.col--ellipsis)) {
  padding: 6px 0 !important;
}
</style>
