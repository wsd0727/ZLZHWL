import request from '@/utils/request'

// 部门接口------------------------

//列表接口
export function deptList(data) {
  return request({
    url: '/sys/department/getPageList',
    method: 'post',
    data
  })
}
//新增保存
export function deptListAdd(data) {
  return request({
    url: '/sys/department/add',
    method: 'post',
    data
  })
}
//详情接口
export function deptFormDetail(data) {
  return request({
    url: '/sys/department/getDetail',
    method: 'post',
    data
  })
}
//编辑保存接口
export function deptFormUpdate(data) {
  return request({
    url: '/sys/department/update',
    method: 'post',
    data
  })
}
//删除接口
export function deleteFormDelete(data) {
  return request({
    url: '/sys/department/deleteBatchIds',
    method: 'post',
    data
  })
}

export const FormConfig = [
  { SORTCODE: 1, FIELD: "BILLNO", LABEL: "部门编号", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { SORTCODE: 2, FIELD: "VNAME", LABEL: "部门名称", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { SORTCODE: 3, FIELD: "PK_ORG", LABEL: "所属组织名称", COL: 12, CONTROLS: "ExSelectGroup", ISREQUIRE: 1, ISSHOW: 1, OTHER: '/sys/organize/getTreeList???PK_ORGNAME=LABEL&PK_ORG=VALUE', DEFAULTVAL: "" },
  { SORTCODE: 4, FIELD: "PARENTID", LABEL: "上级部门", COL: 12, CONTROLS: "ExSelectGroup", ISREQUIRE: 0, ISSHOW: 1, OTHER: '/sys/department/getTreeList???PARENTNAME=LABEL&PARENTID=VALUE', DEFAULTVAL: "" },
  { SORTCODE: 5, FIELD: "MANAGER", LABEL: "联系人", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 0, ISSHOW: 1, OTHER: '', DEFAULTVAL: "" },
  { SORTCODE: 6, FIELD: "OUTERPHONE", LABEL: "联系电话", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: '', DEFAULTVAL: "" },
  { SORTCODE: 7, FIELD: "EMAIL", LABEL: "电子邮箱", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 0, ISSHOW: 1, OTHER: '', DEFAULTVAL: "" },
  { SORTCODE: 8, FIELD: "ENABLESTATE", LABEL: "启用状态", COL: 12, CONTROLS: "ExRadio", ISREQUIRE: 0, ISSHOW: 1, OTHER: '[{"LABEL":"未启用","VALUE":"0"},{"LABEL":"启用","VALUE":"1"},{"LABEL":"停用","VALUE":"2"}]', DEFAULTVAL: "0" },
  { SORTCODE: 9, FIELD: "VMEMO", LABEL: "备注", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 0, ISSHOW: 1, OTHER: '', DEFAULTVAL: "" },





]

