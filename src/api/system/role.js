import request from '@/utils/request'
import { ENABLESTATE, SWITCH, DEVICE } from "@/config"

// 查询角色列表
export function RoleList(data) {
  return request({
    url: '/sys/role/getPageList',
    method: 'post',
    data
  })
}

// 查询角色详细
export function RoleDetail(data) {
  return request({
    url: '/sys/role/getDetail',
    method: "post",
    data
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role/add',
    method: 'post',
    data
  })
}

// 修改角色
export function editRole(data) {
  return request({
    url: '/sys/role/update',
    method: 'post',
    data
  })
}

// 删除角色
export function delRole(data) {
  return request({
    url: '/sys/role/deleteBatchIds',
    method: 'post',
    data
  })
}

// 查询 对应终端的 菜单树
export function getMENUBENTree(data) {
  return request({
    url: "/sys/module/getRoleTreeList",
    method: "post",
    data
  })
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: '/system/role/authUser/allocatedList',
    method: 'get',
    params: query
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: '/system/role/authUser/unallocatedList',
    method: 'get',
    params: query
  })
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request({
    url: '/system/role/authUser/cancel',
    method: 'put',
    data: data
  })
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
  return request({
    url: '/system/role/authUser/cancelAll',
    method: 'put',
    params: data
  })
}

// 授权用户选择
export function authUserSelectAll(data) {
  return request({
    url: '/system/role/authUser/selectAll',
    method: 'put',
    params: data
  })
}

// 根据角色ID查询部门树结构
export function deptTreeSelect(roleId) {
  return request({
    url: '/system/role/deptTree/' + roleId,
    method: 'get'
  })
}

// 查询角色对应用户列表
export function getUserPageListByPk_role(data) {
  return request({
    url: "/sys/userType/getUserPageListByPk_role",
    method: "post",
    data
  })
}

export function getPanelList(data) {
  return request({
    url: "cardDialogConf/getPanelList",
    method: "post",
    data
  })
}



// 页面中表单配置
export const FormConfig = [
  { FIELD: "VNAME", LABEL: "名称", COL: 24, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, MAXLENGTH: "20", OTHER: "", MAXLENGTH: 20 },
  { FIELD: "VCODE", LABEL: "编码", COL: 24, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, MAXLENGTH: "20", OTHER: "", MAXLENGTH: 20 },
  { FIELD: "VTYPE", LABEL: "类型", COL: 12, CONTROLS: "ExSelect", ISREQUIRE: 1, ISSHOW: 1, OTHER: '', DEFAULTVAL: "0" },
  { FIELD: "BILLFROM", LABEL: "终端", COL: 12, CONTROLS: "ExSelect", ISREQUIRE: 0, ISSHOW: 1, OTHER: '', DEFAULTVAL: "" },
  { FIELD: "ENABLESTATE", LABEL: "状态", COL: 12, CONTROLS: "ExSelect", ISREQUIRE: 1, ISSHOW: 1, OTHER: JSON.stringify(ENABLESTATE), DEFAULTVAL: "0" },
  { FIELD: "DATASCOPE", LABEL: "数据范围", COL: 24, CONTROLS: "ExSelect", ISREQUIRE: 1, ISSHOW: 1, OTHER: '[{"LABEL":"授权企业或者下级企业权限","VALUE":"1"},{"LABEL":"用户所属企业权限","VALUE":"2"},{"LABEL":"用户所属部门权限","VALUE":"3"},{"LABEL":"用户所属部门及下级部门权限","VALUE":"4"},{"LABEL":"限个人","VALUE":"5"}]', DEFAULTVAL: "2" },
  { FIELD: "ISDELETE", LABEL: "可删除", COL: 12, CONTROLS: "ExSwitch", ISSHOW: 1, OTHER: "", DEFAULTVAL: "1" },
  { FIELD: "ISDEFAULT", LABEL: "默认", COL: 12, CONTROLS: "ExSwitch", ISSHOW: 1, OTHER: "", DEFAULTVAL: "0" },
  { FIELD: "PANELID", LABEL: "工作台", COL: 12, CONTROLS: "slot", ISSHOW: 1, },
  { FIELD: "VMEMO", LABEL: "备注", COL: 24, CONTROLS: "ExTextBox", ISSHOW: 1, OTHER: "", MAXLENGTH: "200" },
]

export const RFormConfig = [
  { FIELD: "MENULIST", LABEL: "菜单权限", COL: 24, CONTROLS: "slot", ISSHOW: 1, } // MENU 菜单, BTN 按钮, ISMENU?0-否1-是
]

export const VTYPE = [{ "LABEL": "平台", "VALUE": "0" }, { "LABEL": "司机", "VALUE": "1" }, { "LABEL": "承运商", "VALUE": "2" }, { "LABEL": "供应商", "VALUE": "3" }, { "LABEL": "客户", "VALUE": "4" }]

export const TableConfig = [
  { FIELD: "VNAME", LABEL: "名称", WIDTH: 150, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "VCODE", LABEL: "编码", WIDTH: 150, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "VTYPE", LABEL: "类型", WIDTH: 100, ALIGN: "center", VTYPE: "exNum", OTHER: JSON.stringify(VTYPE), ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "BILLFROM", LABEL: "终端", WIDTH: 100, ALIGN: "center", VTYPE: "exNum", OTHER: JSON.stringify(DEVICE), ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "ENABLESTATE", LABEL: "状态", WIDTH: 100, ALIGN: "center", VTYPE: "exNum", OTHER: JSON.stringify(ENABLESTATE), ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "ISDEFAULT", LABEL: "默认角色", WIDTH: 100, ALIGN: "center", VTYPE: "exNum", OTHER: JSON.stringify(SWITCH), ISSHOW: 1, SELECTEDFLAG: 1 },
]

export const AuthorizedTableConfig = [
  { FIELD: "VNAME", LABEL: "姓名", WIDTH: 100, ALIGN: "center", },
  { FIELD: "USERNAME", LABEL: "账号", WIDTH: 100, ALIGN: "left", },
  { FIELD: "VSEX", LABEL: "性别", WIDTH: 80, ALIGN: "center", VTYPE: "exNum", OTHER: '[{"LABEL":"男","VALUE":"0"},{"LABEL":"女","VALUE":"1"}]' },
  // { FIELD: "VTYPE", LABEL: "账户类型", WIDTH: 100, ALIGN: "center", VTYPE: "exNum", OTHER: '[{"LABEL":"平台","VALUE":"0"},{"LABEL":"司机","VALUE":"1"},{"LABEL":"承运商","VALUE":"2"},{"LABEL":"供应商","VALUE":"3"},{"LABEL":"客户","VALUE":"4"}]' },
  { FIELD: "MOBILE", LABEL: "手机号", WIDTH: 120, ALIGN: "center", },
  { FIELD: "DEPTNAME", LABEL: "部门", WIDTH: 100, ALIGN: "center", },
  { FIELD: "USERGROUPNAME", LABEL: "分组", WIDTH: 100, ALIGN: "center", },
  { FIELD: "ORGNAME", LABEL: "组织", WIDTH: 200, ALIGN: "left", },
  // { FIELD: "ROLENAME", LABEL: "角色", WIDTH: 100, ALIGN: "left", },
  { FIELD: "BILLSTATUS", LABEL: "状态", WIDTH: 100, ALIGN: "center", VTYPE: "exNum", OTHER: '[{"LABEL":"停用","VALUE":"0","COLOR":"danger"},{"LABEL":"正常","VALUE":"1","COLOR":"primary"},{"LABEL":"锁定","VALUE":"2","COLOR":"danger"}, {"LABEL":"黑名单","VALUE":"3","COLOR":"danger"}, {"LABEL":"删除","VALUE":"4","COLOR":"danger"}]' },
]

