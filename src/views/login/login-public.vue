<template>
  <div class="login" :style="{ backgroundImage: `url(${commonBg})` }">
    <!-- <div class="login"> -->

    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form" :validate-on-rule-change="false">
      <div class="title">{{ systemName || "" }}</div>

      <!-- <div class="type-switch">
        <el-tabs v-model="loginType" class="demo-tabs">
          <el-tab-pane label="账号登录" name="admin"></el-tab-pane>
          <el-tab-pane label="手机登录" name="phone"></el-tab-pane>
        </el-tabs>
      </div> -->

      <div class="login-header">
        <div class="left">欢迎使用</div>
        <div class="right" @click="forgotPassword" v-if="!LoginConfigs || LoginConfigs?.isResetPassword == 1">忘记密码</div>
      </div>

      <template v-if="loginType == 'admin'">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="账号"
            class="inputDeep" clearable>
            <template #prefix>
              <svg-icon icon-class="user" class="el-input__icon input-icon" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off" placeholder="密码"
            show-password class="inputDeep" @keyup.enter="handleLogin">
            <template #prefix>
              <svg-icon icon-class="password" class="el-input__icon input-icon" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="code" v-if="captchaEnabled">
          <el-input v-model="loginForm.code" size="large" auto-complete="off" placeholder="验证码" style="width: 63%"
            class="inputDeep" @keyup.enter="handleLogin">
            <template #prefix>
              <svg-icon icon-class="validCode" class="el-input__icon input-icon" />
            </template>
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img" />
          </div>
        </el-form-item>
        <!-- <div class="flex-row-bet" style="margin: 0px 0px 25px 0px">
          <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
          <vxe-button
            v-if="systemConfig?.isForgotPassword"
            type="text"
            @click="forgotPassword"
            content="忘记密码"
          ></vxe-button>
        </div> -->
      </template>

      <template v-else>
        <el-form-item prop="mobile">
          <el-input v-model.number="loginForm.mobile" type="number" size="large" auto-complete="off" placeholder="手机号"
            clearable class="inputDeep" :prefix-icon="Iphone">
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input v-model="loginForm.code" type="text" size="large" auto-complete="off" placeholder="验证码" clearable
            :maxlength="11" :prefix-icon="Lock" class="input-with-select inputDeep">
            <template #append>
              <el-button @click="getTelCode" type="primary" :disabled="telCode != '获取验证码' ? true : false" link>
                {{ telCode }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </template>

      <el-form-item style="width: 100%; margin-top: 50px" :class="loginType == 'admin' ? '' : 'mt20'">
        <el-button :loading="loading" size="large" :type="loginForm.password ? 'primary' : 'info'" round
          style="width: 100%" @click.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <!-- <div style="float: right" v-if="register">
              <router-link class="link-type" :to="'/register'"
                >立即注册</router-link
              >
            </div> -->
      </el-form-item>

      <div class="app-wrap">
        <div class="left">

          <template v-if="systemConfig?.systemCode == 'ZLZHWL'">
            <div v-for="item in zlappList" :key="item.name">
              <el-popover placement="top-start" :width="200" trigger="hover">
                <template #reference>
                  <div class="">
                    <div class="app-img">
                      <img :src="item.icon" alt="" srcset="" />
                    </div>
                    <div style="color: #666;">{{ item.name }}</div>
                  </div>
                </template>
                <template #default>
                  <!-- <img src="@/assets/images/ZLZHWL/LA_CY.png" alt="" style="width: 100%;"> -->
                  <img :src="item.imgs" alt="" style="width: 100%;">
                </template>
              </el-popover>
            </div>
          </template>
          <template v-else>

            <template v-for="item in appList" :key="item.name">
              <div class="app-img"
                v-if="!LoginConfigs || (item.name == '苹果' && LoginConfigs?.isIosIcon == 1) || (item.name == '安卓' && LoginConfigs?.isAndroidIcon == 1) || (item.name == '小程序' && LoginConfigs?.isWxIcon == 1)">
                <img :src="item.icon" alt="" srcset="" />
              </div>
            </template>
            <!-- <div class="app-img" v-for="item in appList" :key="item.name">
              <img :src="item.icon" alt="" srcset="" />
            </div> -->
          </template>
        </div>
        <!-- <div class="right">验证码登录</div> -->
      </div>

      <div class="term-wrap">
        <!-- <el-icon><CircleCheck /></el-icon> -->
        <el-icon color="#0c64eb">
          <SuccessFilled />
        </el-icon>
        同意
        <text class="text-blue" @click="showClause(1)">《服务条款》</text>
        与
        <text class="text-blue" @click="showClause(2)">《隐私条款》</text>

      </div>

    </el-form>

    <!-- <div class="footer text-center" >
          <div
            class="down-wrap flex-row-bet"
            v-if="systemConfig?.systemCode != 'ETEAM'"
          >
            <div class="down-item" v-for="item in qrcode" :key="item">
              <img :src="item.img" alt="" srcset="" />
              <div class="text-muted">{{ item.title }}</div>
            </div>
          </div>
          <div class="tel mt10">
            服务专线：<span class="text-danger text-blod text-ll">
              400-9966-241
            </span>
          </div>
        </div> -->

    <!-- <div class="eos-logo">
      <img :src="eoslogo" alt="" />
    </div> -->

    <!--  底部  -->
    <div class="el-login-footer" v-if="systemConfig?.systemCode == 'ZLZHWL'">
      <!-- <span
        >Copyright © 2005 - {{ Year }} EOSINE Software Technology Company
        Limited all rights reserved.</span
      > -->
      <span class="cp" @click="clickBei">蒙ICP备2023003855号-1</span>
      <span class="cp" @click="showImage = true"> 增值电信业务经营许可证：蒙B2-20230621</span>
    </div>

    <vxe-modal destroy-on-close v-model="modalConfig.open" :width="modalConfig.width" :height="modalConfig.height"
      id="formModal" resize storage transfer show-zoom show-footer>
      <template #title>
        <span class="modal-title">密码过于简单，请重置密码</span>
      </template>
      <Form ref="resetPasswordRef" v-model:formData="resetPasswords" :formConfig="formConfig" :rules="rules"
        :detail="formType == 'detail'">
      </Form>
      <div class="passMes">
        请输入必须满足8-16位且包含大小写字母、数字、特殊字符！
      </div>

      <template #footer>
        <el-button type="primary" @click="resetPasswordBtn">确 定</el-button>
        <el-button @click="cancelPasswordReset">取 消</el-button>
      </template>
    </vxe-modal>

    <vxe-modal destroy-on-close v-model="modalForgotPassword.open" :width="modalForgotPassword.width"
      @close="cancelForgotPassword" :height="modalForgotPassword.height" id="formModal" resize storage transfer
      show-zoom show-footer>
      <template #title>
        <span class="modal-title">忘记密码</span>
      </template>
      <el-form ref="forgotPasswordRef" :model="forgotPasswordForm" :rules="forgotPasswordRules" label-position="right"
        label-width="auto">
        <el-form-item prop="MOBILE" label="手机号">
          <el-input v-model.number="forgotPasswordForm.MOBILE" type="number" autocomplete="off" placeholder="请输入手机号"
            clearable :prefix-icon="Iphone">
          </el-input>
        </el-form-item>
        <el-form-item prop="CODE" label="验证码">
          <el-input v-model="forgotPasswordForm.CODE" type="text" auto-complete="off" placeholder="请输入验证码" clearable
            :maxlength="11" :prefix-icon="Lock">
            <template #append>
              <span class="" @click="getTelCodeProp" disabled>
                {{ telCode }}
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="NEWPASSWORD" label="新密码">
          <el-input v-model="forgotPasswordForm.NEWPASSWORD" placeholder="请输入新密码" type="password"
            autocomplete="new-password" show-password>
          </el-input>
        </el-form-item>
        <el-form-item prop="SUREPASSWORD" label="确认密码">
          <el-input v-model="forgotPasswordForm.SUREPASSWORD" placeholder="请确认密码" type="password"
            autocomplete="new-password" show-password>
          </el-input>
        </el-form-item>
        <div class="passMes">
          请输入必须满足8-16位且包含大小写字母、数字、特殊字符
        </div>
      </el-form>
      <template #footer>
        <el-button type="primary" :loading="confirmForgotPasswordLoading" @click="confirmForgotPassword">确 定</el-button>
        <el-button :loading="confirmForgotPasswordLoading" @click="cancelForgotPassword">取 消</el-button>
      </template>
    </vxe-modal>

    <vxe-modal destroy-on-close v-model="showClauseModel" width="60%" height="60%" resize id="showClauseContentId"
      storage transfer show-zoom show-footer>
      <template #title>
        <span class="modal-title">{{ showClauseContent.TITLE }}</span>
      </template>
      <div v-html="showClauseContent.CONTENT"></div>
    </vxe-modal>

    <vxe-modal destroy-on-close v-model="showImage" width="40%" height="90%" resize id="showClauseContentId" storage
      transfer show-zoom show-footer title=" ">
      <!-- <template #title>
        <span class="modal-title">{{showClauseContent.TITLE}}</span>
      </template> -->
      <div style="height: 100%;" class="flex-row-cen">
        <img src="@/assets/img/login/zlTelecom.jpg" alt="" style="height: 100%;">
      </div>
      <!-- zlTelecom.jpg -->
    </vxe-modal>

  </div>
</template>

<script setup>
import {
  getCodeImg,
  getNoteCode,
  FormConfig,
  ForgotPasswordConfig,
  updatePwd,
  sendSmsCode,
  forgotPwd,
} from "@/api/login";
import { getPageConfig, getTableData, axiosSave } from "@/api/system/page";

import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from "@/store/modules/user";
import usePermissionStore from "@/store/modules/permission";
import useSettingsStore from "@/store/modules/settings";
import { getUserConfig } from "#/common";
import { handleThemeStyle } from "@/utils/theme";
import { getFormValue, getFormRule, aesJmEncrypt } from "@/utils";
import md5 from "@/utils/md5";
import { debounce } from 'lodash-es'

import {
  HelpFilled,
  Delete,
  Edit,
  Message,
  Search,
  Star,
  Filter,
  Iphone,
  Lock,
} from "@element-plus/icons-vue";
const permissionStore = usePermissionStore();
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
const Year = new Date().getFullYear();
const BannerHeight = window.innerHeight - 30 + "px";
const systemConfig = computed(() => settingsStore.systemConfig);
const LoginConfigs = computed(() => systemConfig.value && systemConfig.value.LoginConfig ? JSON.parse(systemConfig?.value.LoginConfig) : null);


const telCode = ref("获取验证码");
const confirmForgotPasswordLoading = ref(false);

// const rules = {};
const data = reactive({
  formConfig: [],
  rules: {},
  baseForm: {},
  resetPasswords: {},

  forgotPasswordConfig: [],
  forgotPasswordForm: {},
});
const {
  formConfig,
  rules,
  baseForm,
  resetPasswords,
  forgotPasswordConfig,
  forgotPasswordForm,
} = toRefs(data);

// const { formConfig, rules } = toRefs(data);
const modalConfig = reactive({
  type: "",
  open: false,
  title: "",
  MENUID: "",
  PAGEID: "",
  width: "40%",
  height: "40%",
});
const modalForgotPassword = reactive({
  type: "",
  open: false,
  title: "",
  MENUID: "",
  PAGEID: "",
  width: "40%",
  height: "50%",
});

// import WZCBG from "@/assets/img/login/bg.png"
// import ZLZHWLBG from "@/assets/img/login/zlbg.png"
// const commonBg =  systemConfig.value?.systemCode == 'ZLZHWL'?proxy.getAssetsFile("./../../assets/img/login/zlbg.jpg"):proxy.getAssetsFile("./../../assets/img/login/bg.png")
const showImage = ref(false);

const commonBg = computed(() =>
  systemConfig.value?.systemCode == "ZLZHWL"
    ? proxy.getAssetsFile("login/zlbg.jpg")
    : proxy.getAssetsFile("login/bg.png")
);

const appList = ref([
  { icon: proxy.getAssetsFile("login/ios.png"), name: "苹果", type: "1" },
  { icon: proxy.getAssetsFile("login/az.png"), name: "安卓", type: "1" },
  { icon: proxy.getAssetsFile("login/we.png"), name: "小程序", type: "1" },
]);
const zlappList = ref([
  // { icon: proxy.getAssetsFile("login/ios.png"), name: "苹果", type: "1" },
  {
    icon: proxy.getAssetsFile("login/az.png"),
    name: "安卓",
    type: "1",
    imgs: proxy.getAssetsFile("login/lasiji.png"),
  },
  // { icon: proxy.getAssetsFile("login/az.png"), name: "货主端", type: "1" ,imgs:proxy.getAssetsFile("login/lahz.png")},
  // { icon: proxy.getAssetsFile("login/we.png"), name: "小程序", type: "1" },
]);

const autoLoginParams = router.currentRoute.value.query;

const resetPasswordConfirmation = (rule, value, callback) => {
  if (resetPasswords.value.NEWPASSWORD !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const initForm = () => {
  formConfig.value = FormConfig;
  let formData = getFormValue(FormConfig);
  baseForm.value = formData;
  resetPasswords.value = formData;
  resetPasswords.value.USERNAME = loginForm.value.username;
  rules.value = getFormRule(FormConfig);
  // 增加确认密码和新密码是否一致的校验
  rules.value.SUREPASSWORD.push({
    validator: resetPasswordConfirmation,
    trigger: "blur",
  });

  modalConfig.modalW = "40%";
  modalConfig.modalH = "50%";
  modalConfig.open = userStore.showUpdatePassword;
  loading.value = false;
};
const resetPasswordRef = ref();

function resetPasswordBtn() {
  resetPasswordRef.value.submitForm().then((valid) => {
    if (!valid) return;
    let data = {
      USERNAME: resetPasswords.value.USERNAME,
      NEWPASSWORD: md5.hex_md5(resetPasswords.value.NEWPASSWORD),
      SUREPASSWORD: md5.hex_md5(resetPasswords.value.SUREPASSWORD),
    };
    updatePwd(data).then(() => {
      proxy.$modal.msgSuccess("修改成功，请登录~");
      modalConfig.open = false;
    });
  });
}
function cancelPasswordReset() {
  resetPasswordRef.value.resetForm();
  modalConfig.open = false;
  resetPasswords.value = {};
}

const equalToPassword = (rule, value, callback) => {
  if (forgotPasswordForm.value.NEWPASSWORD !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const clickBei = () => {
  window.open("https://beian.miit.gov.cn");
};

const forgotPasswordRules = reactive({
  CODE: [{ required: true, trigger: "blur", message: "请输入验证码" }],
  MOBILE: [
    { required: true, trigger: "blur", message: "请输入正确的手机号" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号码格式不正确",
      trigger: "blur",
    },
  ],
  NEWPASSWORD: [
    { required: true, trigger: "blur", message: "请输入密码" },
    {
      pattern:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-`=\[\];',.~!@#$%^&*()_+|{}:"?])[A-Za-z\d-`=\[\];',.~!@#$%^&*()_+|{}:"?]{8,16}$/,
      message: "请输入必须满足8-16位且包含大小写字母、数字、特殊字符",
      trigger: "blur",
    },
  ],
  SUREPASSWORD: [
    { required: true, trigger: "blur", message: "请确认密码" },
    { required: true, validator: equalToPassword, trigger: "blur" },
    {
      pattern:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-`=\[\];',.~!@#$%^&*()_+|{}:"?])[A-Za-z\d-`=\[\];',.~!@#$%^&*()_+|{}:"?]{8,16}$/,
      message: "请输入必须满足8-16位且包含大小写字母、数字、特殊字符",
      trigger: "blur",
    },
  ],
});
function forgotPassword() {
  // forgotPasswordConfig.value = ForgotPasswordConfig
  // forgotPasswordRules.value = getFormRule(ForgotPasswordConfig);
  // let formData = getFormValue(ForgotPasswordConfig);
  // // baseForm.value = formData;
  // forgotPasswordForm.value = formData;

  modalForgotPassword.open = true;
}

const forgotPasswordRef = ref();

let countdownProp = 60;
const forbidClick = ref(false)
// function getTelCodeProp() {
//   if (countdownProp < 60) return;
//   if (countdownProp == 60 && forgotPasswordForm.value.MOBILE) {
//     if(forbidClick.value) return
//     forbidClick.value = true
//     let data = { MOBILE: forgotPasswordForm.value.MOBILE };
//     sendSmsCode(data)
//       .then(() => {
//         forbidClick.value = false
//         // 手机验证码60s倒计时
//         let timer = setInterval(() => {
//           countdownProp -= 1;
//           telCode.value = countdownProp + "S后重试";
//           if (countdownProp === 0) {
//             clearInterval(timer);
//             countdownProp = 60;
//             telCode.value = "获取验证码";
//           }
//         }, 1000);
//       })
//       .catch((err) => {
//         console.log(err);
//         forbidClick.value = false
//       });
//   } else {
//     proxy.$modal.msgError("请输入手机号~");
//   }
// }
let timers = null
const getTelCodeProp = debounce(() => {
  if (countdownProp < 60) return;
  if (countdownProp == 60 && forgotPasswordForm.value.MOBILE) {
    let data = { MOBILE: forgotPasswordForm.value.MOBILE };
    sendSmsCode(data)
      .then(() => {
        // 手机验证码60s倒计时
        timers = setInterval(() => {
          countdownProp -= 1;
          telCode.value = countdownProp + "S后重试";
          if (countdownProp === 0) {
            clearInterval(timers);
            countdownProp = 60;
            telCode.value = "获取验证码";
          }
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    proxy.$modal.msgError("请输入手机号~");
  }
}, 300)



function confirmForgotPassword() {
  proxy.$refs.forgotPasswordRef.validate((valid) => {
    if (valid) {
      confirmForgotPasswordLoading.value = true;
      let data = {
        MOBILE: forgotPasswordForm.value.MOBILE,
        CODE: forgotPasswordForm.value.CODE,
        NEWPASSWORD: md5.hex_md5(forgotPasswordForm.value.NEWPASSWORD),
        SUREPASSWORD: md5.hex_md5(forgotPasswordForm.value.SUREPASSWORD),
        PID: aesJmEncrypt(forgotPasswordForm.value.NEWPASSWORD),
      };
      forgotPwd(data)
        .then(() => {
          proxy.$modal.msgSuccess("修改成功，请登录~");
          modalForgotPassword.open = false;
          confirmForgotPasswordLoading.value = false;
        })
        .catch((err) => {
          confirmForgotPasswordLoading.value = false;
        });
    }
  });
}
function cancelForgotPassword() {
  forgotPasswordForm.value = {};
  modalForgotPassword.open = false;
  telCode.value = "获取验证码";
  countdownProp = 60;
  clearInterval(timers);
  proxy.$refs.forgotPasswordRef ? proxy.$refs.forgotPasswordRef.resetFields() : '';
}

// 切换系统名称
const systemName = ref("");

// 初始系统标题
setTimeout(() => {
  if (systemConfig.value && systemConfig.value.title) {
    systemName.value = systemConfig.value.title;
  }
}, 500);

const leftBanner = proxy.getAssetsFile("left-pic.png");

const banners = [
  {
    img: proxy.getAssetsFile("left-pic.png"),
    title: "",
    desc: "",
  },
  // {
  //   img: proxy.getAssetsFile("ams1.png"),
  //   title: "远程管理——AMS",
  //   desc: "管理优化，提升效率",
  // },
  // {
  //   img: proxy.getAssetsFile("oms1.png"),
  //   title: "订单管理——OMS",
  //   desc: "订单全方位管理，全网多终端协作",
  // },
  // {
  //   img: proxy.getAssetsFile("tms1.png"),
  //   title: "运输管理——TMS",
  //   desc: "智能计划调度，运输全程监管",
  // },
];
const eoslogo = proxy.getAssetsFile("logo_eos.png");
const qrcode = [
  { img: proxy.getAssetsFile("and.png"), title: "扫码下载安卓版" },
  { img: proxy.getAssetsFile("ios.png"), title: "扫码下载苹果版" },
  { img: proxy.getAssetsFile("wechat.jpg"), title: "微信扫码小程序" },
];

const loginForm = ref({
  username: "",
  password: "",
  APASSWORD: "",
  rememberMe: false,
  code: "",
  uuid: "",
  mobile: "",
  LOGINTYPE: "captcha",
});

// 手机号正则校验
const checkMobile = (rule, value, callback) => {
  const regMobile = /^[1][3,4,5,7,8,9][0-9]{9}$/;
  if (!value) {
    return callback(new Error("请输入手机！"));
  }
  if (!regMobile.test(value)) {
    callback(new Error("您输入手机格式错误！"));
  }
};

const loginRules = reactive({
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }],
  mobile: [
    { required: true, trigger: "blur", message: "请输入正确的手机号" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号码格式不正确",
      trigger: "blur",
    },
  ],
});

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(false);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);

const loginType = ref("admin");

let countdown = 60;

// // 密码失去焦点是校验如果不符合复杂度校验 就给弹出弹框让修改密码
// function passwordBlur(e){
//   let checkoutPass = loginForm.value.password.replace(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,null)
//   if(checkoutPass){   // checkoutPass有值代表校验不通过

//   }
// }
const showClauseModel = ref(false);
const showClauseContent = ref({});
const showClause = (e) => {
  let VTYPE = 3;
  if (e == 1) {
    VTYPE = 3;
  } else {
    VTYPE = 4;
  }
  getTableData("/sys/notice/getDataByType", {
    VTYPE: VTYPE,
  }).then((res) => {
    showClauseModel.value = true;
    showClauseContent.value = res.RESULT;
  });
};

function handleLogin() {
  loginRules.code[0].required = true;

  loginForm.value.LOGINTYPE =
    loginType.value == "admin" ? "captcha" : "sms_code";

  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      loading.value = true;
      loginForm.value.APASSWORD = loginForm.value.password;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.value.password), {
          expires: 30,
        });
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      userStore
        .login(loginForm.value)
        .then(() => {
          getUserThemeConfig();
          router.push({ path: redirect.value || "/" });
        })
        .catch((err) => {
          initForm();
          if (err.RESULT?.ENABLEVERIFICAT == 1) {
            captchaEnabled.value = true;
            getCode();
          }
          loading.value = false;
        });
    }
  });
}

function getTelCode() {
  loginRules.code[0].required = false;
  if (countdown < 60) return;
  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      let data = { MOBILE: loginForm.value.mobile };
      getNoteCode(data).then(() => {
        //手机验证码60s倒计时
        let timer = setInterval(() => {
          countdown -= 1;
          telCode.value = countdown + "S后重试";
          if (countdown === 0) {
            clearInterval(timer);
            countdown = 60;
            telCode.value = "获取验证码";
          }
        }, 1000);
      });
    }
  });
}

function getCode() {
  getCodeImg().then((res) => {
    let { IMG, UUID } = res.RESULT;
    codeUrl.value = "data:image/gif;base64," + IMG;
    loginForm.value.uuid = UUID;
  });
}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password:
      password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
  };
}

const getUserThemeConfig = () => {
  getUserConfig().then((res) => {
    try {
      let {
        topNav,
        tagsView,
        fixedHeader,
        sidebarLogo,
        dynamicTitle,
        sideTheme,
        menuStyle,
        theme,
      } = JSON.parse(res.RESULT);
      localStorage.setItem("layout-setting", res.RESULT);
      settingsStore.changeSetting({ key: "sideTheme", value: sideTheme });
      settingsStore.changeSetting({ key: "theme", value: theme });
      handleThemeStyle(theme);
      settingsStore.changeSetting({ key: "topNav", value: topNav });
      settingsStore.changeSetting({ key: "tagsView", value: tagsView });
      settingsStore.changeSetting({ key: "fixedHeader", value: fixedHeader });
      settingsStore.changeSetting({ key: "sidebarLogo", value: sidebarLogo });
      settingsStore.changeSetting({ key: "dynamicTitle", value: dynamicTitle });
      settingsStore.changeSetting({ key: "menuStyle", value: menuStyle });
    } catch (error) {
      console.log('解析个性化配置错误：', error);
    }
  });
};

// 自动登录功能
onMounted(() => {
  if (autoLoginParams.Act && proxy.$refs.loginRef) {
    loginForm.value.username = autoLoginParams.Act;
    loginForm.value.password = autoLoginParams.Pwd;
    loginForm.value.isMd5 = true;
    // ce00580d6b3d1e0d7b7b8ec5eab0bc89
    handleLogin();
  }
});

// getCode();
getCookie();
// initForm()
</script>

<style lang="scss">
.login {
  input {
    box-shadow: 0 0 0px 1000px white inset !important;
  }
}
</style>
<style lang="scss" scoped>
.login {
  // height: 100%;
  // min-height: 600px;
  width: 100vw;
  height: 100vh;
  // background-image: url("./../../assets/img/login/bg.png");
  background-image: url("./../../assets/img/login/zlbg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;

  .left-banner {
    width: 100%;
    height: 100vh;
    overflow: hidden;

    // background-image: url('/img/left-pic.png');
    img {
      width: 100%;
      height: 100%;
    }
  }

  .ban-item {
    margin-top: 25vh;
    color: #fff;
    text-align: center;

    .big-title {
      font-size: 40px;
      font-weight: bold;
      margin: 20px 0;
    }

    .title-desc {
      font-size: 26px;
    }

    img {
      width: 500px;
    }
  }

  .el-row {
    height: 100%;
  }

  .bg-white {
    background-color: #fff;
    position: relative;
  }

  .banner {
    width: 100%;
    height: 100%;
    // filter: blur(5px);
  }

  .el-carousel {
    height: calc(100vh - 30px);
  }

  :deep(.el-tabs__item) {
    height: 40px !important;
    line-height: 40px !important;
    font-size: 16px;
  }
}

.footer {
  width: 60%;
  box-sizing: border-box;
  position: absolute;
  left: 20%;
  bottom: 40px;

  .down-item {
    cursor: pointer;

    img {
      width: 80px;
    }

    &:hover {
      color: blue !important;
    }
  }
}

.eos-logo {
  position: absolute;
  left: 10px;
  top: 10px;

  img {
    width: 150px;
  }
}

.inputDeep {
  border-bottom: 1px solid #ddd;

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-bphporder-color, var(--el-border-color)) inset;
    cursor: default;

    .el-input__inner {
      cursor: default !important;
    }
  }

  &:hover {
    border-bottom: 2px solid var(--el-color-primary);
  }
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 540px;
  // height: 400px;
  padding: 0px 25px 5px 25px;
  margin: 0 auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);

  .login-header {
    // background: red;
    display: flex;
    padding: 20px 0;
    justify-content: space-between;
    align-items: center;

    .left {
      font-size: 22px;
    }

    .right {
      color: var(--el-color-primary);
      cursor: pointer;
    }
  }

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }

  .title {
    width: 100%;
    text-align: center;
    color: var(--el-color-primary) !important;
    font-weight: bold;
    // font-size: 40px;
    font-size: 34px;
    position: absolute;
    // top: -100px;
    top: -70px;
    left: 0;
  }
}

.app-wrap {
  margin: 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    display: flex;

    .app-img {
      width: 40px;
      height: 40px;
      line-height: 48px;
      // border-radius: 200px;
      border-radius: 50%;
      border: 1px solid #aaa;
      margin-right: 10px;
      text-align: center;
      cursor: pointer;

      &:hover {
        border: 1px solid var(--el-color-primary);
      }
    }

    img {
      width: 20px;
      height: 20px;
    }
  }

  .right {
    color: var(--el-color-primary);
    // cursor: pointer;
  }
}

.term-wrap {
  padding: 30px 0;
  text-align: center;

  .text-blue {
    color: #0c64eb;
    cursor: pointer;
  }

  .el-icon {
    position: relative;
    top: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 30px;
  line-height: 30px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #666;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
  background-color: #f0f0f0;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}

.ban-bg {
  background-color: #0c64eb;
}

.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

.passMes {
  font-size: 12px;
  color: #ccc;
  padding-right: 20px;
  text-align: right;
}

:deep(.el-input-group__append, .el-input-group__prepend) {
  background-color: transparent !important;
  box-shadow: none !important;
}
</style>
