<template>
  <div class="reportFom-app">
    <iframe
        class="iframeClass"
      :src="baseUrl + ReportformCGFdata.url + Token"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script setup>
import { getToken } from "@/utils/auth";
const props = defineProps({
  ReportformCGFdata: Object,
});
const baseUrl = "http://116.63.138.118:8072";
const Token = "?token=" + getToken();
</script>

<style lang="scss">
.reportFom-app{
    .iframeClass{
        width: 100%;
        height: 800px;
    }
}
</style>
