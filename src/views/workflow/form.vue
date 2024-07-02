<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" @click="formSubmit">保存</el-button>
  </teleport>
  <el-scrollbar :height="scrollHeight">
    <div class="app-wrap">
      <Workflow ref="WorkflowRef" bindMenu="VCODE" :detail="formType == 'detail'" :data="form" />
    </div>
  </el-scrollbar>
</template>

<script setup>
import Workflow from "@/components/Workflow";
import { WFList, WFAdd, WFDetail } from "#/workflow";
const { proxy } = getCurrentInstance();
const scrollHeight = ref(window.innerHeight - 160 + 'px')

const props = defineProps({
  currentData: Object,
  config: Object
})
const emits = defineEmits(['close'])

const WorkflowRef = ref(null)

const form = ref({})
const resData = ref({})
const formType = ref("add")

const handleDetail = () => {
  const id = props.currentData.BILLNO;
  WFDetail(id).then((res) => {
    form.value = JSON.parse(res.RESULT.JSON);
    formType.value = "detail";
  });
};

const handleEdit = () => {
  const id = props.currentData[0].BILLNO;
  WFDetail(id).then((res) => {
    resData.value = res.RESULT
    form.value = JSON.parse(res.RESULT.JSON);
    formType.value = "edit";
  });
};

const formSubmit = () => {
  WorkflowRef.value.submit().then((res) => {
    if (res != false) {
      let data = res.value
      if (formType.value == 'edit') {
        data.BILLNO = resData.value.BILLNO
        data.ID = resData.value.ID
        data.VCODE = resData.value.BILLNO
      }
      WFAdd(data).then((res) => {
        proxy.$modal.msgSuccess(res.RESULT);
        emits("close")
      });
    }
  })
};

if (props.config.ACTION == 'EDIT') handleEdit()
if (props.config.ACTION == 'DTL') handleDetail()
</script>
<style lang="scss" scoped>
.app-wrap {
  height: v-bind(scrollHeight);
  position: relative;
  background: #fff;
  .page-fixe-bottom {
    position: fixed !important;
    z-index: 10;
    bottom: 10px;
    right: 30px !important;
    height: 34px !important;
  }
}
.group {
  padding: 8px;
  background: #fff;
  border-radius: 4px;
}
.mb6 {
  margin-bottom: 6px;
}
</style>