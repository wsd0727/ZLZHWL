<template>
  <div class="sidebar-conetnt" ref="lenfMenu" :style="{ width: isCollapse ? '58px' : '160px' }">
    <el-scrollbar :height="sidebarHeight" :class="['sidebar-left', isCollapse ? 'sidebar-left-ani' : '']" :style="{ width: isCollapse ? '58px' : '160px' }">
      <el-menu default-active="2" class="el-menu-vertical-demo menu-wzc" :collapse="isCollapse">
        <template v-for="(item, index) in topMenus" :key="item.path">
          <el-menu-item :index="`${index}`" v-if="!item.CHILDREN.length" @click="handleMenu(itemS)">
            <i :class="['fa', item.META.VICON]"></i>
            <template #title> {{ item.NAME.slice(0, 2) }}</template>
          </el-menu-item>

          <el-sub-menu :index="`${index}`" v-else>
            <el-divider />
            <template #title>
              <i :class="['fa', item.META.VICON]"></i>
              <span class="menu-name">{{ item.NAME.slice(0, 2) }}</span>
            </template>

            <template v-for="(itemS, indexS) in item.CHILDREN" :key="indexS">
              <el-menu-item :index="`${index}-${indexS}`" @click="handleMenu(itemS)" class="my-sub">
                <span class="fa fa-circle"></span>
                <span class="menu-name-sub">{{ itemS.NAME.slice(0, 5) }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>
    <div class="mark" @click="showSidebarRight = false" v-if="showSidebarRight"></div>

    <el-scrollbar :height="sidebarHeight" class="sidebar-right" :style="{ left: lenfMenuWidth + 'px' }" v-if="showSidebarRight && subMenuList?.CHILDREN.length">
      <div class="my-sub-title">{{ subMenuList.NAME }}</div>
      <el-menu class="el-menu-vertical-demo menu-wzc" background-color="#ecf1ff" text-color="#495362" :collapse="isCollapse">
        <template v-for="(item, index) in subMenuList.CHILDREN" :key="item.path">
          <el-menu-item :index="`${index}`" v-if="!item.CHILDREN.length" @click="handleSubMenu(item)">
            <template #title> {{ item.NAME }}</template>
          </el-menu-item>

          <el-sub-menu :index="`${index}`" v-else>
            <template #title>
              <span class="menu-name">{{ item.NAME }}</span>
            </template>

            <template v-for="(itemS, indexS) in item.CHILDREN" :key="indexS">
              <el-menu-item :index="`${index}-${indexS}`" @click="handleSubMenu(itemS)" class="my-sub">
                <span class="menu-name-sub">{{ itemS.NAME }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>

    <div class="submenu" v-if="openMenu && !topNav">
      <div class="mark" @click="closeMenu"></div>
      <div class="submenu-wrap">
        <div class="submenu-wrap-title">
          <div class="search-wrap">
            <!-- <span  >{{ dataMenu.NAME }}</span> -->
            <el-input v-model="menuKeyword" placeholder="请输入关键词33" :prefix-icon="Search" clearable />
          </div>

          <el-icon class="close-icon">
            <Close @click="closeMenu" />
          </el-icon>
        </div>

        <div class="ali-case" :style="{ width: modalWidth + 'px' }">
          <el-scrollbar :height="modalHeight">
            <div class="favorite">
              <div class="favorite-title ali-menu-title">快捷入口</div>
              <div class="favorite-content">
                <div class="favorite-item" v-for="i in myStartMenu" :key="i.BILLNO">
                  <router-link :to="i.ROUTE" class="eoslink-a" @click="closeMenu">
                    {{ i.MENUNAME }}
                  </router-link>
                  <el-icon class="my-start" title="取消快捷入口" :size="16" @click.stop="jionStart(i, 0)">
                    <StarFilled />
                  </el-icon>
                </div>
              </div>
            </div>

            <div class="eos-menu">
              <div class="eos-menu-content" v-for="eitem in allMenu" :key="eitem.id">
                <div class="eosmenu-col" :style="{ width: sideBarWidth + 'px' }" v-for="item in eitem.list" :key="item.BILLNO">
                  <template v-if="item.CHILDREN.length > 0">
                    <div class="ali-menu-title primary-color pl8 t13">
                      {{ item.NAME }}
                    </div>

                    <div class="eosmenu-sub" v-for="menus in item.CHILDREN" :key="menus.BILLNO" @click="closeMenu">
                      <div class="" v-if="menus.CHILDREN.length">
                        <span class="ali-menu-title pl8">
                          {{ menus.NAME }}
                        </span>
                        <template v-for="itemt in menus.CHILDREN" :key="itemt.BILLNO">
                          <div class="eoslink">
                            <router-link :to="itemt.fullPath" class="eoslink-a">
                              {{ itemt.NAME }}
                            </router-link>
                            <el-icon class="my-start" title="加入快捷入口1" :size="14" @click.stop="jionStart(itemt, 1)">
                              <Star />
                            </el-icon>
                          </div>
                        </template>
                      </div>

                      <div class="eoslink" v-else>
                        <router-link :to="menus.fullPath" class="eoslink-a">
                          {{ menus.NAME }}
                        </router-link>
                        <el-icon class="my-start" title="加入快捷入口2" :size="14" @click.stop="jionStart(menus, 1)">
                          <Star />
                        </el-icon>
                      </div>
                    </div>
                  </template>

                  <div class="eoslink" v-else>
                    <router-link :to="item.fullPath" class="eoslink-a" @click="closeMenu">
                      {{ item.NAME }}
                    </router-link>
                    <el-icon class="my-start" title="加入快捷入口3" :size="14" @click.stop="jionStart(item, 1)">
                      <Star />
                    </el-icon>
                  </div>

                  <!-- <router-link v-else :to="resetPath(dataMenu.path, item.path)" class="eosmenu-item w150">{{ item.NAME }}</router-link> -->
                </div>
              </div>
            </div>
          </el-scrollbar>
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
import submenuItem from "./submenuItem";
import { ElMessage, ElMessageBox } from "element-plus";

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

import { setMyStart } from "#/common";
import { computed, inject } from "vue";

const { proxy } = getCurrentInstance();

const props = defineProps({
  sidebarHeight: Number,
});

const scaleValue = inject("scaleValue");

const route = useRoute();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const showLogo = computed(() => settingsStore.sidebarLogo);
const sideTheme = computed(() => settingsStore.sideTheme);
const systemConfig = computed(() => settingsStore.systemConfig);
const topNav = computed(() => settingsStore.topNav);
const sideBarWidth = ref(230);
// 系统顶部左侧logo
const avatarUrl = ref(proxy.getAssetsFile("scm/menu/logo.png"));
if (systemConfig.value && systemConfig.value.baseUrl) {
  avatarUrl.value = systemConfig.value.baseUrl + systemConfig.value.logo;
  sideBarWidth.value = systemConfig.value.sideBarWidth;
}

const menuKeyword = ref(null);

const modalHeight = window.innerHeight - 100;
const modalWidth = ref(null);

// 右侧弹窗菜单
const subMenuList = ref({});
const showSidebarRight = ref(false);

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

const allMenu = ref([]);

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

const myStartMenu = ref([]); //

const lenfMenu = ref(null);
const lenfMenuWidth = ref(null);
onMounted(() => {
  
  lenfMenuWidth.value = lenfMenu.value?.clientWidth;
});

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

const isCollapse = computed(() => settingsStore.isCollapse);
// console.log("topMenus", topMenus.value);
// 菜单左布局弹出层
const openMenu = ref(false);
const dataMenu = ref({});
const reloadOpenMenu = ref(false);
const lastMenu = ref("");
const changeMenu = (data) => {
  if (lastMenu.value == data.BILLNO) return;
  lastMenu.value = data.BILLNO;
  if (data.CHILDREN.length == 0) return (openMenu.value = false);
  dataMenu.value = data;
  openMenu.value = true;
  reloadOpenMenu.value = false;

  setAllMenu(data.CHILDREN);
  // 设置抽屉宽度
  let menuNum = allMenu.value.length;
  modalWidth.value = menuNum * 230 + 20;

  setTimeout(() => {
    reloadOpenMenu.value = true;
  }, 0);
};
const closeMenu = () => {
  lastMenu.value = "";
  openMenu.value = false;
};

function handleSelect(key, menu) {
  currentIndex.value = key;
  let newTopMenu = [];
  if (menu.children && menu.children.length) {
    newTopMenu = menu.children.map((item) => {
      item.path = item.path.includes(menu.path)
        ? item.path
        : menu.path + "/" + item.path;
      return item;
    });
  }
  permissionStore.setMenuIndex(key, newTopMenu);
}

const jionStart = (data, type) => {
  let url = type
    ? "/sys/ba-menu-collection/add"
    : "/sys/ba-menu-collection/deleteBatchIds";
  let saveData = {
    MENUNAME: data.NAME,
    PK_MENU: data.BILLNO,
    ROUTE: data.fullPath,
  };
  if (type == 0) {
    saveData = { data: [data.BILLNO] };
  }
  setMyStart({ url: url, data: saveData }).then((res) => {
    let mes = type ? "加入快捷方式成功" : "取消成功";
    getMyStart();
    ElMessage({
      message: mes,
      type: "success",
    });
  });
};

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

// 获取快捷菜单入口
getMyStart();
function getMyStart() {
  setMyStart({ url: "/sys/ba-menu-collection/getPageList", data: {} }).then(
    (res) => {
      let RECORDS = res.RESULT ? res.RESULT.RECORDS : [];
      myStartMenu.value = RECORDS;
    }
  );
}

/* 重新设置菜单 onlySub 只有2级菜单，   hasTreMenu 包含3级菜单    ,
 *   每4个菜单划分为一组 ， 第一组作为基础
 */
const setAllMenu = (data) => {
  // console.log(123, data);
  let onlySub = [],
    hasTreMenu = [],
    newEosMenu = [],
    newArrS4 = [];

  data.forEach((item) => {
    if (!item.CHILDREN.length) {
      onlySub.push(item);
    } else {
      hasTreMenu.push(item);
    }
  });
  for (var i = 0; i < hasTreMenu.length; i += 4) {
    newArrS4.push(hasTreMenu.slice(i, i + 4));
  }
  newArrS4.forEach((item, index) => {
    let a = { id: "Eos" + index, list: [] };
    item.forEach((c, i) => {
      let newA = JSON.parse(JSON.stringify(a));
      if (index == 0) {
        newA.list.push(c);
        newEosMenu.push(newA);
      } else newEosMenu[i].list.push(c);
    });
  });
  if (onlySub.length) {
    newEosMenu.unshift({ id: 1, list: onlySub });
  }
  allMenu.value = newEosMenu;
  // console.log(55, newEosMenu);
};

/*
 * handleMenu
 *
 */
const router = useRouter();
// 左侧菜单点击事件
function handleMenu(itemS) {
  console.log("🚀 ~ handleMenu ~ itemS:", itemS)
  if(itemS.COMPONENT == "openLink"){
    return window.open(itemS.VURL)
  }
  if (itemS.CHILDREN.length) {
    subMenuList.value = itemS;
    showSidebarRight.value = true;
  } else {
    let path = itemS.fullPath;
    showSidebarRight.value = false;
    router.push({ path: path });
  }
}
// 右侧菜单点击
function handleSubMenu(data) {
  if (!data.CHILDREN.length) {
    let path = data.fullPath;
    showSidebarRight.value = false;
    router.push({ path: path });
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
    // overflow: hidden;
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

// :deep(.el-scrollbar) {
//   overflow: visible;
//   .el-scrollbar__wrap {
//     overflow: visible;
//   }
// }

.primary-color {
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

// 参照阿里云菜单样式
.ali-case {
  padding: 0 10px;
  // background: #ededed;
  .favorite {
    &-title {
      margin: 10px 0;
      height: 32px;
      padding-left: 8px;
      line-height: 32px;
      transition: all 250ms linear 0s;
    }
    &-content {
      height: auto;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
      .favorite-item {
        color: #666;
        font-size: 12px;
        width: 230px;
        height: 32px;
        line-height: 32px;
        padding: 0 8px;
        border-radius: 2px;
        cursor: pointer;
        position: relative;
        .el-icon {
          position: absolute;
          right: 8px;
          top: 8px;
          z-index: 10;
          color: #ff6a00;
        }
      }
      :hover {
        color: #333;
        background-color: #f4f6f7;
        border-color: transparent;
      }
    }
  }

  .eos-menu {
    display: flex;
  }
  .eos-menu-content {
    display: flex;
    flex-direction: column;
    .eosmenu-col {
      display: flex;
      // width: 230px;
      flex-direction: column;
    }
    .eoslink {
      padding: 0 8px;
      color: #666;
      font-size: 12px;
      height: 32px;
      line-height: 32px;
      position: relative;
      .el-icon {
        position: absolute;
        right: 8px;
        top: 8px;
        z-index: 10;
        color: #ff6a00;
        display: none;
        cursor: pointer;
      }
    }
    .eoslink:hover {
      color: #333;
      background-color: #f4f6f7;
      border-color: transparent;
      .el-icon {
        display: block;
      }
    }
  }
}

.ali-menu-title {
  color: #333;
  font-size: 12px;
  font-weight: 600;
  height: 32px;
  line-height: 32px;
}

.el-menu {
  border: none !important;
}

// 新版菜单风格
$new-menu-style-bgcolor: #ecf1ff;
.sidebar-conetnt {
  position: relative;
  .sidebar-right {
    width: 280px;
    padding: 10px 20px;
    position: absolute;
    // left: 195px;
    top: 0;
    z-index: 1500;
    background-color: #ecf1ff !important;
    .my-sub-title {
      padding-bottom: 10px;
      border-bottom: 1px solid #e3e3e3;
    }
  }

  .mark {
    // background: #000;
    // opacity: 0.6;
    width: calc(100vw - 450px);
    height: calc(100vh - 80px);
    position: absolute;
    left: 390px;
    top: 0;
    z-index: 11; // 分页的层级是 10
  }
}
@keyframes myfirst {
  from {
    width: 100%;
  }
  to {
    width: 58px;
  }
}

.sidebar-left-ani {
  animation: myfirst 1s;
}
.sidebar-left {
  // width: 195px;
  // min-width: 100px;

  .menu-wzc {
    .is-active .el-sub-menu__title {
      color: #6681fa;
    }

    .el-sub-menu {
      .fa {
        font-size: 16px;
        // padding-right: 22px;
      }
      .menu-name {
        position: absolute;
        left: 60px;
        font-size: 16px;
        font-weight: 600;
      }

      .my-sub {
        // position: absolute;
        // left: 70px;
        .fa {
          font-size: 12px;
          padding-right: 6px;
          scale: 0.4;
          margin-left: 18px;
        }
      }
      .menu-name-sub {
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
}

:deep(.is-opened .el-sub-menu__title) {
  color: var(--el-color-primary) !important;
}

// 左侧菜单分割线
.el-divider--horizontal {
  margin: 0px 0 !important;
  width: 80%;
  left: 10%;
}

// 左侧导航鼠标经过背景色

:deep(.el-sub-menu__title:hover) {
  background-color: $new-menu-style-bgcolor !important;
}

/* 改变elementui 侧边栏移入颜色 */

.el-menu-item.is-active {
  background: $new-menu-style-bgcolor !important;
}
.el-submenu__title.is-active {
  background: $new-menu-style-bgcolor !important;
}

.el-menu--vertical .el-menu-item:hover {
  background: $new-menu-style-bgcolor !important;
  color: var(--el-color-primary);
}

.sidebar-right {
  .el-menu-item {
    border-radius: 6px;
  }
  .el-menu--vertical .el-menu-item:hover {
    background: var(--el-color-primary) !important;
    color: #fff;
    border-radius: 6px;
  }
}

.el-menu-item.is-active {
  color: var(--el-color-primary);
  background-color: #eaeeff !important;
}

.el-sub-menu .el-menu-item {
  min-width: 100px !important;
}
</style>
