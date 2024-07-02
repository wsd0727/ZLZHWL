import request from '@/utils/request'

/** 获取 物料类别 */
export function getTYPES() {
  return request({
    url: "/bms/bmsBoard/boardSunManagementSel",
    method: "post",
    data: {}
  })
}

/** 获取发货量 */
export function getFHL(data) {
  return request({
    url: "/bms/bmsBoard/boardSunManagementDeliverNum",
    method: "post",
    data: data
  })
}

/** 获取营业额 */
export function getYYE(data) {
  return request({
    url: "/bms/bmsBoard/boardSunManagementBusiness",
    method: "post",
    data: data
  })
}

/** 获取毛利润 */
export function getMLL(data) {
  return request({
    url: "/bms/bmsBoard/grossLr",
    method: "post",
    data: data
  })
}

/** 获取失败成本 */
export function getSBCB(data) {
  return request({
    url: "/bms/bmsBoard/boardSunManagementFailureCost",
    method: "post",
    data: data
  })
}

/** 获取经营模式 */
export function getJYMS(data) {
  return request({
    url: "/bms/bmsBoard/boardSunManagementSettlementMode",
    method: "post",
    data: data
  })
}

/** 获取成本监控 */
export function getCBJK(data) {
  return request({
    url: "/bms/bmsBoard/boardSunManagementCostMonitoring",
    method: "post",
    data: data
  })
}