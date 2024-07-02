<template>
  <el-tooltip :disabled="isShowTooltip" :content="content" effect="light">
    <div class="ellipsis" @mouseover="onMouseOver">
      <span ref="textRef">{{ content }}</span>
    </div>
  </el-tooltip>
</template>

<script setup>
const props = defineProps({
  content: String
})

const isShowTooltip = ref(true)
const textRef = ref(null)

const onMouseOver = () => { // 内容超出，显示文字提示内容
  const tag = textRef.value
  const parentWidth = tag.parentNode.offsetWidth // 获取元素父级可视宽度
  const contentWidth = tag.offsetWidth // 获取元素可视宽度
  isShowTooltip.value = contentWidth <= parentWidth
}

</script>
<style lang="scss" scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>