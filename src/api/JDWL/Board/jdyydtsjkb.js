import request from '@/utils/request'

// 实时运力
export function getSSYL(data) {
  return request({
    url: "/bms/bmsBoard/boardOperationalDynamicDataRealTimeCapacity",
    method: "post",
    data
  })
}

// 片区车辆
export function getPQCL(data) {
  return request({
    url: "/bms/bmsBoard/boardOperationalAreaCars",
    method: "post",
    data
  })
}

// 运力模式
export function getYLMS(data) {
  return request({
    url: "/bms/bmsBoard/boardOperationalDynamicCapacityMode",
    method: "post",
    data
  })
}

// 车辆状态
export function getCLZT(data) {
  return request({
    url: "/bms/bmsBoard/boardOperationalDynamicCarStatus",
    method: "post",
    data
  })
}

// 基地数据
export function getJDDATA(data) {
  return request({
    url: "/bms/bmsBoard/boardOperationalDynamicDataJdData",
    method: "post",
    data
  })
}