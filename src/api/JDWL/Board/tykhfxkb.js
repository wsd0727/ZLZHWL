import request from '@/utils/request'

// 客户类别
export function getKHLB(data) {
  return request({
    url: '/bms/bmsBoard/boardSunCustomerType',
    method: 'post',
    data
  })
}

// 客户发货量
export function getKHFHL(data) {
  return request({
    url: '/bms/bmsBoard/boardSunCustomerCustomerShipmentVolume',
    method: 'post',
    data
  })
}

// 客户位置
export function getKHMAP(data) {
  return request({
    url: '/bms/bmsBoard/boardSunCustomerGps',
    method: 'post',
    data
  })
}

// 经销商
export function getJXS(data) {
  return request({
    url: '/bms/bmsBoard/boardSunCustomerDealer',
    method: 'post',
    data
  })
}

// 终端客户
export function getZDKH(data) {
  return request({
    url: '/bms/bmsBoard/boardSunCustomerEndCustomers',
    method: 'post',
    data
  })
}