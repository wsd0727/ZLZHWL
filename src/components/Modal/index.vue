<template>
  <vxe-modal
    destroy-on-close
    v-model="props.modalVisible"
    :width="modalConfig.modalW || '60%'"
    :height="modalConfig.modalH || '50%'"
    id="formModal"
    resize
    storage
    transfer
    show-zoom
    show-footer
    @close="closeModal"
  >
    <template #title>
      <span> {{ modalConfig.modelTitle }} </span>
    </template>
    <template #default>
      <Form
        ref="formRef"
        v-model:formData="modalConfig.formValue"
        :formConfig="modalConfig.formColumns"
        :rules="modalConfig.formRules"
      >
      </Form>
    </template>
    <template #footer>
      <el-button size="default" type="primary" @click="formSubmit">
        确定
      </el-button>
    </template>
  </vxe-modal>
</template>

<script setup name="">
const { proxy } = getCurrentInstance();

const props = defineProps({
  modalVisible: Boolean,
  modalConfig: Object,
});

const { modalVisible, modalConfig } = props;

const closeModal = () => {
  proxy.$emit("closeModal");
};

const formRef = ref();

const formSubmit = () => {
  formRef.value.submitForm().then((valid) => {
    if (!valid) return;
    proxy.$emit("modalSubmit");
  });
};

</script>

<style scoped></style>
