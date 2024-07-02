<!--
 * @Author: cc2049
 * @Date: 2024-01-25 10:23:01
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-02-21 16:34:45
 * @Description: 简介
-->
<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <div>
          <keep-alive :include="tagsViewStore.cachedViews">
            <component v-if="!route.meta.link" :is="Component" :key="route.path" />
          </keep-alive>
        </div>
      </transition>
    </router-view>
    <iframe-toggle />
  </section>
</template>

<script setup>
import iframeToggle from "./IframeToggle/index";
import useTagsViewStore from "@/store/modules/tagsView";

const tagsViewStore = useTagsViewStore();
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50   f0f2f5 */
  // min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #e7e9f1;
  box-sizing: border-box;
}
</style>
