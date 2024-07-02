
<template>
  <div class="form-group">
    <div class="form-group-title" v-if="title != ''" @click="targetVisiable">
      <div class="title">
        <slot name="title">
          <div class="title_content">
            <span>{{ title }}</span>
            <slot name="title-after" />
          </div>
        </slot>
        <div class="right">
          <slot name="right" />
          <el-icon v-if="fold">
            <ArrowDownBold v-if="visable" />
            <ArrowUpBold v-else />
          </el-icon>
        </div>
      </div>
      <el-divider border-style="dashed" />
    </div>
    <div :class="['content',fold?!visable?'height-0':'':'']">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  visable: Boolean,
  fold: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:visable'])
watch(() => props.visable, val => {
  emit("update:visable", val)
})
const targetVisiable = () => {
  if (!props.fold) return
  emit("update:visable", !props.visable)
}

</script>
<style lang="scss" scoped>
.form {
  box-sizing: border-box;
  &-group {
    box-sizing: border-box;
    border-radius: 4px;
    // margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
    .title {
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      // padding: 10px 10px 0 0;
      font-size: 14px;
      .title_content {
        display: flex;
        align-items: center;
      }
      span {
        // padding-left: 15px;
        font-weight: 500;
        font-size: 16px;
        margin-right: 10px;
        color: #000;
      }
      .icon {
        margin-left: 10px;
      }
    }
    .height-0 {
      height: 0 !important;
      overflow: hidden;
    }
  }
}
</style>