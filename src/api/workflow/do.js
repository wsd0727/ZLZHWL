import request from '@/utils/request'

// 我发起的审批
export function applyDoList(data) {
  return request({
    url: "/base/eTask/process/applyList",
    method: "post",
    data
  })
}

// 待办
export function waitDoList(data) {
  return request({
    url: "/base/eTask/process/toDoList",
    method: "post",
    data
  })
}

// 获取待办数量
export function getWaitDoNum() {
  return request({
    url: "/base/eTask/process/toDoList/count",
    method: "post",
    data: {}
  })
}

// 已办
export function outDoList(data) {
  return request({
    url: "/base/eTask/process/doneList",
    method: "post",
    data
  })
}

// 流程详情
export function detailDo(id) {
  return request({
    url: "/base/eTask/process/instanceInfo",
    method: "post",
    data: {
      PROCESSINSTANCEID: id
    }
  })
}

// 同意审批
export function enterDo(data) {
  return request({
    url: "/base/eTask/agree",
    method: "post",
    data
  })
}

// 驳回审批
export function cancelDo(data) {
  return request({
    url: "/base/eTask/refuse",
    method: "post",
    data
  })
}

export const doStatusDict = [
  { COLOR: "primary", LABEL: "处理中", VALUE: "1" },
  { COLOR: "info", LABEL: "撤销", VALUE: "2" },
  { COLOR: "danger", LABEL: "驳回", VALUE: "3" },
  { COLOR: "success", LABEL: "已结束", VALUE: "4" },
]

export const outDoTableConfig = [
  { FIELD: "BUSINESSKEY", LABEL: "单据编码", WIDTH: 150, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "MENUNAME", LABEL: "类型", WIDTH: 100, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "BUSINESSNAME", LABEL: "名称", WIDTH: 150, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "BUSINESSSTATUS", LABEL: "状态", WIDTH: 100, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1, VTYPE: "exNumLink", OTHER: JSON.stringify(doStatusDict) },
  { FIELD: "STARTUSERNAME", LABEL: "发起人", WIDTH: 150, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "STARTTIME", LABEL: "发起时间", WIDTH: 150, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
]

export const waitDoTableConfig = [
  { FIELD: "BUSINESSKEY", LABEL: "单据编码", WIDTH: 150, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "MENUNAME", LABEL: "类型", WIDTH: 100, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "BUSINESSNAME", LABEL: "名称", WIDTH: 150, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "BUSINESSSTATUS", LABEL: "状态", WIDTH: 100, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1, VTYPE: "exNumLink", OTHER: JSON.stringify(doStatusDict) },
  { FIELD: "STARTUSERNAME", LABEL: "发起人", WIDTH: 150, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "STARTTIME", LABEL: "发起时间", WIDTH: 150, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
]

export const applyDoTableConfig = [
  { FIELD: "BUSINESSKEY", LABEL: "单据编码", WIDTH: 150, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "MENUNAME", LABEL: "类型", WIDTH: 100, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "BUSINESSNAME", LABEL: "名称", WIDTH: 150, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "BUSINESSSTATUS", LABEL: "状态", WIDTH: 100, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1, VTYPE: "exNumLink", OTHER: JSON.stringify(doStatusDict) },
  { FIELD: "STARTTIME", LABEL: "发起时间", WIDTH: 150, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "ENDTIME", LABEL: "办结时间", WIDTH: 150, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
]