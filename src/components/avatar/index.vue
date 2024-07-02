<template>
  <div class="user-avatar">
    <img v-if="avatar" :src="avatar">
    <span v-else class="username">
      {{ name?.substr(0, 1) }}
    </span>

    <!-- <span class="username">
      {{ name.substr(0, 1) }}
    </span> -->
  </div>
</template>

<script setup name="avatar">
const props = defineProps({
  avatar: String,
  name: String,
})

</script>

<style lang="scss" scoped>
.user-avatar {
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--el-color-primary);
  font-size: 16px;
  color: #fff;
  margin: 0;
  border: 1px solid var(--el-border-color);
  padding: 0;
  text-align: center;
  &:hover {
    border-color: var(--el-color-primary-light-4);
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>