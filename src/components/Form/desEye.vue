<template>
  <el-icon @click="PlainClick()">
    <View v-if="ShowPlain" />
    <Hide v-else />
  </el-icon>
</template>

<script setup>
import useFormHook from "./form.hook"
const props = defineProps({
  config: Object,
  value: String
})
const { proxy } = getCurrentInstance()
const emit = defineEmits(["click"])
const { ParseOtherConfig } = useFormHook()

// 脱敏
const ShowPlain = ref(false)
const PlainClick = () => {
  if (ShowPlain.value) return false
  const { data } = ParseOtherConfig(props.config.OTHER)
  const PlainClickCallback = {
    id: props.config.FIELD,
    value: props.value,
    config: props.config,
    data: {
      COLUMN: props.config.FIELD,
      ...data,
    },
    target: () => {
      ShowPlain.value = !ShowPlain.value
    }
  }
  emit("click", PlainClickCallback)
}
</script>
<style lang="scss" scoped>
</style>