<template>
  <el-scrollbar :height="height">
    <div class="team-wrap" v-if="teamList.length">
      <div class="team-item" v-for="item in teamList" :key="item.BILLNO">
        <el-icon :size="18"><User /></el-icon>
        <span> {{ item.USERNAME }} </span>
        <span class="text-gray" v-if="item.ISMANAGER == 1">
          （{{ item.TMTYPE + "负责人" }}）
        </span>
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
    teamList.value = res.RESULT;
  });
}

watch(PK_CLASS, val => {
  getData();
}, {
  immediate: true
})

watch(props.CFG , val => {
  if(val.refresh>1){
    getData();
  }
})

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
</style>
