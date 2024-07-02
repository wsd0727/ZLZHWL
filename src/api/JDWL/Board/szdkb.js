import request from '@/utils/request'

// 基地
export function getORG() {
  return request({
    url: "/bms/bmsBoard/boardGroupList",
    method: "post",
    data: {}
  })
}

// 损纸数量
export function SzNums(data) {
  return request({
    url: "/bms/bmsBoard/boardDemageNumber",
    method: "post",
    data
  })
}

// 损纸金额
export function SzPrices(data) {
  return request({
    url: "/bms/bmsBoard/boardDemageMoney",
    method: "post",
    data
  })
}

// 损纸到达地
export function SzDDD(data) {
  return request({
    url: "/bms/bmsBoard/boardDemageDestination",
    method: "post",
    data
  })
}

// 损纸到达地
export function SzDDDTYPES(data) {
  return request({
    url: "/bms/bmsBoard/boardDemageTypeDestination",
    method: "post",
    data
  })
}

// 大客户占比
export function SzKhzb(data) {
  return request({
    url: "/bms/bmsBoard/boardDemageCustomer",
    method: "post",
    data
  })
}

// 大额损纸
export function SzDESZ(data) {
  return request({
    url: "/bms/bmsBoard/boardDemageLarge",
    method: "post",
    data
  })
}