<!--
 * @Author: cc2049
 * @Date: 2024-01-25 10:21:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-20 19:38:42
 * @Description: 简介
-->
<template>
  <!-- 工作台分发 -->
  <div class="">
    <el-scrollbar :height="height">
      <IndexConfig v-if="systemConfig?.configWorkBench == '1'" />

      <!-- <welcomeAPI v-if="systemConfig?.systemCode == 'WZCAPI'" /> -->
      <template v-else-if="systemConfig?.systemCode == 'WZCAPI'">
        <!-- USERTYPE  0 是货主和管理员  1 司机   2 是承运商 -->
        <template v-if="userInfo.USERTYPE == 0">
          <welcomeSuperWZC />
        </template>
        <template v-else-if="userInfo.USERTYPE == 2">
          <welcomeCarrierWZC />
        </template>
        <template v-else-if="userInfo.USERTYPE == 4">
          <welcomeTravellingWZC />
        </template>
      </template>
      <welcomeZLZHWL v-else-if="systemConfig?.systemCode == 'ZLZHWL'" />
      <!-- <div v-else-if="systemConfig?.systemCode == 'ZLZHWL'">
        test
      </div> -->
      <welcomeJDWL v-else-if="systemConfig?.systemCode == 'JDWL'" />
      <welcomePublic v-else />
    </el-scrollbar>

  </div>
</template>

<script setup>
import welcomePublic from "@/views/welcome/index-img.vue";
import welcomeZLZHWL from "@/views/welcome/ZLZHWL-api.vue";
import welcomeAPI from "@/views/dashboard/wzc-api.vue";
import useSettingsStore from "@/store/modules/settings";
import welcomeSuperWZC from "@/views/welcome/WZC-super.vue"
import welcomeCarrierWZC from "@/views/welcome/WZC-carrier.vue"
import welcomeTravellingWZC from "@/views/welcome/WZC-travelling.vue"
import welcomeJDWL from "@/views/JDWL/Board/fhlkb"

import IndexConfig from "@/views/welcome/index-config.vue"   // 可配置工作台


import useUserStore from "@/store/modules/user";

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);

const settingsStore = useSettingsStore();
const systemConfig = computed(() => settingsStore.systemConfig);
const height = window.innerHeight - 115

</script>
