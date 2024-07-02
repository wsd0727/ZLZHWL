import auth from "@/plugins/auth";
import router, { constantRoutes, dynamicRoutes } from "@/router";
import { h as createdNode } from 'vue'
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index";
import ParentView from "@/components/ParentView";
import InnerLink from "@/layout/components/InnerLink";
import AsyncImport from "@/pageToComponents"

// 匹配views里面所有的.vue文件
const modules = import.meta.glob("./../../views/**/*.vue");

// 所有的路由模板
import FormPage from "@/views/system/user/index";
import ListPage from "@/views/system/role/index";

// import iFrame from "@/views/iframe/index";
import VTable from "@/views/table/index"
// import BatchTable from "@/views/table/index"
import VForm from "@/views/formPage/index"
// import Dashboard from "@/views/dashboard/public";

// 待办
import WaitDoPage from "@/views/system/user/index";

import DictionaryPage from "@/views/system/user/index";
import trackPage from "@/views/system/user/index";
import ReportPage from "@/views/system/user/index";
import GridPage from "@/views/system/user/index";
import SupplierPage from "@/views/system/user/index";
import MaterialsPage from "@/views/system/user/index";
import CarTrackPage from "@/views/system/user/index";
import CarFollowPage from "@/views/system/user/index";
import CarTraceabilityPage from "@/views/system/user/index";
import SysPage from "@/views/system/user/index";

const usePermissionStore = defineStore("permission", {
  state: () => ({
    routes: [],
    addRoutes: [],
    topMenu: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
    menuIndex: 0,
  }),
  persist: {
    enabled: true, // 开启存储
    // **strategies: 指定存储位置以及存储的变量都有哪些,该属性可以不写，不写的话默认是存储到sessionStorage里边，默认存储state里边的所有数据**
    strategies: [
      { paths: ['menuIndex'] }
      // storage 存储到哪里 sessionStorage/localStorage
      // paths是一个数组,要存储缓存的变量,当然也可以写多个
      // paths如果不写就默认存储state里边的所有数据，如果写了就存储指定的变量
    ]
  },
  actions: {
    setRoutes(routes) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },
    setMenuIndex(i, topMenu) {
      this.menuIndex = i;
      this.topMenu = topMenu;
    },
    setDefaultRoutes(routes) {
      this.defaultRoutes = constantRoutes.concat(routes);
    },
    setTopbarRoutes(routes) {
      this.topbarRouters = routes;
      let menuData = routes[this.menuIndex], newTopMenu = [];
      if (menuData.children && menuData.children.length) {
        newTopMenu = menuData.children.map((item) => {
          item.path = item.path.includes(menuData.path)
            ? item.path
            : menuData.path + "/" + item.path;
          return item;
        });
      }
      this.topMenu = newTopMenu
    },
    setSidebarRouters(routes) {
      this.sidebarRouters = routes;
    },
    generateRoutes(roles) {
      return new Promise((resolve) => {
        getRouters().then((newres) => {
          let res = newres.RESULT
          res = formatRoutes(res);
          const sdata = JSON.parse(JSON.stringify(res));
          const rdata = JSON.parse(JSON.stringify(res));
          const defaultData = JSON.parse(JSON.stringify(res));
          const sidebarRoutes = filterAsyncRouter(sdata);
          const rewriteRoutes = filterAsyncRouter(rdata, false, true);
          const defaultRoutes = filterAsyncRouter(defaultData);
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
          asyncRoutes.forEach((route) => {
            router.addRoute(route);
          });
          this.setRoutes(rewriteRoutes);
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
          this.setDefaultRoutes(sidebarRoutes);
          this.setTopbarRoutes(defaultRoutes);
          resolve(rewriteRoutes);
        });
      });
    },
  },
});

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false, parentPath = '') {
  return asyncRouterMap.filter((route) => {
    route.name = route.PATH;
    route.meta = {};
    route.meta.title = route.NAME;
    route.meta.icon = route.META.VICON;
    route.meta.imgIcon = route.META.VIMG;
    route.meta.noCache = route.META.ISCACHE == '0'
    route.meta.BILLNO = route.BILLNO
    route.meta.ACTION = route.ACTION
    route.meta.PBILLNO = route.PBILLNO
    route.meta.COMP = route.COMPONENT
    route.meta.ISTEMPLATE = route.META.ISTEMPLATE

    route.meta.VURL = route.VURL
    if (!route.path) route.path = route.PATH;
    route.children = route.CHILDREN
    route.fullPath = parentPath + '/' + route.PATH

    if (type && route.children) {
      route.children = filterChildren(route.children, false, route.path);
    }

    if (route.COMPONENT) {
      // Layout ParentView 组件特殊处理
      if (route.COMPONENT === "Layout") {
        route.component = Layout;
      } else if (
        route.COMPONENT === "BlankView" ||
        route.COMPONENT === "ParentView"
      ) {
        route.component = ParentView;
      } else if (route.COMPONENT === "VTable" || route.COMPONENT === "VTableZtree" || route.COMPONENT === "VTableSub") {
        route.component = createCustomComponent(route.name, VTable);
      } else if (route.COMPONENT === "BatchTable") {
        route.component = () => import('@/views/table/index');
      } else if (route.COMPONENT === "SonTable") {
        route.component = () => import('@/views/sontable/sontable');
      } else if (route.COMPONENT === "VForm") {
        route.component = () => import('@/views/formPage/index');
      } else if (route.COMPONENT === "Link") {
        route.component = () => import('@/views/iframe/index');
      } else if (route.COMPONENT === "dashboard") {
        route.component = () => import('@/views/dashboard/public');
      } else if (route.COMPONENT === "999") {
        route.component = createCustomComponent(route.name, AsyncImport(route.VURL));
        // route.component = loadView(route.VURL)
      } else {
        route.component = AsyncImport(route.COMPONENT)
        // route.component = loadView(route.COMPONENT)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type, route.fullPath);
    } else {
      delete route["children"];
      delete route["redirect"];
      delete route["keyword"];
      delete route["type"];
    }
    return true;
  });
}

// 同一个组件生成不同名称的组件
function createCustomComponent(name, component) {
  return {
    name,
    data() {
      return { component: null }
    },
    async created() {
      if (component instanceof Promise) {
        try {
          const module = await component
          this.component = module?.default
        } catch (error) {
          console.error(`can not resolve component ${name}, error:`, error)
        }
        return
      }
      this.component = component
    },
    render(h) {
      return this.component ? createdNode(this.component) : null
    },
  }
}

function filterChildren(childrenMap, lastRouter = false, parentPath) {
  var children = [];
  childrenMap.forEach((el, index) => {
    if (el.CHILDREN && el.CHILDREN.length) {
      if (
        (el.COMPONENT === "BlankView" || el.COMPONENT === "ParentView") &&
        !lastRouter
      ) {
        el.CHILDREN.forEach((c) => {
          c.path = el.PATH + "/" + c.PATH;
          c.fullPath = parentPath + '/' + el.PATH + "/" + c.PATH
          if (c.CHILDREN && c.CHILDREN.length) {
            children = children.concat(filterChildren(c.CHILDREN, c, c.fullPath));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + "/" + el.PATH;
      el.fullPath = parentPath + '/' + el.PATH
    }
    children = children.concat(el);
  });
  return children;
}

// 格式化路由
function formatRoutes(Arr, C = 0) {
  Arr.forEach((item) => {
    item.component = "Layout";
    item.path = "/" + item.PATH;
  });
  return Arr;
}

// 处理路由的数据格式
function cloneRoutes(Arr) {
  Arr.forEach((item) => {
    item.meta.title = item.name;
    item.cname = item.name;
    item.name = item.path;
    if (item.children.length) {
      cloneRoutes(item.children);
    }
  });
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = [];
  routes.forEach((route) => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route);
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route);
      }
    }
  });
  return res;
}

export const loadView = (view) => {
  let res;
  for (const path in modules) {
    const dir = path.split("views/")[1].split(".vue")[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
};

export default usePermissionStore;
