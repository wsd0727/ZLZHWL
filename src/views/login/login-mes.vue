<template>
  <div class="login sys-mes">
    <el-row>
      <el-col :span="9">
        <el-carousel
          trigger="click"
          :height="BannerHeight"
          arrow="never"
          class="ban-bg"
        >
          <el-carousel-item v-for="item in banners" :key="item.title">
            <div class="ban-item">
              <img :src="item.img" alt="" srcset="" class="banner" />
              <div class="ban-title" v-if="systemConfig?.systemCode!='ETEAM' ">
                <div class="big-title">
                  {{ item.title }}
                </div>
                <div class="title-desc">
                  {{ item.desc }}
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-col>

      <el-col :span="15" class="bg-white">
        <el-form
          ref="loginRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          :validate-on-rule-change="false"
        >
          <h3 class="title">{{ systemName || '' }}</h3>

          <div class="type-switch">
            <el-tabs v-model="loginType" class="demo-tabs">
              <el-tab-pane label="账号登录" name="admin"></el-tab-pane>
              <el-tab-pane label="手机登录" name="phone"></el-tab-pane>
            </el-tabs>
          </div>

          <template v-if="loginType == 'admin'">
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                type="text"
                size="large"
                auto-complete="off"
                placeholder="账号"
                class="inputDeep"
                clearable
              >
                <template #prefix>
                  <svg-icon
                    icon-class="user"
                    class="el-input__icon input-icon"
                  />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                size="large"
                auto-complete="off"
                placeholder="密码"
                show-password
                class="inputDeep"
                @keyup.enter="handleLogin"
              >
                <template #prefix>
                  <svg-icon
                    icon-class="password"
                    class="el-input__icon input-icon"
                  />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="groups" class="bz-wrap">
              <el-select v-model="loginForm.groups" class="m-2 on_border_select" placeholder="请选择班组" size="small">
                <el-option
                  v-for="item in BZoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select v-model="loginForm.classes" class="m-2 on_border_select" placeholder="请选择班次" size="small">
                <el-option
                  v-for="item in BCoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item prop="code" v-if="captchaEnabled">
              <el-input
                v-model="loginForm.code"
                size="large"
                auto-complete="off"
                placeholder="验证码"
                style="width: 63%"
                class="inputDeep"
                @keyup.enter="handleLogin"
              >
                <template #prefix>
                  <svg-icon
                    icon-class="validCode"
                    class="el-input__icon input-icon"
                  />
                </template>
              </el-input>
              <div class="login-code">
                <img :src="codeUrl" @click="getCode" class="login-code-img" />
              </div>
            </el-form-item>
            <el-checkbox
              v-model="loginForm.rememberMe"
              style="margin: 0px 0px 25px 0px"
              >记住密码</el-checkbox
            >
          </template>

          <template v-else>
            <el-form-item prop="mobile">
              <el-input
                v-model.number="loginForm.mobile"
                type="number"
                size="large"
                auto-complete="off"
                placeholder="手机号"
                clearable
                class="inputDeep"
                :prefix-icon="Iphone"
              >
              </el-input>
            </el-form-item>

            <el-form-item prop="code">
              <el-input
                v-model="loginForm.code"
                type="text"
                size="large"
                auto-complete="off"
                placeholder="验证码"
                clearable
                :maxlength="11"
                :prefix-icon="Lock"
                class="input-with-select inputDeep"
              >
                <template #append>
                  <span class="" @click="getTelCode"> {{ telCode }} </span>
                </template>
              </el-input>
            </el-form-item>
          </template>

          <el-form-item
            style="width: 100%"
            :class="loginType == 'admin' ? '' : 'mt20'"
          >
            <el-button
              :loading="loading"
              size="large"
              type="primary"
              round
              style="width: 100%"
              @click.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
            <!-- <div style="float: right" v-if="register">
              <router-link class="link-type" :to="'/register'"
                >立即注册</router-link
              >
            </div> -->
          </el-form-item>
        </el-form>

        <div class="footer text-center">
          <div class="down-wrap flex-row-bet" v-if="systemConfig?.systemCode!='ETEAM' ">
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
        </div>
      </el-col>
    </el-row>

    <!-- <div class="eos-logo">
      <img :src="eoslogo" alt="" />
    </div> -->

    <!--  底部  -->
    <div class="el-login-footer">
      <span
        >Copyright © 2005 - {{ Year }} EOSINE Software Technology Company
        Limited all rights reserved.</span
      >
      <span>晋ICP备17002690号</span>
    </div>
  </div>
</template>

<script setup>
import { getCodeImg, getNoteCode } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from "@/store/modules/user";
import usePermissionStore from "@/store/modules/permission";
import useSettingsStore from "@/store/modules/settings";
import { getUserConfig } from "#/common";
import { handleThemeStyle } from "@/utils/theme";

import copyText from '@/directive/common/copyText.js'

// import { copyText } from"@/directive/index.js"

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
const telCode = ref("获取验证码");

// 切换系统名称
const systemName = ref("");

// 初始系统标题
setTimeout(() => {
  if (systemConfig.value && systemConfig.value.title) {
    systemName.value = systemConfig.value.title;
  }
}, 500);

const banners = [
  {
    img: proxy.getAssetsFile("ams1.png"),
    title: "远程管理——AMS",
    desc: "管理优化，提升效率",
  },
  {
    img: proxy.getAssetsFile("oms1.png"),
    title: "订单管理——OMS",
    desc: "订单全方位管理，全网多终端协作",
  },
  {
    img: proxy.getAssetsFile("tms1.png"),
    title: "运输管理——TMS",
    desc: "智能计划调度，运输全程监管",
  },
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
  rememberMe: false,
  code: "",
  uuid: "",
  mobile: "",
  LOGINTYPE: "captcha",
  groups:'',
  classes:'',
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



// 班组
const BZoptions = ref([
  {label:'A组',value:'A'}, 
  {label:'B组',value:'B'}, 
  {label:'C组',value:'C'}, 
  {label:'D组',value:'D'}, 
])

const BCoptions = ref([
  {label:'白班',value:'A'}, 
  {label:'夜班',value:'B'}, 
])




function handleLogin() {
  loginRules.code[0].required = true;

  loginForm.value.LOGINTYPE =
    loginType.value == "admin" ? "captcha" : "sms_code";

  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      loading.value = true;
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
    let {
      topNav,
      tagsView,
      fixedHeader,
      sidebarLogo,
      dynamicTitle,
      sideTheme,
      theme,
      menuStyle,
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
  });
};

// getCode();
getCookie();
</script>

<style lang="scss">
.login{
  input{
    box-shadow: 0 0 0px 1000px white inset !important;
  }
}
</style>
<style lang="scss" scoped>
.login {
  height: 100%;
  min-height: 600px;
  position: relative;
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

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #333;
  font-weight: bold;
  font-size: 30px;
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
    box-shadow: 0 0 0 0px
      var(--el-input-bphporder-color, var(--el-border-color)) inset;
    cursor: default;
    .el-input__inner {
      cursor: default !important;
    }
  }
  &:hover {
    border-bottom: 2px solid var(--el-color-primary);
  }
}

.on_border_select {
  :deep(.el-input__inner){
      border: 0px!important;
  }
} 

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 50%;
  height: 400px;
  padding: 25px 25px 5px 25px;
  margin: 0 auto;
  position: relative;
  top: 40%;
  transform: translateY(-50%);

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



.bz-wrap{
  display: flex;
  justify-content: space-between;
  .el-select--small{
    width: 50%;
  }
}



</style>
