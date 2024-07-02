<template>
  <div class="app-main">
    <formGroup ref="formGroupRef" class="group" title="合单信息" v-model:visable="formOpen">
      <div class="group-content">

      </div>
    </formGroup>
  </div>
</template>

<script setup>
import { saveMargeOrder } from "@/api/WZC/Carrier/MargeOrder"

</script>
<style lang="scss" scoped>
</style>