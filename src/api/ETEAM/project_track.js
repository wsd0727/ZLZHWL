/**
 *  协同平台 项目跟踪功能 == 原协同平台 计划维护
 * @piplns 2023-03-24
 */
import request from '@/utils/request'

export function getProTree(data) {
  return request({
    url: "/bd-project/getProjectTree",
    method: "post",
    data
  })
}

export function getProStageTree(data) {
  return request({
    url: "/progress/plan/getPlanMaintenanceTree",
    method: "post",
    data
  })
}

export function getStageConfig(data) {
  return request({
    url: "/progress/plan/getPlanTemplateConfigDetail",
    method: "post",
    data
  })
}

export function getProDetail(data) {
  return request({
    url: "/progress/plan/getPlanMaintenanceDetail",
    method: "post",
    data
  })
}

export function saveProStage(data) {
  return request({
    url: "/progress/plan/planMaintenance",
    method: "post",
    data
  })
}

export function delProStageFile(data) {
  return request({
    url: "/progress/plan/maintainFileRemove",
    method: "post",
    data
  })
}


export const TableConfig = [
  { FIELD: "FILENAME", LABEL: "名称", WIDTH: "300", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: 1 },
  { FIELD: "FILESIZE", LABEL: "大小", WIDTH: "120", ALIGN: "right", VTYPE: "slot", ISSHOW: 1 },
  { FIELD: "CREATIONTIME", LABEL: "上传时间", WIDTH: "160", ALIGN: "center", CONTROLS: "ExTextBox", ISSHOW: 1 },
]