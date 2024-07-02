<template>
  <el-drawer v-model="showSettings" :withHeader="false" direction="rtl" size="300px">
    <div>
      <div class="setting-drawer-title">
        <span>主题颜色</span>
      </div>
      <div class="setting-drawer-block-checbox">
        <div class="setting-drawer-block-checbox-item" v-for="item in themeLits" :key="item" @click="themeChange(item.color)">
          <div :class="['color-block', item.type]" :title="item.name"></div>
        </div>
      </div>
      <div class="setting-drawer-title">
        <span>菜单风格</span>
      </div>
      <div class="setting-drawer-block-checbox">
        <div class="layout-item" @click="setMenuStype('WZC')">
          <div class="left left-right"></div>
          <div class="title"></div>
          <div class="dtg" v-if="menuStyle == 'WZC'">
            <el-icon><Select /></el-icon>
          </div>
        </div>
        <div class="layout-item" @click="setMenuStype('MES')">
          <div class="menu-all"></div>
          <div class="title"></div>
          <div class="dtg" v-if="menuStyle == 'MES'">
            <el-icon><Select /></el-icon>
          </div>
        </div>
      </div>
      <el-divider />
      <div class="setting-drawer-title">
        <span>字体配置</span>
      </div>
      <div class="setting-drawer-block-checbox">
        <el-slider v-model="font" :min="12" :max="18" />
      </div>
      <el-divider />
      <!-- <div class="setting-drawer-title">
        <span>行高</span>
      </div>
      <div class="setting-drawer-block-checbox">
        <el-slider v-model="rowHeight" :min="26" :max="50" />
      </div>
      <el-divider />

      <div class="drawer-item">
        <span>多页签</span>
        <span class="comp-style">
          <el-switch v-model="tagsView" class="drawer-switch" />
        </span>
      </div> -->

      <!-- <div class="drawer-item">
      <span>固定 Header</span>
      <span class="comp-style">
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </span>
    </div> -->

      <!-- <div class="drawer-item">
      <span>显示 Logo</span>
      <span class="comp-style">
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </span>
    </div> -->

      <!-- <div class="drawer-item">
        <span>动态标题</span>
        <span class="comp-style">
          <el-switch v-model="dynamicTitle" class="drawer-switch" />
        </span>
      </div> -->
    </div>

    <template #footer>
      <div class="button-box">
        <el-button @click="resetSetting" size="default">恢复默认</el-button>
        <el-button type="primary" size="default" @click="saveSetting">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
// import originElementPlus from "element-plus/theme-chalk/index.css"
// import axios from "axios";
// import { ElLoading, ElMessage } from "element-plus";
import { useDynamicTitle } from "@/utils/dynamicTitle";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import usePermissionStore from "@/store/modules/permission";
import { handleThemeStyle } from "@/utils/theme";
import { saveUserConfig } from "#/common";

const { proxy } = getCurrentInstance();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const showSettings = ref(false);
const theme = ref(settingsStore.theme);
const sideTheme = ref(settingsStore.sideTheme);
const storeSettings = computed(() => settingsStore);

// 布局配置
const leftTheme = computed({
  get: () => storeSettings.value.leftTheme,
  set: (val) => {
    settingsStore.changeSetting({ key: "leftTheme", value: val });
  },
});

// 新版菜单风格
const menuStyle = ref(null);
menuStyle.value = storeSettings.value.menuStyle;

// const menuStyle = computed({
//   get: () => storeSettings.value.menuStyle,
//   set: (val) => {
//     settingsStore.changeSetting({ key: "menuStyle", value: val });
//   },
// });

/** 是否需要topnav */
const topNav = computed({
  get: () => storeSettings.value.topNav,
  set: (val) => {
    settingsStore.changeSetting({ key: "topNav", value: val });
    if (!val) {
      appStore.toggleSideBarHide(false);
      permissionStore.setSidebarRouters(permissionStore.defaultRoutes);
    }
  },
});
/** 是否需要tagview */
const tagsView = computed({
  get: () => storeSettings.value.tagsView,
  set: (val) => {
    settingsStore.changeSetting({ key: "tagsView", value: val });
  },
});
/**是否需要固定头部 */
const fixedHeader = computed({
  get: () => storeSettings.value.fixedHeader,
  set: (val) => {
    settingsStore.changeSetting({ key: "fixedHeader", value: val });
  },
});
/**是否需要侧边栏的logo */
const sidebarLogo = computed({
  get: () => storeSettings.value.sidebarLogo,
  set: (val) => {
    settingsStore.changeSetting({ key: "sidebarLogo", value: val });
  },
});
/**是否需要侧边栏的动态网页的title */
const dynamicTitle = computed({
  get: () => storeSettings.value.dynamicTitle,
  set: (val) => {
    settingsStore.changeSetting({ key: "dynamicTitle", value: val });
    // 动态设置网页标题
    useDynamicTitle();
  },
});

const font = computed({
  get: () => storeSettings.value.font,
  set: (val) => {
    settingsStore.changeSetting({ key: "font", value: val });
  },
});

const rowHeight = computed({
  get: () => storeSettings.value.rowHeight,
  set: (val) => {
    settingsStore.changeSetting({ key: "rowHeight", value: val });
  },
});

function themeChange(val) {
  settingsStore.changeSetting({ key: "theme", value: val });
  theme.value = val;
  let themeType = themeLits.find((el) => el.color == val);
  handleThemeStyle(val);
  handleTheme(themeType.type);
}
function handleTheme(val) {
  settingsStore.changeSetting({ key: "sideTheme", value: val });
  sideTheme.value = val;
}

function setMenuStype(val) {
  menuStyle.value = val;
  // settingsStore.changeSetting({ key: "menuStyle", value: val });
}

function saveSetting() {
  proxy.$modal.loading("正在保存，请稍候...");
  settingsStore.changeSetting({ key: "menuStyle", value: menuStyle.value });
  let layoutSetting = {
    topNav: false,
    tagsView: storeSettings.value.tagsView,
    fixedHeader: storeSettings.value.fixedHeader,
    sidebarLogo: storeSettings.value.sidebarLogo,
    dynamicTitle: storeSettings.value.dynamicTitle,
    sideTheme: storeSettings.value.sideTheme,
    theme: storeSettings.value.theme,
    font: storeSettings.value.font,
    rowHeight: storeSettings.value.rowHeight,
    leftTheme: storeSettings.value.leftTheme,
    menuStyle: menuStyle.value,
  };
  saveUserConfig(layoutSetting)
    .then((res) => {
      localStorage.setItem("layout-setting", JSON.stringify(layoutSetting));
      showSettings.value = false;
      proxy.$modal.msgSuccess("保存成功");
    })
    .finally(() => {
      showSettings.value = false;
      setTimeout(proxy.$modal.closeLoading(), 100);
    });
}
function resetSetting() {
  proxy.$modal.loading("正在清除设置缓存并刷新，请稍候...");
  localStorage.removeItem("layout-setting");
  setTimeout("window.location.reload()", 1000);
}
function openSetting() {
  showSettings.value = true;
}

const themeLits = reactive([
  { name: "蓝色", type: "theme-blue", color: "#0C64EB" },
  { name: "红色", type: "theme-red", color: "#E52d27" },
  { name: "黄色", type: "theme-yellow", color: "#E65C00" },
  { name: "绿色", type: "theme-green", color: "#11998E" },
]);

const fontSizeList = reactive([
  { name: "小", type: "mini", value: 12 },
  { name: "中", type: "medium", value: 14 },
  { name: "大", type: "large", value: 16 },
]);
const fontChange = (val) => {
  settingsStore.changeSetting({ key: "font", value: val });
};

defineExpose({
  openSetting,
});
</script>

<style lang="scss" scoped>
.setting-drawer-title {
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
  font-weight: bold;
  .drawer-title {
    font-size: 14px;
  }
}
.setting-drawer-block-checbox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  gap: 10px;

  .setting-drawer-block-checbox-item {
    position: relative;
    border-radius: 2px;
    cursor: pointer;

    img {
      width: 48px;
      height: 48px;
    }

    .custom-img {
      width: 48px;
      height: 38px;
      border-radius: 5px;
      box-shadow: 1px 1px 2px #898484;
    }

    .setting-drawer-block-checbox-selectIcon {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      padding-top: 15px;
      padding-left: 24px;
      color: #1890ff;
      font-weight: 700;
      font-size: 14px;
    }
  }
}
.color-block {
  width: 50px;
  height: 30px;
}

.layout-item {
  width: 100%;
  height: 90px;
  position: relative;
  border: 1px solid var(--el-border-color);
  overflow: hidden;
  cursor: pointer;
  .dtg {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    right: 5px;
    overflow: hidden;
    background: var(--el-color-primary);
    text-align: center;
    line-height: 20px;
    font-size: 14px;
    color: #fff;
    padding-top: 2px;
  }
  .left {
    width: 20px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #d2d2d2;
  }
  .left-right {
    border-right: 10px solid #ecf1ff;
  }
  .top {
    width: 100%;
    height: 10px;
    position: absolute;
    top: 0;
    left: 0;
    background: #d2d2d2;
  }

  .menu-all {
    width: 50%;
    height: 100%;
    background: #ecf1ff;
    border-left: 10px solid #d2d2d2;
  }
  .title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
  }
}

.drawer-item {
  color: rgba(0, 0, 0, 0.65);
  padding: 12px 0;
  font-size: 14px;

  .comp-style {
    float: right;
    margin: -3px 8px 0px 0px;
  }
}
.font-item {
  border: 1px solid var(--el-border-color);
  padding: 3px 16px;
  &.active {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
  }
}
.button-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
