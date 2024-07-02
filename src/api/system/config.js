import request from '@/utils/request'
import { CONTROLS, ISSHOW, TableCONTROLS, QueryCONTROLS, QUERYTYPE, ALIGN, ENCRY, RULES, TOTAL, VTYPE, FIXED, BtnEventOptions, BtnColors, BtnChooseType, BtnPosion, BtnActionType, SLOT, modalSizes } from "@/config"

// 菜单树
export function TreeMenu(data) {
  return request({
    url: '/sys/module/getTreeList',
    method: 'post',
    data
  })
}
// 获取页面
export function MenuTabs(id) {
  return request({
    url: "/sys/pageConfig/getMenuPageList",
    method: "post",
    data: {
      PK_MODULE: id
    }
  })
}

// 获取页面详情
export function MenuTabsDetail(id) {
  return request({
    url: "/sys/pageConfig/getDetail",
    method: "post",
    data: {
      BILLNO: id
    }
  })
}

// 获取页面配置
export function MenuTabsConfigDetail(data) {
  return request({
    url: "/sys/pageConfigDtl/getList",
    method: "post",
    data
  })
}


// 左侧模板树结构
export function TreeTemplate(data) {
  return request({
    url: '/sys/customPage/getTreeList',
    method: 'post',
    data
  })
}

// 获取模板的页签
export function TemplateTabs(data) {
  return request({
    url: "/sys/customPage/getPageDtlByTmpId",
    method: "post",
    data
  })
}
// 保存模板配置数据
export function SaveTemplateConfig(data) {
  return request({
    url: "/sys/customPageDtl/add",
    method: "post",
    data
  })
}

// 获取模板配置
export function TemplateConfigDetail(data) {
  return request({
    url: "/sys/customPageDtl/getList",
    method: "post",
    data
  })
}

// 删除模板里面的列配置
export function delTemplateConfig(data) {
  return request({
    url: "/sys/customPageDtl/deleteBatchIds",
    method: "post",
    data
  })
}



// 删除页面配置
export function delMenuTabsConfig(data) {
  return request({
    url: "/sys/pageConfigDtl/deleteBatchIds",
    method: "post",
    data
  })
}

// 按钮tab 删除页面按钮
export function delMenuBtn(data) {
  return request({
    url: "/sys/button/deleteBatchIds",
    method: "post",
    data
  })
}

// 删除页面
export function MenuTabsDelete(data) {
  return request({
    url: "/sys/pageConfig/deleteBatchIds",
    method: "post",
    data
  })
}

// 新增页面
export function MenuTabsAdd(data) {
  return request({
    url: "/sys/pageConfig/add",
    method: "post",
    data
  })
}

export function SaveMenuTabsConfig(data) {
  return request({
    url: "/sys/pageConfigDtl/add",
    method: "post",
    data
  })
}

export function createdConfig(data) {
  return request({
    url: "/sys/pageConfig/oneKeyCreate",
    method: "post",
    data
  })
}

// 展示类型
const SWTP = [
  { LABEL: "全部展示", VALUE: "ABCD" },
  { LABEL: "企业客户承运商展示", VALUE: "ABC" },
  { LABEL: "企业客户展示", VALUE: "AB" },
  { LABEL: "企业展示", VALUE: "A" },
]
// 刷新方式
const IsRefresh = [
  { LABEL: "刷新页面", VALUE: "0" },
  { LABEL: "刷新当前数据", VALUE: "1" },
  { LABEL: "不刷新", VALUE: "2" },
]

// 页面中表格配置
export const TableConfig_Form = [
  { FIELD: "LABEL", LABEL: "名称", WIDTH: "120", ALIGN: "left",ISFIXED: "left", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, FIXED: "left", ISSHOW: 1, COL: 8 },
  { FIELD: "FIELD", LABEL: "主键", WIDTH: "120", ALIGN: "left",ISFIXED: "left", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, FIXED: "left", ISSHOW: 1, COL: 8 },
  { FIELD: "SORTCODE", LABEL: "排序", WIDTH: "100", ALIGN: "center", CONTROLS: "ExNumber", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8, ISSORT: 1, ISREQUIRE: 1, LINKAGE: "{\"POINT\":\"0\"}" },
  { FIELD: "CONTROLS", LABEL: "控件", WIDTH: "100", ALIGN: "left", CONTROLS: "ExSelect", OTHER: JSON.stringify(CONTROLS), EDITTABLE: 1, DEFAULTVAL: "", ISREQUIRE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "ISSHOW", LABEL: "显示", WIDTH: "80", ALIGN: "", CONTROLS: "ExSelect", OTHER: JSON.stringify(ISSHOW), EDITTABLE: 1, DEFAULTVAL: "1", ISSHOW: 1, COL: 8, ISSORT: 1, SLOT: "tags" },
  { FIELD: "COL", LABEL: "列数", WIDTH: "80", ALIGN: "left", CONTROLS: "ExNumber", EDITTABLE: 1, DEFAULTVAL: "12", MAXLENGTH: 24, ISSHOW: 1, ISREQUIRE: 1, COL: 8 },
  { FIELD: "ISREQUIRE", LABEL: "必填", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },
  { FIELD: "DEFAULTVAL", LABEL: "默认值", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "MAXLENGTH", LABEL: "最大长度", WIDTH: "100", ALIGN: "left", CONTROLS: "ExNumber", EDITTABLE: 1, OTHER: "", DEFAULTVAL: "100", ISSHOW: 1, COL: 8, },
  { FIELD: "REVERFIELD", LABEL: "映射", WIDTH: "100", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, OTHER: '', DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "OTHER", LABEL: "其他配置", WIDTH: "150", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8, LINKAGE: "TRIM" },
  { FIELD: "SLOTCFG", LABEL: "插槽配置", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "LINKAGE", LABEL: "级联", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "ISDISABLED", LABEL: "禁用", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8, ISSORT: 1 },
  { FIELD: "ISAES", LABEL: "加密", WIDTH: "100", ALIGN: "", CONTROLS: "ExSelect", OTHER: JSON.stringify(ENCRY), EDITTABLE: 1, DEFAULTVAL: "-", ISSHOW: 1, COL: 8 },
  { FIELD: "RULES", LABEL: "验证规则", WIDTH: "100", ALIGN: "left", CONTROLS: "ExSelect", OTHER: JSON.stringify(RULES), EDITTABLE: 1, DEFAULTVAL: " ", ISSHOW: 1, COL: 8 },
  { FIELD: "RULESREG", LABEL: "自定义规则", WIDTH: "150", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "SUFFIX", LABEL: "后缀", WIDTH: "100", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "LABELDESC", LABEL: "标题描述", WIDTH: "100", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, ISSHOW: 1, COL: 8 },

]
export const TableConfig_Qty = [
  { FIELD: "LABEL", LABEL: "名称", WIDTH: "120", ALIGN: "left",ISFIXED: "left", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, FIXED: "left", ISSHOW: 1, COL: 8 },
  { FIELD: "FIELD", LABEL: "主键", WIDTH: "120", ALIGN: "left",ISFIXED: "left", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, FIXED: "left", ISSHOW: 1, COL: 8 },
  { FIELD: "SORTCODE", LABEL: "排序", WIDTH: "100", ALIGN: "center", CONTROLS: "ExNumber", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8, ISSORT: 1, ISREQUIRE: 1, LINKAGE: "{\"POINT\":\"0\"}" },
  { FIELD: "QUERYSORTCODE", LABEL: "查询排序", WIDTH: "100", ALIGN: "center", CONTROLS: "ExNumber", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8, ISSORT: 1, ISREQUIRE: 0, LINKAGE: "{\"POINT\":\"0\"}" },
  { FIELD: "CONTROLS", LABEL: "控件", WIDTH: "100", ALIGN: "left", CONTROLS: "ExSelect", OTHER: JSON.stringify(CONTROLS), EDITTABLE: 1, ISREQUIRE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "COL", LABEL: "列数", WIDTH: "80", ALIGN: "left", CONTROLS: "ExNumber", EDITTABLE: 1, DEFAULTVAL: "4", MAXLENGTH: 24, ISSHOW: 1, ISREQUIRE: 1, COL: 8 },
  { FIELD: "ISSHOW", LABEL: "显示", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", EDITTABLE: 1, DEFAULTVAL: "1", ISSHOW: 1, COL: 8, ISSORT: 1 },
  { FIELD: "GROUPID", LABEL: "常用", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },
  { FIELD: "ISAES", LABEL: "加密", WIDTH: "100", ALIGN: "", CONTROLS: "ExSelect", OTHER: JSON.stringify(ENCRY), EDITTABLE: 1, DEFAULTVAL: "-", ISSHOW: 1, COL: 8 },
  { FIELD: "SLOT", LABEL: "自动查询", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },
  { FIELD: "DEFAULTVAL", LABEL: "默认值", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "MAXLENGTH", LABEL: "最大长度", WIDTH: "100", ALIGN: "left", CONTROLS: "ExNumber", EDITTABLE: 1, OTHER: "", DEFAULTVAL: "100", ISSHOW: 1, COL: 8, },
  { FIELD: "REVERFIELD", LABEL: "映射", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, OTHER: '', DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "QUERYTYPE", LABEL: "查询类型", WIDTH: "150", ALIGN: "left", CONTROLS: "ExSelect", EDITTABLE: 1, OTHER: JSON.stringify(QUERYTYPE), DEFAULTVAL: "Like", ISSHOW: 1, COL: 8, ISREQUIRE: 1, },
  { FIELD: "ISAES", LABEL: "加密", WIDTH: "100", ALIGN: "", CONTROLS: "ExSelect", OTHER: JSON.stringify(ENCRY), EDITTABLE: 1, DEFAULTVAL: "-", ISSHOW: 1, COL: 8 },
  { FIELD: "LINKAGE", LABEL: "级联", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "OTHER", LABEL: "其他配置", WIDTH: "150", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8, LINKAGE: "TRIM", MAXLENGHT: "9999", },
  { FIELD: "SLOTCFG", LABEL: "插槽配置", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
]

export const TableConfig_Table = [
  { FIELD: "LABEL", LABEL: "名称", WIDTH: "120", ALIGN: "left",ISFIXED: "left", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, FIXED: "left", ISSHOW: 1, COL: 8 },
  { FIELD: "FIELD", LABEL: "主键", WIDTH: "120", ALIGN: "left",ISFIXED: "left", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, FIXED: "left", ISSHOW: 1, COL: 8 },
  { FIELD: "SORTCODE", LABEL: "排序", WIDTH: "100", ALIGN: "center", CONTROLS: "ExNumber", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8, ISSORT: 1, ISREQUIRE: 1, LINKAGE: "{\"POINT\":\"0\"}" },
  { FIELD: "WIDTH", LABEL: "宽度", WIDTH: "80", ALIGN: "left", CONTROLS: "ExNumber", EDITTABLE: 1, MAXLENGHT: "9999", DEFAULTVAL: "100", ISREQUIRE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "VTYPE", LABEL: "类型", WIDTH: "80", ALIGN: "left", VTYPE: "exNum", CONTROLS: "ExSelect", VTYPE: "exNum", OTHER: JSON.stringify(VTYPE), EDITTABLE: 1, DEFAULTVAL: "0", ISREQUIRE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "ISSHOW", LABEL: "显示", WIDTH: "80", ALIGN: "", CONTROLS: "ExSelect", OTHER: JSON.stringify(ISSHOW), EDITTABLE: 1, DEFAULTVAL: "1", ISSHOW: 1, COL: 8, ISSORT: 1, SLOT: "tags" },
  { FIELD: "ISEDIT", LABEL: "编辑", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },
  { FIELD: "CONTROLS", LABEL: "控件", WIDTH: "100", ALIGN: "left", CONTROLS: "ExSelect", OTHER: JSON.stringify(TableCONTROLS), EDITTABLE: 1, ISREQUIRE: 1, DEFAULTVAL: "ExReadCard", ISSHOW: 1, COL: 8 },
  { FIELD: "DEFAULTVAL", LABEL: "默认值", WIDTH: "100", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "MAXLENGTH", LABEL: "最大长度", WIDTH: "100", ALIGN: "left", CONTROLS: "ExNumber", EDITTABLE: 1, OTHER: "", DEFAULTVAL: "", ISSHOW: 1, COL: 8, },
  { FIELD: "COL", LABEL: "列数", WIDTH: "80", ALIGN: "left", CONTROLS: "ExNumber", EDITTABLE: 1, DEFAULTVAL: "12", MAXLENGTH: 24, ISSHOW: 1, ISREQUIRE: 1, COL: 8 },
  { FIELD: "ALIGN", LABEL: "对齐", WIDTH: "100", ALIGN: "center", VTYPE: "exNum", CONTROLS: "ExSelect", OTHER: JSON.stringify(ALIGN), EDITTABLE: 1, DEFAULTVAL: "left", ISSHOW: 1, COL: 8 },
  { FIELD: "OTHER", LABEL: "其他配置", WIDTH: "150", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8, LINKAGE: "TRIM", MAXLENGHT: "9999" },
  { FIELD: "REVERFIELD", LABEL: "映射", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, OTHER: '', DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "LINKAGE", LABEL: "级联", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "ISAES", LABEL: "加密", WIDTH: "100", ALIGN: "", VTYPE: "exNum", CONTROLS: "ExSelect", OTHER: JSON.stringify(ENCRY), EDITTABLE: 1, DEFAULTVAL: "-", ISSHOW: 1, COL: 8 },
  { FIELD: "SLOT", LABEL: "插槽", WIDTH: "100", ALIGN: "left", VTYPE: "exNum", CONTROLS: "ExSelect", OTHER: JSON.stringify(SLOT), EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "SLOTCFG", LABEL: "插槽配置", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "ISREQUIRE", LABEL: "必填", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },
  { FIELD: "RULES", LABEL: "验证规则", WIDTH: "110", ALIGN: "", VTYPE: "exNum", CONTROLS: "ExSelect", OTHER: JSON.stringify(RULES), EDITTABLE: 1, DEFAULTVAL: " ", ISSHOW: 1, COL: 8 },
  { FIELD: "RULESREG", LABEL: "自定义规则", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "SORTRULE", LABEL: "排序规则", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "ISONLY", LABEL: "唯一", WIDTH: "80", ALIGN: "center", CONTROLS: "ExSwitch", EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },
  { FIELD: "ISMERGE", LABEL: "合并", WIDTH: "80", ALIGN: "center", CONTROLS: "ExSwitch", EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },
  { FIELD: "ISEXPORT", LABEL: "导出", WIDTH: "80", ALIGN: "center", CONTROLS: "ExSwitch", EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },
  { FIELD: "SCRNCONDITION", LABEL: "禁用条件", WIDTH: "110", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: " ", ISSHOW: 1, COL: 8 },
  { FIELD: "SUFFIX", LABEL: "后缀", WIDTH: "100", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "TOTALTYPE", LABEL: "合计", WIDTH: "100", ALIGN: "", VTYPE: "exNum", CONTROLS: "ExSelect", OTHER: JSON.stringify(TOTAL), EDITTABLE: 1, DEFAULTVAL: "-", ISSHOW: 1, COL: 8 },
  { FIELD: "ISFIXED", LABEL: "冻结列", WIDTH: "100", ALIGN: "", VTYPE: "exNum", CONTROLS: "ExSelect", OTHER: JSON.stringify(FIXED), EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "DISPLAYTYPE", LABEL: "展示类型", WIDTH: "100", ALIGN: "", VTYPE: "exNum", CONTROLS: "ExSelect", OTHER: JSON.stringify(SWTP), EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "LINESTYLE", LABEL: "表格风格", WIDTH: "200", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  // { FIELD: "CARDSTYLE", LABEL: "卡片风格", WIDTH: "200", ALIGN: "left", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
]
export const TableConfig_Btn = [
  { FIELD: "VNAME", LABEL: "名称", ALIGN: "left",ISFIXED: "left", WIDTH: "120", EDITTABLE: 1, CONTROLS: "ExTextBox", ISSHOW: 1, COL: 8, FIXED: "left", ISREQUIRE: 1, },
  { FIELD: "VTYPE", LABEL: "类型", ALIGN: "left",ISFIXED: "left", WIDTH: "120", EDITTABLE: 1, CONTROLS: "ExSelect", OTHER: JSON.stringify(BtnEventOptions), ISSHOW: 1, COL: 8, FIXED: "left", ISREQUIRE: 1, },
  { FIELD: "BILLNO", LABEL: "编号", WIDTH: "120", ALIGN: "", CONTROLS: "", ISREQUIRE: 0, EDITTABLE: 0, ISSHOW: 1, COL: 8 },
  { FIELD: "SORTCODE", LABEL: "排序", WIDTH: "80", ALIGN: "", EDITTABLE: 1, CONTROLS: "ExNumber", ISSHOW: 1, COL: 8, ISREQUIRE: 1, },
  { FIELD: "COLOR", LABEL: "颜色", ALIGN: "", WIDTH: "80", EDITTABLE: 1, CONTROLS: "ExSelect", OTHER: JSON.stringify(BtnColors), ISSHOW: 1, COL: 8 },
  { FIELD: "ACTION", LABEL: "动作", WIDTH: "100", ALIGN: "", EDITTABLE: 1, CONTROLS: "ExSelect", OTHER: JSON.stringify(BtnActionType), ISSHOW: 1, COL: 8, ISREQUIRE: 1, },
  { FIELD: "PK_PARENT", LABEL: "所属页面", WIDTH: "100", ALIGN: "", EDITTABLE: 1, CONTROLS: "slot", ISSHOW: 1, COL: 8, ISREQUIRE: 1, },
  { FIELD: "PK_PAGE", LABEL: "操作页面", WIDTH: "100", ALIGN: "", EDITTABLE: 1, CONTROLS: "slot", ISSHOW: 1, COL: 8, ISREQUIRE: 1, },
  { FIELD: "RATIO", LABEL: "弹窗大小", WIDTH: "100", ALIGN: "", EDITTABLE: 1, CONTROLS: "ExSelect", ISSHOW: 1, COL: 8, OTHER: JSON.stringify(modalSizes) },
  { FIELD: "ACTIONADDRESS", LABEL: "接口地址", WIDTH: "120", ALIGN: "left", EDITTABLE: 1, CONTROLS: "ExTextBox", ISSHOW: 1, COL: 8 },
  { FIELD: "ISCHOOSE", LABEL: "依赖类型", ALIGN: "", WIDTH: "100", EDITTABLE: 1, CONTROLS: "ExSelect", OTHER: JSON.stringify(BtnChooseType), ISSHOW: 1, COL: 8 },
  { FIELD: "ISOFTEN", LABEL: "常用", WIDTH: "80", ALIGN: "", EDITTABLE: 1, CONTROLS: "ExSwitch", ISSHOW: 1, COL: 8, DEFAULTVAL: "0", },
  { FIELD: "POSITION", LABEL: "位置", WIDTH: "80", ALIGN: "", EDITTABLE: 1, CONTROLS: "ExSelect", OTHER: JSON.stringify(BtnPosion), ISSHOW: 1, COL: 8, DEFAULTVAL: "0", },
  { FIELD: "ISREFRESH", LABEL: "刷新方式", WIDTH: "80", ALIGN: "", EDITTABLE: 1, CONTROLS: "ExSelect", OTHER: JSON.stringify(IsRefresh), ISSHOW: 1, COL: 8, DEFAULTVAL: "0", },
  { FIELD: "ISSHOW", LABEL: "显示", WIDTH: "80", ALIGN: "", EDITTABLE: 1, CONTROLS: "ExSelect", OTHER: JSON.stringify(ISSHOW), ISSHOW: 1, COL: 8, DEFAULTVAL: "1", SLOT: "tags" },
  { FIELD: "ISTWOSURE", LABEL: "二次确认", WIDTH: "100", ALIGN: "", EDITTABLE: 1, CONTROLS: "ExSwitch", ISSHOW: 1, COL: 8, DEFAULTVAL: "0", },
  { FIELD: "BTNTITLE", LABEL: "描述", WIDTH: "100", ALIGN: "left", EDITTABLE: 1, CONTROLS: "ExTextBox", ISSHOW: 1, COL: 8 },
  { FIELD: "GROUPID", LABEL: "分组", WIDTH: "100", ALIGN: "", EDITTABLE: 1, CONTROLS: "slot", ISSHOW: 1, COL: 8 },
  { FIELD: "SCRNCONDITION", LABEL: "禁用条件", WIDTH: "150", ALIGN: "", EDITTABLE: 1, CONTROLS: "ExTextBox", ISSHOW: 1, COL: 8 },
  { FIELD: "PAGEPATH", LABEL: "自定义", WIDTH: "150", ALIGN: "left", EDITTABLE: 1, CONTROLS: "ExTextBox", ISSHOW: 1, COL: 8, },
  { FIELD: "APPLETOTHER", LABEL: "小程序自定义", WIDTH: "150", ALIGN: "left", EDITTABLE: 1, CONTROLS: "ExTextBox", ISSHOW: 1, COL: 8, },
  { FIELD: "OTHER", LABEL: "其他配置", WIDTH: "150", ALIGN: "left", EDITTABLE: 1, CONTROLS: "ExTextBox", ISSHOW: 1, COL: 8, LINKAGE: "TRIM" },
  { FIELD: "CHOOSE2SUB", LABEL: "选中数据给子表", WIDTH: "150", ALIGN: "left", EDITTABLE: 1, CONTROLS: "ExTextBox", ISSHOW: 1, COL: 8, },
];

const GRID = [{ LABEL: "5-5", VALUE: "5:5" }, { LABEL: "6-4", VALUE: "6:4" }, { LABEL: "7-3", VALUE: "7:3" }]

// 页面中表单配置

const TABLESTYLEoptions = [
  { LABEL: "默认", VALUE: "0" },
  { LABEL: "线型", VALUE: "1" },
  { LABEL: "卡片", VALUE: "2" },
]

const pageSizeOptions = [
  { LABEL: "10", VALUE: "10" },
  { LABEL: "20", VALUE: "20" },
  { LABEL: "30", VALUE: "30" },
  { LABEL: "50", VALUE: "50" },
  { LABEL: "100", VALUE: "100" },
  { LABEL: "500", VALUE: "500" },
  { LABEL: "1000", VALUE: "1000" },
]

const heightOptions = [
  { LABEL: "3", VALUE: "3" },
  { LABEL: "5", VALUE: "5" },
  { LABEL: "10", VALUE: "10" },
  { LABEL: "20", VALUE: "20" },
]

export const FormConfig = [
  { SORTCODE: 1, FIELD: "PK_MODULE", LABEL: "菜单", COL: 8, CONTROLS: "ExSelectGroup", ISREQUIRE: 1, ISSHOW: 1, OTHER: "/sys/module/getTreeList???MODULENAME=LABEL", REVERFIELD: "MODULENAME" },
  { SORTCODE: 2, FIELD: "VNAME", LABEL: "名称", COL: 8, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { ISCY: true, FIELD: "VCODE", LABEL: "编码", COL: 8, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, },
  { SORTCODE: 4, FIELD: "GROUPNO", LABEL: "页面类型", COL: 8, CONTROLS: "ExRadio", ISREQUIRE: 1, ISSHOW: 1, OTHER: '[{"LABEL":"表单","VALUE":"FM"},{"LABEL":"表格","VALUE":"TAB"}]', DEFAULTVAL: "FM" },
  { ISCY: true, SORTCODE: 5, FIELD: "TBVWID", LABEL: "关联表", REVERFIELD: "TBVWNAME", COL: 12, CONTROLS: "ExSelectSearch", ISREQUIRE: 1, ISSHOW: 1, OTHER: '/sys/sysTable/getTableList???TBVWNAME=LABEL', DEFAULTVAL: "", },
  { ISCY: true, FIELD: "SLOTCFG", LABEL: "插槽配置", COL: 8, CONTROLS: "ExTextBox", ISSHOW: 1, OTHER: "", },
  { SORTCODE: 6, FIELD: "CODERULE", LABEL: "单据编码", COL: 8, CONTROLS: "ExSelectSearch", ISREQUIRE: 0, ISSHOW: 1, OTHER: '', DEFAULTVAL: "" },
  { SORTCODE: 7, FIELD: "DEFAULTSORT", LABEL: "默认排序", COL: 8, CONTROLS: "ExTextBox", ISREQUIRE: 0, ISSHOW: "1", OTHER: '', DEFAULTVAL: "", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}" },
  { FIELD: "ISTREE", LABEL: "树表格", COL: 8, CONTROLS: "ExTextBox", ISSHOW: "2", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}" },
  { FIELD: "VDEF2", LABEL: "标题宽", COL: 8, CONTROLS: "ExTextBox", ISSHOW: "2", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='FM'\"}" },
  { FIELD: "ISPAGE", LABEL: "子表分页", COL: 4, CONTROLS: "ExSwitch", ISSHOW: "2", DEFAULTVAL: "1", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}" },
  { FIELD: "ISTBSELECT", LABEL: "表头筛选", COL: 4, CONTROLS: "ExSwitch", ISSHOW: "2", DEFAULTVAL: "1", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}" },
  { FIELD: "ISADAPTION", LABEL: "列宽自适应", COL: 4, CONTROLS: "ExSwitch", ISSHOW: "2", DEFAULTVAL: "1", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}" },
  { FIELD: "ISSONTABLE", LABEL: "批量编辑", COL: 4, CONTROLS: "ExSwitch", ISSHOW: "2", DEFAULTVAL: "1", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}" },

  { FIELD: "EDITMODAL", LABEL: "编辑模式", COL: 8, CONTROLS: "ExTextBox", ISSHOW: "2", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}", LABELDESC: "可编辑表格的模式支持： row,form,modal" },
  { FIELD: "PAGETITLE", LABEL: "页面标题", COL: 8, CONTROLS: "ExTextBox", ISSHOW: "1", DEFAULTVAL: "", LINKAGE: "" },
  { FIELD: "TABLESTYLE", LABEL: "表格风格", COL: 8, CONTROLS: "ExSelect", ISSHOW: "2", OTHER: JSON.stringify(TABLESTYLEoptions), DEFAULTVAL: "1", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}" },
  { FIELD: "MODALTYPE", LABEL: "默认风格", COL: 8, CONTROLS: "ExSelect", ISSHOW: "2", OTHER: JSON.stringify(TABLESTYLEoptions), DEFAULTVAL: "1", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}" },
  { FIELD: "GRID", LABEL: "栅格", COL: 8, CONTROLS: "ExSelect", ISSHOW: "2", DEFAULTVAL: "0", OTHER: JSON.stringify(GRID), LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='FM'\"}" },
  { FIELD: "PAGESIZE", LABEL: "默认条数", COL: 8, CONTROLS: "ExSelect", ISSHOW: "2", OTHER: JSON.stringify(pageSizeOptions), DEFAULTVAL: "1", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}" },
  { FIELD: "TABLEHEIGHT", LABEL: "表格宽高", COL: 8, CONTROLS: "ExTextBox", ISSHOW: "2", OTHER: '', DEFAULTVAL: "1", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}", LABELDESC: "上下布局：表格的高度(px)；左右布局：表格宽度(%)；" },
  { FIELD: "VDEF3", LABEL: "高级查询", COL: 8, CONTROLS: "ExSwitch", ISSHOW: "2", OTHER: '', DEFAULTVAL: "0", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}", LABELDESC: "启用高级自定义查询" },
  { FIELD: "VDEF4", LABEL: "展开查询", COL: 8, CONTROLS: "ExSwitch", ISSHOW: "2", OTHER: '', DEFAULTVAL: "0", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}", LABELDESC: "展开查询条件2行" },
  { FIELD: "ISSUB", LABEL: "左右布局", COL: 8, CONTROLS: "ExSwitch", ISSHOW: "2", OTHER: '', DEFAULTVAL: "0", LINKAGE: "{\"ISSHOW\":\"Data.GROUPNO=='TAB'\"}", LABELDESC: "主子表布局方式：否为上下，是为左右" },
  { SORTCODE: 8, FIELD: "VMEMO", LABEL: "备注", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 0, ISSHOW: 1, OTHER: '', DEFAULTVAL: "" },
]