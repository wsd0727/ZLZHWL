import request from '@/utils/request'

// 发货量
export function getFHL(data) {
  return request({
    url: '/bms/bmsBoard/boardSunBusinessOperationsDeliverNum',
    method: 'post',
    data
  })
}

// 实时运力
export function getSSYL(data) {
  return request({
    url: '/bms/bmsBoard/boardSunBusinessOperationsRealTimeCapacity',
    method: 'post',
    data
  })
}

// 车辆状态
export function getCLZT(data) {
  return request({
    url: '/bms/bmsBoard/boardSunBusinessOperationsCarStatus',
    method: 'post',
    data
  })
}

// 实时订单
export function getSSDD(data) {
  return request({
    url: '/bms/bmsBoard/boardSunBusinessOperationsRealTimeOrders',
    method: 'post',
    data
  })
}

// KPI出库指标
export function getKPICKZB(data) {
  return request({
    url: '/bms/bmsBoard/boardSunBusinessOperationsKpi',
    method: 'post',
    data
  })
}

// KPI出库指标详情
export function getKPICKZBXQ(data) {
  return request({
    url: '/bms/bmsBoard/boardSunBusinessOperationsKpiDetail',
    method: 'post',
    data
  })
}