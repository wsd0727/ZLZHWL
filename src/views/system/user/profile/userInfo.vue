<template>
  <el-form ref="userRef" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="VNAME">
      <el-input v-model="user.VNAME" maxlength="30" />
    </el-form-item>
    <el-form-item label="手机号码" prop="MOBILE">
      <el-input v-model="user.MOBILE" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="EMAIL">
      <el-input v-model="user.EMAIL" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.VSEX">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <!-- <el-button type="danger" @click="close">关闭</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script setup>
import { updateUserProfile } from "@/api/system/user";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const userRef = ref(null);
const user = ref({});
const setUser = () => {
  user.value = JSON.parse(JSON.stringify(userInfo.value));
};
const { proxy } = getCurrentInstance();
const rules = ref({
  VNAME: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  EMAIL: [
    { required: true, message: "邮箱地址不能为空", trigger: "blur" },
    {
      type: "EMAIL",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  MOBILE: [
    { required: true, message: "手机号码不能为空", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

/** 提交按钮 */
function submit() {
  userRef.value.validate((valid) => {
    if (valid) {
      updateUserProfile(user.value).then((response) => {
        proxy.$modal.msgSuccess("修改成功");
        userStore.getInfo().then(() => {
            setUser();
          });
      });
    }
  });
}
/** 关闭按钮 */
function close() {
  proxy.$tab.closePage();
}

setUser();
</script>
<style lang="scss" scoped>
:deep(.el-input) {
  border: none;
  :deep(.el-textarea__inner) {
    box-shadow: 0 0 0 0px;
  }
  :deep(.el-textarea__inner:hover) {
    box-shadow: 0 0 0 0px;
  }
  :deep(.el-textarea__inner:focus) {
    box-shadow: 0 0 0 0px;
  }
}
</style>
