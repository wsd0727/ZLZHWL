<!--
 * @Author: cc2049
 * @Date: 2024-03-15 14:42:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-14 16:20:10
 * @Description: 运输规则打开规则的节点组件
-->

<template>
  <el-steps style="width:100%" :active="-1">
    <el-step :icon="Edit" v-for=" (item,index) in options " :key="item.id">
      <template #title>
        {{ item.title }}
      </template>
      <template #icon>
        <el-icon :size="40" :class="newForm[item.id]==1 ?'ischeck':'' " @click="handleIcon(item,index)">
          <CircleCheck />
        </el-icon>
      </template>
      <template #description>
        <template v-for="(itemCC,indexCC) in item.list " :key="indexCC">
          <el-checkbox v-if="newForm[itemCC.id] == '1' || meetConditions(newForm,itemCC)" :checked="true" :disabled="meetConditions(newForm,itemCC)" @change="handleCheck(false,itemCC.id , index ) ">{{itemCC.name}}</el-checkbox>
          <el-checkbox v-else :checked="false" @change=" handleCheck(true,itemCC.id , index) ">{{itemCC.name}} </el-checkbox>
        </template>
      </template>
    </el-step>
  </el-steps>

</template>

<script setup>
import { NestedRows } from "handsontable/plugins";

const props = defineProps({
  config: Object,
  formData: Object,
  detail: Boolean,
});
const emit = defineEmits(["update:formData"]);
const { proxy } = getCurrentInstance();
const newForm = ref({});
watch(
  () => props.formData,
  (val) => {
    newForm.value = val;
  },
  {
    immediate: true,
  }
);
watch(newForm, () => {
  change();
});

const handleIcon = (item, index) => {
  if (props.detail) return;
  options.value[index].ischeck = !options.value[index].ischeck;
  newForm.value[item.id] = options.value[index].ischeck ? "1" : "0";
};

const options = ref([]);
watch(
  () => props.config,
  (newValue) => {
    options.value = resetOptionArr(newValue);
    options.value.length && !props.formData.BILLNO
      ? resetFormByOption(options.value)
      : null;
  },
  {
    immediate: true,
  }
);

function resetFormByOption(newValue) {
  newValue.forEach((el) => {
    if (el.ischeck) {
      newForm.value[el.id] = 1;
    }
  });
}

function meetConditions(Data,config){
  if(!config.ischeck) return
  if(eval(config.ischeck)){
    return true
  }
  return false
}

function handleCheck(val, id, index) {
  newForm.value[id] = val ? '1' : '0' ;
  let pid = options.value[index].id;
  if (val) {
    newForm.value[pid] = 1;
  } else {
    if (options.value[index].list.length == 1) {
      newForm.value[pid] = 0;
    }
  }
  emit("update:formData", newForm.value);
}

function change() {
  emit("update:formData", newForm.value);
}

// 节点数据转换数组
function resetOptionArr(newValue) {
  try {
    let { OTHER } = newValue;
    let newData = JSON.parse(OTHER);
    return newData;
  } catch (error) {
    console.log("节点配置解析错误：", error);
    return [];
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-step__head.is-wait) {
  .ischeck {
    color: var(--el-color-primary) !important;
  }
}
.el-checkbox {
  display: block;
}
</style>
