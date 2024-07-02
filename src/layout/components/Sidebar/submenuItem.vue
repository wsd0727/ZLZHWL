<template>
  <div class="submenu-content-item">
    <template v-if="data.CHILDREN.length > 0">
      <div class="submenu-title">{{ data.NAME }}</div>
      <submenu-item :parentPath="data.path" :data="menu" v-for="menu in data.CHILDREN" :key="menu.BILLNO"></submenu-item>
      <!-- <router-link :to="resetPath(data.path, item.path, mi.path)" v-for="mi in item.children" :key="mi.BILLNO" class="submenu-item">{{ mi.NAME }}</router-link> -->
    </template>
    <router-link v-else :to="data.fullPath" class="submenu-item">{{ data.NAME }} </router-link>
  </div>
</template>

<script setup name=''>
import submenuItem from "./submenuItem"
const props = defineProps({
  parentPath: String,
  data: Object
})
</script>

<style lang="scss" scoped>
.submenu-content-item {
  .submenu-content-item {
    padding: 0;
    color: red;
  }
}
.submenu {
  position: absolute;
  left: 100px;
  right: 0;
  top: 50px;
  width: 60vw;
  height: calc(100% - 50px);
  color: #5c5c5c;
  z-index: 99;
  overflow: hidden;
  
  &-content {
    height: calc(100% - 50px);
    overflow: auto;
    display: inline-flex;
    writing-mode: vertical-lr;
    flex-wrap: wrap;
    align-content: flex-start;
    &-item {
      width: 150px;
      padding-left: 5px;
      font-size: 13px;
      writing-mode: horizontal-tb;
    }
  }
  &-title {
    font-size: 13px;
    color: #000;
    margin: 3px 0;
    padding-left: 5px;
    font-weight: bold;
  }
  &-item {
    display: block;
    color: #333;
    height: 30px;
    line-height: 30px;
    border-radius: 3px;
    font-size: 13px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-left: 10px;
    &:hover {
      color: var(--el-color-primary);
      font-weight: 600;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
