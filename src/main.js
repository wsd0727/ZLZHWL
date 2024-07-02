import { createApp } from "vue";
import "@/assets/styles/index.scss"; // global css
import 'element-plus/dist/index.css'
import "vue3-tree-org/lib/vue3-tree-org.css";
// import 'element-plus/theme-chalk/dark/css-vars.css'

import App from "./App";
import store from "./store";
import router from "./router";
import directive from "./directive"; // directive
import "vxe-table/lib/style.css";
import VXETable from "vxe-table";
import VXETablePluginElement from "vxe-table-plugin-element";
VXETable.use(VXETablePluginElement);

// 获取静态图片资源
import { getAssetsFile } from "@/utils";

// 注册指令
import plugins from "./plugins"; // plugins
import { download } from "@/utils/request";

// svg图标
import "virtual:svg-icons-register";
import SvgIcon from "@/components/SvgIcon";
import elementIcons from "@/components/SvgIcon/svgicon";

import "./permission"; // permission control

import request from "@/utils/request";
import { useDict } from "@/utils/dict";

import {
  parseTime,
  resetForm,
  addDateRange,
  handleTree,
  selectDictLabel,
  selectDictLabels,
} from "@/utils/ruoyi";

import "font-awesome/css/font-awesome.min.css"; // 加载fontawesome图标
import ganttastic from "@infectoone/vue-ganttastic";

// 溯源组织结构
import vue3TreeOrg from 'vue3-tree-org';

// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar";
// 文件上传组件
import FileUpload from "@/components/FileUpload";
// 图片上传组件
import ImageUpload from "@/components/ImageUpload";
// 图片预览组件
import ImagePreview from "@/components/ImagePreview";
// 自定义树选择组件
// import TreeSelect from "@/components/TreeSelect";
// 字典标签组件
import DictTag from "@/components/DictTag";

// VueGridLayout
import VueGridLayout from 'vue-grid-layout'

//引入vue-echarts
import VueEcharts from 'vue-echarts'


const app = createApp(App);

// 全局方法挂载
app.config.globalProperties.useDict = useDict;
app.config.globalProperties.download = download;
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.resetForm = resetForm;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.getAssetsFile = getAssetsFile;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.selectDictLabels = selectDictLabels;
app.config.globalProperties.request = request;

// 全局组件挂载
app.component("DictTag", DictTag);
app.component("Pagination", Pagination);
// app.component("TreeSelect", TreeSelect);
app.component("FileUpload", FileUpload);
app.component("ImageUpload", ImageUpload);
app.component("ImagePreview", ImagePreview);
app.component("RightToolbar", RightToolbar);

app.use(vue3TreeOrg)
app.use(VueGridLayout);
app.use(ganttastic);
app.use(VXETable);
app.use(router);
app.use(store);
app.use(plugins);
app.use(elementIcons);
app.component("svg-icon", SvgIcon);
app.component('v-chart', VueEcharts)
directive(app);

app.mount("#app");
