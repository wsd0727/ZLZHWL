<template>
  <el-form ref="pwdRef" :model="user" :rules="rules" label-width="100px">
    <!-- <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="user.oldPassword"
        placeholder="请输入旧密码"
        type="password"
        show-password
      />
    </el-form-item> -->
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="surePassword">
      <el-input v-model="user.surePassword" placeholder="请确认新密码" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="btnSubmit" @click="submit">保存</el-button>
      <!-- <el-button type="danger" @click="close">关闭</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script setup>
import { restUserPwd } from "@/api/system/user";
import { ElMessageBox } from "element-plus";
import useUserStore from "@/store/modules/user";
import { aesJmEncrypt } from "@/utils"
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const { proxy } = getCurrentInstance();
import md5 from "@/utils/md5";

const user = reactive({
  // oldPassword: undefined,
  newPassword: undefined,
  surePassword: undefined,
});

const equalToPassword = (rule, value, callback) => {
  if (user.newPassword !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
const rules = ref({
  // oldPassword: [{ required: true, message: "旧密码不能为空", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入必须满足8-16位且包含大小写字母、数字、特殊字符", trigger: "blur" },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-`=\[\];',.~!@#$%^&*()_+|{}:"?])[A-Za-z\d-`=\[\];',.~!@#$%^&*()_+|{}:"?]{8,16}$/, message: '请输入必须满足8-16位且包含大小写字母、数字、特殊字符', trigger: 'blur' }
  ],
  surePassword: [
    // { required: true, message: "确认密码不能为空", trigger: "blur" },
    { required: true, validator: equalToPassword, trigger: "blur" },
  ],
});
//退出登录
function logout() {
  ElMessageBox.confirm("修改密码成功！请重新登录", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = "/Login";
      });
    })
    .catch(() => { });
}
/** 提交按钮 */
function submit() {
  proxy.$refs.pwdRef.validate((valid) => {
    if (valid) {
      let data = {
        // OLDPASSWORD: user.oldPassword,
        NEWPASSWORD: md5.hex_md5(user.newPassword) ,
        SUREPASSWORD: md5.hex_md5(user.surePassword)  ,
        BILLNO: userInfo.value.USERID,
        USERNAMEz: userInfo.value.MOBILE,
        PID: aesJmEncrypt(user.newPassword)
      };
      restUserPwd(data).then((res) => {
        logout();
      });
    }
  });
}
/** 关闭按钮 */
function close() {
  proxy.$tab.closePage();
}
</script>
<style scoped>
:v-deep(.el-input) {
  width: 50% !important;
}
/* :v-deep(.el-form-item){
} */
:v-deep(.el-form-item__label) {
  font-size: 12px;
  font-weight: unset;
  color: #666;
}
.btnSubmit {
  position: relative;
  left: 20%;
}
</style>
