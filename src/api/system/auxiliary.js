import request from '@/utils/request'
import { ENABLESTATE, SWITCH, DEVICE } from "@/config"
import md5 from "@/utils/md5"

// 查询用户列表
export function mateList(data) {
  return request({
    url: '/base/matedoc/getMatedocByClass',
    method: 'post',
    data
  })
}
// 查询右侧列表
export function rightList(data) {
  return request({
    url: '/base/matedocv/getMatedocvByMatedoc',
    method: 'post',
    data
  })
}

// 查询物料详细
export function mateDetail(data) {
  return request({
    url: '/base/matedoc/getDetail',
    method: "post",
    data
  })
}
// 查询右侧物料详细
export function mateRightDetail(data) {
  return request({
    url: '/base/matedocv/getDetail',
    method: "post",
    data
  })
}

// 新增物料
export function addauxli(data) {
  return request({
    url: '/base/matedoc/add',
    method: 'post',
    data: data
  })
}
// 新增右侧物料
export function addRightauxli(data) {
  return request({
    url: '/base/matedocv/add',
    method: 'post',
    data: data
  })
}

// 修改物料
export function editauxli(data) {
  delete data.PASSWORD
  return request({
    url: '/base/matedoc/update',
    method: "post",
    data
  })
}

// 修改右侧物料
export function editrightauxli(data) {
  delete data.PASSWORD
  return request({
    url: '/base/matedocv/update',
    method: "post",
    data
  })
}

// 删除物料
export function delauxli(data) {
  return request({
    url: '/base/matedoc/delete',
    method: 'post',
    data
  })
}
// 删除右边物料
export function delRightauxli(data) {
  return request({
    url: '/base/matedocv/delete',
    method: 'post',
    data
  })
}

// 用户状态修改
export function statusUser(data) {
  /** BILLSTATUS
   * 101-未启用
102-启用
103-停用 
104-作废
105-黑名单
106-恢复黑名单
107-审核
108-驳回
109-锁定
110-解锁
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
    url: '/base/matclass/getTreeList',
    method: 'post',
    data: {}
  })
}

// 下面没对接

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}



// 物料中间表单配置
export const FormConfig = [
  { FIELD: "VNAME", LABEL: "姓名", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { FIELD: "MATCLASS", LABEL: "物料分类", COL: 12, CONTROLS: "ExSelectGroup", ISREQUIRE: 1, ISSHOW: 1, OTHER: "/base/matclass/getTreeList???MATCLASSNAME=LABEL&MATCLASS=VALUE", REVERFIELD: 'MATCLASSNAME', LINKAGE: "{\"CLEAN\":\"PK_DEPT\"}"},
  { FIELD: "VCODE", LABEL: "编码", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { FIELD: "BILLFROM", LABEL: "数据来源", COL: 12, CONTROLS: "ExSelect", ISREQUIRE: 1, ISSHOW: 1, OTHER: '[{"LABEL":"平台","VALUE":"0"},{"LABEL":"手机","VALUE":"1"},{"LABEL":"客商","VALUE":"2"},{"LABEL":"第三方","VALUE":"3"}]', DEFAULTVAL: "0" },
  { FIELD: "SPELLCODE", LABEL: "助记码", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { FIELD: "ENAME", LABEL: "英文名称", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { FIELD: "SHORTNAME", LABEL: "简称", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { FIELD: "ENABLESTATE", LABEL: "启用", COL: 12, CONTROLS: "ExSelect", ISREQUIRE: 1, ISSHOW: 1, OTHER: '[{"LABEL":"启用","VALUE":"0"},{"LABEL":"未启用","VALUE":"1"},{"LABEL":"停用","VALUE":"2"}]', DEFAULTVAL: "0" },
]
// 物料右侧表单配置
export const RighrFormConfig = [
  { FIELD: "VNAME", LABEL: "名称", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { FIELD: "VVALUE", LABEL: "值", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { FIELD: "VCODE", LABEL: "编码", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { FIELD: "ENABLESTATE", LABEL: "启用", COL: 12, CONTROLS: "ExSelect", ISREQUIRE: 1, ISSHOW: 1, OTHER: '[{"LABEL":"启用","VALUE":"0"},{"LABEL":"未启用","VALUE":"1"},{"LABEL":"停用","VALUE":"2"}]', DEFAULTVAL: "0" },
  { FIELD: "SHORTNAME", LABEL: "简称", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { FIELD: "ENAME", LABEL: "英文名称", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
]

// 重置密码表单配置
export const PWDConfig = [
  { FIELD: "USERNAME", LABEL: "账号", COL: 24, CONTROLS: "ExReadCard", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { FIELD: "NEWPASSWORD", LABEL: "新密码", COL: 24, CONTROLS: "ExPassword", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { FIELD: "SUREPASSWORD", LABEL: "确认新密码", COL: 24, CONTROLS: "ExPassword", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
]

export const TableConfig = [
  { FIELD: "VNAME", LABEL: "姓名", WIDTH: 100, ALIGN: "center", },
  { FIELD: "VCODE", LABEL: "编码", WIDTH: 100, ALIGN: "center", },
  { FIELD: "MATCLASSNAME", LABEL: "物料分类", WIDTH: 150, ALIGN: "center", },
  { FIELD: "BILLFROM", LABEL: "数据来源", WIDTH: 100, ALIGN: "center", VTYPE: "exNum", OTHER: '[{"LABEL":"平台","VALUE":"0"},{"LABEL":"手机","VALUE":"1"},{"LABEL":"客商","VALUE":"2"},{"LABEL":"第三方","VALUE":"3"}]' },
  { FIELD: "SPELLCODE", LABEL: "助记码", WIDTH: 100, ALIGN: "center", },
  { FIELD: "ENAME", LABEL: "英文名称", WIDTH: 100, ALIGN: "center", },
  { FIELD: "SHORTNAME", LABEL: "简称", WIDTH: 100, ALIGN: "center", },
  { FIELD: "ENABLESTATE", LABEL: "启用", WIDTH: 100, ALIGN: "center", VTYPE: "exNum", OTHER: '[{"LABEL":"启用","VALUE":"0","COLOR":"primary"},{"LABEL":"未启用","VALUE":"1","COLOR":"danger"},{"LABEL":"停用","VALUE":"2","COLOR":"danger"}]' },
  { FIELD: "CREATIONTIME", LABEL: "创建时间", WIDTH: 140, ALIGN: "center", },
]
export const rightTableConfig = [
  { FIELD: "VNAME", LABEL: "名称", WIDTH: 100, ALIGN: "center", },
  { FIELD: "VVALUE", LABEL: "值", WIDTH: 100, ALIGN: "center", },
  { FIELD: "VCODE", LABEL: "编码", WIDTH: 100, ALIGN: "center", },
  { FIELD: "ENABLESTATE", LABEL: "启用状态", WIDTH: 100, ALIGN: "center", VTYPE: "exNum", OTHER: '[{"LABEL":"未启用","VALUE":"1"},{"LABEL":"启用","VALUE":"0"},{"LABEL":"停用","VALUE":"2"}]' },
  { FIELD: "SHORTNAME", LABEL: "简称", WIDTH: 100, ALIGN: "center", },
  { FIELD: "ENAME", LABEL: "英文名称", WIDTH: 100, ALIGN: "center", },
  { FIELD: "CREATIONTIME", LABEL: "创建时间", WIDTH: 140, ALIGN: "center", },
]
