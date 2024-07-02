import request from '@/utils/request'

/** 获取片区 */
export function getAreaData(data) {
  return request({
    url: "/base/bd-area/getTreeList",
    method: "post",
    data
  })
}

/** 模式发货量 */
export function getMSfhl(data) {
  return request({
    url: "/oms/shipped/trend/percentage",
    method: "post",
    data
  })
}

/** kpi */
export function getKPI(data) {
  return request({
    url: "/oms/shipped/trend/KPI",
    method: "post",
    data
  })
}

/** 超时订单 */
export function getCSDDAPI(data) {
  return request({
    url: "/oms/shipped/trend/timeout",
    method: "post",
    data
  })
}

/** 年发货量 */
export function getYearSend(data) {
  return request({
    url: "/oms/shipped/trend/compare",
    method: "post",
    data
  })
}

/** 月发货量 */
export function getMonthSend(data) {
  return request({
    url: "/oms/shipped/trend/compareMonth",
    method: "post",
    data
  })
}

/** 客户发货量 */
export function getKHSend(data) {
  return request({
    url: "/oms/shipped/trend/custom",
    method: "post",
    data
  })
}

/** 片区发货量 */
export function getPQSend(data) {
  return request({
    url: "/oms/shipped/trend/area",
    method: "post",
    data
  })
}

/** 纸种发货量 */
export function getZZSend(data) {
  return request({
    url: "/oms/shipped/trend/matclass",
    method: "post",
    data
  })
}