<template>
  <el-scrollbar :height="height">
    <div class="group-table">
      <div class="group-item" v-for="(item, index) in tableData" :key="index">
        <div class="title">{{ item.NAME }}</div>
        <div class="value">{{ item.NUM }}</div>
        <el-progress :percentage="100" :color="item.COLOR" :show-text="false" />
      </div>
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
const tableData = ref([
    {
        "NAME":"总数",
        "COLOR":"#FF0000",
        "ID":"ALLNUM",
        "NUM":"600"
    },
 {
        "NAME":"总数",
        "COLOR":"green",
        "ID":"ALLNUM",
        "NUM":"600"
    },
 {
        "NAME":"总数",
        "COLOR":"#FF0000",
        "ID":"ALLNUM",
        "NUM":"600"
    },
 {
        "NAME":"总数",
        "COLOR":"#FF0000",
        "ID":"ALLNUM",
        "NUM":"600"
    },
 {
        "NAME":"总数",
        "COLOR":"#FF0000",
        "ID":"ALLNUM",
        "NUM":"600"
    },

]);
const columnCFG = ref([]);

const teamList = ref([]);
const PK_CLASS = inject("PK_CLASS");
const QueryJson = inject("QueryJson");

function getData() {
  let query = {
    ...QueryJson.value,
    BEGINDATE: "",
    ENDDATE: "",
  };
  getVchartData(props.CFG.url, query).then((res) => {
    let { RECORDS, TABCONFIG } = res.RESULT;
    tableData.value = RECORDS   ;
    columnCFG.value = TABCONFIG;
  });
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
.group-table {
  display: flex;
  flex-wrap: wrap;
  .group-item {
    width: 25%;
    margin: 20px 0;
    padding: 10px 20px;
    .title{
      color: #999;
      font-size: 14px!important;
    }
    .value{
      padding: 10px 0;
      font-weight: 600;
    }
  }
}
</style>
