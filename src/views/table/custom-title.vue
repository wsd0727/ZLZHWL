<!--
 * @Author: cc2049
 * @Date: 2024-02-27 14:04:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-02-28 11:07:18
 * @Description: 弹窗表格的自定义表头
-->


<template>
  <div class="custom-title-wrap">
    <span> {{ customTitle.title }} </span> &emsp;
    <div class="list-wrap">
      <div class="item" v-for="item in customTitle.list" :key="item">
        <div class="title-label">
          {{ item.label }}：
        </div>
        <div class="title-value">
          <span v-if="item.id.includes('#')">
            {{ setDiclabel(item.id) }}
          </span>
          <span v-else>
            {{ ListTableData[item.id] }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  customTitle: Object,
  ListTableData: Object,
  tableCFG: Object,
});

const { proxy } = getCurrentInstance();

const setDiclabel = (item) => {
  //拼接字典
  let fileid = item.replace("#", "");
  let arr = props.tableCFG.allColumns.filter((ele) => ele.FIELD == fileid);
  if (arr.length == 0 || !arr[0].OTHER) return;
  if (props.ListTableData[fileid]) {
    let newOther = JSON.parse(arr[0].OTHER);
    let newStr = DictLabels(newOther, props.ListTableData[fileid]);
    return newStr
  }
  return "";
};

// 多个字典拼接
const DictLabels = (arr, data, jg = ",", label = "LABEL", value = "VALUE") => {
  arr = arr == undefined ? [] : arr;
  return proxy.selectDictLabels(arr, data, jg, label, value);
};
</script>

<style lang="scss" scoped>
.custom-title-wrap {
  display: flex;
  .list-wrap {
    display: flex;
    .item {
      display: flex;
      padding: 0 4px;
      font-size: 14px;
      .title-value {
        color: red;
        font-weight: 600;
      }
    }
  }
}
</style>
