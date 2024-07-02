<template>
  <div class="">
    <loginMES v-if="systemConfig?.systemCode == 'MES' " />
    <loginPublic v-else />

  </div>
</template>

<script setup>
import loginPublic from "@/views/login/login-public.vue"
import loginMES from "@/views/login/login-mes.vue"
import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();
const systemConfig = computed(() => settingsStore.systemConfig);


</script>