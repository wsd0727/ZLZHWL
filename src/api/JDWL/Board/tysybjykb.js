import request from '@/utils/request'

/** 获取发货量 */
export function getFHL(data) {
  return request({
    url: "/bms/bmsBoard/boardSunBusinessDashDeliverNum",
    method: "post",
    data: data
  })
}

/** 获取逾期借款 */
export function getYQJK(data) {
  return request({
    url: "/bms/bmsBoard/boardSunBusinessDashOverdueLoans",
    method: "post",
    data: data
  })
}

/** 获取大额货损*/
export function getDEHS(data) {
  return request({
    url: "/bms/bmsBoard/boardSunBusinessDashLargeCargoDamage",
    method: "post",
    data: data
  })
}

/** 获取失败成本 */
export function getSBCB(data) {
  return request({
    url: "/bms/bmsBoard/boardSunBusinessDashFailureCost",
    method: "post",
    data: data
  })
}

/** 获取经营模式 */
export function getJYMS(data) {
  return request({
    url: "/bms/bmsBoard/boardSunBusinessDashSettlementMode",
    method: "post",
    data: data
  })
}

/** 获取成本监控 */
export function getCBJK(data) {
  return request({
    url: "/bms/bmsBoard/boardSunBusinessDashCostMonitoring",
    method: "post",
    data: data
  })
}