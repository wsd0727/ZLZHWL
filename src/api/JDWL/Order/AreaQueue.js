import request from '@/utils/request'

/** 获取排队中车辆 */
export function getQueueAPI(data) {
  return request({
    url: "/oms/dd-rep-car/selCarList",
    method: "post",
    data
  })
}

/** 拖拽更新 */
export function upodateQueue(data) {
  return request({
    url: "/oms/dd-rep-car/updateLineSort",
    method: "post",
    data
  })
}

/** 推送App */
export function sendPhoneAPI(data) {
  return request({
    url: "/oms/app/reportingNum/toApp",
    method: "post",
    data
  })
}

/** 开启选单 */
export function startOrderAPI(data) {
  return request({
    url: "/oms/od-order-verb/startMenu",
    method: "post",
    data
  })
}

/** 无单结束 */
export function noOrderEndAPI(data) {
  return request({
    url: "/oms/od-order-verb/stopMenu",
    method: "post",
    data
  })
}

/** 查询条件配置 */
export const QueryConfig = [
  { LABEL: "片区", FIELD: "AREA", CONTROLS: "ExSelectGroup", COL: 6, ISSHOW: 1, SLOT: 1, DEFAULTVAL: "auto", GROUPID: '1', OTHER: "/base/bd-area/getTreeList???AREA=LABEL&PK_AREA=VALUE" },
  { LABEL: "车号", FIELD: "CARNO", CONTROLS: "ExTextBox", COL: 6, ISSHOW: 1, DEFAULTVAL: "", GROUPID: '1' },
  { LABEL: "车主", FIELD: "OWNER", CONTROLS: "ExSelectSearch", COL: 6, ISSHOW: 1, SLOT: 1, DEFAULTVAL: "", GROUPID: '1', OTHER: "/base/cars/owner???PK_OWNER=VALUE&OWNER=LABEL" },
  { LABEL: "片区", FIELD: "PK_AREA", CONTROLS: "ExTextBox", COL: 6, ISSHOW: 0, DEFAULTVAL: "", GROUPID: '1' },
  { LABEL: "车主", FIELD: "PK_OWNER", CONTROLS: "ExTextBox", COL: 6, ISSHOW: 0, DEFAULTVAL: "", GROUPID: '1' },
]

/** 获取选单详情数据 */
export function getList(data) {
  return request({
    url: "/oms/app/selectionPool/selCarNoAll",
    method: "post",
    data
  })
}
/** xxx 正在选单 */
export function getInfo(data) {
  return request({
    url: "/oms/app/selectionPool/selCarNo",
    method: "post",
    data
  })
}
/** 选单倒计时 */
export function getEndTime(data) {
  return request({
    url: "/oms/app/selectionPool/selCarNoTime",
    method: "post",
    data
  })
}
/** 获取片区 */
export function getAreaData(data) {
  return request({
    url: "/base/bd-area/getTreeList",
    method: "post",
    data
  })
}

/** 过号 */
export function getOverTime(data) {
  return request({
    url: "/oms/app/selectionPool/overDdNumbered",
    method: "post",
    data
  })
}