// 现场调度-订单配载
<template>
  <teleport to="#custemPageBtn" :disabled="!step==1">
    <el-button type="primary" v-if="step > 1" size="default" @click="prevStep">上一步</el-button>
  </teleport>
  <teleport to="#custemPageBtn" :disabled="!step==2">
    <el-button type="primary" v-if="step == 1" size="default" @click="nextStep">下一步</el-button>
    <el-button type="primary" v-if="step==2" size="default" @click="submit">提交</el-button>
  </teleport>
  <div class="app-wrap">
    <keep-alive>
      <el-scrollbar :height="scrollHeight">
        <template v-if="step == 2">
          <Form ref="FormRef" :detail="modelForm.hashtinfo" v-model:formData="modelForm" :formConfig="htConfig" :rules="htformRules"></Form>
        </template>
        <template v-else>
          <MasterForm ref="MasterFormRef" :loading="false" :detail="false" v-model:formData="modelForm" :formConfig="formConfig" :tableConfig="tableConfig" :formRules="formRules" :othConfig="{}" >
            <template #modalBtnAfter>
              <el-link class="btn-item icon-delete" type="primary" v-if="modelForm.SUBLIST && modelForm.SUBLIST.length > 1" @click="syncSubList">同步</el-link>
            </template>
          </MasterForm>
        </template>
      </el-scrollbar>
    </keep-alive>
  </div>
</template>

<script setup>
import MasterForm from "@/components/MasterForm";
import Form from "@/components/Form";
import miniTable from "@/components/Tables/mini";
import { getFormValue, getFormRule } from "@/utils";
import { getOrderInfo, savePz, checkChejia, formConfig, tableConfig, htConfig } from "@/api/JDWL/Order/spotdispatch";

const props = defineProps({
  currentData: String,
  config: Object,
})
const emits = defineEmits(['close'])
const { proxy } = getCurrentInstance();
const FormRef = ref(null)
const MasterFormRef = ref(null)
const scrollHeight = ref(window.innerHeight - 160 + 'px')

const pageList = reactive(["1", "2"])
const step = ref(1)
const prevStep = () => {
  if (step.value == 1) return
  step.value -= 1
}
const nextStep = () => {
  MasterFormRef.value.submitForm().then(valid => {
    if (!valid) return
    checkChejia(modelForm.value).then(res => {
      modelForm.value = res.RESULT
      if (modelForm.value.LIMIT_PRICE == 1) proxy.$modal.alertWarning("发车价格超出一类车价，如需配载，请记得提交超价申请！")
      step.value += 1
    })
  })
}

const modelForm = ref({})
const syncSubList = () => {
  const val = modelForm.value.SUBLIST[0]
  if (!val) return
  modelForm.value.SUBLIST.forEach(el => {
    el.PKDESTINATION = val.PKDESTINATION
    el.DESTINATION = val.DESTINATION
    el.RIGTAXPRICE = val.RIGTAXPRICE
    el.RIGTAXMGY = el.NNUM * el.RIGTAXPRICE
  });
}

const formRules = ref(getFormRule(formConfig))
const htformRules = ref(getFormRule(htConfig))

const getData = () => {
  getOrderInfo({
    BILLNO: props.currentData[0].BILLNO
  }).then(res => {
    // Object.assign(modelForm.value, res.RESULT)
    modelForm.value = { ...getFormValue(formConfig), ...res.RESULT }
    modelForm.value.BILLNO = props.currentData[0].BILLNO
  })
}

const submit = () => {
  FormRef.value.submitForm().then(valid => {
    modelForm.value.BILLNO = props.currentData[0].BILLNO
    savePz(modelForm.value).then(res => {
      proxy.$modal.msgSuccess("配载成功");
      emits("close")
    })
  })
}

getData()
</script>
<style lang="scss" scoped>
.app-wrap {
  background: #fff;
  height: v-bind(scrollHeight);
  padding: 10px;
  box-sizing: border-box;
}
</style>