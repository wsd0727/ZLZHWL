
<template>
  <router-view />
</template>

<script setup>
import Cookies from 'js-cookie'
import useSettingsStore from "@/store/modules/settings";
import { handleThemeStyle } from "@/utils/theme";
import { axiosSave } from "@/api/system/page";
onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme);
  });
});

// 获取全局的系统配置
getSystem();
function getSystem() {
  let data = { MODULETYPE: "PCCONFIG", VTYPE: 'SYSCONFIG' };
  axiosSave("sys/config/getList?ISRSA=1", data).then((res) => {
    let cc = {
      title: "",
      logo: "",
      baseUrl: "",
      systemCode: "",
      sideBarWidth: 230,
      isNotice: false,
      isForgotPassword: false,
      CustomerTel: null ,
      PageCache : null , // 是否开启本地数据库缓存
    };
    // PageCache
    res.RESULT.forEach((el) => {
      // console.log("🚀 ~ res.RESULT.forEach ~ el:", el)
      switch (el.CONFIGKEY) {
        case "systemTitle":
          cc.title = el.CONFIGVALUE;
          setTimeout(function () {
            document.title = cc.title;
          }, 100);
          break;
        case "imgBaseUrl":
          cc.baseUrl = el.CONFIGVALUE;
          break;
        case "PageCache":
          Cookies.set('PageCache', el.CONFIGVALUE )
          cc.PageCache = el.CONFIGVALUE;
          break;
        case "systemLogo":
          cc.logo = el.URL;
          break;
        case "SYSTEMCODE":
        case "systemCode":
          cc.systemCode = el.CONFIGVALUE;
          break;
        case "hasWorkFlow": // 审批流 快捷功能
          cc.hasWorkFlow = el.CONFIGVALUE;
          break;
        case "sideBarWidth": // 抽屉菜单宽度
          cc.sideBarWidth = el.CONFIGVALUE;
          break;
        case "SystemNotice": // 是否启用通知
          cc.isNotice = el.CONFIGVALUE == 1 ? true : false;
          break;
        case "CustomerTel": // 客服电话
          cc.CustomerTel = el.CONFIGVALUE || null
          break;
        case "LoginConfig": //  登录配置
          cc.LoginConfig = el.CONFIGVALUE || null
          break;
        case "isForgotPassword":
          cc.isForgotPassword = el.CONFIGVALUE == 1 ? true : false;
          break;
        case "configWorkBench":   // 是否自定义配置工作台
          cc.configWorkBench = el.CONFIGVALUE;
        break;
        case "AMapSetting":// 高德地图配置
          try {
            cc.AMapCode = el.PARAMKEYVALUE || null
          } catch (err) {
            console.error("系统参数:AMapSetting:Error", err);
            cc.AMapCode = null
          }
          break;
      }
    });
    // setTimeout(() => {
    //   const s = document.createElement("script");
    //   s.type = "text/javascript";
    //   s.src = "/eos-api/sys/jmreport/desreport_/corelib/jmsheet.js?v=1.0.13";
    //   document.body.appendChild(s);
    // }, 2500);

    // setTimeout(() => {
    //   const s = document.createElement("script");
    //   s.type = "text/javascript";
    //   s.src = "/eos-api/sys/jmreport/desreport_/cdn/iview/iview.min.js";
    //   document.body.appendChild(s);
    // }, 3000);
    console.log(123, cc );
    useSettingsStore().setSystem(cc);
  });
}
</script>


