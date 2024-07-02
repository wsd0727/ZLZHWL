import request from '@/utils/request'

// 基地
export function getORG() {
  return request({
    url: "/bms/bmsBoard/boardGroupList",
    method: "post",
    data: {}
  })
}

// 顶部数字
export function WtdNUMS(data) {
  return request({
    url: '/bms/bmsBoard/boardProBlemNumber',
    method: 'post',
    data
  })
}

// 承运商排名
export function WtdCYS(data) {
  return request({
    url: '/bms/bmsBoard/boardProBlemCarrier',
    method: 'post',
    data
  })
}

// 客户占比
export function WtdKH(data) {
  return request({
    url: '/bms/bmsBoard/boardProBlemCustomer',
    method: 'post',
    data
  })
}

// 问题单类型
export function WtdTYPES(data) {
  return request({
    url: '/bms/bmsBoard/boardProBlemTypeNumber',
    method: 'post',
    data
  })
}

// 到达地占比
export function WtdDDD(data) {
  return request({
    url: '/bms/bmsBoard/boardProBlemDestination',
    method: 'post',
    data
  })
}

// 问题单片区
export function WtdAREA(data) {
  return request({
    url: '/bms/bmsBoard/boardProBlemArea',
    method: 'post',
    data
  })
}

// 发生趋势
export function WtdQS(data) {
  return request({
    url: '/bms/bmsBoard/boardProBlemTrend',
    method: 'post',
    data
  })
}