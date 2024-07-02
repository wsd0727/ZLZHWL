import request from '@/utils/request'
import { ENABLESTATE, SWITCH, DEVICE } from "@/config"
import md5 from "@/utils/md5"

// 查询用户列表
export function UserList(data) {
  return request({
    url: '/sys/user/getPageList',
    method: 'post',
    data
  })
}

// 查询用户详细
export function UserDetail(data) {
  return request({
    url: '/sys/user/getDetail',
    method: "post",
    data
  })
}

// 新增用户
export function addUser(data) {
  let { PASSWORD } = data
  data.PASSWORD = md5.hex_md5(PASSWORD)
  data.BILLSTATUS = '1'
  return request({
    url: '/sys/user/add',
    method: 'post',
    data: data
  })
}

// 修改用户
export function editUser(data) {
  delete data.PASSWORD
  return request({
    url: '/sys/user/update',
    method: "post",
    data
  })
}

// 删除用户
export function delUser(data) {
  return request({
    url: '/sys/user/deleteBatchIds',
    method: 'post',
    data
  })
}

// 用户状态修改
export function statusUser(data) {
  /** BILLSTATUS
    * 0 - 停用
    * 1 - 启用
    * 2- 锁定
   */
  return request({
    url: "/sys/user/updateStatus",
    method: "post",
    data
  })
}

// 查询授权角色
export function getAuthRole(data) {
  return request({
    url: '/sys/userMenu/getDetail',
    method: 'post',
    data
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: '/sys/userMenu/add',
    method: 'post',
    data
  })
}

// 用户密码重置
export function updateUserPwd(data) {
  let { NEWPASSWORD, SUREPASSWORD } = data
  data.NEWPASSWORD = md5.hex_md5(NEWPASSWORD)
  data.SUREPASSWORD = md5.hex_md5(SUREPASSWORD)
  return request({
    url: '/sys/user/reset',
    method: 'post',
    data
  })
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/sys/organize/getDepTreeList',
    method: 'post',
    data: {}
  })
}

// 用户片区
export function getGROUP(data) {
  return request({
    url: "/base/bd-area/getTreeList",
    method: "post",
    data
  })
}

// 下面没对接

// 查询用户个人信息
export function getUserProfile(data) {
  return request({
    url: '/sys/user/getUserAccountInfo',
    method: 'post',
    data
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/sys/user/uploadHead',
    method: 'post',
    data: data
  })
}
// 
export function restUserPwd(data) {
  let { OLDPASSWORD, NEWPASSWORD } = data
  data.OLDPASSWORD = md5.hex_md5(OLDPASSWORD)
  data.NEWPASSWORD = md5.hex_md5(NEWPASSWORD)
  return request({
    url: '/sys/user/modifyPwd',
    method: 'post',
    data: data
  })
}

// 用户表单配置
export const FormConfig = [
  { FIELD: "PK_ORG", LABEL: "组织", COL: 12, CONTROLS: "ExSelectGroup", ISREQUIRE: 1, ISSHOW: 1, OTHER: "/sys/organize/getTreeList???ORGNAME=LABEL", LINKAGE: "{\"CLEAN\":\"PK_DEPT,DEPTNAME,PK_USERGROUP\"}", REVERFIELD: "ORGNAME" },
  { FIELD: "PK_DEPT", LABEL: "部门", COL: 12, CONTROLS: "ExSelectGroup", ISREQUIRE: 1, ISSHOW: 1, OTHER: "/sys/department/getDepartmentTreeList??PK_ORG=PK_ORG?DEPTNAME=LABEL", REVERFIELD: "DEPTNAME" },
  { FIELD: "VNAME", LABEL: "姓名", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "", MAXLENGTH: "20" },
  { FIELD: "VSEX", LABEL: "性别", COL: 12, CONTROLS: "ExRadio", ISREQUIRE: 1, ISSHOW: 1, OTHER: '[{"LABEL":"男","VALUE":"0"},{"LABEL":"女","VALUE":"1"}]' },
  { FIELD: "VTYPE", LABEL: "账户类型", COL: 12, CONTROLS: "ExReadCard", ISREQUIRE: 1, ISSHOW: 0, DEFAULTVAL: "0", OTHER: '[{"LABEL":"平台","VALUE":"0"},{"LABEL":"司机","VALUE":"1"},{"LABEL":"承运商","VALUE":"2"},{"LABEL":"供应商","VALUE":"3"},{"LABEL":"客户","VALUE":"4"}]', DEFAULTVAL: "0", LINKAGE: "{\"CLEAN\":\"PK_ROLE\"}" },
  { FIELD: "PK_ROLE", LABEL: "角色", COL: 12, CONTROLS: "ExSelectSearch", ISREQUIRE: 1, ISSHOW: 1, OTHER: "/sys/role/getList?VTYPE=0&ENABLESTATE=1?ROLENAME=LABEL", REVERFIELD: "ROLENAME" },
  { FIELD: "PK_USERGROUP", LABEL: "片区", COL: 12, CONTROLS: "slot", ISREQUIRE: 0, ISSHOW: 1, OTHER: "/base/bd-area/getTreeList???USERGROUPNAME=LABEL", MAXLENGTH: 0, REVERFIELD: "USERGROUPNAME" },
  { FIELD: "USERNAME", LABEL: "账号", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "", MAXLENGTH: "20" },
  { FIELD: "PASSWORD", LABEL: "密码", COL: 12, CONTROLS: "ExPassword", ISREQUIRE: 1, ISSHOW: 0, OTHER: "", MAXLENGTH: "30", RULES: 'Password' },
  { FIELD: "MOBILE", LABEL: "手机号", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, RULES: "Mobile", OTHER: "", MAXLENGTH: "11" },
  { FIELD: "IDCARDNO", LABEL: "身份证", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 0, ISSHOW: 1, RULES: "IdCard", OTHER: "18" },
  { FIELD: "EMAIL", LABEL: "邮箱", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 0, RULES: "Email", ISSHOW: 1, OTHER: "" },
  { FIELD: "VMEMO", LABEL: "备注", COL: 24, CONTROLS: "ExTextBox", MAXLENGTH: "200", ISSHOW: 1, OTHER: "" },
]

// 重置密码表单配置
export const PWDConfig = [
  { FIELD: "USERNAME", LABEL: "账号", COL: 24, CONTROLS: "ExReadCard", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { FIELD: "NEWPASSWORD", LABEL: "新密码", COL: 24, CONTROLS: "ExPassword", ISREQUIRE: 1, ISSHOW: 1, OTHER: "", RULES: 'Password' },
  { FIELD: "SUREPASSWORD", LABEL: "确认密码", COL: 24, CONTROLS: "ExPassword", ISREQUIRE: 1, ISSHOW: 1, OTHER: "", RULES: 'Password' },
]

export const TableConfig = [
  { FIELD: "VNAME", LABEL: "姓名", WIDTH: 100, ALIGN: "center", },
  { FIELD: "USERNAME", LABEL: "账号", WIDTH: 100, ALIGN: "left", },
  { FIELD: "VSEX", LABEL: "性别", WIDTH: 80, ALIGN: "center", VTYPE: "exNum", OTHER: '[{"LABEL":"男","VALUE":"0"},{"LABEL":"女","VALUE":"1"}]' },
  // { FIELD: "VTYPE", LABEL: "账户类型", WIDTH: 100, ALIGN: "center", VTYPE: "exNum", OTHER: '[{"LABEL":"平台","VALUE":"0"},{"LABEL":"司机","VALUE":"1"},{"LABEL":"承运商","VALUE":"2"},{"LABEL":"供应商","VALUE":"3"},{"LABEL":"客户","VALUE":"4"}]' },
  { FIELD: "MOBILE", LABEL: "手机号", WIDTH: 120, ALIGN: "center", },
  { FIELD: "DEPTNAME", LABEL: "部门", WIDTH: 100, ALIGN: "center", },
  { FIELD: "USERGROUPNAME", LABEL: "片区", WIDTH: 100, ALIGN: "center", },
  { FIELD: "ORGNAME", LABEL: "组织", WIDTH: 200, ALIGN: "left", },
  { FIELD: "ROLENAME", LABEL: "角色", WIDTH: 100, ALIGN: "left", },
  { FIELD: "BILLSTATUS", LABEL: "状态", WIDTH: 100, ALIGN: "center", VTYPE: "exNum", OTHER: '[{"LABEL":"停用","VALUE":"0","COLOR":"danger"},{"LABEL":"正常","VALUE":"1","COLOR":"primary"},{"LABEL":"锁定","VALUE":"2","COLOR":"danger"}, {"LABEL":"黑名单","VALUE":"3","COLOR":"danger"}, {"LABEL":"删除","VALUE":"4","COLOR":"danger"}]' },
  // { FIELD: "CREATIONTIME", LABEL: "创建时间", WIDTH: 140, ALIGN: "center", },
]
