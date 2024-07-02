import request from '@/utils/request'
import { CONTROLS, QueryCONTROLS, TableCONTROLS, QUERYTYPE, ALIGN, ENCRY, RULES, SLOT, TOTAL, VTYPE, FIXED, SWITCH, DEVICE } from "@/config"

export function templateList(data) {
  return request({
    url: "/sys/fieldConfig/getPageList",
    method: "post",
    data
  })
}

export function addTemplate(data) {
  return request({
    url: "/sys/fieldConfig/add",
    method: "post",
    data
  })
}

export function templateDetail(data) {
  return request({
    url: "/sys/fieldConfig/getDetail",
    method: "post",
    data
  })
}

export function delTemplate(data) {
  return request({
    url: "/sys/fieldConfig/deleteBatchIds",
    method: "post",
    data
  })
}

export const TableConfig_Form = [
  { FIELD: "LABEL", LABEL: "名称", WIDTH: "120", ALIGN: "", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, FIXED: "left", ISSHOW: 1, COL: 8 },
  { FIELD: "FIELD", LABEL: "主键", WIDTH: "120", ALIGN: "", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, FIXED: "", ISSHOW: 1, COL: 8 },
  { FIELD: "CONTROLS", LABEL: "控件", WIDTH: "100", ALIGN: "", CONTROLS: "ExSelect", VTYPE: 'exNum', OTHER: JSON.stringify(CONTROLS), EDITTABLE: 1, DEFAULTVAL: "", ISREQUIRE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "ISSHOW", LABEL: "显示", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", VTYPE: 'exNum', OTHER: JSON.stringify(SWITCH), EDITTABLE: 1, DEFAULTVAL: "1", ISSHOW: 1, COL: 8, ISSORT: 1 },
  { FIELD: "COL", LABEL: "列数", WIDTH: "80", ALIGN: "", CONTROLS: "ExNumber", EDITTABLE: 1, DEFAULTVAL: "12", ISSHOW: 1, ISREQUIRE: 1, COL: 8 },
  { FIELD: "ISREQUIRE", LABEL: "必填", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", VTYPE: 'exNum', OTHER: JSON.stringify(SWITCH), EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },
  { FIELD: "DEFAULTVAL", LABEL: "默认值", WIDTH: "100", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "OTHER", LABEL: "其他配置", WIDTH: "150", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "RULES", LABEL: "验证规则", WIDTH: "100", ALIGN: "", CONTROLS: "ExSelect", VTYPE: 'exNum', OTHER: JSON.stringify(RULES), EDITTABLE: 1, DEFAULTVAL: " ", ISSHOW: 1, COL: 8 },
  { FIELD: "RULESREG", LABEL: "自定义规则", WIDTH: "150", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "SUFFIX", LABEL: "后缀", WIDTH: "100", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, ISSHOW: 1, COL: 8 },
]
export const TableConfig_Qty = [
  { FIELD: "LABEL", LABEL: "名称", WIDTH: "120", ALIGN: "", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, FIXED: "left", ISSHOW: 1, COL: 8 },
  { FIELD: "FIELD", LABEL: "主键", WIDTH: "120", ALIGN: "", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, FIXED: "", ISSHOW: 1, COL: 8 },
  { FIELD: "CONTROLS", LABEL: "控件", WIDTH: "100", ALIGN: "", CONTROLS: "ExSelect", VTYPE: 'exNum', OTHER: JSON.stringify(QueryCONTROLS), EDITTABLE: 1, ISREQUIRE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "ISSHOW", LABEL: "显示", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", VTYPE: 'exNum', OTHER: JSON.stringify(SWITCH), EDITTABLE: 1, DEFAULTVAL: "1", ISSHOW: 1, COL: 8, ISSORT: 1 },
  { FIELD: "GROUPID", LABEL: "常用", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", VTYPE: 'exNum', OTHER: JSON.stringify(SWITCH), EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },
  { FIELD: "DEFAULTVAL", LABEL: "默认值", WIDTH: "100", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "QUERYTYPE", LABEL: "查询类型", WIDTH: "150", ALIGN: "", CONTROLS: "ExSelect", VTYPE: 'exNum', EDITTABLE: 1, OTHER: JSON.stringify(QUERYTYPE), DEFAULTVAL: "Like", ISSHOW: 1, COL: 8, ISREQUIRE: 1, },
  { FIELD: "OTHER", LABEL: "其他配置", WIDTH: "150", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
]
export const TableConfig_Table = [
  { FIELD: "LABEL", LABEL: "名称", WIDTH: "120", ALIGN: "", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, FIXED: "left", ISSHOW: 1, COL: 8 },
  { FIELD: "FIELD", LABEL: "主键", WIDTH: "120", ALIGN: "", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "WIDTH", LABEL: "宽度", WIDTH: "80", ALIGN: "", CONTROLS: "ExNumber", EDITTABLE: 1, DEFAULTVAL: "100", ISREQUIRE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "VTYPE", LABEL: "类型", WIDTH: "80", ALIGN: "", VTYPE: "exNum", CONTROLS: "ExSelect", VTYPE: "exNum", OTHER: JSON.stringify(VTYPE), EDITTABLE: 1, DEFAULTVAL: "0", ISREQUIRE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "ISSHOW", LABEL: "显示", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", VTYPE: 'exNum', OTHER: JSON.stringify(SWITCH), EDITTABLE: 1, DEFAULTVAL: "1", ISSHOW: 1, COL: 8, ISSORT: 1 },
  // { FIELD: "ISEDIT", LABEL: "编辑", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", VTYPE: 'exNum', OTHER: JSON.stringify(SWITCH), EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },
  { FIELD: "CONTROLS", LABEL: "控件", WIDTH: "100", ALIGN: "", CONTROLS: "ExSelect", VTYPE: 'exNum', OTHER: JSON.stringify(TableCONTROLS), EDITTABLE: 1, ISREQUIRE: 1, DEFAULTVAL: "ExReadCard", ISSHOW: 1, COL: 8 },
  // { FIELD: "DEFAULTVAL", LABEL: "默认值", WIDTH: "100", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "COL", LABEL: "列数", WIDTH: "80", ALIGN: "", CONTROLS: "ExNumber", EDITTABLE: 1, DEFAULTVAL: "12", ISSHOW: 1, ISREQUIRE: 1, COL: 8 },
  { FIELD: "ALIGN", LABEL: "对齐", WIDTH: "80", ALIGN: "center", VTYPE: "exNum", CONTROLS: "ExSelect", OTHER: JSON.stringify(ALIGN), EDITTABLE: 1, DEFAULTVAL: "left", ISSHOW: 1, COL: 8 },
  { FIELD: "OTHER", LABEL: "其他配置", WIDTH: "150", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 ,MAXLENGHT: 9999 },
  // { FIELD: "SLOT", LABEL: "插槽", WIDTH: "100", ALIGN: "", VTYPE: "exNum", CONTROLS: "ExSelect", OTHER: JSON.stringify(SLOT), EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  // { FIELD: "SLOTCFG", LABEL: "插槽配置", WIDTH: "100", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
  { FIELD: "ISREQUIRE", LABEL: "必填", WIDTH: "80", ALIGN: "", CONTROLS: "ExSwitch", VTYPE: 'exNum', OTHER: JSON.stringify(SWITCH), EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },
  { FIELD: "RULES", LABEL: "验证规则", WIDTH: "110", ALIGN: "", VTYPE: "exNum", CONTROLS: "ExSelect", OTHER: JSON.stringify(RULES), EDITTABLE: 1, DEFAULTVAL: " ", ISSHOW: 1, COL: 8 },
  { FIELD: "RULESREG", LABEL: "自定义规则", WIDTH: "100", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "SUFFIX", LABEL: "后缀", WIDTH: "100", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 1, ISSHOW: 1, COL: 8 },
]

export const QueryConfig = [
  { FIELD: "LABEL", LABEL: "名称", WIDTH: "100", ALIGN: "", VTYPE: "0", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "FIELD", LABEL: "主键", WIDTH: "100", ALIGN: "", VTYPE: "0", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, ISSHOW: 1, COL: 8 },
  { FIELD: "GROUPNO", LABEL: "类型", WIDTH: "100", ALIGN: "", VTYPE: "exNum", CONTROLS: "ExSelect", ISREQUIRE: 1, EDITTABLE: 1, OTHER: '[{"LABEL":"表单","VALUE":"FM"},{"LABEL":"表格","VALUE":"TAB"},{"LABEL":"查询","VALUE":"QRY"}]', ISSHOW: 1, COL: 8, },
]