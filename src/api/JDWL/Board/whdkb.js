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
export function WhdNUMS(data) {
  return request({
    url: '/bms/bmsBoard/boardNoReceiptNumber',
    method: 'post',
    data
  })
}

// 类型
export function WhdTYPE(data) {
  return request({
    url: '/bms/bmsBoard/boardNoReceiptType',
    method: 'post',
    data
  })
}

// 片区
export function WhdAREA(data) {
  return request({
    url: '/bms/bmsBoard/boardNoReceiptArea',
    method: 'post',
    data
  })
}

// 承运商
export function WhdCYS(data) {
  return request({
    url: '/bms/bmsBoard/boardNoReceiptCarrier',
    method: 'post',
    data
  })
}

// 订单明细
export function WhdDETAIL(data) {
  return request({
    url: '/bms/bmsBoard/boardNoReceiptList',
    method: 'post',
    data
  })
}