<template>
  <el-config-provider :locale="locale" size="small">
    <div ref="appRef" :class="classObj" :style="{ '--current-color': theme }">

      <template v-if="menuStyle == 'MES'">
        <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
        <Sidebar v-if="!sidebar.hide" class="sidebar-container" />
        <div :class="{ hasTagsView: needTagsView }" class="main-container">
          <div :class="{ 'fixed-header': fixedHeader }">
            <!-- <navbar @setLayout="setLayout" /> -->
            <TopMenu @setLayout="setLayout" @openNotice="openNotice" :noticeLength="Number(unReadData.WARNCOUNT || 0)"></TopMenu>
            <tags-view v-if="needTagsView" />
          </div>
          <app-main />
          <settings ref="settingRef" />
          <notice ref="noticeRef" @setUnReadData="setUnReadData" />
        </div>
      </template>

      <template v-else>
        <div class="top-menu-box" ref="topMenu">
          <TopMenu @setLayout="setLayout" @openNotice="openNotice" :noticeLength="Number(unReadData.WARNCOUNT || 0)"></TopMenu>
        </div>
        <div class="menu-2-content">
          <SidebarWzc :sidebarHeight="appHight - topMenuHeight" v-show="!isCollapse"></SidebarWzc>
          <div :class=" ['right-content' ,   isCollapse ?'sidebarWidth58':'' ] ">
            <tags-view v-if="needTagsView" />
            <app-main :topMenuHeight="topMenuHeight" />
            <settings ref="settingRef" />
            <notice ref="noticeRef" @setUnReadData="setUnReadData" />
          </div>
        </div>
      </template>

      <FileDownProgress />
    </div>
  </el-config-provider>
</template>

<script setup>
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { useWindowSize } from "@vueuse/core";
import FileDownProgress from "@/components/FileDownProgress"
import { onMounted, provide } from "vue";

import Sidebar from "./components/Sidebar/index.vue";
import SidebarWzc from "./components/Sidebar/index-wzc.vue";
import TopMenu from "./components/TopMenu/index.vue";




import { queryNotice, queryUnRead } from "#/common";

import { AppMain, Navbar, Settings, TagsView, Notice } from "./components";
import defaultSettings from "@/settings";

import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";


const locale = computed(() => zhCn);
const appHight = window.innerHeight;
const settingsStore = useSettingsStore();
const theme = computed(() => settingsStore.theme);
const sideTheme = computed(() => settingsStore.sideTheme);
const leftTheme = computed(() => settingsStore.leftTheme);
const font = computed(() => settingsStore.font);
const sidebar = computed(() => useAppStore().sidebar);
const device = computed(() => useAppStore().device);
const needTagsView = ref(true); // computed(() => settingsStore.tagsView);
const fixedHeader = computed(() => settingsStore.fixedHeader);
const topNav = computed(() => settingsStore.topNav);
const menuStyle = computed(() => settingsStore.menuStyle);
const isCollapse = computed(() => settingsStore.isCollapse);
const systemConfig = computed(() => settingsStore.systemConfig);

// console.log('menuStyle', menuStyle.value , menuStyle.value.length);

const classObj = computed(() => {
  let obj = {
    hideSidebar: !sidebar.value.opened,
    openSidebar: sidebar.value.opened,
    leftTheme: leftTheme.value,
    topTheme: !leftTheme.value,
    hideTopMenu: !topNav.value === true,
    withoutAnimation: sidebar.value.withoutAnimation,
    mobile: device.value === "mobile",
    menuStyleWZC: menuStyle.value === "WZC",
    menuStyleMES: menuStyle.value === "MES",

    // "font-mini": font.value == 12,
    // "font-medium": font.value == 13,
    // "font-large": font.value == 14,
  };
  obj[sideTheme.value] = sideTheme.value;
  document.getElementsByTagName("body")[0].className =
    font.value == 12
      ? "font-mini"
      : font.value == 14
        ? "font-large"
        : "font-large";
  return obj;
});

const { width, height } = useWindowSize();
const WIDTH = 992; // refer to Bootstrap's responsive design
const scaleValue = ref(1);

const topMenu = ref(null);
const topMenuHeight = ref(null);

scaleValue.value = parseFloat((width.value / 1920).toFixed(5));

watchEffect(() => {
  if (device.value === "mobile" && sidebar.value.opened) {
    useAppStore().closeSideBar({ withoutAnimation: false });
  }
  if (width.value - 1 < WIDTH) {
    useAppStore().toggleDevice("mobile");
    useAppStore().closeSideBar({ withoutAnimation: true });
  } else {
    useAppStore().toggleDevice("desktop");
  }
});

const noticeListNumber = ref(0);
const noticeList1 = ref({});

function queryNoticeList() {
  queryNotice({}).then((res) => {
    noticeListNumber.value = res.RESULT.MESSAGECOUNT;
    let Arr = res.RESULT.DATA;
    let needToBeDealtWith = Arr.filter((ele) => ele.TYPE == 0);
    let news = Arr.filter((ele) => (ele.TYPE = !0));
    noticeList1.value = {
      needToBeDealtWith: needToBeDealtWith,
      news: news,
    };
  });
}

function handleClickOutside() {
  useAppStore().closeSideBar({ withoutAnimation: false });
}

const settingRef = ref(null);
function setLayout() {
  settingRef.value.openSetting();
}

const noticeRef = ref(null);
function openNotice(t) {
  noticeRef.value.openSetting();
}
if (systemConfig.value && systemConfig.value.isNotice) {
  queryNoticeList();
}

const unReadData = ref({})

function getUnReadNews() {
  queryUnRead({}).then((res) => {
    unReadData.value = res.RESULT
  });
}

function setUnReadData() {
  getUnReadNews()
}

/* 
 屏幕适配
*/

const drawTiming = ref(null);

onMounted(() => {
  calcRate();
  getUnReadNews()
  window.addEventListener("resize", resize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
});

function calcRate() {
  scaleValue.value = parseFloat((width.value / 1920).toFixed(5));
  topMenuHeight.value = 61  // topMenu.value?.clientHeight;
}

function resize() {
  clearTimeout(drawTiming);
  drawTiming.value = setTimeout(() => {
    calcRate();
  }, 200);
}
provide(
  "scaleValue",
  computed(() => scaleValue.value)
);
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.module.scss";

.app-wrapper-wzc {
  // background-color: antiquewhite;
  .top-menu-box {
    box-shadow: 0px 2px 2px 0px rgba(5, 20, 40, 0.11);
    position: relative;
    z-index: 100;
  }
}

.menuStyleMES {
  .app-main {
    top: 108px;
  }
  .top-menu-wrap .collapse-btn {
    display: none !important;
  }
}

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 60px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}

// 新版菜单风格
.menu-2-content {
  display: flex;
  position: relative;

  // 右侧3 4 级别导航
  .sidebar-menu {
    width: 190px;
    position: absolute;
    left: 195px;
    top: 0;
    z-index: 1;
    background-color: #ecf1ff;
  }

  .collapse-btn-wra {
    background-color: #ecf1ff;
    width: 24px;
    height: 100px;
    position: absolute;
    left: 200px;
    top: 48%;
    z-index: 1;
  }
  .left-menu {
    width: 195px;
    color: #000;
    padding: 0 16px;
  }
  .right-content {
    background-color: #e7e9f1;
    padding: 10px 0 0 10px;
    width: calc(100% - 160px);
  }
  .sidebarWidth58 {
    // width: calc(100% - 58px);
    width: 100%;
    // transition: width 0.1s ease-in-out ;
  }
}
</style>
