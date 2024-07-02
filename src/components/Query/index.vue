<template>
  <el-form :inline="queryType=='left' " :model="queryJson" class="demo-form-inline queryForm" :label-position="queryType">
    <el-form-item :label="queryType=='left' ? '' : item.LABEL  " v-for="(item,index) in getDailyData(queryConfig)" :key="index" :style="{ width: queryType=='top'? '45%':'' }">
      <!-- slot 只允许本地配置使用 -->
      <slot v-if="item.CONTROLS == 'slot'" :name="item.FIELD" :data="queryJson"></slot>

      <el-input v-else v-model="queryJson[item.FIELD]" :placeholder="item.LABEL" />
    </el-form-item>
  </el-form>
</template>

<script setup name="">
const props = defineProps({
  // 配置
  queryConfig: {
    type: Array,
    default: [],
  },
  queryJson: {
    type: Object,
    default: {},
  },
  queryType: {
    type: String,
    default: {},
  }
});

const formInline = reactive({
  user: "",
  region: "",
});

const onSubmit = () => {
  // console.log("submit!");
};

// 常用查询条件
function getDailyData(data) {
  if (Array.isArray(data)) {
    let a = data.filter((i) => {
      return i.GROUPID == 1 || i.GROUPID == '';
    });
    a = a.length > 4 ? a.splice(0, 4) : a;
    return a;
  }
}
</script>

<style lang="scss" scoped>
.demo-form-inline {
  .el-form-item--small {
    margin-bottom: 0 !important;
  }
}

.el-form--inline .el-form-item {
  margin-right: 10px !important;
}

.queryForm {
  display: flex;
  justify-content: space-around;
}
</style>
