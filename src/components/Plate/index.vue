<template>
  <div class="plate">
    <el-input v-model.trim="carText" class="carNO" :disabled="disabled" clearable style="width: 100%">
      <template #prepend>
        <el-popover trigger="click" v-model:visible="ExCarNumShow" placement="bottom-start" width="200">
          <template #reference>
            <span class="el-dropdown-link">{{ carCh }}
              <el-icon>
                <ArrowDown />
              </el-icon>
            </span>
          </template>
          <el-row class="carNoBox">
            <el-col :span="4" v-for="item in carNo" :key="item.key" @click="setCarCh(item.label)" class="carNoBox-item">{{ item.label }}</el-col>
          </el-row>
        </el-popover>
      </template>
    </el-input>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  config: Object,
  disabled: Boolean
})
const emit = defineEmits(["update:modelValue"])
const carNo = ref([]);
const getCarNo = import("@/utils/carNo").then((res) => {
  carNo.value = res.default;
  if (carCh.value == "") carCh.value = res.default[0].label;
});

const carCh = ref("");
const carText = ref("")
watch(carText, () => {
  carText.value = carText.value.toUpperCase();
  emit("update:modelValue", carCh.value + carText.value)
})

watch(() => props.modelValue, val => {
  if (!val) return false
  carCh.value = val.substring(0, 1);
  carText.value = val.substring(1).toUpperCase();
}, {
  immediate: true
})

const ExCarNumShow = ref(false)
const setCarCh = val => {
  if (props.disabled) return false
  carCh.value = val;
  ExCarNumShow.value = false
  emit("update:modelValue", carCh.value + carText.value)
};
</script>
<style lang="scss" scoped>
.plate {
  width: 100%;
  :deep(.el-input-group__prepend) {
    padding: 0 7px !important;
  }
}
.carNoBox {
  width: 200px;
  &-item {
    text-align: center;
    padding: 3px;
    font-size: 14px;
    &:hover {
      cursor: pointer;
      color: #fff;
      background: var(--el-color-primary);
    }
  }
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>