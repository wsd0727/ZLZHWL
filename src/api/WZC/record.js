import request from '@/utils/request'

export function getList(data) {
  return request({
    url: "/base/bd-line/getPageList",
    method: "post",
    data
  })
}

export function getDetail(data) {
  return request({
    url: "/base/bd-line/getDetail",
    method: "post",
    data
  })
}

export function saveAdd(data) {
  return request({
    url: "/base/bd-line/add",
    method: "post",
    data
  })
}

export function saveEdit(data) {
  return request({
    url: "/base/bd-line/update",
    method: "post",
    data
  })
}

export function updateStatus(url, data) {
  return request({
    url,
    method: "post",
    data
  })
}

export function setDel(data) {
  return request({
    url: "/base/bd-line/deleteBatchIds",
    method: "post",
    data
  })
}

export const Config_Btn = [
  { ACTION: "ADD", COLOR: "primary", ISSHOW: "1", RATIO: "45%*50%", VNAME: "新增", VTYPE: "2", ISCHOOSE: "0", SCRNCONDITION: "" },
  { ACTION: "EDIT", COLOR: "primary", ISSHOW: "1", RATIO: "45%*50%", VNAME: "编辑", VTYPE: "2", ISCHOOSE: "1", ISTWOSURE: "0", SCRNCONDITION: "DATA.ENABLESTATE==1" },
  { ACTION: "DELETE", COLOR: "danger", ISSHOW: "1", RATIO: "60%*50%", VNAME: "删除", VTYPE: "3", ISCHOOSE: "2", ISTWOSURE: "1", SCRNCONDITION: "" },
  { ACTION: "EDIT", COLOR: "primary", ISSHOW: "1", RATIO: null, VNAME: "停用", VTYPE: "3", ISCHOOSE: "1", ISTWOSURE: "1", SCRNCONDITION: "DATA.ENABLESTATE!=1" },
  { ACTION: "EDIT", COLOR: "primary", ISSHOW: "1", RATIO: null, VNAME: "启用", VTYPE: "3", ISCHOOSE: "1", ISTWOSURE: "1", SCRNCONDITION: "DATA.ENABLESTATE==1" },
]

export const Config_Form = [
  { FIELD: "BILLNO", LABEL: "备注", COL: "12", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "0" },
  { FIELD: "VNAME", LABEL: "名称", COL: "12", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1", ISREQUIRE: "1" },
  { FIELD: "STARTADDRESS", LABEL: "起点", COL: "12", ALIGN: "left", CONTROLS: "ExArea", ISSHOW: "1", ISREQUIRE: "1", REVERFIELD: "STARTAREA", OTHER: "/a???STARTADDRESSNAME=dataNameSplit&STARTAREA=dataNameSplit&STARTADDRESS=data" },
  { FIELD: "STARTADDRESSNAME", LABEL: "起点名称", COL: "6", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "0" },
  { FIELD: "STARTAREA", LABEL: "起点所属区域", COL: "6", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "0" },
  { FIELD: "STARTAREACODE", LABEL: "起点所属区域编码", COL: "6", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "0" },
  { FIELD: "ENDADDRESS", LABEL: "终点", COL: "12", ALIGN: "left", CONTROLS: "ExArea", ISSHOW: "1", ISREQUIRE: "1", REVERFIELD: "ENDAREA", OTHER: "/a???ENDADDRESSNAME=dataNameSplit&ENDAREA=dataNameSplit&ENDADDRESS=data" },
  { FIELD: "ENDADDRESSNAME", LABEL: "终点名称", COL: "6", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "0" },
  { FIELD: "ENDAREA", LABEL: "终点所属区域", COL: "6", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "0" },
  { FIELD: "ENDAREACODE", LABEL: "终点所属区域编码", COL: "6", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "0" },
  { FIELD: "MILEAGE", LABEL: "里程", COL: "12", ALIGN: "left", CONTROLS: "ExNumber", MAXLENGHT: "9999", ISSHOW: "1", ISREQUIRE: "1", SUFFIX: "公里", RULES: "NumberFloat" },
  { FIELD: "TJSITEINFO", LABEL: "途经点", COL: "24", ALIGN: "left", CONTROLS: "slot", ISSHOW: "1", ISREQUIRE: "1" },
  { FIELD: "TJSITECODEINFO", LABEL: "途经点code信息", COL: "12", ALIGN: "left", CONTROLS: "slot", ISSHOW: "0" },
  { FIELD: "TRAPRICE", LABEL: "运输单价", COL: "12", ALIGN: "left", CONTROLS: "ExNumber", ISSHOW: "2" , LINKAGE: '{"ISSHOW":"Data.systemCode == \'ZLZHWL\' "}'},
  { FIELD: "VMEMO", LABEL: "备注", COL: "12", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1" },
]
export const Config_Query = [
  { FIELD: "VNAME", LABEL: "名称", COL: "6", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1", GROUPID: "1" },
  { FIELD: "STARTAREA", LABEL: "起点", COL: "6", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1", GROUPID: "1" },
  { FIELD: "ENDAREA", LABEL: "终点", COL: "6", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1", GROUPID: "1" },
  { FIELD: "TJSITEINFO", LABEL: "途经点", COL: "6", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1", GROUPID: "1" },
]

let status = [
  { "COLOR": "", "LABEL": "未启用", "DICTCODE": "enableState", "VALUE": "0" },
  { "COLOR": "", "LABEL": "启用", "DICTCODE": "enableState", "VALUE": "1" },
  { "COLOR": "danger", "LABEL": "停用", "DICTCODE": "enableState", "VALUE": "2" }
]

export const Config_Table = [
  { FIELD: "VDF", LABEL: "多选", WIDTH: "100", ALIGN: "left", CONTROLS: "ExReadCard", ISSHOW: "0", VTYPE: "checkbox" },
  { FIELD: "BILLNO", LABEL: "单据编号", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "0" },
  { FIELD: "VNAME", LABEL: "名称", WIDTH: "150", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1", VTYPE: "link" },
  { FIELD: "STARTAREA", LABEL: "起点", WIDTH: "200", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1" },
  { FIELD: "ENDAREA", LABEL: "终点", WIDTH: "200", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1" },
  { FIELD: "MILEAGE", LABEL: "里程", WIDTH: "100", ALIGN: "right", SUFFIX: "公里", CONTROLS: "ExTextBox", ISSHOW: "1" },
  { FIELD: "TJSITEINFO", LABEL: "途经点", WIDTH: "200", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1" },
  { FIELD: "ENABLESTATE", LABEL: "状态", WIDTH: "100", ALIGN: "center", CONTROLS: "ExTextBox", VTYPE: "exNum", ISSHOW: "1", OTHER: JSON.stringify(status) },
  { FIELD: "CREATIONTIME", LABEL: "创建时间", WIDTH: "180", ALIGN: "center", CONTROLS: "ExTextBox", ISSHOW: "1" },
  { FIELD: "CREATORNAME", LABEL: "创建人", WIDTH: "100", ALIGN: "center", CONTROLS: "ExTextBox", ISSHOW: "1" },
]

export const Config_TableZLZHWL = [
  { FIELD: "VDF", LABEL: "多选", WIDTH: "100", ALIGN: "left", CONTROLS: "ExReadCard", ISSHOW: "0", VTYPE: "checkbox" },
  { FIELD: "BILLNO", LABEL: "单据编号", WIDTH: "100", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "0" },
  { FIELD: "VNAME", LABEL: "名称", WIDTH: "150", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1", VTYPE: "link" },
  { FIELD: "STARTAREA", LABEL: "起点", WIDTH: "200", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1" },
  { FIELD: "ENDAREA", LABEL: "终点", WIDTH: "200", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1" },
  { FIELD: "MILEAGE", LABEL: "里程", WIDTH: "100", ALIGN: "right", SUFFIX: "公里", CONTROLS: "ExTextBox", ISSHOW: "1" },
  { FIELD: "TJSITEINFO", LABEL: "途经点", WIDTH: "200", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: "1" },
  { FIELD: "ENABLESTATE", LABEL: "状态", WIDTH: "100", ALIGN: "center", CONTROLS: "ExTextBox", VTYPE: "exNum", ISSHOW: "1", OTHER: JSON.stringify(status) },
  { FIELD: "TRAPRICE", LABEL: "运输单价", WIDTH: "100", ALIGN: "right", SUFFIX: "", CONTROLS: "ExTextBox", ISSHOW: "1" },
  { FIELD: "CREATIONTIME", LABEL: "创建时间", WIDTH: "180", ALIGN: "center", CONTROLS: "ExTextBox", ISSHOW: "1" },
  { FIELD: "CREATORNAME", LABEL: "创建人", WIDTH: "100", ALIGN: "center", CONTROLS: "ExTextBox", ISSHOW: "1" },
]