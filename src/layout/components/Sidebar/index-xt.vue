<template>
  <div :class="{ 'has-logo': showLogo, side: true, leftNav: !topNav }">
    <div class="logo-wrap">
      <img :src="avatarUrl" alt="" srcset="" />
    </div>

    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <template v-if="!topNav">
        <div class="menu" v-for="(item, index) in topMenus" :key="item.path" @click="changeMenu(item, index)">
          <div :class="['menu-title',dataMenu.NAME == item.NAME ? 'active-menu' : '']">
            <i :class="['fa', item.META.VICON]"></i>
            <span> {{  item.NAME.slice(0,2) }} </span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="menu" v-for="(item, index) in topMenus" :key="index" @click="handleSelect(index, item)">
          <el-tooltip :content="item.NAME" placement="right" :offset="10">
            <img :src="item.icon" alt="" srcset="" />
          </el-tooltip>
        </div>
      </template>
    </el-scrollbar>
    <div class="submenu" v-if="openMenu &&  !topNav">
      <div class="mark" @click="closeMenu"></div>
      <div class="submenu-wrap">
        <div class="submenu-wrap-title">
          <span  >{{ dataMenu.NAME }}</span>
          <el-icon class="close-icon">
            <Close @click="closeMenu" />
          </el-icon>
        </div>
        <!-- 最后一级为空模板的话，提示错误 -->
        <div class="submenu-body" v-if="reloadOpenMenu">
          <div class="submenu-content" @click="closeMenu">
            <template v-for="item in dataMenu.CHILDREN" :key="item.BILLNO">
              <template v-if="item.CHILDREN.length > 0">
                <div class="submenu-title primary-color"  >{{ item.NAME }}</div>
                <submenu-item :parentPath="item.path" :data="menu" v-for="menu in item.CHILDREN" :key="menu.BILLNO"></submenu-item>
              </template>
              <router-link v-else :to="resetPath(dataMenu.path, item.path)" class="submenu-item w150">{{ item.NAME }}</router-link>
            </template>
          </div>
        </div>
        



      </div>
    </div>
  </div>
</template>

<script setup>
import variables from "@/assets/styles/variables.module.scss";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import usePermissionStore from "@/store/modules/permission";
import submenuItem from "./submenuItem"

const { proxy } = getCurrentInstance();

const route = useRoute();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const showLogo = computed(() => settingsStore.sidebarLogo);
const sideTheme = computed(() => settingsStore.sideTheme);
const isCollapse = computed(() => !appStore.sidebar.opened);
const systemConfig = computed(() => settingsStore.systemConfig);
const topNav = computed(() => settingsStore.topNav);
// 系统顶部左侧logo
const avatarUrl = ref();
// if (systemConfig.value.logo && systemConfig.value.baseUrl) {
//   avatarUrl.value = systemConfig.value.baseUrl + systemConfig.value.logo;
// }

// 主题颜色
const theme = computed(() => settingsStore.theme);
// 所有的路由信息
const routers = computed(() => permissionStore.topbarRouters);
// 顶部栏初始数
const visibleNumber = ref(null);
// 当前激活菜单的 index
const currentIndex = ref(null);
// 隐藏侧边栏路由
const hideList = ["/index", "/user/profile"];

const activeMenuIndex = ref(-1);
const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) return meta.activeMenu;
  return path;
});
const setActiveMenu = (index) => {
  activeMenuIndex.value = index;
};

// 顶部显示菜单
const topMenus = computed(() => {
  let topMenus = [];
  routers.value.map((menu, index) => {
    if (menu.hidden !== true) {
      let icc = menu.META.VIMG + ".png";
      menu.icon = proxy.getAssetsFile(`scm/menu/ico_scm_${icc}`);
      // 兼容顶部栏一级菜单内部跳转
      if (menu.path === "/") {
        topMenus.push(menu.children[0]);
      } else {
        topMenus.push(menu);
      }
    }
  });
  return topMenus;
});

// 菜单左布局弹出层
const openMenu = ref(false);
const dataMenu = ref({});
const reloadOpenMenu = ref(false)
const lastMenu = ref("")
const changeMenu = (data) => {
  if (lastMenu.value == data.BILLNO) return
  lastMenu.value = data.BILLNO
  if (data.CHILDREN.length == 0) return openMenu.value = false;
  dataMenu.value = data;
  openMenu.value = true;
  reloadOpenMenu.value = false
  setTimeout(() => {
    reloadOpenMenu.value = true
  }, 0)
};
const closeMenu = () => {
  lastMenu.value = ""
  openMenu.value = false
}

function handleSelect(key, menu) {
  currentIndex.value = key;
  let newTopMenu = [];
  if (menu.children && menu.children.length) {
    newTopMenu = menu.children.map((item) => {
      item.path = item.path.includes(menu.path) ? item.path : menu.path + "/" + item.path;
      return item;
    });
  }
  permissionStore.setMenuIndex(key, newTopMenu);
}

// 重写路由地址 a 一级， b二级   c 三级 
function resetPath(a, b, c) {
  if (!c) {
    if (b.includes("/")) {
      return b;
    } else {
      return a + "/" + b;
    }
  }
  if (b.includes("/")) {
    return b + "/" + c;
  } else {
    return `${a}/${b}/${c}`;
  }
}


</script>

<style lang="scss" scoped>
.side {
  width: 60px;
  box-sizing: border-box;
  padding: 0 10px;

  .logo-wrap {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 40px;
      height: 40px;
    }
  }

  .menu {
    margin-top: 10px;
    img {
      width: 40px;
      height: 40px;
    }
    cursor: pointer;
    &:hover {
      .menu-title {
        opacity: 0.8;
      }
    }
  }
  .menu {
    &:hover {
      .submenu {
        opacity: 1;
      }
    }
    &-title {
      font-size: 14px;
      height: 44px;
      box-sizing: border-box;
      padding: 10px 0;
      color: #fff;
      text-align: left;
      line-height: 24px;
      span {
        line-height: 24px;
        position: relative;
        top: -2px;
      }

      .fa {
        font-size: 20px;
        margin: 0 10px 0 18px;
        line-height: 24px;
        display: inline-block;
        width: 24px;
      }
    }
  }
  .submenu {
    position: absolute;
    left: 100px;
    right: 0;
    top: 50px;
    width: 100vw;
    height: 100%;
    color: #5c5c5c;
    z-index: 99;
    overflow: hidden;
    box-sizing: border-box;
    .mark {
      background: #000;
      opacity: 0.6;
      width: 100%;
      height: 100%;
    }
    &-wrap {
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: #fff;
      min-width: 500px;
      // width: fit-content;
      z-index: 1;
      padding-top: 43px;
      flex-direction: row;
      &-title {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 10px;
        font-size: 16px;
        color: #333;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--el-border-color);
        .close-icon {
          font-size: 16px;
          cursor: pointer;
        }
      }
    }
    &-body {
      width: fit-content;
      height: calc(100% - 50px);
      box-sizing: border-box;
    }
    &-content {
      height: 100%;
      // overflow: auto;
      display: inline-flex;
      writing-mode: vertical-lr;
      flex-wrap: wrap;
      align-content: flex-start;
      &-item {
        width: 150px;
        font-size: 13px;
        box-sizing: border-box;
        writing-mode: horizontal-tb;
      }
    }
    &-title {
      width: 150px;
      padding: 5px;
      font-size: 13px;
      line-height: 2;
      color: #000;
      // margin-bottom: 10px;
      font-weight: bold;
      // background: #ccc;
      writing-mode: horizontal-tb !important;
    }
    &-item {
      display: block;
      color: #333;
      height: 30px;
      line-height: 30px;
      border-radius: 3px;
      font-size: 13px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      padding-left: 10px;
      &:hover {
        color: var(--el-color-primary);
        font-weight: 600;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.w150 {
  width: 150px !important;
  box-sizing: border-box;
  writing-mode: horizontal-tb !important;
}
:deep(.el-scrollbar) {
  overflow: visible;
  .el-scrollbar__wrap {
    overflow: visible;
  }
}
.primary-color{
  color: var(--el-color-primary) !important;
}
.leftNav {
  padding: 0 !important;
  .menu {
    margin-top: 0;
    &:hover {
      font-weight: bold;
      background-color: rgba($color: #333, $alpha: 0.7);
    }
  }
  .active-menu {
    font-size: 15px;
    font-weight: bold;
    background: rgba($color: #333, $alpha: 0.7);
  }
}
</style>
