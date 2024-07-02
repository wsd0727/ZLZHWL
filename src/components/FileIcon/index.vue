<template>
  <span class="FileIcon" :class="iconName"></span>
</template>

<script setup>
import { computed } from "@vue/runtime-core";
import fileJson from "./config.js"
const { word, excel, ppt, glyphs } = fileJson
const props = defineProps({
  filename: {
    type: String,
    default: ""
  },
})
const { proxy } = getCurrentInstance();

const iconName = computed(() => {
  let type = props.filename.slice(props.filename.lastIndexOf(".") + 1);
  let cls = DictLabel(glyphs, type)
  if (word.includes(type)) return ["file-word-iocn"]
  if (excel.includes(type)) return ["file-excel-iocn"]
  if (ppt.includes(type)) return ["file-ppt-iocn"]
  if (cls == type && type != 'folder') return ['file-Unknow']
  return ['file-' + cls]
})

const DictLabel = (arr, data) => {
  arr = arr == undefined ? [] : arr;
  return proxy.selectDictLabel(arr, data, 'font_class', 'name');
};
</script>

<style lang="scss" scoped>
@import "./icon.scss";
.FileIcon {
  width: 100px;
  height: 100px;
  display: block;
  font-size: 80px;
  margin: 0 auto;
}
</style>