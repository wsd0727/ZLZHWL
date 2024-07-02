<template>
  <JsonViewer style="width: 100%" :value="JsonValue" :copyable="{ copyText: '复制' }" boxed sort theme="jv-light" />
</template>

<script setup>
import { JsonViewer } from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";

const props = defineProps({
  modelValue: String
})

const JsonValue = computed(() => {
  return mapToJSON(props.modelValue)
})

// 字符串转JSON
function mapToJSON(data) {
  try {
    return data != "" ? JSON.parse(data) : {};
  } catch (err) {
    console.error("Error: JSON格式错误", err);
    return {};
  }
}
</script>
<style lang="scss" scoped>
</style>