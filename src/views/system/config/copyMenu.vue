<template>
  <!-- 引入 功能 -->
  <vxe-modal destroy-on-close v-model="copyConfig.modalVisible" :width="copyConfig.modalW" :height="copyConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer>
    <template #title>
      <span> 引入 </span>
    </template>
    <template #default v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="60px">
        <el-form-item label="菜单" prop="PK_MODULE">
          <el-tree-select v-model="form.PK_MODULE" :data="MenuList" :render-after-expand="false" :props="{ label: 'LABEL', children: 'CHILDREN' }" :filter-node-method="filterMethod" filterable value-key="VALUE" @change="getTabsList" style="width:100%" />
        </el-form-item>
        <el-form-item label="页面" prop="PAGE_TYPE">
          <el-select v-model="form.PAGE_TYPE" style="width:100%" @change="setGROUPNO">
            <el-option v-for="item in TabsList" :key="item.BILLNO_TYPE" :value="item.BILLNO_TYPE" :label="item.VNAME"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button size="default" @click="formSubmit"> 确定 </el-button>
    </template>
  </vxe-modal>
</template>

<script setup name=''>
import { MenuTabs, MenuTabsConfigDetail } from "#/system/config";
import { reactive, watch } from "@vue/runtime-core";
import PinyinMatch from "pinyin-match";

const props = defineProps({
  treeData: Array,
})
const emit = defineEmits(["submit"])

const loading = ref(false)

const formRef = ref(null)
const form = ref({
  PK_MODULE: "",
  PAGE_TYPE: "",
  PK_PAGE: "",
  GROUPNO: ""
})

const rules = reactive({
  PK_MODULE: [{ required: true, message: "菜单不可为空", trigger: "change" }],
  PAGE_TYPE: [{ required: true, message: "页面不可为空", trigger: "change" }]
})

const copyConfig = reactive({
  modalVisible: false,
  modalW: "40%",
  modalH: "40%",
})

watch(() => copyConfig.modalVisible, () => {
  form.value = {
    PK_MODULE: "",
    PAGE_TYPE: "",
    PK_PAGE: "",
    GROUPNO: ""
  }
  MenuList.value = props.treeData
})

const open = () => {
  copyConfig.modalVisible = true
}

const hide = () => {
  copyConfig.modalVisible = false
}

const MenuList = ref(props.treeData)
const TabsList = ref([])
const getTabsList = (value) => {
  form.value.PAGE_TYPE = ''
  MenuTabs(value).then((res) => {
    TabsList.value = res.RESULT.map(el => {
      el.BILLNO_TYPE = `${el.BILLNO}_${el.GROUPNO}`
      return el
    })
  });
};

const filterMethod = (value, data) => {
  if (!value) return true;
  return PinyinMatch.match(data.LABEL, value);
};

const setGROUPNO = value => {
  let arr = value.split("_")
  form.value.PK_PAGE = arr[0]
  form.value.GROUPNO = arr[1]
}

const formSubmit = () => {
  formRef.value.validate(valid => {
    if (!valid) return
    loading.value = true
    let { PK_MODULE, PK_PAGE, GROUPNO } = form.value
    MenuTabsConfigDetail({
      PK_MODULE,
      PK_PAGE,
      GROUPNO,
    }).then((res) => {
      loading.value = false
      emit("submit", res.RESULT.map(el => {
        el.BILLNO = ''
        el.PK_PAGE = ''
        el.PK_PARENT = ''
        el.CREATEDATE = ''
        el.CREATIONTIME = ''
        el.MODIFIEDTIME = ''
        el.MODIFIERID = ''
        el.MODIFIERNAME = ''
        return el
      }))
      setTimeout(() => {
        hide()
      }, 500)
    });
  })
};

// 主动暴露方法
defineExpose({ open, hide });
</script>

<style scoped>
</style>
