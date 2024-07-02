<template>
  <div class="custom-qeury">

    <el-select v-model="customFormOne.QUERYFIELD" class="m-2" placeholder="请选择" size="defalut">
      <el-option v-for="item in queryConfig" :key="item.FIELD" :label="item.LABEL" :value="item.FIELD" />
    </el-select>
    <el-select v-model="customFormOne.QUERYTYPE" class="m-2" placeholder="请选择" size="defalut">
      <el-option v-for="item in conditionOption" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
    </el-select>

    <el-input v-model="customFormOne.QUERYVALUE" placeholder="请输入" class="m-3" size="defalut">
      <template #append>
        <div class="custom-icon" @click="setShowPull">
          <el-icon >
            <ArrowDownBold />
          </el-icon>
        </div>

      </template>
    </el-input>

    <vxe-pulldown ref="pulldownRef" class="more-wrap">
      <template #dropdown>
        <div class="my-dropdown1">
          <div class="more-item mb-10" v-for="(item,index) in queryList" :key="index">

            <vxe-select v-model="item.QUERYFIELD" placeholder="请选择" class-name="m-2" size="small">
              <vxe-option v-for="num in queryConfig" :key="num.BILLNO" :value="num.FIELD" :label="num.LABEL"></vxe-option>
            </vxe-select>

            <vxe-select v-model="item.QUERYTYPE" placeholder="请选择" class-name="m-2" size="small">
              <vxe-option v-for="num in conditionOption" :key="num.BILLNO" :value="num.VALUE" :label="num.LABEL"></vxe-option>
            </vxe-select>

            <vxe-input v-model="item.QUERYVALUE" placeholder="请输入" size="small"></vxe-input>
            <el-icon @click="pushItem" :size="20" class="add-icon">
              <CirclePlus />
            </el-icon>
            <el-icon @click="removeItem(index) " :size="20">
              <Remove />
            </el-icon>
          </div>
        </div>
      </template>
    </vxe-pulldown>

  </div>

</template>

<script setup>
import { getDicts } from "@/api/system/dict.js";

const props = defineProps({
  queryConfig: Array,
  modelValue: Array,
  customFormOne: Object,
  customForm: {
    type: Array,
  },
});

const emit = defineEmits(["update:modelValue"]);

const selectOption = computed(() => {
  return () => {};
});

const queryList = ref([
  {
    QUERYFIELD: "",
    QUERYTYPE: "",
    QUERYVALUE: "",
    QUERYPREFIX: "", // 前缀
    QUERYSUFFIX: "", // 后缀
    QUERYAND: "", // 括号
  },
]);

const oneQuery = {
  QUERYFIELD: "",
  QUERYTYPE: "",
  QUERYVALUE: "",
  QUERYPREFIX: "", // 前缀
  QUERYSUFFIX: "", // 后缀
  QUERYAND: "", // 括号
};

onMounted(() => {
  queryList.value = props.modelValue;
});

const conditionOption = ref([]);

const pulldownRef = ref(null);
function setShowPull() {
  const $pulldown = pulldownRef.value;
  if ($pulldown) {
    $pulldown.showPanel();
  }
}

function pushItem() {
  let copyItem = JSON.parse(JSON.stringify(oneQuery));
  queryList.value.push(copyItem);
  emit("update:modelValue", queryList.value);
}

function removeItem(index) {
  queryList.value.splice(index, 1);
  emit("update:modelValue", queryList.value);
}

// 通过指定类型获取字典配置
const getDict2Type = (dictType) => {
  getDicts(dictType).then((res) => {
    conditionOption.value = res.RESULT;
  });
};

getDict2Type("QueryType");
</script>

<style lang="scss" scoped>
.custom-qeury {
  display: flex;
  position: relative;
  .m-2 {
    width: 150px;
    margin-right: 10px;
  }
  .m-3 {
    width: 250px;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .more-wrap {
    position: absolute;
    left: 0;
    top: 30px;
  }

  .my-dropdown1 {
    width: 570px;
    height: 200px;
    overflow: auto;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    .m-2 {
      width: 150px;
    }
    .m-3 {
      width: 200px;
    }
    .more-item {
      .el-icon {
        top: 7px;
        left: 8px;
      }
    }
  }
  .list-item1:hover {
    background-color: #f5f7fa;
  }

  .custom-icon{
    width: 50px;
    height: 30px;
    text-align: center;
    cursor: pointer;
  }

  :deep(.el-input-group__append, .el-input-group__prepend){
    padding: 0;
  }

}
</style>