<!--
 * @Author: cc2049
 * @Date: 2024-03-16 08:50:03
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-16 09:00:02
 * @Description: 预警标题
-->
<template>
<div class="warning-wrap">
  {{ config.OTHER  }}
</div>
</template>

<script setup>
const props = defineProps({
  config: Object  
})
</script>

<style lang="scss" scoped>
.warning-wrap{
    width: 80%;
    border-radius: 10px;
    text-align: center;
    border-top: 6px solid var(--el-color-primary-light-7);
}
</style>
