import request from '@/utils/request'

export function WFList(data) {
  return request({
    url: "/base/processDefinition/list",
    method: "post",
    data
  })
}

export function WFAdd(data) {
  return request({
    url: "/base/vue3/jsonToBpmn",
    method: "post",
    data
  })
}

export function WFDetail(id) {
  return request({
    url: "/base/processDefinition/detail",
    method: "post",
    data: {
      DEPLOYMENTID: id
    }
  })
}

export function WFDelete(id) {
  return request({
    url: "/base/processDefinition/remove",
    method: "post",
    data: {
      DEPLOYMENTID: id
    }
  })
}

export const BaseWorkFlowData = {
  "tableId": 1,
  "workFlowDef": {
    "name": "",
    "VCODE": "",
    "menuId": "",
    "menuName": "",
    "pageId": ""
  },
  "directorMaxLevel": 4,
  "flowPermission": [],
  "nodeConfig": {
    "nodeName": "发起人",
    "type": 0,
    "priorityLevel": "",
    "settype": "",
    "selectMode": "",
    "selectRange": "",
    "directorLevel": "",
    "examineMode": "",
    "noHanderAction": "",
    "examineEndDirectorLevel": "",
    "ccSelfSelectFlag": "",
    "conditionList": [],
    "nodeUserList": [],
    "childNode": {
      "nodeName": "审核人",
      "error": false,
      "type": 1,
      "settype": 1,
      "selectMode": 0,
      "selectRange": 0,
      "directorLevel": 1,
      "examineMode": 1,
      "noHanderAction": 1,
      "examineEndDirectorLevel": 0,
      "childNode": {},
      "nodeUserList": []
    },
    "conditionNodes": []
  }
}

export const TableConfig = [
  { FIELD: "NAME", LABEL: "名称", WIDTH: 150, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "MENUNAME", LABEL: "关联菜单", WIDTH: 150, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "SUSPENDSTATE", LABEL: "状态", WIDTH: 100, ALIGN: "center", VTYPE: "exNum", OTHER: '[{"LABEL":"启用","VALUE":"1"},{"LABEL":"停用","VALUE":"2"}]', ISSHOW: 1, SELECTEDFLAG: 1 },
  { FIELD: "DEPLOYMENTTIME", LABEL: "部署时间", WIDTH: 160, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
]
