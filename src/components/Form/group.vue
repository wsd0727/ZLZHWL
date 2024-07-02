<template>
  <div class="group-item">
    <div class="title">
      <span>
        {{ title }}
        <el-icon v-if="reload" class="icon" @click="InfoReload">
          <Refresh />
        </el-icon>
      </span>
      <el-icon v-if="!disabled" @click="visable=!visable">
        <ArrowDownBold v-if="visable" />
        <ArrowUpBold v-else />
      </el-icon>
    </div>
    <div class="content" v-show="visable">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  reload: Boolean,
  visable: Boolean,
  disabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['reload', 'update:visable'])

const InfoReload = emit('reload')

</script>

<style lang="scss" scoped>
.group {
  &-item {
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    margin-bottom: 10px;
    .title {
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px;
      background: var(--el-color-info-light-9);
      font-size: 14px;
      .icon {
        margin-left: 10px;
      }
    }
    .content {
      .Form,
      .WorkFlowTimeLine {
        padding: 10px 10px 0;
      }
      :deep(.el-timeline) {
        padding-left: 10px;
      }
    }
  }
}
</style>