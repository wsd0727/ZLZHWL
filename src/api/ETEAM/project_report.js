/**
 *  协同平台 项目报工
 * @piplns 2023-04-21
 */

import request from '@/utils/request'

// 报工日历数据
export function reportWorkList(data) {
  return request({
    url: "/workclockpunch/getWorkClockPunchAmount",
    method: "post",
    data
  })
}

// 报工日历数据详情
export function reportWorkDetail(data) {
  return request({
    url: "/workclockpunch/getWorkPunchTaskDetail",
    method: "post",
    data
  })
}

// 报工详情 日志
export function reportWorkLog(data) {
  return request({
    url: "",
    method: "post",
    data
  })
}

// 新增
export function reportWorkAdd(data) {
  return request({
    url: "/workclockpunch/createWorkClockPunch",
    method: "post",
    data
  })
}

// 编辑
export function reportWorkEdit(data) {
  return request({
    url: "/workclockpunch/task/update",
    method: "post",
    data
  })
}

// 作废
export function reportWorkDelete(data) {
  return request({
    url: "/workclockpunch/deleteWorkClockPunch",
    method: "post",
    data
  })
}

// 项目列表
export function projectList(data) {
  return request({
    url: "/workclockpunch/getUserWorkClockPunchProjs",
    method: "post",
    data
  })
}

// 获取项目团队人员
export function getProjeftUsers(data) {
  return request({
    url: "/workclockpunch/getTmUserGroupByProj",
    method: "post",
    data
  })
}

// 检索用户
export function getUsers(data) {
  return request({
    url: "/workclockpunch/getUserByName",
    method: "post",
    data
  })
}

// 部门列表
export function getDept(data) {
  return request({
    url: "/workclockpunch/getUserGroupByDept",
    method: "post",
    data
  })
}
// 获取部门人员
export function getDeptUsers(data) {
  return request({
    url: "",
    method: "post",
    data
  })
}

// 更改任务关联人
export function setWorkUsers(data) {
  return request({
    url: "/workclockpunch/taskRelatedUser/update",
    method: "post",
    data
  })
}

// 删除任务关联人
export function delWorkUser(data) {
  return request({
    url: "/workclockpunch/taskRelatedUser/delete",
    method: "post",
    data
  })
}

// 获取操作记录
export function getWorkLog(data) {
  return request({
    url: "/workclockpunch/taskOpRecord/query",
    method: "post",
    data
  })
}

export const taskStatus = [
  { LABEL: "未完成", VALUE: "0", COLOR: "info" },
  { LABEL: "已完成", VALUE: "1", COLOR: "success" },
]

export const taskPriority = [
  { LABEL: "非常紧急", VALUE: "1", COLOR: "danger" },
  { LABEL: "紧急", VALUE: "2", COLOR: "warning" },
  { LABEL: "普通", VALUE: "3", COLOR: "primary" },
  { LABEL: "较低", VALUE: "4", COLOR: "info" },
]

export const FormConfig = [
  { SORTCODE: 1, FIELD: "projNo", LABEL: "项目", COL: 24, CONTROLS: "ExSelectSearch", ISREQUIRE: 1, ISSHOW: 1, OTHER: "/workclockpunch/getUserWorkClockPunchProjs???projName=LABEL", REVERFIELD: "projName" },
  { SORTCODE: 2, FIELD: "taskPriority", LABEL: "优先级", COL: 24, CONTROLS: "ExSelect", ISREQUIRE: 0, ISSHOW: 0, OTHER: JSON.stringify(taskPriority), DEFAULTVAL: "3" },
  { SORTCODE: 3, FIELD: "taskName", LABEL: "任务", COL: 24, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
  { SORTCODE: 4, FIELD: "laborHour", LABEL: "工时", COL: 24, CONTROLS: "slot", ISREQUIRE: 1, ISSHOW: 1, MAXLENGTH: "8", SLOTCFG: '{"min":"0.5","POINT":"1"}' },
  { SORTCODE: 5, FIELD: "punchDate", LABEL: "时间", COL: 24, CONTROLS: "ExDate", ISREQUIRE: 0, ISDISABLED: 1, ISSHOW: 1, DEFAULTVAL: "", OTHER: '{"minVar":"-6","maxVar":"-1"}' },
  { SORTCODE: 6, FIELD: "workProgress", LABEL: "工作进展", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 0, ISSHOW: 1, MAXLENGTH: "200" },
  { FIELD: "punchUserNo", LABEL: "", ISSHOW: 0, DEFAULTVAL: "U$BILLNO" },
  { FIELD: "punchUserName", LABEL: "", ISSHOW: 0, DEFAULTVAL: "U$USERNAME" },
]