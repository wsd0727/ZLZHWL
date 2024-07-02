<!--
 * @Author: cc2049
 * @Date: 2024-01-25 10:21:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-08 16:09:09
 * @Description: 简介
-->
<template>
  <div v-loading="loading" :style="'height:' + height">
    <iframe 
      :src="url" 
      frameborder="no" 
      style="width: 100%; height: 100%" 
      scrolling="auto" />
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true
  }
})




const height = ref(window.innerHeight - 120 + "px;")
const loading = ref(true)
const url = computed(() => props.src)
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 300);
  window.onresize = function temp() {
    height.value = window.innerHeight - 120 + "px;";
  };
})
</script>
