import request from '@/utils/request'

// 获取发货量
export function getFHL(data) {
  return request({
    url: "/bms/bmsBoard/boardExternalProjectManagementDeliverNum",
    method: "post",
    data
  })
}

// 获取营业额
export function getYYE(data) {
  return request({
    url: "/bms/bmsBoard/boardExternalProjectManagementBusiness",
    method: "post",
    data
  })
}

// 获取毛利润
export function getMLR(data) {
  return request({
    url: "/bms/bmsBoard/boardExternalProjectManagementGrossProfit",
    method: "post",
    data
  })
}

// 获取运力模式
export function getYLMS(data) {
  return request({
    url: "/bms/bmsBoard/boardExternalProjectManagementCapacityMode",
    method: "post",
    data
  })
}

// 获取结算模式
export function getJSMS(data) {
  return request({
    url: "/bms/bmsBoard/boardExternalProjectManagementSettlementMode",
    method: "post",
    data
  })
}

// 获取成本监控
export function getCBJK(data) {
  return request({
    url: "/bms/bmsBoard/boardExternalProjectManagementCostMonitoring",
    method: "post",
    data
  })
}

// 获取应收款
export function getYSK(data) {
  return request({
    url: "/bms/bmsBoard/boardExternalProjectManagementAccountsReceivable",
    method: "post",
    data
  })
}

// 获取合作性质
export function getHZXZ(data) {
  return request({
    url: "/bms/bmsBoard/boardExternalProjectManagementNatureOfCooperation",
    method: "post",
    data
  })
}