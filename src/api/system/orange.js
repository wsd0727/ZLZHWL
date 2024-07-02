import request from '@/utils/request'
//列表接口
export function orangeList(data) {
  return request({
    url: '/sys/organize/getList',
    method: 'post',
    data
  })
}
//新增保存
export function orangeListAdd(data) {
  return request({
    url: '/sys/organize/add',
    method: 'post',
    data
  })
}
//详情接口
export function orangeFormDetail(data) {
  return request({
    url: '/sys/organize/findDetail',
    method: 'post',
    data
  })
}
//编辑保存接口
export function orangeFormUpdate(data) {
  return request({
    url: '/sys/organize/update',
    method: 'post',
    data
  })
}
//删除接口
export function orangeFormDelete(data) {
  return request({
    url: '/sys/organize/deleteBatchIds',
    method: 'post',
    data
  })
}

export const FormConfig = [
  { SORTCODE: 1, FIELD: "VNAME", LABEL: "公司名称", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { SORTCODE: 2, FIELD: "SHORTNAME", LABEL: "简称", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 0, ISSHOW: 1, OTHER: "" },
  { SORTCODE: 3, FIELD: "PARENTID", LABEL: "上级公司", COL: 12, CONTROLS: "ExSelectGroup", ISREQUIRE: 0, ISSHOW: 1, OTHER: '/sys/organize/getTreeList???PARENTNAME=LABEL&PARENTID=VALUE', DEFAULTVAL: "" },
  { SORTCODE: 4, FIELD: "ISPURORG", LABEL: "采购标识", COL: 12, CONTROLS: "ExRadio", ISREQUIRE: 1, ISSHOW: 1, OTHER: '[{"LABEL":"否","VALUE":"0"},{"LABEL":"是","VALUE":"1"}]', DEFAULTVAL: "0" },
  { SORTCODE: 5, FIELD: "ISSALEORG", LABEL: "销售标识", COL: 12, CONTROLS: "ExRadio", ISREQUIRE: 1, ISSHOW: 1, OTHER: '[{"LABEL":"否","VALUE":"0"},{"LABEL":"是","VALUE":"1"}]', DEFAULTVAL: "1" },
  { SORTCODE: 6, FIELD: "ISSTORORG", LABEL: "库存组织", COL: 12, CONTROLS: "ExRadio", ISREQUIRE: 0, ISSHOW: 1, OTHER: '[{"LABEL":"否","VALUE":"0"},{"LABEL":"是","VALUE":"1"}]', DEFAULTVAL: "0" },
  { SORTCODE: 7, FIELD: "MANAGER", LABEL: "负责人", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 0, ISSHOW: 1, OTHER: '', DEFAULTVAL: "" },
  { SORTCODE: 8, FIELD: "OUTERPHONE", LABEL: "联系电话", COL: 12, CONTROLS: "ExTextBox", ISREQUIRE: 0, ISSHOW: 1, OTHER: '', DEFAULTVAL: "" },
  { SORTCODE: 9, FIELD: "ENABLESTATE", LABEL: "启用标识", COL: 12, CONTROLS: "ExRadio", ISREQUIRE: 0, ISSHOW: 1, OTHER: '[{"LABEL":"未启用","VALUE":"0"},{"LABEL":"启用","VALUE":"1"},{"LABEL":"停用","VALUE":"2"}]', DEFAULTVAL: "0" },
  { SORTCODE: 10, FIELD: "VMEMO", LABEL: "备注", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 0, ISSHOW: 1, OTHER: '', DEFAULTVAL: "" },
]

